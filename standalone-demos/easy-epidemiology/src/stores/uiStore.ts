import { defineStore } from 'pinia';

interface CellFocus {
  rowIndex: number;
  columnIndex: number;
}

interface UiState {
  nextCellToFocus: CellFocus | null;
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    nextCellToFocus: null
  }),

  actions: {
    focusNextCell({ rowIndex, columnIndex }: CellFocus) {
      this.nextCellToFocus = { rowIndex, columnIndex };
    },
    
    clearNextCellFocus() {
      this.nextCellToFocus = null;
    }
  }
});
