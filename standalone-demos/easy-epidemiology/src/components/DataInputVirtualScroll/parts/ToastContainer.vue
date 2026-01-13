<template>
  <!-- 일반 toast는 하단 중앙에 -->
  <div class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] flex flex-col gap-4 items-center pointer-events-none w-full max-w-[600px] px-4">
    <TransitionGroup
      enter-active-class="transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0 translate-y-full scale-90 blur-sm"
      leave-to-class="opacity-0 translate-y-full scale-90 blur-sm"
      move-class="transition-all duration-500 ease-in-out"
    >
      <div 
        v-for="toast in toasts.filter(t => t.type !== 'confirm')" 
        :key="toast.id" 
        class="pointer-events-auto w-full md:min-w-[420px] md:w-auto bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] p-4 md:p-5 flex items-center gap-4 md:gap-5 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group/toast cursor-pointer hover:scale-[1.02] transition-transform"
        @click="removeToast(toast.id)"
      >
        <!-- Icon Area -->
        <div class="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl shadow-lg ring-1 ring-white/10 relative overflow-hidden shrink-0" :class="{
          'bg-gradient-to-br from-emerald-500 to-emerald-600': toast.type === 'success',
          'bg-gradient-to-br from-red-500 to-red-600': toast.type === 'error',
          'bg-gradient-to-br from-blue-500 to-blue-600': toast.type === 'info',
          'bg-gradient-to-br from-amber-500 to-amber-600': toast.type === 'warning'
        }">
          <span class="material-icons text-xl md:text-2xl text-white animate-bounce relative z-10">
            {{ getIcon(toast.type) }}
          </span>
          <div class="absolute inset-0 bg-white/20 opacity-0 group-hover/toast:opacity-30 transition-opacity"></div>
        </div>

        <!-- Content Area -->
        <div class="flex flex-col flex-1 gap-0.5 md:gap-1 min-w-0">
          <span class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-60 text-white truncate">
            {{ getLabel(toast.type) }}
          </span>
          <span class="text-sm md:text-[15px] font-bold text-white tracking-tight leading-snug break-words">
            {{ toast.message }}
          </span>
        </div>

        <!-- Close Button -->
        <button class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/5 text-white/40 rounded-full hover:bg-white/20 hover:text-white transition-all shrink-0">
          <span class="material-icons text-lg md:text-[20px]">close</span>
        </button>
      </div>
    </TransitionGroup>
  </div>

  <!-- 확인 toast만 가운데에 (Modal Style) -->
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="toasts.some(t => t.type === 'confirm')" class="fixed inset-0 z-[10001] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div class="w-full max-w-md">
        <div 
          v-for="toast in toasts.filter(t => t.type === 'confirm')" 
          :key="toast.id" 
          class="bg-white rounded-3xl shadow-2xl overflow-hidden animate-springUp ring-1 ring-slate-900/5"
        >
          <!-- Header -->
          <div class="p-6 pb-0 flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <span class="material-icons text-2xl">help_outline</span>
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-800">{{ $t('dataInput.toast.confirmTitle') }}</h3>
              <p class="text-xs font-medium text-slate-400 mt-0.5">{{ $t('dataInput.toast.confirmContext') }}</p>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 md:p-8">
            <p class="text-slate-600 font-medium leading-relaxed text-[15px]">
              {{ toast.message }}
            </p>
          </div>

          <!-- Footer -->
          <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button 
              @click="toast.onCancel" 
              class="px-6 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-white hover:text-slate-700 hover:shadow-sm border border-transparent hover:border-slate-200 transition-all active:scale-95"
            >
              {{ $t('common.cancel') }}
            </button>
            <button 
              @click="toast.onConfirm" 
              class="px-8 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
            >
              {{ $t('common.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useToast } from '../logic/toast';
import type { ToastType } from '../logic/toast';
import { useI18n } from 'vue-i18n';

const { toasts, removeToast } = useToast();
const { t } = useI18n();

function getIcon(type: ToastType) {
  switch (type) {
    case 'success': return 'verified';
    case 'error': return 'error_outline';
    case 'warning': return 'warning_amber';
    default: return 'info';
  }
}

function getLabel(type: ToastType) {
  switch (type) {
    case 'success': return t('dataInput.toast.success');
    case 'error': return t('dataInput.toast.error');
    case 'warning': return t('dataInput.toast.warning');
    default: return t('dataInput.toast.info');
  }
}
</script>

<style scoped>
/* 애니메이션 유틸리티 */
@keyframes springUp {
  0% { transform: scale(0.9) translateY(20px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

.animate-springUp {
  animation: springUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>