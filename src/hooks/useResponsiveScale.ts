"use client";

import { useState, useEffect } from 'react';

/**
 * Returns a responsive scale value based on screen width.
 * - Desktop (lg+): 1.0
 * - Tablet (md): 0.8
 * - Mobile (sm-): 0.6
 */
export function useResponsiveScale() {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                setScale(1.0);
            } else if (width >= 768) {
                setScale(0.8);
            } else {
                setScale(0.6);
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    return scale;
}
