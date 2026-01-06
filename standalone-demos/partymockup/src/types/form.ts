
import { FieldType } from '../constants/fieldTypes';

export interface FormOption {
    label: string;
    value: string | number;
    emoji?: string;
    districts?: string[]; // For RegionField
}

export interface FormField {
    id: string;
    type: FieldType | string; // Allow string for flexibility or legacy
    label: string;
    description?: string;
    required?: boolean;
    placeholder?: string;
    order?: number;
    options?: FormOption[] | string[] | any[];
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        minLength?: number;
        maxLength?: number;
        maxSelect?: number; // For MultipleChoice
        maxSize?: number; // For ImageUpload
        allowedTypes?: string[]; // For ImageUpload
        customMessage?: string;
    };
    isSystem?: boolean; // Added for admin usage
    allowOther?: boolean; // Allow "Other" option with direct input
    [key: string]: any;
}

export interface FormResponse {
    [fieldId: string]: any;
}

export interface ListMode {
    key: string;
    label: string;
}

// [NEW] Added for Admin Form Builder
export interface FormCompletionPage {
    title: string;
    description: string;
}

export interface FormConfig {
    title: string;
    theme: string;
    transitionAnimation: string;
    logoText: string;
    description: string;
    completionPage: FormCompletionPage;
    pricingMode: 'option' | 'fixed';
    globalPrices: {
        male: number;
        female: number;
    };
    fields?: FormField[];
}

export type FormMode = 'rotation' | 'party' | 'match';

export interface Feedback {
    id?: string;
    rating: number;
    note: string;
    fromUserId: string;
    toUserId?: string;
    sessionId?: string;
    roomId?: string;
    createdAt?: any;
    [key: string]: any;
}

export interface Selection {
    userId: string;
    selectedPartnerIds: string[];
    createdAt?: any;
    [key: string]: any;
}
