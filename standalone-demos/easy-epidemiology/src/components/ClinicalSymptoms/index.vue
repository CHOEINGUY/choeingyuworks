<template>
  <div class="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    <header class="flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-glass z-[4] sticky top-0">
      <CommonHeader />
    </header>

    <div class="flex flex-col p-6 max-w-[1600px] mx-auto w-full">
      <div class="mb-6">
        <SummaryBar :title="$t('clinicalSymptoms.title')" />
      </div>
      <div class="flex gap-6 items-start flex-wrap lg:flex-nowrap">
        <div class="flex-1 min-w-[500px] bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden flex flex-col h-fit lg:max-w-[550px]">
          <FrequencyTable 
            :data="sortedSymptomStats" 
            :is-table-copied="isTableCopied"
            @copy="copyTableToClipboard"
          />
        </div>
        <div class="flex-[1.5] min-w-[600px] bg-white rounded-2xl shadow-premium border border-slate-100 p-6 flex flex-col gap-6">
          <ChartControlPanel
            v-model:barDirection="barDirection"
            v-model:chartFontSize="chartFontSize"
            v-model:chartWidth="chartWidth"
            v-model:barWidthPercent="barWidthPercent"
            v-model:selectedBarColor="selectedBarColor"
            v-model:currentHighlight="currentHighlight"
            v-model:currentSort="currentSort"
            
            :font-sizes="fontSizes"
            :font-size-labels="fontSizeLabels"
            :chart-widths="chartWidths"
            :bar-width-percents="barWidthPercents"
            :bar-colors="barColors"
            :highlight-options="highlightOptions"
            :sort-options="sortOptions"
          />
          <SymptomBarChart
            ref="symptomBarChartRef"
            :chart-width="chartWidth"
            :is-chart-copied="isChartCopied"
            @copy="copyChartToClipboard"
            @export="exportChart"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, markRaw } from 'vue';
import * as echarts from 'echarts';
import { debounce } from 'lodash-es';

// Components
import CommonHeader from '../Common/CommonHeader.vue';
import SummaryBar from './components/SummaryBar.vue';
import FrequencyTable from './components/FrequencyTable.vue';
import ChartControlPanel from './components/ChartControlPanel.vue';
import SymptomBarChart from './components/SymptomBarChart.vue';

// Composables
import { useSymptomStats } from './composables/useSymptomStats';
import { useChartControls } from './composables/useChartControls';
import { useChartOptions } from './composables/useChartOptions';
import { useClipboardOperations } from './composables/useClipboardOperations';
import { useI18n } from 'vue-i18n';
import { showToast } from '../DataInputVirtualScroll/logic/toast';

// Type for chart component ref
interface SymptomBarChartInstance {
  chartContainerRef: HTMLElement | null;
}

const { t } = useI18n();

// Chart Controls
const {
  fontSizes,
  fontSizeLabels,
  chartWidths,
  barWidthPercents,
  barColors,
  highlightOptions,
  sortOptions,
  chartFontSize,
  chartWidth,
  barWidthPercent,
  selectedBarColor,
  barDirection,
  currentHighlight,
  currentSort
} = useChartControls(t);

// Symptom Stats
const {
  sortedSymptomStats,
  symptomStats,
  chartStates,
  canUpdateChart
} = useSymptomStats({ currentSort });

// Chart Options
const { chartOptions } = useChartOptions({
  sortedSymptomStats,
  barDirection,
  chartFontSize,
  selectedBarColor,
  currentHighlight,
  barWidthPercent,
  t
});

// Chart instance
const chartInstance = ref<any | null>(null);
const symptomBarChartRef = ref<SymptomBarChartInstance | null>(null);

// Clipboard Operations
const {
  isTableCopied,
  isChartCopied,
  copyTableToClipboard,
  copyChartToClipboard,
  exportChart
} = useClipboardOperations({
  chartInstance,
  chartWidth
});

// Chart rendering
const debouncedRenderChart = debounce(() => {
  console.log('Debounced chart render triggered');
  renderChart();
}, 150);

const renderChart = (): void => {
  try {
    const chartContainer = symptomBarChartRef.value?.chartContainerRef;
    if (!chartContainer) {
      console.warn('renderChart: 차트 컨테이너가 없음');
      return;
    }
    
    if (!canUpdateChart()) {
      console.warn('renderChart: 차트 업데이트 불가 상태');
      return;
    }
    
    const states = chartStates.value;
    console.log('차트 렌더링 시작:', states);
    
    if (!chartInstance.value) {
      chartInstance.value = markRaw(echarts.init(chartContainer));
      console.log('차트 인스턴스 생성됨');
    }
    
    const options = chartOptions.value;
    if (options && typeof options === 'object') {
      chartInstance.value.setOption(options, false);
      console.log('차트 업데이트 완료');
    } else {
      console.error('renderChart: 유효하지 않은 차트 옵션');
    }
  } catch (error) {
    console.error('renderChart 오류:', error);
  }
};

const recreateChart = (): void => {
  console.log('Attempting to recreate chart...');
  if (chartInstance.value && typeof chartInstance.value.dispose === 'function') {
    try { 
      chartInstance.value.dispose(); 
      console.log('Previous chart instance disposed.'); 
    }
    catch (e) { 
      console.error('Error disposing chart instance:', e); 
    }
    finally { 
      chartInstance.value = null; 
    }
  }
  nextTick(() => {
    const chartContainer = symptomBarChartRef.value?.chartContainerRef;
    if (chartContainer instanceof HTMLElement) {
      try {
        console.log(`Initializing new chart in container with width: ${chartContainer.offsetWidth}px`);
        chartInstance.value = markRaw(echarts.init(chartContainer));
        console.log('New chart instance initialized.');
        renderChart();
      } catch (error) { 
        console.error('ECharts 재초기화 실패:', error); 
        showToast('차트를 다시 그리는 중 오류가 발생했습니다.', 'error'); 
      }
    } else { 
      console.error('차트 컨테이너 DOM 요소를 찾을 수 없습니다.'); 
    }
  });
};

// Lifecycle
onMounted(() => {
  console.log('ClinicalSymptoms 컴포넌트 마운트됨');
  nextTick(() => {
    if (canUpdateChart()) {
      renderChart();
    }
  });
});

onUnmounted(() => {
  if (chartInstance.value && typeof chartInstance.value.dispose === 'function') {
    try {
      chartInstance.value.dispose();
      chartInstance.value = null;
      console.log('차트 인스턴스 정리 완료');
    } catch (error) {
      console.error('차트 정리 오류:', error);
    }
  }
  
  if (debouncedRenderChart && typeof (debouncedRenderChart as any).cancel === 'function') {
    (debouncedRenderChart as any).cancel();
  }
  
  console.log('ClinicalSymptoms 컴포넌트 cleanup 완료');
});

// Watchers
watch(chartWidth, (newWidth, oldWidth) => {
  if (newWidth !== oldWidth && chartInstance.value && canUpdateChart()) {
    console.log(`Chart width changed: ${oldWidth} -> ${newWidth}. Recreating chart.`);
    nextTick(() => {
      recreateChart();
    });
  }
}, { flush: 'post' });

watch([
  symptomStats,
  barDirection,
  selectedBarColor,
  chartFontSize,
  currentHighlight,
  barWidthPercent
], ([newStats, newDirection, newColor, newFontSize, newHighlight, newBarWidth],
  [oldStats, oldDirection, oldColor, oldFontSize, oldHighlight, oldBarWidth]) => {
  
  try {
    const hasStatsChange = newStats !== oldStats;
    const hasDirectionChange = newDirection !== oldDirection;
    const hasColorChange = newColor !== oldColor;
    const hasFontChange = newFontSize !== oldFontSize;
    const hasHighlightChange = newHighlight !== oldHighlight;
    const hasBarWidthChange = newBarWidth !== oldBarWidth;
    
    if (!hasStatsChange && !hasDirectionChange && !hasColorChange && !hasFontChange && !hasHighlightChange && !hasBarWidthChange) {
      return;
    }
    
    console.log('차트 업데이트 triggered:', {
      hasStatsChange, hasDirectionChange, hasColorChange, hasFontChange, hasHighlightChange, hasBarWidthChange
    });
    
    nextTick(() => {
      if (canUpdateChart()) {
        debouncedRenderChart();
      }
    });
  } catch (error) {
    console.error('watch 핸들러 오류:', error);
  }
}, { 
  deep: false, 
  immediate: false,
  flush: 'post'
});
</script>
