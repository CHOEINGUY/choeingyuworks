import { Ref, ComputedRef } from 'vue';

export interface SettingsStoreState {
  selectedSymptomInterval: Ref<number>;
  exposureDateTime: Ref<string>;
  selectedIncubationInterval: Ref<number>;
  isIndividualExposureColumnVisible: Ref<boolean>;
  isConfirmedCaseColumnVisible: Ref<boolean>;
  analysisOptions: Ref<{
    statMethod: string;
    haldaneCorrection: boolean;
  }>;
  yatesCorrectionSettings: Ref<{
    caseControl: boolean;
    cohort: boolean;
  }>;
  selectedSuspectedFoods: Ref<string>;
  epidemicCurveSettings: Ref<any>;
}

export interface SettingsStoreGetters {
  hasExposureDateTime: ComputedRef<boolean>;
  hasIndividualExposure: ComputedRef<boolean>;
}

export interface SettingsStoreActions {
  setSelectedSymptomInterval: (interval: number) => void;
  setExposureDateTime: (dateTime: string) => void;
  saveExposureDateTimeToStorage: () => void;
  setSelectedIncubationInterval: (interval: number) => void;
  setIndividualExposureColumnVisibility: (visible: boolean) => void;
  setConfirmedCaseColumnVisibility: (visible: boolean) => void;
  setAnalysisOptions: (options: { statMethod?: string; haldaneCorrection?: boolean }) => void;
  setYatesCorrection: (tableType: 'caseControl' | 'cohort', enabled: boolean) => void;
  getYatesCorrection: (tableType: 'caseControl' | 'cohort') => boolean;
  setSelectedSuspectedFoods: (foods: string) => void;
  setEpidemicCurveSettings: (settings: any) => void;
}

export type SettingsStore = SettingsStoreState & SettingsStoreGetters & SettingsStoreActions;

export declare function useSettingsStore(): SettingsStore;
