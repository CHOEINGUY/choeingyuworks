import { useState, useEffect } from 'react';

export interface SessionConfig {
    roundDuration: number | string;
    breakDuration: number | string;
    themeMode: string;
    themeStyle: string;
    [key: string]: any;
}

/**
 * Hook to manage Session Configuration State (Timer & Theme)
 * Centralizes the logic for parsing inputs and syncing with parent config.
 */
export const useSessionSettings = (initialConfig: Partial<SessionConfig>, onUpdate?: (config: SessionConfig) => void) => {

    // Default Config Structure
    const defaultConfig: SessionConfig = {
        roundDuration: 900,
        breakDuration: 300,
        themeMode: 'day',
        themeStyle: 'standard'
    };

    // Merge provided config with defaults
    const getConfig = (conf: Partial<SessionConfig>): SessionConfig => ({ ...defaultConfig, ...conf });

    const [localConfig, setLocalConfig] = useState<SessionConfig>(getConfig(initialConfig));

    // Sync when initialConfig changes (e.g. background update)
    useEffect(() => {
        setLocalConfig(getConfig(initialConfig));
    }, [initialConfig]);


    // Handlers
    const handleChange = (key: string, value: any) => {
        setLocalConfig(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleTimeChange = (type: 'round' | 'break', value: string | number) => {
        // Allow empty string for better UX during typing
        if (value === '') {
            handleChange(type === 'round' ? 'roundDuration' : 'breakDuration', '');
            return;
        }

        const numVal = typeof value === 'string' ? parseInt(value, 10) : value;
        if (isNaN(numVal) || numVal < 0) return;

        handleChange(type === 'round' ? 'roundDuration' : 'breakDuration', numVal);
    };

    // Save Action
    const saveSettings = () => {
        // Ensure numbers are integers before saving
        const finalConfig: SessionConfig = {
            ...localConfig,
            roundDuration: parseInt(String(localConfig.roundDuration || 0), 10),
            breakDuration: parseInt(String(localConfig.breakDuration || 0), 10)
        };

        if (onUpdate) {
            onUpdate(finalConfig);
        }
        return finalConfig;
    };

    return {
        config: localConfig,
        handleChange,
        handleTimeChange,
        saveSettings
    };
};
