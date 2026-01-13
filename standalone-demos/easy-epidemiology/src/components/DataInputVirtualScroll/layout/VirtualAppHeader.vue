<template>
  <header class="flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow z-[20] relative">
    <CommonHeader />
    
    <Transition name="fade">
      <button 
        v-if="errorCount > 0"
        class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50/80 border border-rose-200/60 cursor-pointer transition-all duration-200 hover:bg-rose-100 hover:shadow-md hover:scale-105 active:scale-95"
        @click="$emit('focusFirstError')"
        :title="$t('header.goToFirstError')"
      >
        <div class="flex items-center gap-1.5">
          <svg class="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span class="text-sm font-semibold text-rose-600">{{ $t('header.dataErrors', { count: errorCount }) }}</span>
        </div>
      </button>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import CommonHeader from '../../Common/CommonHeader.vue';

interface Props {
  errorCount?: number;
}

withDefaults(defineProps<Props>(), {
  errorCount: 0
});

defineEmits<{
  (e: 'focusFirstError'): void;
}>();
</script>

<style scoped>
/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>