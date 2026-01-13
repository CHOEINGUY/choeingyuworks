
import { nextTick } from 'vue';
import { findNextCellForFastNavigation, handleNavigationKeyDown } from './keyboardNavigation';
import { handleDateTimeTypeToEdit, setupDateTimeInputHandling } from './keyboardDateTime';
import { handleCopy, handlePaste } from './keyboardClipboard';
import { handleTypeToEdit, handleClearSelectedData, handleEditModeKeyDown, isTypingKey } from './keyboardEditing';
import { GridContext } from '@/types/virtualGridContext';
import { GridHeader } from '@/types/grid';
import { useHistoryStore } from '@/stores/historyStore';

export { setupDateTimeInputHandling }; 

export async function handleVirtualKeyDown(
    event: KeyboardEvent,
    context: GridContext
): Promise<void> {
    const { selectionSystem, rows, allColumnsMeta, ensureCellIsVisible, isEditing, startEditing, getCellValue, gridStore } = context;
    const { state } = selectionSystem;
    const { key, ctrlKey, shiftKey, metaKey } = event;
    const isCtrlOrCmd = ctrlKey || metaKey;

    if (isEditing) {
        await handleEditModeKeyDown(event, context);
        return;
    }

    if (state.selectedCell.rowIndex === null) return;

    if (isCtrlOrCmd) {
        if (key.toLowerCase() === 'c') {
            event.preventDefault();
            await handleCopy(context);
            return;
        }
        if (key.toLowerCase() === 'v') {
            event.preventDefault();
            await handlePaste(context);
            await handlePaste(context);
            return;
        }
        
        // Undo
        if (key.toLowerCase() === 'z' && !shiftKey) {
            event.preventDefault();
            const historyStore = useHistoryStore();
            if (historyStore.canUndo) {
                 historyStore.undo();
            }
            return;
        }

        // Redo (Ctrl+Y or Ctrl+Shift+Z)
        if ((key.toLowerCase() === 'y') || (key.toLowerCase() === 'z' && shiftKey)) {
            event.preventDefault();
            const historyStore = useHistoryStore();
            if (historyStore.canRedo) {
                 historyStore.redo();
            }
            return;
        }
    }

    const { rowIndex: currentRow, colIndex: currentCol } = state.selectedCell;
    if (currentRow === null || currentCol === null) return;

    let nextRow = currentRow;
    let nextCol = currentCol;

    if (ctrlKey) {
        let direction: 'up' | 'down' | 'left' | 'right' | null = null;
        if (key === 'ArrowUp') direction = 'up';
        if (key === 'ArrowDown') direction = 'down';
        if (key === 'ArrowLeft') direction = 'left';
        if (key === 'ArrowRight') direction = 'right';

        if (direction) {
            event.preventDefault();

            if (direction === 'left' && currentCol === 1) {
                return;
            }

            const targetCell = findNextCellForFastNavigation(
                currentRow, 
                currentCol, 
                direction, 
                rows.value, 
                allColumnsMeta
            );
            
            nextRow = targetCell.rowIndex;
            nextCol = targetCell.colIndex;

            if (nextRow !== null && nextCol !== null) {
                if (direction === 'left') {
                    nextCol = Math.max(1, nextCol);
                }

                if (shiftKey) {
                    selectionSystem.extendSelection(nextRow, nextCol);
                } else {
                    selectionSystem.selectCell(nextRow, nextCol);
                }

                if (ensureCellIsVisible) {
                    await ensureCellIsVisible(nextRow, nextCol);
                }
            }
            return; 
        }
    }

    if (await handleNavigationKeyDown(event, context)) {
        return;
    }

    if (key === 'F2') {
        event.preventDefault();
        if (currentRow < 0) {
            if (startEditing) {
                startEditing(currentRow, currentCol, getCellValue, null, gridStore as any, allColumnsMeta);
                await nextTick();
                const cellElement = document.querySelector(`[data-col="${currentCol}"]`) as HTMLElement;
                if (cellElement) cellElement.focus();
            }
        } else {
            const row = rows.value[currentRow];
            if (row && startEditing) {
                startEditing(currentRow, currentCol, getCellValue, row, gridStore as any, allColumnsMeta);
                await nextTick();
                const cellElement = document.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`) as HTMLElement;
                if (cellElement) cellElement.focus();
            }
        }
    }
    else if (isTypingKey(key) && !ctrlKey && !event.metaKey) {
        event.preventDefault();

        const columnMeta = allColumnsMeta.find((col: GridHeader) => col.colIndex === currentCol);
        const isDateTimeColumn = columnMeta && (
            columnMeta.type === 'symptomOnset' ||
            columnMeta.type === 'individualExposureTime'
        );

        if (isDateTimeColumn && currentRow !== null && currentCol !== null) {
            handleDateTimeTypeToEdit(event, context, currentRow, currentCol);
        } else {
            handleTypeToEdit(event, context);
        }
    }

    if (key === 'Delete' || key === 'Backspace') {
        event.preventDefault();
        const result = await handleClearSelectedData(context);
        return;
    }
}
