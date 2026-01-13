<template>
  <div class="flex items-center gap-2">
    <span v-if="label" class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ label }}</span>
    <div class="relative group">
      <button 
        class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:border-blue-400 hover:text-blue-600 transition-colors"
        :class="minWidthClass"
        @click="cycleValue" 
        @mouseenter="handleMouseEnter" 
        @mouseleave="handleMouseLeave"
      > 
        {{ buttonText }} 
      </button>
      <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
        <div v-if="isTooltipVisible" class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded shadow-lg text-xs whitespace-nowrap z-50">
          {{ tooltipMessage }}
          <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

export interface CycleOption {
  value: string | number;
  label: string;
  tooltip?: string;
}

const props = withDefaults(defineProps<{
  label?: string;
  modelValue: string | number;
  options: (string | number | CycleOption)[];
  displayLabels?: string[];
  tooltipPrefix?: string;
  suffix?: string;
  minWidthClass?: string;
}>(), {
  label: '',
  displayLabels: () => [],
  tooltipPrefix: 'Change to',
  suffix: '',
  minWidthClass: 'min-w-[60px]'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const isTooltipVisible = ref(false);
const tooltipMessage = ref('');
const previewLabel = ref<string | null>(null);

// Helper to normalized option structure
const normalizedOptions = computed<CycleOption[]>(() => {
  return props.options.map((opt: any, index: number) => {
    if (typeof opt === 'object' && opt !== null && 'value' in opt) {
      return opt as CycleOption;
    }
    const label = props.displayLabels[index] || `${opt}${props.suffix}`;
    return { value: opt as string | number, label, tooltip: '' };
  });
});

const currentOptionIndex = computed(() => {
  const idx = normalizedOptions.value.findIndex(opt => opt.value === props.modelValue);
  return idx === -1 ? 0 : idx;
});

const buttonText = computed(() => {
  if (previewLabel.value) return previewLabel.value;
  return normalizedOptions.value[currentOptionIndex.value]?.label || '';
});

const cycleValue = () => {
  const nextIndex = (currentOptionIndex.value + 1) % normalizedOptions.value.length;
  const nextOption = normalizedOptions.value[nextIndex];
  emit('update:modelValue', nextOption.value);
  
  if (isTooltipVisible.value) {
    const nextNextIndex = (nextIndex + 1) % normalizedOptions.value.length;
    const nextNextOption = normalizedOptions.value[nextNextIndex];
    previewLabel.value = nextNextOption.label;
    
    if (nextNextOption.tooltip) {
      tooltipMessage.value = nextNextOption.tooltip;
    } else {
      tooltipMessage.value = `${props.tooltipPrefix} ${nextNextOption.label}`;
    }
  } else {
    previewLabel.value = null;
  }
};

const handleMouseEnter = () => {
  const nextIndex = (currentOptionIndex.value + 1) % normalizedOptions.value.length;
  const nextOption = normalizedOptions.value[nextIndex];
  
  previewLabel.value = nextOption.label;
  
  if (nextOption.tooltip) {
    tooltipMessage.value = nextOption.tooltip;
  } else {
    tooltipMessage.value = `${props.tooltipPrefix} ${nextOption.label}`;
  }
  
  isTooltipVisible.value = true;
};

const handleMouseLeave = () => {
  isTooltipVisible.value = false;
  previewLabel.value = null;
};

// Reset preview if modelValue changes externally
watch(() => props.modelValue, () => {
  if (!isTooltipVisible.value) {
    previewLabel.value = null;
  }
});
</script>
