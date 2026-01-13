
import { nextTick, type Ref } from 'vue';
import { COL_TYPE_BASIC, COL_TYPE_IS_PATIENT, COL_TYPE_CONFIRMED_CASE, COL_TYPE_ONSET, COL_TYPE_INDIVIDUAL_EXPOSURE, COL_IDX_SERIAL } from '../constants/index';
// useContextMenu is used in the parent component
import { handleContextMenu } from '../handlers/contextMenuHandlers';
import { devLog, logger } from '../../../utils/logger';
import { useEpidemicStore } from '@/stores/epidemicStore';
import { useGridStore } from '@/stores/gridStore';
import type { GridHeader, GridRow } from '@/types/grid';
import type { ValidationManager } from '@/validation/ValidationManager';
import type { VirtualSelectionSystem } from '../logic/virtualSelectionSystem';
import { handleCopy, handlePaste } from '../handlers/keyboardClipboard';
import { 
    handleClearCellData, 
    handleRowActions, 
    handleColumnActions, 
    handleFilterActions,
    handleClipboardActions 
} from '../handlers/contextMenuActionHandlers';

export function useGridContextMenu(
    selectionSystem: VirtualSelectionSystem,
    allColumnsMeta: Ref<GridHeader[]>,
    contextMenuState: any, 
    showContextMenu: Function, 
    hideContextMenu: Function, 
    getOriginalIndex: (virtualIndex: number) => number,
    validationManager: ValidationManager | undefined,
    tryStartOperation: (op: string, options?: { blocking?: boolean; timeout?: number }) => boolean,
    endOperation: (op: string) => void,
    focusGrid: () => void,
    captureSnapshotWithFilter: (actionType: string, metadata?: any) => void,
    filterState: Ref<any>,
    rows: Ref<GridRow[]>,

    filteredRows: Ref<GridRow[]>,
    getCellValue: (row: GridRow | null, col: GridHeader | undefined, rowIndex: number) => any,
    storageManager: any
) {
    const epidemicStore = useEpidemicStore();
    const gridStore = useGridStore();

    // Helper to create context for handlers
    function createHandlerContext() {
        return {
            gridStore, 
            epidemicStore,
            selectionSystem,
            allColumnsMeta: allColumnsMeta.value,
            contextMenuState,
            showContextMenu,
            getOriginalIndex,
            rows,
            filteredRows,
            getCellValue,
            storageManager,
            validationManager,
            focusGrid,
            isEditing: selectionSystem.state.isEditing,
            startEditing: selectionSystem.startEditing,
            stopEditing: selectionSystem.stopEditing,
            captureSnapshotWithFilter,
            filterState
        } as any; // Cast to any or GridContext to avoid strict type matching issues for now, or match interface
    }

    function onContextMenu(event: MouseEvent, virtualRowIndex: number, colIndex: number) {
        // 연번 열(0번 인덱스)에서는 컨텍스트 메뉴 표시 안 함
        if (colIndex === COL_IDX_SERIAL) {
            return;
        }

        devLog('[DataInputVirtual] 컨텍스트 메뉴 이벤트:', {
            virtualRowIndex,
            colIndex,
            clientX: event.clientX,
            clientY: event.clientY
        });

        const context = createHandlerContext();
        // @ts-ignore
        handleContextMenu(event, virtualRowIndex, colIndex, context);
    }

    async function onContextMenuSelect(action?: any) {
        if (!action) return;
        
        // Capture target before hiding context menu to prevent null reference
        const capturedTarget = { ...contextMenuState.target };
        
        hideContextMenu();

        // Pass captured target to handlers
        const baseContext = createHandlerContext();
        const context = { ...baseContext, target: capturedTarget };

        // Delegate to handlers based on action prefix/type
        if (action === 'clear-cell-data') {
            handleClearCellData(context);
        } else if (action === 'copy-cell' || action === 'paste-cell') {
            handleClipboardActions(action, context);
        } else if (['add-row-above', 'add-row-below', 'delete-rows', 'clear-rows-data', 'delete-empty-rows'].includes(action)) {
            handleRowActions(action, context);
        } else if (['add-col-left', 'add-col-right', 'delete-cols', 'clear-cols-data'].includes(action)) {
            handleColumnActions(action, context);
        } else if (action.startsWith('filter-') || action === 'clear-all-filters') {
            handleFilterActions(action, context);
        }

        selectionSystem.clearIndividualSelections();
    }

    return {
        onContextMenu,
        onContextMenuSelect
    };
}
