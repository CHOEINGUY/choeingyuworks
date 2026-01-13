/**
 * workerUtils.ts
 * 웹 워커 사용 가능 여부를 감지하는 유틸리티
 */

interface EnvInfo {
  protocol: string;
  hostname: string;
  isWorkerSupported: boolean;
  mode: string;
  userAgent: string;
}

/**
 * 워커를 안전하게 생성할 수 있는지 확인
 */
export function canSafelyCreateWorker(): boolean {
  // 기본 워커 지원 확인
  if (typeof Worker === 'undefined') {
    return false;
  }

  // file:/// 프로토콜 확인
  if (window.location.protocol === 'file:') {
    return false;
  }

  // 개발 환경 확인 (웹팩 개발 서버 문제 방지)
  if ((import.meta as any).env?.MODE === 'development') {
    return false;
  }

  // localhost 확인 (개발 서버 문제 방지)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return false;
  }

  return true;
}

/**
 * 워커를 안전하게 생성
 * @param {string} workerUrl - 워커 스크립트 URL
 * @param {Object} options - 워커 옵션
 * @returns {Worker|null} - 성공시 Worker 인스턴스, 실패시 null
 */
export function createWorkerSafely(workerUrl: string | URL, options: WorkerOptions = {}): Worker | null {
  if (!canSafelyCreateWorker()) {
    console.log('[WorkerUtils] Worker creation skipped due to environment constraints');
    return null;
  }

  try {
    const worker = new Worker(workerUrl, { type: 'module', ...options });
    
    // 워커 오류 처리
    worker.onerror = (error) => {
      console.warn('[WorkerUtils] Worker error:', error);
      worker.terminate();
    };

    return worker;
  } catch (error) {
    console.warn('[WorkerUtils] Failed to create worker:', error);
    return null;
  }
}

/**
 * 워커 사용 권장 여부 확인
 */
export function shouldUseWorkers(): boolean {
  // 프로덕션 환경에서만 워커 사용 권장
  return (import.meta as any).env?.MODE === 'production' && canSafelyCreateWorker();
}

/**
 * 환경에 따른 워커 사용 권장 여부
 * @param {number} dataSize - 처리할 데이터 크기
 */
export function shouldUseWorker(dataSize: number = 0): boolean {
  if (!canSafelyCreateWorker()) {
    return false;
  }

  // 개발 환경에서는 작은 데이터도 워커 사용 (테스트용)
  if ((import.meta as any).env?.MODE === 'development') {
    return dataSize > 100;
  }

  // 프로덕션에서는 큰 데이터만 워커 사용
  return dataSize > 1000;
}

/**
 * 환경 정보 로깅
 */
export function logEnvironmentInfo(): EnvInfo {
  const info: EnvInfo = {
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    isWorkerSupported: canSafelyCreateWorker(),
    mode: (import.meta as any).env?.MODE || 'unknown',
    userAgent: navigator.userAgent
  };
  
  console.log('[workerUtils] Environment info:', info);
  return info;
} 
