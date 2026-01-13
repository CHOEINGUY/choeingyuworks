/**
 * environmentUtils.ts
 * 환경 감지 및 적절한 처리 방식 선택 유틸리티
 */

/**
 * 현재 환경이 file:/// 프로토콜인지 확인
 */
export function isFileProtocol(): boolean {
  return window.location.protocol === 'file:';
}

/**
 * 웹 워커를 사용할 수 있는 환경인지 확인
 */
export function canUseWebWorkers(): boolean {
  // 개발 환경에서는 워커 사용을 비활성화 (웹팩 개발 서버 문제 방지)
  if ((import.meta as any).env?.MODE === 'development') {
    return false;
  }
  return typeof Worker !== 'undefined' && !isFileProtocol();
}

/**
 * requestIdleCallback을 사용할 수 있는지 확인
 */
export function canUseIdleCallback(): boolean {
  return typeof window.requestIdleCallback !== 'undefined' || 
         typeof window.requestAnimationFrame !== 'undefined';
}

export type ProcessingMode = 'worker' | 'idle' | 'sync';

/**
 * 환경에 따른 최적의 처리 방식을 반환
 */
export function getOptimalProcessingMode(): ProcessingMode {
  // 개발 환경에서는 항상 idle 모드 사용
  if ((import.meta as any).env?.MODE === 'development') {
    return 'idle';
  }
  
  if (canUseWebWorkers()) {
    return 'worker';
  }
  if (canUseIdleCallback()) {
    return 'idle';
  }
  return 'sync';
}

export interface ProcessingOptions {
  useWorker?: boolean;
  useAsyncProcessor?: boolean;
  chunkSize?: number | null;
  [key: string]: any;
}

/**
 * 처리 방식 선택을 위한 옵션 객체 생성
 */
export function createProcessingOptions(options: ProcessingOptions = {}): ProcessingOptions {
  const optimalMode = getOptimalProcessingMode();
  
  return {
    // 기본값
    useWorker: false,
    useAsyncProcessor: true,
    chunkSize: 100,
    
    // 환경에 따른 자동 설정
    ...(optimalMode === 'worker' && { useWorker: true }),
    ...(optimalMode === 'idle' && { useAsyncProcessor: true }),
    ...(optimalMode === 'sync' && { useAsyncProcessor: false, chunkSize: null }),
    
    // 사용자 옵션으로 덮어쓰기
    ...options
  };
} 

export interface FeatureFlags {
  ADMIN_PANEL: boolean;
  DATA_SYNC: boolean;
  USER_MANAGEMENT: boolean;
}

export interface EnvConfig {
  REQUIRE_AUTH: boolean;
  IS_DEVELOPMENT: boolean;
  API_BASE_URL: string;
  FEATURES: FeatureFlags;
}

/**
 * 환경 설정 관리
 */
export const environmentConfig: EnvConfig = {
  // 로그인 모드 설정 (true: 로그인 필요, false: 로그인 불필요)
  REQUIRE_AUTH: process.env.VUE_APP_REQUIRE_AUTH !== 'false',
  
  // 개발 모드 설정
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // API URL 설정
  API_BASE_URL: process.env.VUE_APP_API_BASE_URL || 'https://your-worker.your-subdomain.workers.dev',
  
  // 기능 플래그
  FEATURES: {
    // 관리자 패널 활성화 여부
    ADMIN_PANEL: process.env.VUE_APP_ENABLE_ADMIN_PANEL !== 'false',
    
    // 데이터 동기화 활성화 여부
    DATA_SYNC: process.env.VUE_APP_ENABLE_DATA_SYNC !== 'false',
    
    // 사용자 관리 활성화 여부
    USER_MANAGEMENT: process.env.VUE_APP_ENABLE_USER_MANAGEMENT !== 'false'
  }
};

/**
 * 현재 환경이 로그인을 요구하는지 확인
 */
export function isAuthRequired(): boolean {
  return environmentConfig.REQUIRE_AUTH;
}

/**
 * 현재 환경이 개발 모드인지 확인
 */
export function isDevelopment(): boolean {
  return environmentConfig.IS_DEVELOPMENT;
}

/**
 * 특정 기능이 활성화되어 있는지 확인
 */
export function isFeatureEnabled(featureName: keyof FeatureFlags): boolean {
  return environmentConfig.FEATURES[featureName] || false;
}

/**
 * 환경 정보를 콘솔에 출력 (개발 모드에서만)
 */
export function logEnvironmentInfo(): void {
  if (isDevelopment()) {
    console.log('🌍 환경 설정:', {
      REQUIRE_AUTH: isAuthRequired(),
      IS_DEVELOPMENT: isDevelopment(),
      API_BASE_URL: environmentConfig.API_BASE_URL,
      FEATURES: environmentConfig.FEATURES
    });
  }
}
