<template>
  <div class="flex justify-end gap-2 mb-2 w-full">
    <!-- Save Report Button -->
    <div class="relative">
      <BaseButton
        :variant="isSaved ? 'success' : 'secondary'"
        icon="save_alt"
        @click="$emit('saveReport')"
        @mouseenter="showTooltip('saveReport')"
        @mouseleave="hideTooltip"
        class="min-w-[120px]"
      >
        {{ isSaved ? $t('common.chart.saved') : $t('common.chart.saveReport') }}
      </BaseButton>

      <!-- Control Tooltip (Below to avoid clipping) -->
      <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-[-4px]" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-[-4px]">
        <div 
          v-if="activeTooltip === 'saveReport'" 
          class="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded shadow-lg text-xs whitespace-nowrap z-[100]"
        >
          {{ $t('common.chart.tooltip.saveReport') }}
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800"></div>
        </div>
      </transition>

      <!-- Feedback Tooltip (Below - Checkmark) -->
      <transition enter-active-class="transition ease-out duration-300 transform" enter-from-class="opacity-0 translate-y-2 scale-90" enter-to-class="opacity-100 translate-y-0 scale-100" leave-active-class="transition ease-in duration-200 transform" leave-from-class="opacity-100 translate-y-0 scale-100" leave-to-class="opacity-0 translate-y-2 scale-90">
        <div v-if="showSavedFeedback" class="absolute left-1/2 top-[115%] -translate-x-1/2 z-[100] pointer-events-none flex items-center justify-center w-8 h-8 rounded-full shadow-lg bg-white border border-slate-100">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#1a73e8"/>
            <polyline points="7,13 11,17 17,9" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </transition>
    </div>

    <!-- Copy Chart Button -->
    <div class="relative">
      <BaseButton
        variant="secondary"
        icon="content_copy"
        @click="$emit('copyChart')"
      >
        {{ $t('common.chart.copy') }}
      </BaseButton>

      <!-- Feedback Tooltip (Below - Checkmark) -->
      <transition enter-active-class="transition ease-out duration-300 transform" enter-from-class="opacity-0 translate-y-2 scale-90" enter-to-class="opacity-100 translate-y-0 scale-100" leave-active-class="transition ease-in duration-200 transform" leave-from-class="opacity-100 translate-y-0 scale-100" leave-to-class="opacity-0 translate-y-2 scale-90">
        <div v-if="isCopied" class="absolute left-1/2 top-[115%] -translate-x-1/2 z-[100] pointer-events-none flex items-center justify-center w-8 h-8 rounded-full shadow-lg bg-white border border-slate-100">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="#1a73e8"/>
            <polyline points="7,13 11,17 17,9" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </transition>
    </div>

    <!-- Export Chart Button -->
    <div class="relative">
      <BaseButton
        variant="secondary"
        icon="download"
        @click="$emit('exportChart')"
      >
        {{ $t('common.chart.save') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from './BaseButton.vue';

const props = withDefaults(defineProps<{
  isSaved?: boolean;
  showSavedFeedback?: boolean;
  isCopied?: boolean;
}>(), {
  isSaved: false,
  showSavedFeedback: false,
  isCopied: false
});
// ... (나머지 스크립트는 동일)

defineEmits<{
  (e: 'saveReport'): void;
  (e: 'copyChart'): void;
  (e: 'exportChart'): void;
}>();

const activeTooltip = ref<string | null>(null);

const showTooltip = (id: string) => {
  activeTooltip.value = id;
};

const hideTooltip = () => {
  activeTooltip.value = null;
};
</script>
