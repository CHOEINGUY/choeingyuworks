/**
 * 토스트 시스템 로직
 *
 * 토스트 메시지 표시, 확인 다이얼로그 등을 관리합니다.
 */
import { ref, type Ref } from 'vue';

export type ToastType = 'info' | 'success' | 'error' | 'warning' | 'confirm';

export interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
    timestamp?: number;
    onConfirm?: () => void;
    onCancel?: () => void;
}

// 토스트 상태 관리
const toasts: Ref<ToastItem[]> = ref([]);
let toastIdCounter = 0;

/**
 * 토스트 메시지를 표시합니다
 * @param {string} message - 표시할 메시지
 * @param {ToastType} type - 토스트 타입 ('info', 'success', 'error', 'warning')
 * @param {number} duration - 표시 시간 (ms), 0이면 자동 삭제하지 않음
 */
export function showToast(message: string, type: ToastType = 'info', duration = 3000): void {
    const id = ++toastIdCounter;
    const toast: ToastItem = {
        id,
        message,
        type,
        timestamp: Date.now()
    };
    toasts.value.push(toast);
    // 최대 3개까지만 표시
    if (toasts.value.length > 3) {
        toasts.value.shift();
    }
    if (duration > 0) {
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }
}

/**
 * 토스트를 제거합니다
 * @param {number} id - 제거할 토스트 ID
 */
export function removeToast(id: number): void {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index > -1) {
        toasts.value.splice(index, 1);
    }
}

/**
 * 확인/취소 버튼이 있는 토스트를 표시합니다
 * @param {string} message - 표시할 메시지
 * @returns {Promise<boolean>} 확인 시 true, 취소 시 false
 */
export function showConfirmToast(message: string): Promise<boolean> {
    return new Promise((resolve) => {
        const id = ++toastIdCounter;
        console.log('showConfirmToast called', id); // Debug: Force HMR
        const toast: ToastItem = {
            id,
            message,
            type: 'confirm',
            onConfirm: () => {
                removeToast(id);
                resolve(true);
            },
            onCancel: () => {
                removeToast(id);
                resolve(false);
            }
        };
        toasts.value.push(toast);
        // 최대 3개까지만 표시
        if (toasts.value.length > 3) {
            toasts.value.shift();
        }
    });
}

/**
 * 토스트 상태를 반환하는 컴포저블
 */
export function useToast() {
    return {
        toasts,
        showToast,
        removeToast,
        showConfirmToast
    };
}
