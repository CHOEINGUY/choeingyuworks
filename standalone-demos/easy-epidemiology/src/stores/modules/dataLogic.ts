import { ref } from 'vue';
import type { GridRow } from '@/types/grid';
import { useSettingsStore } from '../settingsStore';

export interface EpidemicHeaders {
  basic: string[];
  clinical: string[];
  diet: string[];
}

// ----------------------------------------------------------------------
// Helper Functions
// ----------------------------------------------------------------------

function createInitialState(): { headers: EpidemicHeaders; rows: GridRow[] } {
  // Diet columns: 20 total (all empty)
  const dietHeaders = Array(20).fill('');

  // Create 100 empty rows
  const initialRows: GridRow[] = [];
  // Basic: 3 cols, Clinical: 5 cols, Diet: 20 cols
  for (let i = 0; i < 100; i++) {
    initialRows.push({
      isPatient: '',
      isConfirmedCase: '',
      basicInfo: Array(3).fill(''),
      clinicalSymptoms: Array(5).fill(''),
      symptomOnset: '',
      individualExposureTime: '',
      dietInfo: Array(20).fill('')
    });
  }

  return {
    headers: {
      basic: Array(3).fill(''),
      clinical: Array(5).fill(''),
      diet: dietHeaders
    },
    rows: initialRows
  };
}

function syncRowDataWithHeaders(headersState: EpidemicHeaders, rowsState: GridRow[]) {
  rowsState.forEach(row => {
    // Basic Info
    const basicInfo = row.basicInfo as string[];
    if (headersState.basic) {
      if (!basicInfo) row.basicInfo = [];
      const currentBasic = row.basicInfo as string[];
      while (currentBasic.length < headersState.basic.length) currentBasic.push('');
      if (currentBasic.length > headersState.basic.length) currentBasic.length = headersState.basic.length;
    }

    // Clinical Symptoms
    const clinicalSymptoms = row.clinicalSymptoms as string[];
    if (headersState.clinical) {
      if (!clinicalSymptoms) row.clinicalSymptoms = [];
      const currentClinical = row.clinicalSymptoms as string[];
      while (currentClinical.length < headersState.clinical.length) currentClinical.push('');
      if (currentClinical.length > headersState.clinical.length) currentClinical.length = headersState.clinical.length;
    }

    // Diet Info
    const dietInfo = row.dietInfo as string[];
    if (headersState.diet) {
      if (!dietInfo) row.dietInfo = [];
      const currentDiet = row.dietInfo as string[];
      while (currentDiet.length < headersState.diet.length) currentDiet.push('');
      if (currentDiet.length > headersState.diet.length) currentDiet.length = headersState.diet.length;
    }
  });
}

function isColumnEmpty(headers: EpidemicHeaders, rows: GridRow[], type: keyof EpidemicHeaders, index: number): boolean {
  const rowKeyMap: Record<keyof EpidemicHeaders, string> = { 
    basic: 'basicInfo', 
    clinical: 'clinicalSymptoms', 
    diet: 'dietInfo' 
  };
  const rowKey = rowKeyMap[type];
  if (!rowKey) return true;
  
  for (const row of rows) {
    const arr = row[rowKey] as string[] | undefined;
    if (arr && arr[index] && String(arr[index]).trim() !== '') {
      return false;
    }
  }
  
  const headerArr = headers[type];
  if (headerArr && headerArr[index] && String(headerArr[index]).trim() !== '') return false;
  
  return true;
}

export function useDataLogic() {
  const headers = ref<EpidemicHeaders>({ basic: [], clinical: [], diet: [] });
  const rows = ref<GridRow[]>([]);
  const deletedRowIndex = ref<number | null>(null);

  function loadInitialData() {
    const initialState = createInitialState();
    headers.value = initialState.headers;
    rows.value = initialState.rows;
  }

  function setInitialData(payload: { headers: EpidemicHeaders; rows: GridRow[] }) {
    headers.value = payload.headers;
    rows.value = payload.rows;
  }

  function addRows(count: number) {
    const newRows: GridRow[] = [];
    for (let i = 0; i < count; i++) {
      newRows.push({
        isPatient: '',
        isConfirmedCase: '',
        basicInfo: Array(headers.value.basic?.length || 0).fill(''),
        clinicalSymptoms: Array(headers.value.clinical?.length || 0).fill(''),
        symptomOnset: '',
        individualExposureTime: '',
        dietInfo: Array(headers.value.diet?.length || 0).fill('')
      });
    }
    rows.value = rows.value.concat(newRows);
  }

  function addColumn(type: keyof EpidemicHeaders) {
    if (!headers.value[type]) return;
    headers.value[type].push('');
    syncRowDataWithHeaders(headers.value, rows.value);
  }

  function addMultipleColumns({ type, count }: { type: keyof EpidemicHeaders; count: number }) {
    if (!headers.value[type] || count <= 0) return;
    const rowKeyMap: Record<keyof EpidemicHeaders, string> = { basic: 'basicInfo', clinical: 'clinicalSymptoms', diet: 'dietInfo' };
    const rowKey = rowKeyMap[type];
    if (!rowKey) return;
    
    for (let i = 0; i < count; i++) {
        headers.value[type].push('');
        rows.value.forEach((row) => {
            const arr = row[rowKey] as string[];
            if (!arr) (row[rowKey] as string[]) = [];
            else arr.push('');
        });
    }
  }

  function insertColumnAt({ type, index }: { type: string; index: number }) {
    let headerType: keyof EpidemicHeaders | undefined;
    let rowKey: string | undefined;
    
    if (type === 'clinicalSymptoms') { headerType = 'clinical'; rowKey = 'clinicalSymptoms'; }
    else if (type === 'dietInfo') { headerType = 'diet'; rowKey = 'dietInfo'; }
    else if (type === 'basic') { headerType = 'basic'; rowKey = 'basicInfo'; }
    else if (type === 'clinical' || type === 'diet' || type === 'basic') { headerType = type as keyof EpidemicHeaders; rowKey = type === 'basic' ? 'basicInfo' : (type === 'clinical' ? 'clinicalSymptoms' : 'dietInfo'); }
    
    if (!headerType || !rowKey || !headers.value[headerType] || index < 0 || index > headers.value[headerType].length) return;
    
    headers.value[headerType].splice(index, 0, '');
    rows.value.forEach((row) => {
      const arr = row[rowKey] as string[];
      if (!arr) (row[rowKey] as string[]) = [];
      const currentArr = row[rowKey] as string[];
      
      while (currentArr.length < headers.value[headerType].length - 1) {
        currentArr.push('');
      }
      currentArr.splice(index, 0, '');
    });
  }

  function insertMultipleColumnsAt({ type, count, index }: { type: string; count: number; index: number }) {
    let headerType: keyof EpidemicHeaders | undefined;
    let rowKey: string | undefined;
    
    if (type === 'clinicalSymptoms') { headerType = 'clinical'; rowKey = 'clinicalSymptoms'; }
    else if (type === 'dietInfo') { headerType = 'diet'; rowKey = 'dietInfo'; }
    else if (type === 'basic') { headerType = 'basic'; rowKey = 'basicInfo'; }
    else if (type === 'clinical' || type === 'diet' || type === 'basic') { headerType = type as keyof EpidemicHeaders; rowKey = type === 'basic' ? 'basicInfo' : (type === 'clinical' ? 'clinicalSymptoms' : 'dietInfo'); }
    
    if (!headerType || !rowKey || !headers.value[headerType] || count <= 0 || index < 0 || index > headers.value[headerType].length) return;
    
    for (let i = 0; i < count; i++) {
      headers.value[headerType].splice(index + i, 0, '');
    }
    
    rows.value.forEach((row) => {
      const arr = row[rowKey] as string[];
      if (!arr) row[rowKey] = [];
      const currentArr = row[rowKey] as string[];

      while (currentArr.length < headers.value[headerType].length - count) {
        currentArr.push('');
      }
      for (let i = 0; i < count; i++) {
        currentArr.splice(index + i, 0, '');
      }
    });
  }

  function deleteColumn(type: keyof EpidemicHeaders) {
    if (!headers.value[type] || headers.value[type].length <= 1) return;
    headers.value[type].pop();
    syncRowDataWithHeaders(headers.value, rows.value);
  }

  function deleteColumnByIndex({ type, index }: { type: string; index: number }) {
    let headerType: keyof EpidemicHeaders | undefined;
    let rowKey: string | undefined;
      
    if (type === 'clinicalSymptoms') { headerType = 'clinical'; rowKey = 'clinicalSymptoms'; }
    else if (type === 'dietInfo') { headerType = 'diet'; rowKey = 'dietInfo'; }
    else if (type === 'basic') { headerType = 'basic'; rowKey = 'basicInfo'; }
      
    if (!headerType || !rowKey || !headers.value[headerType] || index < 0 || index >= headers.value[headerType].length) return;
      
    headers.value[headerType].splice(index, 1);
    rows.value.forEach((row) => {
        const arr = row[rowKey] as string[];
        if (arr) arr.splice(index, 1);
    });
  }

  function deleteMultipleColumnsByIndex({ columns }: { columns: { type: string; index: number }[] }) {
    if (!columns || columns.length === 0) return;
    const groupedByType = columns.reduce((acc, { type, index }) => {
      if (!acc[type]) acc[type] = [];
      acc[type].push(index);
      return acc;
    }, {} as Record<string, number[]>);

    for (const type in groupedByType) {
      const indices = groupedByType[type];
      let headerType: keyof EpidemicHeaders | undefined;
      let rowKey: string | undefined;
        
      if (type === 'clinicalSymptoms') { headerType = 'clinical'; rowKey = 'clinicalSymptoms'; }
      else if (type === 'dietInfo') { headerType = 'diet'; rowKey = 'dietInfo'; }
      else if (type === 'basic') { headerType = 'basic'; rowKey = 'basicInfo'; }
        
      if (!headerType || !rowKey || !headers.value[headerType]) continue;
      const sortedIndices = indices.sort((a, b) => b - a);
      sortedIndices.forEach(index => {
        if (headerType && index >= 0 && index < headers.value[headerType].length) {
          headers.value[headerType].splice(index, 1);
          rows.value.forEach(row => {
               if(rowKey) {
                   const arr = row[rowKey] as string[];
                   if(arr) arr.splice(index, 1);
               }
          });
        }
      });
    }
  }

  function clearColumnData({ type, index }: { type: string; index: number }) {
    let headerType: keyof EpidemicHeaders | undefined;
    let rowKey: string | undefined;
      
    if (type === 'clinicalSymptoms') { headerType = 'clinical'; rowKey = 'clinicalSymptoms'; }
    else if (type === 'dietInfo') { headerType = 'diet'; rowKey = 'dietInfo'; }
    else if (type === 'basic') { headerType = 'basic'; rowKey = 'basicInfo'; }
      
    if (!headerType || !rowKey || !headers.value[headerType] || index < 0 || index >= headers.value[headerType].length) return;
      
    headers.value[headerType][index] = '';
    rows.value.forEach((row) => {
      const arr = row[rowKey] as string[];
      if (arr && index < arr.length) {
        arr[index] = '';
      }
    });
  }

  function clearMultipleColumnsData({ columns }: { columns: { type: string; cellIndex: number }[] }) {
    if (!columns || columns.length === 0) return;
    columns.forEach(col => {
      const { type, cellIndex } = col;
      let headerType: keyof EpidemicHeaders | undefined;
      let rowKey: string | undefined;
      
      if (type === 'clinicalSymptoms') { headerType = 'clinical'; rowKey = 'clinicalSymptoms'; }
      else if (type === 'dietInfo') { headerType = 'diet'; rowKey = 'dietInfo'; }
      else if (type === 'basic') { headerType = 'basic'; rowKey = 'basicInfo'; }
      
      if (!headerType || !rowKey || !headers.value[headerType] || cellIndex < 0 || cellIndex >= headers.value[headerType].length) return;
      headers.value[headerType][cellIndex] = '';
      rows.value.forEach((row) => {
         const arr = row[rowKey] as string[];
        if (arr && cellIndex < arr.length) {
          arr[cellIndex] = '';
        }
      });
    });
  }

  function clearFixedColumnData({ type }: { type: string }) {
    if (type === 'isPatient') rows.value.forEach((row) => (row.isPatient = ''));
    else if (type === 'symptomOnset') rows.value.forEach((row) => (row.symptomOnset = ''));
    else if (type === 'individualExposureTime') rows.value.forEach((row) => (row.individualExposureTime = ''));
  }

  function updateHeader({ headerType, index, text }: { headerType: keyof EpidemicHeaders; index: number; text: string }) {
    if (headers.value[headerType] && headers.value[headerType][index] !== undefined) {
      headers.value[headerType][index] = text;
    }
  }

  function updateCell({ rowIndex, key, value, cellIndex }: { rowIndex: number; key: string; value: any; cellIndex?: number }) {
    if (rowIndex < 0) {
      if (cellIndex === undefined || cellIndex === null) return;
      
      const headerKeyMap: Record<string, keyof EpidemicHeaders> = {
        basicInfo: 'basic',
        clinicalSymptoms: 'clinical',
        dietInfo: 'diet'
      };
      
      const headerType = headerKeyMap[key];
      if (headerType && headers.value[headerType]) {
        headers.value[headerType][cellIndex] = String(value ?? '');
      }
      return;
    }

    if (!rows.value[rowIndex]) return;
    if (cellIndex !== null && cellIndex !== undefined) {
      const arr = rows.value[rowIndex][key] as string[];
      if (!arr) (rows.value[rowIndex][key] as string[]) = [];
      const currentArr = rows.value[rowIndex][key] as string[];
      while (currentArr.length <= cellIndex) currentArr.push('');
      currentArr[cellIndex] = String(value ?? '');
    } else {
      (rows.value[rowIndex][key] as string | number) = String(value ?? '');
    }
  }

  function updateCellsBatch(updates: { rowIndex: number; key: string; value: any; cellIndex?: number }[]) {
    if (!Array.isArray(updates)) return;
    updates.forEach(({ rowIndex, key, value, cellIndex }) => {
      updateCell({ rowIndex, key, value, cellIndex });
    });
  }

  function deleteRow(rowIndex: number) {
    if (rowIndex !== null && rowIndex >= 0 && rowIndex < rows.value.length) {
      rows.value.splice(rowIndex, 1);
      deletedRowIndex.value = rowIndex;
    }
  }

  function deleteMultipleRows({ startRow, endRow }: { startRow: number; endRow: number }) {
    if (startRow !== null && startRow >= 0 && endRow >= startRow && endRow < rows.value.length) {
      rows.value.splice(startRow, endRow - startRow + 1);
      deletedRowIndex.value = startRow;
    }
  }

  function deleteIndividualRows({ rows: rowsToDelete }: { rows: number[] }) {
    if (!rowsToDelete || rowsToDelete.length === 0) return;
    const sortedRows = [...rowsToDelete].sort((a, b) => b - a);
    for (const rowIndex of sortedRows) {
      if (rowIndex !== null && rowIndex >= 0 && rowIndex < rows.value.length) {
        rows.value.splice(rowIndex, 1);
      }
    }
    if (rowsToDelete.length > 0) deletedRowIndex.value = Math.min(...rowsToDelete);
  }

  function insertRowAt({ index, count = 1 }: { index: number; count: number }) {
    const newRows: GridRow[] = Array(count).fill(null).map(() => ({
      isPatient: '',
      isConfirmedCase: '',
      basicInfo: Array(headers.value.basic?.length || 0).fill(''),
      clinicalSymptoms: Array(headers.value.clinical?.length || 0).fill(''),
      symptomOnset: '',
      individualExposureTime: '',
      dietInfo: Array(headers.value.diet?.length || 0).fill('')
    }));
    if (index >= 0 && index <= rows.value.length) {
      rows.value.splice(index, 0, ...newRows);
    }
  }

  function clearDeletedRowIndex() {
    deletedRowIndex.value = null;
  }

  function deleteEmptyRows() {
    const emptyRowIndices: number[] = [];
    const rowKeyMap: Record<string, string> = { basic: 'basicInfo', clinical: 'clinicalSymptoms', diet: 'dietInfo' };
    
    rows.value.forEach((row, index) => {
      let isEmpty = true;
      if (row.isPatient && String(row.isPatient).trim() !== '') isEmpty = false;
      if (row.symptomOnset && String(row.symptomOnset).trim() !== '') isEmpty = false;
      
      if (isEmpty) {
        for (const key in rowKeyMap) {
            const dataKey = rowKeyMap[key];
            const arr = row[dataKey] as any[];
            if (arr && arr.some(val => val !== null && val !== undefined && String(val).trim() !== '')) {
            isEmpty = false; break;
            }
        }
      }
      
      if (isEmpty) emptyRowIndices.push(index);
    });
    
    for (let i = emptyRowIndices.length - 1; i >= 0; i--) {
      rows.value.splice(emptyRowIndices[i], 1);
    }
  }

  function deleteEmptyColumns() {
    const rowKeyMap: Record<string, string> = { basic: 'basicInfo', clinical: 'clinicalSymptoms', diet: 'dietInfo' };
    const types: (keyof EpidemicHeaders)[] = ['basic', 'clinical', 'diet'];
    
    for (const headerType of types) {
      if (!headers.value[headerType]) continue;
      const emptyIndices: number[] = [];
      for (let i = 0; i < headers.value[headerType].length; i++) {
        if (isColumnEmpty(headers.value, rows.value, headerType, i)) emptyIndices.push(i);
      }
      
      // Ensure at least 1 column remains
      const maxRemovable = headers.value[headerType].length - 1;
      const indicesToRemove = emptyIndices.slice(0, emptyIndices.length > maxRemovable ? maxRemovable : emptyIndices.length);
      
      // Sort in descending order to splice correctly
      indicesToRemove.sort((a,b) => b-a);

      for (const indexToRemove of indicesToRemove) {
        headers.value[headerType].splice(indexToRemove, 1);
        rows.value.forEach((row) => {
          const rowKey = rowKeyMap[headerType];
          const arr = row[rowKey] as string[];
          if (arr) arr.splice(indexToRemove, 1);
        });
      }

      // If somehow empty, add one back (safety net)
      if (headers.value[headerType].length === 0) {
        headers.value[headerType].push('');
        rows.value.forEach((row) => {
          const rowKey = rowKeyMap[headerType];
          const arr = row[rowKey] as string[];
          if (!arr) (row[rowKey] as string[]) = [];
          (row[rowKey] as string[]).push('');
        });
      }
    }
  }

  function clearRowData({ rowIndex }: { rowIndex: number }) {
    if (rows.value[rowIndex]) {
      const row = rows.value[rowIndex];
      row.isPatient = ''; 
      row.isConfirmedCase = ''; 
      row.symptomOnset = ''; 
      row.individualExposureTime = '';
      
      const basicInfo = row.basicInfo as any[];
      if (basicInfo) basicInfo.fill('');
      
      const clinicalSymptoms = row.clinicalSymptoms as any[];
      if (clinicalSymptoms) clinicalSymptoms.fill('');
      
      const dietInfo = row.dietInfo as any[];
      if (dietInfo) dietInfo.fill('');
    }
  }

  function clearMultipleRowsData({ startRow, endRow }: { startRow: number; endRow: number }) {
    for (let i = startRow; i <= endRow; i++) {
      clearRowData({ rowIndex: i });
    }
  }

  function clearIndividualRowsData({ rowIndices }: { rowIndices: number[] }) {
    if (!rowIndices || !Array.isArray(rowIndices)) return;
    rowIndices.forEach(rowIndex => clearRowData({ rowIndex }));
  }

  function updateHeadersFromExcel(newHeaders: EpidemicHeaders) {
    headers.value = newHeaders;
    syncRowDataWithHeaders(headers.value, rows.value);
  }

  function addRowsFromExcel(newRows: GridRow[]) {
    rows.value = newRows;
  }

  function pasteHeaderData({ startColIndex, headerType, data }: { startColIndex: number; headerType: keyof EpidemicHeaders; data: string[] }) {
    if (!headers.value[headerType]) return;
    const basicStartIndex = 2; 
    const clinicalStartIndex = basicStartIndex + (headers.value.basic?.length || 0);
    const dietStartIndex = clinicalStartIndex + (headers.value.clinical?.length || 0) + 1;
    
    let currentHeaderArrayIndex = -1;
    if (headerType === 'basic') currentHeaderArrayIndex = startColIndex - basicStartIndex;
    else if (headerType === 'clinical') currentHeaderArrayIndex = startColIndex - clinicalStartIndex;
    else if (headerType === 'diet') currentHeaderArrayIndex = startColIndex - dietStartIndex;
    
    if (currentHeaderArrayIndex < 0) return;
    for (let i = 0; i < data.length; i++) {
      const targetIndex = currentHeaderArrayIndex + i;
      if (targetIndex >= 0 && targetIndex < headers.value[headerType].length) {
        headers.value[headerType][targetIndex] = data[i] ?? '';
      }
    }
  }

  function pasteData(payload: { startRowIndex: number; startColIndex: number; data: string[][] }) {
    const settingsStore = useSettingsStore();
    const { startRowIndex, startColIndex, data } = payload;
    const isIndividualExposureVisible = (settingsStore as any).isIndividualExposureColumnVisible;
    const isConfirmedCaseVisible = (settingsStore as any).isConfirmedCaseColumnVisible;
    
    let currentColIndex = 0;
    const colMap: Record<number, { type: string }> = {};
    colMap[currentColIndex++] = { type: 'serial' };
    colMap[currentColIndex++] = { type: 'isPatient' };
    if (isConfirmedCaseVisible) { colMap[currentColIndex++] = { type: 'isConfirmedCase' }; }
    
    const dynamicBasicStartIndex = currentColIndex;
    const clinicalStartIndex = dynamicBasicStartIndex + (headers.value.basic?.length || 0);
    const individualExposureIndex = isIndividualExposureVisible ? clinicalStartIndex + (headers.value.clinical?.length || 0) : -1;
    const onsetIndex = clinicalStartIndex + (headers.value.clinical?.length || 0) + (isIndividualExposureVisible ? 1 : 0);
    const dietStartIndex = onsetIndex + 1;

    for (let i = 0; i < data.length; i++) {
      const rowData = data[i];
      const currentRowIndex = startRowIndex + i;
      if (currentRowIndex >= rows.value.length) {
        rows.value.push({
          isPatient: '', isConfirmedCase: '',
          basicInfo: Array(headers.value.basic?.length || 0).fill(''),
          clinicalSymptoms: Array(headers.value.clinical?.length || 0).fill(''),
          symptomOnset: '', individualExposureTime: '',
          dietInfo: Array(headers.value.diet?.length || 0).fill('')
        });
      }
      const targetRow = rows.value[currentRowIndex];
      if (!targetRow) continue;
      
      let currentColumn = startColIndex;
      for (let j = 0; j < rowData.length; j++) {
        const cellValue = rowData[j] ?? '';
        
        if (colMap[currentColumn]?.type === 'isPatient') {
          targetRow.isPatient = cellValue;
        } else if (colMap[currentColumn]?.type === 'isConfirmedCase') {
          targetRow.isConfirmedCase = cellValue;
        } else if (isIndividualExposureVisible && currentColumn === individualExposureIndex) {
          targetRow.individualExposureTime = cellValue;
        } else if (currentColumn === onsetIndex) {
          targetRow.symptomOnset = cellValue;
        } else if (currentColumn >= dynamicBasicStartIndex && currentColumn < clinicalStartIndex) {
          const idx = currentColumn - dynamicBasicStartIndex;
          if (idx < (headers.value.basic?.length || 0)) {
            if (!targetRow.basicInfo) targetRow.basicInfo = [];
            const arr = targetRow.basicInfo as string[];
            while(arr.length <= idx) arr.push('');
            arr[idx] = cellValue;
          }
        } else if (currentColumn >= clinicalStartIndex && currentColumn < (isIndividualExposureVisible ? individualExposureIndex : onsetIndex)) {
          const idx = currentColumn - clinicalStartIndex;
          if (idx < (headers.value.clinical?.length || 0)) {
            if (!targetRow.clinicalSymptoms) targetRow.clinicalSymptoms = [];
            const arr = targetRow.clinicalSymptoms as string[];
            while(arr.length <= idx) arr.push('');
            arr[idx] = cellValue;
          }
        } else if (currentColumn >= dietStartIndex) {
          const idx = currentColumn - dietStartIndex;
          if (idx < (headers.value.diet?.length || 0)) {
            if (!targetRow.dietInfo) targetRow.dietInfo = [];
            const arr = targetRow.dietInfo as string[];
            while(arr.length <= idx) arr.push('');
            arr[idx] = cellValue;
          }
        }
        currentColumn++;
      }
    }
  }

  function updateConfirmedCase({ rowIndex, value }: { rowIndex: number; value: any }) {
    if (rows.value[rowIndex]) rows.value[rowIndex].isConfirmedCase = String(value);
  }

  function updateIndividualExposureTime({ rowIndex, value }: { rowIndex: number; value: any }) {
    if (rows.value[rowIndex]) rows.value[rowIndex].individualExposureTime = String(value);
  }

  // Need to recreate this since it depends on computed start indices
  // We will assume that `handleEnter` logic should return index, and store will handle it?
  // No, handleEnter is an action that modifies state (addRows).
  // But strictly `handleEnter` calculates indices. 
  // We need `useGetterLogic` or similar? 
  // Let's postpone `handleEnter` or pass the getters as arguments? 
  // Actually, getters are computed properties on the Store. We can access store instance or pass values.
  // For now, let's keep `handleEnter` here but we need the start indices.
  // We can pass them as arguments to `handleEnter` since they are computed elsewhere.
  // OR we can move the getters into this module too? 
  // Yes, moving getters into `dataLogic` is valid.

  return {
    headers,
    rows,
    deletedRowIndex,
    createInitialState, // exported for reset
    loadInitialData,
    setInitialData,
    addRows,
    addColumn,
    addMultipleColumns,
    insertColumnAt,
    insertMultipleColumnsAt,
    deleteColumn,
    deleteColumnByIndex,
    deleteMultipleColumnsByIndex,
    clearColumnData,
    clearMultipleColumnsData,
    clearFixedColumnData,
    updateHeader,
    updateCell,
    updateCellsBatch,
    deleteRow,
    deleteMultipleRows,
    deleteIndividualRows,
    insertRowAt,
    clearDeletedRowIndex,
    deleteEmptyRows,
    deleteEmptyColumns,
    clearRowData,
    clearMultipleRowsData,
    clearIndividualRowsData,
    updateHeadersFromExcel,
    addRowsFromExcel,
    pasteHeaderData,
    pasteData,
    updateConfirmedCase,
    updateIndividualExposureTime
  };
}
