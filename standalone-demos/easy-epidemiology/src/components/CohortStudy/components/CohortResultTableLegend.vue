<template>
  <div class="table-legend">
    <div class="legend-header">
      <span class="legend-title">{{ $t('cohortStudy.table.legend.title') }}</span>
    </div>
    <div class="legend-content legend-content--plain">
      <div class="legend-item-plain">{{ $t('cohortStudy.table.legend.fisher') }}</div>
      <div class="legend-item-plain">{{ useYatesCorrection ? $t('cohortStudy.table.legend.yatesChiSquare') : $t('cohortStudy.table.legend.chiSquare') }}</div>
      <div class="legend-item-plain">{{ $t('cohortStudy.table.legend.na') }}</div>
      <div class="legend-item-plain correction-note">
        {{ $t('cohortStudy.table.legend.correctionNote') }}
      </div>
      <div class="legend-item-plain">{{ $t('cohortStudy.table.legend.correctionApplied') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  useYatesCorrection?: boolean;
}>();
</script>

<style scoped>
.table-legend {
  margin-top: 16px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.legend-header {
  margin-bottom: 8px;
}

.legend-title {
  font-size: 13px;
  font-weight: 600;
  color: #3c4043;
}

.legend-content--plain {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.legend-item-plain {
  font-size: 12px;
  color: #5f6368;
  line-height: 1.4;
}

.correction-note {
  margin-top: 4px;
  font-style: italic;
}
</style>
