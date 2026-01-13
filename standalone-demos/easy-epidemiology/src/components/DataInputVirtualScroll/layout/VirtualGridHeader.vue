<template>
  <div 
    class="grid-header-virtual flex-none relative z-10 box-border shadow-sm border-b border-gray-200 overflow-hidden bg-slate-50" 
    ref="headerContainer" 
    :style="headerContainerStyle"
  >
    <table class="border-collapse table-fixed w-full" :style="{ width: tableWidth }">
      <colgroup>
        <col 
          v-for="column in allColumnsMeta" 
          :key="column.colIndex" 
          :style="column.style"
        >
      </colgroup>
      <thead>
        <!-- 첫 번째 헤더 행 (그룹 헤더) -->
        <tr role="row">
          <template v-for="(group, groupIndex) in headerGroups" :key="'header-group-' + groupIndex">
            <th
              v-if="group.rowspan === 2"
              rowspan="2"
              :style="group.style"
              role="columnheader"
              :class="[
                'relative border border-slate-300 p-2 text-center font-medium text-sm bg-clip-padding align-middle whitespace-nowrap select-none tracking-tight leading-[1.4] group',
                { 
                  'whitespace-normal': group.startColIndex === 1 || group.startColIndex === 2,
                  '!bg-slate-100 !font-semibold': group.startColIndex === 0 
                }
              ]"
              @contextmenu.prevent="$emit('cell-contextmenu', $event, -1, group.startColIndex)"
            >
              <div class="relative w-full h-full flex items-center justify-center">
                <span v-html="getHeaderText(group)"></span>
              </div>
              <span v-if="isColumnFiltered(group.startColIndex)" class="absolute top-[2px] right-[4px] w-[14px] h-[14px] inline-flex items-center justify-center z-[3] pointer-events-auto bg-blue-50/50 rounded-[2px] p-[1px] cursor-default transition-all border border-transparent" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1976d2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
                </svg>
              </span>
            </th>
            <th
              v-else
              :colspan="group.colspan"
              class="bg-slate-100 relative h-[35px] border border-slate-300 p-2 text-center font-medium text-sm bg-clip-padding align-middle whitespace-nowrap select-none tracking-tight leading-[1.4]"
              role="columnheader"
            >
              {{ getHeaderText(group) }}
              <div v-if="group.addable || group.deletable" class="absolute top-1/2 left-[5px] -translate-y-1/2 flex gap-[3px] items-center z-[2]">
                <button
                  v-if="group.addable"
                  @click.stop="$emit('add-column', group.type)"
                  @mouseenter="showTooltip('add', $t('dataInput.tooltips.addColumn'), $event)"
                  @mouseleave="hideTooltip"
                  class="inline-flex items-center justify-center w-[22px] h-[22px] min-w-[22px] bg-white/90 border border-slate-300 rounded text-[13px] font-semibold text-slate-500 cursor-pointer transition-all duration-200 select-none p-0 leading-none shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600 hover:scale-105 hover:shadow-md active:bg-blue-100 active:scale-95 active:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                  :aria-label="`${group.text} ${$t('dataInput.tooltips.addColumn')}`"
                >
                  +
                </button>
                <button
                  v-if="group.deletable"
                  @click.stop="$emit('delete-column', group.type)"
                  :disabled="group.columnCount <= 1"
                  @mouseenter="showTooltip('delete', group.columnCount <= 1 ? $t('dataInput.tooltips.minColumn') : $t('dataInput.tooltips.deleteColumn'), $event)"
                  @mouseleave="hideTooltip"
                  class="inline-flex items-center justify-center w-[22px] h-[22px] min-w-[22px] bg-white/90 border border-slate-300 rounded text-[13px] font-semibold text-slate-500 cursor-pointer transition-all duration-200 select-none p-0 leading-none shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-red-50 hover:border-red-600 hover:text-red-600 hover:scale-105 hover:shadow-md active:bg-red-100 active:scale-95 active:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                  :aria-label="`${group.text} ${$t('dataInput.tooltips.deleteColumn')}`"
                >
                  -
                </button>
              </div>
            </th>
          </template>
        </tr>
        <!-- 두 번째 헤더 행 (개별 헤더) -->
        <tr role="row">
          <template v-for="column in allColumnsMeta" :key="'header-th-' + column.colIndex">
            <th
              v-if="column.headerRow === 2"
              class="relative border border-slate-300 p-2 text-center font-medium text-sm bg-clip-padding align-middle whitespace-nowrap select-none tracking-tight leading-[1.4] bg-slate-50 cursor-default h-[35px] hover:bg-slate-200 group"
              role="columnheader"
              :data-col="column.colIndex"
              :class="getCellClasses(-1, column.colIndex)"
              :data-validation-message="getValidationMessage()"
              :contenteditable="isCellEditing(-1, column.colIndex)"
              @input="$emit('cell-input', $event, -1, column.colIndex)"
              @dblclick="$emit('cell-dblclick', -1, column.colIndex, $event)"
              @mousedown="$emit('cell-mousedown', -1, column.colIndex, $event)"
              @mousemove="$emit('cell-mousemove', -1, column.colIndex, $event)"
              @contextmenu.prevent="$emit('cell-contextmenu', $event, -1, column.colIndex)"
              :title="column.tooltip"
            >
              <span class="header-text">{{ column.headerText }}</span>

              <span v-if="isColumnFiltered(column.colIndex)" class="absolute top-[2px] right-[4px] w-[14px] h-[14px] inline-flex items-center justify-center z-[3] pointer-events-auto bg-blue-50/50 rounded-[2px] p-[1px] cursor-default transition-all border border-transparent" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1976d2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
                </svg>
              </span>
            </th>
          </template>
        </tr>
      </thead>
    </table>
  </div>

  <!-- 툴팁 -->
  <Teleport to="body">
    <div 
      v-if="activeTooltip" 
      class="fixed bg-[#333] text-white px-2 py-1.5 rounded text-xs whitespace-nowrap z-[10000] pointer-events-none opacity-0 animate-[tooltipFadeIn_0.2s_ease_forwards]"
      :style="tooltipStyle"
    >
      {{ tooltipText }}
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useUiStore } from '../../../stores/uiStore';
import { safeGetGlobalProperty } from '../../../utils/globalAccessWrapper';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const uiStore = useUiStore();

interface Props {
  headerGroups: any[];
  allColumnsMeta: any[];
  tableWidth: string;
  selectedCell?: { rowIndex: number | null; colIndex: number | null };
  selectedRange?: {
    start: { rowIndex: number | null; colIndex: number | null };
    end: { rowIndex: number | null; colIndex: number | null };
  };
  isEditing?: boolean;
  editingCell?: { rowIndex: number | null; colIndex: number | null };
  individualSelectedCells?: Set<string> | null;
  scrollbarWidth?: number;
  activeFilters?: Map<number, any>;
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
  scrollbarWidth: 0,
  activeFilters: () => new Map(),
  isFiltered: false
});

const emit = defineEmits<{
  (e: 'cell-mousedown', rowIndex: number, colIndex: number, event: MouseEvent): void;
  (e: 'cell-mousemove', rowIndex: number, colIndex: number, event: MouseEvent): void;
  (e: 'cell-dblclick', rowIndex: number, colIndex: number, event: MouseEvent): void;
  (e: 'cell-input', event: Event, rowIndex: number, colIndex: number): void;
  (e: 'cell-contextmenu', event: MouseEvent, rowIndex: number, colIndex: number): void;
  (e: 'add-column', type: string): void;
  (e: 'delete-column', type: string): void;
}>();

const headerContainer = ref<HTMLElement | null>(null);

// 툴팁 상태
const activeTooltip = ref<string | null>(null);
const tooltipText = ref('');
const tooltipStyle = reactive<any>({});

function isCellEditing(rowIndex: number, colIndex: number) {
  return props.isEditing && props.editingCell?.rowIndex === rowIndex && props.editingCell?.colIndex === colIndex;
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

function isMultiCellSelection(range: any) {
  if (!range || range.start.rowIndex === null) return false;
  return range.start.rowIndex !== range.end.rowIndex || range.start.colIndex !== range.end.colIndex;
}

function getCellClasses(rowIndex: number, colIndex: number) {
  const classes: string[] = [];

  if (isCellEditing(rowIndex, colIndex)) {
    classes.push('cell-editing');
    return classes;
  }

  // 개별 셀 선택 (헤더 포함)
  if (props.individualSelectedCells && props.individualSelectedCells.has(`${rowIndex}_${colIndex}`)) {
    classes.push('cell-multi-selected');
  }

  // 선택 범위에 없으면 아무 클래스도 적용하지 않음
  if (!isCellInRange(rowIndex, colIndex)) {
    return classes;
  }

  // 여러 셀이 선택된 경우에만 배경색 적용
  if (isMultiCellSelection(props.selectedRange)) {
    classes.push('cell-range-selected');
  }

  // 전체 선택 범위의 바깥쪽 테두리 적용
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

  // 현재 활성 셀에 'cell-selected' 클래스 적용 (진한 테두리)
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
  
  return classes;
}

function getValidationMessage() {
  return '';
}

const getHeaderText = (group: any) => {
  // 환자여부(1)와 확진여부(2) 열은 두 줄 표시 허용
  if (group.startColIndex === 1 || group.startColIndex === 2) {
    return group.text;
  }
  return String(group.text).replace(/<br\s*\/?>/gi, ' ');
};

function showTooltip(type: string, text: string, event: MouseEvent) {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  tooltipText.value = text;
  tooltipStyle.left = `${rect.left + rect.width / 2}px`;
  tooltipStyle.top = `${rect.bottom + 5}px`;
  tooltipStyle.transform = 'translateX(-50%)';
  activeTooltip.value = type;
}

function hideTooltip() {
  activeTooltip.value = null;
}

// Expose the container for parent access
defineExpose({ headerContainer });

const headerContainerStyle = computed(() => {
  return {
    paddingRight: props.scrollbarWidth > 0 ? `${props.scrollbarWidth}px` : '0px',
    paddingBottom: '0px'
  };
});

const isColumnFiltered = (colIndex: number) => {
  // Access store state via props or bridge
  const activeFilters = props.activeFilters || (window as any).storeBridge?.filterState?.activeFilters;
  
  if (!activeFilters || activeFilters.size === 0) return false;

  // Resolve key exactly as we do in other components
  const column = props.allColumnsMeta.find((c: any) => c.colIndex === colIndex);
  
  // 1. Try colIndex as string (default)
  if (activeFilters.has(String(colIndex))) return true;

  if (column) {
    // 2. Try dataKey-cellIndex (Array columns)
    if (column.dataKey && (column.cellIndex !== undefined && column.cellIndex !== null)) {
      if (activeFilters.has(`${column.dataKey}-${column.cellIndex}`)) return true;
    }
    // 3. Try dataKey (Single value columns)
    else if (column.dataKey && activeFilters.has(column.dataKey)) {
      return true;
    }
  }

  return false;
};
</script>

<style scoped>
@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Validation Styles - Kept as custom CSS for complex tooltips */
.validation-error {
  box-shadow: 0 0 0 2px #ff4444 inset !important;
  background-color: rgba(255, 68, 68, 0.1) !important;
  position: relative;
}

.cell-editing.validation-error {
  box-shadow: 0 0 0 2px #1a73e8 inset, 0 0 0 1px #ff4444 inset !important;
}

.cell-selected.validation-error,
.cell-range-selected.validation-error,
.cell-multi-selected.validation-error {
  box-shadow: 0 0 0 1.5px #1a73e8 inset, 0 0 0 1px #ff4444 inset !important;
}

.validation-error::after {
  content: attr(data-validation-message);
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff4444;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.validation-error:hover::after {
  opacity: 1;
}

/* Tooltip arrow */
.validation-error::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #ff4444;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1000;
  pointer-events: none;
}

.validation-error:hover::before {
  opacity: 1;
}



/* Header Text Helper */
.header-text {
  display: inline;
  vertical-align: middle;
}

/* Cell Editing Text Effect - Simplified (overlay handles the editing now) */
.cell-editing {
  background-color: #fff !important;
  box-shadow: 0 0 0 2px #1a73e8 inset !important;
  z-index: 10;
  outline: none;
  cursor: text;
}

/* Text Selection Styles (fallback mode) */
.cell-editing::selection {
  background-color: #1a73e8 !important;
  color: white !important;
}

.cell-editing::-moz-selection {
  background-color: #1a73e8 !important;
  color: white !important;
}
</style>

 