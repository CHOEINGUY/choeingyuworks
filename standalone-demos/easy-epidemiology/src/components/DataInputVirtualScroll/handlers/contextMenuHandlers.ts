
import {
  COL_TYPE_BASIC,
  COL_TYPE_SERIAL,
  COL_TYPE_ONSET,
  COL_TYPE_IS_PATIENT,
  COL_TYPE_CONFIRMED_CASE,
  COL_TYPE_INDIVIDUAL_EXPOSURE,
  COL_IDX_SERIAL
} from '../constants/index';
import { 
  isFilterActive, 
  getUniqueValuesForColumn, 
  getUniqueDatesForColumn 
  // @ts-ignore
} from '../utils/contextMenuFilterUtils';
import type { GridHeader } from '@/types/grid';
import type { GridContextMenuContext } from '../../../types/virtualGridContext';
import i18n from '@/i18n';

// Access translation function
const t = (key: string, props?: any) => {
  // @ts-ignore
  return i18n.global.t(key, props);
};

/**
 * 우클릭 이벤트를 처리하고 컨텍스트 메뉴를 표시합니다.
 */
export function handleContextMenu(
  event: MouseEvent, 
  virtualRowIndex: number, 
  colIndex: number, 
  context: GridContextMenuContext
) {
  event.preventDefault();

  const { getOriginalIndex, selectionSystem, showContextMenu, allColumnsMeta } = context;
  const originalRowIndex = virtualRowIndex >= 0 ? getOriginalIndex(virtualRowIndex) : virtualRowIndex;

  // 우클릭 시 해당 셀/행을 먼저 선택 (단, 드래그 중이 아닐 때)
  if (!selectionSystem.state.isDragging) {
    // 개별 선택 상태 확인
    const isRowIndividuallySelected = selectionSystem.state.selectedRowsIndividual.has(originalRowIndex);
    const isCellIndividuallySelected = selectionSystem.state.selectedCellsIndividual.has(`${originalRowIndex}_${colIndex}`);
    
    // 범위 선택 상태 확인
    const { selectedRange } = selectionSystem.state;
    const isClickInsideSelection = 
      selectedRange.start.rowIndex !== null &&
      selectedRange.end.rowIndex !== null &&
      originalRowIndex >= selectedRange.start.rowIndex &&
      originalRowIndex <= selectedRange.end.rowIndex &&
      selectedRange.start.colIndex !== null &&
      selectedRange.end.colIndex !== null &&
      colIndex >= selectedRange.start.colIndex &&
      colIndex <= selectedRange.end.colIndex;

    // 클릭이 기존 선택(개별 또는 범위) 밖에서 발생한 경우에만 선택을 업데이트합니다.
    if (!isClickInsideSelection && !isRowIndividuallySelected && !isCellIndividuallySelected) {
      // 개별 선택 상태 초기화
      selectionSystem.clearIndividualSelections();
      
      if (colIndex === COL_IDX_SERIAL && originalRowIndex >= 0) {
        // 연번(serial) 컬럼을 우클릭하면 행 전체를 선택합니다.
        // @ts-ignore - selectRow signature
        selectionSystem.selectRow(originalRowIndex, allColumnsMeta);
      } else {
        // 그 외의 셀은 해당 셀만 선택합니다.
        selectionSystem.selectCell(originalRowIndex, colIndex);
      }
    }
  }

  const menuItems = getMenuItemsForContext(originalRowIndex, colIndex, selectionSystem.state, allColumnsMeta, context);
  const targetInfo = { rowIndex: originalRowIndex, colIndex };

  console.log('[ContextMenu] 메뉴 아이템 생성:', {
    originalRowIndex,
    colIndex,
    menuItems: menuItems.map((item: any) => ({ label: item.label, action: item.action })),
    targetInfo
  });

  if (menuItems.length > 0) {
    showContextMenu(event.clientX, event.clientY, menuItems, targetInfo);
  } else {
    console.warn('[ContextMenu] No menu items generated for:', { originalRowIndex, colIndex, targetColumn: allColumnsMeta.find(c => c.colIndex === colIndex) });
  }
}

/**
 * 현재 컨텍스트에 맞는 메뉴 아이템 배열을 반환합니다.
 */
function getMenuItemsForContext(
  rowIndex: number, 
  colIndex: number, 
  selectionState: any, 
  allColumnsMeta: GridHeader[], 
  context: GridContextMenuContext
) {
  const { selectedRange, selectedRowsIndividual, selectedCellsIndividual } = selectionState;
  const column = allColumnsMeta.find(c => c.colIndex === colIndex);

  // 개별 선택 개수 계산
  const individualRowCount = selectedRowsIndividual.size;
  const individualCellCount = selectedCellsIndividual.size;

  // 범위 선택 개수 계산
  const rangeRowCount = selectedRange.start.rowIndex !== null ? Math.abs(selectedRange.end.rowIndex - selectedRange.start.rowIndex) + 1 : 0;
  const rangeColCount = selectedRange.start.colIndex !== null ? Math.abs(selectedRange.end.colIndex - selectedRange.start.colIndex) + 1 : 0;

  // 우선순위: 개별 선택 > 범위 선택
  const effectiveRowCount = individualRowCount > 0 ? individualRowCount : rangeRowCount;
  const effectiveColCount = individualCellCount > 0 ? getUniqueColumnCount(selectedCellsIndividual) : rangeColCount;
  
  const isMultiRow = effectiveRowCount > 1;
  const isMultiCol = effectiveColCount > 1;

  const menuItems: any[] = [];

  // --- 셀 데이터 삭제 메뉴 (맨 위에 추가) ---
  if (rowIndex >= 0 && colIndex > COL_IDX_SERIAL) {
    const cellCount = individualCellCount > 0 ? individualCellCount : 1;
    const label = cellCount > 1 
      ? t('dataInput.contextMenu.clearCellDataCount', { count: cellCount })
      : t('dataInput.contextMenu.clearCellData');
    
    // Copy/Paste 메뉴 추가
    menuItems.push(
      { label: t('dataInput.contextMenu.copy'), action: 'copy-cell', icon: 'content_copy' },
      { label: t('dataInput.contextMenu.paste'), action: 'paste-cell', icon: 'content_paste' },
      { type: 'separator' }
    );

    menuItems.push(
      { label, action: 'clear-cell-data', icon: '×' }
    );
    menuItems.push({ type: 'separator' });
  }

  // --- 행 관련 메뉴 ---
  if (colIndex === COL_IDX_SERIAL || individualRowCount > 0 || rowIndex >= 0) {
    // Copy/Paste menu for Rows
    if (colIndex === COL_IDX_SERIAL || individualRowCount > 0) {
        menuItems.push(
          { label: t('dataInput.contextMenu.copy'), action: 'copy-cell', icon: 'content_copy' },
          { label: t('dataInput.contextMenu.paste'), action: 'paste-cell', icon: 'content_paste' },
          { type: 'separator' }
        );
    }

    menuItems.push(
      { 
        label: isMultiRow 
          ? t('dataInput.contextMenu.addRowAboveCount', { count: effectiveRowCount }) 
          : t('dataInput.contextMenu.addRowAbove'), 
        action: 'add-row-above', 
        icon: '↑' 
      },
      { 
        label: isMultiRow 
          ? t('dataInput.contextMenu.addRowBelowCount', { count: effectiveRowCount }) 
          : t('dataInput.contextMenu.addRowBelow'), 
        action: 'add-row-below', 
        icon: '↓' 
      },
      { type: 'separator' },
      { 
        label: isMultiRow 
          ? t('dataInput.contextMenu.clearRowsDataCount', { count: effectiveRowCount }) 
          : t('dataInput.contextMenu.clearRowsData'), 
        action: 'clear-rows-data', 
        icon: '×' 
      },
      { 
        label: isMultiRow 
          ? t('dataInput.contextMenu.deleteRowsCount', { count: effectiveRowCount }) 
          : t('dataInput.contextMenu.deleteRows'), 
        action: 'delete-rows', 
        icon: '−', 
        danger: true 
      }
    );
  }
  
  // --- 열 관련 메뉴 ---
  if (rowIndex < 0 || individualCellCount > 0 || (rowIndex >= 0 && colIndex > COL_IDX_SERIAL)) {
    if (menuItems.length > 0) {
      menuItems.push({ type: 'separator' });
    }

    const targetColumnTypes = new Set();
    if (individualCellCount > 0) {
      selectedCellsIndividual.forEach((cellKey: string) => {
        const [, colStr] = cellKey.split('_');
        const col = allColumnsMeta.find(c => c.colIndex === parseInt(colStr, 10));
        if (col) targetColumnTypes.add(col.type);
      });
    } else if (column) {
      targetColumnTypes.add(column.type);
    }

    // 1. 삭제 가능한 열
    const hasDeletableColumns = Array.from(targetColumnTypes).some((type: any) => 
      [COL_TYPE_BASIC, 'clinicalSymptoms', 'dietInfo'].includes(type)
    );

    if (hasDeletableColumns) {
      menuItems.push(
        { 
          label: isMultiCol 
            ? t('dataInput.contextMenu.addColLeftCount', { count: effectiveColCount }) 
            : t('dataInput.contextMenu.addColLeft'), 
          action: 'add-col-left', 
          icon: '←' 
        },
        { 
          label: isMultiCol 
            ? t('dataInput.contextMenu.addColRightCount', { count: effectiveColCount }) 
            : t('dataInput.contextMenu.addColRight'), 
          action: 'add-col-right', 
          icon: '→' 
        },
        { type: 'separator' },
        { 
          label: isMultiCol 
            ? t('dataInput.contextMenu.clearColsDataCount', { count: effectiveColCount }) 
            : t('dataInput.contextMenu.clearColsData'), 
          action: 'clear-cols-data', 
          icon: '×' 
        }
      );
      
      if (areSelectedColumnsDeletable(selectionState, allColumnsMeta)) {
        menuItems.push({ 
          label: isMultiCol 
            ? t('dataInput.contextMenu.deleteColsCount', { count: effectiveColCount }) 
            : t('dataInput.contextMenu.deleteCols'), 
          action: 'delete-cols', 
          icon: '−', 
          danger: true 
        });
      }
    } 
    // 2. 고정 열 (환자여부, 확진자여부, 증상발현시간 등) - 데이터 지우기만 가능
    else if (Array.from(targetColumnTypes).some((type: any) => 
      [COL_TYPE_IS_PATIENT, COL_TYPE_CONFIRMED_CASE, COL_TYPE_ONSET, COL_TYPE_INDIVIDUAL_EXPOSURE].includes(type)
    )) {
      menuItems.push(
        { 
          label: isMultiCol 
            ? t('dataInput.contextMenu.clearColsDataCount', { count: effectiveColCount }) 
            : t('dataInput.contextMenu.clearColsData'), 
          action: 'clear-cols-data', 
          icon: '×' 
        }
      );
    }
    // 3. 연번 헤더
    else if (Array.from(targetColumnTypes).includes(COL_TYPE_SERIAL)) {
      menuItems.push(
        { label: t('dataInput.contextMenu.deleteEmptyRows'), action: 'delete-empty-rows', icon: '×' }
      );
    }
  }

  // --- 필터 메뉴 (헤더 클릭 시) ---
  if (rowIndex < 0) {
    // Copy/Paste menu for Header
    menuItems.push(
      { label: t('dataInput.contextMenu.copy'), action: 'copy-cell', icon: 'content_copy' },
      { label: t('dataInput.contextMenu.paste'), action: 'paste-cell', icon: 'content_paste' }
    );

    const emptyCellText = t('dataInput.contextMenu.emptyCell');

    if (column && column.type === COL_TYPE_IS_PATIENT) {
      const uniqueValuesWithCounts = getUniqueValuesForColumn(colIndex, context as any);
      menuItems.push({ type: 'separator' });
      uniqueValuesWithCounts.forEach(({ value, count }: any) => {
        const displayValue = value === '' ? emptyCellText : value;
        const action = `filter-patient-${value === '' ? 'empty' : value}`;
        menuItems.push({
          label: `${displayValue} (${count})`,
          action,
          type: 'checkbox',
          checked: isFilterActive(colIndex, value === '' ? 'empty' : value, context as any)
        });
      });
    }
    
    if (column && column.type === COL_TYPE_CONFIRMED_CASE) {
      const uniqueValuesWithCounts = getUniqueValuesForColumn(colIndex, context as any);
      menuItems.push({ type: 'separator' });
      uniqueValuesWithCounts.forEach(({ value, count }: any) => {
        const displayValue = value === '' ? emptyCellText : value;
        const action = `filter-confirmed-${value === '' ? 'empty' : value}`;
        menuItems.push({
          label: `${displayValue} (${count})`,
          action,
          type: 'checkbox',
          checked: isFilterActive(colIndex, value === '' ? 'empty' : value, context as any)
        });
      });
    }
    
    if (column && column.type === 'clinicalSymptoms') {
      const uniqueValuesWithCounts = getUniqueValuesForColumn(colIndex, context as any);
      menuItems.push({ type: 'separator' });
      uniqueValuesWithCounts.forEach(({ value, count }: any) => {
        const displayValue = value === '' ? emptyCellText : value;
        const action = `filter-clinical-${value === '' ? 'empty' : value}`;
        menuItems.push({
          label: `${displayValue} (${count})`,
          action,
          type: 'checkbox',
          checked: isFilterActive(colIndex, value === '' ? 'empty' : value, context as any)
        });
      });
    }

    if (column && column.type === 'dietInfo') {
      const uniqueValuesWithCounts = getUniqueValuesForColumn(colIndex, context as any);
      menuItems.push({ type: 'separator' });
      uniqueValuesWithCounts.forEach(({ value, count }: any) => {
        const displayValue = value === '' ? emptyCellText : value;
        const action = `filter-diet-${value === '' ? 'empty' : value}`;
        menuItems.push({
          label: `${displayValue} (${count})`,
          action,
          type: 'checkbox',
          checked: isFilterActive(colIndex, value === '' ? 'empty' : value, context as any)
        });
      });
    }

    if (column && column.type === COL_TYPE_BASIC) {
      const uniqueValuesWithCounts = getUniqueValuesForColumn(colIndex, context as any);
      menuItems.push({ type: 'separator' });
      uniqueValuesWithCounts.forEach(({ value, count }: any) => {
        const displayValue = value === '' ? emptyCellText : value;
        const action = `filter-basic-${value === '' ? 'empty' : value}`;
        menuItems.push({
          label: `${displayValue} (${count})`,
          action,
          type: 'checkbox',
          checked: isFilterActive(colIndex, value === '' ? 'empty' : value, context)
        });
      });
    }
    
    if (column && (column.type === COL_TYPE_ONSET || column.type === COL_TYPE_INDIVIDUAL_EXPOSURE)) {
      const uniqueDatesWithCounts = getUniqueDatesForColumn(colIndex, context as any);
      menuItems.push({ type: 'separator' });
      uniqueDatesWithCounts.forEach(({ date, count }: any) => {
        const displayDate = date === '' ? emptyCellText : date;
        const action = `filter-datetime-${date === '' ? 'empty' : date}`;
        menuItems.push({
          label: `${displayDate} (${count})`,
          action,
          type: 'checkbox',
          checked: isFilterActive(colIndex, date === '' ? 'empty' : date, context as any)
        });
      });
    }
    
    // gridStore filter check
    if (context.gridStore && context.gridStore.isFiltered) {
      menuItems.push(
        { type: 'separator' },
        { label: t('dataInput.contextMenu.clearAllFilters'), action: 'clear-all-filters', icon: '×' }
      );
    }
  }

  return menuItems;
}

function getUniqueColumnCount(selectedCellsIndividual: Set<string>) {
  const uniqueColumns = new Set();
  selectedCellsIndividual.forEach(cellKey => {
    const [, colStr] = cellKey.split('_');
    uniqueColumns.add(parseInt(colStr, 10));
  });
  return uniqueColumns.size;
}

function areSelectedColumnsDeletable(selectionState: any, allColumnsMeta: GridHeader[]) {
  const { selectedRange, selectedCellsIndividual } = selectionState;
  
  // 1. 각 그룹별 전체 열의 개수를 미리 계산합니다.
  const totalCounts = allColumnsMeta.reduce((acc: any, col) => {
    if ([COL_TYPE_BASIC, 'clinicalSymptoms', 'dietInfo'].includes(col.type)) {
      if (!acc[col.type]) acc[col.type] = 0;
      acc[col.type]++;
    }
    return acc;
  }, {});

  // 2. 선택된 열들의 개수를 그룹별로 계산합니다.
  const selectedCounts: any = {};
  
  if (selectedCellsIndividual.size > 0) {
    selectedCellsIndividual.forEach((cellKey: string) => {
      const [, colStr] = cellKey.split('_');
      const colIndex = parseInt(colStr, 10);
      const meta = allColumnsMeta.find(c => c.colIndex === colIndex);
      if (meta && [COL_TYPE_BASIC, 'clinicalSymptoms', 'dietInfo'].includes(meta.type)) {
        if (!selectedCounts[meta.type]) selectedCounts[meta.type] = 0;
        selectedCounts[meta.type]++;
      }
    });
  } else if (selectedRange.start.colIndex !== null) {
    for (let i = selectedRange.start.colIndex; i <= selectedRange.end.colIndex; i++) {
      const meta = allColumnsMeta.find(c => c.colIndex === i);
      if (meta && [COL_TYPE_BASIC, 'clinicalSymptoms', 'dietInfo'].includes(meta.type)) {
        if (!selectedCounts[meta.type]) selectedCounts[meta.type] = 0;
        selectedCounts[meta.type]++;
      }
    }
  }

  // 3. 선택된 그룹들 중, 삭제를 수행해도 최소 1개의 열이 남는 그룹이 하나라도 있는지 확인합니다.
  for (const type in selectedCounts) {
    if (totalCounts[type] - selectedCounts[type] >= 1) {
      return true;
    }
  }

  return false;
}
