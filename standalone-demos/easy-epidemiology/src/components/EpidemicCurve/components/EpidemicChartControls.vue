<template>
  <div class="flex flex-wrap items-center gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200 shadow-sm backdrop-blur-sm w-full">
    
    <!-- Custom Prepend Slot (e.g. Exposure Time) -->
    <slot name="prepend"></slot>

    <!-- Group 1: Time Settings -->
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2">
        <label :for="intervalId" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ intervalLabel }}</label>
        <div class="relative group">
          <select
            :id="intervalId"
            :value="selectedInterval"
            @change="$emit('update:selectedInterval', Number(($event.target as HTMLSelectElement).value))"
            class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:border-blue-400 hover:text-blue-600 transition-colors outline-none focus:ring-2 focus:ring-blue-100"
            @mouseenter="showTooltip('interval', intervalTooltipText)"
            @mouseleave="hideTooltip"
          >
            <option v-for="option in intervalOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <!-- Tooltip -->
          <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-[-4px]" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-[-4px]">
            <div v-if="activeTooltip === 'interval'" class="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded shadow-lg text-xs whitespace-nowrap z-50">
              {{ intervalTooltipText }}
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800"></div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="w-px h-6 bg-slate-300 mx-1"></div>

    <!-- Group 2: Visual Adjustments -->
    <div class="flex items-center gap-2">
      <!-- Font Size -->
      <ControlCycleText
        :label="$t('epidemicCurve.controls.fontSize')"
        :modelValue="chartFontSize"
        @update:modelValue="$emit('update:chartFontSize', $event)"
        :options="fontSizes"
        :displayLabels="fontSizeLabels"
        :tooltipPrefix="$t('epidemicCurve.controls.fontSizeTooltip')"
        suffix=""
        minWidthClass="min-w-[60px]"
      />

      <!-- Chart Width -->
      <ControlCycleText
        :label="$t('epidemicCurve.controls.chartWidth')"
        :modelValue="chartWidth"
        @update:modelValue="$emit('update:chartWidth', $event)"
        :options="chartWidths"
        :tooltipPrefix="$t('epidemicCurve.controls.chartWidthTooltip')"
        suffix="px"
        tooltipSuffix=""
        minWidthClass="min-w-[70px]"
      />
    </div>

    <!-- Divider -->
    <div class="w-px h-6 bg-slate-300 mx-1"></div>

    <!-- Group 3: Appearance -->
    <div class="flex items-center gap-2">
      <!-- Display Mode -->
      <ControlGroup
        :label="$t('epidemicCurve.controls.chartDisplay')"
        :modelValue="displayMode"
        @update:modelValue="$emit('update:displayMode', $event as string)"
        :options="displayModeOptions"
      />

      <!-- Bar Color -->
      <ControlCycleColor
        :label="$t('epidemicCurve.controls.color')"
        :modelValue="barColor"
        @update:modelValue="$emit('update:barColor', $event)"
        :options="barColors"
        :tooltip="$t('epidemicCurve.controls.colorTooltip')"
      />
      
      <!-- Custom Append Slot (e.g. Confirmed Lines toggle) -->
      <slot name="append"></slot>
    </div>

    <!-- Spacer -->
    <div class="ml-auto"></div>

    <!-- Reset Button -->
    <div class="relative group">
      <BaseButton 
        @click="$emit('resetSettings')" 
        variant="secondary"
        size="sm"
        class="text-slate-500 hover:text-slate-800 hover:border-slate-400"
        @mouseenter="showTooltip('reset', $t('common.chart.tooltip.reset'))" 
        @mouseleave="hideTooltip"
      >
        {{ $t('common.chart.reset') }}
      </BaseButton>
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-[-4px]" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-[-4px]">
        <div v-if="activeTooltip === 'reset'" class="absolute top-full mt-2 right-0 bg-slate-800 text-white px-3 py-2 rounded shadow-lg text-xs whitespace-nowrap z-50">
          {{ $t('common.chart.tooltip.reset') }}
          <div class="absolute bottom-full right-3 border-4 border-transparent border-b-slate-800"></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTooltip } from '../composables/useTooltip';
import { useI18n } from 'vue-i18n';
import BaseButton from '../../Common/BaseButton.vue';
import ControlCycleText from './controls/ControlCycleText.vue';
import ControlCycleColor from './controls/ControlCycleColor.vue';
import ControlGroup from './controls/ControlGroup.vue';

interface Option {
  value: string | number;
  label: string;
  tooltip?: string;
}

interface IntervalOption {
  value: number;
  label: string;
}

const props = defineProps({
  intervalLabel: { type: String, default: '시간 간격 :' },
  intervalId: { type: String, default: 'interval-select' },
  intervalTooltipText: { type: String, default: '시간 간격을 변경합니다' },
  selectedInterval: { type: Number, required: true },
  intervalOptions: { 
    type: Array as () => IntervalOption[], 
    default: () => [
      { value: 3, label: '3시간' }, { value: 6, label: '6시간' }, 
      { value: 12, label: '12시간' }, { value: 24, label: '24시간' }, { value: 48, label: '48시간' }
    ]
  },
  
  // Refactored Props
  chartFontSize: { type: Number, default: 16 },
  chartWidth: { type: Number, default: 700 },
  barColor: { type: String, default: '#5470c6' },
  displayMode: { type: String, default: 'time' },
  
  // Options Arrays
  fontSizes: { type: Array as () => number[], default: () => [] },
  fontSizeLabels: { type: Array as () => string[], default: () => [] },
  chartWidths: { type: Array as () => number[], default: () => [] },
  barColors: { type: Array as () => string[], default: () => [] },
  displayModeOptions: { type: Array as () => Option[], default: () => [] }
});

defineEmits<{
  (e: 'update:selectedInterval', value: number): void;
  (e: 'update:chartFontSize', value: number): void;
  (e: 'update:chartWidth', value: number): void;
  (e: 'update:barColor', value: string): void;
  (e: 'update:displayMode', value: string): void;
  (e: 'resetSettings'): void;
}>();

const { t } = useI18n();
const { activeTooltip, showTooltip, hideTooltip } = useTooltip();
</script>
