
import { ref, computed, nextTick, watch, type ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  COL_TYPE_SERIAL,
  COL_TYPE_IS_PATIENT,
  COL_TYPE_CONFIRMED_CASE,
  COL_TYPE_BASIC,
  COL_TYPE_CLINICAL,
  COL_TYPE_ONSET,
  COL_TYPE_DIET,
  COL_TYPE_INDIVIDUAL_EXPOSURE,
  COLUMN_STYLES,
  COL_IDX_SERIAL,
  COL_IDX_IS_PATIENT
} from '../constants/index';
import { logger, devLog } from '../../../utils/logger';
import { showToast, showConfirmToast } from '../logic/toast';
import { useEpidemicStore } from '@/stores/epidemicStore';
import { useGridStore } from '@/stores/gridStore';

import { useSettingsStore } from '@/stores/settingsStore';
import { useHistoryStore } from '@/stores/historyStore';
import type { GridHeader, GridRow } from '@/types/grid';
import type { ValidationManager } from '@/validation/ValidationManager';
import type { VirtualSelectionSystem } from '../logic/virtualSelectionSystem';

export interface HeaderGroup {
  text: string;
  rowspan?: number;
  colspan?: number;
  startColIndex: number;
  style?: Record<string, string | number>;
  type?: string;
  addable?: boolean;
  deletable?: boolean;
  columnCount?: number;
}

export function useGridColumns(
  validationManager: ValidationManager | undefined,
  selectionSystem: VirtualSelectionSystem,
  focusGrid: () => void,
  tryStartOperation: (op: string, options?: { blocking?: boolean; timeout?: number }) => boolean,
  endOperation: (op: string) => void
) {
  const epidemicStore = useEpidemicStore();
  const { t } = useI18n();


  const settingsStore = useSettingsStore();
  const historyStore = useHistoryStore();
  const gridStore = useGridStore();
  
  // --- State ---
  const individualExposureBackupData = ref<{rowIndex: number, value: any}[]>([]);
  const confirmedCaseBackupData = ref<{rowIndex: number, value: any}[]>([]);

  // --- Computed Properties ---
  const headers = computed(() => epidemicStore.headers || { basic: [], clinical: [], diet: [] });
  const rows = computed(() => epidemicStore.rows || []);

  const allColumnsMeta: ComputedRef<GridHeader[]> = computed(() => {
    const meta: GridHeader[] = [];
    let currentColIndex = 0;
    let currentOffsetLeft = 0;

    const pushMeta = (columnData: Partial<GridHeader> & { type: string, headerText: string }) => {
      const style = columnData.style || {};
      const widthStr = style.width || '80px';
      const width = typeof widthStr === 'number' ? widthStr : parseInt(String(widthStr), 10);
      
      meta.push({
        ...columnData,
        colIndex: currentColIndex,
        offsetLeft: currentOffsetLeft,
        text: columnData.headerText,
        value: columnData.dataKey || '',
        width: width
      } as GridHeader);
      
      currentOffsetLeft += width;
      currentColIndex++;
    };

    // 연번 컬럼
    pushMeta({
      type: COL_TYPE_SERIAL,
      headerText: t('dataInput.headers.serial'),
      headerRow: 1,
      isEditable: false,
      style: COLUMN_STYLES[COL_TYPE_SERIAL],
      dataKey: undefined,
      cellIndex: undefined
    });

    // 환자여부 컬럼
    pushMeta({
      type: COL_TYPE_IS_PATIENT,
      headerText: t('dataInput.headers.isPatient'),
      headerRow: 1,
      isEditable: true,
      style: COLUMN_STYLES[COL_TYPE_IS_PATIENT],
      dataKey: 'isPatient',
      cellIndex: undefined,
      tooltip: t('dataInput.headerTooltips.isPatient')
    });

    // '확진자 여부' 열
    if (settingsStore.isConfirmedCaseColumnVisible) {
      pushMeta({
        type: COL_TYPE_CONFIRMED_CASE,
        headerText: t('dataInput.headers.confirmed'),
        headerRow: 1,
        isEditable: true,
        style: COLUMN_STYLES[COL_TYPE_CONFIRMED_CASE],
        dataKey: 'isConfirmedCase',
        cellIndex: undefined,
        isCustom: true,
        tooltip: t('dataInput.headerTooltips.confirmed')
      });
    }

    // 기본정보 컬럼들
    const basicHeaders = headers.value.basic || [];
    basicHeaders.forEach((header: string, index: number) => {
      pushMeta({
        type: COL_TYPE_BASIC,
        headerText: header,
        headerRow: 2,
        isEditable: true,
        style: COLUMN_STYLES.default,
        dataKey: 'basicInfo',
        cellIndex: index
      });
    });

    // 임상증상 컬럼들
    const clinicalHeaders = headers.value.clinical || [];
    clinicalHeaders.forEach((header: string, index: number) => {
      pushMeta({
        type: 'clinicalSymptoms', 
        headerText: header,
        headerRow: 2,
        isEditable: true,
        style: COLUMN_STYLES.default,
        dataKey: 'clinicalSymptoms',
        cellIndex: index,
        tooltip: t('dataInput.headerTooltips.clinical')
      });
    });

    // '개별 노출시간' 열
    if (settingsStore.isIndividualExposureColumnVisible) {
      pushMeta({
        type: COL_TYPE_INDIVIDUAL_EXPOSURE,
        headerText: t('dataInput.headers.exposure'),
        headerRow: 1,
        isEditable: true,
        style: COLUMN_STYLES[COL_TYPE_ONSET],
        dataKey: 'individualExposureTime',
        cellIndex: undefined,
        isCustom: true
      });
    }

    // 증상발현시간 컬럼
    pushMeta({
      type: COL_TYPE_ONSET,
      headerText: t('dataInput.headers.onset'),
      headerRow: 1,
      isEditable: true,
      style: COLUMN_STYLES[COL_TYPE_ONSET],
      dataKey: 'symptomOnset',
      cellIndex: undefined
    });

    // 식단 컬럼들
    const dietHeaders = headers.value.diet || [];
    dietHeaders.forEach((header: string, index: number) => {
      pushMeta({
        type: 'dietInfo',
        headerText: header,
        headerRow: 2,
        isEditable: true,
        style: COLUMN_STYLES.default,
        dataKey: 'dietInfo',
        cellIndex: index,
        tooltip: t('dataInput.headerTooltips.diet')
      });
    });

    return meta;
  });

  const headerGroups = computed(() => {
    const groups: HeaderGroup[] = [];
    const basicLength = headers.value.basic?.length || 0;
    const clinicalLength = headers.value.clinical?.length || 0;
    const dietLength = headers.value.diet?.length || 0;
    let currentCol = 0;

    // 연번
    groups.push({
      text: t('dataInput.headers.serial'),
      rowspan: 2,
      startColIndex: COL_IDX_SERIAL,
      style: COLUMN_STYLES[COL_TYPE_SERIAL]
    });
    currentCol++;

    // 환자여부
    groups.push({
      text: t('dataInput.headers.isPatient'),
      rowspan: 2,
      startColIndex: COL_IDX_IS_PATIENT,
      style: COLUMN_STYLES[COL_TYPE_IS_PATIENT]
    });
    currentCol++;

    // 확진자 여부
    if (settingsStore.isConfirmedCaseColumnVisible) {
      groups.push({
        text: t('dataInput.headers.confirmed'),
        rowspan: 2,
        startColIndex: currentCol,
        style: COLUMN_STYLES[COL_TYPE_CONFIRMED_CASE]
      });
      currentCol++;
    }

    // 기본정보
    const basicStartCol = currentCol;
    if (basicLength > 0) {
      groups.push({
        text: t('dataInput.headers.basic'),
        colspan: basicLength,
        startColIndex: basicStartCol,
        type: COL_TYPE_BASIC,
        addable: true,
        deletable: true,
        columnCount: basicLength
      });
      currentCol += basicLength;
    } else {
      groups.push({
        text: t('dataInput.headers.basic'),
        colspan: 1,
        startColIndex: basicStartCol,
        type: COL_TYPE_BASIC,
        addable: true,
        deletable: false,
        columnCount: 0,
        style: { minWidth: '60px' }
      });
      currentCol++;
    }

    // 임상증상
    const clinicalStartCol = currentCol;
    if (clinicalLength > 0) {
      groups.push({
        text: t('dataInput.headers.clinical'),
        colspan: clinicalLength,
        startColIndex: clinicalStartCol,
        type: COL_TYPE_CLINICAL,
        addable: true,
        deletable: true,
        columnCount: clinicalLength
      });
      currentCol += clinicalLength;
    } else {
      groups.push({
        text: t('dataInput.headers.clinical'),
        colspan: 1,
        startColIndex: clinicalStartCol,
        type: COL_TYPE_CLINICAL,
        addable: true,
        deletable: false,
        columnCount: 0,
        style: { minWidth: '60px' }
      });
      currentCol++;
    }

    // 개별 노출시간
    if (settingsStore.isIndividualExposureColumnVisible) {
      const exposureStartCol = currentCol;
      groups.push({
        text: t('dataInput.headers.exposure'),
        rowspan: 2,
        startColIndex: exposureStartCol,
        style: COLUMN_STYLES[COL_TYPE_ONSET]
      });
      currentCol++;
    }

    // 증상발현시간
    const onsetStartCol = currentCol;
    groups.push({
      text: t('dataInput.headers.onset'),
      rowspan: 2,
      startColIndex: onsetStartCol,
      style: COLUMN_STYLES[COL_TYPE_ONSET]
    });
    currentCol++;

    // 식단
    const dietStartCol = currentCol;
    if (dietLength > 0) {
      groups.push({
        text: t('dataInput.headers.diet'),
        colspan: dietLength,
        startColIndex: dietStartCol,
        type: COL_TYPE_DIET,
        addable: true,
        deletable: true,
        columnCount: dietLength
      });
    } else {
      groups.push({
        text: t('dataInput.headers.diet'),
        colspan: 1,
        startColIndex: dietStartCol,
        type: COL_TYPE_DIET,
        addable: true,
        deletable: false,
        columnCount: 0,
        style: { minWidth: '60px' }
      });
    }

    return groups;
  });

  const tableWidth = computed(() => {
    return (
      `${allColumnsMeta.value.reduce((total, column) => {
        const width = column.width || 80; 
        return total + width;
      }, 0)}px`
    );
  });

  // --- Handlers ---

  function mapGroupTypeToMetaType(groupType: string) {
    if (groupType === COL_TYPE_CLINICAL) return 'clinicalSymptoms';
    if (groupType === COL_TYPE_DIET) return 'dietInfo';
    return groupType;
  }

  function getHeaderArrayByType(type: string): string[] {
    switch (type) {
    case COL_TYPE_BASIC:
      return headers.value.basic || [];
    case COL_TYPE_CLINICAL:
      return headers.value.clinical || [];
    case COL_TYPE_DIET:
      return headers.value.diet || [];
    default:
      return [];
    }
  }

  async function onToggleExposureColumn() {
    const current = settingsStore.isIndividualExposureColumnVisible;
    const isAdding = !current;

    logger.debug('onToggleExposureColumn 호출됨', { current, isAdding });

    const exposureInsertIndex = epidemicStore.symptomOnsetStartIndex;

    const individualExposureColumnIndex = allColumnsMeta.value.findIndex(col =>
      col.type === 'individualExposureTime' ||
            (col.dataKey === 'individualExposureTime' && col.cellIndex === 0)
    );

    if (!isAdding && individualExposureColumnIndex >= 0) {
      const currentData = rows.value || [];
      individualExposureBackupData.value = currentData.map((row: any, rowIndex: number) => {
        const value = row.individualExposureTime || '';
        return { rowIndex, value };
      }).filter((item: any) => item.value !== '' && item.value !== null && item.value !== undefined);

      logger.debug('백업된 개별 노출시간 데이터:', individualExposureBackupData.value);
    }

    const oldColumnsMeta = [...allColumnsMeta.value];

    historyStore.captureSnapshot('toggle_exposure_column');

    try {
      settingsStore.setIndividualExposureColumnVisibility(!current);
    } catch (error) {
      logger.error('개별 노출시간 열 가시성 변경 실패:', error);
      showToast('개별 노출시간 열 가시성 변경 중 오류가 발생했습니다.', 'error');
      return;
    }

    nextTick(() => {
      const newColumnsMeta = allColumnsMeta.value;
      if (validationManager && oldColumnsMeta.length !== newColumnsMeta.length) {
        logger.debug('컬럼 구조 변경 감지 - 에러 재매핑 시작');
        validationManager.remapValidationErrorsByColumnIdentity(oldColumnsMeta, newColumnsMeta);
      }
    });

    if (isAdding && individualExposureBackupData.value.length > 0) {
      devLog('백업된 데이터가 있음 - 검증 실행');

      nextTick(() => {
        const newIndividualExposureColumnIndex = allColumnsMeta.value.findIndex(col =>
          col.type === 'individualExposureTime' ||
                    (col.dataKey === 'individualExposureTime' && col.cellIndex === 0)
        );

        devLog('찾은 새 열 인덱스:', newIndividualExposureColumnIndex);

        if (newIndividualExposureColumnIndex >= 0) {
          validationManager?.validateIndividualExposureColumn(
            individualExposureBackupData.value,
            newIndividualExposureColumnIndex,
            (progress: number) => {
              if (individualExposureBackupData.value.length > 100 && progress === 100) {
                showToast(t('dataInput.toast.grid.exposureValidationComplete', { count: individualExposureBackupData.value.length }), 'success');
              }
            }
          );
        } else {
          logger.error('새로운 개별 노출시간 열 인덱스를 찾을 수 없습니다!');
          logger.debug('대안으로 exposureInsertIndex 사용:', exposureInsertIndex);
        }

        individualExposureBackupData.value = [];
      });
    }

    selectionSystem.clearSelection();
    nextTick(() => {
      if (focusGrid) focusGrid();
    });
  }

  async function onToggleConfirmedCaseColumn() {
    const current = settingsStore.isConfirmedCaseColumnVisible;
    const isAdding = !current;

    logger.debug(`확진여부 열 토글 시작: 현재 상태 ${current} -> ${!current} (${isAdding ? '추가' : '제거'})`);

    const confirmedCaseColumnIndex = allColumnsMeta.value.findIndex(col =>
      col.type === 'isConfirmedCase' ||
            (col.dataKey === 'isConfirmedCase' && col.cellIndex === null)
    );

    if (!isAdding && confirmedCaseColumnIndex >= 0) {
      const currentData = rows.value || [];
      confirmedCaseBackupData.value = currentData.map((row: any, rowIndex: number) => {
        const value = row.isConfirmedCase || '';
        return { rowIndex, value };
      }).filter((item: any) => item.value !== '' && item.value !== null && item.value !== undefined);

      devLog(`[SpecialColumn] 확진여부 데이터 백업 완료: ${confirmedCaseBackupData.value.length}개 항목`);
    }

    const oldColumnsMeta = [...allColumnsMeta.value];

    historyStore.captureSnapshot('toggle_confirmed_case_column');

    try {
      settingsStore.setConfirmedCaseColumnVisibility(!current);
    } catch (error) {
      logger.error('확진자 여부 열 가시성 변경 실패:', error);
      showToast('확진자 여부 열 가시성 변경 중 오류가 발생했습니다.', 'error');
      return;
    }

    nextTick(() => {
      const newColumnsMeta = allColumnsMeta.value;
      if (validationManager && oldColumnsMeta.length !== newColumnsMeta.length) {
        validationManager.updateColumnMetas(newColumnsMeta);
        validationManager.remapValidationErrorsByColumnIdentity(oldColumnsMeta, newColumnsMeta);
      }
    });

    if (isAdding && confirmedCaseBackupData.value.length > 0) {
      devLog(`[SpecialColumn] 백업 데이터 기반 검증 시작: ${confirmedCaseBackupData.value.length}개 셀`);

      nextTick(() => {
        const newConfirmedCaseColumnIndex = allColumnsMeta.value.findIndex(col =>
          col.type === 'isConfirmedCase' ||
                    (col.dataKey === 'isConfirmedCase' && col.cellIndex === null)
        );

        if (newConfirmedCaseColumnIndex >= 0) {
          validationManager?.validateConfirmedCaseColumn(
            confirmedCaseBackupData.value,
            newConfirmedCaseColumnIndex,
            (progress: number) => {
              if (confirmedCaseBackupData.value.length > 100 && progress === 100) {
                showToast(t('dataInput.toast.grid.confirmedValidationComplete', { count: confirmedCaseBackupData.value.length }), 'success');
              }
            }
          );
        } else {
          logger.error('새로운 확진자 여부 열 인덱스를 찾을 수 없습니다!');
        }
        confirmedCaseBackupData.value = [];
      });
    }

    selectionSystem.clearSelection();
    nextTick(() => {
      if (focusGrid) focusGrid();
    });
  }

  function onAddColumn(groupType: string) {
    if (!tryStartOperation('add_column', { blocking: true, timeout: 5000 })) {
      return;
    }

    const oldColumnsMeta = [...allColumnsMeta.value];
    const arr = getHeaderArrayByType(groupType);
    const insertIndex = arr.length;
    const metaType = mapGroupTypeToMetaType(groupType);

    devLog(`[HeaderButton] 열 추가 시작: 그룹타입 ${groupType}, 메타타입 ${metaType}, 위치 ${insertIndex}`);

    historyStore.captureSnapshot('add_column');

    epidemicStore.insertMultipleColumnsAt({
      type: metaType,
      count: 1,
      index: insertIndex
    });

    nextTick(() => {
      const newColumnsMeta = allColumnsMeta.value;

      if (validationManager && oldColumnsMeta.length !== newColumnsMeta.length) {
        devLog(`[HeaderButton] 열 구조 변경 감지: ${oldColumnsMeta.length} -> ${newColumnsMeta.length}, 에러 재매핑 시작`);

        validationManager.updateColumnMetas(newColumnsMeta);
        validationManager.remapValidationErrorsByColumnIdentity(oldColumnsMeta, newColumnsMeta);

        devLog('[HeaderButton] 에러 재매핑 완료');
      }
    });

    selectionSystem.clearSelection();
    nextTick(() => {
      if (focusGrid) focusGrid();
    });

    endOperation('add_column');
  }

  function onDeleteColumn(groupType: string) {
    if (!tryStartOperation('delete_column', { blocking: true, timeout: 5000 })) {
      return;
    }

    const arr = getHeaderArrayByType(groupType);

    if (arr.length <= 1) {
      devLog(`[HeaderButton] 열 삭제 불가: 최소 1개 열 유지 규칙 (현재 ${arr.length}개)`);
      return;
    }

    const deleteIndex = arr.length - 1;
    const metaType = mapGroupTypeToMetaType(groupType);

    devLog(`[HeaderButton] 열 삭제 시작: 그룹타입 ${groupType}, 메타타입 ${metaType}, 위치 ${deleteIndex}`);

    historyStore.captureSnapshot('delete_column');

    epidemicStore.deleteMultipleColumnsByIndex({
      columns: [{ type: metaType, index: deleteIndex }]
    });

    devLog('[HeaderButton] 열 삭제 완료');

    selectionSystem.clearSelection();
    nextTick(() => {
      if (focusGrid) focusGrid();
    });

    endOperation('delete_column');
  }

  function onDeleteEmptyCols() {
    const oldColumnsMeta = [...allColumnsMeta.value];
    
    historyStore.captureSnapshot('delete_empty_cols');
    epidemicStore.deleteEmptyColumns();
    
    // 열 삭제 후 유효성 오류 재매핑
    nextTick(() => {
      const newColumnsMeta = allColumnsMeta.value;
      if (validationManager && oldColumnsMeta.length !== newColumnsMeta.length) {
        validationManager.updateColumnMetas(newColumnsMeta);
        validationManager.remapValidationErrorsByColumnIdentity(oldColumnsMeta, newColumnsMeta);
      }
    });
    
    showToast(t('dataInput.toast.grid.colsDeleted'), 'info');
  }

  async function onResetSheet() {
    if (await showConfirmToast(t('dataInput.toast.confirmContext'))) {
      historyStore.captureSnapshot('reset_sheet');
      
      gridStore.clearAllFilters(); // 필터 초기화 추가
      
      (epidemicStore as any).resetSheet(); 
      selectionSystem.clearSelection();
      
      // 모든 유효성 오류 명시적으로 제거
      if (validationManager) {
        validationManager.clearAllErrors();
        validationManager.clearTimers();
      }
      
      showToast(t('dataInput.toast.grid.sheetReset'), 'success');
      nextTick(() => {
        if (focusGrid) focusGrid();
      });
    }
  }

  watch(allColumnsMeta, (newColumnMetas) => {
    if (validationManager && newColumnMetas.length > 0) {
      validationManager.updateColumnMetas(newColumnMetas);
    }
  }, { deep: true });

  return {
    allColumnsMeta,
    headerGroups,
    tableWidth,
    individualExposureBackupData,
    confirmedCaseBackupData,
    onToggleExposureColumn,
    onToggleConfirmedCaseColumn,
    onAddColumn,
    onDeleteColumn,
    onDeleteEmptyCols,
    onResetSheet
  };
}
