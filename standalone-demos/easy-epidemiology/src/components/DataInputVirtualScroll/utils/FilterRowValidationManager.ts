/**
 * FilterRowValidationManager
 *
 * 필터 기능과 행 삭제/추가에 따른 CSS 위치 변경 로직을 통합하여 관리하는 클래스
 */
import { GridRow, GridHeader } from '@/types/grid';

// The user uses strict TS.
const logger = {
    debug: (msg: string, data?: any) => {
        // console.debug(msg, data);
    }
};

export class FilterRowValidationManager {
    filterMappings: Map<number, number>; // Original -> Virtual
    isFiltered: boolean;
    filteredRows: GridRow[];
    rowMappings: Map<number, number | null>;
    deletedRowIndices: number[];
    addedRowIndices: number[];
    combinedMappings: Map<number, number | null>;
    validationErrors: Map<string, any>;
    debug: boolean;

    constructor() {
        this.filterMappings = new Map();
        this.isFiltered = false;
        this.filteredRows = [];
        this.rowMappings = new Map();
        this.deletedRowIndices = [];
        this.addedRowIndices = [];
        this.combinedMappings = new Map();
        this.validationErrors = new Map();
        this.debug = false;
    }

    updateFilterState(isFiltered: boolean, filteredRows?: GridRow[], validationErrors?: Map<string, any>) {
        this.isFiltered = isFiltered;
        this.filteredRows = filteredRows || [];
        this.validationErrors = validationErrors || new Map();
        this._updateFilterMappings();
        this._updateCombinedMappings();

        if (this.debug) {
            logger.debug('[FilterRowValidationManager] 필터 상태 업데이트:', {
                isFiltered,
                filteredRowsCount: this.filteredRows.length,
                validationErrorsCount: this.validationErrors.size
            });
        }
    }

    handleRowChanges(deletedRowIndices?: number[], addedRowIndices?: number[]) {
        this.deletedRowIndices = deletedRowIndices || [];
        this.addedRowIndices = addedRowIndices || [];
        this._updateRowMappings();
        this._updateCombinedMappings();

        if (this.debug) {
            logger.debug('[FilterRowValidationManager] 행 변경 처리:', {
                deletedRowIndices: this.deletedRowIndices,
                addedRowIndices: this.addedRowIndices
            });
        }
    }

    /**
     * 원본 행 인덱스에 대한 에러가 현재 필터 상태에서 보이는지 확인
     * @param originalRowIndex - 원본 데이터의 행 인덱스 (VirtualGridBody에서 item.originalIndex로 전달됨)
     */
    isErrorVisible(originalRowIndex: number): boolean {
        if (!this.isFiltered) {
            // 필터가 없으면 삭제된 행만 확인
            return this._isRowVisibleAfterChanges(originalRowIndex);
        }

        // 필터가 적용된 경우: 해당 원본 인덱스를 가진 행이 filteredRows에 존재하는지 확인
        const isInFilteredRows = this.filteredRows.some(
            row => row._originalIndex === originalRowIndex
        );
        
        if (!isInFilteredRows) {
            return false;
        }

        return this._isRowVisibleAfterChanges(originalRowIndex);
    }

    getVisibleErrors(): Map<string, any> {
        if (!this.isFiltered && this.deletedRowIndices.length === 0) {
            return this.validationErrors;
        }

        const visibleErrors = new Map<string, any>();
        this.validationErrors.forEach((error, key) => {
            const parts = key.split('_');
            const rowIndexStr = parts[0];
            const uniqueKey = parts.slice(1).join('_');
            const originalRowIndex = parseInt(rowIndexStr, 10);

            const actualRowIndex = this._getActualRowIndexAfterChanges(originalRowIndex);
            if (actualRowIndex === null) {
                return;
            }

            if (this.isFiltered) {
                const isInFilteredRows = this.filteredRows.some(row => row._originalIndex === originalRowIndex);
                if (!isInFilteredRows) {
                    return;
                }
            }

            const newKey = `${actualRowIndex}_${uniqueKey}`;
            visibleErrors.set(newKey, error);
        });

        return visibleErrors;
    }

    getErrorMessage(originalRowIndex: number, colIndex: number, columnMeta: GridHeader | null): any | null {
        if (!columnMeta) return null;

        const uniqueKey = this._generateColumnUniqueKey(columnMeta);
        // VirtualGridBody에서 이미 원본 인덱스를 전달하므로 변환 불필요
        const key = `${originalRowIndex}_${uniqueKey}`;
        return this.validationErrors.get(key) || null;
    }

    getRemappedErrors(currentErrors: Map<string, any>): Map<string, any> {
        if (!currentErrors || currentErrors.size === 0) {
            return new Map();
        }

        const remappedErrors = new Map<string, any>();
        currentErrors.forEach((error, key) => {
            const parts = key.split('_');
            const rowIndexStr = parts[0];
            const uniqueKey = parts.slice(1).join('_');
            const originalRowIndex = parseInt(rowIndexStr, 10);
            const newRowIndex = this._getNewRowIndexAfterChanges(originalRowIndex);

            if (newRowIndex !== null) {
                const newKey = `${newRowIndex}_${uniqueKey}`;
                remappedErrors.set(newKey, error);
            }
        });

        return remappedErrors;
    }

    setDebugMode(enabled: boolean) {
        this.debug = enabled;
    }

    getStateInfo() {
        return {
            isFiltered: this.isFiltered,
            filteredRowsCount: this.filteredRows.length,
            deletedRowIndices: this.deletedRowIndices,
            addedRowIndices: this.addedRowIndices,
            validationErrorsCount: this.validationErrors.size,
            filterMappingsSize: this.filterMappings.size,
            rowMappingsSize: this.rowMappings.size,
            combinedMappingsSize: this.combinedMappings.size
        };
    }

    private _updateFilterMappings() {
        this.filterMappings.clear();
        if (!this.isFiltered || !this.filteredRows.length) {
            return;
        }

        this.filteredRows.forEach((row, virtualIndex) => {
            if (row._originalIndex !== undefined) {
                this.filterMappings.set(row._originalIndex as number, virtualIndex);
            }
        });
    }

    private _updateRowMappings() {
        this.rowMappings.clear();
        if (this.deletedRowIndices.length === 0 && this.addedRowIndices.length === 0) return;

        this.deletedRowIndices.forEach(deletedIndex => {
            this.rowMappings.set(deletedIndex, null);
        });
    }

    private _updateCombinedMappings() {
        this.combinedMappings.clear();
    }

    private _getOriginalRowIndex(virtualIndex: number): number {
        if (!this.isFiltered) {
            return virtualIndex;
        }

        const filteredRow = this.filteredRows[virtualIndex];
        return filteredRow && filteredRow._originalIndex !== undefined 
            ? (filteredRow._originalIndex as number) 
            : virtualIndex;
    }

    private _getActualRowIndexAfterChanges(originalIndex: number): number | null {
        if (this.deletedRowIndices.includes(originalIndex)) {
            return null;
        }

        const deletedBeforeCount = this.deletedRowIndices.filter(deletedIndex => deletedIndex < originalIndex).length;
        return originalIndex - deletedBeforeCount;
    }

    private _getNewRowIndexAfterChanges(originalIndex: number): number | null {
        return this._getActualRowIndexAfterChanges(originalIndex);
    }

    private _isRowVisibleAfterChanges(rowIndex: number): boolean {
        return !this.deletedRowIndices.includes(rowIndex);
    }

    private _generateColumnUniqueKey(columnMeta: GridHeader): string {
        if (!columnMeta) return '';
        if (columnMeta.type === 'serial') return 'serial';
        if (columnMeta.type === 'isPatient') return 'isPatient';
        if (columnMeta.type === 'isConfirmedCase') return 'isConfirmedCase';
        if (columnMeta.type === 'individualExposureTime') return 'individualExposureTime';
        if (columnMeta.type === 'symptomOnset') return 'symptomOnset';

        if (columnMeta.dataKey && columnMeta.cellIndex !== null && columnMeta.cellIndex !== undefined) {
            return `${columnMeta.dataKey}_${columnMeta.cellIndex}`;
        }
        if (columnMeta.dataKey) {
            return columnMeta.dataKey;
        }
        return '';
    }
}

export class FilterCSSUpdater {
    static handleFilterStateChange(newIsFiltered: boolean, oldIsFiltered: boolean, store: any, nextTick: (cb: () => void) => void) {
        if (newIsFiltered !== oldIsFiltered) {
            if (typeof window !== 'undefined') {
                nextTick(() => {
                    window.dispatchEvent(new CustomEvent('filter-state-changed', {
                        detail: { isFiltered: newIsFiltered }
                    }));
                });
            }
        }
    }
}