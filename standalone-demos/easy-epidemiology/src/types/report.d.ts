import { ComputedRef, Ref } from 'vue';
export { AnalysisResultItem, AnalysisResults } from './analysis';

export type StudyDesign = 'case-control' | 'cohort' | null;

// AnalysisResultItem imported from analysis.d.ts


export interface SymptomStat {
  symptom: string;
  count: number;
  percentage: string;
}

export interface StatAnalysisText {
  base: string;
  method: string;
}

export interface ReportData {
  // State
  studyDesign: Ref<StudyDesign>;
  showAnalysisModal: Ref<boolean>;
  analysisModalMessage: Ref<string>;
  pendingStudyDesign: Ref<string>;
  analysisStatus: ComputedRef<string>;

  // Computed Data
  caseAttackRate: ComputedRef<string | number | null>;
  patientAttackRate: ComputedRef<string | number | null>;
  exposureDate: ComputedRef<string | null>;
  firstCaseDate: ComputedRef<string | null>;
  meanIncubation: ComputedRef<string | null>;
  suspectedSource: ComputedRef<string>;
  foodIntakeAnalysis: ComputedRef<string>;
  hasEpidemicChart: ComputedRef<string | null | undefined>;
  hasIncubationChart: ComputedRef<string | null | undefined>;
  hasMainSymptomsTable: ComputedRef<boolean>;
  foodItemCount: ComputedRef<number>;
  hasTooManyFoodItems: ComputedRef<boolean>;
  renderedHtml: ComputedRef<string>;

  // Actions
  handleStudyDesignChange: (newDesign: StudyDesign) => void;
  closeAnalysisModal: () => void;
  downloadHwpxReport: () => Promise<void>;
  
  // Data Exports
  getDesignResults: () => AnalysisResultItem[];
  getSymptomStats: () => SymptomStat[] | null;
  parseSuspectedFoods: () => string[];
  generateFoodIntakeText: () => string;
  generateIncubationExposureText: () => string;
  buildStatAnalysisText: () => StatAnalysisText;
  generateMainSymptomsTable: () => string; // HTML string
  generateCaseControlTableData: () => Record<string, string>;
  generateCohortTableData: () => Record<string, string>;

  // Raw Values
  confirmedCount: ComputedRef<number | null>;
  confirmedAttackRate: ComputedRef<string | null>;
  firstCaseDateTime: ComputedRef<string | null>;
  lastCaseDateTime: ComputedRef<string | null>;
  symptomList: ComputedRef<string | null>;
  patientCount: ComputedRef<number>;
  totalParticipants: ComputedRef<number>;
}
