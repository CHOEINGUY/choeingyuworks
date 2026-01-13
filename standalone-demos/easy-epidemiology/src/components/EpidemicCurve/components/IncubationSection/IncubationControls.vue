<template>
  <EpidemicChartControls
    :intervalLabel="$t('epidemicCurve.incubationControls.intervalLabel')"
    intervalId="incubation-interval"
    :intervalTooltipText="$t('epidemicCurve.incubationControls.intervalTooltip')"
    :selectedInterval="selectedInterval"
    :intervalOptions="intervalOptions"
    @update:selectedInterval="$emit('update:selectedInterval', $event)"
    
    :chartFontSize="chartFontSize"
    @update:chartFontSize="$emit('update:chartFontSize', $event)"
    
    :chartWidth="chartWidth"
    @update:chartWidth="$emit('update:chartWidth', $event)"
    
    :barColor="barColor"
    @update:barColor="$emit('update:barColor', $event)"
    
    :displayMode="displayMode"
    @update:displayMode="$emit('update:displayMode', $event)"
    
    :displayModeOptions="displayModeOptions"
    
    :fontSizes="fontSizes"
    :fontSizeLabels="fontSizeLabels"
    :chartWidths="chartWidths"
    :barColors="barColors"
    
    @resetSettings="$emit('resetSettings')"
  >
  </EpidemicChartControls>
</template>

<script setup lang="ts">
import EpidemicChartControls from '../EpidemicChartControls.vue';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { useTooltip } from '../../composables/useTooltip';

const { t } = useI18n();

withDefaults(defineProps<{
  selectedInterval: number;
  chartFontSize: number;
  chartWidth: number;
  barColor: string;
  displayMode: string;
  fontSizes?: number[];
  fontSizeLabels?: string[];
  chartWidths?: number[];
  barColors?: string[];
  formattedExposureDateTime?: string;
  isIndividualExposureColumnVisible?: boolean;
}>(), {
  fontSizes: () => [],
  fontSizeLabels: () => [],
  chartWidths: () => [],
  barColors: () => [],
  formattedExposureDateTime: '',
  isIndividualExposureColumnVisible: false
});

defineEmits<{
  (e: 'update:selectedInterval', value: number): void;
  (e: 'update:chartFontSize', value: number): void;
  (e: 'update:chartWidth', value: number): void;
  (e: 'update:barColor', value: string): void;
  (e: 'update:displayMode', value: string): void;
  (e: 'resetSettings'): void;
  (e: 'showExposureDateTimePicker', event: MouseEvent): void;
}>();

const { activeTooltip, tooltipText, showTooltip, hideTooltip } = useTooltip();

const intervalOptions = computed(() => [
  { value: 3, label: `3${t('dataInput.datetime.hour')}` },
  { value: 6, label: `6${t('dataInput.datetime.hour')}` },
  { value: 12, label: `12${t('dataInput.datetime.hour')}` },
  { value: 24, label: `24${t('dataInput.datetime.hour')}` },
  { value: 48, label: `48${t('dataInput.datetime.hour')}` }
]);

const displayModeOptions = computed(() => [
  { value: 'hour', label: t('epidemicCurve.displayMode.incubationHour'), tooltip: t('epidemicCurve.displayMode.incubationHourTooltip') },
  { value: 'hhmm', label: t('epidemicCurve.displayMode.incubationHHMM'), tooltip: t('epidemicCurve.displayMode.incubationHHMMTooltip') }
]);
</script>
