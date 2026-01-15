import { useState, useEffect } from 'react';

/**
 * Default breakpoint width for mobile detection (768px).
 * Matches Tailwind CSS 'md' breakpoint.
 */
const MOBILE_BREAKPOINT = 768;

/**
 * React hook that detects if the current viewport is mobile-sized.
 * Updates automatically on window resize.
 * 
 * @param breakpoint - Width threshold in pixels. Default is 768 (md breakpoint).
 *                     Returns true if window.innerWidth < breakpoint.
 * @returns `true` if viewport is less than breakpoint, `false` otherwise.
 * 
 * @example
 * // Default usage (768px breakpoint)
 * const isMobile = useMobile();
 * 
 * @example
 * // Custom breakpoint (1024px for tablet)
 * const isTablet = useMobile(1024);
 * 
 * @example
 * // Conditional rendering
 * const isMobile = useMobile();
 * return isMobile ? <MobileNav /> : <DesktopNav />;
 * 
 * @remarks
 * - SSR safe: Initial value is `false` to avoid hydration mismatch.
 * - Debouncing: None applied. For high-frequency updates, consider debouncing.
 * - Cleanup: Properly removes event listener on unmount.
 */
export function useMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        /**
         * Checks current window width against breakpoint.
         * Called on mount and every resize event.
         */
        const checkMobile = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        // Initial check
        checkMobile();

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);

    return isMobile;
}
