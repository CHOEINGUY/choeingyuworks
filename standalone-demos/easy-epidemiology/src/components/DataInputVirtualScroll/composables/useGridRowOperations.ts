
import { nextTick, type Ref } from 'vue';
//@ts-ignore
import { showToast } from '../logic/toast';
import { devLog } from '../../../utils/logger';
import { useEpidemicStore } from '@/stores/epidemicStore';
import { useHistoryStore } from '@/stores/historyStore';
import type { GridRow } from '@/types/grid';
import type { VirtualSelectionSystem } from '../logic/virtualSelectionSystem';

/**
 * Composable for row operations (add, delete, clear selection)
 */
export function useGridRowOperations(
    selectionSystem: VirtualSelectionSystem,
    rows: Ref<GridRow[]>,
    dateTimePickerState: { visible: boolean },
    closeDateTimePicker: () => void,
    tryStartOperation: (op: string, options?: { blocking?: boolean; timeout?: number }) => boolean,
    endOperation: (op: string) => void,
    t: (key: string, params?: any) => string = (k) => k
) {
    const epidemicStore = useEpidemicStore();
    const historyStore = useHistoryStore();

    function onDeleteEmptyRows() {
        if (!tryStartOperation('delete_empty_rows', { blocking: true, timeout: 10000 })) {
            return;
        }

        // 데이트피커가 열려있으면 닫기
        if (dateTimePickerState.visible) {
            devLog('[DataInputVirtual] 빈 행 삭제로 데이트피커 닫기');
            closeDateTimePicker();
        }

        historyStore.captureSnapshot('delete_empty_rows');
        epidemicStore.deleteEmptyRows();
        selectionSystem.clearSelection();
        showToast(t('dataInput.toast.grid.rowsDeleted'), 'success');
        endOperation('delete_empty_rows');
    }

    function onAddRows(count: number) {
        // 데이트피커가 열려있으면 닫기
        if (dateTimePickerState.visible) {
            devLog('[DataInputVirtual] 행 추가로 데이트피커 닫기');
            closeDateTimePicker();
        }

        historyStore.captureSnapshot('add_rows');

        const insertIndex = rows.value.length;
        epidemicStore.insertRowAt({ index: insertIndex, count });

        nextTick(() => {
            selectionSystem.clearSelection();
            showToast(t('dataInput.toast.grid.rowAdded', { count: count }), 'success');
        });
    }

    function onClearSelection() {
        // 데이트피커가 열려있으면 닫기
        if (dateTimePickerState.visible) {
            devLog('[DataInputVirtual] 선택 영역 초기화로 데이트피커 닫기');
            closeDateTimePicker();
        }
        selectionSystem.clearSelection();
    }

    return {
        onDeleteEmptyRows,
        onAddRows,
        onClearSelection
    };
}
