<template>
  <div class="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    <header class="flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-glass z-[4] sticky top-0">
      <CommonHeader />
    </header>

    <div class="flex flex-col p-6 max-w-[1600px] mx-auto w-full">
      <div class="mb-6">
        <SummaryBar :title="$t('epidemicCurve.title')" />
      </div>

      <div class="flex flex-col gap-8">
        <!-- 첫 번째 행: 증상 발현 테이블 + 유행곡선 차트 -->
        <div class="flex gap-5 items-stretch flex-wrap xl:flex-nowrap">
          <div class="flex-1 min-w-[500px] bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden flex flex-col xl:max-w-[450px]">
            <div class="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                {{ $t('epidemicCurve.symptomAnalysis') }}
              </h3>
            </div>
            <div class="p-4">
            <div class="px-5">
              <SuspectedFoodSelector />
            </div>
              <div class="mt-4">
                <SymptomOnsetTable
                  :tableData="symptomOnsetTableData"
                  :firstOnsetTime="formattedFirstOnsetTime"
                  :lastOnsetTime="formattedLastOnsetTime"
                />
              </div>
            </div>
          </div>

          <div class="flex-[2] min-w-[600px] bg-white rounded-2xl shadow-premium border border-slate-100 p-5 flex flex-col gap-5">
            <EpiCurveControls
              :selectedInterval="selectedSymptomInterval"
              :chartFontSize="epiChartFontSize"
              :chartWidth="epiChartWidth"
              :barColor="epiBarColor"
              :displayMode="chartDisplayMode"
              
              :fontSizes="fontSizes"
              :fontSizeLabels="fontSizeLabels"
              :chartWidths="chartWidths"
              :barColors="barColors"
              
              :showConfirmedCaseToggle="isConfirmedCaseColumnVisible"
              :showConfirmedCaseLine="showConfirmedCaseLine"
              @update:selectedInterval="onSymptomIntervalChange"
              @update:chartFontSize="setEpiFontSize"
              @update:chartWidth="setEpiChartWidth"
              @update:barColor="setEpiBarColor"
              @update:displayMode="setChartDisplayMode"
              @toggleConfirmedCaseLine="toggleConfirmedCaseLine"
              @resetSettings="resetEpiChartSettings"
            />
            <EpiCurveChart
              ref="epiCurveChartRef"
              :chartOptions="epiCurveChartOptions"
              :chartWidth="epiChartWidth"
              :isChartSaved="isEpiChartSaved"
              :showChartSavedTooltip="showEpiChartSavedTooltip"
              @saveChartForReport="saveEpiChartForReport"
              @copyChart="handleCopyEpiChart"
              @exportChart="handleExportEpiChart"
              @chartInstance="onEpiChartInstance"
            />
          </div>
        </div>

        <!-- 두 번째 행: 잠복기 테이블 + 잠복기 차트 -->
        <div class="flex gap-5 items-stretch flex-wrap xl:flex-nowrap">
          <div class="flex-1 min-w-[500px] bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden flex flex-col xl:max-w-[450px]">
            <div class="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span class="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                {{ $t('epidemicCurve.incubationAnalysis') }}
              </h3>
            </div>
            <div class="p-4">
              <div class="px-5">
                <ExposureTimeControl
                  :formattedExposureDateTime="formattedExposureDateTime"
                  :isIndividualExposureColumnVisible="isIndividualExposureColumnVisible"
                  @showExposureDateTimePicker="showExposureDateTimePicker"
                />
              </div>
              <IncubationTable
                :tableData="incubationPeriodTableData"
                :minIncubation="minIncubationPeriodFormatted"
                :maxIncubation="maxIncubationPeriodFormatted"
                :avgIncubation="avgIncubationPeriodFormatted"
                :medianIncubation="medianIncubationPeriodFormatted"
                :hasExposureDateTime="!!exposureDateTime"
                :isIndividualExposureColumnVisible="isIndividualExposureColumnVisible"
              />
            </div>
          </div>

          <div class="flex-[2] min-w-[600px] bg-white rounded-2xl shadow-premium border border-slate-100 p-5 flex flex-col gap-5">
            <IncubationControls
              :selectedInterval="selectedIncubationInterval"
              :chartFontSize="incubationChartFontSize"
              :chartWidth="incubationChartWidth"
              :barColor="incubationBarColor"
              :displayMode="incubationChartDisplayMode"
              
              :fontSizes="fontSizes"
              :fontSizeLabels="fontSizeLabels"
              :chartWidths="chartWidths"
              :barColors="barColors"
              
              :formattedExposureDateTime="formattedExposureDateTime"
              :isIndividualExposureColumnVisible="isIndividualExposureColumnVisible"
              @update:selectedInterval="onIncubationIntervalChange"
              @update:chartFontSize="setIncubationFontSize"
              @update:chartWidth="setIncubationChartWidth"
              @update:barColor="setIncubationBarColor"
              @update:displayMode="setIncubationDisplayMode"
              @resetSettings="resetIncubationChartSettings"
              @showExposureDateTimePicker="showExposureDateTimePicker($event)"
            />
            <IncubationChart
              ref="incubationChartRef"
              :chartOptions="incubationChartOptions"
              :chartWidth="incubationChartWidth"
              :isChartSaved="isIncubationChartSaved"
              :showChartSavedTooltip="showIncubationChartSavedTooltip"
              :showWarningMessage="showIncubationWarningMessage"
              :formattedExposureDateTime="formattedExposureDateTime"
              @saveChartForReport="saveIncubationChartForReport"
              @copyChart="handleCopyIncubationChart"
              @exportChart="handleExportIncubationChart"
              @chartInstance="onIncubationChartInstance"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- DateTimePicker -->
    <DateTimePicker
      ref="exposureDateTimePickerRef"
      :visible="exposureDateTimePickerState.visible"
      :position="exposureDateTimePickerState.position"
      :initialValue="exposureDateTimePickerState.initialValue"
      @confirm="onExposureDateTimeConfirm"
      @cancel="onExposureDateTimeCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated, nextTick } from 'vue';
import { useSettingsStore } from '../../stores/settingsStore';
import { useI18n } from 'vue-i18n'; // Added import
// import { useUndoRedo } from '../../hooks/useUndoRedo'; // storeBridge dependency removed

// 컴포넌트 가져오기
import SummaryBar from './components/SummaryBar.vue';
import SuspectedFoodSelector from './components/SuspectedFoodSelector.vue';
import SymptomOnsetTable from './components/SymptomOnsetSection/SymptomOnsetTable.vue';
import EpiCurveControls from './components/SymptomOnsetSection/EpiCurveControls.vue';
import EpiCurveChart from './components/SymptomOnsetSection/EpiCurveChart.vue';
import ExposureTimeControl from './components/IncubationSection/ExposureTimeControl.vue';
import IncubationTable from './components/IncubationSection/IncubationTable.vue';
import IncubationControls from './components/IncubationSection/IncubationControls.vue';
import IncubationChart from './components/IncubationSection/IncubationChart.vue';
import CommonHeader from '../Common/CommonHeader.vue';
import DateTimePicker from '../DataInputVirtualScroll/parts/DateTimePicker.vue';

// Composables
import { useEpidemicStats } from './composables/useEpidemicStats';
import { useIncubationStats } from './composables/useIncubationStats';
import { useChartSettings } from './composables/useChartSettings';
import { useSuspectedFood } from './composables/useSuspectedFood';
import { useClipboardOperations } from './composables/useClipboardOperations';
import { generateEpiCurveChartOptions } from './composables/useEpiCurveChartOptions';
import { generateIncubationChartOptions } from './composables/useIncubationChartOptions';

const settingsStore = useSettingsStore();
const { t } = useI18n(); // Initialize i18n

const {
  isIndividualExposureColumnVisible,
// ... (lines 185-286 remain same, skipping for brevity in replacement block if possible, but safer to target specific blocks)
// Use smaller chunks next time if possible. Here I will target the options computation block.
  isConfirmedCaseColumnVisible,
  exposureDateTime,
  selectedSymptomInterval,
  symptomOnsetTableData,
  confirmedCaseOnsetTableData,
  formattedFirstOnsetTime,
  formattedLastOnsetTime
} = useEpidemicStats();

const {
  selectedIncubationInterval,
  formattedExposureDateTime,
  incubationDurations,
  minIncubationPeriodFormatted,
  maxIncubationPeriodFormatted,
  avgIncubationPeriodFormatted,
  medianIncubationPeriodFormatted,
  createIncubationPeriodTableData
} = useIncubationStats();

const {
  fontSizes,
  fontSizeLabels,
  chartWidths,
  barColors,

  epiChartFontSize,
  epiChartWidth,
  epiBarColor,
  chartDisplayMode,
  
  incubationChartFontSize,
  incubationChartWidth,
  incubationBarColor,
  incubationChartDisplayMode,
  
  setEpiFontSize,
  setEpiChartWidth,
  setEpiBarColor,
  setChartDisplayMode,
  resetEpiChartSettings,
  
  setIncubationFontSize,
  setIncubationChartWidth,
  setIncubationBarColor,
  setIncubationDisplayMode,
  resetIncubationChartSettings
} = useChartSettings();

const { suspectedFood } = useSuspectedFood();

const {
  copyEpiChartToClipboard,
  copyIncubationChartToClipboard,
  exportEpiChart,
  exportIncubationChart
} = useClipboardOperations();

// 차트 참조
const epiCurveChartRef = ref<any>(null);
const incubationChartRef = ref<any>(null);
const epiCurveChartInstance = ref<any>(null);
const incubationChartInstance = ref<any>(null);

// 차트 저장 상태
const isEpiChartSaved = ref(false);
const isIncubationChartSaved = ref(false);
const showEpiChartSavedTooltip = ref(false);
const showIncubationChartSavedTooltip = ref(false);

// 확진자 꺾은선 표시 여부
const showConfirmedCaseLine = ref(true);

import type { DateInfo } from '@/types/virtualGridContext';

interface DateTimePickerState {
  visible: boolean;
  position: { top: number; left: number };
  initialValue: DateInfo | null;
}

// DateTimePicker 상태
const exposureDateTimePickerRef = ref<any>(null);
const exposureDateTimePickerState = ref<DateTimePickerState>({
  visible: false,
  position: { top: 0, left: 0 },
  initialValue: null
});

// 잠복기 테이블 데이터
const incubationPeriodTableData = computed(() => {
  return createIncubationPeriodTableData(incubationChartDisplayMode.value);
});

// 잠복기 경고 메시지 표시 여부
const showIncubationWarningMessage = computed(() => {
  return !!(exposureDateTime.value && 
         incubationDurations.value.length === 0 && 
         !isIndividualExposureColumnVisible.value);
});

// 차트 옵션 생성
const epiCurveChartOptions = computed(() => {
  return generateEpiCurveChartOptions({
    symptomOnsetTableData: symptomOnsetTableData.value,
    confirmedCaseOnsetTableData: confirmedCaseOnsetTableData.value,
    selectedSymptomInterval: selectedSymptomInterval.value,
    chartDisplayMode: chartDisplayMode.value,
    epiChartFontSize: epiChartFontSize.value,
    epiBarColor: epiBarColor.value,
    suspectedFood: suspectedFood.value,
    isConfirmedCaseColumnVisible: isConfirmedCaseColumnVisible.value,
    showConfirmedCaseLine: showConfirmedCaseLine.value,
    t // Pass t function
  });
});

const incubationChartOptions = computed(() => {
  return generateIncubationChartOptions({
    incubationPeriodTableData: incubationPeriodTableData.value,
    incubationChartDisplayMode: incubationChartDisplayMode.value,
    incubationChartFontSize: incubationChartFontSize.value,
    incubationBarColor: incubationBarColor.value,
    suspectedFood: suspectedFood.value,
    t // Pass t function
  });
});

// 이벤트 핸들러
const onSymptomIntervalChange = (value: number) => {
  settingsStore.updateSymptomInterval(value);
};

const onIncubationIntervalChange = (value: number) => {
  settingsStore.updateIncubationInterval(value);
};

const toggleConfirmedCaseLine = () => {
  showConfirmedCaseLine.value = !showConfirmedCaseLine.value;
};

// 차트 인스턴스 핸들러
const onEpiChartInstance = (instance: any) => {
  epiCurveChartInstance.value = instance;
  (window as any).epidemicCurveChartInstance = instance;
  (window as any).currentEpidemicChartInstance = instance;
};

const onIncubationChartInstance = (instance: any) => {
  incubationChartInstance.value = instance;
};

// 차트 저장/복사/내보내기
const saveEpiChartForReport = () => {
  if (!epiCurveChartInstance.value) {
    console.warn('EpiCurve chart instance not found');
    return;
  }
  
  const dataUrl = epiCurveChartInstance.value.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#fff'
  });
  
  settingsStore.updateEpidemicCurveSettings({
    reportChartDataUrl: dataUrl,
    reportChartWidth: epiChartWidth.value
  });
  
  isEpiChartSaved.value = true;
  showEpiChartSavedTooltip.value = true;
  setTimeout(() => (showEpiChartSavedTooltip.value = false), 1500);
};

const saveIncubationChartForReport = () => {
  if (!incubationChartInstance.value) {
    console.warn('Incubation chart instance not found');
    return;
  }
  
  const dataUrl = incubationChartInstance.value.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#fff'
  });
  
  settingsStore.updateEpidemicCurveSettings({
    reportIncubationChartDataUrl: dataUrl,
    reportIncubationChartWidth: incubationChartWidth.value
  });
  
  isIncubationChartSaved.value = true;
  showIncubationChartSavedTooltip.value = true;
  setTimeout(() => (showIncubationChartSavedTooltip.value = false), 1500);
};

const handleCopyEpiChart = (instance: any) => {
  copyEpiChartToClipboard(instance, epiChartWidth.value);
};

const handleCopyIncubationChart = (instance: any) => {
  copyIncubationChartToClipboard(instance, incubationChartWidth.value);
};

const handleExportEpiChart = (instance: any) => {
  exportEpiChart(instance, epiChartWidth.value, selectedSymptomInterval.value);
};

const handleExportIncubationChart = (instance: any) => {
  exportIncubationChart(instance, incubationChartWidth.value, selectedIncubationInterval.value);
};

import { parseDateTime } from '../DataInputVirtualScroll/utils/dateTimeUtils';

// ... (existing imports)

// ... (existing code)

// 헬퍼: 객체 -> 날짜 문자열
const formatDateObject = (dateObj: any) => {
  if (!dateObj) return '';
  const { year, month, day, hour, minute } = dateObj;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${hour}:${minute}`;
};

// DateTimePicker 핸들러
const showExposureDateTimePicker = (event: Event) => {
  if (!event || !event.target) return;
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  
  // Use robust parsing
  let initialValue = parseDateTime(exposureDateTime.value);
  
  // Fallback to now if parsing failed
  if (!initialValue) {
      const now = new Date();
      initialValue = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        hour: String(now.getHours()).padStart(2, '0'),
        minute: String(now.getMinutes()).padStart(2, '0')
      };
  }

  exposureDateTimePickerState.value = {
    visible: true,
    position: { 
      top: rect.bottom + window.scrollY + 5, 
      left: rect.left + window.scrollX 
    },
    initialValue: initialValue
  };
};

const onExposureDateTimeConfirm = (dateTimeObject: any) => {
  try {
    const formattedDateTime = formatDateObject(dateTimeObject);
    settingsStore.updateExposureDateTime(formattedDateTime);
    console.log('노출시간 설정 완료:', formattedDateTime);
  } catch (error) {
    console.error('노출시간 설정 오류:', error);
  }
  exposureDateTimePickerState.value.visible = false;
};

const onExposureDateTimeCancel = () => {
  exposureDateTimePickerState.value.visible = false;
};

// 라이프사이클
onMounted(() => {
  console.log('EpidemicCurve 컴포넌트 마운트됨');
});

onActivated(() => {
  console.log('EpidemicCurve 탭 활성화됨');
  nextTick(() => {
    if (epiCurveChartRef.value) {
      epiCurveChartRef.value.updateChart?.();
    }
    if (incubationChartRef.value) {
      incubationChartRef.value.updateChart?.();
    }
  });
});
</script>
