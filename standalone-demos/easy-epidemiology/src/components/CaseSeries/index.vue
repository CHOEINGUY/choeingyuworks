<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <header class="flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-glass z-[4] sticky top-0">
      <CommonHeader />
    </header>

    <div class="flex flex-col p-5 max-w-[1400px] mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div class="inline-flex items-center bg-white/60 backdrop-blur-sm border border-white/40 px-6 py-3 rounded-2xl shadow-glass">
          <div class="flex items-center text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            <span class="material-icons mr-3 text-[28px] text-blue-500">insights</span>
            {{ $t('caseSeries.title') }}
          </div>
        </div>
        
        <!-- 통계 도움말 버튼 (Square Style) -->
        <button 
          @click="showInfoModal = true"
          class="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 px-4 py-3 rounded-xl shadow-sm hover:shadow-md hover:bg-white transition-all group"
        >
          <span class="material-icons text-slate-400 group-hover:text-blue-600 transition-colors">help_outline</span>
          <span class="text-sm font-bold text-slate-500 group-hover:text-blue-700 transition-colors">{{ $t('caseSeries.guide.button') }}</span>
        </button>
      </div>

      <div class="flex flex-col overflow-hidden bg-white rounded-2xl shadow-premium border border-slate-100 transition-all duration-300 hover:shadow-xl">
        <CaseSeriesControls 
          v-model:fontSize="tableFontSize"
          :rowCount="rowCount"
        />
        
        <CaseSeriesTable 
          :results="caseSeriesResults"
          :fontSize="tableFontSize"
        />
      </div>
    </div>

    <!-- Info Modal -->
    <CaseSeriesInfoModal 
      :is-open="showInfoModal" 
      @close="showInfoModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CommonHeader from '../Common/CommonHeader.vue';
import CaseSeriesControls from './components/CaseSeriesControls.vue';
import CaseSeriesTable from './components/CaseSeriesTable.vue';
import CaseSeriesInfoModal from './components/CaseSeriesInfoModal.vue';
import { useCaseSeriesAnalysis } from './composables/useCaseSeriesAnalysis';

const tableFontSize = ref(14);
const showInfoModal = ref(false);
const { caseSeriesResults, rowCount } = useCaseSeriesAnalysis();
</script>
