<template>
  <div class="flex flex-wrap gap-2 items-center">
    <button 
      v-for="(header, index) in headers" 
      :key="index" 
      @click="$emit('select', index)" 
      class="px-6 py-2.5 rounded-full text-base font-medium transition-all duration-200 border shadow-sm select-none"
      :class="[
        selectedIndex === index 
          ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-100' 
          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300'
      ]"
    >
      {{ header === "" ? $t('common.none') : header }}
    </button>
  </div>
</template>

<script setup lang="ts">
// VariableSelector.vue - 변수 선택 버튼 컴포넌트

defineProps<{
  headers: string[];
  selectedIndex?: number | null;
}>();

defineEmits<{
  (e: 'select', index: number): void;
}>();
</script>
