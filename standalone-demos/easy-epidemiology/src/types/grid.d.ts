export type ColumnType = 'basic' | 'clinical' | 'diet' | 'exposure' | 'symptom' | 'analysis' | 'hidden' | 'serial' | 'isPatient' | 'isConfirmedCase' | 'clinicalSymptoms' | 'individualExposureTime' | 'symptomOnset' | 'dietInfo' | 'patientId' | 'patientName';

export interface GridHeader {
  text: string;
  value: string;
  type: ColumnType;
  width?: number;
  sortable?: boolean;
  isEditable?: boolean;
  colIndex?: number;
  cellIndex?: number; // Legacy index support
  dataKey?: string; // e.g. '0-3'
  headerText?: string; // Display text for header (used in exports)
  headerRow?: number; // 1 or 2 for multi-row headers
  style?: Record<string, string | number>;
  offsetLeft?: number; // Calculated offset for scrolling
  isCustom?: boolean; // Custom column flag
  hidden?: boolean;
  tooltip?: string; // Header tooltip text
  meta?: Record<string, any>; // Meta data for specific column logic
}

export interface GridRow {
  id?: string | number;
  _rowKey?: string;
  [key: string]: any; // Index signature for dynamic cell data access
}

export interface CellUpdatePayload {
  rowIndex: number;
  key: string; // Column dataKey
  value: any;
  cellIndex?: number;
  originalValue?: any;
}
