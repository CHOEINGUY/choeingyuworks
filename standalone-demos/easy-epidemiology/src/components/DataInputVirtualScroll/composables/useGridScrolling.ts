import { ref, nextTick, onMounted, onBeforeUnmount, watch, type Ref } from 'vue';
import { useVirtualScroll } from '../logic/useVirtualScroll';
import { devLog } from '../../../utils/logger';

interface GridScrollOptions {
    rowHeight?: number;
    bufferSize?: number;
    gridContainerRef?: Ref<HTMLElement | null>;
    gridHeaderRef?: Ref<any>; // Component instance
    gridBodyRef?: Ref<any>; // Component instance
}

export function useGridScrolling(
    filteredRows: Ref<any[]>,
    allColumnsMeta: Ref<any[]>,
    options: GridScrollOptions = {}
) {
    const ROW_HEIGHT = options.rowHeight || 35;
    const BUFFER_SIZE = options.bufferSize || 4;

    // --- Refs (Now passed from outside or provided via options to break circularity) ---
    const gridContainerRef = options.gridContainerRef || ref<HTMLElement | null>(null);
    const gridHeaderRef = options.gridHeaderRef || ref<any>(null);
    const gridBodyRef = options.gridBodyRef || ref<any>(null);

    const lastScrollLeft = ref(0);
    const viewportHeight = ref(0);
    const scrollbarWidth = ref(0);

    // --- Virtual Scroll Hook ---
    const { visibleRows, totalHeight, paddingTop, onScroll, getOriginalIndex } = useVirtualScroll(filteredRows, {
        rowHeight: ROW_HEIGHT,
        bufferSize: BUFFER_SIZE,
        viewportHeight
    });

    // --- Methods ---

    // 스크롤바 너비 계산 함수
    function calculateScrollbarWidth(): number {
        const bodyElement = gridBodyRef.value?.bodyContainer;
        if (!bodyElement) return 0;

        // 스크롤바가 있는지 확인
        const hasVerticalScrollbar = bodyElement.scrollHeight > bodyElement.clientHeight;

        if (hasVerticalScrollbar) {
            // 스크롤바 너비 계산 (컨테이너 너비 - 실제 콘텐츠 너비)
            return bodyElement.offsetWidth - bodyElement.clientWidth;
        }

        return 0;
    }

    // 스크롤바 너비 감지 및 헤더 패딩 업데이트
    function updateHeaderPadding() {
        const newScrollbarWidth = calculateScrollbarWidth();

        if (newScrollbarWidth !== scrollbarWidth.value) {
            scrollbarWidth.value = newScrollbarWidth;
            devLog(`[Scrollbar] Width updated: ${scrollbarWidth.value}px`);

            // 헤더 컨테이너에 패딩 적용
            nextTick(() => {
                const headerContainer = gridHeaderRef.value?.headerContainer;
                if (headerContainer) {
                    headerContainer.style.paddingRight = `${scrollbarWidth.value}px`;
                }
            });
        }
    }

    // handleGridScroll 함수
    function handleGridScroll(event: Event) {
        const target = event.target as HTMLElement;
        const { scrollLeft } = target;

        // 수평 스크롤 동기화
        if (scrollLeft !== lastScrollLeft.value) {
            lastScrollLeft.value = scrollLeft;
            const headerContainer = gridHeaderRef.value?.headerContainer;
            if (headerContainer) {
                headerContainer.scrollLeft = scrollLeft;
            }
        }

        // 스크롤바 너비 업데이트
        updateHeaderPadding();

        // 가상 스크롤 로직 처리
        onScroll(event);
    }

    // 셀 가시성 보장 함수
    async function ensureCellIsVisible(rowIndex: number, colIndex: number) {
        if (!gridBodyRef.value?.bodyContainer) return;

        const container = gridBodyRef.value.bodyContainer as HTMLElement;
        let hasScrolled = false;

        // --- Vertical Scroll ---
        if (rowIndex >= 0) {
            const rowHeight = ROW_HEIGHT;
            const SCROLL_DOWN_BUFFER = 40; // 하단 UI에 가려지지 않도록 추가 여백
            const { scrollTop, clientHeight } = container;

            const rowTop = rowIndex * rowHeight;
            const rowBottom = rowTop + rowHeight;

            let newScrollTop = scrollTop;

            if (rowTop < scrollTop) {
                newScrollTop = rowTop;
            } else if (rowBottom > scrollTop + clientHeight) {
                newScrollTop = rowBottom - clientHeight + SCROLL_DOWN_BUFFER;
            }

            if (newScrollTop !== scrollTop) {
                // 최대 스크롤 높이를 초과하지 않도록 보정
                const maxScrollTop = totalHeight.value - clientHeight;
                container.scrollTop = Math.min(newScrollTop, maxScrollTop);
                hasScrolled = true;
            }
        }

        // --- Horizontal Scroll ---
        if (colIndex >= 0) {
            const column = allColumnsMeta.value.find((c: any) => c.colIndex === colIndex);
            if (!column) return;

            const { scrollLeft, clientWidth } = container;

            const colLeft = column.offsetLeft || 0;
            const colWidthStr = column.style?.width || '0';
            const colWidth = parseInt(colWidthStr, 10);
            const colRight = colLeft + colWidth;

            let newScrollLeft = scrollLeft;

            if (colLeft < scrollLeft) {
                // 만약 두 번째 열(index: 1)로 이동하는 경우라면, 첫 번째 열도 보이도록 스크롤을 맨 왼쪽으로 보냅니다.
                if (colIndex === 1) {
                    newScrollLeft = 0;
                } else {
                    newScrollLeft = colLeft;
                }
            } else if (colRight > scrollLeft + clientWidth) {
                newScrollLeft = colRight - clientWidth;
            }

            if (newScrollLeft !== scrollLeft) {
                container.scrollLeft = newScrollLeft;
                hasScrolled = true;
            }
        }

        if (hasScrolled) {
            await nextTick();
        }
    }

    // 윈도우 리사이즈 핸들러
    function handleWindowResize() {
        nextTick(() => {
            updateHeaderPadding();
        });
    }

    // 컬럼 변경 시 스크롤바 너비 재계산
    watch(allColumnsMeta, () => {
        nextTick(() => {
            updateHeaderPadding();
        });
    }, { immediate: true });

    // --- Lifecycle ---
    onMounted(() => {
        if (gridContainerRef.value) {
            // We only need the body's height for viewport calculation.
            const bodyElement = gridContainerRef.value.querySelector('.grid-body-virtual');
            if (bodyElement) {
                const ADD_ROWS_CONTROLS_HEIGHT = 5; // reduced offset height
                viewportHeight.value = (bodyElement as HTMLElement).clientHeight - ADD_ROWS_CONTROLS_HEIGHT;
            }
        }

        // 초기 스크롤바 너비 계산
        nextTick(() => {
            updateHeaderPadding();
        });

        // 윈도우 리사이즈 리스너 추가
        window.addEventListener('resize', handleWindowResize);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', handleWindowResize);
    });

    return {
        gridContainerRef,
        gridHeaderRef,
        gridBodyRef,
        lastScrollLeft,
        viewportHeight,
        scrollbarWidth,
        visibleRows,
        totalHeight,
        paddingTop,
        getOriginalIndex,
        handleGridScroll,
        updateHeaderPadding,
        calculateScrollbarWidth,
        ensureCellIsVisible
    };
}
