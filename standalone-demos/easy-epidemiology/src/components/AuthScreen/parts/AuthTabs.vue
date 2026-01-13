<template>
  <div class="mb-8 animate-fadeUp [animation-delay:0.3s] [animation-fill-mode:backwards]">
    <div class="relative flex bg-slate-100/80 p-1.5 rounded-2xl w-full max-w-[400px] mx-auto border border-slate-200/50 backdrop-blur-sm">
      <button 
        class="flex-1 relative z-10 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300" 
        :class="!showRegister ? 'text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        @click="$emit('update:showRegister', false)"
      >
        <span class="material-icons text-lg">login</span>
        {{ $t('auth.btnLogin') }}
      </button>
      <button 
        class="flex-1 relative z-10 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300" 
        :class="showRegister ? 'text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        @click="$emit('update:showRegister', true)"
      >
        <span class="material-icons text-lg">person_add</span>
        {{ $t('auth.btnRegister') }}
      </button>
      
      <!-- Active Indicator -->
      <div 
        class="absolute top-1.5 left-1.5 w-[calc(50%-6px)] h-[calc(100%-12px)] bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0"
        :class="{ 'translate-x-full': showRegister }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showRegister: boolean;
}

defineProps<Props>();

defineEmits<{
  (e: 'update:showRegister', value: boolean): void;
}>();
</script>

<style scoped>
/* All styles handled via Tailwind */
</style>
