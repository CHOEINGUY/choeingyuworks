
import { nextTick, type Ref } from 'vue';
import { logger, devLog } from '../../../utils/logger';
import { useHistoryStore } from '@/stores/historyStore';
import { useGridStore } from '@/stores/gridStore';
import type { ValidationManager } from '@/validation/ValidationManager';

/**
 * Composable for Undo/Redo handlers
 */
export function useUndoRedoHandlers(
    validationManager: ValidationManager | undefined,
    filterState: Ref<any>,
    syncFilterStateAfterHistoryChange: () => void,
    dateTimePickerState: { visible: boolean },
    closeDateTimePicker: () => void,
    gridBodyRef: Ref<any>,
    gridHeaderRef: Ref<any>
) {
    const historyStore = useHistoryStore();
    const gridStore = useGridStore();

    function onUndo() {
        // 데이트피커가 열려있으면 닫기
        if (dateTimePickerState.visible) {
            closeDateTimePicker();
        }

        historyStore.undo();

        // ValidationManager 타이머만 정리 (오류는 Store에서 복원됨)
        if (validationManager && typeof validationManager.onDataReset === 'function') {
            validationManager.onDataReset();
        }

        // 필터 상태 동기화
        syncFilterStateAfterHistoryChange();

        // 추가적인 필터 상태 확인 및 동기화
        nextTick(() => {
            // 필터 상태가 여전히 불일치하면 동기화
            if (JSON.stringify(filterState.value) !== JSON.stringify(gridStore.filterState)) {
                filterState.value = { ...gridStore.filterState };
                
                const gridBody = gridBodyRef.value;
                const gridHeader = gridHeaderRef.value;
                if (gridBody && gridHeader) {
                    if (gridBody.$forceUpdate) gridBody.$forceUpdate();
                    if (gridHeader.$forceUpdate) gridHeader.$forceUpdate();
                }
            }
        });
    }

    function onRedo() {
        devLog('[Redo] ===== Redo 시작 =====');
        
        if (dateTimePickerState.visible) {
            closeDateTimePicker();
        }

        historyStore.redo();

        // ValidationManager 타이머만 정리
        if (validationManager && typeof validationManager.onDataReset === 'function') {
            validationManager.onDataReset();
        }

        // 필터 상태 동기화
        syncFilterStateAfterHistoryChange();

        // 추가적인 필터 상태 확인 및 동기화
        nextTick(() => {
            if (JSON.stringify(filterState.value) !== JSON.stringify(gridStore.filterState)) {
                logger.warn('[Redo] 필터 상태 불일치 감지 - 동기화 실행');
                filterState.value = { ...gridStore.filterState };
                
                const gridBody = gridBodyRef.value;
                const gridHeader = gridHeaderRef.value;
                if (gridBody && gridHeader) {
                    if (gridBody.$forceUpdate) gridBody.$forceUpdate();
                    if (gridHeader.$forceUpdate) gridHeader.$forceUpdate();
                }
            }
        });
    }

    return {
        onUndo,
        onRedo
    };
}
