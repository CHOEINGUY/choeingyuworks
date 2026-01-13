<template>
  <div class="flex items-center justify-center mb-7">
    <span 
      v-for="step in totalSteps" 
      :key="step"
      class="flex items-center"
    >
      <span 
        class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 border-transparent"
        :class="currentStep >= step ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-slate-100 text-slate-400'"
      >
        {{ step }}
      </span>
      <span 
        v-if="step < totalSteps" 
        class="w-8 md:w-12 h-px mx-2 md:mx-3 rounded-full transition-colors duration-300"
        :class="currentStep > step ? 'bg-slate-900' : 'bg-slate-200'"
      ></span>
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentStep: number;
  totalSteps?: number;
}

withDefaults(defineProps<Props>(), {
  totalSteps: 3
});
</script>

<style scoped>
/* All styles handled via Tailwind */
</style>
