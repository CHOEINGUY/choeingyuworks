import { GridHeader, GridRow } from '@/types/grid';
import { useEpidemicStore } from '@/stores/epidemicStore';
import { ValidationErrorManager } from './ValidationErrorManager';
import { 
  getColumnUniqueKey, 
  getErrorKey, 
  parseErrorKey 
} from '@/components/DataInputVirtualScroll/utils/validationUtils';

type EpidemicStore = ReturnType<typeof useEpidemicStore>;

interface StructuralChange {
  insertions: { position: number; count: number; type: string }[];
  deletions: { position: number; count: number; type: string }[];
  typeChanges: Record<number, number>;
  totalOldCols: number;
  totalNewCols: number;
}

export class ValidationStructuralMapper {
  private store: EpidemicStore;
  private errorManager: ValidationErrorManager;
  private debug: boolean;
  private _validateCellFn: ((rowIndex: number, colIndex: number, value: any, type: string, immediate: boolean) => void) | null;
  private _getCellValueFn: ((row: GridRow, columnMeta: GridHeader) => any) | null;

  constructor(store: EpidemicStore, errorManager: ValidationErrorManager, options: { debug?: boolean } = {}) {
    this.store = store;
    this.errorManager = errorManager;
    this.debug = options.debug || false;
    this._validateCellFn = null;
    this._getCellValueFn = null;
  }

  setValidateCellFn(validateCellFn: (rowIndex: number, colIndex: number, value: any, type: string, immediate: boolean) => void) {
    this._validateCellFn = validateCellFn;
  }

  setGetCellValueFn(getCellValueFn: (row: GridRow, columnMeta: GridHeader) => any) {
    this._getCellValueFn = getCellValueFn;
  }

  remapValidationErrorsByColumnIdentity(oldColumnsMeta: GridHeader[], newColumnsMeta: GridHeader[], deletedColIndices: number[] = []) {
    const currentErrors = this.store.validationState.errors;
    if (!currentErrors || currentErrors.size === 0) return;

    // 1. Structural Analysis
    const structuralChanges = this._analyzeStructuralChanges(oldColumnsMeta, newColumnsMeta, deletedColIndices);
    
    // 2. Remap
    const newErrors = new Map<string, any>();
    const rows = this.store.rows || [];

    for (const [oldErrorKey, error] of currentErrors) {
      const newErrorKey = this._calculateNewErrorKey(oldErrorKey, structuralChanges, oldColumnsMeta, newColumnsMeta, rows);
      if (newErrorKey) {
        newErrors.set(newErrorKey, error);
      }
    }

    // 3. Apply
    this.errorManager.setErrors(newErrors);
    
    // 4. Validate new columns
    if (structuralChanges.insertions.length > 0 && rows.length > 0 && this._validateCellFn) {
      for (const insertion of structuralChanges.insertions) {
        const addedColumns = newColumnsMeta.filter(col => {
          const colUniqueKey = getColumnUniqueKey(col);
          return colUniqueKey?.includes(`__${insertion.position}`) || 
                 (col.colIndex !== undefined && col.colIndex >= insertion.position && col.colIndex < insertion.position + insertion.count);
        });
        
        rows.forEach((row, rowIndex) => {
          addedColumns.forEach(columnMeta => {
            const value = this._getCellValue(row, columnMeta);
             if (value !== '' && value !== null && value !== undefined && this._validateCellFn) {
              this._validateCellFn(rowIndex, columnMeta.colIndex ?? -1, value, columnMeta.type || '', true);
            }
          });
        });
      }
    }
  }

  remapValidationErrorsByColumnOrder(oldColumnsMeta: GridHeader[], newColumnsMeta: GridHeader[]) {
    this.remapValidationErrorsByColumnIdentity(oldColumnsMeta, newColumnsMeta);
  }

  private _analyzeStructuralChanges(oldColumnsMeta: GridHeader[], newColumnsMeta: GridHeader[], deletedColIndices: number[] = []): StructuralChange {
    const changes: StructuralChange = {
      insertions: [],
      deletions: [],
      typeChanges: {},
      totalOldCols: oldColumnsMeta.length,
      totalNewCols: newColumnsMeta.length
    };

    const oldGroups = this._groupColumnsByType(oldColumnsMeta);
    const newGroups = this._groupColumnsByType(newColumnsMeta);

    const allTypes = new Set([...Object.keys(oldGroups), ...Object.keys(newGroups)]);
    for (const type of allTypes) {
      const oldCols = oldGroups[type] || [];
      const newCols = newGroups[type] || [];
      
      if (oldCols.length !== newCols.length) {
        if (newCols.length > oldCols.length) {
          const addedCount = newCols.length - oldCols.length;
          const insertPosition = this._findInsertionPosition(oldCols, newCols);
          changes.insertions.push({
            position: insertPosition,
            count: addedCount,
            type
          });
        } else {
          const deletedCount = oldCols.length - newCols.length;
          let deletePosition: number;
          
          if (deletedColIndices.length > 0) {
            const deletedCol = oldCols.find(col => col.colIndex !== undefined && deletedColIndices.includes(col.colIndex));
            if (deletedCol) {
              deletePosition = deletedCol.cellIndex !== undefined ? deletedCol.cellIndex : (deletedCol.colIndex ?? 0);
            } else {
              deletePosition = this._findDeletionPosition(oldCols, newCols);
            }
          } else {
            deletePosition = this._findDeletionPosition(oldCols, newCols);
          }
          
          changes.deletions.push({
            position: deletePosition,
            count: deletedCount,
            type
          });
        }
      }
    }

    for (const oldCol of oldColumnsMeta) {
      const matchingNewCol = newColumnsMeta.find(newCol => 
        newCol.type === oldCol.type && 
        newCol.cellIndex === oldCol.cellIndex &&
        ((newCol as any).group || '') === ((oldCol as any).group || '')
      );
      
      if (matchingNewCol && oldCol.colIndex !== undefined && matchingNewCol.colIndex !== undefined) {
        changes.typeChanges[oldCol.colIndex] = matchingNewCol.colIndex;
      }
    }

    return changes;
  }

  private _groupColumnsByType(columnsMeta: GridHeader[]): Record<string, GridHeader[]> {
    const groups: Record<string, GridHeader[]> = {};
    for (const col of columnsMeta) {
      const type = col.type || 'unknown';
      if (!groups[type]) groups[type] = [];
      groups[type].push(col);
    }
    return groups;
  }

  private _findInsertionPosition(oldCols: GridHeader[], newCols: GridHeader[]): number {
    const oldColIndices = new Set(oldCols.map(col => col.colIndex));
    const newColsAdded = newCols.filter(col => !oldColIndices.has(col.colIndex));
    
    if (newColsAdded.length > 0) {
      const minNewColIndex = Math.min(...newColsAdded.map(col => col.colIndex ?? Infinity));
      return minNewColIndex;
    }
    return oldCols.length > 0 ? (oldCols[0].colIndex ?? 0) : 0;
  }
  
  private _findDeletionPosition(oldCols: GridHeader[], newCols: GridHeader[]): number {
    const newColIndices = new Set(newCols.map(col => col.colIndex));
    const deletedCols = oldCols.filter(col => !newColIndices.has(col.colIndex));
    
    if (deletedCols.length > 0) {
      const deletedColWithMinColIndex = deletedCols.reduce((min, col) => {
        const minIndex = min.colIndex ?? Infinity;
        const colIndex = col.colIndex ?? Infinity;
        return colIndex < minIndex ? col : min;
      });
      return deletedColWithMinColIndex.cellIndex !== undefined ? deletedColWithMinColIndex.cellIndex : (deletedColWithMinColIndex.colIndex ?? 0);
    }
    return oldCols.length > 0 ? (oldCols[oldCols.length - 1].cellIndex ?? (oldCols[oldCols.length - 1].colIndex ?? 0)) : 0;
  }

  private _calculateNewErrorKey(oldErrorKey: string, structuralChanges: StructuralChange, oldColumnsMeta: GridHeader[], newColumnsMeta: GridHeader[], rows: GridRow[]): string | null {
    const isUniqueKeyFormat = oldErrorKey.includes('__') || 
      oldErrorKey.includes('confirmed_case') || 
      oldErrorKey.includes('patient_id') || 
      oldErrorKey.includes('patient_name') || 
      oldErrorKey.includes('exposure_');
    
    let rowIndex: number, colIndex: number, newCellIndex: number | null | undefined;
    
    if (isUniqueKeyFormat) {
       const parsed = parseErrorKey(oldErrorKey);
       if (!parsed) return null;
       rowIndex = parsed.rowIndex;
       
       const uniqueKeyParts = parsed.uniqueKey.split('__');
       const oldCellIndex = uniqueKeyParts.length > 1 ? parseInt(uniqueKeyParts[uniqueKeyParts.length - 1]) : null;
       
       newCellIndex = oldCellIndex;
       if (oldCellIndex !== null && !isNaN(oldCellIndex)) {
         for (const insertion of structuralChanges.insertions) {
           const currentColumnType = uniqueKeyParts[0];
           if (this._isMatchingType(insertion.type, currentColumnType) && oldCellIndex >= insertion.position) /* logic check: insertion.position is cellIndex for grouped types? Yes */ {
              // Wait, insertion.position logic in analyze assumes cellIndex for typed groups?
              // The `_findInsertionPosition` function works on `colIndex` for `insertPosition` calculation but here we compare with `oldCellIndex`.
              // `_findInsertionPosition` returns min `colIndex`.
              // But `insertion` object structure: position, count, type.
              // Logic in analyze: `changes.insertions.push({ position: insertPosition ... })` where position came from `_findInsertionPosition` (colIndex).
              // BUT here in `_calculateNewErrorKey`, `insertion.position` is seemingly used as cellIndex threshold?
              // JS Code used: `if (isMatchingType && oldCellIndex >= insertionPosCellIndex)`
              // And `const insertionPosCellIndex = ...`.
              // Let's replicate JS logic carefully.
              
              const insertionPosMeta = newColumnsMeta.find(col => col.colIndex === insertion.position && col.type === insertion.type);
              const insertionPosCellIndex = insertionPosMeta && insertionPosMeta.cellIndex !== undefined ? insertionPosMeta.cellIndex : insertion.position;
              
              if (oldCellIndex >= insertionPosCellIndex) {
                 newCellIndex! += insertion.count; // ! assertion safe because oldCellIndex is number
              }
           }
         }
         
         for (const deletion of structuralChanges.deletions) {
             const currentColumnType = uniqueKeyParts[0];
             const deletionPosCellIndex = deletion.position; 
             // Deletion position in analyze is derived from cellIndex or colIndex.
             
             if (this._isMatchingType(deletion.type, currentColumnType)) {
                 if (oldCellIndex >= deletionPosCellIndex + deletion.count) {
                     newCellIndex! -= deletion.count;
                 } else if (oldCellIndex >= deletionPosCellIndex) {
                     newCellIndex = deletionPosCellIndex;
                 }
             }
         }
       }
       
       let newUniqueKey: string;
       if (oldCellIndex !== null && !isNaN(oldCellIndex)) {
            const baseUniqueKey = uniqueKeyParts.slice(0, -1).join('__');
            newUniqueKey = newCellIndex !== null && !isNaN(newCellIndex!) ? `${baseUniqueKey}__${newCellIndex}` : baseUniqueKey;
       } else {
           newUniqueKey = parsed.uniqueKey;
       }
       
       const matchingNewCol = newColumnsMeta.find(col => getColumnUniqueKey(col) === newUniqueKey);
       if (!matchingNewCol) {
           // Fallback
           const fallbackType = uniqueKeyParts.length > 1 ? uniqueKeyParts[1] : null;
           const fallbackMatch = newColumnsMeta.find(col => col.type === fallbackType && col.cellIndex === newCellIndex);
            if (fallbackMatch) colIndex = fallbackMatch.colIndex ?? -1;
            else return null;
        } else {
            colIndex = matchingNewCol.colIndex ?? -1;
        }

    } else {
        const parts = oldErrorKey.split('_');
        if (parts.length !== 2) return null;
        rowIndex = parseInt(parts[0]);
        const oldColIndex = parseInt(parts[1]);
        
        const newColIndex = this._calculateNewColIndex(oldColIndex, structuralChanges, oldColumnsMeta, newColumnsMeta);
        if (newColIndex === null) return null;
        colIndex = newColIndex;
    }

    const newColumnMeta = newColumnsMeta.find(col => col.colIndex === colIndex);
    if (!newColumnMeta) return null;
    
    if (rows[rowIndex]) {
        const tempColumnMeta = { ...newColumnMeta };
        if (newCellIndex !== null && newCellIndex !== undefined && !isNaN(newCellIndex)) {
            tempColumnMeta.cellIndex = newCellIndex;
        }
        if (!this._cellHasValue(rows[rowIndex], tempColumnMeta)) return null;
    } else {
        return null;
    }
    
    if (isUniqueKeyFormat) {
        const finalColMeta = { ...newColumnMeta };
         if (newCellIndex !== undefined && newCellIndex !== null && !isNaN(newCellIndex)) {
            finalColMeta.cellIndex = newCellIndex;
        }
        const finalUniqueKey = getColumnUniqueKey(finalColMeta);
        return finalUniqueKey ? getErrorKey(rowIndex, finalUniqueKey) : null;
    } else {
        return `${rowIndex}_${colIndex}`;
    }
  }

  private _isMatchingType(type1: string, type2: string): boolean {
    if (type1 === type2) return true;
     const typeMap: Record<string, string> = {
      'isConfirmedCase': 'confirmed',
      'patientId': 'patient',
      'patientName': 'patient',
      'individualExposureTime': 'exposure'
    };
    return typeMap[type1] === type2;
  }

  private _calculateNewColIndex(oldColIndex: number, structuralChanges: StructuralChange, oldColumnsMeta: GridHeader[], newColumnsMeta: GridHeader[]): number | null {
     // ... Logic from JS ...
     // Basic mapping
     if (structuralChanges.typeChanges[oldColIndex] !== undefined) return structuralChanges.typeChanges[oldColIndex];
     
     // Same type find
     const oldColumnMeta = oldColumnsMeta.find(col => col.colIndex === oldColIndex);
     if (!oldColumnMeta) return null;
     
     const matchingNewCol = newColumnsMeta.find(col => 
      col.type === oldColumnMeta.type && 
      col.cellIndex === oldColumnMeta.cellIndex &&
      ((col as any).group || '') === ((oldColumnMeta as any).group || '')
     );
     if (matchingNewCol) return matchingNewCol.colIndex ?? null;
     
     // Structural
     let newColIndex = oldColIndex;
     for (const insertion of structuralChanges.insertions) {
         if (oldColIndex >= insertion.position) newColIndex += insertion.count;
     }
     for (const deletion of structuralChanges.deletions) {
         if (oldColIndex >= deletion.position + deletion.count) newColIndex -= deletion.count;
         else if (oldColIndex >= deletion.position) return null;
     }
     
     if (newColIndex < 0 || newColIndex >= structuralChanges.totalNewCols) return null;
     return newColIndex;
  }

  private _cellHasValue(row: GridRow, columnMeta: GridHeader): boolean {
      const value = this._getCellValue(row, columnMeta);
      return value !== undefined && value !== null && value !== '';
  }

  private _getCellValue(row: GridRow, columnMeta: GridHeader): any {
    if (this._getCellValueFn) return this._getCellValueFn(row, columnMeta);
    return columnMeta.dataKey ? row[columnMeta.dataKey] : undefined;
  }

  destroy() {}
}
