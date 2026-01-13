<template>
  <div class="chart-container-wrapper incubation-chart-wrapper">
    <ChartActionButtons 
      :isSaved="isChartSaved" 
      :showSavedFeedback="showChartSavedTooltip" 
      :isCopied="isChartCopied"
      @saveReport="$emit('saveChartForReport')"
      @copyChart="handleCopyChart"
      @exportChart="handleExportChart"
    />

    <!-- Exposure Date Time Empty State (No Scroll) -->
    <div v-if="!formattedExposureDateTime" class="no-data-message">
      <DataGuideMessage
        icon="event"
        :title="$t('epidemicCurve.incubationTable.guide.noExposureTitle')"
        :description="$t('epidemicCurve.incubationTable.guide.noExposureDesc')"
        :steps="[
          { number: '1', text: $t('epidemicCurve.incubationTable.guide.step1') },
          { number: '2', text: $t('epidemicCurve.incubationTable.guide.step2') },
          { number: '3', text: $t('epidemicCurve.incubationTable.guide.step3') }
        ]"
      />
    </div>

    <!-- Warning Message State -->
    <div v-else-if="showWarningMessage" class="no-data-message">
      <DataGuideMessage
        icon="warning"
        :title="$t('epidemicCurve.warning.title')"
        :description="$t('epidemicCurve.warning.desc')"
        :steps="[
          { number: '1', text: $t('epidemicCurve.warning.step1', { time: formattedExposureDateTime }) },
          { number: '2', text: $t('epidemicCurve.warning.step2') }
        ]"
      />
    </div>

    <!-- Chart State -->
    <div v-else ref="chartContainer" class="chart-instance" :style="{ width: chartWidth + 'px', height: chartHeight + 'px' }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, markRaw } from 'vue';
import * as echarts from 'echarts';
import { debounce } from 'lodash-es';
import DataGuideMessage from '../../../DataGuideMessage.vue';
import ChartActionButtons from '../../../Common/ChartActionButtons.vue';

const props = withDefaults(defineProps<{
  chartOptions: any;
  chartWidth: number;
  chartHeight?: number;
  isChartSaved?: boolean;
  showChartSavedTooltip?: boolean;
  showWarningMessage?: boolean;
  formattedExposureDateTime?: string;
}>(), {
  chartHeight: 550,
  isChartSaved: false,
  showChartSavedTooltip: false,
  showWarningMessage: false,
  formattedExposureDateTime: ''
});

const emit = defineEmits<{
  (e: 'saveChartForReport'): void;
  (e: 'copyChart', instance: any): void;
  (e: 'exportChart', instance: any): void;
  (e: 'chartInstance', instance: any): void;
}>();

// 경고 메시지 steps
// Warning steps removed as they use $t directly


const chartContainer = ref<HTMLElement | null>(null);
const chartInstance = ref<any | null>(null);
const isChartCopied = ref(false);

// 차트 초기화
const initChart = () => {
  if (!chartContainer.value || props.showWarningMessage) return;
  
  const rect = chartContainer.value.getBoundingClientRect();
  if (rect.width <= 0) return;

  if (chartInstance.value) {
    chartInstance.value.dispose();
  }

  chartInstance.value = markRaw(echarts.init(chartContainer.value));
  emit('chartInstance', chartInstance.value as any);
  
  if (props.chartOptions && typeof props.chartOptions === 'object') {
    chartInstance.value.setOption(props.chartOptions, false);
  }
};

// 차트 업데이트
const updateChart = () => {
  if (props.showWarningMessage) return;
  
  if (!chartInstance.value) {
    initChart();
    return;
  }
  
  if (props.chartOptions && typeof props.chartOptions === 'object') {
    chartInstance.value.setOption(props.chartOptions, false);
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

// 경고 메시지 상태 변경 감지
watch(() => props.showWarningMessage, (newValue, oldValue) => {
  if (!newValue && oldValue) {
    nextTick(() => {
      setTimeout(initChart, 50);
    });
  }
});

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
  if (debouncedUpdateChart.cancel) {
    debouncedUpdateChart.cancel();
  }
});

const handleCopyChart = async () => {
  if (!chartInstance.value) return;
  emit('copyChart', chartInstance.value as any);
  isChartCopied.value = true;
  setTimeout(() => (isChartCopied.value = false), 1500);
};

const handleExportChart = () => {
  if (!chartInstance.value) return;
  emit('exportChart', chartInstance.value as any);
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
  /* flex: 1; removed */
  width: 100%;
}

.no-data-message { 
  padding: 20px; 
  text-align: center; 
  color: #666;
  flex: 1; /* Keep flex 1 here for centering within its own bounds if needed */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
