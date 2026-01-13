export const BRAND_CONFIG = {
    // Active mode: 'personal' (Choeingyu) or 'agency' (Lindy Works)
    mode: 'personal' as const, 

    personal: {
        mode: 'personal' as const,
        mainText: 'Choeingyu',
        subText: 'Works', // Optional hover text
        logoText: 'Choeingyu Works',
        showSubTextOnHover: true,
        hero: {
            showRequestButton: false, // Hide "Service Request"
        },
        footer: {
            copyrightName: 'Choeingyu Works',
            showBusinessInfo: false, // Hide business number
        }
    },
    agency: {
        mode: 'agency' as const,
        mainText: 'Lindy',
        subText: 'Works',
        logoText: 'Lindy Works',
        showSubTextOnHover: true,
        hero: {
            showRequestButton: true,
        },
        footer: {
            copyrightName: 'Lindy Works',
            showBusinessInfo: true,
        }
    }
};

export const CURRENT_BRAND = BRAND_CONFIG[BRAND_CONFIG.mode];
