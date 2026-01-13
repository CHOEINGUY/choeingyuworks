<template>
  <div class="output-area">
    <div class="output-row">
      <div class="analysis-table-container">
        <!-- Toolbar -->
        <CaseSeriesTableToolbar :results="results" />

        <!-- Table -->
        <table
          class="analysis-table"
          :style="{ fontSize: fontSize + 'px', '--table-font-size': fontSize + 'px' }"
        >
          <CaseSeriesTableHeader />
          <tbody>
            <tr v-if="!results || results.length === 0">
              <td colspan="5" class="no-data-row">
                {{ $t('caseSeries.table.noData') }}
              </td>
            </tr>
            <CaseSeriesTableRow
              v-for="(result, index) in results"
              :key="index"
              :result="result"
            />
          </tbody>
        </table>
        
        <!-- Legend -->
        <CaseSeriesTableLegend />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CaseSeriesTableToolbar from './CaseSeriesTableToolbar.vue';
import CaseSeriesTableHeader from './CaseSeriesTableHeader.vue';
import CaseSeriesTableRow from './CaseSeriesTableRow.vue';
import CaseSeriesTableLegend from './CaseSeriesTableLegend.vue';
import { CaseSeriesResult } from '@/types/analysis';

defineProps<{
  results: CaseSeriesResult[];
  fontSize: number;
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

.analysis-table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 0 24px 24px 24px;
}

/* 테이블 스타일 */
.analysis-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--table-font-size, 14px);
  table-layout: fixed;
}
.no-data-row {
  text-align: center !important;
  padding: 40px;
  color: #5f6368;
  font-style: italic;
}
</style>
