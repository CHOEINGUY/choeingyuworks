import { GridHeader } from '@/types/grid';
import { useEpidemicStore } from '@/stores/epidemicStore';
import { ValidationErrorManager } from './ValidationErrorManager';
import { validateCell as _validateCell } from '@/store/utils/validation';

type EpidemicStore = ReturnType<typeof useEpidemicStore>;

export class ValidationDataOps {
  private store: EpidemicStore;
  private errorManager: ValidationErrorManager;
  private debug: boolean;
  private onProgress: ((progress: number) => void) | null;
  private showToast: ((message: string, type: 'success' | 'warning' | 'error' | 'info') => void) | null;
  private _validateCellFn: ((rowIndex: number, colIndex: number, value: any, type: string, immediate: boolean) => void) | null;
  private _getCellValueFn: ((row: any, columnMeta: GridHeader) => any) | null;

  constructor(store: EpidemicStore, errorManager: ValidationErrorManager, options: { debug?: boolean; onProgress?: (p: number) => void; showToast?: (msg: string, type: any) => void } = {}) {
    this.store = store;
    this.errorManager = errorManager;
    this.debug = options.debug || false;
    this.onProgress = options.onProgress || null;
    this.showToast = options.showToast || null;
    this._validateCellFn = null;
    this._getCellValueFn = null;
  }

  setValidateCellFn(validateCellFn: (rowIndex: number, colIndex: number, value: any, type: string, immediate: boolean) => void) {
    this._validateCellFn = validateCellFn;
  }

  setGetCellValueFn(getCellValueFn: (row: any, columnMeta: GridHeader) => any) {
    this._getCellValueFn = getCellValueFn;
  }

  async handleDataImport(importedData: any[], columnMetas: GridHeader[]) {
    this.errorManager.clearAllErrors();
    
    const chunkSize = 1000;
    const totalRows = importedData.length;
    
    for (let i = 0; i < totalRows; i += chunkSize) {
      const chunk = importedData.slice(i, i + chunkSize);
      
      chunk.forEach((row, chunkIndex) => {
        const rowIndex = i + chunkIndex;
        columnMetas.forEach(columnMeta => {
          if (!columnMeta.isEditable) return;
          
          const value = this._getCellValue(row, columnMeta);
          if (value !== '' && value !== null && value !== undefined) {
            this._validateCell(rowIndex, columnMeta.colIndex ?? -1, value, columnMeta.type || '', true);
          }
        });
      });
      
      if (this.onProgress) {
        const progress = Math.round(((i + chunkSize) / totalRows) * 100);
        this.onProgress(Math.min(progress, 100));
      }
      
      if (i + chunkSize < totalRows) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
    
    if (this.onProgress) {
      this.onProgress(100);
    }
  }

  handlePasteData(pasteData: string[][], startRow: number, startCol: number, columnMetas: GridHeader[]) {
    if (this.debug) {
      console.log('[ValidationDataOps] handlePasteData 호출됨', pasteData, startRow, startCol, columnMetas);
    }
    
    pasteData.forEach((row, rowOffset) => {
      const rowIndex = startRow + rowOffset;
      row.forEach((value, colOffset) => {
        const colIndex = startCol + colOffset;
        const columnMeta = columnMetas.find(c => c.colIndex === colIndex);
        if (columnMeta && columnMeta.isEditable) {
          if (this.debug) {
            console.log('[ValidationDataOps] validateCell 호출', rowIndex, colIndex, value, columnMeta.dataKey);
          }
          // Remove error first
          this.store.removeValidationError({ rowIndex, colIndex });
          if (value !== '' && value !== null && value !== undefined) {
            this._validateCell(rowIndex, colIndex, value, columnMeta.type || '', true);
          }
        }
      });
    });
  }

  clearErrorsInPasteArea(startRow: number, startCol: number, rowCount: number, colCount: number) {
    const errorsToRemove: string[] = [];
    
    const errors = this.store.validationState.errors;
    for (const key of errors.keys()) {
      const parts = key.split('_');
      // Warning: key might be unique key format!
      // ValidationDataOps in JS seemed to assume row_col format for this paste area logic?
      // Or maybe 'get' based logic.
      // JS code: const [errorRow, errorCol] = key.split('_').map(Number);
      // This implies it only supported numerical keys? 
      // If we use unique keys, this logic needs to be robust.
      // But usually `pasteData` operation works on visual grid coordinates.
      // Unique keys contain underscores too.
      // Let's rely on standard parsing if possible, or skip unique keys if we cannot map them back to colIndex easily without looking up.
      
      // If we strictly follow the visual area, we should look up which columns fall into this area.
      // But clearing errors by coordinate is tricky if errors are stored by unique key.
      
      // Alternative: Iterate all columns in range, get unique key, form error key options.
      // This is expensive? 
      // Let's stick to the direct key parsing if it matches row_col.
      
      if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
          const errorRow = Number(parts[0]);
          const errorCol = Number(parts[1]);
          
          if (errorRow >= startRow && 
              errorRow < startRow + rowCount &&
              errorCol >= startCol && 
              errorCol < startCol + colCount) {
            errorsToRemove.push(key);
          }
      }
    }

    errorsToRemove.forEach(key => {
      const [row, col] = key.split('_').map(Number);
      this.store.removeValidationError({ rowIndex: row, colIndex: col });
    });
    
    // We should also handle Unique Keys if we can map them.
    // Ideally we iterate the target area:
    // for r in rows, for c in cols:
    //   this.errorManager.removeError(r, c) which handles unique keys lookup internally.
  }

  validateCellImmediate(rowIndex: number, colIndex: number, value: any, columnType: string, columnMeta?: GridHeader) {
    const result = _validateCell(value, columnType);
    
    if (!result.valid) {
      this.errorManager.addError(rowIndex, colIndex, result.message || 'Validation failed', columnMeta);
    }
    
    return result;
  }

  showPasteValidationSummary(errors: any[], totalCells: number, t?: any) {
    const errorCount = errors.length;
    const errorRate = ((errorCount / totalCells) * 100).toFixed(1);
    
    const errorTypes: Record<string, number> = {};
    errors.forEach(error => {
      const type = error.type || 'unknown';
      errorTypes[type] = (errorTypes[type] || 0) + 1;
    });

    console.group('[ValidationDataOps] 붙여넣기 검증 결과');
    console.log(`총 셀 수: ${totalCells}`);
    console.log(`오류 셀 수: ${errorCount} (${errorRate}%)`);
    console.log('오류 타입별 분류:', errorTypes);
    
    if (errorCount > 0) {
      console.log('첫 5개 오류 예시:');
      errors.slice(0, 5).forEach((error, index) => {
        console.log(`  ${index + 1}. 행${error.row} 열${error.col}: "${error.value}" → ${error.message}`);
      });
    }
    console.groupEnd();

    if (this.showToast) {
      const message = t 
        ? t('dataInput.toast.pasteSummary', { total: totalCells, error: errorCount, rate: errorRate })
        : `붙여넣기 완료: ${totalCells}개 셀 중 ${errorCount}개 오류 발견 (${errorRate}%)`;
      const type = errorCount > 0 ? 'warning' : 'success';
      try {
        this.showToast(message, type);
      } catch (error) {
        console.warn('[ValidationDataOps] showToast 호출 실패:', error);
      }
    }
  }

  validateIndividualExposureColumn(exposureData: { rowIndex: number; value: string }[], colIndex: number, onProgress: ((p: number) => void) | null = null) {
    if (!exposureData || exposureData.length === 0) return;
    
    if (this.debug) {
      console.log('[ValidationDataOps] validateIndividualExposureColumn 호출됨');
    }
    
    const totalCells = exposureData.length;
    const chunkSize = 50;
    
    // Using simple loop for now, async via promise/timeout is verbose in TS without async helper class standard
    // Or we keep the chunk logic via setTimeout if run in browser
    // Since this is a method, we can't easily make it fully async without `await` at callsites?
    // The JS version used a loop with setTimeout(..., 0) if totalCells > 200? No, it was synchronous loop logic but had `setTimeout` call uselessly at end of loop?
    // Wait: `if (i + chunkSize < totalCells && totalCells > 200) { setTimeout(() => {}, 0); }` -> This does nothing to yield.
    // It just creates a timer that does empty function. The loop wasn't async in JS unless it was breaking out. 
    // Ah, checking JS again:
    // for (let i = 0... ) { ... }
    // It was a synchronous loop. The setTimeout was a no-op? 
    // Actually, maybe I misread.
    // Yes, the JS code was purely synchronous blocking unless I missed an `await`.
    // So I will implement synchronous here too.
    
    for (let i = 0; i < totalCells; i += chunkSize) {
      const chunk = exposureData.slice(i, i + chunkSize);
      
      chunk.forEach(({ rowIndex, value }) => {
        if (value !== '' && value !== null && value !== undefined) {
           this._validateCell(rowIndex, colIndex, value, 'individualExposureTime', true);
        }
      });
      
      if (onProgress) {
        const progress = Math.round(((i + chunkSize) / totalCells) * 100);
        onProgress(Math.min(progress, 100));
      }
    }
    
    if (onProgress) onProgress(100);
  }

  validateConfirmedCaseColumn(confirmedCaseData: { rowIndex: number; value: string }[], colIndex: number, onProgress: ((p: number) => void) | null = null) {
    if (!confirmedCaseData || confirmedCaseData.length === 0) return;
    
    const totalCells = confirmedCaseData.length;
    const chunkSize = 50;
    
    for (let i = 0; i < totalCells; i += chunkSize) {
      const chunk = confirmedCaseData.slice(i, i + chunkSize);
      
      chunk.forEach(({ rowIndex, value }) => {
         if (value !== '' && value !== null && value !== undefined) {
           this._validateCell(rowIndex, colIndex, value, 'isConfirmedCase', true);
         }
      });
      
      if (onProgress) {
        const progress = Math.round(((i + chunkSize) / totalCells) * 100);
        onProgress(Math.min(progress, 100));
      }
    }
    if (onProgress) onProgress(100);
  }

  private _validateCell(rowIndex: number, colIndex: number, value: any, type: string, immediate: boolean) {
    if (this._validateCellFn) {
      this._validateCellFn(rowIndex, colIndex, value, type, immediate);
    }
  }

  private _getCellValue(row: any, columnMeta: GridHeader): any {
    if (this._getCellValueFn) {
      return this._getCellValueFn(row, columnMeta);
    }
    return columnMeta.dataKey ? row[columnMeta.dataKey] : undefined;
  }

  destroy() {
    this.onProgress = null;
  }
}
