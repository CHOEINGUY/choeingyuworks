<template>
  <div 
    class="h-full grid grid-rows-[auto_auto_1fr] bg-white overflow-hidden outline-none pb-[48px]"
    tabindex="0"
    @keydown="onKeyDown"
    ref="dataContainerRef"
  >
    <VirtualAppHeader 
      :errorCount="visibleValidationErrors.size"
      @focusFirstError="handleFocusFirstError"
    />
    <VirtualFunctionBar 
      :cell-address="selectedCellInfo.address"
      :cell-value="selectedCellInfo.value"
      :is-uploading-excel="isUploadingExcel"
      :upload-progress="excelUploadProgress"
      :can-undo="historyStore.canUndo"
      :can-redo="historyStore.canRedo"
      :is-filtered="gridStore.isFiltered"
      :filtered-row-count="gridStore.filterState.filteredRowCount || 0"
      :original-row-count="gridStore.filterState.originalRowCount || 0"
      @update-cell-value="onUpdateCellValueFromBar"
      @enter-pressed="onEnterPressedFromBar"
      @excel-file-selected="onExcelFileSelected"
      @download-template="onDownloadTemplate"
      @export-data="onExportData"
      @copy-entire-data="onCopyEntireData"
      @delete-empty-cols="onDeleteEmptyCols"
      @reset-sheet="onResetSheet"
      @toggle-exposure-col="onToggleExposureColumn"
      @toggle-confirmed-case-col="onToggleConfirmedCaseColumn"
      @undo="onUndo"
      @redo="onRedo"
      @clear-all-filters="onClearAllFilters"
    />
    <div class="flex flex-col overflow-hidden bg-white min-h-0 relative z-10" ref="gridContainerRef">
      <VirtualGridHeader 
        ref="gridHeaderRef"
        :headerGroups="headerGroups"
        :allColumnsMeta="allColumnsMeta"
        :tableWidth="tableWidth"
        :selectedCell="selectionSystem.state.selectedCell"
        :selectedRange="selectionSystem.state.selectedRange"
        :individualSelectedCells="selectionSystem.state.selectedCellsIndividual"
        :isEditing="selectionSystem.state.isEditing"
        :editingCell="selectionSystem.state.editingCell"
        :scrollbarWidth="scrollbarWidth"
        :is-filtered="gridStore.isFiltered"
        :activeFilters="computedActiveFilters"
        @cell-mousedown="onCellMouseDown"
        @cell-dblclick="onCellDoubleClick"
        @cell-input="onCellInput"
        @cell-contextmenu="onContextMenu"
        @add-column="onAddColumn"
        @delete-column="onDeleteColumn"
        @update:activeFilters="onUpdateActiveFilters"
      />
      <VirtualGridBody 
        ref="gridBodyRef"
        :visibleRows="visibleRows"
        :allColumnsMeta="allColumnsMeta"
        :tableWidth="tableWidth"
        :totalHeight="totalHeight"
        :paddingTop="paddingTop"
        :bufferSize="4"
        :getCellValue="getCellValue"
        :selectedCell="selectionSystem.state.selectedCell"
        :selectedRange="selectionSystem.state.selectedRange"
        :individualSelectedCells="selectionSystem.state.selectedCellsIndividual"
        :isEditing="selectionSystem.state.isEditing"
        :editingCell="selectionSystem.state.editingCell"
        :individualSelectedRows="selectionSystem.state.selectedRowsIndividual"
        :validation-errors="visibleValidationErrors"
        :column-metas="allColumnsMeta"
        :is-filtered="gridStore.isFiltered"
        @scroll="handleGridScroll"
        @cell-mousedown="onCellMouseDown"
        @cell-dblclick="onCellDoubleClick"
        @cell-input="onCellInput"
        @cell-contextmenu="onContextMenu"
        @add-rows="onAddRows"
        @delete-empty-rows="onDeleteEmptyRows"
        @clear-selection="onClearSelection"
      />
    </div>
    <ContextMenu 
      :visible="contextMenuState.visible"
      :x="contextMenuState.x"
      :y="contextMenuState.y"
      :items="contextMenuState.items as any"
      @select="onContextMenuSelect"
    />
    <DragOverlay :visible="isDragOver" :progress="excelUploadProgress" />
    <ToastContainer />

    <!-- DateTimePicker 추가 -->
    <DateTimePicker 
      ref="dateTimePickerRef"
      :visible="dateTimePickerState.visible"
      :position="dateTimePickerState.position"
      :initialValue="dateTimePickerState.initialValue"
      @confirm="onDateTimeConfirm"
      @cancel="onDateTimeCancel"
    />

    <!-- Validation Progress -->
    <ValidationProgress
      :is-visible="isValidationProgressVisible"
      :progress="validationProgress"
      :processed="validationProcessed"
      :total="validationTotal"
      :error-count="validationErrorCount"
    />

    <!-- Cell Edit Overlay -->
    <CellEditOverlay
      ref="editOverlayRef"
      :visible="editOverlayState.visible"
      :position="editOverlayState.position"
      :value="editOverlayState.value"
      :row-index="editOverlayState.rowIndex"
      :col-index="editOverlayState.colIndex"
      :select-on-focus="editOverlayState.selectOnFocus"
      @confirm="confirmEdit"
      @cancel="cancelEdit"
      @input="handleOverlayInput"
      @move-next-row="moveToNextRow"
      @move-next-cell="moveToNextCell"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import i18n from '@/i18n';
import VirtualAppHeader from './layout/VirtualAppHeader.vue';
import VirtualFunctionBar from './layout/VirtualFunctionBar.vue';
import VirtualGridHeader from './layout/VirtualGridHeader.vue';
import VirtualGridBody from './layout/VirtualGridBody.vue';
import ContextMenu from './parts/ContextMenu.vue';
import DragOverlay from './parts/DragOverlay.vue';
import DateTimePicker from './parts/DateTimePicker.vue';
import CellEditOverlay from './parts/CellEditOverlay.vue';
import type { OverlayController } from '@/types/virtualGridContext';

// --- Pinia Stores ---
import { useGridStore } from '@/stores/gridStore';
import { useHistoryStore } from '@/stores/historyStore';
import { useEpidemicStore } from '@/stores/epidemicStore';
import { useSettingsStore } from '@/stores/settingsStore';

// --- Services ---
import { EnhancedStorageManager } from '@/store/enhancedStorageManager';

import ToastContainer from './parts/ToastContainer.vue';
import { useContextMenu } from './logic/useContextMenu';
import { useVirtualSelectionSystem, setColumnsMeta } from './logic/virtualSelectionSystem';
import { showToast } from './logic/toast';
import { useDragDrop } from './logic/dragDrop';
import {
  COL_TYPE_BASIC,
  COL_TYPE_IS_PATIENT,
  COL_TYPE_CLINICAL,
  COL_TYPE_DIET
} from './constants/index';

import { useOperationGuard } from '../../hooks/useOperationGuard';
import ValidationManager from '@/validation/ValidationManager';
import ValidationProgress from './parts/ValidationProgress.vue';
import { logger, devLog } from '../../utils/logger';

// --- Composables ---
import { useGridColumns } from './composables/useGridColumns';
import { useGridScrolling } from './composables/useGridScrolling';
import { useGridFilter } from './composables/useGridFilter';
import { useGridInteraction } from './composables/useGridInteraction';
import { useExcelOperations } from './composables/useExcelOperations';
import { useGridContextMenu } from './composables/useGridContextMenu';
import { useGridRowOperations } from './composables/useGridRowOperations';
import { useUndoRedoHandlers } from './composables/useUndoRedoHandlers';
import { useDateTimePicker } from './composables/useDateTimePicker';
import { useEditOverlay } from './composables/useEditOverlay';

// --- Template Refs ---
const dataContainerRef = ref<HTMLElement | null>(null);
const gridContainerRef = ref<HTMLElement | null>(null);
const gridHeaderRef = ref<any>(null); 
const gridBodyRef = ref<any>(null);
const dateTimePickerRef = ref<any>(null);

const focusGrid = () => dataContainerRef.value?.focus();

// --- Core Reactive State ---
const gridStore = useGridStore();
const historyStore = useHistoryStore();
const epidemicStore = useEpidemicStore();
const settingsStore = useSettingsStore();

// --- Persistence Manager ---
const storageManager = new EnhancedStorageManager(null, null); 
storageManager.setStore(epidemicStore); // Link to Pinia

const rows = computed(() => epidemicStore.rows);

// --- Validation Status Refs ---
const isValidationProgressVisible = ref(false);
const validationProgress = ref(0);
const validationProcessed = ref(0);
const validationTotal = ref(0);
const validationErrorCount = ref(0);

const { t } = i18n.global;

// ValidationManager 인스턴스
const validationManager = new ValidationManager(epidemicStore, { 
  debug: false, 
  useWorker: true,
  showToast: (msg, type) => {
    showToast(msg, type);
  },
  t: (i18n.global as any).t,
  onProgress: (progress: number) => {
    isValidationProgressVisible.value = true;
    validationProgress.value = progress;
    // Note: ValidationManager's onProgress callback signature in TS definition is (progress: number) => void.
    // The legacy global function accepted (progress, processed, total, errors). 
    // If we need detailed info, we might need to update ValidationManager's interface or just use progress for now.
    // Looking at ValidationManager.ts, it calls onProgress(percent). 
    // Ideally we'd want processed/total counts too, but let's stick to the interface for now to be safe, 
    // or if ValidationManager supports it (it seems to only accept number in interface).
    // Let's assume progress is 0-100.
    
    if (progress >= 100) {
       // Hide after a short delay
       setTimeout(() => {
           isValidationProgressVisible.value = false;
       }, 500);
    }
  }
});

// Note: The legacy 'updateValidationProgress' callback had (progress, processed, total, errors).
// The current ValidationManager interface defines onProgress: (progress: number) => void.
// We are losing detailed stats (processed/total) in this refactor unless we update ValidationManager.
// However, the goal is to remove 'window' pollution. The detailed stats were likely from a legacy worker implementation.
// The current ValidationManager.ts uses `asyncProcessor` or `worker` which reports percentage.

// --- DateTimePicker System ---
const {
  dateTimePickerState,
  onDateTimeConfirm,
  onDateTimeCancel,
  closeDateTimePicker
} = useDateTimePicker(validationManager, focusGrid, storageManager);

// --- Operation Guard (Locking) ---
const { 
  tryStartOperation, 
  endOperation 
} = useOperationGuard({ 
  showBlockedMessage: true 
}, t);

// --- Selection System ---
const selectionSystem = useVirtualSelectionSystem();

// --- Column Logic ---
const { 
  allColumnsMeta, 
  headerGroups, 
  tableWidth, 
  onToggleExposureColumn, 
  onToggleConfirmedCaseColumn,
  onAddColumn,
  onDeleteColumn,
  onDeleteEmptyCols,
  onResetSheet
} = useGridColumns(validationManager, selectionSystem, focusGrid, tryStartOperation, endOperation);

function onCellInput(event: Event, rowIndex: number, colIndex: number) {
  const target = event.target as HTMLElement;
  const newValue = target.textContent || '';
  const columnMeta = allColumnsMeta.value.find(c => c.colIndex === colIndex);
  if (columnMeta) {
    gridStore.updateTempValue(newValue);
  }
}

// --- Filter System (useGridFilter) ---
const {
  filterState,
  filteredRows,
  captureSnapshotWithFilter,
  syncFilterStateAfterHistoryChange,
  onClearAllFilters,
  onUpdateActiveFilters
} = useGridFilter(rows, gridBodyRef, gridHeaderRef);

const computedActiveFilters = computed(() => {
  const filters = gridStore.activeFilters;
  const map = new Map<number, any>();
  if (filters) {
    filters.forEach((v: any, k: any) => map.set(Number(k) || k, v)); 
  }
  return map;
});

// --- 가상 스크롤 및 그리드 DOM 관리 (useGridScrolling) ---
const {
  visibleRows,
  totalHeight,
  paddingTop,
  scrollbarWidth,
  getOriginalIndex,
  handleGridScroll,
  ensureCellIsVisible
} = useGridScrolling(filteredRows, allColumnsMeta, {
  rowHeight: 35,
  bufferSize: 1,
  gridContainerRef,
  gridHeaderRef,
  gridBodyRef
});

// --- Interaction System (useGridInteraction) ---

// [CIRCULAR DEPENDENCY FIX]
// useEditOverlay needs `getCellValue`, but `getCellValue` comes from `useGridInteraction`.
// `useGridInteraction` needs `overlayController`, which comes from `useEditOverlay`.
// Solution: Use a proxy function.
let _getCellValueImpl: any = null;
const getCellValueProxy = (row: any, col: any, index: any) => {
  if (_getCellValueImpl) return _getCellValueImpl(row, col, index);
  return '';
};


// --- Edit Overlay System ---
const editOverlayRef = ref<any>(null);
const {
  editOverlayState,
  startEditOverlay,
  startEditOverlayWithKey,
  confirmEdit,
  cancelEdit,
  handleOverlayInput,
  moveToNextRow,
  moveToNextCell,
  appendValueToOverlay
} = useEditOverlay({
  selectionSystem,
  allColumnsMeta,
  rows,
  getCellValue: getCellValueProxy,
  storageManager,
  validationManager,
  focusGrid,
  ensureCellIsVisible,
  gridBodyRef,
  gridHeaderRef
});

// 오버레이 편집 시작/확인/닫기 함수를 전역에서 접근 가능하게 설정
// Construct Overlay Controller for Dependency Injection
const overlayController: OverlayController = {
  open: startEditOverlayWithKey,
  close: cancelEdit,
  confirm: confirmEdit,
  isVisible: () => editOverlayState.visible,
  append: appendValueToOverlay
};

// --- Interaction System (useGridInteraction) ---
const {
  onCellMouseDown,
  onCellDoubleClick,
  onUpdateCellValueFromBar,
  onEnterPressedFromBar,
  onKeyDown: onGridKeyDown,
  getCellValue,
  cleanupInteractionListeners
} = useGridInteraction(
  selectionSystem,
  allColumnsMeta,
  rows,
  filteredRows, 
  focusGrid,
  ensureCellIsVisible,
  validationManager,
  dateTimePickerState,
  dateTimePickerRef,
  gridBodyRef,
  closeDateTimePicker,
  onDateTimeCancel,
  storageManager,
  t,
  overlayController
);

// Assign real implementation to proxy
_getCellValueImpl = getCellValue;

// 외부 클릭 감지 (오버레이 자동 저장 및 닫기)
function handleOutsideClick(event: MouseEvent) {
  if (editOverlayState.visible) {
    // 오버레이 내부 클릭은 stopPropagation 되므로 이곳에 도달하지 않음
    // 즉, 이곳에 도달했다는 것은 오버레이 외부(문서의 다른 곳)를 클릭했다는 뜻
    confirmEdit();
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick);

  if (validationManager && allColumnsMeta.value.length > 0) {
    validationManager.updateColumnMetas(allColumnsMeta.value);
    validationManager.migrateErrorsToUniqueKeys(allColumnsMeta.value);
    validationManager.printUniqueKeyMapping(allColumnsMeta.value);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleOutsideClick);
});

// 역사 복원(Undo/Redo) 시 편집 중인 오버레이가 있다면 강제로 닫아야 함
// 그렇지 않으면 엉뚱한 데이터 위에 편집 내용이 덮어쓰여질 수 있음
watch(() => historyStore.isRestoring, (isRestoring) => {
  if (isRestoring && editOverlayState.visible) {
    cancelEdit();
  }
});

// [추가 안전장치] 행이나 열의 개수가 바뀌면(추가/삭제 등) 오버레이 위치가 유효하지 않으므로 닫음
watch(() => [allColumnsMeta.value.length, (rows.value || []).length], () => {
  if (editOverlayState.visible) {
    cancelEdit();
  }
});

const selectedCellInfo = computed(() => {
  const { rowIndex, colIndex } = selectionSystem.state.selectedCell;
  if (rowIndex === null || colIndex === null) {
    return { address: '', value: '' };
  }

  const columnMeta = allColumnsMeta.value.find(c => c.colIndex === colIndex);
  
  if (!columnMeta) {
    return { address: '', value: '' };
  }

  if (colIndex === 0 && rowIndex >= 0) {
    const value = rows.value[rowIndex] ? rowIndex + 1 : '';
    return { address: '', value: String(value) };
  }

  let headerLabel = (columnMeta.headerText || '').replace(/<br\s*\/?>/gi, ' ').trim();

  if (columnMeta.type === COL_TYPE_IS_PATIENT) {
    headerLabel = headerLabel.split('(')[0].trim();
  }

  const groupedTypes = [COL_TYPE_BASIC, COL_TYPE_CLINICAL, COL_TYPE_DIET];

  if (rowIndex < 0 && groupedTypes.includes(columnMeta.type)) {
    const grp = headerGroups.value.find(g => colIndex >= g.startColIndex && colIndex < g.startColIndex + (g.colspan || 1));
    const groupName = grp && grp.text ? String(grp.text).split('(')[0].trim() : '';
    headerLabel = groupName;
  }

  let address = '';
  if (rowIndex >= 0) {
    address = `${headerLabel} / ${rowIndex + 1}`;
  } else { 
    address = headerLabel;
  }

  let value = '';
  if (rowIndex < 0) {
    value = getCellValue(null, columnMeta, -1);
  } else {
    // Check key mapping for rowIndex if needed? 
    // filteredRows are used for model usually, but getCellValue might need original row?
    // Actually getCellValue implementation in useGridInteraction handles basic reading.
    // If rowIndex refers to View Index in filteredRows, we should pass filteredRows[rowIndex].
    
    // Safety check
    const row = filteredRows.value[rowIndex];
    if (row) {
        value = getCellValue(row, columnMeta, rowIndex);
    }
  }

  return { address, value };
});

// --- Context Menu System ---
const { contextMenuState, showContextMenu, hideContextMenu } = useContextMenu();

const {
  onContextMenu,
  onContextMenuSelect
} = useGridContextMenu(
  selectionSystem,
  allColumnsMeta,
  contextMenuState,
  showContextMenu,
  hideContextMenu,
  getOriginalIndex,
  validationManager,
  tryStartOperation,
  endOperation,
  focusGrid,
  captureSnapshotWithFilter,
  filterState,
  rows,
  filteredRows,
  getCellValue,
  storageManager
);

// --- Excel Upload/Export ---
const {
  isUploadingExcel,
  excelUploadProgress,
  onExcelFileSelected,
  onExportData,
  onDownloadTemplate,
  onCopyEntireData,
  onFileDropped
} = useExcelOperations(
  validationManager, 
  selectionSystem, 
  tryStartOperation, 
  endOperation,
  allColumnsMeta,
  getCellValue,
  {
    hasIndividualExposure: computed(() => settingsStore.isIndividualExposureColumnVisible),
    hasConfirmedCase: computed(() => settingsStore.isConfirmedCaseColumnVisible)
  },
  t
);

// --- Row Operations ---
const {
  onDeleteEmptyRows,
  onAddRows,
  onClearSelection
} = useGridRowOperations(
  selectionSystem,
  rows,
  dateTimePickerState,
  closeDateTimePicker,
  tryStartOperation,
  endOperation,
  t
);

// --- Undo/Redo Handlers ---
const {
  onUndo,
  onRedo
} = useUndoRedoHandlers(
  validationManager,
  filterState,
  syncFilterStateAfterHistoryChange,
  dateTimePickerState,
  closeDateTimePicker,
  gridBodyRef,
  gridHeaderRef
);

// --- Drag & Drop ---
const { isDragOver, setupDragDropListeners } = useDragDrop();
let cleanupDragDrop: (() => void) | null = null;

// === 새로운 필터 유효성 검사 통합 시스템 ===
import { FilterRowValidationManager } from './utils/FilterRowValidationManager';
const filterRowValidationManager = new FilterRowValidationManager();

const validationErrors = computed(() => {
  const errors = epidemicStore.validationState?.errors;
  return errors instanceof Map ? errors : new Map();
});

const visibleValidationErrors = computed(() => {
  const errors = validationErrors.value;
  const isFiltered = gridStore.isFiltered;
  const filteredRowsData = filteredRows.value;
  
  filterRowValidationManager.updateFilterState(isFiltered, filteredRowsData, errors);
  
  return filterRowValidationManager.getVisibleErrors();
});

watch(() => gridStore.isFiltered, (newIsFiltered, oldIsFiltered) => {
  if (newIsFiltered !== oldIsFiltered) {
    nextTick(() => {
      const gridBody = gridBodyRef.value;
      if (gridBody) {
        gridBody.$forceUpdate();
      }
    });
  }
}, { immediate: false });

function onKeyDown(event: KeyboardEvent) {
  if (dateTimePickerState.visible) {
    switch (event.key) {
    case 'Escape':
      event.preventDefault();
      event.stopPropagation();
      onDateTimeCancel();
      return;
    case 'Enter':
      event.preventDefault();
      event.stopPropagation();
      if (dateTimePickerRef.value?.confirm) {
        dateTimePickerRef.value.confirm();
      }
      return;
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
  onGridKeyDown(event);
}

const handleGlobalClick = () => {
  if (contextMenuState.visible) {
    hideContextMenu();
  }
};

onMounted(() => {
  devLog('[Filter] 컴포넌트 마운트 시 필터 초기화');
  gridStore.clearAllFilters();
  
  // Load data from storage
  const loadedData = storageManager.loadData();
  if (loadedData) {
      if (loadedData.headers && loadedData.rows) {
          epidemicStore.setInitialData({ headers: loadedData.headers, rows: loadedData.rows });
      }
      
      // Hydrate Settings
      if (loadedData.settings) {
          const s = loadedData.settings;
          if (s.isIndividualExposureColumnVisible !== undefined) settingsStore.setIndividualExposureColumnVisibility(s.isIndividualExposureColumnVisible);
          if (s.isConfirmedCaseColumnVisible !== undefined) settingsStore.setConfirmedCaseColumnVisibility(s.isConfirmedCaseColumnVisible);
          if (s.exposureDateTime !== undefined) settingsStore.updateExposureDateTime(s.exposureDateTime);
          if (s.selectedSymptomInterval !== undefined) settingsStore.updateSymptomInterval(s.selectedSymptomInterval);
          if (s.selectedIncubationInterval !== undefined) settingsStore.updateIncubationInterval(s.selectedIncubationInterval);
          if (s.selectedSuspectedFoods !== undefined) settingsStore.setSelectedSuspectedFoods(s.selectedSuspectedFoods);
          if (s.epidemicCurveSettings !== undefined) settingsStore.updateEpidemicCurveSettings(s.epidemicCurveSettings);
          // Add other settings as needed
      }
      
      // Hydrate Validation State
      if (loadedData.validationState) {
          const { errors, version } = loadedData.validationState;
          if (errors) {
              const errorMap = new Map<string, { message: string; timestamp: number }>();
              if (typeof errors === 'object' && errors !== null) {
                  Object.entries(errors).forEach(([key, value]) => {
                      errorMap.set(key, value as { message: string; timestamp: number });
                  });
              }
              epidemicStore.setValidationErrors(errorMap);
          }
          if (version !== undefined) {
              epidemicStore.setValidationVersion(version);
          }
          
          // Re-run migration after data load to ensure legacy error keys are updated
          nextTick(() => {
              if (validationManager && allColumnsMeta.value.length > 0) {
                  validationManager.migrateErrorsToUniqueKeys(allColumnsMeta.value);
              }
          });
      }
  } else {
      epidemicStore.loadInitialData();
  }

  // --- Auto-Save Subscription ---
  // Watch for structural changes and settings changes
  watch(
      [
          () => epidemicStore.headers,
          () => epidemicStore.rows,
          () => epidemicStore.validationState,
          () => settingsStore.$state
      ],
      () => {
          // Debounce could be added here if performance is an issue, 
          // but for now relying on Vue's scheduler batching is a start.
          // Consider using a debounced save function if writes are too frequent.
          storageManager.saveCurrentState();
      },
      { deep: true }
  );

  cleanupDragDrop = setupDragDropListeners(onFileDropped);
  
  document.addEventListener('mousedown', handleGlobalClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleGlobalClick);
  if (cleanupDragDrop) cleanupDragDrop();
  if (cleanupInteractionListeners) cleanupInteractionListeners();
  
  if (validationManager && typeof validationManager.clearTimers === 'function') {
    try { validationManager.clearTimers(); } catch (error) {}
  }
  validationManager.destroy();
  if (storageManager) storageManager.reset();
});

watch(allColumnsMeta, (newMeta) => {
  setColumnsMeta(newMeta);
}, { immediate: true });

function handleFocusFirstError() {
  const errors = Array.from(visibleValidationErrors.value.entries());
  if (errors.length === 0) return;
  
  const [key] = errors[0];
  
  // 에러 키 파싱: 첫 번째 '_' 만 사용하여 rowIndex와 uniqueKey 분리
  const firstUnderscoreIndex = key.indexOf('_');
  if (firstUnderscoreIndex === -1) return;
  
  const rowIndexStr = key.substring(0, firstUnderscoreIndex);
  const uniqueKeyOrColIndex = key.substring(firstUnderscoreIndex + 1);
  
  const originalRowIndex = parseInt(rowIndexStr, 10);
  
  // 1. 컬럼 찾기 (UniqueKey -> DataKey -> Alias 순서로 확인)
  let columnMeta = allColumnsMeta.value.find(col => {
    // 1-1. 정확한 고유 키 일치 확인 (권장)
    const colUniqueKey = validationManager.getColumnUniqueKey(col);
    if (colUniqueKey === uniqueKeyOrColIndex) return true;
    
    // 1-2. 데이터 키 일치 확인 (clinicalSymptoms 등)
    if (col.dataKey === uniqueKeyOrColIndex) return true;
    
    // 1-3. 예외적인 별칭(Alias) 처리 (confirmed -> isConfirmedCase)
    if (uniqueKeyOrColIndex === 'confirmed' && col.dataKey === 'isConfirmedCase') return true;
    
    return false;
  });

  // 2. Fallback: 인덱스로 찾기 (레거시)
  if (!columnMeta) {
      const colIndex = parseInt(uniqueKeyOrColIndex, 10);
      if (!isNaN(colIndex)) {
          columnMeta = allColumnsMeta.value.find(c => c.colIndex === colIndex);
      }
  }
  
  if (!columnMeta) {
    logger.warn('[FocusFirstError] Column meta not found for key component:', uniqueKeyOrColIndex);
    return;
  }
  
  const colIndex = columnMeta.colIndex;
  
  let targetRowIndex = originalRowIndex;
  if (gridStore.isFiltered) {
    const filteredIndex = filteredRows.value.findIndex(row => 
      row._originalIndex === originalRowIndex
    );
    if (filteredIndex !== -1) {
      targetRowIndex = filteredIndex;
    } else {
        // If the row with error is filtered out, we might want to clear filter or warn
        // For now, if filtered out, we can't scroll to it easily without unfiltering
        logger.warn('[FocusFirstError] Row with error is currently filtered out');
        return;
    }
  }
  
  devLog('[FocusFirstError] Focusing error cell:', {
    originalRowIndex,
    targetRowIndex,
    colIndex,
    key: uniqueKeyOrColIndex
  });
  
  const targetCol = colIndex ?? 0;
  
  // Ensure strict scroll order
  Promise.resolve().then(async () => {
       await ensureCellIsVisible(targetRowIndex, targetCol);
       // Select after scrolling ensures element exists
       selectionSystem.selectCell(targetRowIndex, targetCol);
       focusGrid();
  });
}
</script>