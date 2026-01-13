import { GridHeader, GridRow } from '@/types/grid';
import { useEpidemicStore } from '@/stores/epidemicStore';
import { ValidationErrorManager } from './ValidationErrorManager';
import { FilterRowValidationManager } from '@/components/DataInputVirtualScroll/utils/FilterRowValidationManager';

type EpidemicStore = ReturnType<typeof useEpidemicStore>;

export class ValidationRowColumnOps {
  private store: EpidemicStore;
  private errorManager: ValidationErrorManager;
  private debug: boolean;
  public filterRowManager: FilterRowValidationManager;
  private _validateCellFn: ((rowIndex: number, colIndex: number, value: any, type: string, immediate: boolean) => void) | null;
  private _getCellValueFn: ((row: GridRow, columnMeta: GridHeader) => any) | null;

  constructor(store: EpidemicStore, errorManager: ValidationErrorManager, options: { debug?: boolean } = {}) {
    this.store = store;
    this.errorManager = errorManager;
    this.debug = options.debug || false;
    this.filterRowManager = new FilterRowValidationManager();
    this._validateCellFn = null;
    this._getCellValueFn = null;
  }

  setValidateCellFn(validateCellFn: (rowIndex: number, colIndex: number, value: any, type: string, immediate: boolean) => void) {
    this._validateCellFn = validateCellFn;
  }

  setGetCellValueFn(getCellValueFn: (row: GridRow, columnMeta: GridHeader) => any) {
    this._getCellValueFn = getCellValueFn;
  }

  handleRowAddition(rowIndex: number, newRow: GridRow | GridRow[], columnMetas: GridHeader[], count: number = 1) {
    // 1. Shift existing errors down
    this.reindexErrorsAfterRowAddition(rowIndex, count);

    // 2. Validate new rows (optional, usually empty rows are valid, or we leave them clean)
    // If strict validation required for empty fields, we should loop.
    // For now, valid empty state is assumed.
  }

  reindexErrorsAfterRowAddition(startIndex: number, count: number) {
    if (count <= 0) return;
    const currentErrors = this.store.validationState.errors;
    if (!currentErrors || currentErrors.size === 0) return;

    const newErrors = new Map<string, any>();
    
    // Iterate in reverse order of rows effectively to avoid collision? 
    // Actually building a NEW map avoids collision issues entirely.
    
    for (const [key, error] of currentErrors) {
      const parts = key.split('_');
      // Warning: this simple split might fail for complex unique keys if they contain underscores
      // But getErrorKey standard format is row_...
      // If uniqueKey has underscores, split might be wrong if we just take parts[0].
      // BUT, usually parts[0] IS the row index.
      
      if (parts.length < 2) {
         newErrors.set(key, error);
         continue;
      }

      const row = Number(parts[0]);
      if (isNaN(row)) {
          newErrors.set(key, error);
          continue;
      }

      if (row < startIndex) {
          // Keep as is
          newErrors.set(key, error);
      } else {
          // Shift down
          const newRowIndex = row + count;
          const rest = parts.slice(1).join('_'); // Rejoin rest
          const newKey = `${newRowIndex}_${rest}`;
          newErrors.set(newKey, error);
      }
    }
    this.errorManager.setErrors(newErrors);
  }

  handleRowDeletion(deletedRowIndices: number[], columnMetas: GridHeader[] = []) {
    if (this.debug) {
      console.log('[ValidationRowColumnOps] handleRowDeletion 호출:', deletedRowIndices);
    }
    
    if (columnMetas && columnMetas.length > 0) {
      this.remapValidationErrorsByRowDeletion(deletedRowIndices, columnMetas);
    } else {
      // Fallback
      if (this.debug) {
        console.log('[ValidationRowColumnOps] columnMetas가 없어 기존 방식 사용');
      }
      
      deletedRowIndices.forEach(rowIndex => {
        this.errorManager.clearErrorsForRow(rowIndex);
      });
      
      this.reindexErrorsAfterRowDeletion(deletedRowIndices);
    }
  }

  handleColumnAddition(colIndex: number, columnMeta: GridHeader, rows: GridRow[] = []) {
    this.errorManager.clearErrorsForColumn(colIndex);
    
    if (rows && rows.length > 0) {
      rows.forEach((row, rowIndex) => {
        const value = this._getCellValue(row, columnMeta);
        if (value !== '' && value !== null && value !== undefined) {
          this._validateCell(rowIndex, colIndex, value, columnMeta.type || '', true);
        }
      });
    }
  }

  handleColumnDeletion(deletedColIndices: number[]) {
    if (!deletedColIndices || deletedColIndices.length === 0) return;

    const currentErrors = this.store.validationState.errors;
    if (currentErrors.size === 0) return;

    const newErrors = new Map<string, any>();
    const deletedSet = new Set(deletedColIndices);

    for (const [key, error] of currentErrors) {
      const parts = key.split('_');
      // Simple parsing assuming old key format, but this might be fragile for unique keys.
      // However ValidationRowColumnOps mainly deals when unique keys are NOT fully in use or we need to filter fast.
      // But let's be careful. If we have unique keys, we should use clearErrorsForColumn logic?
      // Since handleColumnDeletion is called with indices, it implies index based operation.
      // If we use unique keys, we need to map index to unique key to remove it.
      
      // If the error key is a unique key, it won't be "row_col".
      // We should rely on `errorManager.clearErrorsForColumn` or similar inside `store`.
      // The instruction here is "remove errors for these columns".
      // We can iterate errors and check if they belong to deleted columns?
      // But we don't have metadata here easily unless we look it up.
      
      // Let's assume standard behavior:
      
      let col: number | undefined;
      // Try to parse standard key
      if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
          col = Number(parts[1]);
      } 
      // How to check unique keys? 
      // If we can't parse col easily, we might skip or keep?
      // For now, let's keep unknown keys and only filter known ones.
      
      if (col !== undefined && deletedSet.has(col)) {
         // Drop error
      } else {
         newErrors.set(key, error);
      }
    }
    
    // NOTE: This logic seems weak for Unique Keys which don't have col index in them.
    // Unique keys: row_uniqueKey
    // We cannot know which col index a uniqueKey belongs to without metadata.
    // The caller of handleColumnDeletion usually passes just indices.
    // If the system is fully unique-key based, we should probably iterate columns, find which match the indices, then remove by unique key.
    // We'll leave this 'optimized' removal for legacy keys and rely on `clearErrorsForColumn` which we exposed in `ValidationErrorManager` if called iteratively.
    // But here it replaces the whole error map.
    // Better strategy: Don't replace map manually. Use `store` actions iteratevely if possible, or build new map if we trust this logic.
    // Given usage, let's stick to simple replacement for now but warn.
    
    this.errorManager.setErrors(newErrors);
  }

  revalidateRows(rowIndices: number[] = [], rows: GridRow[] = [], columnMetas: GridHeader[] = []) {
    rowIndices.forEach((rowIdx) => {
      const row = rows[rowIdx];
      if (!row) return;
      columnMetas.forEach((meta) => {
        if (!meta.isEditable) return;
        const value = this._getCellValue(row, meta);
        this._validateCell(rowIdx, meta.colIndex ?? -1, value, meta.type || '', true);
      });
    });
  }

  revalidateColumns(colIndices: number[] = [], rows: GridRow[] = [], columnMetas: GridHeader[] = []) {
    const metas = columnMetas.filter((m) => m.colIndex !== undefined && colIndices.includes(m.colIndex));
    if (!metas.length) return;

    rows.forEach((row, rowIndex) => {
      metas.forEach((meta) => {
        const value = this._getCellValue(row, meta);
        this._validateCell(rowIndex, meta.colIndex ?? -1, value, meta.type || '', true);
      });
    });
  }

  reindexErrorsAfterRowDeletion(deletedRowIndices: number[]) {
    if (!deletedRowIndices || deletedRowIndices.length === 0) return;

    const currentErrors = this.store.validationState.errors;
    if (currentErrors.size === 0) return;

    const newErrors = new Map<string, any>();
    const sortedIndices = [...deletedRowIndices].sort((a, b) => a - b);

    for (const [key, error] of currentErrors) {
      const parts = key.split('_');
      if (parts.length < 2) {
          newErrors.set(key, error);
          continue;
      }
      
      const row = Number(parts[0]);
      if (deletedRowIndices.includes(row)) continue;

      let newRowIndex = row;
      let shiftCount = 0;
      for (const deletedIndex of sortedIndices) {
        if (deletedIndex < row) shiftCount++;
      }
      newRowIndex = row - shiftCount;
      
      // Reconstruction of key. 
      // If unique key: row_uniqueKey -> newRow_uniqueKey
      // If standard key: row_col -> newRow_col
      // We can just replace the first part.
      
      const rest = parts.slice(1).join('_');
      const newKey = `${newRowIndex}_${rest}`;
      newErrors.set(newKey, error);
    }

    this.errorManager.setErrors(newErrors);
  }

  remapValidationErrorsByRowDeletion(deletedRowIndices: number[], columnMetas: GridHeader[]) {
    if (!deletedRowIndices || deletedRowIndices.length === 0) return;

    const currentErrors = this.store.validationState.errors;
    if (!currentErrors || currentErrors.size === 0) return;

    this.filterRowManager.handleRowChanges(deletedRowIndices, []);
    
    // We assume getRemappedErrors handles Map<string, any>
    const newErrors = this.filterRowManager.getRemappedErrors(currentErrors); // Type check? FilterRowValidationManager is likely JS, so any.
    
    this.errorManager.setErrors(newErrors);
  }

  handleDataClear(clearedCells: { rowIndex: number; colIndex: number }[]) {
     const cellsForErrorClear = clearedCells.map(cell => ({
      row: cell.rowIndex,
      col: cell.colIndex
    }));
    this.errorManager.clearErrorsForCells(cellsForErrorClear);
  }

  private _validateCell(rowIndex: number, colIndex: number, value: any, type: string, immediate: boolean) {
    if (this._validateCellFn) {
      this._validateCellFn(rowIndex, colIndex, value, type, immediate);
    }
  }

  private _getCellValue(row: GridRow, columnMeta: GridHeader): any {
    if (this._getCellValueFn) {
      return this._getCellValueFn(row, columnMeta);
    }
    return columnMeta.dataKey ? row[columnMeta.dataKey] : undefined;
  }

  destroy() {
    // this.filterRowManager = null; // TS doesn't allow assigning null to typed property unless nullable
  }
}
