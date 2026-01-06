/**
 * 문항 전환 애니메이션 설정
 * Smore 스타일의 다양한 전환 효과
 */

export interface HelperAnimation {
    name: string;
    enter: string;
    exit: string;
}

export const TRANSITION_ANIMATIONS: Record<string, HelperAnimation> = {
    // 슬라이드 - 왼쪽으로 밀려남
    slide: {
        name: "슬라이드",
        enter: "animate-slide-in-right",
        exit: "animate-slide-out-left"
    },

    // 페이드 - 부드럽게 사라지고 나타남
    fade: {
        name: "페이드",
        enter: "animate-in fade-in duration-500",
        exit: "animate-out fade-out duration-300"
    },

    // 줌 - 확대되며 등장
    zoom: {
        name: "줌",
        enter: "animate-in zoom-in-95 fade-in duration-500",
        exit: "animate-out zoom-out-95 fade-out duration-300"
    },

    // 플립 - 3D 회전 효과
    flip: {
        name: "플립",
        enter: "animate-in flip-in fade-in duration-600",
        exit: "animate-out flip-out fade-out duration-400"
    }
};

export const getTransitionAnimation = (type: string): HelperAnimation => {
    return TRANSITION_ANIMATIONS[type] || TRANSITION_ANIMATIONS.slide;
};
