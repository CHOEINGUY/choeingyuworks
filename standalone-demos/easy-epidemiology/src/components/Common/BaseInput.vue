<template>
  <div class="flex flex-col gap-1.5 w-full">
    <!-- Label -->
    <label v-if="label" :for="id" class="text-sm font-medium text-slate-700 flex items-center justify-between">
      <span>{{ label }} <span v-if="required" class="text-red-500">*</span></span>
      <span v-if="maxLength" class="text-xs text-slate-400">{{ valueLength }}/{{ maxLength }}</span>
    </label>
    
    <div class="relative group">
      <!-- Icon (Left) -->
      <div v-if="icon" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
        <span class="material-icons text-[20px]">{{ icon }}</span>
      </div>
      
      <!-- Input -->
      <input
        :id="id"
        ref="inputRef"
        :value="modelValue"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxLength"
        :class="inputClasses"
        @input="handleInput"
        @focus="$emit('focus', $event)"
        @blur="handleBlur"
        @keydown="$emit('keydown', $event)"
      />
      
      <!-- Actions (Right) -->
      <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <!-- Clear Button -->
        <button 
          v-if="clearable && modelValue && !disabled && !readonly" 
          @click="handleClear"
          type="button"
          class="text-slate-300 hover:text-slate-500 transition-colors p-1 rounded-full hover:bg-slate-100"
          tabindex="-1"
        >
          <span class="material-icons text-[18px] block">cancel</span>
        </button>

        <!-- Password Toggle -->
        <button
          v-if="type === 'password' && !disabled"
          @click="togglePasswordVisibility"
          type="button"
          class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
          tabindex="-1"
          :title="isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'"
        >
           <span class="material-icons text-[20px] block">{{ isPasswordVisible ? 'visibility_off' : 'visibility' }}</span>
        </button>
        
        <!-- Error Icon -->
        <span v-if="error" class="text-red-500 pointer-events-none p-1">
          <span class="material-icons text-[20px] block">error</span>
        </span>
      </div>
    </div>
    
    <!-- Helper Text / Error Message (Reserved space to prevent layout shift) -->
    <div class="h-5">
      <p v-if="error" class="text-xs text-red-500 mt-0.5 flex items-center gap-1 animate-in slide-in-from-top-1">
        {{ error }}
      </p>
      <p v-else-if="helperText" class="text-xs text-slate-500 mt-0.5">
        {{ helperText }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(defineProps<{
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  type?: string;
  id?: string;
  icon?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  maxLength?: number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}>(), {
  modelValue: '',
  type: 'text',
  id: () => `input-${Math.random().toString(36).substr(2, 9)}`,
  required: false,
  disabled: false,
  readonly: false,
  clearable: false,
  rounded: 'xl'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: string | number): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'clear'): void;
  (e: 'keydown', event: KeyboardEvent): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const isPasswordVisible = ref(false);

const valueLength = computed(() => {
  return String(props.modelValue || '').length;
});

const inputType = computed(() => {
  if (props.type === 'password' && isPasswordVisible.value) {
    return 'text';
  }
  return props.type;
});

const roundedClasses: Record<string, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full'
};

const inputClasses = computed(() => {
  const classes = [
    'w-full py-3.5 bg-white border outline-none transition-all duration-200 placeholder-slate-300 text-[15px]',
    roundedClasses[props.rounded],
    props.icon ? 'pl-10' : 'pl-4',
    // Right padding calculation based on icons
    (props.clearable || props.type === 'password' || props.error) ? 'pr-12' : 'pr-4',
    props.disabled 
      ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' 
      : props.error
        ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
        : 'border-slate-200 text-slate-800 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
  ];
  
  return classes.join(' ');
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
  emit('change', props.modelValue);
};

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

defineExpose({
  focus: () => inputRef.value?.focus()
});
</script>
