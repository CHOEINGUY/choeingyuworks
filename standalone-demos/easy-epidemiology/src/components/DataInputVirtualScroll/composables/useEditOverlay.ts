/**
 * useEditOverlay - 셀 편집 오버레이 관리 composable
 * contenteditable 대신 floating input을 사용하여 양옆 셀과의 텍스트 겹침 문제 해결
 */
import { reactive, ref, nextTick, type Ref, type ComputedRef } from 'vue';
import { useGridStore } from '@/stores/gridStore';
import { findNextNavigableCell } from '../handlers/keyboardNavigation';

export interface EditOverlayState {
  visible: boolean;
  position: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  value: string;
  rowIndex: number;
  colIndex: number;
  columnMeta: any | null;
  originalValue: string;
  selectOnFocus: boolean;
}

export interface UseEditOverlayOptions {
  selectionSystem: any;
  allColumnsMeta: ComputedRef<any[]>;
  rows: ComputedRef<any[]>;
  getCellValue: (row: any, columnMeta: any, rowIndex: number) => any;
  storageManager: any;
  validationManager: any;
  focusGrid: () => void;
  ensureCellIsVisible?: (rowIndex: number, colIndex: number) => Promise<void>;
  gridBodyRef: Ref<any>;
  gridHeaderRef: Ref<any>;
}

export function useEditOverlay(options: UseEditOverlayOptions) {
  const {
    selectionSystem,
    allColumnsMeta,
    rows,
    getCellValue,
    storageManager,
    validationManager,
    focusGrid,
    ensureCellIsVisible,
    gridBodyRef,
    gridHeaderRef
  } = options;

  const gridStore = useGridStore();

  const editOverlayState = reactive<EditOverlayState>({
    visible: false,
    position: { top: 0, left: 0, width: 100, height: 35 },
    value: '',
    rowIndex: -1,
    colIndex: -1,
    columnMeta: null,
    originalValue: '',
    selectOnFocus: true
  });

  const editOverlayRef = ref<any>(null);

  /**
   * 셀 편집 시작 - 오버레이 표시
   */
  async function startEditOverlay(
    rowIndex: number,
    colIndex: number,
    cellElement: HTMLElement,
    initialValue?: string, // 문자열 값 (초기값)
    shouldSelectAll: boolean = true
  ) {
    const columnMeta = allColumnsMeta.value.find(col => col.colIndex === colIndex);
    if (!columnMeta) {
      return;
    }
    
    // 이미 전달받은 초기값이 있다면 그것을 최우선으로 사용 (예: 헤더 텍스트 또는 Quick Edit 입력)
    if (initialValue !== undefined) {
      editOverlayState.visible = true;
      editOverlayState.rowIndex = rowIndex;
      editOverlayState.colIndex = colIndex;
      editOverlayState.columnMeta = columnMeta;
      editOverlayState.value = initialValue;
      
      // [수정] originalValue는 초기 입력값(initialValue)이 아니라 '원래 셀의 값'이어야 합니다.
      // 그래야 '1' 입력 시 기존값('')과 달라서(hasChanged=true) 저장이 수행됩니다.
      let row = null;
      if (rowIndex >= 0 && rowIndex < rows.value.length) {
         row = rows.value[rowIndex];
      }
      const existingValue = getCellValue(row, columnMeta, rowIndex);
      editOverlayState.originalValue = String(existingValue || '');
      
      const rect = cellElement.getBoundingClientRect();
      editOverlayState.position = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      };
      
      editOverlayState.selectOnFocus = shouldSelectAll;
      
      // [필수] 그리드 편집 모드 상태 동기화 (Tab/Enter 저장 처리를 위해 필수)
      selectionSystem.selectCell(rowIndex, colIndex);
      selectionSystem.startEditing(rowIndex, colIndex, getCellValue, row, gridStore, allColumnsMeta.value);

      // tempValue 즉시 업데이트
      gridStore.updateTempValue(initialValue);

      nextTick(() => {
        if (editOverlayRef.value && editOverlayRef.value.inputRef) {
          editOverlayRef.value.inputRef.focus();
        }
      });
      return;
    }
    
    if (!columnMeta.isEditable) {
      return;
    }

    // 현재 셀 값 가져오기
    let currentValue = '';
    let row = null;
    
    if (rowIndex < 0) {
      // 헤더 셀 - dataKey(변수명)가 아니라 화면에 보이는 headerText를 표시해야 함
      currentValue = columnMeta.headerText || columnMeta.dataKey || '';
      // 만약 headerText에 HTML 태그가 있다면 제거하거나 처리 필요(선택사항)
      currentValue = currentValue.replace(/<br\s*\/?>/gi, ' ');
      
      row = null;
    } else {
      // 본문 셀
      row = rows.value[rowIndex];
      if (row) {
        currentValue = getCellValue(row, columnMeta, rowIndex);
      }
    }

    // 셀 위치 계산
    const rect = cellElement.getBoundingClientRect();
    
    editOverlayState.position = {
      top: rect.top,
      left: rect.left,
      width: rect.width, // 셀과 동일한 너비 (자동 확장은 CSS에서 처리)
      height: rect.height
    };
    
    // 초기 키 처리는 함수 상단에서 완료했으므로, 여기서는 무조건 셀의 현재 값을 사용
    editOverlayState.value = String(currentValue || '');
    editOverlayState.originalValue = String(currentValue || '');
    
    editOverlayState.rowIndex = rowIndex;
    editOverlayState.colIndex = colIndex;
    editOverlayState.columnMeta = columnMeta;
    editOverlayState.selectOnFocus = shouldSelectAll;
    editOverlayState.visible = true;

    // selectionSystem의 편집 상태도 업데이트
    selectionSystem.selectCell(rowIndex, colIndex);
    selectionSystem.startEditing(rowIndex, colIndex, getCellValue, row, gridStore, allColumnsMeta.value);

    // tempValue 업데이트
    gridStore.updateTempValue(editOverlayState.value);
  }

  /**
   * 셀 편집 시작 - 초기 키 입력과 함께 (단일 클릭 후 타이핑용)
   */
  async function startEditOverlayWithKey(
    rowIndex: number,
    colIndex: number,
    cellElement: HTMLElement,
    initialKey?: string
  ) {
    // 타이핑으로 시작할 때는 전체 선택 하지 않음 (커서 맨 뒤로)
    await startEditOverlay(rowIndex, colIndex, cellElement, initialKey, false);
  }

  /**
   * 편집 완료 - 값 저장
   * 저장할 값은 오직 editOverlayState.value에서 가져옵니다.
   * 인자가 전달되더라도 무시합니다. (Vue Event Handler 호환성)
   */
  function confirmEdit(_?: any) {
    if (!editOverlayState.visible) return;

    // 저장 책임 일원화: 오버레이 blur 이벤트가 제거되었으므로 
    // DataInputVirtual의 외부 클릭 감지나 Enter 키 핸들러 등에서만 호출됩니다.
    // 따라서 Race Condition 걱정 없이 state 값을 저장하면 됩니다.
    const value = editOverlayState.value;

    const { rowIndex, colIndex, columnMeta, originalValue } = editOverlayState;
    
    // 값이 변경되었는지 확인
    const hasChanged = value !== originalValue;
    
    if (hasChanged && columnMeta) {
      // gridStore에 저장
      gridStore.updateTempValue(value);
      
      // 저장 실행
      const editData = {
        cell: { 
          rowIndex, 
          colIndex, 
          dataKey: columnMeta.dataKey || '', 
          cellIndex: columnMeta.cellIndex 
        },
        originalValue,
        value,
        columnMeta,
        editDuration: 0,
        hasChanged: true
      };
      
      storageManager.executeSave(editData);
      // storageManager.scheduleSave(editData); // REMOVED: Prevent double save

      // 유효성 검증
      if (validationManager) {
        try {
          validationManager.validateCell(rowIndex, colIndex, value, columnMeta.type, true); // immediate=true to sync with history
        } catch (error) {
          console.error('[EditOverlay] Validation failed:', error);
        }
      }
    }

    // 편집 완료
    gridStore.confirmEditing();
    selectionSystem.stopEditing(true);
    closeEditOverlay();
  }

  /**
   * 편집 취소
   */
  function cancelEdit() {
    gridStore.cancelEditing();
    selectionSystem.stopEditing(false);
    closeEditOverlay();
    focusGrid();
  }

  /**
   * 오버레이 닫기
   */
  function closeEditOverlay() {
    editOverlayState.visible = false;
    editOverlayState.columnMeta = null;
  }

  /**
   * 입력 중 값 업데이트
   * Input 이벤트 발생 시 state도 즉시 동기화하여 데이터 불일치 방지
   */
  function handleOverlayInput(value: string) {
    editOverlayState.value = value;
    gridStore.updateTempValue(value);
  }

  /**
   * 키 입력 추가 (오버레이가 포커스를 잃었을 때 사용)
   */
  function appendValueToOverlay(char: string) {
    if (!editOverlayState.visible) return;
    
    // 현재 값에 문자 추가
    editOverlayState.value += char;
    gridStore.updateTempValue(editOverlayState.value);

    // 포커스가 없어서 키보드 핸들러로 빠진 경우이므로, 다시 오버레이로 포커스 이동
    nextTick(() => {
      if (editOverlayRef.value && editOverlayRef.value.inputRef) {
        editOverlayRef.value.inputRef.focus();
        // 커서를 맨 뒤로
        try {
             editOverlayRef.value.inputRef.selectionStart = editOverlayState.value.length;
             editOverlayRef.value.inputRef.selectionEnd = editOverlayState.value.length;
        } catch(e) {}
      }
    });
  }

  /**
   * 다음 행으로 이동 (Enter 키)
   */
  async function moveToNextRow() {
    const { rowIndex, colIndex } = editOverlayState;
    
    // 헤더 셀(-1)에서 Enter 누르면 첫 번째 데이터 행(0)으로 이동
    let nextRow: number;
    if (rowIndex < 0) {
      nextRow = 0;
    } else {
      nextRow = rowIndex < rows.value.length - 1 ? rowIndex + 1 : rowIndex;
    }
    
    selectionSystem.selectCell(nextRow, colIndex);
    
    if (ensureCellIsVisible) {
      await ensureCellIsVisible(nextRow, colIndex);
    }
    
    focusGrid();
  }

  /**
   * 다음 셀로 이동 (Tab 키)
   */
  async function moveToNextCell() {
    const { rowIndex, colIndex } = editOverlayState;
    
    const tabTarget = findNextNavigableCell(
      rowIndex,
      colIndex,
      'right',
      allColumnsMeta.value,
      rows.value.length,
      allColumnsMeta.value.length
    );
    
    selectionSystem.selectCell(tabTarget.rowIndex, tabTarget.colIndex);
    
    if (ensureCellIsVisible) {
      await ensureCellIsVisible(tabTarget.rowIndex, tabTarget.colIndex);
    }
    
    focusGrid();
  }

  return {
    editOverlayState,
    editOverlayRef,
    startEditOverlay,
    startEditOverlayWithKey,
    confirmEdit,
    cancelEdit,
    closeEditOverlay,
    handleOverlayInput,
    appendValueToOverlay,
    moveToNextRow,
    moveToNextCell
  };
}
