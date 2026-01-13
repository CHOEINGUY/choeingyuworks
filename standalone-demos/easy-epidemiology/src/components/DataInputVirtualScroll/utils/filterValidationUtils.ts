/**
 * 필터 기능과 유효성 검사 CSS 통합 관리 유틸리티
 *
 * 이 파일은 필터가 적용된 상태에서 유효성 에러 CSS가 정확한 위치에 표시되도록
 * 인덱스 매핑과 CSS 클래스 관리를 통합적으로 처리합니다.
 */
import { getColumnUniqueKey, getErrorKey } from './validationUtils';
import { createComponentLogger } from '../../../utils/logger';
import { GridRow, GridHeader } from '@/types/grid';

const logger = createComponentLogger('FilterValidationUtils');

/**
 * 필터된 상태에서의 인덱스 매핑과 유효성 검사 관리를 위한 클래스
 */
export class FilteredValidationManager {
    // 원본 인덱스 -> 가상 인덱스 매핑
    originalToVirtual: Map<number, number>;
    // 가상 인덱스 -> 원본 인덱스 매핑  
    virtualToOriginal: Map<number, number>;
    // 필터 상태
    isFiltered: boolean;
    // 필터된 행 데이터
    filteredRows: GridRow[];
    // 유효성 에러 Map
    validationErrors: Map<string, any>;

    constructor() {
        this.originalToVirtual = new Map();
        this.virtualToOriginal = new Map();
        this.isFiltered = false;
        this.filteredRows = [];
        this.validationErrors = new Map();
    }

    /**
     * 필터 상태와 데이터 업데이트
     */
    updateFilterState(isFiltered: boolean, filteredRows: GridRow[], validationErrors: Map<string, any>) {
        this.isFiltered = isFiltered;
        this.filteredRows = filteredRows || [];
        this.validationErrors = validationErrors || new Map();
        // 매핑 재계산
        this._rebuildMappings();
    }

    /**
     * 매핑 재구성
     */
    private _rebuildMappings() {
        this.originalToVirtual.clear();
        this.virtualToOriginal.clear();
        if (!this.isFiltered) {
            return;
        }
        this.filteredRows.forEach((row, virtualIndex) => {
            const originalIndex = row._originalIndex as number | undefined;
            if (originalIndex !== undefined) {
                this.originalToVirtual.set(originalIndex, virtualIndex);
                this.virtualToOriginal.set(virtualIndex, originalIndex);
            }
        });
    }

    /**
     * 가상 인덱스로 에러 여부 확인
     */
    hasError(virtualIndex: number, colIndex: number, columnMeta: GridHeader | null): boolean {
        if (!this.isFiltered) {
            // 필터되지 않은 상태에서는 가상 인덱스가 곧 원본 인덱스
            return this._hasErrorByOriginalIndex(virtualIndex, colIndex, columnMeta);
        }
        // 필터된 상태에서는 원본 인덱스로 변환 후 확인
        const originalIndex = this.virtualToOriginal.get(virtualIndex);
        if (originalIndex === undefined) {
            return false;
        }
        return this._hasErrorByOriginalIndex(originalIndex, colIndex, columnMeta);
    }

    /**
     * 원본 인덱스로 에러 여부 확인 (내부 메서드)
     */
    private _hasErrorByOriginalIndex(originalIndex: number, colIndex: number, columnMeta: GridHeader | null): boolean {
        if (!columnMeta)
            return false;
        const uniqueKey = getColumnUniqueKey(columnMeta);
        if (!uniqueKey)
            return false;
        const errorKey = getErrorKey(originalIndex, uniqueKey);
        return this.validationErrors.has(errorKey);
    }

    /**
     * 가상 인덱스로 에러 메시지 조회
     */
    getErrorMessage(virtualIndex: number, colIndex: number, columnMeta: GridHeader | null): string {
        if (!this.isFiltered) {
            return this._getErrorMessageByOriginalIndex(virtualIndex, colIndex, columnMeta);
        }
        const originalIndex = this.virtualToOriginal.get(virtualIndex);
        if (originalIndex === undefined) {
            return '';
        }
        return this._getErrorMessageByOriginalIndex(originalIndex, colIndex, columnMeta);
    }

    /**
     * 원본 인덱스로 에러 메시지 조회 (내부 메서드)
     */
    private _getErrorMessageByOriginalIndex(originalIndex: number, colIndex: number, columnMeta: GridHeader | null): string {
        if (!columnMeta)
            return '';
        const uniqueKey = getColumnUniqueKey(columnMeta);
        if (!uniqueKey)
            return '';
        const errorKey = getErrorKey(originalIndex, uniqueKey);
        const error = this.validationErrors.get(errorKey);
        return error?.message || '';
    }

    /**
     * 원본 인덱스로 가상 인덱스 변환
     */
    getVirtualIndex(originalIndex: number): number | undefined {
        if (!this.isFiltered) {
            return originalIndex;
        }
        return this.originalToVirtual.get(originalIndex);
    }

    /**
     * 가상 인덱스로 원본 인덱스 변환
     */
    getOriginalIndex(virtualIndex: number): number | undefined {
        if (!this.isFiltered) {
            return virtualIndex;
        }
        return this.virtualToOriginal.get(virtualIndex);
    }

    /**
     * 필터된 상태에서 보이는 유효성 에러만 반환
     */
    getVisibleErrors(): Map<string, any> {
        if (!this.isFiltered) {
            return this.validationErrors;
        }
        const visibleErrors = new Map();
        this.validationErrors.forEach((error, errorKey) => {
            const [rowIndexStr] = errorKey.split('_');
            const originalRowIndex = parseInt(rowIndexStr, 10);
            // 필터된 행들 중에서 해당 원본 인덱스가 있는지 확인
            const isVisible = this.filteredRows.some(row => row._originalIndex === originalRowIndex);
            if (isVisible) {
                visibleErrors.set(errorKey, error);
            }
        });
        return visibleErrors;
    }

    /**
     * 셀 클래스 계산 (통합 메서드)
     */
    getCellClasses(virtualIndex: number, colIndex: number, columnMeta: GridHeader | null, baseClasses: string[] = []): string[] {
        const classes = [...baseClasses];
        // 유효성 에러 클래스 추가
        if (this.hasError(virtualIndex, colIndex, columnMeta)) {
            classes.push('validation-error');
        }
        return classes;
    }

    /**
     * 디버깅 정보 출력
     */
    debugInfo() {
        logger.debug('[FilteredValidationManager] 디버깅 정보:', {
            isFiltered: this.isFiltered,
            filteredRowsCount: this.filteredRows.length,
            validationErrorsCount: this.validationErrors.size,
            originalToVirtualSize: this.originalToVirtual.size,
            virtualToOriginalSize: this.virtualToOriginal.size,
            mappings: Array.from(this.originalToVirtual.entries()).slice(0, 5) // 처음 5개만
        });
    }
}

/**
 * 필터 상태에 따른 CSS 클래스 관리
 */
export class FilterCSSManager {
    /**
     * 필터 상태에 따른 컨테이너 클래스 계산
     */
    static getContainerClasses(isFiltered: boolean) {
        return {
            'filtered': isFiltered
        };
    }

    /**
     * 필터 상태에 따른 셀 클래스 계산
     */
    static getCellClasses(isFiltered: boolean, cellType: 'normal' | 'serial' | 'error' = 'normal', baseClasses: string[] = []) {
        const classes = [...baseClasses];
        if (isFiltered) {
            if (cellType === 'serial') {
                classes.push('filtered-serial-cell');
            }
            else if (cellType === 'error') {
                classes.push('filtered-error-cell');
            }
        }
        return classes;
    }
}

/**
 * 필터 상태 변경 시 CSS 업데이트를 위한 헬퍼 함수
 */
export class FilterCSSUpdater {
    /**
     * 필터 상태 변경 시 CSS 강제 업데이트
     */
    static forceCSSUpdate(store: any, nextTick: (cb: () => void) => void) {
        nextTick(() => {
            // validationErrors의 버전을 강제로 증가시켜 반응성 트리거
            if (store.state.epidemic && store.state.epidemic.validationState) {
                store.state.epidemic.validationState.version++;
            }
            // DOM 강제 업데이트를 위한 추가 틱
            nextTick(() => {
                logger.debug('[FilterCSSUpdater] 유효성 에러 CSS 업데이트 완료');
            });
        });
    }

    /**
     * 필터 상태 변경 감지 및 CSS 업데이트
     */
    static handleFilterStateChange(newIsFiltered: boolean, oldIsFiltered: boolean, store: any, nextTick: (cb: () => void) => void) {
        if (newIsFiltered !== oldIsFiltered) {
            logger.debug('[FilterCSSUpdater] 필터 상태 변경 감지:', { newIsFiltered, oldIsFiltered });
            this.forceCSSUpdate(store, nextTick);
        }
    }
}