// Common Analysis Interface
export interface AnalysisResultBase {
  item: string; // Factor name (e.g. "Kimchi")
  food?: string; // Alias for item
  pValue: number | null;
  adj_chi?: number | null; // Adjusted Chi-Square
  hasCorrection?: boolean; // Added for Yates or Haldane correction
}

// Unified Result Item for both Report and Settings
export interface AnalysisResultItem extends Partial<AnalysisResultBase> {
  item: string;
  pValue: number | null;
  oddsRatio?: number | string;
  relativeRisk?: number | string;
  ci_lower?: number | string;
  ci_upper?: number | string;
  rr_ci_lower?: number | string;
  rr_ci_upper?: number | string;
  b_obs?: number | string;
  c_obs?: number | string;
  e_obs?: number | string;
  f_obs?: number | string;
  a_obs?: number | string;
  rowTotal_Case?: number | string;
  rowTotal_Control?: number | string;
  rowTotal_Exposed?: number | string;
  rowTotal_Unexposed?: number | string;
  incidence_exposed_formatted?: string;
  incidence_unexposed_formatted?: string;
  exposed?: { sick: number; well: number };
  unexposed?: { sick: number; well: number };
  chiSquare?: number | null;
  riskRatio?: number | string; // Alias for relativeRisk
  confidenceInterval?: [number, number] | string;
  [key: string]: any;
}

export interface AnalysisResults {
  caseControl?: AnalysisResultItem[];
  cohort?: AnalysisResultItem[];
}

// Cohort Study Results
export interface CohortResult extends AnalysisResultBase {
  rowTotal_Exposed?: number | string;
  a_obs?: number | string; // Exposed Cases
  incidence_exposed_formatted?: string;
  
  rowTotal_Unexposed?: number | string;
  c_obs?: number | string; // Unexposed Cases
  incidence_unexposed_formatted?: string;
  
  relativeRisk?: string | number;
  rr_ci_lower?: string | number;
  rr_ci_upper?: string | number;
}

// Case-Control Study Results
export interface CaseControlResult extends AnalysisResultBase {
  b_obs?: number | string; // Case Exposed
  c_obs?: number | string; // Case Unexposed
  rowTotal_Case?: number | string;
  
  e_obs?: number | string; // Control Exposed
  f_obs?: number | string; // Control Unexposed
  rowTotal_Control?: number | string;
  
  oddsRatio?: string | number;
  ci_lower?: string | number;
  ci_upper?: string | number;
}

// Case Series Results
export interface CaseSeriesResult {
  item: string;
  exposedCases: number;
  unexposedCases: number;
  totalCases: number;
  incidence_formatted: string;
}
