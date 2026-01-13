<template>
  <div class="table-title table-title--with-copy">
    <span>
      <span class="selected-variable-details__title-dot"></span>&nbsp;{{ $t('caseControl.toolbar.title') }}
      <span v-if="isOrFilterActive" class="filter-status">
        {{ $t('caseControl.toolbar.filterActive', { threshold: currentOrThreshold }) }}
      </span>
    </span>
    <div class="button-group">
      <div @click="$emit('toggleOrFilter')" class="filter-button" :class="{ active: isOrFilterActive }">
        <span class="button-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
          </svg>
        </span>
        <span class="button-text">{{ $t('caseControl.toolbar.orFilter') }} </span>
        <button @click.stop="$emit('cycleOrThreshold')" class="threshold-button">{{ currentOrThreshold }}.0</button>
      </div>
      <button @click="$emit('toggleYatesCorrection')" class="filter-button" :class="{ active: useYatesCorrection }">
        <span class="button-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1v6m0 6v6"></path>
            <path d="M17.5 12h-11"></path>
          </svg>
        </span>
        <span class="button-text">{{ useYatesCorrection ? $t('caseControl.toolbar.yatesActive') : $t('caseControl.toolbar.yatesInactive') }}</span>
      </button>
      <div class="relative group">
        <button @click="copyTableToClipboard" class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm cursor-pointer">
          <span class="flex items-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </span>
          <span class="font-['Noto_Sans_KR'] font-normal">{{ $t('caseControl.toolbar.copyTable') }}</span>
        </button>
        <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-50" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-50">
          <div v-if="isTableCopied" class="absolute top-full left-1/2 -translate-x-1/2 mt-2 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-lg border border-slate-100 z-50">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#1a73e8"/>
              <polyline points="7,13 11,17 17,9" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTableExport } from '../../../composables/useTableExport';
// @ts-ignore
import { generateCaseControlTsv, generateCaseControlHtml } from '../../../utils/tableHtmlGenerators';
import { CaseControlResult } from '@/types/analysis';

const props = defineProps<{
  filteredAnalysisResults: CaseControlResult[];
  currentOrThreshold: number;
  isOrFilterActive: boolean;
  useYatesCorrection: boolean;
}>();

defineEmits<{
  (e: 'toggleOrFilter'): void;
  (e: 'cycleOrThreshold'): void;
  (e: 'toggleYatesCorrection'): void;
}>();

const { isCopied: isTableCopied, copyToClipboard } = useTableExport();

const copyTableToClipboard = async () => {
  const tsvText = generateCaseControlTsv(props.filteredAnalysisResults);
  const htmlTable = generateCaseControlHtml(props.filteredAnalysisResults);
  
  await copyToClipboard({
    text: tsvText,
    html: htmlTable
  });
};
</script>

<style scoped>
.table-title,
.table-title--with-copy {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  padding: 16px 20px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  width: auto;
  min-width: 0;
  box-sizing: border-box;
}

.selected-variable-details__title-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #1a73e8;
  border-radius: 50%;
  margin-right: 8px;
}

.button-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-status {
  font-size: 0.9rem;
  color: #1a73e8;
  font-weight: normal;
  margin-left: 8px;
}

.filter-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: white;
  border: 1px solid #dadce0;
  border-radius: 4px;
  color: #5f6368;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-button:hover {
  background-color: #f8f9fa;
  color: #202124;
  border-color: #dadce0;
}

.filter-button.active {
  background-color: #e8f0fe;
  color: #1967d2;
  border-color: #d2e3fc;
}

.threshold-button {
  background: none;
  border: 1px solid #dadce0;
  border-radius: 3px;
  padding: 0 4px;
  margin: 0 2px;
  font-family: inherit;
  font-size: inherit;
  font-weight: 600;
  color: inherit;
  cursor: pointer;
  height: 20px;
  line-height: 18px;
}

.threshold-button:hover {
  background-color: white;
  border-color: #1967d2;
  color: #1967d2;
}
</style>
