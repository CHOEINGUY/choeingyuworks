<template>
  <EpidemicChartControls
    :intervalLabel="$t('epidemicCurve.controls.intervalLabel')"
    intervalId="symptom-interval"
    :intervalTooltipText="$t('epidemicCurve.controls.intervalTooltip')"
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
    <!-- Append Slot: Confirmed Case Toggle -->
    <template #append>
      <div v-if="showConfirmedCaseToggle" class="flex items-center gap-2">
        <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ $t('epidemicCurve.controls.confirmedLine') }}</label>
        <div class="relative group">
          <BaseButton 
            @click="$emit('toggleConfirmedCaseLine')" 
            :variant="showConfirmedCaseLine ? 'primary' : 'secondary'"
            size="sm"
            @mouseenter="showTooltip('confirmedCaseLine', $t('epidemicCurve.controls.confirmedTooltip'))" 
            @mouseleave="hideTooltip"
          >
            {{ showConfirmedCaseLine ? $t('epidemicCurve.controls.show') : $t('epidemicCurve.controls.hide') }}
          </BaseButton>
          <!-- Tooltip -->
          <div v-if="activeTooltip === 'confirmedCaseLine'" class="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded shadow-lg text-xs whitespace-nowrap z-50">
            {{ tooltipText }}
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800"></div>
          </div>
        </div>
      </div>
    </template>
  </EpidemicChartControls>
</template>

<script setup lang="ts">
import EpidemicChartControls from '../EpidemicChartControls.vue';
import BaseButton from '../../../Common/BaseButton.vue';
import { useTooltip } from '../../composables/useTooltip';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

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
  showConfirmedCaseToggle?: boolean;
  showConfirmedCaseLine?: boolean;
}>(), {
  fontSizes: () => [],
  fontSizeLabels: () => [],
  chartWidths: () => [],
  barColors: () => [],
  showConfirmedCaseToggle: false,
  showConfirmedCaseLine: true
});

defineEmits<{
  (e: 'update:selectedInterval', value: number): void;
  (e: 'update:chartFontSize', value: number): void;
  (e: 'update:chartWidth', value: number): void;
  (e: 'update:barColor', value: string): void;
  (e: 'update:displayMode', value: string): void;
  (e: 'toggleConfirmedCaseLine'): void;
  (e: 'resetSettings'): void;
}>();

const { activeTooltip, tooltipText, showTooltip, hideTooltip } = useTooltip();

const displayModeOptions = computed(() => [
  { value: 'time', label: t('epidemicCurve.displayMode.hour'), tooltip: t('epidemicCurve.displayMode.hourTooltip') },
  { value: 'datetime', label: t('epidemicCurve.displayMode.datetime'), tooltip: t('epidemicCurve.displayMode.datetimeTooltip') }
]);

const intervalOptions = computed(() => [
  { value: 3, label: `3${t('dataInput.datetime.hour')}` },
  { value: 6, label: `6${t('dataInput.datetime.hour')}` },
  { value: 12, label: `12${t('dataInput.datetime.hour')}` },
  { value: 24, label: `24${t('dataInput.datetime.hour')}` },
  { value: 48, label: `48${t('dataInput.datetime.hour')}` }
]);
</script>
