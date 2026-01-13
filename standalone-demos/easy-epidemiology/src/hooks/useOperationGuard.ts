/**
 * 작업 가드를 위한 Vue 컴포지션 API 훅
 * 비동기 작업의 경쟁 상태를 방지합니다.
 */

import { computed, ComputedRef } from 'vue';
import globalOperationManager from '../utils/globalOperationManager';
import { showToast } from '../components/DataInputVirtualScroll/logic/toast';

interface OperationOptions {
  blocking?: boolean;
  timeout?: number;
  [key: string]: any;
}

interface GuardOptions {
  showBlockedMessage?: boolean;
  blockedMessage?: string;
}

interface OperationGuardReturn {
  isBlocked: ComputedRef<boolean>;
  tryStartOperation: (operationName: string, operationOptions?: OperationOptions) => boolean;
  endOperation: (operationName: string) => void;
  isOperationActive: (operationName: string) => boolean;
  wrapOperation: <T extends unknown[], R>(operationName: string, operationFunction: (...args: T) => Promise<R>, options?: OperationOptions) => (...args: T) => Promise<R | false>;
  executeIfNotBlocked: (operationName: string, operationFunction: () => Promise<void> | void, options?: OperationOptions) => Promise<boolean>;
}

/**
 * 작업 가드 훅
 * @param {GuardOptions} options - 설정 옵션
 * @returns {OperationGuardReturn} 작업 가드 메서드들
 */
export function useOperationGuard(options: GuardOptions = {}, t?: (key: string) => string): OperationGuardReturn {
  const {
    showBlockedMessage = true,
    blockedMessage = ''
  } = options;

  const finalBlockedMessage = blockedMessage || (t ? t('common.operationBlocked') : '또 다른 작업이 진행 중입니다.');

  /**
   * 작업이 차단되었는지 확인
   */
  const isBlocked = computed<boolean>(() => globalOperationManager.hasBlockingOperations());

  /**
   * 작업 시작을 시도하고 성공 여부를 반환
   * @param {string} operationName - 작업 이름
   * @param {OperationOptions} operationOptions - 작업 옵션
   * @returns {boolean} 작업 시작 성공 여부
   */
  const tryStartOperation = (operationName: string, operationOptions: OperationOptions = {}): boolean => {
    const success = globalOperationManager.startOperation(operationName, operationOptions);
    
    if (!success && showBlockedMessage) {
      showToast(finalBlockedMessage, 'warning');
    }
    
    return success;
  };

  /**
   * 작업 종료
   * @param {string} operationName - 작업 이름
   */
  const endOperation = (operationName: string): void => {
    globalOperationManager.endOperation(operationName);
  };

  /**
   * 특정 작업이 실행 중인지 확인
   * @param {string} operationName - 작업 이름
   * @returns {boolean}
   */
  const isOperationActive = (operationName: string): boolean => {
    return globalOperationManager.isOperationActive(operationName);
  };

  /**
   * 작업을 래핑하는 함수 생성
   * @param {string} operationName - 작업 이름
   * @param {Function} operationFunction - 실행할 함수
   * @param {OperationOptions} options - 옵션
   * @returns {Function} 래핑된 함수
   */
  const wrapOperation = <T extends unknown[], R>(
    operationName: string, 
    operationFunction: (...args: T) => Promise<R>, 
    options: OperationOptions = {}
  ): ((...args: T) => Promise<R | false>) => {
    return async (...args: T): Promise<R | false> => {
      if (!tryStartOperation(operationName, options)) {
        return false;
      }

      try {
        const result = await operationFunction(...args);
        return result;
      } finally {
        endOperation(operationName);
      }
    };
  };

  /**
   * 조건부 작업 실행
   * @param {string} operationName - 작업 이름
   * @param {Function} operationFunction - 실행할 함수
   * @param {OperationOptions} options - 옵션
   * @returns {Promise<boolean>} 실행 성공 여부
   */
  const executeIfNotBlocked = async (
    operationName: string, 
    operationFunction: () => Promise<void> | void, 
    options: OperationOptions = {}
  ): Promise<boolean> => {
    if (!tryStartOperation(operationName, options)) {
      return false;
    }

    try {
      await operationFunction();
      return true;
    } finally {
      endOperation(operationName);
    }
  };

  return {
    isBlocked,
    tryStartOperation,
    endOperation,
    isOperationActive,
    wrapOperation,
    executeIfNotBlocked
  };
}

/**
 * 특정 작업 타입별 가드 함수들
 */
export const operationGuards = {
  /**
   * 엑셀 업로드 가드
   */
  excelUpload: <T extends unknown[], R>(operationFunction: (...args: T) => Promise<R>) => {
    return async (...args: T): Promise<R | false> => {
      const { tryStartOperation, endOperation } = useOperationGuard();
      if (!tryStartOperation('excel_upload', { blocking: true, timeout: 60000 })) {
        return false;
      }
      try {
        return await operationFunction(...args);
      } finally {
        endOperation('excel_upload');
      }
    };
  },

  /**
   * 데이터 초기화 가드
   */
  dataReset: <T extends unknown[], R>(operationFunction: (...args: T) => Promise<R>) => {
    return async (...args: T): Promise<R | false> => {
      const { tryStartOperation, endOperation } = useOperationGuard();
      if (!tryStartOperation('data_reset', { blocking: true, timeout: 10000 })) {
        return false;
      }
      try {
        return await operationFunction(...args);
      } finally {
        endOperation('data_reset');
      }
    };
  },

  /**
   * 열 삭제 가드
   */
  columnDeletion: <T extends unknown[], R>(operationFunction: (...args: T) => Promise<R>) => {
    return async (...args: T): Promise<R | false> => {
      const { tryStartOperation, endOperation } = useOperationGuard();
      if (!tryStartOperation('column_deletion', { blocking: true, timeout: 5000 })) {
        return false;
      }
      try {
        return await operationFunction(...args);
      } finally {
        endOperation('column_deletion');
      }
    };
  },

  /**
   * 행 삭제 가드
   */
  rowDeletion: <T extends unknown[], R>(operationFunction: (...args: T) => Promise<R>) => {
    return async (...args: T): Promise<R | false> => {
      const { tryStartOperation, endOperation } = useOperationGuard();
      if (!tryStartOperation('row_deletion', { blocking: true, timeout: 5000 })) {
        return false;
      }
      try {
        return await operationFunction(...args);
      } finally {
        endOperation('row_deletion');
      }
    };
  },

  /**
   * 데이터 내보내기 가드 (비차단)
   */
  dataExport: <T extends unknown[], R>(operationFunction: (...args: T) => Promise<R>) => {
    return async (...args: T): Promise<R | false> => {
      const { tryStartOperation, endOperation } = useOperationGuard();
      if (!tryStartOperation('data_export', { blocking: false, timeout: 30000 })) {
        return false;
      }
      try {
        return await operationFunction(...args);
      } finally {
        endOperation('data_export');
      }
    };
  }
};

/**
 * 전역 작업 상태 확인 함수
 */
import { ManagerStatus, QueuedOperationInfo } from '../utils/globalOperationManager';

/**
 * 전역 작업 상태 확인 함수
 */
export function getGlobalOperationStatus(): ManagerStatus {
  return globalOperationManager.getStatus();
}

/**
 * 대기 중인 작업 목록 확인
 */
export function getQueuedOperations(): QueuedOperationInfo[] {
  return globalOperationManager.getQueuedOperations();
}
