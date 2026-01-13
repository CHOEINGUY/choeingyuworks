
import { ref, onMounted, onBeforeUnmount, type Ref, unref } from 'vue';
import { logger } from '../../../utils/logger';
import { processExcelFile } from '../logic/excelProcessor';
import { useDataExport } from '../logic/useDataExport';
// @ts-ignore
import { showToast, showConfirmToast } from '../logic/toast';
import { useEpidemicStore } from '@/stores/epidemicStore';
import { useHistoryStore } from '@/stores/historyStore';
import { useGridStore } from '@/stores/gridStore';
import type { GridHeader, GridRow } from '@/types/grid';
import type { ValidationManager } from '@/validation/ValidationManager';
import type { VirtualSelectionSystem } from '../logic/virtualSelectionSystem';

export function useExcelOperations(
  validationManager: ValidationManager | undefined,
  selectionSystem: VirtualSelectionSystem,
  tryStartOperation: (name: string, options?: { blocking?: boolean; timeout?: number }) => boolean,
  endOperation: (name: string) => void,
  allColumnsMeta: Ref<GridHeader[]>,
  getCellValue: (row: GridRow, col: GridHeader, rowIndex: number) => any,
  flags: {
      hasIndividualExposure?: boolean | Ref<boolean>,
      hasConfirmedCase?: boolean | Ref<boolean>
  } = {},
  t: (key: string, params?: any) => string = (k) => k
) {
  const epidemicStore = useEpidemicStore();
  const gridStore = useGridStore();
  const historyStore = useHistoryStore(); // History integration
  
  const isUploadingExcel = ref(false);
  const excelUploadProgress = ref(0);
  const { downloadXLSXSmart, downloadTemplate } = useDataExport();

  const isMounted = ref(false);
  onMounted(() => { isMounted.value = true; });
  onBeforeUnmount(() => { isMounted.value = false; });

  async function onExcelFileSelected(file: File) {
    if (!tryStartOperation('excel_upload', { blocking: true, timeout: 60000 })) {
      return;
    }

    isUploadingExcel.value = true;
    excelUploadProgress.value = 0;
    try {
      if (validationManager) {
        validationManager.clearAllErrors();
      }

      logger.debug('[Excel] 필터 초기화 시작');
      gridStore.clearAllFilters();

      logger.debug(`[Excel] 파일 처리 시작: ${file.name}`);

      const { headers, rows } = await processExcelFile(file, (progress: number) => {
        if (!isMounted.value) return; 
        excelUploadProgress.value = Math.round(progress);
      });

      if (!isMounted.value) {
        logger.warn('[Excel] 컴포넌트 언마운트로 업로드 중단');
        return;
      }

      logger.debug('[Excel] 헤더 분석 결과:', headers);

      historyStore.captureSnapshot('excel_upload'); // Capture before replacing data
      epidemicStore.setInitialData({ headers, rows });

      // 가져온 데이터에 대해 전체 유효성 검사 실행
      if (validationManager && allColumnsMeta.value.length > 0 && rows.length > 0) {
        logger.debug('[Excel] 가져온 데이터에 대한 유효성 검사 시작');
        validationManager.updateColumnMetas(allColumnsMeta.value);
        
        try {
          await validationManager.revalidateAll(
            epidemicStore.rows,
            allColumnsMeta.value,
            { useAsyncProcessor: true, chunkSize: 100 }
          );
          logger.debug('[Excel] 유효성 검사 완료');
        } catch (validationError) {
          logger.warn('[Excel] 유효성 검사 중 오류:', validationError);
        }
      }

      if (isMounted.value) {
        showToast(t('dataInput.toast.excel.uploadSuccess'), 'success');
      }
    } catch (error: any) {
      if (!isMounted.value) return;
      logger.error('[Excel] 업로드 중 오류:', error);
      showToast(`${t('dataInput.toast.error')}: ${error.message}`, 'error');
    } finally {
      if (isMounted.value) {
        isUploadingExcel.value = false;
        endOperation('excel_upload');
      }
    }
  }

  async function onExportData() {
    if (!tryStartOperation('excel_export', { blocking: true, timeout: 30000 })) {
      return;
    }

    try {
      const now = new Date();
      const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 12);
      const fileName = `data_${timestamp}.xlsx`;

      const hasIndividualExposure = unref(flags.hasIndividualExposure) ?? false;
      const hasConfirmedCase = unref(flags.hasConfirmedCase) ?? false;

      await downloadXLSXSmart(
        allColumnsMeta.value, 
        epidemicStore.rows, 
        getCellValue, 
        hasIndividualExposure, 
        hasConfirmedCase, 
        fileName
      );
      showToast(t('dataInput.toast.excel.exportSuccess'), 'success');
    } catch (error: any) {
      logger.error('[Excel] 내보내기 중 오류:', error);
      showToast(`${t('dataInput.toast.error')}: ${error.message}`, 'error');
    } finally {
      endOperation('excel_export');
    }
  }

  function onDownloadTemplate(type: string) {
    if (!tryStartOperation('download_template')) return;

    try {
      downloadTemplate(type as 'basic' | 'individual' | undefined);
      showToast(t('dataInput.toast.excel.templateSuccess'), 'success');
    } catch (error) {
      logger.error('[Excel] 템플릿 다운로드 중 오류:', error);
      showToast(t('dataInput.toast.excel.templateError'), 'error');
    } finally {
      endOperation('download_template');
    }
  }

  async function onCopyEntireData() {
    if (!tryStartOperation('copy_data')) return;

    try {
      const confirmed = await showConfirmToast(t('dataInput.toast.excel.copyConfirm'));
      if (!confirmed) {
        endOperation('copy_data');
        return;
      }

      const rows = epidemicStore.rows;
      const columns = allColumnsMeta.value;

      const CHUNK_SIZE = 500;
      const clipboardParts: string[] = [];

      // 헤더 처리
      const headerText = columns.map(col => {
        return (col.headerText || '')
          .replace(/<br\s*\/?>/gi, ' ')
          .replace(/<[^>]*>/g, '')
          .trim();
      }).join('\t');
      clipboardParts.push(headerText);

      // 데이터 처리 (청크 분할)
      for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
        if (!isMounted.value) return;

        const chunk = rows.slice(i, i + CHUNK_SIZE);
        const chunkText = chunk.map((row, idx) => {
          const rowIndex = i + idx;
          return columns.map(col => {
            return getCellValue(row, col, rowIndex) ?? '';
          }).join('\t');
        }).join('\n');
        
        clipboardParts.push(chunkText);

        await new Promise(resolve => setTimeout(resolve, 0));
      }

      const clipboardText = clipboardParts.join('\n');

      if (!isMounted.value) return;

      await (navigator as any).clipboard.writeText(clipboardText);
      showToast(t('dataInput.toast.excel.copySuccess'), 'success');
    } catch (error) {
      logger.error('[Excel] 복사 중 오류:', error);
      showToast(t('dataInput.toast.excel.copyError'), 'error');
    } finally {
      endOperation('copy_data');
    }
  }

  function onFileDropped(file: File) {
    onExcelFileSelected(file);
  }

  return {
    isUploadingExcel,
    excelUploadProgress,
    onExcelFileSelected,
    onExportData,
    onDownloadTemplate,
    onCopyEntireData,
    onFileDropped
  };
}
