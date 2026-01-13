/**
 * globalAccessWrapper.ts
 * 전역 객체 접근 래퍼
 * 전역 객체에 안전하게 접근하고 메모리 누수를 방지합니다.
 */

declare global {
  interface Window {
    [key: string]: any;
  }
}

/**
 * 전역 객체에서 안전하게 값을 가져오는 함수
 */
export function safeGetGlobal<T = any>(key: string, defaultValue: T | null = null): T | null {
    if (typeof window === 'undefined')
        return defaultValue;
    try {
        const value = window[key];
        return value !== undefined ? value : defaultValue;
    }
    catch (error) {
        console.warn(`[globalAccessWrapper] ${key} 접근 중 오류:`, error);
        return defaultValue;
    }
}

/**
 * 전역 객체에 안전하게 값을 설정하는 함수
 */
export function safeSetGlobal(key: string, value: any): boolean {
    if (typeof window === 'undefined')
        return false;
    try {
        window[key] = value;
        return true;
    }
    catch (error) {
        console.warn(`[globalAccessWrapper] ${key} 설정 중 오류:`, error);
        return false;
    }
}

/**
 * 전역 객체에서 안전하게 함수를 호출하는 함수
 */
export function safeCallGlobal<T = any>(functionName: string, args: any[] = [], fallback: T | null = null): T | null {
    if (typeof window === 'undefined')
        return fallback;
    try {
        const func = window[functionName];
        if (func && typeof func === 'function') {
            return func(...args);
        }
        return fallback;
    }
    catch (error) {
        console.warn(`[globalAccessWrapper] ${functionName} 호출 중 오류:`, error);
        return fallback;
    }
}

/**
 * 전역 객체에서 안전하게 속성에 접근하는 함수
 */
export function safeGetGlobalProperty<T = any>(objectKey: string, propertyKey: string, defaultValue: T | null = null): T | null {
    if (typeof window === 'undefined')
        return defaultValue;
    try {
        const obj = window[objectKey];
        if (obj && typeof obj === 'object') {
            const value = (obj as any)[propertyKey];
            return value !== undefined ? value : defaultValue;
        }
        return defaultValue;
    }
    catch (error) {
        console.warn(`[globalAccessWrapper] ${objectKey}.${propertyKey} 접근 중 오류:`, error);
        return defaultValue;
    }
}

/**
 * 전역 객체의 특정 키가 존재하는지 확인
 */
export function hasGlobalKey(key: string): boolean {
    if (typeof window === 'undefined')
        return false;
    try {
        return key in window;
    }
    catch (error) {
        console.warn(`[globalAccessWrapper] ${key} 존재 확인 중 오류:`, error);
        return false;
    }
}

/**
 * 전역 객체에서 특정 키를 안전하게 제거
 */
export function safeDeleteGlobal(key: string): boolean {
    if (typeof window === 'undefined')
        return false;
    try {
        delete window[key];
        return true;
    }
    catch (error) {
        console.warn(`[globalAccessWrapper] ${key} 제거 중 오류:`, error);
        return false;
    }
}
