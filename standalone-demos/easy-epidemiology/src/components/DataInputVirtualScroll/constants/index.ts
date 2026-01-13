export const DEFAULT_COLUMN_WIDTH = 80;
export const DEFAULT_ROWS_TO_ADD = 10;

// Column index constants
export const COL_IDX_SERIAL = 0;
export const COL_IDX_IS_PATIENT = 1;
export const COL_IDX_CONFIRMED_CASE = 2;

// Column type constants
export const COL_TYPE_SERIAL = 'serial';
export const COL_TYPE_IS_PATIENT = 'isPatient';
export const COL_TYPE_CONFIRMED_CASE = 'isConfirmedCase';
export const COL_TYPE_BASIC = 'basic';
export const COL_TYPE_CLINICAL = 'clinical';
export const COL_TYPE_ONSET = 'symptomOnset';
export const COL_TYPE_DIET = 'diet';
export const COL_TYPE_INDIVIDUAL_EXPOSURE = 'individualExposureTime';

// Scroll-related constants (may be reused by selection/drag systems)
export const SCROLL_EDGE_BUFFER = 40;
export const SCROLL_AMOUNT = 15;
export const PIN_OFFSET = 10;

// Column default styles (can be imported by header/body renderers)
export interface ColumnStyle {
    width: string;
    [key: string]: string | number;
}

export const COLUMN_STYLES: Record<string, ColumnStyle> = {
    [COL_TYPE_SERIAL]: { width: '50px' },
    [COL_TYPE_IS_PATIENT]: { width: '143px' },
    [COL_TYPE_CONFIRMED_CASE]: { width: '143px' },
    [COL_TYPE_ONSET]: { width: '150px' },
    default: { width: `${DEFAULT_COLUMN_WIDTH}px` }
};
