import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AnalysisResultItem, AnalysisResults } from '@/types/analysis';

// --- Type Definitions ---
export interface AnalysisOptions {
  statMethod: 'chi-square' | 'fisher' | string;
  haldaneCorrection: boolean;
}

export interface YatesCorrectionSettings {
  caseControl: boolean;
  cohort: boolean;
}

export interface EpidemicCurveSettings {
  timeInterval: number;
  chartWidth: number;
  chartHeight: number;
  fontSize: number;
  barColor: string;
  showGrid: boolean;
  showLegend: boolean;
  backgroundColor: string;
  displayMode: 'time' | 'date' | string;
  reportChartDataUrl: string | null;
  reportChartWidth?: number;
  reportIncubationChartDataUrl: string | null;
  reportIncubationChartWidth?: number;
  incubationFontSize: number;
  incubationChartWidth: number;
  incubationBarColor: string;
  incubationDisplayMode: 'hour' | 'day' | string;
}



export const useSettingsStore = defineStore('settings', () => {
  // --- State ---
  const selectedSymptomInterval = ref<number>(6);
  
  const exposureDateTime = ref<string>((() => {
    try {
      return localStorage.getItem('exposureDateTime') || '';
    } catch (error) {
      console.warn('Failed to load exposureDateTime from localStorage:', error);
      return '';
    }
  })());

  const selectedIncubationInterval = ref<number>(6);
  
  const isIndividualExposureColumnVisible = ref<boolean>(false);
  const isConfirmedCaseColumnVisible = ref<boolean>(false);

  const analysisOptions = ref<AnalysisOptions>({
    statMethod: 'chi-square',
    haldaneCorrection: false
  });

  const yatesCorrectionSettings = ref<YatesCorrectionSettings>((() => {
    try {
      const saved = localStorage.getItem('yatesCorrectionSettings');
      if (saved) return JSON.parse(saved) as YatesCorrectionSettings;
    } catch (error) {
      console.warn('Failed to load yatesCorrectionSettings from localStorage:', error);
    }
    return { caseControl: false, cohort: false };
  })());

  const selectedSuspectedFoods = ref<string>('');

  const epidemicCurveSettings = ref<EpidemicCurveSettings>((() => {
    const defaultSettings: EpidemicCurveSettings = {
      timeInterval: 6, chartWidth: 900, chartHeight: 550, fontSize: 14,
      barColor: '#5470c6', showGrid: true, showLegend: true, backgroundColor: '#ffffff',
      displayMode: 'time', reportChartDataUrl: null, reportIncubationChartDataUrl: null,
      incubationFontSize: 15, incubationChartWidth: 1100, incubationBarColor: '#91cc75',
      incubationDisplayMode: 'hour'
    };
    try {
      const saved = localStorage.getItem('epidemicCurveSettings');
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<EpidemicCurveSettings>;
        return { ...defaultSettings, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load epidemicCurveSettings from localStorage:', error);
    }
    return defaultSettings;
  })());

  const suspectedSource = ref<string>('');

  const analysisResults = ref<AnalysisResults>({ caseControl: [], cohort: [] });

  // --- Getters ---
  const getSelectedSymptomInterval = computed(() => selectedSymptomInterval.value);
  const getExposureDateTime = computed(() => exposureDateTime.value);
  const getExposureDate = computed(() => exposureDateTime.value || null);
  const getSelectedIncubationInterval = computed(() => selectedIncubationInterval.value);
  const getAnalysisOptions = computed(() => analysisOptions.value);
  const getEpidemicCurveSettings = computed(() => epidemicCurveSettings.value);
  const getAnalysisResults = computed(() => analysisResults.value);
  const getSelectedSuspectedFoods = computed(() => selectedSuspectedFoods.value);
  const getYatesCorrectionSettings = computed(() => yatesCorrectionSettings.value);
  const getSuspectedSource = computed(() => suspectedSource.value || null);

  // --- Actions ---
  function updateSymptomInterval(value: number | string): void {
    selectedSymptomInterval.value = Number(value);
  }

  function updateExposureDateTime(value: string): void {
    exposureDateTime.value = value;
    try {
      localStorage.setItem('exposureDateTime', value);
    } catch (error) {
      console.warn('Failed to save exposureDateTime to localStorage:', error);
    }
  }

  function updateIncubationInterval(value: number): void {
    selectedIncubationInterval.value = value;
  }

  function setSuspectedSource(value: string): void {
    suspectedSource.value = value;
  }

  function setIndividualExposureColumnVisibility(isVisible: boolean): void {
    isIndividualExposureColumnVisible.value = !!isVisible;
  }

  function setConfirmedCaseColumnVisibility(isVisible: boolean): void {
    isConfirmedCaseColumnVisible.value = !!isVisible;
  }

  function toggleIndividualExposureColumn(): void {
    isIndividualExposureColumnVisible.value = !isIndividualExposureColumnVisible.value;
  }

  function toggleConfirmedCaseColumn(): void {
    isConfirmedCaseColumnVisible.value = !isConfirmedCaseColumnVisible.value;
  }

  function setAnalysisOptions({ statMethod, haldaneCorrection }: Partial<AnalysisOptions>): void {
    analysisOptions.value.statMethod = statMethod || 'chi-square';
    analysisOptions.value.haldaneCorrection = !!haldaneCorrection;
  }

  function updateEpidemicCurveSettings(settings: Partial<EpidemicCurveSettings>): void {
    epidemicCurveSettings.value = { ...epidemicCurveSettings.value, ...settings };
    try {
      localStorage.setItem('epidemicCurveSettings', JSON.stringify(epidemicCurveSettings.value));
    } catch (error) {
      console.warn('Failed to save epidemicCurveSettings to localStorage:', error);
    }
  }

  function setAnalysisResults({ type, results }: { type: 'caseControl' | 'cohort'; results: AnalysisResultItem[] }): void {
    if (type === 'caseControl' || type === 'cohort') {
      analysisResults.value[type] = results;
    }
  }

  function setSelectedSuspectedFoods(foodsStr: string): void {
    selectedSuspectedFoods.value = foodsStr;
  }

  function setYatesCorrectionSettings({ type, enabled }: { type: 'caseControl' | 'cohort'; enabled: boolean }): void {
    yatesCorrectionSettings.value[type] = enabled;
    try {
      localStorage.setItem('yatesCorrectionSettings', JSON.stringify(yatesCorrectionSettings.value));
    } catch (error) {
      console.warn('Failed to save yatesCorrectionSettings to localStorage:', error);
    }
  }

  return {
    // State
    selectedSymptomInterval,
    exposureDateTime,
    selectedIncubationInterval,
    isIndividualExposureColumnVisible,
    isConfirmedCaseColumnVisible,
    analysisOptions,
    yatesCorrectionSettings,
    selectedSuspectedFoods,
    epidemicCurveSettings,
    suspectedSource,
    analysisResults,

    // Getters
    getSelectedSymptomInterval,
    getExposureDateTime,
    getExposureDate,
    getSelectedIncubationInterval,
    getAnalysisOptions,
    getEpidemicCurveSettings,
    getAnalysisResults,
    getSelectedSuspectedFoods,
    getYatesCorrectionSettings,
    getSuspectedSource,

    // Actions
    updateSymptomInterval,
    updateExposureDateTime,
    updateIncubationInterval,
    setSuspectedSource,
    setIndividualExposureColumnVisibility,
    setConfirmedCaseColumnVisibility,
    toggleIndividualExposureColumn,
    toggleConfirmedCaseColumn,
    setAnalysisOptions,
    updateEpidemicCurveSettings,
    setAnalysisResults,
    setSelectedSuspectedFoods,
    setYatesCorrectionSettings
  };
});
