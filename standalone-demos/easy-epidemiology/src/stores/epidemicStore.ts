import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useSettingsStore } from './settingsStore';
import { useValidationLogic, ValidationState } from './modules/validationLogic';
import { useDataLogic, EpidemicHeaders } from './modules/dataLogic';
import type { GridRow } from '@/types/grid';

export { EpidemicHeaders, ValidationState };

// ----------------------------------------------------------------------
// Store Definition
// ----------------------------------------------------------------------

export const useEpidemicStore = defineStore('epidemic', () => {
  // --- Composition Modules ---
  const {
      headers,
      rows,
      deletedRowIndex,
      createInitialState,
      ...dataActions
  } = useDataLogic();

  const {
    validationState,
    ...validationActions
  } = useValidationLogic();

  // --- Getters (Re-implemented here as they depend on other stores) ---
  const basicInfoStartIndex = computed(() => {
    const settingsStore = useSettingsStore();
    return settingsStore.isConfirmedCaseColumnVisible ? 3 : 2;
  });
  
  const clinicalSymptomsStartIndex = computed(() => {
    return basicInfoStartIndex.value + (headers.value.basic?.length || 0);
  });
  
  const individualExposureTimeStartIndex = computed(() => {
    const settingsStore = useSettingsStore();
    return (settingsStore as any).isIndividualExposureColumnVisible
      ? clinicalSymptomsStartIndex.value + (headers.value.clinical?.length || 0)
      : -1;
  });
  
  const symptomOnsetStartIndex = computed(() => {
    const settingsStore = useSettingsStore();
    const isVisible = (settingsStore as any).isIndividualExposureColumnVisible;
    return clinicalSymptomsStartIndex.value +
      (headers.value.clinical?.length || 0) +
      (isVisible ? 1 : 0);
  });
  
  const dietInfoStartIndex = computed(() => symptomOnsetStartIndex.value + 1);

  // Statistics Getters
  const getCaseAttackRate = computed((): string | null => {
    const total = rows.value.length;
    if (!total) return null;
    const cases = rows.value.filter(r => r && String(r.isPatient) === '1').length;
    return ((cases / total) * 100).toFixed(1);
  });

  const getPatientAttackRate = computed((): string | null => {
    const settingsStore = useSettingsStore();
    if (!(settingsStore as any).isConfirmedCaseColumnVisible) return null;
    const total = rows.value.length;
    if (!total) return null;
    const confirmed = rows.value.filter(r => r && String(r.isConfirmedCase) === '1').length;
    return ((confirmed / total) * 100).toFixed(1);
  });

  const getFirstCaseDate = computed((): Date | null => {
    const onsets = rows.value
      .map(r => r.symptomOnset as string)
      .filter(Boolean)
      .map(ts => new Date(ts));
    if (!onsets.length) return null;
    return new Date(Math.min(...onsets.map(d => d.getTime())));
  });

  const getMeanIncubation = computed((): string | null => {
    const settingsStore = useSettingsStore();
    const exposureKey = (settingsStore as any).exposureDateTime || '';
    const exposure = new Date(exposureKey);
    
    if (!exposureKey || isNaN(exposure.getTime())) return null;
    
    const diffs = rows.value
      .map(r => r.symptomOnset as string)
      .filter(Boolean)
      .map(ts => (new Date(ts).getTime() - exposure.getTime()) / 3600000)
      .filter(h => h > 0);
      
    if (!diffs.length) return null;
    const avg = diffs.reduce((a,b) => a+b,0) / diffs.length;
    return avg.toFixed(1);
  });

  // --- Complex Actions (Depending on multiple pieces) ---

  function handleEnter({ rowIndex, key, cellIndex }: { rowIndex: number; key: string; cellIndex: number }) {
    const getColumnIndex = (k: string, cIdx: number) => {
      switch (k) {
      case 'isPatient': return 1;
      case 'basicInfo': return basicInfoStartIndex.value + cIdx;
      case 'clinicalSymptoms': return clinicalSymptomsStartIndex.value + cIdx;
      case 'symptomOnset': return symptomOnsetStartIndex.value;
      case 'individualExposureTime': return individualExposureTimeStartIndex.value;
      case 'dietInfo': return dietInfoStartIndex.value + cIdx;
      default: return -1;
      }
    };
    
    const currentColumnIndex = getColumnIndex(key, cellIndex);
    if (currentColumnIndex === -1) return;
    
    const nextRowIndex = rowIndex + 1;
    
    if (nextRowIndex >= rows.value.length) {
      dataActions.addRows(1);
    }
    
    return { rowIndex: nextRowIndex, columnIndex: currentColumnIndex };
  }

  function resetSheet() {
    // 1. Reset Data
    const initialState = createInitialState();
    headers.value = initialState.headers;
    rows.value = initialState.rows;
    
    // 2. Reset Validation
    validationActions.clearValidationErrors();

    // 3. Reset Settings & Analysis
    const settingsStore = useSettingsStore();
    const settings = settingsStore as any; 
    
    if (settings.setAnalysisResults) {
        settings.setAnalysisResults({ type: 'caseControl', results: [] });
        settings.setAnalysisResults({ type: 'cohort', results: [] });
    }
    
    if (settings.setSelectedSuspectedFoods) settings.setSelectedSuspectedFoods('');
    if (settings.setSuspectedSource) settings.setSuspectedSource('');
  }

  return {
    // State
    headers,
    rows,
    deletedRowIndex,
    validationState,
    
    // Getters
    basicInfoStartIndex,
    clinicalSymptomsStartIndex,
    individualExposureTimeStartIndex,
    symptomOnsetStartIndex,
    dietInfoStartIndex,
    getCaseAttackRate,
    getPatientAttackRate,
    getFirstCaseDate,
    getMeanIncubation,
    
    // Actions
    ...dataActions,
    ...validationActions,
    handleEnter,
    resetSheet
  };
});
