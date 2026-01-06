
export type RegionType = 'busan' | 'daegu';

export interface RegionConfig {
    name: RegionType;
    label: string;
    splashText: string;
    mapUrl: string;
    instagram: string;
    instagramUrl: string;
    littlyUrl: string;
    partyTitle: string;
    metaDescription: string;
    dbTable: 'guests_busan' | 'guests_daegu';
    locationAddress: string;
}

export const REGION_CONFIG: Record<RegionType, RegionConfig> = {
    busan: {
        name: 'busan',
        label: 'Busan',
        splashText: '@wavy_busan',
        mapUrl: 'https://naver.me/Gmt0iPNm',
        instagram: '@wavy_busan',
        instagramUrl: 'https://www.instagram.com/wavy_busan/',
        littlyUrl: 'https://litt.ly/wavy_busan',
        partyTitle: 'Wavy_Busan',
        metaDescription: '부산 WAVY 파티 — 설레는 파티, 지금 초대장을 확인하세요.',
        dbTable: 'guests_busan',
        locationAddress: '부산광역시 수영구 민락로 22, 2층',
    },
    daegu: {
        name: 'daegu',
        label: 'Daegu',
        splashText: '@wavy_daegu',
        mapUrl: 'https://naver.me/xE6rT8yb',
        instagram: '@wavy_daegu',
        instagramUrl: 'https://www.instagram.com/wavy_daegu/',
        littlyUrl: 'https://litt.ly/wavy_daegu',
        partyTitle: 'Wavy_Daegu',
        metaDescription: '대구 WAVY 파티 — 설레는 파티, 지금 초대장을 확인하세요.',
        dbTable: 'guests_daegu',
        locationAddress: '대구광역시 서구 중리동 113-9, 지하1층',
    },
} as const;
