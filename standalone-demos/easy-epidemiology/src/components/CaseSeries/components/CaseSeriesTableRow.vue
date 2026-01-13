<template>
  <tr class="data-row">
    <td class="cell-item">{{ result.item }}</td>
    <td class="cell-count">{{ result.exposedCases }}</td>
    <td class="cell-count">{{ result.unexposedCases }}</td>
    <td class="cell-total">{{ result.totalCases }}</td>
    <td class="cell-stat">{{ result.incidence_formatted }}</td>
  </tr>
</template>

<script setup lang="ts">
import { CaseSeriesResult } from '@/types/analysis';

defineProps<{
  result: CaseSeriesResult;
}>();
</script>

<style scoped>
td {
  border: 1px solid #e0e0e0;
  padding: 8px;
  text-align: center;
  vertical-align: middle;
}

.cell-item {
  text-align: left !important;
  font-weight: 500;
  background-color: #fff;
}

.cell-total {
  background-color: #f8f9fa;
}

.cell-count {
  font-weight: 500;
}

.cell-stat {
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}
</style>
