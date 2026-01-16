import type { ComponentType } from 'react';

export interface SceneConfig {
    id: string;
    component: ComponentType<{ onComplete: () => void; isActive?: boolean }>;
    url: string;
    title: string;
    enTitle: string;
    width?: number; // Override default mobile width
    mobileWidth?: number; // Width when in mobile view (if different)
    isMobileFrame?: boolean; // Whether to show phone frame
    hideAddressBar?: boolean;
}

export interface PartySolutionDemoProps {
    isEmbedded?: boolean;
    scale?: number;
    className?: string;
    isActive?: boolean;
}
