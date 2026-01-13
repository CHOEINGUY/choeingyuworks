<template>
  <div class="output-area">
    <div class="output-row">
      <div class="analysis-table-container">
        <!-- Toolbar -->
        <CaseControlTableToolbar
          :filteredAnalysisResults="filteredAnalysisResults"
          :currentOrThreshold="currentOrThreshold"
          :isOrFilterActive="isOrFilterActive"
          :useYatesCorrection="useYatesCorrection"
          @toggleOrFilter="$emit('toggleOrFilter')"
          @cycleOrThreshold="$emit('cycleOrThreshold')"
          @toggleYatesCorrection="$emit('toggleYatesCorrection')"
        />

        <!-- Table -->
        <table
          class="analysis-table"
          :style="{ fontSize: tableFontSize + 'px', '--table-font-size': tableFontSize + 'px' }"
        >
          <CaseControlTableHeader />
          <tbody>
            <tr v-if="!filteredAnalysisResults || filteredAnalysisResults.length === 0">
              <td colspan="11" class="no-data-row">
                {{ isOrFilterActive ? $t('caseControl.table.noDataFilter', { threshold: currentOrThreshold }) : $t('caseControl.table.noData') }}
              </td>
            </tr>
            <CaseControlTableRow
              v-for="(result, index) in filteredAnalysisResults"
              :key="index"
              :result="result"
              :useYatesCorrection="useYatesCorrection"
            />
          </tbody>
        </table>
        
        <!-- Legend -->
        <CaseControlTableLegend :useYatesCorrection="useYatesCorrection" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CaseControlTableToolbar from './CaseControlTableToolbar.vue';
import CaseControlTableHeader from './CaseControlTableHeader.vue';
import CaseControlTableRow from './CaseControlTableRow.vue';
import CaseControlTableLegend from './CaseControlTableLegend.vue';
import { CaseControlResult } from '@/types/analysis';

withDefaults(defineProps<{
  filteredAnalysisResults: CaseControlResult[];
  tableFontSize?: number;
  currentOrThreshold?: number;
  isOrFilterActive?: boolean;
  useYatesCorrection?: boolean;
}>(), {
  tableFontSize: 14,
  currentOrThreshold: 2,
  isOrFilterActive: false,
  useYatesCorrection: false
});

defineEmits<{
  (e: 'toggleOrFilter'): void;
  (e: 'cycleOrThreshold'): void;
  (e: 'toggleYatesCorrection'): void;
}>();
</script>

<style scoped>
.output-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  overflow: hidden;
}

.output-row {
  display: flex;
  gap: 24px;
  height: 100%;
}

/* --- 분석 결과 테이블 컨테이너 스타일 --- */
.analysis-table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: transparent; /* Transparent */
  overflow: hidden;
  padding: 0 24px 24px 24px;
}

/* --- 분석 테이블 스타일 --- */
.analysis-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--table-font-size, 14px);
  table-layout: fixed;
}
</style>
