<template>
  <div class="flex flex-col flex-1">
    <div class="flex items-center justify-between mx-5 mt-5 mb-2.5">
      <div class="flex items-center text-[1.1em] text-[#333] font-medium text-left">
        <span class="inline-block w-[0.3em] h-[0.3em] bg-current mr-[0.3em] align-middle rounded-full"></span>
        <span class="ml-[0.2em]">{{ $t('epidemicCurve.symptomTable.title') }}</span>
      </div>
      <div class="relative group">
        <BaseButton 
          @click="handleCopyTable" 
          variant="secondary"
          size="sm"
          icon="content_copy"
        >
          {{ $t('epidemicCurve.contextMenu.copy') || 'Copy' }}
        </BaseButton>
        <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
          <div v-if="isTableCopied" class="absolute left-1/2 top-[110%] -translate-x-1/2 z-10 pointer-events-none flex items-center justify-center w-8 h-8 rounded-full shadow-sm bg-white border border-slate-100">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#1a73e8"/>
              <polyline points="7,13 11,17 17,9" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </transition>
      </div>
    </div>

    <table id="symptom-onset-table" v-if="tableData.length > 0" class="w-[calc(100%-40px)] text-sm border-collapse mx-5 mb-5 border border-slate-200">
      <thead>
        <tr>
          <th class="bg-slate-50 font-semibold p-2 border border-slate-200 text-slate-700">{{ $t('epidemicCurve.symptomTable.time') }}</th>
          <th class="bg-slate-50 font-semibold p-2 border border-slate-200 text-slate-700">{{ $t('epidemicCurve.symptomTable.count') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableData" :key="'onset-' + index" class="hover:bg-slate-50/50">
          <td class="p-2 border border-slate-200 text-center text-slate-600">{{ item.intervalLabel }}</td>
          <td class="p-2 border border-slate-200 text-center text-slate-600">{{ item.count }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else class="p-5 text-center text-[#666]">
      <DataGuideMessage
        icon="schedule"
        :title="$t('epidemicCurve.symptomTable.guide.title')"
        :description="$t('epidemicCurve.symptomTable.guide.desc')"
        :steps="[
          { number: '1', text: $t('epidemicCurve.symptomTable.guide.step1') },
          { number: '2', text: $t('epidemicCurve.symptomTable.guide.step2') },
          { number: '3', text: $t('epidemicCurve.symptomTable.guide.step3') }
        ]"
      />
    </div>

    <div class="flex items-center text-[1.1em] text-[#333] font-medium text-left mx-5 mt-5">
      <span class="inline-block w-[0.3em] h-[0.3em] bg-current mr-[0.3em] align-middle rounded-full"></span>
      <span class="ml-[0.2em]">{{ $t('epidemicCurve.symptomTable.summary.title') }}</span>
    </div>

    <div class="mx-5 mb-5 mt-5 p-4 bg-[#f8f9fa] rounded-lg border border-slate-100">
      <div class="flex items-center gap-2.5 mb-2 last:mb-0">
        <span class="text-sm text-[#666] min-w-[100px]">{{ $t('epidemicCurve.symptomTable.summary.first') }}</span>
        <span class="text-sm text-[#333] font-medium">{{ firstOnsetTime }}</span>
      </div>
      <div class="flex items-center gap-2.5 mb-2 last:mb-0">
        <span class="text-sm text-[#666] min-w-[100px]">{{ $t('epidemicCurve.symptomTable.summary.last') }}</span>
        <span class="text-sm text-[#333] font-medium">{{ lastOnsetTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataGuideMessage from '../../../DataGuideMessage.vue';
import { useClipboardOperations } from '../../composables/useClipboardOperations';
import BaseButton from '../../../Common/BaseButton.vue';

// 안내 메시지 steps
// Guide steps removed as they are now passed directly with $t

interface TableItem {
  intervalLabel: string;
  count: number | string;
}

withDefaults(defineProps<{
  tableData: TableItem[];
  firstOnsetTime?: string;
  lastOnsetTime?: string;
}>(), {
  firstOnsetTime: 'N/A',
  lastOnsetTime: 'N/A'
});

const { isSymptomTableCopied, copySymptomTableToClipboard } = useClipboardOperations();
const isTableCopied = isSymptomTableCopied;

const handleCopyTable = () => {
  copySymptomTableToClipboard();
};
</script>
