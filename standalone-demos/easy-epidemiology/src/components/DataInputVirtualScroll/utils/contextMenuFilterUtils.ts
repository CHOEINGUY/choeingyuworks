/**
 * 필터 관련 유틸리티 함수들
 * contextMenuHandlers.js에서 분리됨
 */

import type { GridHeader, GridRow } from '@/types/grid';
import type { Ref } from 'vue';

export interface FilterCount {
  value: string;
  count: number;
}

export interface FilterContext {
  gridStore?: any;
  epidemicStore?: any;
  rows: Ref<GridRow[]> | GridRow[];
  filteredRows: Ref<GridRow[]> | GridRow[];
  allColumnsMeta: GridHeader[];
}

/**
 * 필터가 활성화되어 있는지 확인합니다.
 */
export function isFilterActive(colIndex: number, value: string, context: any): boolean {
  // gridStore 우선 사용
  const filterState = context.gridStore?.filterState || context.storeBridge?.filterState;

  if (!filterState) {
    return false;
  }
  
  // Resolve key from colIndex to match useGridContextMenu logic
  let key = String(colIndex);
  if (context.allColumnsMeta) {
      const column = context.allColumnsMeta.find((c: any) => c.colIndex === colIndex);
      if (column) {
          // Priority: dataKey-cellIndex (for arrays) -> dataKey -> colIndex
          if (column.dataKey && (column.cellIndex !== undefined && column.cellIndex !== null)) {
              key = `${column.dataKey}-${column.cellIndex}`;
          } else if (column.dataKey) {
              key = column.dataKey;
          }
      }
  }

  const filter = filterState.activeFilters.get(key);
  if (!filter) {
    return false;
  }
  
  // Check for multi-select existence
  // The filter value in store is now string[] for multi-select
  if (Array.isArray(filter)) {
      return filter.includes(value);
  }
  
  // Backwards compatibility if ever needed (though we changed store logic)
  return filter === value;
}

/**
 * 특정 컬럼의 고유한 값들과 각 값의 개수를 반환합니다.
 * 필터가 적용된 경우 필터링된 데이터를 기준으로 계산합니다.
 */
export function getUniqueValuesForColumn(colIndex: number, context: FilterContext): FilterCount[] {
  const { rows, filteredRows, allColumnsMeta } = context;
  const columnMeta = allColumnsMeta.find(c => c.colIndex === colIndex);
  
  if (!columnMeta || !columnMeta.dataKey) {
    return [];
  }

  // 컨텍스트 메뉴 로직:
  // 1. 현재 컬럼의 필터가 있는 경우: 전체 데이터 기준으로 모든 값 표시
  // 2. 현재 컬럼의 필터가 없는 경우: 다른 컬럼의 필터로 인해 보이는 행들 기준으로 표시
  const allData = (rows as Ref<GridRow[]>).value || rows;
  const filteredData = (filteredRows as Ref<GridRow[]>).value || filteredRows;
  
  const filterState = context.gridStore?.filterState || (context as any).storeBridge?.filterState;
  const isFiltered = filterState?.isFiltered;
  const currentColumnFilter = filterState?.activeFilters?.get(colIndex);
  
  if (!allData || !Array.isArray(allData)) {
    return [];
  }

  // 데이터 소스 결정
  // 항상 전체 데이터를 기준으로 고유 값을 계산해야, 필터링 후에도 다른 선택지가 사라지지 않음
  // (예: 0을 선택해서 0만 남았을 때도 컨텍스트 메뉴에는 0, 1이 모두 떠야 함)
  const dataToUse = allData;
  
  if (!dataToUse || !Array.isArray(dataToUse)) {
    return [];
  }

  // Determine the current column's filter key (using explicit logic for consistency)
  let currentKey = String(colIndex);
  if (columnMeta.dataKey && (columnMeta.cellIndex !== undefined && columnMeta.cellIndex !== null)) {
      currentKey = `${columnMeta.dataKey}-${columnMeta.cellIndex}`;
  } else if (columnMeta.dataKey) {
      // For basic/clinical/diet columns that are handled as arrays but filtered by index? 
      // Actually gridStore uses complex keys. For 'isPatient' it is colIndex name.
      // Let's use the helper if possible, or replicate:
      if (['isPatient','isConfirmedCase','symptomOnset','individualExposureTime'].includes(columnMeta.dataKey)) {
          currentKey = columnMeta.dataKey;
      }
      else if (context.gridStore?.activeFilters?.has(columnMeta.dataKey)) {
           currentKey = columnMeta.dataKey;
      }
  }

  // Dependent Filter Logic: 
  // We want rows that match ALL filters EXCEPT the filter on the current column.
  // This ensures that if we filter Column A, Column B shows only values available in A's result.
  // But if we filter Column B, we still see all B values compatible with A.
  
  const activeFilters = context.gridStore?.activeFilters;
  const otherFilters = new Map<string, string[]>();
  
  if (activeFilters) {
      for (const [key, val] of activeFilters.entries()) {
          // If the filter key is NOT the current column's key (and not just "starts with" to avoid partial matches on similar keys)
          // We need precise key matching.
          // The key used in store is exact.
          if (key !== currentKey) {
              otherFilters.set(key, val);
          }
      }
  }

  const valueCounts = new Map<string, number>();

  dataToUse.forEach((row: GridRow) => {
    // Check if row matches *other* filters
    let isMatch = true;
    if (otherFilters.size > 0 && context.gridStore?.matchesFilter) {
        for (const [key, val] of otherFilters.entries()) {
            if (!context.gridStore.matchesFilter(row, key, val)) {
                isMatch = false;
                break;
            }
        }
    }

    if (!isMatch) return;

    let cellValue = '';
    
    if (columnMeta.cellIndex !== null && columnMeta.cellIndex !== undefined) {
      // 배열 기반 컬럼 (기본정보, 임상증상, 식단)
      if (row[columnMeta.dataKey!] && Array.isArray(row[columnMeta.dataKey!])) {
        cellValue = String(row[columnMeta.dataKey!][columnMeta.cellIndex!] ?? '');
      }
    } else {
      // 단일 값 컬럼 (환자여부, 확진여부, 증상발현시간, 개별노출시간)
      cellValue = String(row[columnMeta.dataKey!] ?? '');
    }

    // 빈 값 정규화
    if (cellValue === 'null' || cellValue === 'undefined' || cellValue === '') {
      cellValue = '';
    }

    valueCounts.set(cellValue, (valueCounts.get(cellValue) || 0) + 1);
  });

  // 결과 배열 생성
  const result: FilterCount[] = Array.from(valueCounts.entries())
    .map(([value, count]) => ({ 
      value, 
      count  // 선택된 데이터 소스에서의 개수
    }));

  // 오름차순으로 정렬
  result.sort((a, b) => {
    if (a.value === '' && b.value !== '') return 1;
    if (a.value !== '' && b.value === '') return -1;
    
    const aNum = parseFloat(a.value);
    const bNum = parseFloat(b.value);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    
    return a.value.localeCompare(b.value);
  });

  return result;
}

/**
 * 특정 날짜/시간 컬럼의 고유한 날짜들과 각 날짜의 개수를 반환합니다.
 * 날짜 부분만 추출하여 그룹화합니다 (시간 제거).
 */
export function getUniqueDatesForColumn(colIndex: number, context: FilterContext): { date: string; count: number }[] {
  const { rows, filteredRows, allColumnsMeta } = context;
  const columnMeta = allColumnsMeta.find(c => c.colIndex === colIndex);
  
  if (!columnMeta || !columnMeta.dataKey) {
    return [];
  }

  const allData = (rows as Ref<GridRow[]>).value || rows;
  const filteredData = (filteredRows as Ref<GridRow[]>).value || filteredRows;
  
  const filterState = context.gridStore?.filterState || (context as any).storeBridge?.filterState;
  const isFiltered = filterState?.isFiltered;
  const currentColumnFilter = filterState?.activeFilters?.get(colIndex);
  
  if (!allData || !Array.isArray(allData)) {
    return [];
  }

  // 데이터 소스 결정: 항상 전체 데이터 사용
  const dataToUse = allData;
  
  if (!dataToUse || !Array.isArray(dataToUse)) {
    return [];
  }

  const extractDatePart = (dateTimeString: string): string => {
    if (!dateTimeString || dateTimeString === '') return '';
    const dateMatch = dateTimeString.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      return dateMatch[1]; 
    }
    const altDateMatch = dateTimeString.match(/^(\d{4}[/-]\d{2}[/-]\d{2})/);
    if (altDateMatch) {
      return altDateMatch[1].replace(/[/]/g, '-');
    }
    return dateTimeString; 
  };

  // Determine current key for Date columns
  const currentKey = columnMeta.dataKey || String(colIndex);

  const activeFilters = context.gridStore?.activeFilters;
  const otherFilters = new Map<string, string[]>();
  
  if (activeFilters) {
      for (const [key, val] of activeFilters.entries()) {
          if (key !== currentKey) {
              otherFilters.set(key, val);
          }
      }
  }

  const dateCounts = new Map<string, number>();

  dataToUse.forEach((row: GridRow) => {
    // Check if row matches *other* filters
    let isMatch = true;
    if (otherFilters.size > 0 && context.gridStore?.matchesFilter) {
        for (const [key, val] of otherFilters.entries()) {
            if (!context.gridStore.matchesFilter(row, key, val)) {
                isMatch = false;
                break;
            }
        }
    }

    if (!isMatch) return;

    const cellValue = String(row[columnMeta.dataKey!] ?? '');
    
    if (cellValue === 'null' || cellValue === 'undefined' || cellValue === '') {
      dateCounts.set('', (dateCounts.get('') || 0) + 1);
      return;
    }

    const datePart = extractDatePart(cellValue);
    dateCounts.set(datePart, (dateCounts.get(datePart) || 0) + 1);
  });

  const result = Array.from(dateCounts.entries())
    .map(([date, count]) => ({ 
      date, 
      count 
    }));

  result.sort((a, b) => {
    if (a.date === '' && b.date !== '') return 1;
    if (a.date !== '' && b.date === '') return -1;
    return a.date.localeCompare(b.date);
  });

  return result;
}
