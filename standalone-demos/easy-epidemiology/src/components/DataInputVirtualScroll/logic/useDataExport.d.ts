
export function useDataExport(): {
  downloadXLSX: (worksheetData: any[][], merges?: any[], fileName?: string) => void;
  downloadXLSXSmart: (
    allColumnsMeta: any[],
    rows: any[],
    getCellValue: (row: any, col: any, rowIndex: number) => any,
    hasIndividualExposure?: boolean,
    hasConfirmedCase?: boolean,
    fileName?: string
  ) => void;
  downloadTemplate: (type?: 'basic' | 'individual') => void;
  generateStandardHeaders: (allColumnsMeta: any[], hasIndividualExposure?: boolean, hasConfirmedCase?: boolean) => { headerRow1: string[]; headerRow2: string[] };
  generateMerges: (headerRow1: string[], headerRow2: string[], allColumnsMeta: any[], hasIndividualExposure?: boolean, hasConfirmedCase?: boolean) => any[];
  reorderColumnsForExport: (allColumnsMeta: any[], hasIndividualExposure?: boolean, hasConfirmedCase?: boolean) => any[];
  ensureDateTimeFormat: (value: any) => string;
  formatCellValue: (value: any, columnMeta: any) => string;
};
