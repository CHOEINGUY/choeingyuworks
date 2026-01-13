import { computed } from 'vue';
import { useEpidemicStore } from '@/stores/epidemicStore';
import { useSettingsStore } from '@/stores/settingsStore';
import type { GridRow } from '@/types/grid';

export interface FrequencyCategory {
  count: number;
  patientCount: number;
  totalPercentage?: number;
  patientPercentage?: number;
}

export interface FrequencyData {
  [key: string]: FrequencyCategory;
}

export function usePatientStats() {
  const epidemicStore = useEpidemicStore();
  const settingsStore = useSettingsStore();
  
  const headers = computed(() => epidemicStore.headers || { basic: [] });
  const rows = computed(() => epidemicStore.rows || []);
  const isConfirmedCaseColumnVisible = computed(() => settingsStore.isConfirmedCaseColumnVisible);

  // Filter rows with valid data
  const filteredRows = computed<GridRow[]>(() => {
    const currentRows = rows.value || [];
    return currentRows.filter((row) => {
      if (!row) return false;
      
      const isPatient = String(row.isPatient || '');
      const basicInfo = (row.basicInfo as string[]) || [];
      const clinicalSymptoms = (row.clinicalSymptoms as string[]) || [];
      const symptomOnset = String(row.symptomOnset || '');
      const dietInfo = (row.dietInfo as string[]) || [];

      return (
        isPatient !== '' ||
        basicInfo.some(cell => cell !== '' && cell !== null && cell !== undefined) ||
        clinicalSymptoms.some(cell => cell !== '' && cell !== null && cell !== undefined) ||
        symptomOnset !== '' ||
        dietInfo.some(cell => cell !== '' && cell !== null && cell !== undefined)
      );
    });
  });

  // Total participants
  const totalParticipants = computed<number>(() => filteredRows.value.length);

  // Total patients
  const totalPatients = computed<number>(() => {
    const currentRows = filteredRows.value;
    if (currentRows.length === 0) return 0;
    
    let count = 0;
    for (const row of currentRows) {
      if (row && String(row.isPatient) === '1') {
        count++;
      }
    }
    return count;
  });

  // Attack rate
  const attackRate = computed<string>(() => {
    const participants = totalParticipants.value;
    const patients = totalPatients.value;
    if (participants === 0) return '0.0';
    return ((patients / participants) * 100).toFixed(1);
  });

  // Total confirmed cases
  const totalConfirmedCases = computed<number>(() => {
    const currentRows = filteredRows.value;
    if (currentRows.length === 0) return 0;
    
    let count = 0;
    for (const row of currentRows) {
      if (row && String(row.isConfirmedCase) === '1') {
        count++;
      }
    }
    return count;
  });

  // Confirmed rate
  const confirmedRate = computed<string>(() => {
    const participants = totalParticipants.value;
    const confirmed = totalConfirmedCases.value;
    if (participants === 0) return '0.0';
    return ((confirmed / participants) * 100).toFixed(1);
  });

  // Frequency data
  const frequencyData = computed<FrequencyData[]>(() => {
    if (!headers.value?.basic || !Array.isArray(headers.value.basic)) return [];
    const currentFilteredRows = filteredRows.value;
    const currentTotalParticipants = totalParticipants.value;
    
    return headers.value.basic.map((header, headerIndex) => {
      const categories: FrequencyData = {};
      currentFilteredRows.forEach((row) => {
        const basicInfo = row.basicInfo as string[];
        if (!basicInfo || headerIndex >= basicInfo.length) return;
        
        const value = basicInfo[headerIndex];
        if (value === '' || value === null || value === undefined) return;
        
        const categoryKey = String(value);
        if (!categories[categoryKey]) {
          categories[categoryKey] = { count: 0, patientCount: 0 };
        }
        categories[categoryKey].count++;
        
        if (String(row.isPatient) === '1') {
          categories[categoryKey].patientCount++;
        }
      });
      
      for (const category in categories) {
        const data = categories[category];
        data.totalPercentage = currentTotalParticipants > 0 ? (data.count / currentTotalParticipants) * 100 : 0;
        data.patientPercentage = data.count > 0 ? (data.patientCount / data.count) * 100 : 0;
      }
      
      const sortedCategories: FrequencyData = {};
      Object.keys(categories)
        .sort((a, b) => {
          const numA = Number(a);
          const numB = Number(b);
          if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
          if (!isNaN(numA) && isNaN(numB)) return -1;
          if (isNaN(numA) && !isNaN(numB)) return 1;
          return String(a).localeCompare(String(b), undefined, { numeric: true });
        })
        .forEach((key) => {
          sortedCategories[key] = categories[key];
        });
      return sortedCategories;
    });
  });

  // Get frequency for a specific variable
  const getFrequencyForVariable = (headerIndex: number): FrequencyData => {
    if (!headers.value?.basic || headerIndex < 0 || headerIndex >= headers.value.basic.length) {
      return {};
    }
    
    const currentFilteredRows = filteredRows.value;
    const currentTotalParticipants = totalParticipants.value;
    const categories: FrequencyData = {};
    
    currentFilteredRows.forEach((row) => {
      const basicInfo = row.basicInfo as string[];
      if (!basicInfo || headerIndex >= basicInfo.length) return;
      
      const value = basicInfo[headerIndex];
      if (value === '' || value === null || value === undefined) return;
      
      const categoryKey = String(value);
      if (!categories[categoryKey]) {
        categories[categoryKey] = { count: 0, patientCount: 0 };
      }
      categories[categoryKey].count++;
      
      if (String(row.isPatient) === '1') {
        categories[categoryKey].patientCount++;
      }
    });
    
    for (const category in categories) {
      const data = categories[category];
      data.totalPercentage = currentTotalParticipants > 0 ? (data.count / currentTotalParticipants) * 100 : 0;
      data.patientPercentage = data.count > 0 ? (data.patientCount / data.count) * 100 : 0;
    }
    
    const sortedCategories: FrequencyData = {};
    Object.keys(categories)
      .sort((a, b) => {
        const numA = Number(a);
        const numB = Number(b);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        if (!isNaN(numA) && isNaN(numB)) return -1;
        if (isNaN(numA) && !isNaN(numB)) return 1;
        return String(a).localeCompare(String(b), undefined, { numeric: true });
      })
      .forEach((key) => {
        sortedCategories[key] = categories[key];
      });
    
    return sortedCategories;
  };

  return {
    headers,
    rows,
    isConfirmedCaseColumnVisible,
    filteredRows,
    totalParticipants,
    totalPatients,
    attackRate,
    totalConfirmedCases,
    confirmedRate,
    frequencyData,
    getFrequencyForVariable
  };
}
