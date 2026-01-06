import { ReactNode } from 'react';

export interface FormOption {
    label: string;
    value: string;
    price?: number;
    [key: string]: any;
}

export interface ValidationRules {
    minAge?: number;
    maxAge?: number;
    minLength?: number;
    maxLength?: number;
    [key: string]: any;
}

export interface Question {
    id: string;
    type: string;
    title: string;
    description?: string;
    required?: boolean;
    order?: number;
    options?: (FormOption | string)[]; // Can be string for simple cases or FormOption object
    placeholder?: string;

    // System / Locked props
    isLocked?: boolean;
    isSystem?: boolean;
    isTypeLocked?: boolean;
    isSessionSelector?: boolean;
    isTicket?: boolean;
    storeRawValue?: boolean; // [NEW] If true, saves the code/value instead of the label

    // Admin Props
    adminProps?: {
        cardLabel?: string;
        [key: string]: any;
    };

    // Show in Review
    showInReview?: boolean;

    // Allow Other (Direct Input)
    allowOther?: boolean;

    // Payment specific
    paymentDetails?: string;
    bankName?: string;
    accountHolder?: string;
    accountNumber?: string;
    otherInfo?: string;

    // Validation
    validation?: ValidationRules;

    [key: string]: any;
}

export interface FormGlobalPrices {
    male?: number;
    female?: number;
    [key: string]: any;
}

export interface CompletionPageConfig {
    title?: string;
    description?: string;
}

export interface FormSettings {
    title?: string;
    description?: string;
    coverImage?: string;
    logoImage?: string; // [NEW] Custom Logo Image
    theme?: 'light' | 'dark';
    themeColor?: string;
    pricingMode?: 'fixed' | 'option';
    // Design Settings
    fontFamily?: 'PRETENDARD' | 'NOTO_SERIF' | 'NANUM_SQUARE';
    buttonStyle?: 'rounded' | 'square' | 'pill';
    layoutDensity?: 'comfortable' | 'compact';

    // Multiple Choice Options Design
    optionStyle?: 'rounded' | 'square' | 'pill'; // Separate option shape
    optionAlign?: 'left' | 'center';
    optionSize?: 'sm' | 'md' | 'lg';

    globalPrices?: FormGlobalPrices;
    completionPage?: CompletionPageConfig;
    fields?: Question[];
    [key: string]: any;
}

export interface PresetItem extends Partial<Question> {
    icon?: ReactNode;
    label?: string; // For toolbar display
    type: string; // override Question.type if needed for Group logic 'group'
    fields?: Question[]; // For groups
}
