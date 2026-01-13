import { reactive, readonly } from 'vue';

export interface ContextMenuItem {
  label: string;
  action: () => void;
  disabled?: boolean;
  divided?: boolean;
  icon?: string;
}

export interface TargetInfo {
  rowIndex: number | null;
  colIndex: number | null;
  type: 'header' | 'cell' | 'row' | 'selection' | null;
}

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
  target: TargetInfo | null;
}

const state = reactive<ContextMenuState>({
  visible: false,
  x: 0,
  y: 0,
  items: [],
  target: null
});

export function useContextMenu() {
  /**
   * 메뉴를 보여줍니다.
   * @param {number} x - x 좌표
   * @param {number} y - y 좌표
   * @param {ContextMenuItem[]} items - 메뉴 항목 배열
   * @param {TargetInfo} targetInfo - 우클릭된 대상 정보
   */
  const showContextMenu = (x: number, y: number, items: ContextMenuItem[], targetInfo: TargetInfo): void => {
    state.visible = true;
    state.x = x;
    state.y = y;
    state.items = items;
    state.target = targetInfo;
  };

  /**
   * 메뉴를 숨킵니다.
   */
  const hideContextMenu = (): void => {
    state.visible = false;
    state.items = [];
    state.target = null;
  };

  return {
    contextMenuState: readonly(state),
    showContextMenu,
    hideContextMenu
  };
}
