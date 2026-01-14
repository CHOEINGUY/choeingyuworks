"use client";

import { useState, useEffect } from 'react';

/**
 * Returns a responsive scale value based on screen width.
 * - All sizes: 1.0 (demos handle their own internal scaling)
 * 
 * Note: We removed the 0.6 mobile scale because it made demos too small
 * with too much whitespace. Individual demos already have their own
 * base scale factors (0.55, 0.8, 0.95) which work well at all sizes.
 */
export function useResponsiveScale() {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            // Return 1.0 for all screen sizes
            // Each demo component has its own appropriate base scale
            setScale(1.0);
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    return scale;
}

