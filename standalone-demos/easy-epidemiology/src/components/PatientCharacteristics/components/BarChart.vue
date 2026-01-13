<template>
  <div class="flex flex-col items-center justify-center p-5 bg-white rounded-2xl shadow-premium border border-slate-100 overflow-x-auto">
    <div class="relative w-full flex justify-end gap-2 mb-2">
      <SharedIconButton
        icon="copy"
        :label="$t('patientChars.chart.copy')"
        :showSuccess="isChartCopied"
        @click="handleCopyChart"
      />
      <SharedIconButton
        icon="download"
        :label="$t('patientChars.chart.save')"
        @click="handleExportChart"
      />
    </div>
    <div ref="chartContainer" :style="{ width: chartWidth + 'px', height: '500px' }"></div>
  </div>
</template>

<script setup lang="ts">
// BarChart.vue - 차트 표시 컴포넌트
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import * as echarts from 'echarts';
import { debounce } from 'lodash-es';
import { useClipboardOperations } from '../composables/useClipboardOperations';
import { generateTotalChartOptions, generatePatientChartOptions, type ChartOptions } from '../composables/useChartOptions';
import { showToast } from '../../DataInputVirtualScroll/logic/toast';
import SharedIconButton from './SharedIconButton.vue';
import type { FrequencyData } from '../composables/usePatientStats';

const props = withDefaults(defineProps<{
  chartWidth?: number;
  selectedVariableIndex?: number | null;
  selectedChartType?: 'total' | 'patient';
  selectedDataType?: 'count' | 'percentage';
  frequencyData?: FrequencyData[];
  headers?: { basic: string[] };
  chartFontSize?: number;
  barWidthPercent?: number;
  selectedBarColor?: string;
  currentHighlight?: 'none' | 'max' | 'min' | 'both';
  labelMappings?: Record<string, string>;
}>(), {
  chartWidth: 700,
  selectedVariableIndex: null,
  selectedChartType: 'total',
  selectedDataType: 'count',
  frequencyData: () => [],
  headers: () => ({ basic: [] }),
  chartFontSize: 18,
  barWidthPercent: 50,
  selectedBarColor: '#5470c6',
  currentHighlight: 'none',
  labelMappings: () => ({})
});

const emit = defineEmits<{
  (e: 'copyChart', instance: any): void;
  (e: 'exportChart', instance: any): void;
  (e: 'chartInstance', instance: any): void;
  (e: 'chartUpdated'): void;
}>();

const { t } = useI18n();
const chartContainer = ref<HTMLElement | null>(null);
const chartInstance = ref<any | null>(null);

const { isChartCopied, copyChartToClipboard, exportChart } = useClipboardOperations();

// 라벨 매핑 헬퍼 함수
const getMappedLabel = (originalCat: string): string => {
  if (props.labelMappings && Object.prototype.hasOwnProperty.call(props.labelMappings, originalCat)) {
    const mapped = props.labelMappings[originalCat];
    if (mapped && String(mapped).trim()) {
      return String(mapped).trim();
    }
  }
  return originalCat;
};

// 차트 업데이트
const updateCharts = () => {
  if (!chartInstance.value || props.selectedVariableIndex === null || props.selectedVariableIndex === undefined) return;
  if (!props.headers?.basic || !props.frequencyData || props.frequencyData.length <= props.selectedVariableIndex) {
    console.warn('차트 업데이트 건너뛰기: 데이터 준비 안됨'); 
    return;
  }
  
  const header = props.headers.basic[props.selectedVariableIndex] || t('common.none');
  const data = props.frequencyData[props.selectedVariableIndex];
  
  if (!data || Object.keys(data).length === 0) {
    console.warn('차트 업데이트 건너뛰기: 빈 데이터');
    return;
  }
  
  const chartOptions: ChartOptions = {
    chartFontSize: props.chartFontSize,
    barWidthPercent: props.barWidthPercent,
    selectedBarColor: props.selectedBarColor,
    currentHighlight: props.currentHighlight,
    getMappedLabel,
    t
  };

  const options = props.selectedChartType === 'total'
    ? generateTotalChartOptions(header, data, props.selectedDataType, chartOptions)
    : generatePatientChartOptions(header, data, props.selectedDataType, chartOptions);
  
  try {
    if (chartInstance.value && typeof chartInstance.value.setOption === 'function') {
      chartInstance.value.setOption(options, false);
      console.log('Chart options updated efficiently.');
      emit('chartUpdated');
    } else { 
      console.error('차트 인스턴스 유효하지 않음'); 
    }
  } catch (error) { 
    console.error('ECharts setOption 오류:', error, options); 
  }
};

// 차트 재생성
const recreateChart = () => {
  console.log('Attempting to recreate chart...');
  if (chartInstance.value && typeof chartInstance.value.dispose === 'function') {
    try { 
      chartInstance.value.dispose(); 
      console.log('Previous chart instance disposed.'); 
    }
    catch (e) { console.error('Error disposing chart instance:', e); }
    finally { chartInstance.value = null; }
  }
  nextTick(() => {
    if (chartContainer.value instanceof HTMLElement) {
      try {
        console.log(`Initializing new chart in container with width: ${chartContainer.value.offsetWidth}px`);
        chartInstance.value = echarts.init(chartContainer.value);
        console.log('New chart instance initialized.');
        updateCharts();
      } catch (error) { 
        console.error('ECharts 재초기화 실패:', error); 
        showToast('차트를 다시 그리는 중 오류가 발생했습니다.', 'error'); 
      }
    } else { 
      console.error('차트 컨테이너 DOM 요소를 찾을 수 없습니다.'); 
    }
  });
};

// 디바운스된 차트 업데이트
const triggerChartUpdate = debounce(() => {
  console.log('Debounced chart update triggered.');
  if (chartInstance.value && props.selectedVariableIndex !== null) {
    updateCharts();
  } else {
    console.log('Chart instance not found or no variable selected, skipping update trigger.');
  }
}, 200);

// 리사이즈 핸들러
const handleResize = debounce(() => {
  if (chartInstance.value && 
      typeof (chartInstance.value as any).resize === 'function' && 
      props.selectedVariableIndex !== null) {
    try { 
      console.log('Resizing chart due to window resize...'); 
      (chartInstance.value as any).resize({
        animation: {
          duration: 200,
          easing: 'cubicOut'
        }
      } as any);
    }
    catch (error) { 
      console.error('ECharts resize 오류 (window):', error); 
    }
  }
}, 150);

// 클립보드 작업 핸들러
const handleCopyChart = () => {
  if (chartInstance.value && props.chartWidth) {
    copyChartToClipboard(chartInstance.value, props.chartWidth);
  }
};

const handleExportChart = () => {
  if (chartInstance.value && props.chartWidth) {
    const header = props.headers?.basic?.[props.selectedVariableIndex || 0] || '(없음)';
    exportChart(chartInstance.value, props.chartWidth, header, props.selectedChartType);
  }
};

// 라이프사이클
onMounted(() => {
  if (props.selectedVariableIndex !== null) {
    recreateChart();
  }
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  
  if (chartInstance.value && typeof chartInstance.value.dispose === 'function') {
    try { 
      chartInstance.value.dispose(); 
      chartInstance.value = null; 
      console.log('ECharts 인스턴스 정리 완료.'); 
    }
    catch (error) { 
      console.error('ECharts 인스턴스 정리 오류:', error); 
    }
  }
  
  if (triggerChartUpdate && typeof (triggerChartUpdate as any).cancel === 'function') {
    (triggerChartUpdate as any).cancel();
  }
  if (handleResize && typeof (handleResize as any).cancel === 'function') {
    (handleResize as any).cancel();
  }
  
  chartContainer.value = null;
  console.log('컴포넌트 cleanup 완료');
});

// 차트 너비 변경 감시 (resize 사용으로 성능 최적화)
watch(() => props.chartWidth, (newWidth, oldWidth) => {
  if (newWidth !== oldWidth && chartInstance.value && props.selectedVariableIndex !== null) {
    console.log(`Chart width changed: ${oldWidth} -> ${newWidth}. Resizing chart.`);
    nextTick(() => {
      if (chartInstance.value && typeof chartInstance.value.resize === 'function') {
        try {
          chartInstance.value.resize({
            width: newWidth,
            animation: {
              duration: 200,
              easing: 'cubicOut'
            }
          });
          console.log('Chart resized successfully.');
        } catch (error) {
          console.error('Chart resize error, falling back to recreate:', error);
          recreateChart();
        }
      }
    });
  }
}, { flush: 'post' });

// 다른 옵션 변경 감시
watch(
  [ 
    () => props.selectedVariableIndex,
    () => props.selectedChartType,
    () => props.selectedDataType,
    () => props.frequencyData,
    () => props.chartFontSize,
    () => props.barWidthPercent,
    () => props.selectedBarColor,
    () => props.currentHighlight,
    () => props.labelMappings
  ],
  ([newIndex]) => {
    console.log('BarChart watcher triggered');

    if (chartInstance.value && newIndex !== null) {
      console.log('Triggering optimized chart update');
      nextTick(() => {
        updateCharts();
      });
    } else if (!chartInstance.value && newIndex !== null) {
      console.log('Chart instance not found, recreating chart');
      nextTick(() => {
        recreateChart();
      });
    }
  },
  { 
    deep: true, 
    immediate: false,
    flush: 'post'
  }
);

// 외부에서 호출 가능한 메서드 노출
defineExpose({
  updateCharts,
  recreateChart,
  triggerChartUpdate
});
</script>
