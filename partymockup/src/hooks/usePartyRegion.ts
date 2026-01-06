
import { REGION_CONFIG, RegionConfig } from '../config/partyRegion';

/**
 * Hook to get the current region configuration based on the URL path.
 * Defaults to Busan if no region is detected or for root path.
 */
export const usePartyRegion = (): RegionConfig => {
    // Default to Busan as requested
    return REGION_CONFIG.busan;
};
