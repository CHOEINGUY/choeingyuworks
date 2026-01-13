<template>
  <div class="flex flex-wrap items-center gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200 shadow-sm backdrop-blur-sm">
    <!-- 차트 대상 -->
    <ControlGroup
      :label="$t('patientChars.chartControl.target')"
      :modelValue="chartType"
      @update:modelValue="$emit('update:chartType', $event as string)"
      :options="[
        { value: 'total', label: $t('patientChars.chartControl.total'), tooltip: $t('patientChars.chartControl.totalTooltip') },
        { value: 'patient', label: $t('patientChars.chartControl.patient'), tooltip: $t('patientChars.chartControl.patientTooltip') }
      ]"
    />

    <div class="w-px h-8 bg-slate-200 mx-1"></div>

    <!-- 데이터 유형 -->
    <ControlGroup
      :label="$t('patientChars.chartControl.dataType')"
      :modelValue="dataType"
      @update:modelValue="$emit('update:dataType', $event as string)"
      :options="[
        { value: 'count', label: $t('patientChars.chartControl.dataCount'), tooltip: $t('patientChars.chartControl.dataCountTooltip') },
        { value: 'percentage', label: $t('patientChars.chartControl.dataPercent'), tooltip: $t('patientChars.chartControl.dataPercentTooltip') }
      ]"
    />

    <!-- 폰트 크기 -->
    <ControlCycleText
      :label="$t('patientChars.chartControl.fontSize')"
      :modelValue="fontSize"
      @update:modelValue="$emit('update:fontSize', $event as number)"
      :options="[12, 15, 18, 21, 24]"
      :displayLabels="[$t('patientChars.chartControl.sizeVerySmall'), $t('patientChars.chartControl.sizeSmall'), $t('patientChars.chartControl.sizeNormal'), $t('patientChars.chartControl.sizeLarge'), $t('patientChars.chartControl.sizeVeryLarge')]"
      :tooltipPrefix="$t('patientChars.chartControl.sizeTooltipPrefix')"
      :suffix="$t('patientChars.chartControl.sizeTooltipSuffix')"
      minWidthClass="min-w-[60px]"
    />

    <!-- 차트 너비 -->
    <ControlCycleText
      :label="$t('patientChars.chartControl.chartWidth')"
      :modelValue="chartWidth"
      @update:modelValue="$emit('update:chartWidth', $event as number)"
      :options="[500, 700, 900, 1100]"
      :tooltipPrefix="$t('patientChars.chartControl.widthTooltipPrefix')"
      suffix="px"
      minWidthClass="min-w-[70px]"
    />

    <!-- 막대 너비 -->
    <ControlCycleText
      :label="$t('patientChars.chartControl.barWidth')"
      :modelValue="barWidth"
      @update:modelValue="$emit('update:barWidth', $event as number)"
      :options="[30, 50, 70]"
      :tooltipPrefix="$t('patientChars.chartControl.barWidthTooltipPrefix')"
      suffix="%"
      minWidthClass="min-w-[50px]"
    />

    <!-- 막대 강조 -->
    <ControlCycleText
      :label="$t('patientChars.chartControl.highlight')"
      :modelValue="highlight"
      @update:modelValue="$emit('update:highlight', $event as string)"
      :options="highlightOptionsNormalized"
      minWidthClass="min-w-[100px]"
    />

    <!-- 막대 색상 -->
    <ControlCycleColor
      :label="$t('patientChars.chartControl.barColor')"
      :modelValue="barColor"
      @update:modelValue="$emit('update:barColor', $event)"
      :options="barColors"
      :tooltip="$t('patientChars.chartControl.barColorTooltip')"
    />
  </div>
</template>

<script setup lang="ts">
// ChartControlPanel.vue - 차트 설정 컨트롤 패널 (Refactored)
import { computed } from 'vue';
import ControlGroup from './controls/ControlGroup.vue';
import ControlCycleText from './controls/ControlCycleText.vue';
import ControlCycleColor from './controls/ControlCycleColor.vue';
import type { BoxOption, CycleOption } from '@/types/ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = withDefaults(defineProps<{
  chartType?: string;
  dataType?: string;
  fontSize?: number;
  chartWidth?: number;
  barWidth?: number;
  barColor?: string;
  highlight?: string;
}>(), {
  chartType: 'total',
  dataType: 'count',
  fontSize: 18,
  chartWidth: 700,
  barWidth: 50,
  barColor: '#5470c6',
  highlight: 'none'
});

defineEmits<{
  (e: 'update:chartType', value: string): void;
  (e: 'update:dataType', value: string): void;
  (e: 'update:fontSize', value: number): void;
  (e: 'update:chartWidth', value: number): void;
  (e: 'update:barWidth', value: number): void;
  (e: 'update:barColor', value: string): void;
  (e: 'update:highlight', value: string): void;
}>();

const barColors = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
  '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
];

interface HighlightOption {
  key: string;
  label: string;
  tooltip: string;
}

const highlightOptions = computed<HighlightOption[]>(() => [
  { key: 'none', label: t('patientChars.chartControl.highlightNone'), tooltip: t('patientChars.chartControl.highlightNoneTooltip') },
  { key: 'max', label: t('patientChars.chartControl.highlightMax'), tooltip: t('patientChars.chartControl.highlightMaxTooltip') },
  { key: 'min', label: t('patientChars.chartControl.highlightMin'), tooltip: t('patientChars.chartControl.highlightMinTooltip') },
  { key: 'both', label: t('patientChars.chartControl.highlightBoth'), tooltip: t('patientChars.chartControl.highlightBothTooltip') }
]);

// Normalize highlight options to { value, label, tooltip }
const highlightOptionsNormalized = computed<CycleOption[]>(() => {
  return highlightOptions.value.map(opt => ({
    value: opt.key,
    label: opt.label,
    tooltip: opt.tooltip
  }));
});
</script>
