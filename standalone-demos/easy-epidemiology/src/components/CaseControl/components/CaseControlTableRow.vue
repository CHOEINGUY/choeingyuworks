<template>
  <tr
    class="data-row"
    :class="{ 'significant-row': result.pValue !== null && result.pValue < 0.05 }"
  >
    <td class="cell-item">{{ result.item }}</td>
    <td class="cell-count">{{ result.b_obs }}</td>
    <td class="cell-count">{{ result.c_obs }}</td>
    <td class="cell-total">{{ result.rowTotal_Case }}</td>
    <td class="cell-count">{{ result.e_obs }}</td>
    <td class="cell-count">{{ result.f_obs }}</td>
    <td class="cell-total">{{ result.rowTotal_Control }}</td>
    <td
      class="cell-stat value-pvalue"
      :class="{
        significant:
          result.pValue !== null && result.pValue < 0.05,
      }"
      :title="result.adj_chi === null && result.pValue !== null ? $t('caseControl.table.tooltips.fisher') : (useYatesCorrection ? $t('caseControl.table.tooltips.yates') : $t('caseControl.table.tooltips.chiSquare'))"
    >
      <span v-if="result.pValue !== null">
        {{ (result.pValue < 0.001 ? "<0.001" : result.pValue.toFixed(3)) }}<sup v-if="result.adj_chi === null" class="test-method fisher">*</sup>
      </span>
      <span v-else>N/A</span>
    </td>
    <td class="cell-stat">{{ result.oddsRatio }}{{ result.hasCorrection ? '†' : '' }}</td>
    <td class="cell-stat">{{ result.ci_lower }}{{ result.hasCorrection ? '†' : '' }}</td>
    <td class="cell-stat">{{ result.ci_upper }}{{ result.hasCorrection ? '†' : '' }}</td>
  </tr>
</template>

<script setup lang="ts">
import { CaseControlResult } from '@/types/analysis';

defineProps<{
  result: CaseControlResult;
  useYatesCorrection?: boolean;
}>();
</script>

<style scoped>
td {
  border: 1px solid #e0e0e0;
  padding: 8px;
  text-align: center;
  vertical-align: middle;
}

.data-row td {
  font-family: inherit;
}
.cell-item {
  text-align: left !important;
  font-weight: 500;
  background-color: #fff;
}
.cell-count {
  font-weight: 500;
}
.cell-total {
  background-color: #f8f9fa;
}
.cell-stat {
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}
.value-pvalue {
  font-weight: 500;
}
.significant-row td {
  background-color: #fffbe6;
}
.significant {
  font-weight: 700;
  color: #d93025;
}
</style>
