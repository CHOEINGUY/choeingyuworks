
import { showToast } from '../logic/toast';
import type { GridHeader, GridRow } from '@/types/grid';
import type { GridContext } from '@/types/virtualGridContext';
import { useHistoryStore } from '@/stores/historyStore';

/**
 * 가상 스크롤용 클립보드 이벤트 핸들러
 */
export async function handleCopy(context: GridContext) {
    const { selectionSystem, rows, allColumnsMeta, getCellValue } = context;
    const { selectedRange, selectedRowsIndividual } = selectionSystem.state;

    let rowsToCopy: number[] = [];
    let minCol = -1;
    let maxCol = -1;

    if (selectedRowsIndividual.size > 0) {
        rowsToCopy = Array.from(selectedRowsIndividual).sort((a, b) => a - b);
        const validCols = allColumnsMeta.map(c => c.colIndex).filter((c): c is number => c !== undefined);
        minCol = Math.min(...validCols);
        maxCol = Math.max(...validCols);
    } else if (selectedRange.start.rowIndex !== null && selectedRange.start.colIndex !== null &&
               selectedRange.end.rowIndex !== null && selectedRange.end.colIndex !== null) {
        const startRow = Math.min(selectedRange.start.rowIndex, selectedRange.end.rowIndex);
        const endRow = Math.max(selectedRange.start.rowIndex, selectedRange.end.rowIndex);
        const startCol = Math.min(selectedRange.start.colIndex, selectedRange.end.colIndex);
        const endCol = Math.max(selectedRange.start.colIndex, selectedRange.end.colIndex);
        
        for (let r = startRow; r <= endRow; r++) rowsToCopy.push(r);
        minCol = startCol;
        maxCol = endCol;
    } else {
        return;
    }

    let clipboardData = '';

    for (let i = 0; i < rowsToCopy.length; i++) {
        const r = rowsToCopy[i];
        const rowData: string[] = [];
        for (let c = minCol; c <= maxCol; c++) {
            const columnMeta = allColumnsMeta.find(meta => meta.colIndex === c);
            if (!columnMeta) continue;

            if (r < 0) { // Header
                rowData.push(getCellValue(null, columnMeta, r));
            } else { // Body
                const row = rows.value[r];
                if (row) {
                     rowData.push(getCellValue(row, columnMeta, r));
                } else {
                     rowData.push('');
                }
            }
        }
        clipboardData += rowData.join('\t');
        if (i < rowsToCopy.length - 1) {
            clipboardData += '\n';
        }
    }

    try {
        await (navigator as any).clipboard.writeText(clipboardData);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showToast(context.t('common.copyFailed'), 'error');
    }
}

export async function handlePaste(context: GridContext) {
    const { selectionSystem, ensureCellIsVisible, epidemicStore, allColumnsMeta, t } = context;
    const { selectedCell } = selectionSystem.state;

    if (selectedCell.rowIndex === null || selectedCell.colIndex === null) {
        // Removed header check to allow pasting into header
        return;
    }

    try {

        const clipboardText = await (navigator as any).clipboard.readText();
        if (!clipboardText) return;
        
        const historyStore = useHistoryStore();
        historyStore.captureSnapshot('paste'); // Capture before paste

        const parsedData = clipboardText
            .split(/\r?\n/) // Windows(\r\n)와 Unix(\n) 모두 처리
            .filter((row: string) => row.trim() !== '') // 빈 행 제거
            .map((row: string) => row.split('\t').map((cell: string) => cell.replace(/\r/g, '').trim()));

        const startRow = selectedCell.rowIndex;
        const startCol = selectedCell.colIndex;

        // Implement paste logic using epidemicStore
        // Note: epidemicStore does not have a bulk 'pasteData' action, so we iterate.
        // Or if we implemented 'updateCellsBatch' or similar.
        // For efficiency, direct mutation via action would be best.
        // Assuming epidemicStore has updateCell.

        // Expand rows if needed
        const requiredRows = startRow + parsedData.length;
        if (requiredRows > context.rows.value.length) {
            const rowsToAdd = requiredRows - context.rows.value.length;
            epidemicStore.addRows(rowsToAdd); // Assuming addRows exists
        }

        const updates: any[] = [];

        parsedData.forEach((rowValues: string[], rIndex: number) => {
            const currentRowIndex = startRow + rIndex;
            rowValues.forEach((val: string, cIndex: number) => {
                 const currentColIndex = startCol + cIndex;
                 const columnMeta = allColumnsMeta.find(c => c.colIndex === currentColIndex);
                 if (columnMeta && columnMeta.dataKey && columnMeta.isEditable) {
                      epidemicStore.updateCell({
                          rowIndex: currentRowIndex,
                          key: columnMeta.dataKey,
                          value: val,
                          cellIndex: columnMeta.cellIndex ?? undefined
                      });
                 }
            });
        });

        // UX 개선: 붙여넣기된 영역을 시각적으로 선택하고 첫 번째 셀 활성화
        const endRow = startRow + parsedData.length - 1;
        const maxRowLength = parsedData.reduce((max: number, row: string[]) => Math.max(max, row.length), 0);
        const endCol = startCol + maxRowLength - 1;

        selectionSystem.setSelectionRange(startRow, startCol, endRow, endCol);
        if (ensureCellIsVisible) {
            await ensureCellIsVisible(startRow, startCol);
        }

        // Trigger Validation on Pasted Data
        if (context.validationManager) {
            context.validationManager.handlePasteData(parsedData, startRow, startCol, allColumnsMeta);
        }

    } catch (err) {
        console.error('Failed to paste text: ', err);
        showToast(t('common.pasteFailed'), 'error');
    }
}
