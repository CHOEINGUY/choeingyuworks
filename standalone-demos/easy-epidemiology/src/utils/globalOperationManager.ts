/**
 * globalOperationManager.ts
 * 전역 작업 상태 관리 시스템
 * 비동기 작업 간의 경쟁 상태를 방지하고 데이터 무결성을 보장합니다.
 */

import { ref, type Ref } from 'vue';

export interface OperationOptions {
  blocking?: boolean;
  timeout?: number;
}

interface QueuedOperation {
  name: string;
  options: OperationOptions;
  timestamp: number;
}

export interface ManagerStatus {
  activeOperations: string[];
  queueLength: number;
  isProcessing: boolean;
}

export interface QueuedOperationInfo {
  name: string;
  waitingTime: number;
}

class GlobalOperationManager {
  private activeOperations: Ref<Set<string>>;
  private operationQueue: Ref<QueuedOperation[]>;
  private isProcessing: Ref<boolean>;

  constructor() {
    this.activeOperations = ref(new Set());
    this.operationQueue = ref([]);
    this.isProcessing = ref(false);
  }

  /**
   * 작업 시작
   * @param {string} operationName - 작업 이름
   * @param {Object} options - 옵션
   * @returns {boolean} 작업 시작 가능 여부
   */
  startOperation(operationName: string, options: OperationOptions = {}): boolean {
    const {
      blocking = true,     // 다른 작업을 차단하는지 여부
      timeout = 30000      // 타임아웃 (ms)
    } = options;

    // 이미 같은 작업이 실행 중인지 확인
    if (this.activeOperations.value.has(operationName)) {
      console.warn(`[GlobalOperationManager] 작업이 이미 실행 중: ${operationName}`);
      return false;
    }

    // 차단 작업이 실행 중인지 확인
    if (blocking && this.hasBlockingOperations()) {
      console.warn(`[GlobalOperationManager] 차단 작업이 실행 중이어서 대기: ${operationName}`);
      
      // 큐에 추가
      this.operationQueue.value.push({
        name: operationName,
        options,
        timestamp: Date.now()
      });
      
      return false;
    }

    // 작업 시작
    this.activeOperations.value.add(operationName);
    
    // 타임아웃 설정
    if (timeout > 0) {
      setTimeout(() => {
        this.endOperation(operationName);
        console.warn(`[GlobalOperationManager] 작업 타임아웃: ${operationName}`);
      }, timeout);
    }

    console.log(`[GlobalOperationManager] 작업 시작: ${operationName}`);
    return true;
  }

  /**
   * 작업 종료
   * @param {string} operationName - 작업 이름
   */
  endOperation(operationName: string): void {
    if (this.activeOperations.value.has(operationName)) {
      this.activeOperations.value.delete(operationName);
      console.log(`[GlobalOperationManager] 작업 종료: ${operationName}`);
      
      // 큐에 대기 중인 작업 처리
      this.processQueue();
    }
  }

  /**
   * 차단 작업이 실행 중인지 확인
   */
  hasBlockingOperations(): boolean {
    return this.activeOperations.value.size > 0;
  }

  /**
   * 특정 작업이 실행 중인지 확인
   * @param {string} operationName - 작업 이름
   */
  isOperationActive(operationName: string): boolean {
    return this.activeOperations.value.has(operationName);
  }

  /**
   * 큐에 대기 중인 작업 처리
   */
  processQueue(): void {
    if (this.isProcessing.value || this.operationQueue.value.length === 0) {
      return;
    }

    this.isProcessing.value = true;

    // 큐에서 대기 중인 작업들을 처리
    while (this.operationQueue.value.length > 0) {
      const nextOperation = this.operationQueue.value[0];
      
      // 차단 작업이 여전히 실행 중인지 확인
      if (this.hasBlockingOperations()) {
        break;
      }

      // 큐에서 제거하고 작업 시작
      this.operationQueue.value.shift();
      
      // 작업 시작 시도
      if (this.startOperation(nextOperation.name, nextOperation.options)) {
        console.log(`[GlobalOperationManager] 큐에서 작업 시작: ${nextOperation.name}`);
      }
    }

    this.isProcessing.value = false;
  }

  /**
   * 모든 작업 강제 종료 (긴급 상황용)
   */
  forceEndAllOperations(): void {
    console.warn('[GlobalOperationManager] 모든 작업 강제 종료');
    this.activeOperations.value.clear();
    this.operationQueue.value = [];
    this.isProcessing.value = false;
  }

  /**
   * 현재 상태 정보 반환
   */
  getStatus(): ManagerStatus {
    return {
      activeOperations: Array.from(this.activeOperations.value),
      queueLength: this.operationQueue.value.length,
      isProcessing: this.isProcessing.value
    };
  }

  /**
   * 큐에 대기 중인 작업 목록 반환
   */
  getQueuedOperations(): QueuedOperationInfo[] {
    return this.operationQueue.value.map(op => ({
      name: op.name,
      waitingTime: Date.now() - op.timestamp
    }));
  }
}

// 싱글톤 인스턴스 생성
const globalOperationManager = new GlobalOperationManager();

export default globalOperationManager;
