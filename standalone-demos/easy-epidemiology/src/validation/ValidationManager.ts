/**
 * ValidationManager.ts
 * Phase 1 – Core validation controller (Strict TS conversion)
 */

import { validateCell as _validateCell } from '@/store/utils/validation';
import { validateDataAsync } from '@/utils/asyncProcessor'; 
import { createWorkerSafely } from '@/utils/workerUtils';
import { useEpidemicStore } from '@/stores/epidemicStore';
import { GridHeader, GridRow } from '@/types/grid';
import { 
  getColumnUniqueKey, 
  getErrorKey, 
  parseErrorKey 
} from '@/components/DataInputVirtualScroll/utils/validationUtils';

// Sub-modules
import { ValidationErrorManager } from './ValidationErrorManager';
import { ValidationRowColumnOps } from './ValidationRowColumnOps';
import { ValidationDataOps } from './ValidationDataOps';
import { ValidationStructuralMapper } from './ValidationStructuralMapper';

// Define loose types for external utils not yet converted
// asyncProcessor and workerUtils might be JS still.
// We declare them here or expect shims.

export interface ValidationManagerOptions {
  debounceDelay?: number;
  chunkSize?: number | null;
  useWorker?: boolean;
  debug?: boolean;
  onProgress?: (progress: number) => void;
  showToast?: (message: string, type: 'success' | 'warning' | 'error' | 'info') => void;
  useAsyncProcessor?: boolean; 
  t?: any;
}

type EpidemicStore = ReturnType<typeof useEpidemicStore>;

export class ValidationManager {
  private store: EpidemicStore;
  private DEBOUNCE_DELAY: number;
  private defaultChunkSize: number | null;
  private useWorker: boolean;
  private onProgress: ((progress: number) => void) | null;
  private showToast: ((message: string, type: any) => void) | null;
  private t: any;
  private debug: boolean;
  private _destroyed: boolean;

  private errorManager: ValidationErrorManager;
  private rowColumnOps: ValidationRowColumnOps;
  private dataOps: ValidationDataOps;
  private structuralMapper: ValidationStructuralMapper;

  private validationTimers: Map<string, ReturnType<typeof setTimeout>>;
  private columnMetas: GridHeader[];
  private _worker: Worker | null = null;
  private _currentValidationTask: any = null; // Promise or Task object

  constructor(store: EpidemicStore, options: ValidationManagerOptions = {}) {
    if (!store) throw new Error('ValidationManager: Store instance required');

    this.store = store;

    const {
      debounceDelay = 300,
      chunkSize = null,
      useWorker = false,
      onProgress = null,
      debug = false,
      showToast = null,
      t = null
    } = options;

    this.DEBOUNCE_DELAY = debounceDelay;
    this.defaultChunkSize = chunkSize;
    this.useWorker = useWorker;
    this.onProgress = onProgress || null;
    this.showToast = showToast || null;
    this.t = t || null;
    this.debug = debug;
    this._destroyed = false;

    // Sub-modules
    this.errorManager = new ValidationErrorManager(store, { debug });
    this.rowColumnOps = new ValidationRowColumnOps(store, this.errorManager, { debug });
    this.dataOps = new ValidationDataOps(store, this.errorManager, { 
      debug, 
      onProgress: this.onProgress || undefined,
      showToast: this.showToast || undefined
    });
    this.structuralMapper = new ValidationStructuralMapper(store, this.errorManager, { debug });

    // Bind methods
    const boundValidateCell = this.validateCell.bind(this);
    const boundGetCellValue = this._getCellValue.bind(this);
    
    this.rowColumnOps.setValidateCellFn(boundValidateCell);
    this.rowColumnOps.setGetCellValueFn(boundGetCellValue);
    this.dataOps.setValidateCellFn(boundValidateCell);
    this.dataOps.setGetCellValueFn(boundGetCellValue);
    this.structuralMapper.setValidateCellFn(boundValidateCell);
    this.structuralMapper.setGetCellValueFn(boundGetCellValue);

    // Private access to errorManager inner map (or exposed method)
    // In legacy JS: this.validationTimers = this.errorManager.validationTimers;
    // ErrorManager in TS doesn't expose it publicly by default unless we accessor it, 
    // but we can add getters or just use methods.
    // Ideally we shouldn't access private property. 
    // We already replicated clearTimers etc.
    this.validationTimers = new Map(); // Placeholder, actual timers are in ErrorManager.
    // If we need direct access, we should fix ErrorManager visibility. 
    // For now we delegate.

    this.columnMetas = [];

    // Worker Setup
    if (this.useWorker) {
      this._worker = createWorkerSafely(new URL('./workers/validationWorker.ts', import.meta.url));
      
      if (this._worker) {
        this._worker.onmessage = (e: MessageEvent) => {
          if (this._destroyed) return;
          const { type, invalidCells, error } = e.data || {};
          if (type === 'error') {
            console.error('[ValidationManager worker]', error);
            return;
          }
          if (Array.isArray(invalidCells)) {
            this.errorManager.clearAllErrors();
            invalidCells.forEach(({ row, col, message }) => {
              const columnMeta = this.columnMetas.find(meta => meta.colIndex === col);
              if (columnMeta) {
                const uniqueKey = getColumnUniqueKey(columnMeta);
                if (uniqueKey) {
                    const errorKey = getErrorKey(row, uniqueKey);
                    this.store.addValidationErrorByUniqueKey({ errorKey, message });
                } else {
                    this.store.addValidationError({ rowIndex: row, colIndex: col, message });
                }
              } else {
                 this.store.addValidationError({ rowIndex: row, colIndex: col, message });
              }
            });
          }
        };
      } else {
        this.useWorker = false;
        if (this.debug) {
          console.log('[ValidationManager] Worker creation failed, using async processor');
        }
      }
    }
  }

  // Legacy Helpers
  getColumnUniqueKey = getColumnUniqueKey;
  getErrorKey = getErrorKey;
  parseErrorKey = parseErrorKey;

  createUniqueKeyMapping(columnMetas: GridHeader[]) {
    const mapping: Record<string, GridHeader> = {};
    columnMetas.forEach(meta => {
      const uniqueKey = this.getColumnUniqueKey(meta);
      if (uniqueKey) {
        mapping[uniqueKey] = meta;
      }
    });
    return mapping;
  }

  findColIndexByUniqueKey(uniqueKey: string, columnMetas: GridHeader[]): number | null {
    const meta = columnMetas.find(col => this.getColumnUniqueKey(col) === uniqueKey);
    return meta ? (meta.colIndex ?? null) : null;
  }

  migrateErrorsToUniqueKeys(columnMetas: GridHeader[]) {
    if (this.debug) console.log('[ValidationManager] 기존 에러를 고유 식별자 기반으로 마이그레이션 시작');

    // Access store directly carefully
    const currentErrors = this.store.validationState.errors;
    if (!currentErrors || currentErrors.size === 0) return;

    const newErrors = new Map<string, any>();
    let migratedCount = 0;
    let skippedCount = 0;
    let alreadyUniqueCount = 0;

    for (const [oldKey, error] of currentErrors) {
      const parsed = this.parseErrorKey(oldKey);
      if (parsed) { // Means it has unique key structure or row_unique format
         // Wait, parseErrorKey returns null if only 1 part.
         // If "row_uniqueKey", it returns {rowIndex, uniqueKey}. 
         // If "row_col", it parses "col" as uniqueKey if "_" logic holds.
         // But uniqueKey logic usually involves check:
         
         // Assuming old keys were row_col, which is what we want to migrate FROM.
         // row_col parsed: uniqueKey = col.
         // If col is number, it's not a unique key string (usually).
         
         // Logic in JS was: `if (parsed)`. But `parseErrorKey` just splits by `_`.
         // `row_10` -> rowIndex=row, uniqueKey="10".
         // Is "10" a unique key? No. 
         // We need robust check.
         
         // However, `ValidationManager.js` logic was:
         // `if (parsed) { ... alreadyUniqueCount++ }` -> Wait, that function returns object if successful split.
         // If `oldKey` is `0_1`, it splits to `0` and `1`.
         // JS Code: `if (parsed) { newErrors.set... continue }`
         // This implies ANY key with underscore was treated as valid unique key format in migration? 
         // Or `parseErrorKey` in JS has different logic?
         // JS: `const parts = errorKey.split('_'); if (parts.length < 2) return null; ... return {rowIndex, uniqueKey}`.
         // So `0_1` -> `rowIndex:0, uniqueKey:"1"`.
         // It seems the migration logic assumes if we CAN parse it using new logic, keep it?
         
         // NO. Look at JS code: 
         // `if (parsed) { ... continue }`
         // It assumes it IS a unique key if parseErrorKey works?
         // But later: `const parts = oldKey.split('_'); if (parts.length !== 2) ...`
         // If `0_1` passed `parseErrorKey`, it skips loop.
         // So `0_1` is NOT migrated. 
         // That implies migration effectively does nothing if all keys are `row_col` and `parseErrorKey` accepts them.
         // Unless `parseErrorKey` in JS checks if `uniqueKey` is actual unique key?? No.
         
         // Actually, I should probably stick to `ValidationManager.js` logic exactly or improve it.
         // If `0_1` is treated as "Already Unique", then migration fails to migrate `row_col` keys.
         // I'll assume the intention is:
         // If key looks like `row_col` (numerical col), convert to `row_uniqueKey`.
         // How to distinguish? `isNaN(uniqueKey)`.
         
         if (isNaN(Number(parsed.uniqueKey))) {
             newErrors.set(oldKey, error);
             alreadyUniqueCount++;
             continue;
         }
      }
      
      // If we are here, it's either not parsed or it looks numerical (legacy).
      // Parse manually
      const parts = oldKey.split('_');
      if (parts.length !== 2) { skippedCount++; continue; }
      const rowIndex = parseInt(parts[0]);
      const colIndex = parseInt(parts[1]);
      
      if (isNaN(rowIndex) || isNaN(colIndex)) { skippedCount++; continue; }
      
      const columnMeta = columnMetas.find(meta => meta.colIndex === colIndex);
      if (!columnMeta) { skippedCount++; continue; }
      
      const uniqueKey = this.getColumnUniqueKey(columnMeta);
      if (!uniqueKey) { skippedCount++; continue; }
      
      const newKey = this.getErrorKey(rowIndex, uniqueKey);
      newErrors.set(newKey, error);
      migratedCount++;
    }

    this.store.setValidationErrors(newErrors);
    if (this.debug) console.log(`[ValidationManager] 마이그레이션 완료: 성공 ${migratedCount}개, 이미 고유 키 ${alreadyUniqueCount}개, 건너뜀 ${skippedCount}개`);
  }

  validateCell(rowIndex: number, colIndex: number, value: any, columnType: string, immediate: boolean = false) {
    if (this._destroyed) return;
    if (rowIndex < 0) return;

    const cellKey = `${rowIndex}_${colIndex}`;
    if (this.debug) console.log(`validateCell: ${rowIndex}, ${colIndex}, "${value}", ${columnType}, imm:${immediate}`);

    this.errorManager.cancelTimer(cellKey);

    if (immediate || this._shouldValidateImmediately(value)) {
      const columnMeta = this.columnMetas.find(meta => meta.colIndex === colIndex);
      this.performValidation(rowIndex, colIndex, value, columnType, columnMeta);
      return;
    }

    this.errorManager.setTimer(cellKey, () => {
      if (!this._destroyed) {
        const columnMeta = this.columnMetas.find(meta => meta.colIndex === colIndex);
        this.performValidation(rowIndex, colIndex, value, columnType, columnMeta);
      }
    }, this.DEBOUNCE_DELAY);
  }

  async revalidateAll(rows: GridRow[] = [], columnMetas: GridHeader[] = [], opts: { chunkSize?: number; useAsyncProcessor?: boolean; onProgress?: (p: number) => void } = {}) {
    if (this._destroyed) return;
    this.errorManager.clearAllErrors();
    if (!rows.length || !columnMetas.length) return;

    const totalCells = rows.length * columnMetas.filter(meta => meta.isEditable).length;
    const chunkSize = opts.chunkSize !== undefined ? opts.chunkSize : this.defaultChunkSize;
    const onProgress = opts.onProgress || this.onProgress;

    // 1. Sync for small data
    if (!chunkSize || chunkSize <= 0 || totalCells < 500) {
      rows.forEach((row, rowIndex) => {
        columnMetas.forEach((meta) => {
          if (!meta.isEditable) return;
          const value = this._getCellValue(row, meta);
          if (value !== '' && value !== null && value !== undefined) {
             this.validateCell(rowIndex, meta.colIndex ?? -1, value, meta.type!, true);
          }
        });
      });
      if (onProgress) onProgress(100);
      return;
    }

    // 2. Async Processor
    if (opts.useAsyncProcessor !== false) {
      return new Promise<void>((resolve, reject) => {
        // Types for asyncProcessor might be missing, assume valid JS
        const validationTask = validateDataAsync(
          rows,
          columnMetas as any,
          _validateCell,
          {
            chunkSize: Math.min(chunkSize, 100),
            onProgress: (progress: number) => { if (onProgress) onProgress(progress); },
            onComplete: (invalidCells: any[]) => {
              invalidCells.forEach(({ row, col, message }) => {
                const columnMeta = columnMetas.find(meta => meta.colIndex === col);
                if (columnMeta) {
                    const uniqueKey = getColumnUniqueKey(columnMeta);
                    if (uniqueKey) {
                        const errorKey = getErrorKey(row, uniqueKey);
                        this.store.addValidationErrorByUniqueKey({ errorKey, message });
                    } else {
                        this.store.addValidationError({ rowIndex: row, colIndex: col, message });
                    }
                } else {
                    this.store.addValidationError({ rowIndex: row, colIndex: col, message });
                }
              });
              resolve();
            },
            onError: (error: any) => {
              console.error('[ValidationManager] Validation error:', error);
              reject(error);
            }
          }
        );
        this._currentValidationTask = validationTask;
      });
    }
  }

  // Delegations
  clearErrorsForCells(cells: {row: number; col: number}[]) { this.errorManager.clearErrorsForCells(cells); }
  clearErrorsForRow(rowIndex: number) { this.errorManager.clearErrorsForRow(rowIndex); }
  clearErrorsForColumn(colIndex: number) { this.errorManager.clearErrorsForColumn(colIndex); }
  clearAllErrors() { this.errorManager.clearAllErrors(); }
  clearTimers() { this.errorManager.clearTimers(); }
  printErrorKeys(label: string, errors?: Map<string, any>) { this.errorManager.printErrorKeys(label, errors); }
  printErrorDiff(before: Map<string, any>, after: Map<string, any>) { this.errorManager.printErrorDiff(before, after); }
  printUniqueKeyMapping(columnMetas?: GridHeader[]) { this.errorManager.printUniqueKeyMapping(columnMetas); }

  handleRowAddition(rowIndex: number, newRow: GridRow | GridRow[], columnMetas: GridHeader[], count: number = 1) { this.rowColumnOps.handleRowAddition(rowIndex, newRow, columnMetas, count); }
  handleRowDeletion(deletedRowIndices: number[], columnMetas: GridHeader[]) { this.rowColumnOps.handleRowDeletion(deletedRowIndices, columnMetas); }
  handleColumnAddition(colIndex: number, columnMeta: GridHeader, rows: GridRow[]) { this.rowColumnOps.handleColumnAddition(colIndex, columnMeta, rows); }
  handleColumnDeletion(deletedColIndices: number[]) { this.rowColumnOps.handleColumnDeletion(deletedColIndices); }
  revalidateRows(rowIndices: number[], rows: GridRow[], columnMetas: GridHeader[]) { this.rowColumnOps.revalidateRows(rowIndices, rows, columnMetas); }
  revalidateColumns(colIndices: number[], rows: GridRow[], columnMetas: GridHeader[]) { this.rowColumnOps.revalidateColumns(colIndices, rows, columnMetas); }
  reindexErrorsAfterRowDeletion(deletedRowIndices: number[]) { this.rowColumnOps.reindexErrorsAfterRowDeletion(deletedRowIndices); }
  remapValidationErrorsByRowDeletion(deletedRowIndices: number[], columnMetas: GridHeader[]) { this.rowColumnOps.remapValidationErrorsByRowDeletion(deletedRowIndices, columnMetas); }
  handleDataClear(clearedCells: any[]) { this.rowColumnOps.handleDataClear(clearedCells); }

  async handleDataImport(importedData: any[], columnMetas: GridHeader[]) { return this.dataOps.handleDataImport(importedData, columnMetas); }
  handlePasteData(pasteData: string[][], startRow: number, startCol: number, columnMetas: GridHeader[]) { this.dataOps.handlePasteData(pasteData, startRow, startCol, columnMetas); }
  validateIndividualExposureColumn(exposureData: any[], colIndex: number, onProgress?: (p: number) => void) { this.dataOps.validateIndividualExposureColumn(exposureData, colIndex, onProgress); }
  validateConfirmedCaseColumn(confirmedCaseData: any[], colIndex: number, onProgress?: (p: number) => void) { this.dataOps.validateConfirmedCaseColumn(confirmedCaseData, colIndex, onProgress); }
  _clearErrorsInPasteArea(startRow: number, startCol: number, rowCount: number, colCount: number) { this.dataOps.clearErrorsInPasteArea(startRow, startCol, rowCount, colCount); }
  _validateCellImmediate(rowIndex: number, colIndex: number, value: any, columnType: string, columnMeta: GridHeader) { return this.dataOps.validateCellImmediate(rowIndex, colIndex, value, columnType, columnMeta); }
  _showPasteValidationSummary(errors: any[], totalCells: number) { this.dataOps.showPasteValidationSummary(errors, totalCells, this.t); }

  remapValidationErrorsByColumnIdentity(oldColumnsMeta: GridHeader[], newColumnsMeta: GridHeader[], deletedColIndices: number[] = []) { this.structuralMapper.remapValidationErrorsByColumnIdentity(oldColumnsMeta, newColumnsMeta, deletedColIndices); }
  remapValidationErrorsByColumnOrder(oldColumnsMeta: GridHeader[], newColumnsMeta: GridHeader[]) { this.structuralMapper.remapValidationErrorsByColumnOrder(oldColumnsMeta, newColumnsMeta); }

  updateColumnMetas(columnMetas: GridHeader[]) {
    this.columnMetas = columnMetas;
    this.errorManager.updateColumnMetas(columnMetas);
    if (this.debug) console.log('[ValidationManager] 열 메타데이터 업데이트:', columnMetas.length, '개');
  }

  onDataReset() {
    this.errorManager.clearTimers();
  }

  destroy() {
    this.errorManager.destroy();
    this.rowColumnOps.destroy();
    this.dataOps.destroy();
    this.structuralMapper.destroy();
    
    if (this._worker) {
      try { this._worker.terminate(); } catch (e) {}
      this._worker = null;
    }
    
    this._destroyed = true;
  }

  performValidation(rowIndex: number, colIndex: number, value: any, columnType: string, columnMeta?: GridHeader) {
     if (this.debug) console.log(`performValidation: ${rowIndex}, ${colIndex}, "${value}", ${columnType}`);
     const result = _validateCell(value, columnType);
     if (!result.valid) {
         this.errorManager.addError(rowIndex, colIndex, result.message || 'Validation failed', columnMeta);
     } else {
         this.errorManager.removeError(rowIndex, colIndex, columnMeta);
     }
  }

  _shouldValidateImmediately(value: any) {
    return value === '' || value === null || value === undefined;
  }

  _getCellValue(row: GridRow, columnMeta: GridHeader) {
    if (!row || !columnMeta.dataKey) return '';
    if (columnMeta.cellIndex !== null && columnMeta.cellIndex !== undefined) {
      const arr = (row as any)[columnMeta.dataKey];
      if (!Array.isArray(arr)) return '';
      if (columnMeta.cellIndex < 0 || columnMeta.cellIndex >= (arr as any[]).length) return '';
      return arr[columnMeta.cellIndex] ?? '';
    }
    return (row as any)[columnMeta.dataKey] ?? '';
  }
  
  // Public for compatibility
  get filterRowManager() {
    return this.rowColumnOps.filterRowManager;
  }
}

export default ValidationManager;
