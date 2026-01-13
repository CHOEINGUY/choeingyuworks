/**
 * performance.ts
 * 성능 모니터링 유틸리티
 */

interface MemoryUsage {
  used: number;
  total: number;
  limit: number;
}

interface PerformanceMetric {
  count: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  totalDuration: number;
}

interface PerformanceReport {
  [key: string]: PerformanceMetric;
}

interface PerformanceSummary {
  measures: Record<string, number>;
  memory: MemoryUsage | null;
}

class PerformanceMonitor {
  private marks: Map<string, number>;
  private measures: Map<string, number>; // Original stores single latest measure? 
  // No, the original code overwrites: this.measures.set(measureName, duration);
  // Wait, generateReport iterates this.measures and reduces.
  // Actually, generateReport logic in JS looks like it assumes this.measures contains arrays, but set() overwrites.
  // Original JS line 37: this.measures.set(measureName, duration);
  // Original JS line 139: for (const [name, measurements] of this.measures) 
  // This implies this.measures should store array of durations?
  // But line 37 overwrites. This is a bug in original JS or I misread.
  // "const [name, measurements] of this.measures" - if value is number, this will fail or work if string?
  // Actually, if Map values are numbers, [name, measurements] destructuring works if iterating entries, but 'measurements' is a number.
  // Then measurements.reduce is impossible.
  // So the original JS `generateReport` is BROKEN unless `this.measures` holds arrays.
  // BUT the `endMark` method sets a single number.
  // I should fix this logic to support multiple measurements if I want generateReport to work, or just strictly type what was there.
  // Given I am "migrating", I should probably fix the obvious bug or stick to what it does.
  // "Fixing" it means changing `this.measures` to map string -> number[].
  // Let's assume I should fix it because the migration goal implies maintainability.
  
  // Re-reading JS:
  // startMark sets timestamp.
  // endMark calculates duration, sets to measures.
  // generateReport iterates.
  // Yes, it's definitely broken in JS. I will upgrade it to store arrays.
  private measureHistory: Map<string, number[]>;

  constructor() {
    this.marks = new Map();
    this.measures = new Map(); // Keep this for latest value
    this.measureHistory = new Map(); // For report
  }

  /**
   * 성능 마크 시작
   * @param {string} name - 마크 이름
   */
  startMark(name: string): void {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-start`);
      this.marks.set(name, Date.now());
    }
  }

  /**
   * 성능 마크 종료 및 측정
   * @param {string} name - 마크 이름
   * @param {string} [measureName] - 측정 이름 (기본값: name)
   * @returns {number} 실행 시간 (ms)
   */
  endMark(name: string, measureName: string = name): number {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-end`);
      performance.measure(measureName, `${name}-start`, `${name}-end`);
      
      const startTime = this.marks.get(name);
      if (!startTime) return 0;

      const endTime = Date.now();
      const duration = endTime - startTime;
      
      this.measures.set(measureName, duration);
      
      // History for report
      if (!this.measureHistory.has(measureName)) {
        this.measureHistory.set(measureName, []);
      }
      this.measureHistory.get(measureName)!.push(duration);
      
      // 개발 환경에서만 로그 출력
      if ((import.meta as any).env?.MODE === 'development' || false) {
        console.log(`⏱️ ${measureName}: ${duration}ms`);
      }
      
      return duration;
    }
    return 0;
  }

  /**
   * 특정 작업의 성능 측정
   * @param {string} name - 작업 이름
   * @param {Function} fn - 측정할 함수
   * @returns {*} 함수 실행 결과
   */
  measure<T>(name: string, fn: () => T): T {
    this.startMark(name);
    try {
      const result = fn();
      this.endMark(name);
      return result;
    } catch (error) {
      this.endMark(name);
      throw error;
    }
  }

  /**
   * 비동기 작업의 성능 측정
   * @param {string} name - 작업 이름
   * @param {Function} fn - 측정할 비동기 함수
   * @returns {Promise} 함수 실행 결과
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.startMark(name);
    try {
      const result = await fn();
      this.endMark(name);
      return result;
    } catch (error) {
      this.endMark(name);
      throw error;
    }
  }

  /**
   * 메모리 사용량 측정 (브라우저 지원 시)
   */
  getMemoryUsage(): MemoryUsage | null {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100,
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024 * 100) / 100,
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024 * 100) / 100
      };
    }
    return null;
  }

  /**
   * 성능 측정 결과 요약
   */
  getSummary(): PerformanceSummary {
    const summary: PerformanceSummary = {
      measures: Object.fromEntries(this.measures),
      memory: this.getMemoryUsage()
    };
    
    if ((import.meta as any).env?.MODE === 'development' || false) {
      console.table(summary.measures);
      if (summary.memory) {
        console.log('💾 Memory Usage:', summary.memory);
      }
    }
    
    return summary;
  }

  /**
   * 모든 측정 데이터 초기화
   */
  clear(): void {
    this.marks.clear();
    this.measures.clear();
    this.measureHistory.clear();
    
    if (typeof performance !== 'undefined' && performance.clearMarks) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }

  /**
   * 전체 성능 리포트를 생성합니다.
   * @returns {Object} 전체 성능 메트릭
   */
  generateReport(): PerformanceReport {
    const report: PerformanceReport = {};
    
    for (const [name, measurements] of this.measureHistory) {
      const totalDuration = measurements.reduce((sum, m) => sum + m, 0);
      const count = measurements.length;
      
      if (count > 0) {
        const durations = measurements; // already array
        const avgDuration = totalDuration / count;
        const minDuration = Math.min(...durations);
        const maxDuration = Math.max(...durations);
        
        report[name] = {
          count,
          avgDuration: Math.round(avgDuration * 100) / 100,
          minDuration: Math.round(minDuration * 100) / 100,
          maxDuration: Math.round(maxDuration * 100) / 100,
          totalDuration: Math.round(totalDuration * 100) / 100
        };
      }
    }
    
    if ((import.meta as any).env?.MODE === 'development' || false) {
      console.table(report);
    }

    return report;
  }
}

// 전역 성능 모니터 인스턴스
export const performanceMonitor = new PerformanceMonitor();

// 편의 함수들
export const measure = <T>(name: string, fn: () => T): T => performanceMonitor.measure(name, fn);
export const measureAsync = <T>(name: string, fn: () => Promise<T>): Promise<T> => performanceMonitor.measureAsync(name, fn);
export const startMark = (name: string): void => performanceMonitor.startMark(name);
export const endMark = (name: string, measureName?: string): number => performanceMonitor.endMark(name, measureName);

export default performanceMonitor;
