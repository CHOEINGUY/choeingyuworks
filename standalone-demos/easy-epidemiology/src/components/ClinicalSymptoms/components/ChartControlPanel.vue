<template>
  <div class="flex flex-wrap items-center gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200 shadow-sm backdrop-blur-sm w-full">
    <!-- 막대 방향 -->
    <ControlCycleText
      :label="$t('clinicalSymptoms.controls.direction') + ':'"
      :modelValue="barDirection"
      @update:modelValue="$emit('update:barDirection', $event as 'horizontal' | 'vertical')"
      :options="['vertical', 'horizontal']"
      :displayLabels="[$t('clinicalSymptoms.controls.directionVertical'), $t('clinicalSymptoms.controls.directionHorizontal')]"
      :tooltipPrefix="$t('clinicalSymptoms.controls.directionTooltip')"
      :suffix="$t('clinicalSymptoms.controls.directionSuffix')"
    />
    
    <!-- 폰트 크기 -->
    <ControlCycleText
      :label="$t('clinicalSymptoms.controls.fontSize') + ':'"
      :modelValue="chartFontSize"
      @update:modelValue="$emit('update:chartFontSize', $event as number)"
      :options="fontSizes"
      :displayLabels="fontSizeLabels"
      :tooltipPrefix="$t('clinicalSymptoms.controls.fontSizePrefix')"
      :suffix="$t('clinicalSymptoms.controls.fontSizeSuffix')"
      minWidthClass="min-w-[60px]"
    />
    
    <!-- 차트 너비 -->
    <ControlCycleText
      :label="$t('clinicalSymptoms.controls.chartWidth') + ':'"
      :modelValue="chartWidth"
      @update:modelValue="$emit('update:chartWidth', $event as number)"
      :options="chartWidths"
      :tooltipPrefix="$t('clinicalSymptoms.controls.chartWidthPrefix')"
      :suffix="$t('clinicalSymptoms.controls.chartWidthSuffix')"
      minWidthClass="min-w-[70px]"
    />
    
    <!-- 막대 너비 -->
    <ControlCycleText
      :label="$t('clinicalSymptoms.controls.barWidth') + ':'"
      :modelValue="barWidthPercent"
      @update:modelValue="$emit('update:barWidthPercent', $event as number)"
      :options="barWidthPercents"
      :tooltipPrefix="$t('clinicalSymptoms.controls.barWidthPrefix')"
      :suffix="$t('clinicalSymptoms.controls.barWidthSuffix')"
      minWidthClass="min-w-[50px]"
    />
    
    <!-- 막대 강조 -->
    <ControlCycleText
      :label="$t('clinicalSymptoms.controls.highlight') + ':'"
      :modelValue="currentHighlight"
      @update:modelValue="$emit('update:currentHighlight', $event as 'none' | 'max' | 'min' | 'both')"
      :options="highlightOptionsNormalized"
      minWidthClass="min-w-[100px]"
    />
    
    <!-- 정렬 -->
    <ControlCycleText
      :label="$t('clinicalSymptoms.controls.sort') + ':'"
      :modelValue="currentSort"
      @update:modelValue="$emit('update:currentSort', $event as string)"
      :options="sortOptionsNormalized"
      minWidthClass="min-w-[90px]"
    />
    
    <!-- 색상 -->
    <ControlCycleColor
      :label="$t('clinicalSymptoms.controls.color') + ':'"
      :modelValue="selectedBarColor"
      @update:modelValue="$emit('update:selectedBarColor', $event)"
      :options="barColors"
      :tooltip="$t('clinicalSymptoms.controls.colorTooltip')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ControlCycleText from './controls/ControlCycleText.vue';
import ControlCycleColor from './controls/ControlCycleColor.vue';
import type { CycleOption } from '@/types/ui';
import type { HighlightOption, SortOption } from '../composables/useChartControls';

const { t } = useI18n();

const props = withDefaults(defineProps<{
  barDirection?: 'horizontal' | 'vertical';
  chartFontSize?: number;
  chartWidth?: number;
  barWidthPercent?: number;
  selectedBarColor?: string;
  currentHighlight?: 'none' | 'max' | 'min' | 'both';
  currentSort?: string;
  // 옵션 배열들
  fontSizes?: number[];
  fontSizeLabels?: string[];
  chartWidths?: number[];
  barWidthPercents?: number[];
  barColors?: string[];
  highlightOptions?: HighlightOption[];
  sortOptions?: SortOption[];
}>(), {
  barDirection: 'vertical',
  chartFontSize: 16,
  chartWidth: 700,
  barWidthPercent: 50,
  selectedBarColor: '#5470c6',
  currentHighlight: 'none',
  currentSort: 'none',
  fontSizes: () => [],
  fontSizeLabels: () => [],
  chartWidths: () => [],
  barWidthPercents: () => [],
  barColors: () => [],
  highlightOptions: () => [],
  sortOptions: () => []
});

defineEmits<{
  (e: 'update:barDirection', value: 'horizontal' | 'vertical'): void;
  (e: 'update:chartFontSize', value: number): void;
  (e: 'update:chartWidth', value: number): void;
  (e: 'update:barWidthPercent', value: number): void;
  (e: 'update:selectedBarColor', value: string): void;
  (e: 'update:currentHighlight', value: 'none' | 'max' | 'min' | 'both'): void;
  (e: 'update:currentSort', value: string): void;
}>();

// Normalize options for ControlCycleText ({value, label, tooltip})
const highlightOptionsNormalized = computed<CycleOption[]>(() => {
  return props.highlightOptions.map((opt: HighlightOption) => ({
    value: opt.key,
    label: opt.label,
    tooltip: opt.tooltip
  }));
});

const sortOptionsNormalized = computed<CycleOption[]>(() => {
  return props.sortOptions.map((opt: SortOption) => ({
    value: opt.key,
    label: opt.label,
    tooltip: opt.tooltip
  }));
});
</script>
