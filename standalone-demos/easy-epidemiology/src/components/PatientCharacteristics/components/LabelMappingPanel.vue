<template>
  <div class="p-5 border-t border-slate-100 bg-slate-50/50 h-auto">
    <div class="flex items-center text-slate-700 font-semibold mb-4">
      <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
      {{ $t('patientChars.labelMapping.title') }}
    </div>
    
    <div v-if="categories.length > 0" class="flex flex-col gap-3">
      <div v-for="category in categories" :key="category" class="grid grid-cols-[auto_1fr] items-center gap-3">
        <span class="text-sm font-medium text-slate-600 break-keep">{{ category }} :</span>
        <input 
          type="text" 
          :value="modelValue[category] || ''" 
          @change="handleChange(category, ($event.target as HTMLInputElement).value)"
          :placeholder="$t('patientChars.labelMapping.placeholder')" 
          class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400 placeholder:italic placeholder:text-xs" 
        />
      </div>
    </div>
    <div v-else class="text-sm text-slate-400 italic py-2">
      {{ $t('patientChars.labelMapping.noCategories') }}
    </div>
  </div>
</template>

<script setup lang="ts">
// LabelMappingPanel.vue - 라벨 매핑 컴포넌트

const props = withDefaults(defineProps<{
  categories: string[];
  modelValue?: Record<string, string>;
}>(), {
  modelValue: () => ({})
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, string>): void;
  (e: 'change'): void;
}>();

const handleChange = (category: string, value: string) => {
  const newMappings = { ...props.modelValue, [category]: value };
  emit('update:modelValue', newMappings);
  emit('change');
};
</script>
