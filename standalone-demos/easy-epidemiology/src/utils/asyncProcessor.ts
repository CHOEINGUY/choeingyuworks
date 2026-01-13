/**
 * asyncProcessor.ts
 * 웹 워커 대신 requestIdleCallback과 청크 처리를 사용하는 비동기 처리 유틸리티
 * file:/// 환경에서도 완벽하게 작동
 */

// Use standard names if possible or compatible ones
type RequestIdleCallbackHandle = number;
type StandardIdleRequestCallback = (deadline: IdleDeadline) => void;
type StandardIdleRequestOptions = { timeout?: number };
type CancelIdleCallback = (handle: number) => void;

declare global {
  interface Window {
    requestIdleCallback: (callback: StandardIdleRequestCallback, options?: StandardIdleRequestOptions) => number;
    cancelIdleCallback: (handle: number) => void;
  }
}

// requestIdleCallback 폴백 (구형 브라우저 지원)
const requestIdleCallbackFallback = (callback: (deadline: IdleDeadline) => void) => {
  const start = Date.now();
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
    });
  }, 1) as unknown as number;
};

const requestIdleCallback =
  (typeof window !== 'undefined' && window.requestIdleCallback) ||
  requestIdleCallbackFallback;

const cancelIdleCallback: CancelIdleCallback =
  (typeof window !== 'undefined' && window.cancelIdleCallback) ||
  ((id: number) => clearTimeout(id));

export interface ProcessInChunksOptions<T = any> {
  chunkSize?: number;
  timeout?: number;
  onProgress?: (progress: number, current: number, total: number) => void;
  onComplete?: (data: T[]) => void;
  onError?: (error: any, index?: number) => void;
}

export interface AsyncProcessHandle {
  cancel: () => void;
  getProgress: () => {
    current: number;
    total: number;
    percentage: number;
  };
}

/**
 * 청크 단위로 데이터를 처리하는 함수
 */
export function processInChunks<T>(
  data: T[],
  processor: (item: T, index: number, array: T[]) => void,
  options: ProcessInChunksOptions<T> = {}
): AsyncProcessHandle {
  const {
    chunkSize = 100,
    timeout = 16,
    onProgress = () => {},
    onComplete = () => {},
    onError = () => {},
  } = options;

  let currentIndex = 0;
  let isCancelled = false;
  let idleCallbackId: number | null = null;

  const processChunk = (deadline: IdleDeadline) => {
    if (isCancelled) return;

    const startTime = performance.now();

    try {
      // deadline이 있으면 그 시간까지, 없으면 timeout까지 처리
      const timeLimit = deadline ? deadline.timeRemaining() : timeout;

      while (
        currentIndex < data.length &&
        performance.now() - startTime < timeLimit
      ) {
        const chunk = data.slice(currentIndex, currentIndex + chunkSize);

        // 청크 처리
        for (let i = 0; i < chunk.length; i++) {
          const item = chunk[i];
          const globalIndex = currentIndex + i;

          try {
            processor(item, globalIndex, data);
          } catch (error) {
            onError(error, globalIndex);
          }
        }

        currentIndex += chunk.length;

        // 진행률 업데이트
        const progress = Math.min((currentIndex / data.length) * 100, 100);
        onProgress(progress, currentIndex, data.length);

        // 청크 크기만큼만 처리하고 다음 idle에 넘김
        if (currentIndex % chunkSize === 0) {
          break;
        }
      }

      // 아직 처리할 데이터가 있으면 다음 idle에 예약
      if (currentIndex < data.length) {
        idleCallbackId = requestIdleCallback(processChunk, { timeout });
      } else {
        // 완료
        onComplete(data);
      }
    } catch (error) {
      onError(error);
    }
  };

  // 처리 시작
  idleCallbackId = requestIdleCallback(processChunk, { timeout });

  // 취소 함수 반환
  return {
    cancel: () => {
      isCancelled = true;
      if (idleCallbackId) {
        cancelIdleCallback(idleCallbackId);
        idleCallbackId = null;
      }
    },
    getProgress: () => ({
      current: currentIndex,
      total: data.length,
      percentage: (currentIndex / data.length) * 100,
    }),
  };
}

interface ColumnMeta {
  isEditable?: boolean;
  cellIndex?: number;
  dataKey?: string;
  colIndex: number;
  type: string;
  [key: string]: any;
}

interface ValidationOptions {
  chunkSize?: number;
  onProgress?: (progress: number, processed: number, total: number) => void;
  onComplete?: (invalidCells: InvalidCell[]) => void;
  onError?: (error: any) => void;
}

interface CellToValidate {
  rowIndex: number;
  colIndex: number;
  value: any;
  type: string;
}

interface InvalidCell {
  row: number;
  col: number;
  message: string;
}

interface ValidatorResult {
  valid: boolean;
  message?: string;
}

type ValidatorFunction = (value: any, type: string) => ValidatorResult;

/**
 * 대용량 배열을 비동기적으로 검증하는 함수
 */
export function validateDataAsync(
  rows: any[],
  columnMetas: ColumnMeta[],
  validator: ValidatorFunction,
  options: ValidationOptions = {}
): AsyncProcessHandle {
  const {
    chunkSize = 50,
    onProgress = () => {},
    onComplete = () => {},
    onError = () => {},
  } = options;

  const invalidCells: InvalidCell[] = [];
  const totalCells =
    rows.length * columnMetas.filter((meta) => meta.isEditable).length;
  let processedCells = 0;

  // 검증할 셀들을 평면화
  const cellsToValidate: CellToValidate[] = [];
  rows.forEach((row, rowIndex) => {
    columnMetas.forEach((meta) => {
      if (!meta.isEditable) return;

      // Safe check for dataKey
      if (!meta.dataKey) return;

      let value: any = '';
      if (meta.cellIndex !== null && meta.cellIndex !== undefined) {
        // dataKey is string here
        const arr = row[meta.dataKey] || [];
        value = Array.isArray(arr) ? arr[meta.cellIndex] ?? '' : '';
      } else {
        value = row[meta.dataKey] ?? '';
      }

      cellsToValidate.push({
        rowIndex,
        colIndex: meta.colIndex,
        value,
        type: meta.type,
      });
    });
  });

  const processor = (cell: CellToValidate) => {
    const result = validator(cell.value, cell.type);
    if (!result.valid) {
      invalidCells.push({
        row: cell.rowIndex,
        col: cell.colIndex,
        message: result.message || 'Invalid value',
      });
    }
    processedCells++;
  };

  const progressHandler = (progress: number) => {
    onProgress(progress, processedCells, totalCells);
  };

  const completeHandler = () => {
    onComplete(invalidCells);
  };

  return processInChunks(cellsToValidate, processor, {
    chunkSize,
    onProgress: progressHandler,
    onComplete: completeHandler,
    onError,
  });
}

interface ExcelProcessOptions {
  chunkSize?: number;
  onProgress?: (progress: number) => void;
  onComplete?: (result: any) => void;
  onError?: (error: any) => void;
}

/**
 * Excel 파일을 비동기적으로 처리하는 함수
 */
export function processExcelAsync(
  buffer: ArrayBuffer,
  parser: (Input: ArrayBuffer | any, index?: number) => any,
  options: ExcelProcessOptions = {}
): Promise<any> {
  const {
    chunkSize = 1000,
    onProgress = () => {},
    onComplete = () => {},
    onError = () => {},
  } = options;

  return new Promise((resolve, reject) => {
    try {
      // 초기 진행률
      onProgress(10);

      // 파싱 작업을 청크로 나누어 처리
      const processData = (data: any[]) => {
        const processor = (item: any, index: number) => {
          // 각 행 처리
          parser(item, index);
        };

        const progressHandler = (progress: number) => {
          // 10% ~ 90% 범위에서 진행률 표시
          const adjustedProgress = 10 + progress * 0.8;
          onProgress(adjustedProgress);
        };

        const completeHandler = (result: any) => {
          onProgress(100);
          onComplete(result);
          resolve(result);
        };

        return processInChunks(data, processor, {
          chunkSize,
          onProgress: progressHandler,
          onComplete: completeHandler,
          onError: (error) => {
            onError(error);
            reject(error);
          },
        });
      };

      // Excel 파싱 로직을 여기에 구현
      // (기존 excelWorker.js의 로직을 동기적으로 실행)
      const result = parser(buffer);
      processData(result);
    } catch (error) {
      onError(error);
      reject(error);
    }
  });
}
