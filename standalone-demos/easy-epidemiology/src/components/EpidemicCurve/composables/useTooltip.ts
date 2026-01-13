// useTooltip.ts - 툴팁 상태 관리 (EpidemicCurve용)
import { ref, type Ref } from 'vue';

interface UseTooltipReturn {
    activeTooltip: Ref<string | null>;
    tooltipText: Ref<string>;
    showTooltip: (key: string, text: string) => void;
    hideTooltip: () => void;
}

export function useTooltip(): UseTooltipReturn {
    const activeTooltip = ref<string | null>(null);
    const tooltipText = ref<string>('');

    const showTooltip = (key: string, text: string) => {
        activeTooltip.value = key;
        tooltipText.value = text;
    };

    const hideTooltip = () => {
        activeTooltip.value = null;
    };

    return {
        activeTooltip,
        tooltipText,
        showTooltip,
        hideTooltip
    };
}
