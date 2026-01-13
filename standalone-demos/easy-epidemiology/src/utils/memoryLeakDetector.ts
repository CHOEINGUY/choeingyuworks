/**
 * memoryLeakDetector.ts
 * 메모리 누수 감지 및 모니터링 유틸리티
 * 개발 환경에서 메모리 누수를 감지하고 추적합니다.
 */

interface ComponentSnapshot {
  componentName: string;
  timestamp: number;
  globalReferences: Set<string>;
}

interface LeakInfo {
  componentName: string;
  age: number;
  globalReferences: string[];
  severity: 'high' | 'medium';
}

interface MemorySnapshot {
  timestamp: number;
  componentCount: number;
  globalReferenceCount: number;
  components: {
    componentName: string;
    globalReferences: string[];
    age: number;
  }[];
}

class MemoryLeakDetector {
  private snapshots: Map<any, ComponentSnapshot>;
  private componentInstances: WeakSet<any>;
  private globalReferences: Set<string>;
  private isEnabled: boolean;
  private periodicCheckInterval: number | null; // NodeJS.Timeout or number, using number for browser env

  constructor() {
    this.snapshots = new Map();
    this.componentInstances = new WeakSet();
    this.globalReferences = new Set();
    this.isEnabled = process.env.NODE_ENV === 'development';
    this.periodicCheckInterval = null;
  }

  /**
   * 컴포넌트 인스턴스 등록
   * @param {Object} componentInstance - 컴포넌트 인스턴스
   * @param {string} componentName - 컴포넌트 이름
   */
  registerComponent(componentInstance: any, componentName: string): void {
    if (!this.isEnabled) return;

    this.componentInstances.add(componentInstance);
    this.snapshots.set(componentInstance, {
      componentName,
      timestamp: Date.now(),
      globalReferences: new Set()
    });

    console.log(`[MemoryLeakDetector] 컴포넌트 등록: ${componentName}`);
  }

  /**
   * 컴포넌트 인스턴스 제거
   * @param {Object} componentInstance - 컴포넌트 인스턴스
   */
  unregisterComponent(componentInstance: any): void {
    if (!this.isEnabled) return;

    const snapshot = this.snapshots.get(componentInstance);
    if (snapshot) {
      console.log(`[MemoryLeakDetector] 컴포넌트 제거: ${snapshot.componentName}`);
      this.snapshots.delete(componentInstance);
    }
  }

  /**
   * 전역 참조 등록
   * @param {Object} componentInstance - 컴포넌트 인스턴스
   * @param {string} referenceName - 참조 이름
   */
  registerGlobalReference(componentInstance: any, referenceName: string): void {
    if (!this.isEnabled) return;

    const snapshot = this.snapshots.get(componentInstance);
    if (snapshot) {
      snapshot.globalReferences.add(referenceName);
      this.globalReferences.add(referenceName);
      console.log(`[MemoryLeakDetector] 전역 참조 등록: ${snapshot.componentName} -> ${referenceName}`);
    }
  }

  /**
   * 전역 참조 제거
   * @param {Object} componentInstance - 컴포넌트 인스턴스
   * @param {string} referenceName - 참조 이름
   */
  unregisterGlobalReference(componentInstance: any, referenceName: string): void {
    if (!this.isEnabled) return;

    const snapshot = this.snapshots.get(componentInstance);
    if (snapshot) {
      snapshot.globalReferences.delete(referenceName);
      this.globalReferences.delete(referenceName);
      console.log(`[MemoryLeakDetector] 전역 참조 제거: ${snapshot.componentName} -> ${referenceName}`);
    }
  }

  /**
   * 메모리 사용량 스냅샷 생성
   * @returns {Object} 메모리 사용량 정보
   */
  takeMemorySnapshot(): MemorySnapshot | null {
    if (!this.isEnabled) return null;

    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      componentCount: this.snapshots.size,
      globalReferenceCount: this.globalReferences.size,
      components: Array.from(this.snapshots.entries()).map(([, data]) => ({
        componentName: data.componentName,
        globalReferences: Array.from(data.globalReferences),
        age: Date.now() - data.timestamp
      }))
    };

    console.log('[MemoryLeakDetector] 메모리 스냅샷:', snapshot);
    return snapshot;
  }

  /**
   * 잠재적 메모리 누수 감지
   * @returns {Array} 잠재적 누수 목록
   */
  detectPotentialLeaks(): LeakInfo[] {
    if (!this.isEnabled) return [];

    const leaks: LeakInfo[] = [];
    const now = Date.now();
    const threshold = 5 * 60 * 1000; // 5분

    this.snapshots.forEach((snapshot) => {
      const age = now - snapshot.timestamp;
      if (age > threshold && snapshot.globalReferences.size > 0) {
        leaks.push({
          componentName: snapshot.componentName,
          age,
          globalReferences: Array.from(snapshot.globalReferences),
          severity: snapshot.globalReferences.size > 2 ? 'high' : 'medium'
        });
      }
    });

    if (leaks.length > 0) {
      console.warn('[MemoryLeakDetector] 잠재적 메모리 누수 감지:', leaks);
    }

    return leaks;
  }

  /**
   * 정기적인 메모리 누수 검사 시작
   * @param {number} interval - 검사 간격 (ms)
   */
  startPeriodicCheck(interval = 30000): void { // 30초마다
    if (!this.isEnabled) return;

    this.periodicCheckInterval = window.setInterval(() => {
      this.detectPotentialLeaks();
    }, interval);

    console.log(`[MemoryLeakDetector] 정기 검사 시작 (${interval}ms 간격)`);
  }

  /**
   * 정기적인 메모리 누수 검사 중지
   */
  stopPeriodicCheck(): void {
    if (this.periodicCheckInterval !== null) {
      window.clearInterval(this.periodicCheckInterval);
      this.periodicCheckInterval = null;
      console.log('[MemoryLeakDetector] 정기 검사 중지');
    }
  }

  /**
   * 모든 데이터 정리
   */
  cleanup(): void {
    this.snapshots.clear();
    this.globalReferences.clear();
    this.stopPeriodicCheck();
    console.log('[MemoryLeakDetector] 모든 데이터 정리 완료');
  }
}

// 싱글톤 인스턴스 생성
const memoryLeakDetector = new MemoryLeakDetector();

export default memoryLeakDetector;
