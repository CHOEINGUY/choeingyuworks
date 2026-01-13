<template>
  <div class="bg-gradient-to-br from-slate-50 to-slate-100 h-full flex flex-col overflow-hidden">
    <header class="flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-glass z-[4] sticky top-0">
      <CommonHeader />
    </header>

    <div class="flex gap-[30px] mx-[30px] mt-5 mb-[68px] flex-1 min-h-0 relative z-0">
      <ReportEditor :reportData="reportData" />
      <ReportPreview :reportData="reportData" />
    </div>

    <!-- 분석 필요 모달 -->
    <BaseModal 
      v-model="reportData.showAnalysisModal.value"
      :title="$t('reportWriter.modal.title')"
      size="sm"
    >
      <div class="text-gray-500 leading-relaxed">
        <p class="mb-3">{{ reportData.analysisModalMessage.value }}</p>
        <p class="mb-3">{{ $t('reportWriter.modal.message') }}</p>
      </div>
      
      <template #footer>
        <div class="flex justify-end">
          <BaseButton 
            variant="primary"
            @click="reportData.closeAnalysisModal"
          >
            {{ $t('reportWriter.modal.confirm') }}
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { useReportData } from './composables/useReportData';
import CommonHeader from '../Common/CommonHeader.vue';
import ReportEditor from './components/ReportEditor.vue';
import ReportPreview from './components/ReportPreview.vue';
import BaseModal from '../Common/BaseModal.vue';
import BaseButton from '../Common/BaseButton.vue';
import { ReportData } from '../../types/report';

const reportData: ReportData = useReportData();
</script>
