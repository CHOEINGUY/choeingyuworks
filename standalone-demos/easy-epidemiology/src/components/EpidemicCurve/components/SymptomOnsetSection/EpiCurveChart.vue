<template>
  <div class="chart-container-wrapper epi-chart-wrapper">
    <ChartActionButtons 
      :isSaved="isChartSaved" 
      :showSavedFeedback="showChartSavedTooltip" 
      :isCopied="isChartCopied"
      @saveReport="$emit('saveChartForReport')"
      @copyChart="handleCopyChart"
      @exportChart="handleExportChart"
    />

    <div ref="chartContainer" class="chart-instance" :style="{ width: chartWidth + 'px', height: chartHeight + 'px' }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, markRaw } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { debounce } from 'lodash-es';
import ChartActionButtons from '../../../Common/ChartActionButtons.vue';

const props = withDefaults(defineProps<{
  chartOptions: any; // Relaxed type to avoid circular dependency or version mismatch
  chartWidth: number;
  chartHeight?: number;
  isChartSaved?: boolean;
  showChartSavedTooltip?: boolean;
}>(), {
  chartHeight: 550,
  isChartSaved: false,
  showChartSavedTooltip: false
});

const emit = defineEmits<{
  (e: 'saveChartForReport'): void;
  (e: 'copyChart', instance: any): void;
  (e: 'exportChart', instance: any): void;
  (e: 'chartInstance', instance: any): void;
}>();

const chartContainer = ref<HTMLElement | null>(null);
const chartInstance = ref<any | null>(null);
const isChartCopied = ref(false);

// 차트 초기화
const initChart = () => {
  if (!chartContainer.value) return;
  
  const rect = chartContainer.value.getBoundingClientRect();
  if (rect.width <= 0) return;

  if (chartInstance.value) {
    chartInstance.value.dispose();
  }

  chartInstance.value = markRaw(echarts.init(chartContainer.value));
  emit('chartInstance', chartInstance.value);
  
  if (props.chartOptions && typeof props.chartOptions === 'object') {
    chartInstance.value.setOption(props.chartOptions, true);
  }
};

// 차트 업데이트
const updateChart = () => {
  if (!chartInstance.value) {
    initChart();
    return;
  }
  
  if (props.chartOptions && typeof props.chartOptions === 'object') {
    chartInstance.value.setOption(props.chartOptions, true);
  }
};

const debouncedUpdateChart = debounce(updateChart, 200);

// 차트 옵션 변경 감지
watch(() => props.chartOptions, () => {
  nextTick(debouncedUpdateChart);
}, { deep: true });

// 차트 너비 변경 감지
watch(() => props.chartWidth, (newWidth, oldWidth) => {
  if (newWidth !== oldWidth && chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
    nextTick(() => {
      setTimeout(() => {
        initChart();
      }, 50);
    });
  }
}, { flush: 'post' });

// 마운트 시 차트 초기화
onMounted(() => {
  nextTick(initChart);
});

// 언마운트 시 정리
onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
  if ((debouncedUpdateChart as any).cancel) {
    (debouncedUpdateChart as any).cancel();
  }
});

const handleCopyChart = async () => {
  if (!chartInstance.value) return;
  emit('copyChart', chartInstance.value);
  isChartCopied.value = true;
  setTimeout(() => (isChartCopied.value = false), 1500);
};

const handleExportChart = () => {
  if (!chartInstance.value) return;
  emit('exportChart', chartInstance.value);
};

// 외부에서 접근할 수 있도록 차트 인스턴스 노출
defineExpose({
  chartInstance,
  initChart,
  updateChart
});
</script>

<style scoped>
.chart-container-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px 15px; /* Slightly reduced horizontal padding to maximize chart area */
  overflow-x: auto; /* Required to support manual chartWidth settings (700px, 900px, 1100px) on smaller screens */
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1; /* Restore flex to stretch wrapper */
  /* min-height removed */
  width: 100%;
  box-sizing: border-box;
}

.chart-instance {
  /* flex: 1; removed to respect height prop */
  width: 100%;
}
</style>
