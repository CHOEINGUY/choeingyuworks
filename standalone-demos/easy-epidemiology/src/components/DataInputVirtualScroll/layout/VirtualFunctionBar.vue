<template>
  <nav class="function-bar">
    <div class="cell-info-section">
      <span class="cell-id">{{ cellAddress }}</span>
      <span class="dropdown-arrow">▾</span>
      <span class="pipe-separator"></span>
      <span class="value-label">{{ $t('dataInput.functionBar.valueLabel') }}</span>
      <input
        type="text"
        v-model="inputValue"
        class="current-cell-input"
        :aria-label="$t('dataInput.functionBar.currentCellValue')"
        tabindex="-1"
        @input="onInput"
        @keydown.enter.prevent="onEnterKeyDown"
      />
      <!-- Undo/Redo 버튼 -->
      <div class="undo-redo-buttons">
        <button 
          class="undo-redo-button" 
          :disabled="!canUndo"
          :aria-label="$t('dataInput.functionBar.undo')"
          tabindex="-1"
          @click="onUndo"
          @mouseenter="showTooltip('undo', `${$t('dataInput.functionBar.undo')} (Ctrl+Z)`, $event)"
          @mouseleave="hideTooltip"
        >
          <span class="material-icons-outlined">
            undo
          </span>
        </button>
        <button 
          class="undo-redo-button" 
          :disabled="!canRedo"
          :aria-label="$t('dataInput.functionBar.redo')"
          tabindex="-1"
          @click="onRedo"
          @mouseenter="showTooltip('redo', `${$t('dataInput.functionBar.redo')} (Ctrl+Y)`, $event)"
          @mouseleave="hideTooltip"
        >
          <span class="material-icons-outlined">
            redo
          </span>
        </button>
      </div>
    </div>
    <div class="action-buttons">
      <!-- 그룹 1: 필터 상태 + 디바이더 (왼쪽 디바이더 없음) -->
      <template v-if="isFiltered">
        <div class="button-group filter-status">
          <div class="control-button-wrapper">
            <button 
              class="function-button filter-button" 
              :class="{ active: isFiltered }"
              :aria-label="$t('dataInput.functionBar.filter')"
              tabindex="-1"
              @click="onFilterButtonClick"
              @mouseenter="showTooltip('filter', $t('dataInput.functionBar.filterTooltip', { filtered: filteredRowCount, total: originalRowCount }), $event)"
              @mouseleave="hideTooltip"
            >
              <span class="material-icons-outlined function-button-icon">
                filter_list
              </span>
              <span class="button-label">{{ $t('dataInput.functionBar.filter') }}</span>
              <span class="filter-badge">{{ $t('dataInput.functionBar.filterApplied') }}</span>
            </button>
          </div>
        </div>
        <div class="button-group-divider"></div>
      </template>
      <!-- 그룹 2: 열 토글 -->
      <div class="button-group column-toggles">
        <div class="control-button-wrapper">
          <button
            :class="['function-button', { active: isConfirmedCaseColumnVisible }]"
            :aria-label="$t('dataInput.functionBar.confirmedCase')"
            tabindex="-1"
            @click="onToggleConfirmedCaseColumn"
            @mouseenter="showTooltip('toggleConfirmedCase', $t('dataInput.functionBar.toggleConfirmedTooltip'), $event)"
            @mouseleave="hideTooltip"
          >
            <span class="material-icons-outlined function-button-icon">
              verified_user
            </span>
            <span class="button-label">{{ $t('dataInput.functionBar.confirmedCase') }}</span>
          </button>
        </div>
        <div class="control-button-wrapper" style="margin-left: 2px;">
          <button
            :class="['function-button', { active: isIndividualExposureColumnVisible }]"
            :aria-label="$t('dataInput.functionBar.exposure')"
            tabindex="-1"
            @click="onToggleExposureColumn"
            @mouseenter="showTooltip('toggleExposure', $t('dataInput.functionBar.toggleExposureTooltip'), $event)"
            @mouseleave="hideTooltip"
          >
            <span class="material-icons-outlined function-button-icon">
              access_time
            </span>
            <span class="button-label">{{ $t('dataInput.functionBar.exposure') }}</span>
          </button>
        </div>
      </div>
      
      <!-- 구분선 -->
      <div class="button-group-divider"></div>

      <!-- 그룹 3: 데이터 입출력 -->
      <div class="button-group data-io">
        <div class="control-button-wrapper">
          <!-- Excel Upload Button -->
          <div @mouseenter="showTooltip('excelUpload', $t('dataInput.functionBar.excelUploadTooltip'), $event)" @mouseleave="hideTooltip">
          <ExcelUploadButton
            :is-uploading="isUploadingExcel"
            :upload-progress="uploadProgress"
            @file-selected="onFileSelected"
          />
          </div>
        </div>
        <div 
          class="control-button-wrapper"
          style="position: relative;"
          @mouseenter="showTemplateMenuHover"
          @mouseleave="hideTemplateMenuHover"
        >
          <button 
            class="function-button" 
            :aria-label="$t('dataInput.functionBar.downloadTemplate')"
            tabindex="-1"
          >
            <span class="material-icons-outlined function-button-icon">
              description
            </span>
            <span class="button-label">{{ $t('dataInput.functionBar.downloadTemplate') }}</span>
          </button>
          <div v-if="showTemplateMenu" class="template-menu" @mouseenter="showTemplateMenuHover" @mouseleave="hideTemplateMenuHover" @click.stop>
            <button class="template-menu-button" tabindex="-1" @click="onSelectTemplate('basic')">{{ $t('dataInput.functionBar.basicTemplate') }}</button>
            <button class="template-menu-button" tabindex="-1" @click="onSelectTemplate('individual')">{{ $t('dataInput.functionBar.individualTemplate') }}</button>
          </div>
        </div>
        <div class="control-button-wrapper">
          <button 
            class="function-button" 
            :aria-label="$t('dataInput.functionBar.exportData')"
            tabindex="-1"
            @click="onExportData"
            @mouseenter="showTooltip('exportData', $t('dataInput.functionBar.exportTooltip'), $event)"
            @mouseleave="hideTooltip"
          >
            <span class="material-icons-outlined function-button-icon">
              file_download
            </span>
            <span class="button-label">{{ $t('dataInput.functionBar.exportData') }}</span>
          </button>
        </div>
      </div>
      
      <!-- 구분선 -->
      <div class="button-group-divider"></div>
      
      <!-- 그룹 4: 시트 편집 -->
      <div class="button-group sheet-editing">
        <div class="control-button-wrapper">
          <button 
            class="function-button" 
            :aria-label="$t('dataInput.functionBar.copyAll')"
            tabindex="-1"
            @click="onCopyEntireData"
            @mouseenter="showTooltip('copyData', $t('dataInput.functionBar.copyTooltip'), $event)"
            @mouseleave="hideTooltip"
          >
            <span class="material-icons-outlined function-button-icon">
              content_copy
            </span>
            <span class="button-label">{{ $t('dataInput.functionBar.copyAll') }}</span>
          </button>
        </div>
        <div class="control-button-wrapper">
          <button 
            class="function-button" 
            :aria-label="$t('dataInput.functionBar.deleteEmptyCols')"
            tabindex="-1"
            @click="onDeleteEmptyCols"
            @mouseenter="showTooltip('deleteEmptyCols', $t('dataInput.functionBar.deleteEmptyTooltip'), $event)"
            @mouseleave="hideTooltip"
          >
            <span class="material-icons-outlined function-button-icon">
              delete_outline
            </span>
            <span class="button-label">{{ $t('dataInput.functionBar.deleteEmptyCols') }}</span>
          </button>
        </div>
        <div class="control-button-wrapper">
          <button 
            class="function-button" 
            :aria-label="$t('dataInput.functionBar.resetSheet')"
            tabindex="-1"
            @click="onResetSheet"
            @mouseenter="showTooltip('resetSheet', $t('dataInput.functionBar.resetTooltip'), $event)"
            @mouseleave="hideTooltip"
          >
            <span class="material-icons-outlined function-button-icon">
              refresh
            </span>
            <span class="button-label">{{ $t('dataInput.functionBar.resetSheet') }}</span>
          </button>
        </div>
      </div>
      
      <!-- 그룹 5: Undo/Redo -->
      <div class="button-group undo-redo">

      </div>
    </div>
  </nav>

  <!-- 글로벌 툴팁 -->
  <Teleport to="body">
    <div v-if="activeTooltip" :class="['function-bar-tooltip', {visible: tooltipVisible}]" :style="tooltipStyle">
      {{ tooltipText }}
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '../../../stores/settingsStore';
import ExcelUploadButton from '../parts/ExcelUploadButton.vue';

interface Props {
  cellAddress?: string;
  cellValue?: string | number;
  isUploadingExcel?: boolean;
  uploadProgress?: number;
  canUndo?: boolean;
  canRedo?: boolean;
  isFiltered?: boolean;
  filteredRowCount?: number;
  originalRowCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  cellAddress: '',
  cellValue: '',
  isUploadingExcel: false,
  uploadProgress: 0,
  canUndo: false,
  canRedo: false,
  isFiltered: false,
  filteredRowCount: 0,
  originalRowCount: 0
});

const emit = defineEmits<{
  (e: 'update-cell-value', value: string | number): void;
  (e: 'enter-pressed'): void;
  (e: 'excel-file-selected', file: File): void;
  (e: 'download-template', type: string): void;
  (e: 'export-data'): void;
  (e: 'copy-entire-data'): void;
  (e: 'delete-empty-cols'): void;
  (e: 'reset-sheet'): void;
  (e: 'toggle-exposure-col'): void;
  (e: 'toggle-confirmed-case-col'): void;
  (e: 'undo'): void;
  (e: 'redo'): void;
  (e: 'clear-all-filters'): void;
}>();

const { t } = useI18n();
const settingsStore = useSettingsStore();
const inputValue = ref<string | number>(props.cellValue);
const showTemplateMenu = ref(false);

// 개별 노출시간 컬럼 가시성 상태
const isIndividualExposureColumnVisible = computed(
  () => settingsStore.isIndividualExposureColumnVisible
);

// 확진자 여부 컬럼 가시성 상태
const isConfirmedCaseColumnVisible = computed(
  () => settingsStore.isConfirmedCaseColumnVisible
);

// === Tooltip State ===
const activeTooltip = ref<string | null>(null);
const tooltipVisible = ref(false);
const tooltipText = ref('');
const tooltipPos = ref({ x: 0, y: 0 });

const tooltipStyle = computed(() => ({
  position: 'fixed' as const,
  left: `${tooltipPos.value.x}px`,
  top: `${tooltipPos.value.y}px`,
  transform: 'translateX(-50%)',
  zIndex: 10002
}));

function showTooltip(key: string, text: string, event: MouseEvent) {
  if (key === 'template') return;
  activeTooltip.value = key;
  tooltipVisible.value = false;
  tooltipText.value = text;
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const y = rect.bottom + 5;
  const initial = { x: rect.left + rect.width/2, y };
  tooltipPos.value = { x: initial.x, y: initial.y };

  nextTick(() => {
    const tip = document.querySelector('.function-bar-tooltip') as HTMLElement;
    if (!tip) return;
    const tipRect = tip.getBoundingClientRect();
    const pad = 10;
    let x = initial.x;
    if (x + tipRect.width/2 > window.innerWidth - pad) {
      x = window.innerWidth - tipRect.width/2 - pad;
    }
    if (x - tipRect.width/2 < pad) {
      x = tipRect.width/2 + pad;
    }
    tooltipPos.value = { x, y: initial.y };
    tooltipVisible.value = true;
  });
}

function hideTooltip() {
  activeTooltip.value = null;
  tooltipVisible.value = false;
}

// Sync external cellValue prop
watch(() => props.cellValue, (v) => { inputValue.value = v; });

// --- Template menu hover logic ---
let hideTimer: any = null;

function showTemplateMenuHover() {
  clearTimeout(hideTimer);
  showTemplateMenu.value = true;
}

function hideTemplateMenuHover() {
  hideTimer = setTimeout(() => {
    showTemplateMenu.value = false;
  }, 200);
}

function onInput() {
  emit('update-cell-value', inputValue.value);
}

function onEnterKeyDown() {
  emit('enter-pressed');
}

function onFileSelected(file: File) {
  emit('excel-file-selected', file);
}

function onExportData() {
  emit('export-data');
}

function onCopyEntireData() {
  emit('copy-entire-data');
}

function onDeleteEmptyCols() {
  emit('delete-empty-cols');
}

function onResetSheet() {
  emit('reset-sheet');
}

function onToggleExposureColumn() {
  emit('toggle-exposure-col');
}

function onToggleConfirmedCaseColumn() {
  emit('toggle-confirmed-case-col');
}

function onSelectTemplate(type: string) {
  showTemplateMenu.value = false;
  emit('download-template', type);
}

function onUndo() {
  emit('undo');
}

function onRedo() {
  emit('redo');
}

function onFilterButtonClick() {
  hideTooltip();
  emit('clear-all-filters');
}
</script>

<style scoped>
.function-bar {
  display: flex;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #d3d3d3;
  padding: 0 8px;
  min-height: 40px;
  z-index: 15; /* 드롭다운 메뉴가 그리드(z-index: 10) 위에 표시되도록 */
  position: relative; /* z-index 적용을 위해 필요 */
}

.cell-info-section {
  display: flex;
  align-items: center;
  flex-grow: 1;
  min-width: 0;
  border-right: 1px solid #d3d3d3;
  padding-right: 4px;
  margin-right: 4px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0px;
  flex-shrink: 0;
}

.button-group {
  display: flex;
  align-items: center;
  gap: 0px;
}

.button-group-divider {
  width: 1px;
  height: 32px; /* function-bar의 min-height와 맞춤 */
  background: #e0e0e0;
  margin: 0 2px;
}

.cell-id {
  /* font-family: "Nanum Gothic"; Removed for global font */
  font-size: 14px;
  font-weight: 400;
  color: black;
  padding: 0 4px 0 12px;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-width: 80px;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-arrow {
  font-size: 15px;
  color: #5f6368;
  padding: 0 6px 0 4px;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.pipe-separator {
  color: lightgray;
  margin: 0 8px;
  height: 60%;
  border-left: 1px solid lightgray;
}

.value-label {
  font-family: "Georgia", serif;
  font-size: 15px;
  font-weight: 500;
  font-style: italic;
  color: gray;
  padding: 6px 6px 4px 8px;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
  min-width: 24px;
}

.current-cell-input {
  border: none;
  border-radius: 0;
  padding-left: 8px;
  font-size: 15px;
  /* font-family: "Nanum Gothic"; Removed for global font */
  flex-grow: 1;
  outline: none;
  height: 100%;
  box-sizing: border-box;
  background-color: transparent;
  cursor: text;
}

.current-cell-input:focus {
  box-shadow: none;
  border-radius: 0;
}

.function-button {
  background: transparent;
  border: none;
  color: #3c4043;
  cursor: pointer;
  padding: 8px 8px;
  text-align: center;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* font-family: "Google Sans", Roboto, Arial, sans-serif; Removed for global font */
  font-size: 14px;
  font-weight: 400;
  border-radius: 4px;
  height: 32px;
  box-sizing: border-box;
  white-space: nowrap;
  transition: all 0.15s ease;
  gap: 6px;
  min-width: 0;
}

/* 반응형: 화면이 좁아지면 텍스트 숨김 (아이콘만 표시) */
@media (max-width: 1300px) {
  .button-label {
    display: none;
  }
  
  .filter-badge {
    display: none; /* 공간 절약을 위해 배지도 숨김 */
  }
  
  /* 아이콘만 남을 때 여백 조정 */
  .function-button {
    padding: 8px 6px;
  }
  
  .function-button-icon {
    margin-right: 0;
  }
  
  /* 툴팁이나 호버 효과는 그대로 유지됨 */
}

.function-button:hover {
  background: #f1f3f4;
  color: #1a73e8;
}

.function-button.active {
  background: #e8f0fe;
  color: #1967d2;
  font-weight: 500;
}

.function-button.active .function-button-icon {
  color: #1967d2;
}

.function-button-icon {
  font-family: 'Material Icons Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 18px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  font-feature-settings: 'liga';
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  flex-shrink: 0;
  color: #5f6368;
}

.function-button:hover .function-button-icon {
  color: #1a73e8;
}

.function-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #9aa0a6;
}

.function-button:disabled:hover {
  background-color: transparent;
}

.function-button:disabled .function-button-icon {
  color: #9aa0a6;
}

/* Undo/Redo 버튼 스타일 */
.undo-redo-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
}

.undo-redo-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #5f6368;
}

.undo-redo-button:hover:not(:disabled) {
  background-color: #f8f9fa;
  color: #1a73e8;
}

.undo-redo-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #9aa0a6;
}

.undo-redo-button .material-icons-outlined {
  font-size: 16px;
}

.control-button-wrapper {
  position: relative;
}

/* Template menu (dark style) */
.template-menu {
  position: absolute;
  top: calc(100% + 5px);
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  padding: 6px;
  z-index: 1000;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.template-menu-button {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 8px 16px;
  text-align: left;
  width: 100%;
  /* font-family: "Google Sans", Roboto, Arial, sans-serif; Removed for global font */
  font-size: 14px;
  border-radius: 4px;
  white-space: nowrap;
  transition: background-color 0.15s ease;
}

.template-menu-button:hover {
  background: #555;
}

/* Tooltip styles */
.function-bar-tooltip {
  background: #333;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  opacity: 0;
  transition: opacity 0.08s ease;
  pointer-events: none;
}

.function-bar-tooltip.visible {
  opacity: 1;
}

/* 필터 버튼 스타일 */
.filter-button {
  position: relative;
}

.filter-badge {
  background: #1a73e8;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
  margin-left: 4px;
  white-space: nowrap;
}

.filter-button.active {
  background: #e8f0fe;
  color: #1967d2;
  font-weight: 500;
}

.filter-button.active .filter-badge {
  background: #1967d2;
}
</style>