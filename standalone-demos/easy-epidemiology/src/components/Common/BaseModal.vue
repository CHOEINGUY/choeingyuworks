<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @keydown.esc="handleClose"
      >
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          @click="closeOnBackdrop && handleClose()"
        />
        
        <!-- Modal Content -->
        <Transition
          enter-active-class="transition duration-300 ease-out transform"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in transform"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div 
            v-if="modelValue"
            :class="modalClasses"
            role="dialog"
            aria-modal="true"
            @click.stop
          >
            <!-- Header -->
            <div v-if="$slots.header || title" class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
              <slot name="header">
                <div class="flex items-center gap-3">
                  <div v-if="icon" class="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-md">
                    <span class="material-icons text-xl">{{ icon }}</span>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-slate-900 tracking-tight">{{ title }}</h3>
                    <p v-if="subtitle" class="text-sm text-slate-500 mt-0.5">{{ subtitle }}</p>
                  </div>
                </div>
              </slot>
              
              <button 
                v-if="showCloseButton"
                @click="handleClose"
                class="w-8 h-8 flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all duration-200 rounded-lg"
              >
                <span class="material-icons text-xl">close</span>
              </button>
            </div>
            
            <!-- Body -->
            <div :class="bodyClasses">
              <slot />
            </div>
            
            <!-- Footer -->
            <div v-if="$slots.footer" class="px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 z-10">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const props = withDefaults(defineProps<{
  modelValue: boolean;
  title?: string;
  subtitle?: string;
  icon?: string;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  scrollable?: boolean;
}>(), {
  size: 'md',
  showCloseButton: true,
  closeOnBackdrop: true,
  closeOnEsc: true,
  scrollable: true
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90vw]'
};

const modalClasses = computed(() => {
  return [
    'relative w-full bg-white shadow-2xl overflow-hidden flex flex-col',
    sizeClasses[props.size as ModalSize],
    props.scrollable ? 'max-h-[85vh]' : '',
    'rounded-2xl'
  ].join(' ');
});

const bodyClasses = computed(() => {
  return [
    'px-6 py-6',
    props.scrollable ? 'overflow-y-auto custom-scrollbar' : ''
  ].join(' ');
});

const handleClose = () => {
  emit('update:modelValue', false);
  emit('close');
};

// Handle ESC key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.closeOnEsc && props.modelValue) {
    handleClose();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>
