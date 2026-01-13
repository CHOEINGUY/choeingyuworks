<template>
  <div class="output-area">
    <div class="output-row">
      <div class="analysis-table-container">
        <!-- Toolbar -->
        <CohortResultTableToolbar
          :results="results"
          :useYatesCorrection="useYatesCorrection"
          @toggle-yates="$emit('toggle-yates')"
        />

        <!-- Table -->
        <table
          class="analysis-table"
          :style="{ fontSize: fontSize + 'px', '--table-font-size': fontSize + 'px' }"
        >
          <CohortResultTableHeader />
          <tbody>
            <tr v-if="!results || results.length === 0">
              <td colspan="11" class="no-data-row">
                {{ $t('cohortStudy.table.noData') }}
              </td>
            </tr>
            <CohortResultTableRow
              v-for="(result, index) in results"
              :key="index"
              :result="result"
              :useYatesCorrection="useYatesCorrection"
            />
          </tbody>
        </table>
        
        <!-- Legend -->
        <CohortResultTableLegend :useYatesCorrection="useYatesCorrection" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CohortResultTableToolbar from './CohortResultTableToolbar.vue';
import CohortResultTableHeader from './CohortResultTableHeader.vue';
import CohortResultTableRow from './CohortResultTableRow.vue';
import CohortResultTableLegend from './CohortResultTableLegend.vue';
import { CohortResult } from '@/types/analysis';

defineProps<{
  results: CohortResult[];
  fontSize: number;
  useYatesCorrection: boolean;
}>();

defineEmits<{
  (e: 'toggle-yates'): void;
}>();
</script>

<style scoped>
.output-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: transparent; /* Transparent */
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
  text-align: center;
  padding: 40px;
  color: #5f6368;
  font-style: italic;
}

@keyframes popIn {
  from {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}
</style>
