<template>
  <div class="flex flex-col flex-1">
    <div class="flex items-center justify-between mx-5 mt-5 mb-2.5">
      <div class="flex items-center text-[1.1em] text-[#333] font-medium text-left">
        <span class="inline-block w-[0.3em] h-[0.3em] bg-current mr-[0.3em] align-middle rounded-full"></span>
        <span class="ml-[0.2em]">{{ $t('epidemicCurve.incubationTable.title') }}</span>
      </div>
      <div class="relative group">
        <BaseButton 
          @click="handleCopyTable" 
          variant="secondary"
          size="sm"
          icon="content_copy"
        >
          {{ $t('common.copy') }}
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

    <table id="incubation-table" v-if="tableData.length > 0" class="w-[calc(100%-40px)] text-sm border-collapse mx-5 mb-5 border border-slate-200">
      <thead>
        <tr>
          <th class="bg-slate-50 font-semibold p-2 border border-slate-200 text-slate-700">{{ $t('epidemicCurve.incubationTable.interval') }}</th>
          <th class="bg-slate-50 font-semibold p-2 border border-slate-200 text-slate-700">{{ $t('epidemicCurve.incubationTable.count') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableData" :key="'incubation-' + index" class="hover:bg-slate-50/50">
          <td class="p-2 border border-slate-200 text-center text-slate-600">{{ item.intervalLabel }}</td>
          <td class="p-2 border border-slate-200 text-center text-slate-600">{{ item.count }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else class="p-5 text-center text-[#666]">
      <DataGuideMessage
        v-if="!hasExposureDateTime && !isIndividualExposureColumnVisible"
        icon="event"
        :title="$t('epidemicCurve.incubationTable.guide.noExposureTitle')"
        :description="$t('epidemicCurve.incubationTable.guide.noExposureDesc')"
        :steps="exposureGuideSteps"
      />
      <DataGuideMessage
        v-else
        icon="timer"
        :title="$t('epidemicCurve.incubationTable.guide.title')"
        :description="$t('epidemicCurve.incubationTable.guide.desc')"
        :steps="[
          { number: '1', text: $t('epidemicCurve.incubationTable.guide.step1') },
          { number: '2', text: $t('epidemicCurve.incubationTable.guide.step2') },
          { number: '3', text: $t('epidemicCurve.incubationTable.guide.step3') }
        ]"
      />
    </div>

    <div class="flex items-center text-[1.1em] text-[#333] font-medium text-left mx-5 mt-5">
      <span class="inline-block w-[0.3em] h-[0.3em] bg-current mr-[0.3em] align-middle rounded-full"></span>
      <span class="ml-[0.2em]">{{ $t('epidemicCurve.incubationTable.summary.title') }}</span>
    </div>

    <div class="mx-5 mb-5 mt-5 p-4 bg-[#f8f9fa] rounded-lg border border-slate-100 grid grid-cols-2 gap-x-4 gap-y-2">
      <div class="flex items-center gap-2.5 mb-2 last:mb-0">
        <span class="text-sm text-[#666] min-w-[100px]">{{ $t('epidemicCurve.incubationTable.summary.min') }}</span>
        <span class="text-sm text-[#333] font-medium">{{ minIncubation }}</span>
      </div>
      <div class="flex items-center gap-2.5 mb-2 last:mb-0">
        <span class="text-sm text-[#666] min-w-[100px]">{{ $t('epidemicCurve.incubationTable.summary.max') }}</span>
        <span class="text-sm text-[#333] font-medium">{{ maxIncubation }}</span>
      </div>
      <div class="flex items-center gap-2.5 mb-2 last:mb-0">
        <span class="text-sm text-[#666] min-w-[100px]">{{ $t('epidemicCurve.incubationTable.summary.avg') }}</span>
        <span class="text-sm text-[#333] font-medium">{{ avgIncubation }}</span>
      </div>
      <div class="flex items-center gap-2.5">
        <span class="text-sm text-[#666] min-w-[100px]">{{ $t('epidemicCurve.incubationTable.summary.median') }}</span>
        <span class="text-sm text-[#333] font-medium">{{ medianIncubation }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataGuideMessage from '../../../DataGuideMessage.vue';
import { useClipboardOperations } from '../../composables/useClipboardOperations';
import BaseButton from '../../../Common/BaseButton.vue';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue'; // Added computed

const { t } = useI18n();

// 안내 메시지 steps
const exposureGuideSteps = computed(() => [
  { number: '1', text: t('epidemicCurve.incubationTable.guide.step1') },
  { number: '2', text: t('epidemicCurve.incubationTable.guide.step2') },
  { number: '3', text: t('epidemicCurve.incubationTable.guide.step3') }
]);

const symptomGuideSteps = computed(() => [
  { number: '1', text: 'Symptom Onset' },
  { number: '2', text: 'Min 2 Patients' },
  { number: '3', text: 'Format: YYYY-MM-DD HH:MM' }
]);

interface TableItem {
  intervalLabel: string;
  count: number | string;
}

withDefaults(defineProps<{
  tableData: TableItem[];
  minIncubation?: string;
  maxIncubation?: string;
  avgIncubation?: string;
  medianIncubation?: string;
  hasExposureDateTime?: boolean;
  isIndividualExposureColumnVisible?: boolean;
}>(), {
  minIncubation: '--:--',
  maxIncubation: '--:--',
  avgIncubation: '--:--',
  medianIncubation: '--:--',
  hasExposureDateTime: false,
  isIndividualExposureColumnVisible: false
});

const { isIncubationTableCopied, copyIncubationTableToClipboard } = useClipboardOperations();
const isTableCopied = isIncubationTableCopied;

const handleCopyTable = () => {
  copyIncubationTableToClipboard();
};
</script>
