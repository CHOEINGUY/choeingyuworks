<template>
  <div 
    class="grid-body-virtual overflow-auto relative flex-1 min-h-0 bg-slate-50 will-change-scroll" 
    :class="{ 'relative': isFiltered }"
    ref="bodyContainer" 
    @scroll.passive="handleScroll"
  >
          <div :style="{ height: containerHeight + 'px', position: 'relative', width: tableWidth }">
        <table 
          class="border-collapse table-fixed absolute top-0 left-0 z-[1] w-full" 
          :style="{ 
            transform: `translateY(${paddingTop}px)`,
            width: tableWidth
          }"
        >
        <colgroup>
          <col 
            v-for="column in allColumnsMeta" 
            :key="column.colIndex" 
            :style="column.style"
          >
        </colgroup>
        <tbody>
          <tr 
            v-for="(item, index) in visibleRows" 
            :key="item.originalIndex"
            :data-row="item.originalIndex"
            class="h-[35px] max-h-[35px] min-h-[35px]"
          >
            <td 
              v-for="column in allColumnsMeta" 
              :key="column.colIndex"
              :data-row="item.originalIndex"
              :data-col="column.colIndex"
              :class="[
                'border border-gray-300 px-2 text-sm whitespace-nowrap overflow-hidden text-ellipsis box-border bg-clip-padding text-center align-middle cursor-default h-[35px] !p-0',
                getCellClasses(Number(item.originalIndex), Number(column.colIndex)),
                { 'bg-white': !isCellEditing(Number(item.originalIndex), Number(column.colIndex)) }
              ]"
              :data-validation-message="getValidationMessage(Number(item.originalIndex), Number(column.colIndex))"
              :contenteditable="isCellEditing(Number(item.originalIndex), Number(column.colIndex))"
              @input="handleCellInput($event, item, Number(column.colIndex))"
              @dblclick="handleCellDoubleClick(index, Number(column.colIndex), $event)"
              @mousedown="handleCellMouseDown(index, Number(column.colIndex), $event)"
              @mousemove="handleCellMouseMove(index, Number(column.colIndex), $event)"
              @contextmenu.prevent="handleCellContextMenu($event, index, Number(column.colIndex))"
              @mouseenter="handleCellMouseEnter($event, index, Number(column.colIndex))"
              @mouseleave="handleCellMouseLeave"
            >
              {{ getCellValue(item, column, Number(item.originalIndex)) }}
            </td>
          </tr>
        </tbody>
        <!-- AddRowsControls removed from table footer to avoid flicker; now handled externally -->
      </table>
      <!-- AddRowsControls positioned just below last data row -->
      <div 
        class="py-1.5 bg-transparent z-[2]" 
        :style="{ position: 'absolute', top: addRowsTop + 'px', left: 0, width: '100%' }"
      >
        <AddRowsControls 
          @add-rows="$emit('add-rows', $event)" 
          @delete-empty-rows="$emit('delete-empty-rows')" 
          @clear-selection="$emit('clear-selection')" 
        />
      </div>
    </div>
    
    <!-- Validation Tooltip -->
    <div 
      v-if="tooltipVisible" 
      class="fixed bg-[#333] text-white px-2.5 py-1.5 rounded text-xs whitespace-nowrap z-[1000] pointer-events-none shadow-lg after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-t-[#333] after:border-transparent"
      :style="tooltipStyle"
    >
      {{ tooltipMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AddRowsControls from '../parts/AddRowsControls.vue';
import { hasValidationError } from '../utils/validationUtils';
import { FilterRowValidationManager } from '../utils/FilterRowValidationManager';

interface Props {
  visibleRows: any[];
  allColumnsMeta: any[];
  tableWidth: string;
  totalHeight: number;
  paddingTop: number;
  getCellValue: (item: any, column: any, index: number) => any;
  selectedCell?: { rowIndex: number | null; colIndex: number | null };
  selectedRange?: {
    start: { rowIndex: number | null; colIndex: number | null };
    end: { rowIndex: number | null; colIndex: number | null };
  };
  isEditing?: boolean;
  editingCell?: { rowIndex: number | null; colIndex: number | null };
  individualSelectedCells?: Set<string> | null;
  individualSelectedRows?: Set<number> | null;
  bufferSize?: number;
  validationErrors?: any;
  isFiltered?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selectedCell: () => ({ rowIndex: null, colIndex: null }),
  selectedRange: () => ({
    start: { rowIndex: null, colIndex: null },
    end: { rowIndex: null, colIndex: null }
  }),
  isEditing: false,
  editingCell: () => ({ rowIndex: null, colIndex: null }),
  individualSelectedCells: null,
  individualSelectedRows: null,
  bufferSize: 4,
  validationErrors: null,
  isFiltered: false
});

const emit = defineEmits<{
  (e: 'scroll', event: Event): void;
  (e: 'cell-mousedown', rowIndex: number, colIndex: number, event: MouseEvent): void;
  (e: 'cell-mousemove', rowIndex: number, colIndex: number, event: MouseEvent): void;
  (e: 'cell-dblclick', rowIndex: number, colIndex: number, event: MouseEvent): void;
  (e: 'cell-input', event: Event, rowIndex: number, colIndex: number): void;
  (e: 'cell-contextmenu', event: MouseEvent, rowIndex: number, colIndex: number): void;
  (e: 'add-rows', count: number): void;
  (e: 'delete-empty-rows'): void;
  (e: 'clear-selection'): void;
}>();

const bodyContainer = ref<HTMLElement | null>(null);

// 필터 + 행 변경 통합 매니저 인스턴스
const filterRowValidationManager = new FilterRowValidationManager();

const ADD_ROWS_HEIGHT = 40;  
const CONTROL_SPACING = 6;   // 마지막 행에서 6px 띄움 (기존 5)

// 테이블이 렌더링하는 버퍼 행을 무시하고 마지막 데이터 행 바로 뒤에 약간의 간격을 두고 배치
const addRowsTop = computed(() => props.totalHeight + CONTROL_SPACING);

// 스크롤 컨테이너 높이 = 데이터 전체 높이 + 간격 + AddRowsControls 높이
const containerHeight = computed(() => props.totalHeight + CONTROL_SPACING + ADD_ROWS_HEIGHT);

// Validation Tooltip 상태
const tooltipVisible = ref(false);
const tooltipMessage = ref('');
const tooltipStyle = ref<any>({});

function handleScroll(event: Event) {
  emit('scroll', event);
}

function isCellInRange(rowIndex: number, colIndex: number) {
  const { start, end } = props.selectedRange;
  if (start.rowIndex === null || end.rowIndex === null || start.colIndex === null || end.colIndex === null) return false;

  const minRow = Math.min(start.rowIndex, end.rowIndex);
  const maxRow = Math.max(start.rowIndex, end.rowIndex);
  const minCol = Math.min(start.colIndex, end.colIndex);
  const maxCol = Math.max(start.colIndex, end.colIndex);

  return (
    rowIndex >= minRow &&
    rowIndex <= maxRow &&
    colIndex >= minCol &&
    colIndex <= maxCol
  );
}

function isCellEditing(rowIndex: number, colIndex: number) {
  return props.isEditing && props.editingCell?.rowIndex === rowIndex && props.editingCell?.colIndex === colIndex;
}

function isMultiCellSelection(range: any) {
  if (!range || range.start.rowIndex === null) return false;
  return range.start.rowIndex !== range.end.rowIndex || range.start.colIndex !== range.end.colIndex;
}

function getCellClasses(rowIndex: number, colIndex: number) {
  const classes: string[] = [];
  
  if (colIndex === 0) {
    if (props.isFiltered) {
      classes.push('!bg-blue-500/20 !text-blue-700 !font-medium !border-gray-300 z-[2]');
    } else {
      classes.push('!bg-slate-100 !font-medium !border-gray-300 z-[2]');
    }
  }

  const lastColIndex = props.allColumnsMeta.length - 1;

  // --- Editing ---
  if (isCellEditing(rowIndex, colIndex)) {
    classes.push('cell-editing');
    return classes;
  }

  // --- Individual row selection (Ctrl+Row) -------------------------
  const isRowIndividuallySelected = props.individualSelectedRows && props.individualSelectedRows.has(rowIndex);
  if (isRowIndividuallySelected) {
    classes.push('row-individual-selected');

    const isFirstSelectedRow = !props.individualSelectedRows?.has(rowIndex - 1);
    const isLastSelectedRow = !props.individualSelectedRows?.has(rowIndex + 1);

    if (isFirstSelectedRow) classes.push('border-top');
    if (isLastSelectedRow) classes.push('border-bottom');
    if (colIndex === 0) classes.push('border-left');
    if (colIndex === lastColIndex) classes.push('border-right');
  }

  // --- Individual cell selection -----------------------------------
  if (props.individualSelectedCells && props.individualSelectedCells.has(`${rowIndex}_${colIndex}`)) {
    classes.push('cell-multi-selected');
  }

  // --- Range selection ---------------------------------------------
  if (!isRowIndividuallySelected) {
    if (isCellInRange(rowIndex, colIndex)) {
      if (isMultiCellSelection(props.selectedRange)) {
        classes.push('cell-range-selected');
      }
      
      const { start, end } = props.selectedRange;
      if (start.rowIndex !== null && end.rowIndex !== null && start.colIndex !== null && end.colIndex !== null) {
        const minRow = Math.min(start.rowIndex, end.rowIndex);
        const maxRow = Math.max(start.rowIndex, end.rowIndex);
        const minCol = Math.min(start.colIndex, end.colIndex);
        const maxCol = Math.max(start.colIndex, end.colIndex);

        if (rowIndex === minRow) classes.push('border-top');
        if (rowIndex === maxRow) classes.push('border-bottom');
        if (colIndex === minCol) classes.push('border-left');
        if (colIndex === maxCol) classes.push('border-right');
      }
    }
  }

  // --- Active cell highlight ---------------------------------------
  if (
    props.selectedCell &&
    props.selectedCell.rowIndex === rowIndex &&
    props.selectedCell.colIndex === colIndex
  ) {
    if (isMultiCellSelection(props.selectedRange)) {
      classes.push('cell-active-in-range');
    } else {
      classes.push('cell-selected');
    }
  }

  // --- Validation error (통합 시스템 사용) ---
  const columnMeta = props.allColumnsMeta[colIndex];
  
  // 1. 열 변경 시스템: 고유키 기반 에러 확인
  const hasColumnError = hasValidationError(rowIndex, colIndex, columnMeta, props.validationErrors);
  
  // 2. 필터 + 행 변경 시스템: 가시성 확인
  filterRowValidationManager.updateFilterState(
    props.isFiltered, 
    props.visibleRows, 
    props.validationErrors
  );
  const isVisible = filterRowValidationManager.isErrorVisible(rowIndex);
  
  // 두 시스템 모두 통과해야 에러 표시
  if (hasColumnError && isVisible) {
    classes.push('validation-error');
  }
  
  return classes;
}

function getValidationMessage(rowIndex: number, colIndex: number) {
  const columnMeta = props.allColumnsMeta[colIndex];
  return filterRowValidationManager.getErrorMessage(rowIndex, colIndex, columnMeta);
}

function handleCellMouseEnter(event: any, index: any, colIndex: any) {
  const item = props.visibleRows[index];
  let originalRowIndex: number;
  
  if (props.isFiltered) {
    if (item._originalIndex !== undefined) {
      originalRowIndex = item._originalIndex;
    } else if (item._filteredOriginalIndex !== undefined) {
      originalRowIndex = item._filteredOriginalIndex;
    } else {
      originalRowIndex = item.originalIndex || 0;
    }
  } else {
    originalRowIndex = item.originalIndex || 0;
  }

  const message = getValidationMessage(Number(originalRowIndex) as any, Number(colIndex) as any);
  if (message) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    tooltipMessage.value = message;
    tooltipStyle.value = {
      position: 'fixed',
      top: `${rect.top - 40}px`,
      left: `${rect.left + (rect.width / 2)}px`,
      transform: 'translateX(-50%)',
      zIndex: '1000'
    };
    tooltipVisible.value = true;
  }
}

function handleCellMouseLeave() {
  tooltipVisible.value = false;
}

function handleCellInput(event: any, item: any, colIndex: any) {
  let originalRowIndex: number = 0;
  
  if (props.isFiltered) {
    if (item._originalIndex !== undefined) {
      originalRowIndex = Number(item._originalIndex);
    } else if (item._filteredOriginalIndex !== undefined) {
      originalRowIndex = Number(item._filteredOriginalIndex);
    } else if (item.originalIndex !== undefined) {
      originalRowIndex = Number(item.originalIndex);
    }
  } else {
    originalRowIndex = Number(item.originalIndex || 0);
  }
  
  emit('cell-input', event, originalRowIndex as any, Number(colIndex) as any);
}

function handleCellDoubleClick(index: any, colIndex: any, event: any) {
  const item = props.visibleRows[index];
  let originalRowIndex: number = 0;
  
  if (props.isFiltered) {
    if (item._originalIndex !== undefined) {
      originalRowIndex = Number(item._originalIndex);
    } else if (item._filteredOriginalIndex !== undefined) {
      originalRowIndex = Number(item._filteredOriginalIndex);
    } else {
      originalRowIndex = Number(item.originalIndex || 0);
    }
  } else {
    originalRowIndex = Number(item.originalIndex || 0);
  }
  
  emit('cell-dblclick', originalRowIndex as any, Number(colIndex) as any, event);
}

function handleCellMouseDown(index: any, colIndex: any, event: any) {
  const item = props.visibleRows[index];
  let originalRowIndex: number = 0;
  
  if (props.isFiltered) {
    if (item._originalIndex !== undefined) {
      originalRowIndex = Number(item._originalIndex);
    } else if (item._filteredOriginalIndex !== undefined) {
      originalRowIndex = Number(item._filteredOriginalIndex);
    } else {
      originalRowIndex = Number(item.originalIndex || 0);
    }
  } else {
    originalRowIndex = Number(item.originalIndex || 0);
  }
  
  emit('cell-mousedown', originalRowIndex as any, Number(colIndex) as any, event);
}

function handleCellMouseMove(index: any, colIndex: any, event: any) {
  const item = props.visibleRows[index];
  let originalRowIndex: number = 0;
  
  if (props.isFiltered) {
    if (item._originalIndex !== undefined) {
      originalRowIndex = Number(item._originalIndex);
    } else if (item._filteredOriginalIndex !== undefined) {
      originalRowIndex = Number(item._filteredOriginalIndex);
    } else {
      originalRowIndex = Number(item.originalIndex || 0);
    }
  } else {
    originalRowIndex = Number(item.originalIndex || 0);
  }
  
  emit('cell-mousemove', originalRowIndex as any, Number(colIndex) as any, event);
}

function handleCellContextMenu(event: any, index: any, colIndex: any) {
  const item = props.visibleRows[index];
  let originalRowIndex: number = 0;
  
  if (props.isFiltered) {
    if (item._originalIndex !== undefined) {
      originalRowIndex = Number(item._originalIndex);
    } else if (item._filteredOriginalIndex !== undefined) {
      originalRowIndex = Number(item._filteredOriginalIndex);
    } else {
      originalRowIndex = Number(item.originalIndex || 0);
    }
  } else {
    originalRowIndex = Number(item.originalIndex || 0);
  }
  
  emit('cell-contextmenu', event, originalRowIndex as any, Number(colIndex) as any);
}

defineExpose({ bodyContainer });
</script>

<style scoped>
/* Validation Error Styles - kept customized for clarity */
.validation-error {
  box-shadow: 0 0 0 2px #ff4444 inset !important;
  background-color: rgba(255, 68, 68, 0.1) !important;
  position: relative;
  z-index: 5;
}

/* Scrollbar Customization */
div::-webkit-scrollbar {
  width: 12px;
  height: 12px;
  background-color: transparent;
}

div::-webkit-scrollbar-track {
  background-color: transparent;
}

div::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 3px solid transparent;
  background-clip: content-box;
  transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), 
              border-width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

div::-webkit-scrollbar-thumb:hover {
  background-color: rgba(95, 99, 104, 0.7);
  border-width: 1px;
}

div::-webkit-scrollbar-corner {
  background-color: transparent;
}
</style>


 