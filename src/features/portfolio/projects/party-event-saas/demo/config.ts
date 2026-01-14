import { FormScene } from './scenes/FormScene';
import { AdminScene } from './scenes/AdminScene';
import { SMSScene } from './scenes/SMSScene';
import { QRScene } from './scenes/QRScene';
import { WelcomeScene } from './scenes/WelcomeScene';
import type { SceneConfig } from './types';

export const UI_CONSTANTS = {
    SCALE: {
        EMBEDDED_DEFAULT: 0.55,
        ADMIN_MOBILE_MULTIPLIER: 0.94,
    },
    DIMENSIONS: {
        MOBILE_WIDTH: 375,
        ADMIN_WIDTH_DESKTOP: 1000,
        ADMIN_WIDTH_MOBILE: 600,
        HEIGHT: 700,
        STATIC_WIDTH: 400,
    }
} as const;

export const SCENES: SceneConfig[] = [
    {
        id: 'form',
        component: FormScene,
        url: 'lindy.party/apply',
        title: '신청서 작성',
        enTitle: 'User Application',
        width: UI_CONSTANTS.DIMENSIONS.MOBILE_WIDTH,
        isMobileFrame: true
    },
    {
        id: 'admin',
        component: AdminScene,
        url: 'admin.lindy.party',
        title: '관리자 승인',
        enTitle: 'Admin Approval',
        width: UI_CONSTANTS.DIMENSIONS.ADMIN_WIDTH_DESKTOP,
        mobileWidth: UI_CONSTANTS.DIMENSIONS.ADMIN_WIDTH_MOBILE,
        isMobileFrame: false // Desktop browser look
    },
    {
        id: 'sms',
        component: SMSScene,
        url: 'Messages',
        title: '문자 발송',
        enTitle: 'Invitation SMS',
        width: UI_CONSTANTS.DIMENSIONS.MOBILE_WIDTH,
        isMobileFrame: true,
        hideAddressBar: true
    },
    {
        id: 'qr',
        component: QRScene,
        url: 'lindy.party/invitation',
        title: 'QR 체크인',
        enTitle: 'QR Check-in',
        width: UI_CONSTANTS.DIMENSIONS.MOBILE_WIDTH,
        isMobileFrame: true
    },
    {
        id: 'welcome',
        component: WelcomeScene,
        url: 'lindy.party/welcome',
        title: '환영 메시지',
        enTitle: 'Welcome',
        width: UI_CONSTANTS.DIMENSIONS.MOBILE_WIDTH,
        isMobileFrame: true
    }
];
