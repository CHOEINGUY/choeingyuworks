
import { Ref } from "vue";
import { GridHeader, GridRow } from "./grid";
import type { ValidationManager } from "@/validation/ValidationManager";
import type { VirtualSelectionSystem } from "@/components/DataInputVirtualScroll/logic/virtualSelectionSystem";
import type { EnhancedStorageManager } from "@/store/enhancedStorageManager";
import type { useGridStore } from "@/stores/gridStore";
import type { useEpidemicStore } from "@/stores/epidemicStore";

export interface DateInfo {
  year: number;
  month: number;
  day: number;
  hour?: string | number;
  minute?: string | number;
  rowIndex?: number;
  colIndex?: number;
}

export interface DateTimePickerState {
  visible: boolean;
  position: { top: number; left: number };
  initialValue: DateInfo | null;
  cell?: { rowIndex: number; colIndex: number; dataKey?: string; cellIndex?: number | null } | null;
  currentEdit: {
    rowIndex: number;
    colIndex: number;
    columnMeta: GridHeader;
  } | null;
}

export interface OverlayController {
  open: (rowIndex: number, colIndex: number, target: HTMLElement, initialValue?: string) => void;
  close: () => void;
  confirm: (value?: string) => void;
  isVisible: () => boolean;
  append: (text: string) => void;
}

export interface GridContext {
  getOriginalIndex: (virtualIndex: number) => number;
  allColumnsMeta: GridHeader[];
  selectionSystem: VirtualSelectionSystem;
  rows: Ref<GridRow[]>;
  filteredRows: Ref<GridRow[]>;
  getCellValue: (row: GridRow | null, col: GridHeader | undefined, rowIndex: number) => any;
  
  gridStore: ReturnType<typeof useGridStore>;
  epidemicStore: ReturnType<typeof useEpidemicStore>;
  storageManager: EnhancedStorageManager;
  
  validationManager?: ValidationManager;
  
  dateTimePickerRef?: Ref<any>;
  dateTimePickerState?: DateTimePickerState;
  
  overlayController?: OverlayController;

  ensureCellIsVisible?: (rowIndex: number, colIndex: number) => Promise<void>;
  focusGrid: () => void;
  gridBodyContainer?: HTMLElement | null;
  
  isEditing: boolean;
  startEditing: VirtualSelectionSystem['startEditing'];
  stopEditing: VirtualSelectionSystem['stopEditing'];
  t: (key: string, params?: any) => string;
}

export interface GridContextMenuContext extends GridContext {
  showContextMenu: (x: number, y: number, items: any[], targetInfo: any) => void;
  contextMenuState: any;
}
