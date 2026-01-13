<template>
  <div class="flex flex-col items-center justify-start p-5 bg-white rounded-2xl shadow-premium border border-slate-100 overflow-x-auto min-h-[700px]">
    <div class="relative w-full flex justify-end gap-2 mb-2">
      <div class="relative">
        <button 
          @click="$emit('copy')" 
          class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span class="font-medium">{{ $t('clinicalSymptoms.chart.copy') }}</span>
        </button>
        <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-50" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-50">
          <div v-if="isChartCopied" class="absolute top-full left-1/2 -translate-x-1/2 mt-2 flex items-center justify-center p-2 bg-white rounded-full shadow-lg border border-slate-100 z-50">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#1a73e8"/>
              <polyline points="7,13 11,17 17,9" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </transition>
      </div>
      <button 
        @click="$emit('export')" 
        class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span class="font-medium">{{ $t('clinicalSymptoms.chart.save') }}</span>
      </button>
    </div>
    <div ref="chartContainerRef" class="w-full h-[600px] min-h-[600px] mx-auto" :style="{ width: chartWidth + 'px', minWidth: chartWidth + 'px' }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  chartWidth?: number;
  isChartCopied?: boolean;
}>();

defineEmits<{
  (e: 'copy'): void;
  (e: 'export'): void;
}>();

const chartContainerRef = ref<HTMLElement | null>(null);

// 부모 컴포넌트에서 차트 컨테이너에 접근할 수 있도록 expose
defineExpose({
  chartContainerRef
});
</script>
