<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex justify-between items-center px-5 py-4 border-b border-slate-100">
      <span class="flex items-center text-slate-800 font-semibold text-base">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>{{ $t('clinicalSymptoms.frequencyTable.title') }}
      </span>
      <div class="relative">
        <button 
          @click="$emit('copy')" 
          class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span class="font-medium">{{ $t('clinicalSymptoms.frequencyTable.copy') }}</span>
        </button>
        <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-50" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-50">
          <div v-if="isTableCopied" class="absolute top-full left-1/2 -translate-x-1/2 mt-2 flex items-center justify-center p-2 bg-white rounded-full shadow-lg border border-slate-100 z-50">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#1a73e8"/>
              <polyline points="7,13 11,17 17,9" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </transition>
      </div>
    </div>
    <div class="overflow-auto flex-1 p-0">
      <table class="w-full text-sm text-center border-collapse table-fixed frequency-table">
        <colgroup>
          <col style="width: 40%;" />
          <col style="width: 30%;" />
          <col style="width: 30%;" />
        </colgroup>
        <thead class="bg-slate-50 sticky top-0 z-10">
          <tr>
            <th class="py-3 px-4 font-semibold text-slate-600 border-b border-slate-200">{{ $t('clinicalSymptoms.frequencyTable.symptom') }}</th>
            <th class="py-3 px-4 font-semibold text-slate-600 border-b border-slate-200">{{ $t('clinicalSymptoms.frequencyTable.count') }}</th>
            <th class="py-3 px-4 font-semibold text-slate-600 border-b border-slate-200">{{ $t('clinicalSymptoms.frequencyTable.percent') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in data" :key="idx" class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
            <td class="py-3 px-4 text-slate-700 text-left truncate" :title="item.name">{{ item.name }}</td>
            <td class="py-3 px-4 text-slate-600">{{ item.count }}</td>
            <td class="py-3 px-4 text-slate-600">{{ item.percent }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SymptomStat } from '../composables/useSymptomStats';

defineProps<{
  data?: SymptomStat[];
  isTableCopied?: boolean;
}>();

defineEmits<{
  (e: 'copy'): void;
}>();
</script>
