<template>
  <div class="flex items-center gap-2">
    <span v-if="label" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ label }}</span>
    
    <div v-for="option in options" :key="option.value" class="relative group">
      <button 
        @click="$emit('update:modelValue', option.value)" 
        class="px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 shadow-sm"
        :class="[
          modelValue === option.value
            ? 'bg-blue-600 text-white border-blue-600 ring-1 ring-blue-500' 
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300'
        ]"
        @mouseenter="activeTooltip = option.value" 
        @mouseleave="activeTooltip = null"
      > 
        {{ option.label }} 
      </button>
      <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
        <div v-if="activeTooltip === option.value && option.tooltip" class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded shadow-lg text-xs whitespace-nowrap z-50">
          {{ option.tooltip }}
          <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export interface BoxOption {
  value: string | number;
  label: string;
  tooltip?: string;
}

defineProps<{
  label?: string;
  modelValue: string | number;
  options: BoxOption[];
}>();

defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const activeTooltip = ref<string | number | null>(null);
</script>
