import { ref, computed, type CSSProperties, type Ref, type ComputedRef } from 'vue';

interface UseTooltipReturn {
    activeTooltip: Ref<string | null>;
    tooltipText: Ref<string>;
    tooltipAnchor: Ref<HTMLElement | null>;
    tooltipStyle: ComputedRef<CSSProperties>;
    showTooltip: (key: string, text: string, event: MouseEvent) => void;
    hideTooltip: () => void;
}

/**
 * 툴팁 시스템 composable
 * @returns {UseTooltipReturn} 툴팁 관련 상태와 함수들
 */
export function useTooltip(): UseTooltipReturn {
    const activeTooltip = ref<string | null>(null);
    const tooltipText = ref<string>('');
    const tooltipAnchor = ref<HTMLElement | null>(null);

    const tooltipStyle = computed((): CSSProperties => {
        if (!activeTooltip.value || !tooltipAnchor.value)
            return { display: 'none' };
        
        const anchor = tooltipAnchor.value;
        const parentRect = anchor.offsetParent 
            ? anchor.offsetParent.getBoundingClientRect() 
            : { left: 0, top: 0, width: 0, height: 0, bottom: 0, right: 0 };
            
        const rect = anchor.getBoundingClientRect();
        const left = rect.left - parentRect.left + rect.width / 2;
        let bottom = parentRect.height - (rect.top - parentRect.top) + 5;
        const transform = 'translateX(-50%)';
        
        // 화면 위로 나가면 아래로 보정
        if (rect.top - 40 < 0) {
            bottom = parentRect.height - (rect.bottom - parentRect.top) - rect.height - 5;
        }
        
        return {
            position: 'absolute',
            bottom: `calc(${bottom}px)`,
            left: `${left}px`,
            transform,
            zIndex: 1050
        };
    });

    /**
     * 툴팁 표시
     * @param {string} key - 툴팁 식별자
     * @param {string} text - 툴팁 텍스트
     * @param {MouseEvent} event - 마우스 이벤트
     */
    const showTooltip = (key: string, text: string, event: MouseEvent) => {
        activeTooltip.value = key;
        tooltipText.value = text;
        tooltipAnchor.value = event.target as HTMLElement;
    };

    /**
     * 툴팁 숨기기
     */
    const hideTooltip = () => {
        activeTooltip.value = null;
        tooltipAnchor.value = null;
    };

    return {
        activeTooltip,
        tooltipText,
        tooltipAnchor,
        tooltipStyle,
        showTooltip,
        hideTooltip
    };
}
