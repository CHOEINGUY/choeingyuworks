"use client";

import { useEffect } from 'react';

export const useScrollTrap = (ref: React.RefObject<HTMLElement | null>, isActive: boolean) => {
    useEffect(() => {
        const element = ref.current;
        if (!element || !isActive) return;

        const onWheel = (e: WheelEvent) => {
            const { scrollTop, scrollHeight, clientHeight } = element;
            const isAtTop = scrollTop === 0;
            const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

            if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                e.preventDefault();
            }
            e.stopPropagation();
        };

        const onTouchMove = (e: TouchEvent) => { e.stopPropagation(); }

        element.addEventListener('wheel', onWheel, { passive: false });
        element.addEventListener('touchmove', onTouchMove, { passive: false });

        return () => {
            element.removeEventListener('wheel', onWheel);
            element.removeEventListener('touchmove', onTouchMove);
        };
    }, [isActive, ref]);
};
