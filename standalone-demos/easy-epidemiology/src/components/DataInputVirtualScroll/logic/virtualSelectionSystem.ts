import { readonly, reactive } from 'vue';
import { GridHeader } from '@/types/grid';

export interface CellPosition {
  rowIndex: number | null;
  colIndex: number | null;
}

export interface SelectionRange {
  start: CellPosition;
  end: CellPosition;
}

export type DragContext = 'header' | 'body' | 'row' | null;

export interface SelectionState {
  selectedCell: CellPosition;
  selectionAnchor: CellPosition;
  selectedRange: SelectionRange;
  isDragging: boolean;
  dragContext: DragContext;
  isEditing: boolean;
  editingCell: CellPosition;
  originalCellValue: string | number | null | undefined;
  selectedCellsIndividual: Set<string>;
  selectedRowsIndividual: Set<number>;
}

export interface CellInputState {
  startEditing: (rowIndex: number, colIndex: number, value: any, column: GridHeader) => void;
  stopEditing: (shouldSave: boolean) => void;
  cancelEditing: () => void;
  [key: string]: any;
}

export interface VirtualSelectionSystem {
  state: SelectionState;
  selectCell: (rowIndex: number, colIndex: number) => void;
  selectRow: (rowIndex: number, allColumnsMeta: GridHeader[]) => void;
  startDrag: (colIndex: number) => void;
  updateDragSelection: (rowIndex: number, colIndex: number, allColumnsMeta: GridHeader[]) => void;
  endDragSelection: () => void;
  clearSelection: () => void;
  extendSelection: (targetRow: number, targetCol: number) => void;
  setSelectionRange: (startRow: number, startCol: number, endRow: number, endCol: number) => void;
  startEditing: (
    rowIndex: number,
    colIndex: number,
    getCellValue: (row: any, col: GridHeader, rowIndex: number) => any,
    row: any,
    cellInputState?: CellInputState,
    allColumnsMeta?: GridHeader[]
  ) => void;
  stopEditing: (shouldSaveChanges?: boolean, cellInputState?: CellInputState) => void;
  toggleIndividualCell: (rowIndex: number, colIndex: number) => void;
  toggleIndividualRow: (rowIndex: number) => void;
  selectRowRange: (startRow: number, endRow: number) => void;
  clearIndividualSelections: () => void;
}

/**
 * 가상 스크롤 환경에 최적화된 경량 선택 시스템입니다.
 */
export function useVirtualSelectionSystem(): VirtualSelectionSystem {
  const state = reactive<SelectionState>({
    /** 단일 선택된 셀 */
    selectedCell: { rowIndex: null, colIndex: null },
    /** 드래그 시작점 (고정점) */
    selectionAnchor: { rowIndex: null, colIndex: null },
    /** 드래그 중인 범위 */
    selectedRange: {
      start: { rowIndex: null, colIndex: null },
      end: { rowIndex: null, colIndex: null }
    },
    /** 드래그 중인지 여부 */
    isDragging: false,
    dragContext: null,
    /** 편집 중인지 여부 */
    isEditing: false,
    /** 편집 중인 셀 정보 */
    editingCell: { rowIndex: null, colIndex: null },
    /** 편집 시작 시 원본 값 (ESC 키로 복원용) */
    originalCellValue: null,
    /** Ctrl+Click 등으로 개별 선택된 셀 집합 */
    selectedCellsIndividual: new Set<string>(),
    /** Ctrl+Click 등으로 개별 선택된 행 집합 (serial 열 클릭) */
    selectedRowsIndividual: new Set<number>()
  });

  /**
   * 특정 셀을 선택합니다. (단일 클릭 시)
   */
  function selectCell(rowIndex: number, colIndex: number): void {
    state.selectedCell = { rowIndex, colIndex };
    state.selectionAnchor = { rowIndex, colIndex };
    state.selectedRange = {
      start: { rowIndex, colIndex },
      end: { rowIndex, colIndex }
    };
    console.log(`[VirtualSelection] Cell selected: ${rowIndex}, ${colIndex}`);
  }

  /**
   * 행 전체를 선택합니다.
   */
  function selectRow(rowIndex: number, allColumnsMeta: GridHeader[]): void {
    const lastCol = allColumnsMeta.length > 0 ? allColumnsMeta.length - 1 : 0;
    state.selectedCell = { rowIndex, colIndex: 0 };
    state.selectionAnchor = { rowIndex, colIndex: 0 };
    state.selectedRange.start = { rowIndex, colIndex: 0 };
    state.selectedRange.end = { rowIndex, colIndex: lastCol };
    console.log(`[VirtualSelection] Row selected: ${rowIndex}`);
  }

  /**
   * 드래그를 시작할 준비를 합니다.
   */
  function startDrag(colIndex: number): void {
    state.isDragging = true;
    const { rowIndex } = state.selectionAnchor;
    if (rowIndex === null) return;
    if (colIndex === 0) {
      state.dragContext = 'row';
    } else {
      state.dragContext = rowIndex < 0 ? 'header' : 'body';
    }
  }

  /**
   * 드래그 중 선택 범위를 업데이트합니다.
   */
  function updateDragSelection(rowIndex: number, colIndex: number, allColumnsMeta: GridHeader[]): void {
    if (!state.isDragging || state.selectionAnchor.rowIndex === null || state.selectionAnchor.colIndex === null) return;

    let targetRow = rowIndex;
    // 헤더/바디 경계 로직
    if (state.dragContext === 'header' && targetRow >= 0) {
      targetRow = -1;
    } else if (state.dragContext === 'body' && targetRow < 0) {
      targetRow = 0;
    }

    let startRow, endRow, startCol, endCol;
    if (state.dragContext === 'row') {
      startRow = Math.min(state.selectionAnchor.rowIndex, targetRow);
      endRow = Math.max(state.selectionAnchor.rowIndex, targetRow);
      startCol = 0;
      endCol = allColumnsMeta.length - 1;
    } else {
      startRow = Math.min(state.selectionAnchor.rowIndex, targetRow);
      endRow = Math.max(state.selectionAnchor.rowIndex, targetRow);
      startCol = Math.min(state.selectionAnchor.colIndex as number, colIndex);
      endCol = Math.max(state.selectionAnchor.colIndex as number, colIndex);
    }

    state.selectedRange.start = { rowIndex: startRow, colIndex: startCol };
    state.selectedRange.end = { rowIndex: endRow, colIndex: endCol };
    state.selectedCell = { rowIndex: targetRow, colIndex };
  }

  /**
   * 드래그 선택을 종료합니다.
   */
  function endDragSelection(): void {
    if (state.selectedRange.start.rowIndex !== null &&
      state.selectedRange.start.colIndex !== null) {
      state.selectedCell = {
        rowIndex: state.selectedRange.start.rowIndex,
        colIndex: state.selectedRange.start.colIndex
      };
    }
    state.isDragging = false;
    state.dragContext = null;
    console.log('[VirtualSelection] Drag ended. First cell selected.');
  }

  /**
   * 모든 선택을 해제합니다.
   */
  function clearSelection(): void {
    state.selectedCell = { rowIndex: null, colIndex: null };
    state.selectionAnchor = { rowIndex: null, colIndex: null };
    state.selectedRange = {
      start: { rowIndex: null, colIndex: null },
      end: { rowIndex: null, colIndex: null }
    };
    state.selectedCellsIndividual.clear();
    state.selectedRowsIndividual.clear();
  }

  function extendSelection(targetRow: number, targetCol: number): void {
    if (state.selectionAnchor.rowIndex === null || state.selectionAnchor.colIndex === null) {
      selectCell(targetRow, targetCol);
      return;
    }
    const anchor = state.selectionAnchor;
    const startRow = Math.min(anchor.rowIndex!, targetRow);
    const endRow = Math.max(anchor.rowIndex!, targetRow);
    const startCol = Math.min(anchor.colIndex!, targetCol);
    const endCol = Math.max(anchor.colIndex!, targetCol);
    state.selectedRange.start = { rowIndex: startRow, colIndex: startCol };
    state.selectedRange.end = { rowIndex: endRow, colIndex: endCol };
    state.selectedCell = { rowIndex: targetRow, colIndex: targetCol };
  }

  function setSelectionRange(startRow: number, startCol: number, endRow: number, endCol: number): void {
    state.selectedRange.start = { rowIndex: startRow, colIndex: startCol };
    state.selectedRange.end = { rowIndex: endRow, colIndex: endCol };
    state.selectedCell = { rowIndex: startRow, colIndex: startCol };
    state.selectionAnchor = { rowIndex: startRow, colIndex: startCol };
    console.log(`[VirtualSelection] Range selected: ${startRow},${startCol} to ${endRow},${endCol}`);
  }

  function startEditing(
    rowIndex: number,
    colIndex: number,
    getCellValue: (row: any, col: GridHeader, rowIndex: number) => any,
    row: any,
    cellInputState: CellInputState | null = null,
    allColumnsMeta: GridHeader[] | null = null
  ): void {
    if (state.isEditing && state.editingCell.rowIndex === rowIndex && state.editingCell.colIndex === colIndex) {
      return;
    }
    if (state.isEditing) {
      stopEditing(true);
    }

    let column: GridHeader | undefined;
    if (allColumnsMeta) {
      column = allColumnsMeta.find(c => c.colIndex === colIndex);
    } else {
      column = getColumnMeta(colIndex);
    }

    if (!column || !column.isEditable) return;

    const originalValue = getCellValue(row, column, rowIndex);
    state.originalCellValue = originalValue;

    if (cellInputState) {
      (cellInputState as any).startEditing(rowIndex, colIndex, originalValue, column);
    }
    state.isEditing = true;
    state.editingCell = { rowIndex, colIndex };
    console.log(`[VirtualSelection] Start editing: ${rowIndex}, ${colIndex}`);
  }

  function stopEditing(shouldSaveChanges: boolean = true, cellInputState: CellInputState | null = null): void {
    if (!state.isEditing) return;

    const { rowIndex: prevRow, colIndex: prevCol } = state.editingCell;
    const originalValue = state.originalCellValue;

    if (cellInputState) {
      if (shouldSaveChanges) {
        cellInputState.stopEditing(true);
      } else {
        cellInputState.cancelEditing();
      }
    }
    state.isEditing = false;
    state.editingCell = { rowIndex: null, colIndex: null };
    state.originalCellValue = null;
    console.log(`[VirtualSelection] Stop editing. Save changes: ${shouldSaveChanges}`);

    try {
      let selector: string | null = null;
      if (prevRow !== null && prevCol !== null) {
        selector = prevRow < 0
          ? `[data-col="${prevCol}"]`
          : `[data-row="${prevRow}"][data-col="${prevCol}"]`;
      }
      if (selector) {
        const cellElem = document.querySelector(selector) as HTMLElement;
        if (cellElem) {
          cellElem.removeAttribute('contenteditable');
          cellElem.blur();
          if (!shouldSaveChanges && originalValue !== null) {
            cellElem.textContent = String(originalValue ?? '');
            console.log(`[VirtualSelection] 원래 값으로 복원: ${originalValue}`);
          }
        }
      }
      const sel = window.getSelection();
      if (sel && sel.removeAllRanges) {
        sel.removeAllRanges();
      }
    } catch (err) {
      console.warn('[VirtualSelection] stopEditing DOM cleanup failed:', err);
    }
  }

  function toggleIndividualCell(rowIndex: number, colIndex: number): void {
    const key = `${rowIndex}_${colIndex}`;
    if (state.selectedCellsIndividual.has(key)) {
      state.selectedCellsIndividual.delete(key);
    } else {
      state.selectedCellsIndividual.add(key);
    }
  }

  function toggleIndividualRow(rowIndex: number): void {
    if (state.selectedRowsIndividual.has(rowIndex)) {
      state.selectedRowsIndividual.delete(rowIndex);
    } else {
      state.selectedRowsIndividual.add(rowIndex);
    }
  }

  function clearIndividualSelections(): void {
    state.selectedCellsIndividual.clear();
    state.selectedRowsIndividual.clear();
  }

  function selectRowRange(startRow: number, endRow: number): void {
    state.selectedRowsIndividual.clear();
    const [s, e] = startRow <= endRow ? [startRow, endRow] : [endRow, startRow];
    for (let i = s; i <= e; i++) {
      state.selectedRowsIndividual.add(i);
    }
  }

  return {
    state: readonly(state) as unknown as SelectionState,
    selectCell,
    selectRow,
    startDrag,
    updateDragSelection,
    endDragSelection,
    clearSelection,
    extendSelection,
    setSelectionRange,
    startEditing,
    stopEditing,
    toggleIndividualCell,
    toggleIndividualRow,
    selectRowRange,
    clearIndividualSelections
  };
}

let allColumnsMetaCache: GridHeader[] = [];
function getColumnMeta(colIndex: number): GridHeader | undefined {
  if (allColumnsMetaCache.length === 0) {
    console.warn('allColumnsMeta is not set. Please ensure it is passed correctly.');
    return undefined;
  }
  return allColumnsMetaCache.find(c => c.colIndex === colIndex);
}

export function setColumnsMeta(columns: GridHeader[]): void {
  allColumnsMetaCache = columns;
}
