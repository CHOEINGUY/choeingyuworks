// Excel processor for VirtualScroll version with fallback support for file:/// environment
// Public API: processExcelFile(file: File, onProgress?: (percent:number)=>void)
// Returns Promise resolving to { headers, rows, hasIndividualExposureTime }

import { processExcelFileAsync } from './excelProcessorSync';
import { createWorkerSafely } from '../../../utils/workerUtils';
import { GridHeader, GridRow } from '@/types/grid';

export interface ExcelHeaders {
  basic: string[];
  clinical: string[];
  diet: string[];
  [key: string]: string[];
}

export interface ExcelProcessResult {
  headers: ExcelHeaders;
  rows: GridRow[];
  hasIndividualExposureTime?: boolean;
}

export type ProgressCallback = (percent: number) => void;

export function processExcelFile(
  file: File,
  onProgress: ProgressCallback = () => { }
): Promise<ExcelProcessResult> {
  if (!(file instanceof File)) {
    return Promise.reject(new Error('유효한 파일이 아닙니다.'));
  }

  // 환경 감지: file:/// 프로토콜에서는 워커를 사용할 수 없음
  const isFileProtocol = window.location.protocol === 'file:';
  if (isFileProtocol) {
    // file:/// 환경에서는 requestIdleCallback 기반 비동기 처리 사용
    console.log('[ExcelProcessor] Using async processor for file:/// environment');
    return processExcelFileAsync(file, onProgress) as Promise<ExcelProcessResult>;
  }

  // 안전한 워커 사용 시도
  return new Promise((resolve, reject) => {
    file
      .arrayBuffer()
      .then((buffer) => {
        // 안전한 워커 생성
        const worker = createWorkerSafely(new URL('../workers/excelWorker.ts', import.meta.url));
        if (!worker) {
          // 워커 생성 실패 시 비동기 처리로 폴백
          console.log('[ExcelProcessor] Worker creation failed, using async processor');
          return processExcelFileAsync(file, onProgress)
            .then(resolve as any)
            .catch(reject);
        }

        worker.onmessage = (e: MessageEvent) => {
          const { type, data, progress, error } = e.data || {};
          switch (type) {
            case 'progress':
              onProgress(progress);
              break;
            case 'complete':
              onProgress(100);
              worker.terminate();
              resolve(data);
              break;
            case 'error':
              worker.terminate();
              reject(new Error(error || 'Excel 파싱 실패'));
              break;
            default:
              break;
          }
        };

        worker.onerror = (err) => {
          worker.terminate();
          console.warn('[ExcelProcessor] Worker failed, falling back to async processor:', err);
          // 워커 실패 시 비동기 처리로 폴백
          processExcelFileAsync(file, onProgress)
            .then(resolve as any)
            .catch(reject);
        };

        // Transfer ArrayBuffer to worker
        worker.postMessage({ buffer }, [buffer]);
        // Initial small progress
        onProgress(5);
      })
      .catch((err) => reject(err));
  });
}
