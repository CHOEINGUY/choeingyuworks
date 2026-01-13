<template>
  <tr
    class="data-row"
    :class="{ 'significant-row': result.pValue !== null && result.pValue < 0.05 }"
  >
    <td class="cell-item">{{ result.item }}</td>
    <td class="cell-total">{{ result.rowTotal_Exposed }}</td>
    <td class="cell-count">{{ result.a_obs }}</td>
    <td class="cell-stat">
      {{ result.incidence_exposed_formatted }}
    </td>
    <td class="cell-total">{{ result.rowTotal_Unexposed }}</td>
    <td class="cell-count">{{ result.c_obs }}</td>
    <td class="cell-stat">
      {{ result.incidence_unexposed_formatted }}
    </td>
    <td
      class="cell-stat value-pvalue"
      :class="{
        significant:
          result.pValue !== null && result.pValue < 0.05,
      }"
      :title="result.adj_chi === null && result.pValue !== null ? $t('cohortStudy.table.tooltips.fisher') : (useYatesCorrection ? $t('cohortStudy.table.tooltips.yates') : $t('cohortStudy.table.tooltips.chiSquare'))"
    >
      <span v-if="result.pValue !== null">
        {{ (result.pValue < 0.001 ? "<0.001" : result.pValue.toFixed(3)) }}<sup v-if="result.adj_chi === null" class="test-method fisher">*</sup>
      </span>
      <span v-else>N/A</span>
    </td>
    <td class="cell-stat">{{ result.relativeRisk }}{{ result.hasCorrection ? '†' : '' }}</td>
    <td class="cell-stat">{{ result.rr_ci_lower }}{{ result.hasCorrection ? '†' : '' }}</td>
    <td class="cell-stat">{{ result.rr_ci_upper }}{{ result.hasCorrection ? '†' : '' }}</td>
  </tr>
</template>

<script setup lang="ts">
import { CohortResult } from '@/types/analysis';

defineProps<{
  result: CohortResult;
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

.value-pvalue {
  font-weight: 500;
}

.significant-row td {
  background-color: #fffbe6;
}

.significant {
  color: #d93025;
  font-weight: 700;
}

.test-method.fisher {
  color: #d93025;
  font-weight: bold;
}
</style>
