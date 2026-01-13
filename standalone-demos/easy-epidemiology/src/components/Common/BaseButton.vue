<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <!-- Loading Spinner -->
    <span v-if="loading" class="animate-spin">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </span>
    
    <!-- Icon (Left) -->
    <span v-if="icon && iconPosition === 'left'" class="material-icons text-[18px]">{{ icon }}</span>
    
    <!-- Label -->
    <span v-if="$slots.default" class="truncate">
      <slot />
    </span>
    
    <!-- Icon (Right) -->
    <span v-if="icon && iconPosition === 'right'" class="material-icons text-[18px]">{{ icon }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'warning';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
type IconPosition = 'left' | 'right';

type RoundedSize = 'sm' | 'md' | 'lg' | 'full';

const props = withDefaults(defineProps<{
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconPosition?: IconPosition;
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  rounded?: RoundedSize;
}>(), {
  variant: 'secondary',
  size: 'md',
  iconPosition: 'left',
  disabled: false,
  loading: false,
  block: false,
  rounded: 'lg'
});

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-offset-2';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 shadow-sm hover:shadow-md',
  secondary: 'bg-white text-slate-600 border border-slate-200 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 focus:ring-blue-500 shadow-sm',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-500/30',
  ghost: 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300 focus:ring-slate-500',
  success: 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 focus:ring-emerald-500 shadow-sm',
  warning: 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 hover:border-orange-300 focus:ring-orange-500 shadow-sm'
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'text-xs px-2 py-1 gap-1',
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-base px-6 py-3 gap-2'
};

const roundedClasses: Record<RoundedSize, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full'
};

const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

const buttonClasses = computed(() => {
  const classes = [
    baseClasses,
    baseClasses,
    variantClasses[props.variant as ButtonVariant],
    sizeClasses[props.size as ButtonSize],
    roundedClasses[props.rounded as RoundedSize]
  ];
  
  if (props.disabled || props.loading) {
    classes.push(disabledClasses);
  }
  
  if (props.block) {
    classes.push('w-full');
  }
  
  return classes.join(' ');
});
</script>
