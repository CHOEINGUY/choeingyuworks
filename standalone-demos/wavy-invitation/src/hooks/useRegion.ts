
import { useLocation } from 'react-router-dom';
import { REGION_CONFIG, RegionConfig } from '../config/region';

/**
 * Hook to get the current region configuration based on the URL path.
 * Defaults to Busan if no region is detected or for root path.
 */
export const useRegion = (): RegionConfig => {
    const location = useLocation();

    // Check if path starts with /d (Daegu)
    // You can iterate over config keys if you have more regions later
    if (location.pathname.startsWith('/d')) {
        return REGION_CONFIG.daegu;
    }

    // Default to Busan (covers /b and root /)
    return REGION_CONFIG.busan;
};
