import { GridHeader } from '@/types/grid';
import { useEpidemicStore } from '@/stores/epidemicStore';
import { 
  getColumnUniqueKey, 
  getErrorKey, 
  parseErrorKey 
} from '@/components/DataInputVirtualScroll/utils/validationUtils';

type EpidemicStore = ReturnType<typeof useEpidemicStore>;

export class ValidationErrorManager {
  private store: EpidemicStore;
  private debug: boolean;
  private validationTimers: Map<string, ReturnType<typeof setTimeout>>;
  private columnMetas: GridHeader[];

  constructor(store: EpidemicStore, options: { debug?: boolean } = {}) {
    this.store = store;
    this.debug = options.debug || false;
    this.validationTimers = new Map();
    this.columnMetas = [];
  }

  updateColumnMetas(columnMetas: GridHeader[]) {
    this.columnMetas = columnMetas;
    if (this.debug) {
      console.log('[ValidationErrorManager] 열 메타데이터 업데이트:', columnMetas.length, '개');
    }
  }

  clearErrorsForCells(cells: { row: number; col: number }[] = []) {
    cells.forEach(({ row, col }) => {
      const columnMeta = this.columnMetas.find(meta => meta.colIndex === col);
      if (columnMeta) {
        const uniqueKey = getColumnUniqueKey(columnMeta);
        if (uniqueKey) {
            const errorKey = getErrorKey(row, uniqueKey);
            this.store.removeValidationErrorByUniqueKey({ errorKey });
        }
      } else {
        this.store.removeValidationError({ rowIndex: row, colIndex: col });
      }
    });
  }

  clearErrorsForRow(rowIndex: number) {
    const errorsToRemove: string[] = [];
    const errors = this.store.validationState.errors;
    
    // errors is a Map
    for (const key of errors.keys()) {
      const parsed = parseErrorKey(key);
      if (parsed && parsed.rowIndex === rowIndex) {
        errorsToRemove.push(key);
      }
    }
    
    errorsToRemove.forEach(key => {
      this.store.removeValidationErrorByUniqueKey({ errorKey: key });
    });
  }

  clearErrorsForColumn(colIndex: number) {
    const errorsToRemove: string[] = [];
    
    const columnMeta = this.columnMetas.find(meta => meta.colIndex === colIndex);
    if (!columnMeta) return;
    
    const uniqueKey = getColumnUniqueKey(columnMeta);
    if (!uniqueKey) return;
    
    const errors = this.store.validationState.errors;
    for (const key of errors.keys()) {
      const parsed = parseErrorKey(key);
      if (parsed && parsed.uniqueKey === uniqueKey) {
        errorsToRemove.push(key);
      }
    }
    
    errorsToRemove.forEach(key => {
      this.store.removeValidationErrorByUniqueKey({ errorKey: key });
    });
  }

  clearAllErrors() {
    this.validationTimers.forEach((t) => clearTimeout(t));
    this.validationTimers.clear();
    this.store.clearValidationErrors();
  }

  clearTimers() {
    this.validationTimers.forEach((t) => clearTimeout(t));
    this.validationTimers.clear();
  }

  cancelTimer(cellKey: string): boolean {
    const existingTimer = this.validationTimers.get(cellKey);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.validationTimers.delete(cellKey);
      return true;
    }
    return false;
  }

  setTimer(cellKey: string, callback: () => void, delay: number) {
    const timerId = setTimeout(() => {
      callback();
      this.validationTimers.delete(cellKey);
    }, delay);
    this.validationTimers.set(cellKey, timerId);
  }

  addError(rowIndex: number, colIndex: number, message: string, columnMeta?: GridHeader) {
    // If columnMeta passed, use it, else find it
    // Wait, signature says optional. 
    const meta = columnMeta || this.columnMetas.find(m => m.colIndex === colIndex);
    
    if (meta) {
      const uniqueKey = getColumnUniqueKey(meta);
      if (uniqueKey) {
        const errorKey = getErrorKey(rowIndex, uniqueKey);
        this.store.addValidationErrorByUniqueKey({ errorKey, message });
        return;
      }
    }
    
    // Fallback
    this.store.addValidationError({ rowIndex, colIndex, message });
  }

  removeError(rowIndex: number, colIndex: number, columnMeta?: GridHeader) {
    const meta = columnMeta || this.columnMetas.find(m => m.colIndex === colIndex);
    
    if (meta) {
      const uniqueKey = getColumnUniqueKey(meta);
      if (uniqueKey) {
        const errorKey = getErrorKey(rowIndex, uniqueKey);
        this.store.removeValidationErrorByUniqueKey({ errorKey });
        return;
      }
    }
    
    // Fallback
    this.store.removeValidationError({ rowIndex, colIndex });
  }

  printErrorKeys(label: string, errors?: Map<string, any>) {
    if (!this.debug) return;
    const errorMap = errors || this.store.validationState.errors;
    console.log(`[ValidationErrorManager] ${label}:`, Array.from(errorMap.keys()));
  }

  printErrorDiff(before: Map<string, any>, after: Map<string, any>) {
    if (!this.debug) return;
    
    const beforeKeys = Array.from(before.keys());
    const afterKeys = Array.from(after.keys());
    
    const removed = beforeKeys.filter(key => !afterKeys.includes(key));
    const added = afterKeys.filter(key => !beforeKeys.includes(key));
    
    console.log('[ValidationErrorManager] 제거된 에러:', removed);
    console.log('[ValidationErrorManager] 추가된 에러:', added);
  }

  printUniqueKeyMapping(columnMetas?: GridHeader[]) {
    if (!this.debug) return;
    
    const metas = columnMetas || this.columnMetas;
    const mapping: Record<string, string | null> = {};
    metas.forEach(col => {
      const uniqueKey = getColumnUniqueKey(col);
      mapping[`${col.type}[${col.cellIndex}]`] = uniqueKey;
    });
    console.log('[ValidationErrorManager] 고유 키 매핑:', mapping);
  }

  getErrorCount(): number {
    return this.store.validationState.errors.size;
  }

  createErrorSnapshot(): Map<string, any> {
    return new Map(this.store.validationState.errors);
  }
  
  setErrors(newErrors: Map<string, any>) {
      // Pinia store should expose setErrors or setter
      this.store.setValidationErrors(newErrors);
  }

  destroy() {
    this.clearTimers();
    this.columnMetas = [];
  }
}
