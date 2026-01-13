import { GridHeader, GridRow, CellUpdatePayload } from './grid';

export interface IGridService {
  // State Accessors
  headers: GridHeader[];
  rows: GridRow[];
  canUndo: boolean;
  canRedo: boolean;

  // Actions
  initialize(): void;
  setGridData(headers: GridHeader[], rows: GridRow[]): Promise<void>;
  
  // Row Operations
  addRows(count: number): Promise<void>;
  deleteRow(rowIndex: number): Promise<void>;
  deleteMultipleRows(rowIndices: number[]): Promise<void>;
  insertRowAt(payload: { index: number; count: number }): Promise<void>;
  
  // Column Operations
  addColumn(type?: string): Promise<void>;
  deleteColumn(colIndex: number): Promise<void>;
  // ... add other column ops ...

  // Cell Operations
  updateCell(payload: CellUpdatePayload): Promise<void>;
  saveCellValue(rowIndex: number, colIndex: number, value: any, columnMeta: any): boolean;
  
  // History
  undo(): void;
  redo(): void;
  
  // Persistence
  saveCurrentState(): Promise<void>;
}
