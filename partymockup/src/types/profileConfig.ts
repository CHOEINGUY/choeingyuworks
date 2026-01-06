
import { Question } from './formConfig';

// Profile Field extends Question but might have profile-specific props
export interface ProfileField extends Question {
    sectionId?: string;
    label?: string; // Profile builder uses label as primary name often
    isLabelLocked?: boolean;
    readOnly?: boolean;
    // Profile specific props
    showInCard?: boolean;
    showInPartnerView?: boolean; // Controls visibility in the Partner Viewer (Readonly)
}

export interface ProfileSection {
    id: string;
    title: string;
    description?: string;
    // [NEW] Viewer-specific text
    viewerTitle?: string;
    viewerDescription?: string;
    fields: ProfileField[];
    isSystem?: boolean;
    [key: string]: any;
}

export interface ProfileDesign {
    themeMode?: 'light' | 'dark';
    themeColor?: string;
    borderStyle?: 'rounded' | 'sharp';
    [key: string]: any;
}

export interface ProfileConfig {
    title?: string;
    description?: string; // [NEW] Cover Description
    coverImage?: string; // [NEW] Cover Image URL
    logoImage?: string; // [NEW] Custom Logo URL
    updatedAt?: string;
    design?: ProfileDesign;
    sections: ProfileSection[];
    [key: string]: any;
}

export interface ProfileBuilderActions {
    addSection: (data?: Partial<ProfileSection> & { atIndex?: number }) => void;
    updateSection: (sectionId: string, updates: Partial<ProfileSection>) => void;
    deleteSection: (sectionId: string) => void;
    reorderSections: (activeId: string, overId: string) => void;
    addField: (sectionId: string, template: Partial<ProfileField>) => void;
    updateField: (sectionId: string, fieldId: string, updates: Partial<ProfileField>) => void;
    deleteField: (sectionId: string, fieldId: string) => void;
    reorderFields: (sectionId: string, activeId: string, overId: string) => void;
    moveFieldToSection: (sourceSectionId: string, targetSectionId: string, fieldId: string, overId?: string) => void;
    updateConfig: (updates: Partial<ProfileConfig>) => void;
    selectItem?: (item: { type: 'section' | 'field', id: string, sectionId?: string } | null) => void;
}
