<template>
  <section class="py-24 bg-slate-50">
    <div class="max-w-[1200px] mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-[2rem] font-extrabold text-slate-900 mb-2 tracking-tight keep-all">{{ $t('home.quickGuide.title') }}</h2>
        <p class="text-slate-500 text-lg md:text-[1.1rem] keep-all">{{ $t('home.quickGuide.subtitle') }}</p>
      </div>
      
      <div class="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-6">
        <div 
          v-for="(step, index) in steps" 
          :key="step.step"
          class="flex-1 flex flex-col items-center text-center relative group"
        >
          <!-- Step Circle -->
          <div class="w-14 h-14 bg-white border-2 border-slate-900 rounded-full flex items-center justify-center mb-6 z-10 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-slate-900 group-hover:text-white text-slate-900">
            <span class="text-xl font-extrabold">{{ step.step }}</span>
          </div>

          <!-- Connector Arrow (Desktop) -->
          <div v-if="Number(index) < steps.length - 1" class="hidden md:flex absolute top-7 left-1/2 w-full h-px items-center justify-center text-slate-200 z-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-auto -mr-3 bg-slate-50 px-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </div>

          <!-- Content -->
          <div class="max-w-[200px]">
            <h4 class="text-base font-bold text-slate-900 mb-2">{{ step.title }}</h4>
            <p class="text-sm text-slate-500 leading-relaxed keep-all">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  steps?: any[];
}

withDefaults(defineProps<Props>(), {
  steps: () => []
});
</script>

<style scoped>
/* All styles handled via Tailwind */
</style>
