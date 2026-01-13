<template>
  <div v-if="!isIndividualExposureColumnVisible" class="mt-4 mb-2 mx-auto w-full max-w-4xl">
    <div class="flex flex-col gap-3">
      <!-- Header -->
      <div class="flex items-center gap-2 text-lg font-medium text-slate-800">
        <span class="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
        <span>{{ $t('epidemicCurve.exposure.title') }}</span>
      </div>

      <!-- Input Area -->
      <div class="flex gap-3">
        <div class="relative w-full max-w-[280px]">
          <div class="relative group">
            <div 
              class="flex items-center border border-slate-300 rounded-lg bg-white cursor-pointer hover:border-blue-400 transition-colors"
              @click="$emit('showExposureDateTimePicker', $event)"
              @mouseenter="showTooltip('exposureTime', $t('epidemicCurve.exposure.tooltip'))"
              @mouseleave="hideTooltip"
            >
              <input
                type="text"
                id="exposure-time"
                :value="formattedExposureDateTime"
                readonly
                class="flex-1 border-none py-2.5 px-3 text-sm outline-none bg-transparent cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed text-slate-700"
                :placeholder="$t('epidemicCurve.exposure.placeholder')"
              />
              <span class="px-3 text-slate-500 material-icons text-[20px]">event</span>
            </div>

            <!-- Tooltip -->
            <div v-if="activeTooltip === 'exposureTime'" class="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded shadow-lg text-xs whitespace-nowrap z-50">
              {{ tooltipText }}
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTooltip } from '../../composables/useTooltip';

defineProps<{
  formattedExposureDateTime: string;
  isIndividualExposureColumnVisible: boolean;
}>();

defineEmits<{
  (e: 'showExposureDateTimePicker', event: MouseEvent): void;
}>();

const { activeTooltip, tooltipText, showTooltip, hideTooltip } = useTooltip();
</script>
