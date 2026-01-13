<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <header class="flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-glass z-[4] sticky top-0">
      <CommonHeader />
    </header>

    <div class="flex flex-col p-5 max-w-[1400px] mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div class="inline-flex items-center bg-white/60 backdrop-blur-sm border border-white/40 px-6 py-3 rounded-2xl shadow-glass">
          <div class="flex items-center text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            <span class="material-icons mr-3 text-[28px] text-blue-500">groups</span>
            {{ $t('cohortStudy.title') }}
          </div>
        </div>
        
        <!-- 통계 도움말 버튼 (Square Style) -->
        <button 
          @click="showInfoModal = true"
          class="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 px-4 py-3 rounded-xl shadow-sm hover:shadow-md hover:bg-white transition-all group"
        >
          <span class="material-icons text-slate-400 group-hover:text-blue-600 transition-colors">help_outline</span>
          <span class="text-sm font-bold text-slate-500 group-hover:text-blue-700 transition-colors">{{ $t('cohortStudy.guide.button') }}</span>
        </button>
      </div>

      <div class="flex flex-col overflow-hidden bg-white rounded-2xl shadow-premium border border-slate-100 transition-all duration-300 hover:shadow-xl">
        <CohortControls 
          :font-size="tableFontSize"
          :row-count="rows.length"
          @update:fontSize="updateFontSize"
        />

        <CohortResultTable 
          :results="cohortAnalysisResults"
          :font-size="tableFontSize"
          :use-yates-correction="useYatesCorrection"
          @toggle-yates="toggleYatesCorrection"
        />
      </div>
    </div>
    
    <!-- Info Modal -->
    <CohortInfoModal 
      :is-open="showInfoModal" 
      @close="showInfoModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, WritableComputedRef } from 'vue';
import { useEpidemicStore } from '../../stores/epidemicStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useCohortAnalysis } from './composables/useCohortAnalysis';
import CommonHeader from '../Common/CommonHeader.vue';
import CohortControls from './components/CohortControls.vue';
import CohortResultTable from './components/CohortResultTable.vue';
import CohortInfoModal from './components/CohortInfoModal.vue';

const epidemicStore = useEpidemicStore();
const settingsStore = useSettingsStore();

// --- State Management ---
const tableFontSize = ref(14);
const showInfoModal = ref(false);

const updateFontSize = (size: number) => {
  tableFontSize.value = size;
};

const rows = computed(() => epidemicStore.rows || []);
const headers = computed(() => epidemicStore.headers || { diet: [] });

// Yates 보정 토글 변수 (store에서 관리)
const yatesSettings = computed(() => settingsStore.yatesCorrectionSettings);
const useYatesCorrection: WritableComputedRef<boolean> = computed({
  get: () => yatesSettings.value?.cohort ?? false,
  set: (value: boolean) => settingsStore.setYatesCorrectionSettings({ type: 'cohort', enabled: value })
});

const toggleYatesCorrection = () => {
  useYatesCorrection.value = !useYatesCorrection.value;
};

// --- Analysis Logic ---
const { cohortAnalysisResults } = useCohortAnalysis(rows, headers, useYatesCorrection);

</script>
