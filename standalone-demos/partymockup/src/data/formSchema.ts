/**
 * 폼 빌더 스키마 정의
 * 
 * 시스템 필드 (System Fields): 고정 ID, 프로필 카드 내 지정석 존재
 * 커스텀 필드 (Custom Fields): UUID, 프로필 카드 내 "추가 정보" 란에 순차 배치
 */

import { SYSTEM_FIELDS } from '../constants/systemFields';
import { MANDATORY_PRESETS, CORE_PRESETS, ADDON_PRESETS, Preset } from './formPresets';

// Re-export SYSTEM_FIELDS for backward compatibility
export { SYSTEM_FIELDS };

// Flatten presets to create the mock schema (Reset Target)
// Note: We remove React Elements (icons) from presets before creating schema if strictly needed,
// but for DEFAULT_FORM_SCHEMA which is used for questions state, it's fine as questions don't strictly need icons 
// (though TemplateToolbar adds them).
// However, FormBuilder copies properties. Let's map it clean.

const cleanPreset = (preset: Preset): Omit<Preset, 'icon'> => {
    const { icon, ...rest } = preset;
    return rest;
};

// Define Schema Type derived from Preset but without Icon? Or compatible
export type FormSchemaItem = Omit<Preset, 'icon'> & {
    id: string; // Ensure ID is present
};

export const DEFAULT_FORM_SCHEMA: FormSchemaItem[] = [
    // 1. Mandatory
    ...MANDATORY_PRESETS.map(cleanPreset),

    // 2. Core (Optional but recommended in Schema) - Let's include CORE by default for the "Mock" or "Reset" state
    ...CORE_PRESETS.map(cleanPreset),

    // 3. Add-on examples (Commented out or selected ones?)
    // Let's keep the original DEFAULT_FORM_SCHEMA style: basic mandatory + some core + some custom examples

    // Actually, the user wants "Reset" to be useful.
    // The previous DEFAULT_FORM_SCHEMA had: Name, Phone, Gender, Birthdate, Job, Location, Intro, Hobby, IdealType(custom-ish), Schedule, Payment.

    // Let's add them systematically.
    // Ideal Type is missing from Core/Addons? Let's check presets.
    // Ideal Type was in old schema but not in new presets explicitly?
    // It was SYSTEM_FIELDS.IDEAL_TYPE.

    // Wait, in step 48 (TemplateToolbar), IDEAL_TYPE was NOT in the lists!
    // But in step 39 (FormSchema), it WAS there.
    // Use Case: The user might have removed it from toolbar or I missed it.
    // I should add "Ideal Type" to ADDON_PRESETS if it's important, or just defined it here as custom.

    {
        id: SYSTEM_FIELDS.IDEAL_TYPE,
        type: 'long_text',
        title: '어떤 이성스타일을 선호하시나요?',
        // @ts-ignore
        subtitle: '외모, 성격 등 구체적일수록 좋아요.', // subtitle is potentially valid prop not in Preset interface yet
        required: false,
        isSystem: true,
        adminProps: { cardLabel: '이상형', showInCard: true }
    } as any,

    // Custom Examples
    {
        id: SYSTEM_FIELDS.DRINKING,
        type: 'single_choice',
        title: '음주 습관은 어떻게 되시나요?',
        options: ['전혀 안 함', '특별한 날에만', '가끔 즐김', '자주 즐김'],
        required: false,
        isSystem: true,
        adminProps: { cardLabel: '음주', showInCard: true }
    } as any
];
