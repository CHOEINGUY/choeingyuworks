import { ref, computed, Ref } from 'vue';
import { GridRow } from '@/types/grid';

export interface VirtualScrollOptions {
  rowHeight?: number;
  bufferSize?: number;
  viewportHeight: Ref<number>;
}

export interface UseVirtualScrollReturn {
  visibleRows: Ref<GridRow[]>;
  totalHeight: Ref<number>;
  paddingTop: Ref<number>;
  onScroll: (event: Event) => void;
  getOriginalIndex: (virtualIndex: number) => number;
  getVirtualIndex: (originalIndex: number) => number | null;
}

/**
 * Composable for virtual scrolling.
 *
 * @param {Ref<GridRow[]>} allRows - A ref to the full list of data rows.
 * @param {VirtualScrollOptions} options - Configuration for virtual scrolling.
 * @returns {UseVirtualScrollReturn} - Reactive properties and handlers for virtual scrolling.
 */
export function useVirtualScroll(
  allRows: Ref<GridRow[]>,
  options: VirtualScrollOptions
): UseVirtualScrollReturn {
  const { rowHeight = 35, bufferSize = 10, viewportHeight } = options;
  const scrollTop = ref(0);

  const totalHeight = computed(() => allRows.value.length * rowHeight);

  const startIndex = computed(() => {
    return Math.max(0, Math.floor(scrollTop.value / rowHeight) - bufferSize);
  });

  const visibleNodeCount = computed(() => {
    if (!viewportHeight.value) return 0;
    return Math.ceil(viewportHeight.value / rowHeight) + 2 * bufferSize;
  });

  const endIndex = computed(() => {
    return Math.min(allRows.value.length - 1, startIndex.value + visibleNodeCount.value);
  });

  const visibleRows = computed(() => {
    return allRows.value.slice(startIndex.value, endIndex.value + 1).map((data, index) => {
      // data가 이미 _originalIndex를 가지고 있는지 확인
      const rawOriginalIndex = data._originalIndex;
      const originalIndex = rawOriginalIndex !== undefined ? rawOriginalIndex : (startIndex.value + index);
      return {
        ...data, // 모든 원본 속성을 유지
        originalIndex
      };
    });
  });

  const paddingTop = computed(() => startIndex.value * rowHeight);

  function onScroll(event: Event) {
    const target = event.target as HTMLElement;
    scrollTop.value = target.scrollTop;
  }

  function getOriginalIndex(virtualIndex: number): number {
    return startIndex.value + virtualIndex;
  }

  function getVirtualIndex(originalIndex: number): number | null {
    if (originalIndex < startIndex.value || originalIndex > endIndex.value) {
      return null; // Not currently visible
    }
    return originalIndex - startIndex.value;
  }

  return {
    visibleRows,
    totalHeight,
    paddingTop,
    onScroll,
    getOriginalIndex,
    getVirtualIndex
  };
}
