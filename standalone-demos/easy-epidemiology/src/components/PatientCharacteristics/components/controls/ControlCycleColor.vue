<template>
  <div class="flex items-center gap-2 ml-auto">
    <span v-if="label" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ label }}</span>
    <div class="relative group">
      <button 
        class="w-8 h-8 rounded-full border-2 border-white ring-1 ring-slate-200 hover:scale-110 transition-transform shadow-sm" 
        :style="{ backgroundColor: modelValue }" 
        @click="cycleValue" 
        @mouseenter="showTooltip" 
        @mouseleave="hideTooltip"
      ></button>
      <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
        <div v-if="isTooltipVisible" class="absolute bottom-full mb-2 right-0 left-auto translate-x-0 bg-slate-800 text-white px-3 py-2 rounded shadow-lg text-xs whitespace-nowrap z-50 origin-bottom-right">
          {{ tooltipText }}
          <div class="absolute top-full right-3 border-4 border-transparent border-t-slate-800"></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{
  label?: string;
  modelValue: string;
  options: string[];
  tooltip?: string;
}>(), {
  label: '',
  tooltip: 'Change color'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const isTooltipVisible = ref(false);
const tooltipText = ref('');

const cycleValue = () => {
  const currentIndex = props.options.indexOf(props.modelValue);
  const nextIndex = (currentIndex + 1) % props.options.length;
  emit('update:modelValue', props.options[nextIndex]);
};

const showTooltip = () => {
  tooltipText.value = props.tooltip;
  isTooltipVisible.value = true;
};

const hideTooltip = () => {
  isTooltipVisible.value = false;
};
</script>
