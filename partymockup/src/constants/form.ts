
import { FormMode } from '../types/form';

export const FORM_MODES = {
    ROTATION: 'rotation' as FormMode,
    PARTY: 'party' as FormMode,
    MATCH: 'match' as FormMode,
};

export const FORM_MODE_LABELS = {
    [FORM_MODES.ROTATION]: '로테이션 소개팅',
    [FORM_MODES.PARTY]: '프라이빗 파티',
    [FORM_MODES.MATCH]: '1:1 매칭',
};

export const FORM_MODE_DESCRIPTIONS = {
    [FORM_MODES.ROTATION]: '기본 신청서 (users)',
    [FORM_MODES.PARTY]: '파티 참가 신청서 (users)',
    [FORM_MODES.MATCH]: '프리미엄 매칭 신청서 (premium_pool)',
};
