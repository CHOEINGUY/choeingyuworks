
import { ref, type Ref } from 'vue';
import { devLog } from '../../../utils/logger';
import {
  handleVirtualCellMouseDown as handleVirtualCellMouseDownImpl,
  handleVirtualDocumentMouseMove as handleVirtualDocumentMouseMoveImpl,
  handleVirtualDocumentMouseUp as handleVirtualDocumentMouseUpImpl
} from '../handlers/virtualMouseHandlers';
import { handleVirtualCellDoubleClick as handleVirtualCellDoubleClickImpl } from '../handlers/virtualEditHandlers';
import { handleVirtualKeyDown as handleVirtualKeyDownImpl } from '../handlers/virtualKeyboardHandlers';
import { useGridStore } from '@/stores/gridStore';
import { useEpidemicStore } from '@/stores/epidemicStore';
import type { GridHeader, GridRow } from '@/types/grid';
import type { VirtualSelectionSystem } from '../logic/virtualSelectionSystem';
import type { ValidationManager } from '@/validation/ValidationManager';
import type { GridContext, OverlayController } from '@/types/virtualGridContext';
import type { DateTimePickerState } from '@/types/virtualGridContext';
import type { EnhancedStorageManager } from '@/store/enhancedStorageManager';

export function useGridInteraction(
  selectionSystem: VirtualSelectionSystem,
  allColumnsMeta: Ref<GridHeader[]>,
  rows: Ref<GridRow[]>,
  filteredRows: Ref<GridRow[]>,
  focusGrid: () => void,
  ensureCellIsVisible: (row: number, col: number) => Promise<void>,
  validationManager: ValidationManager | undefined,
  dateTimePickerState: DateTimePickerState,
  dateTimePickerRef: Ref<any>,
  gridBodyRef: Ref<any>,
  closeDateTimePicker: () => void,
  onDateTimeCancel: () => void,
  storageManager: EnhancedStorageManager,
  t: (key: string, params?: any) => string,
  overlayController?: OverlayController
) {
  const gridStore = useGridStore();
  const epidemicStore = useEpidemicStore();
  
  const onDocumentMouseMoveBound = ref<((e: MouseEvent) => void) | null>(null);
  const onDocumentMouseUpBound = ref<((e: MouseEvent) => void) | null>(null);

  // --- Helper Functions ---
  function getCellValue(row: GridRow | null, columnMeta: GridHeader | undefined, rowIndex: number = -1): any {
    if (!columnMeta) return '';

    if (rowIndex < 0) { // Header cell
      const headerText = columnMeta.headerText || '';
      return headerText.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '').trim();
    }

    if (columnMeta.type === 'serial') {
      if (row && (row as any)._originalIndex !== undefined) {
        return (row as any)._originalIndex + 1;
      }
      return rowIndex + 1;
    }

    if (!row || !columnMeta.dataKey) return '';

    if (columnMeta.cellIndex !== null && columnMeta.cellIndex !== undefined) {
      const val = (row as any)[columnMeta.dataKey];
      if (!val || !Array.isArray(val)) {
        return '';
      }
      return val[columnMeta.cellIndex] ?? '';
    } else {
      return (row as any)[columnMeta.dataKey] ?? '';
    }
  }

  const getOriginalIndex = (virtualIndex: number) => {
    if (virtualIndex < 0) return virtualIndex;
    // Use filteredRows to get the correct row object currently displayed at this index
    const currentRows = filteredRows.value;
    if (virtualIndex >= currentRows.length) return virtualIndex;
    const row = currentRows[virtualIndex] as any;
    // The filtered row object should have _originalIndex preserved
    return row?._originalIndex ?? virtualIndex;
  };

  function createHandlerContext(): GridContext {
    return {
      getOriginalIndex,
      allColumnsMeta: allColumnsMeta.value,
      selectionSystem,
      rows,
      filteredRows,
      getCellValue,
      gridStore,
      epidemicStore,
      storageManager,
      validationManager,
      dateTimePickerRef,
      dateTimePickerState,
      ensureCellIsVisible,
      focusGrid,
      gridBodyContainer: gridBodyRef.value?.bodyContainer || gridBodyRef.value?.$el || gridBodyRef.value,
      isEditing: selectionSystem.state.isEditing,
      startEditing: selectionSystem.startEditing.bind(selectionSystem),
      stopEditing: selectionSystem.stopEditing.bind(selectionSystem),
      t,
      overlayController
    };
  }

  // --- Cell Interaction Handlers ---

  function handleVirtualCellMouseDown(virtualRowIndex: number, colIndex: number, event: MouseEvent, context: GridContext) {
    handleVirtualCellMouseDownImpl(virtualRowIndex, colIndex, event, context);
  }

  function handleVirtualDocumentMouseMove(event: MouseEvent, context: GridContext) {
    handleVirtualDocumentMouseMoveImpl(event, context);
  }

  function handleVirtualDocumentMouseUp(event: MouseEvent, context: GridContext) {
    handleVirtualDocumentMouseUpImpl(event, context);
  }

  function onCellMouseDown(rowIndex: number, colIndex: number, event: MouseEvent) {
    if (dateTimePickerState.visible) {
      closeDateTimePicker();
    }

    // 오버레이가 열려있으면 먼저 닫기 (다른 셀 클릭 시)
    if (typeof window !== 'undefined' && (window as any).isCellEditOverlayVisible?.()) {
      (window as any).closeCellEditOverlay?.();
    }

    if (event.button === 2) {
      return;
    }

    // VirtualGridBody에서 이미 원본 인덱스(originalIndex)를 emit하므로
    // rowIndex는 이미 원본 데이터 인덱스입니다.
    const originalRowIndex = rowIndex;
    const row = rows.value[rowIndex] as any;

    if (
      selectionSystem.state.isEditing &&
            selectionSystem.state.editingCell.rowIndex === originalRowIndex &&
            selectionSystem.state.editingCell.colIndex === colIndex
    ) {
      devLog('[UseGridInteraction] 편집 모드에서 같은 셀 클릭 - 텍스트 커서 이동만 허용');
      return;
    }

    if (
      selectionSystem.state.isEditing &&
            (selectionSystem.state.editingCell.rowIndex !== originalRowIndex ||
                selectionSystem.state.editingCell.colIndex !== colIndex) &&
            (event as any).detail !== 2 
    ) {
      const { rowIndex: editRow, colIndex: editCol } = selectionSystem.state.editingCell;
      const tempValue = gridStore.tempValue;
      const columnMeta = allColumnsMeta.value.find(c => c.colIndex === editCol);

      if (tempValue !== null && columnMeta) {
         const editData = {
            cell: { rowIndex: editRow as number, colIndex: editCol as number, dataKey: columnMeta.dataKey || '', cellIndex: columnMeta.cellIndex },
            originalValue: '', 
            value: tempValue,
            columnMeta,
            editDuration: 0,
            hasChanged: true
         };
         
         storageManager.executeSave(editData);
         storageManager.scheduleSave(editData);
         
         devLog(`[UseGridInteraction] 다른 셀 클릭으로 편집 완료: ${editRow}, ${editCol} = ${tempValue}`);
         if (validationManager) {
           validationManager.validateCell(editRow as number, editCol as number, tempValue, columnMeta.type, true);
         }
      }

      gridStore.confirmEditing();
      selectionSystem.stopEditing(true);
    }

    focusGrid();

    const context = createHandlerContext();
    // 이미 originalRowIndex가 전달되므로, getOriginalIndex 변환이 필요 없음
    // handleVirtualCellMouseDown은 이 값을 그대로 사용해야 함
    handleVirtualCellMouseDown(originalRowIndex, colIndex, event, context);

    onDocumentMouseMoveBound.value = (e) => onDocumentMouseMove(e);
    onDocumentMouseUpBound.value = (e) => onDocumentMouseUp(e);

    document.addEventListener('mousemove', onDocumentMouseMoveBound.value);
    document.addEventListener('mouseup', onDocumentMouseUpBound.value, { once: true });
  }

  function onDocumentMouseMove(event: MouseEvent) {
    const context = createHandlerContext();
    handleVirtualDocumentMouseMove(event, context);
  }

  function onDocumentMouseUp(event: MouseEvent) {
    if (onDocumentMouseMoveBound.value) {
      document.removeEventListener('mousemove', onDocumentMouseMoveBound.value);
      onDocumentMouseMoveBound.value = null;
    }
    const context = createHandlerContext();
    handleVirtualDocumentMouseUp(event, context);
  }

  function onCellDoubleClick(rowIndex: number, colIndex: number, event: MouseEvent) {
    const context = createHandlerContext();
    // @ts-ignore
    handleVirtualCellDoubleClickImpl(rowIndex, colIndex, event, context as any);
  }

  function onUpdateCellValueFromBar(newValue: string | number | undefined | null) {
    const { rowIndex, colIndex } = selectionSystem.state.selectedCell;
    if (rowIndex === null || colIndex === null) return;

    const columnMeta = allColumnsMeta.value.find(c => c.colIndex === colIndex);
    if (!columnMeta || !columnMeta.isEditable) return;

    gridStore.updateTempValue(newValue !== undefined && newValue !== null ? String(newValue) : '');
  }

  function onEnterPressedFromBar() {
    const { rowIndex, colIndex } = selectionSystem.state.selectedCell;
    if (rowIndex === null || colIndex === null) return;

    let nextRow = rowIndex;
    if (rowIndex < 0) {
      nextRow = 0;
    } else if (rowIndex < rows.value.length - 1) {
      nextRow = rowIndex + 1;
    }

    selectionSystem.selectCell(nextRow, colIndex);
    ensureCellIsVisible(nextRow, colIndex);
    focusGrid();
  }

  function onKeyDown(event: KeyboardEvent) {
    if (dateTimePickerState.visible) {
      switch (event.key) {
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        onDateTimeCancel();
        return;
      case 'Enter':
      case 'Tab':
        event.preventDefault();
        event.stopPropagation();
        if (dateTimePickerRef.value?.confirm) {
          dateTimePickerRef.value.confirm();
        }
        return;
      default:
        return;
      }
    }

    const context = createHandlerContext();
    // @ts-ignore 
    handleVirtualKeyDownImpl(event, context as any);
  }

  function onCellEditComplete(rowIndex: number, colIndex: number, shouldSave = true) {
    if (!shouldSave) {
      gridStore.cancelEditing();
      return;
    }

    const tempValue = gridStore.tempValue;
    if (tempValue !== null) {
      const columnMeta = allColumnsMeta.value.find(c => c.colIndex === colIndex);
      if (columnMeta) {
         const editData = {
            cell: { rowIndex, colIndex, dataKey: columnMeta.dataKey || '', cellIndex: columnMeta.cellIndex },
            originalValue: '',
            value: tempValue,
            columnMeta,
            editDuration: 0,
            hasChanged: true 
         };
         
         storageManager.executeSave(editData);
         // storageManager.scheduleSave(editData); // REMOVED: Prevent double save
         
         devLog(`[DataInputVirtual] Validation 호출: row=${rowIndex}, col=${colIndex}, value="${tempValue}", type="${columnMeta.type}"`);

         if (validationManager) {
           validationManager.validateCell(rowIndex, colIndex, tempValue, columnMeta.type, true);
         }
      }
    }
    
    gridStore.confirmEditing();
  }

  function cleanupInteractionListeners() {
    if (onDocumentMouseMoveBound.value) {
      document.removeEventListener('mousemove', onDocumentMouseMoveBound.value);
    }
    if (onDocumentMouseUpBound.value) {
      document.removeEventListener('mouseup', onDocumentMouseUpBound.value);
    }
  }

  return {
    onCellMouseDown,
    onCellDoubleClick,
    onKeyDown,
    onUpdateCellValueFromBar,
    onEnterPressedFromBar,
    onCellEditComplete,
    getCellValue,
    cleanupInteractionListeners,
    onDocumentMouseMoveBound,
    onDocumentMouseUpBound
  };
}
