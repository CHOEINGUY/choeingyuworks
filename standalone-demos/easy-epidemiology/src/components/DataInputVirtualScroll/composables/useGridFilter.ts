
import { ref, computed, watch, nextTick, type Ref } from 'vue';
import { logger } from '../../../utils/logger';
import { useGridStore } from '@/stores/gridStore';
import { useHistoryStore } from '@/stores/historyStore';
import type { GridRow } from '@/types/grid';

export function useGridFilter(
  rows: Ref<GridRow[]>,
  gridBodyRef: Ref<any>,
  gridHeaderRef: Ref<any>
) {
  const gridStore = useGridStore();
  const historyStore = useHistoryStore();
  
  // 필터 상태를 reactive하게 만들기
  const filterState = ref(gridStore.filterState);

  // 필터 상태 변화 감지
  watch(() => gridStore.filterState, (newState) => {
    if (JSON.stringify(newState) !== JSON.stringify(filterState.value)) {
      filterState.value = { ...newState };

      nextTick(() => {
        if (gridBodyRef.value && gridHeaderRef.value) {
          if (newState.isFiltered !== filterState.value.isFiltered ||
              (newState.activeFilters?.size ?? 0) !== (filterState.value.activeFilters?.size ?? 0)) {
            if (gridBodyRef.value.$forceUpdate) gridBodyRef.value.$forceUpdate();
            if (gridHeaderRef.value.$forceUpdate) gridHeaderRef.value.$forceUpdate();
          }
        }
      });
    }
  }, {
    deep: true,
    immediate: true
  });

  // --- 필터된 행 계산 ---
  const filteredRows = computed(() => {
    // Use activeFilters directly for better reactivity
    const activeFilters = gridStore.activeFilters;
    const activeFiltersSize = activeFilters.size;
    const isFiltered = activeFiltersSize > 0;

    if (!isFiltered) {
      return rows.value;
    }

    const filteredWithOriginalIndex: GridRow[] = [];
    rows.value.forEach((row, originalIndex) => {
      // Use direct Map iteration
      let shouldInclude = true;
      for (const [key, filterConfig] of activeFilters) {
          // Pass key and filterConfig directly
          if (!gridStore.matchesFilter(row, key, filterConfig)) {
              shouldInclude = false;
              break;
          }
      }

      if (shouldInclude) {
        // Explicitly copy properties to ensure reactivity isn't lost or shadowed
        // Although spread should work, let's be explicit about _originalIndex
        const newRow = { ...row };
        newRow._originalIndex = originalIndex;
        newRow._filteredOriginalIndex = originalIndex;
        
        filteredWithOriginalIndex.push(newRow);
      }
    });

    return filteredWithOriginalIndex;
  });

  // === 필터 상태 포함한 스냅샷 캡처 헬퍼 ===
  function captureSnapshotWithFilter(actionType: string, metadata = {}) {
    try {
      historyStore.captureSnapshot(actionType, metadata);
    } catch (error) {
      logger.error(`스냅샷 캡처 실패: ${actionType}`, error);
    }
  }

  // === 히스토리 변경 후 동기화 함수 ===
  function syncFilterStateAfterHistoryChange() {
    // 히스토리 변경 시에는 gridStore 상태가 이미 업데이트되어 있음 (historyStore가 복원)
    // 로컬 ref만 동기화하면 됨
    const newFilterState = { ...gridStore.filterState };
    filterState.value = newFilterState;

    nextTick(() => {
      try {
        const gridBody = gridBodyRef.value;
        const gridHeader = gridHeaderRef.value;

        if (gridBody && gridHeader) {
          if (newFilterState.isFiltered !== filterState.value.isFiltered ||
              (newFilterState.activeFilters?.size ?? 0) !== (filterState.value.activeFilters?.size ?? 0)) {
            if (gridBody.$forceUpdate) gridBody.$forceUpdate();
            if (gridHeader.$forceUpdate) gridHeader.$forceUpdate();
          }
        }
      } catch (error) {
        logger.warn('UI update failed during sync', error);
      }
    });
  }

  function onClearAllFilters() {
    const oldFilterState = JSON.stringify(gridStore.filterState);

    gridStore.clearAllFilters();

    if (oldFilterState !== JSON.stringify(gridStore.filterState)) {
      captureSnapshotWithFilter('filter_clear_all', {
        action: 'clear-all-filters',
        oldFilterState: JSON.parse(oldFilterState),
        newFilterState: { ...gridStore.filterState }
      });
    }

    filterState.value = { ...gridStore.filterState };
    logger.debug('[Filter] 모든 필터 해제됨');
  }

  function onUpdateActiveFilters(activeFilters: Map<string, string[]>) {
    logger.debug('[Filter] 개별 필터 제거:', activeFilters);
    gridStore.clearAllFilters();
    activeFilters.forEach((v, k) => gridStore.setFilter(k, v));
  }

  return {
    filterState,
    filteredRows,
    captureSnapshotWithFilter,
    syncFilterStateAfterHistoryChange,
    onClearAllFilters,
    onUpdateActiveFilters
  };
}
