/**
 * System Field IDs
 * Fixed IDs for system-managed fields
 */
export const SYSTEM_FIELDS = {
    NAME: 'name',
    PHONE: 'phone', // contact
    GENDER: 'gender',
    BIRTH_DATE: 'birth_date',
    LOCATION: 'location',
    JOB: 'job',
    INTRODUCTION: 'introduction',
    IDEAL_TYPE: 'ideal_type', // personality + appearance
    HOBBY: 'hobby',
    SCHEDULE: 'schedule', // participation availability
    PAYMENT_INFO: 'payment_info',
    NOTICE: 'notice',
    TICKET_OPTION: 'ticket_option',
    INSTAGRAM: 'instagram',
    REFUND_ACCOUNT: 'refund_account',
    HEIGHT: 'height',
    DRINKING: 'drinking',
    SMOKING: 'smoking',
    MBTI: 'mbti_selector'
} as const;

export type SystemField = typeof SYSTEM_FIELDS[keyof typeof SYSTEM_FIELDS];
