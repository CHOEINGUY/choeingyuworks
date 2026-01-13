// excelWorker.ts - Web Worker for parsing Excel files using SheetJS

import * as XLSX from 'xlsx';
import { RecoveryHeaders } from '@/store/utils/recovery';
import { GridRow } from '@/types/grid';

// Define the worker context
const ctx: Worker = self as any;

// 워커 오류 처리
ctx.onerror = (error) => {
  ctx.postMessage({ type: 'error', error: error.message || 'Worker error' });
};

interface ColumnRanges {
  serial: number;
  isPatient: number;
  isConfirmedCase: number;
  basic: { start: number; end: number };
  clinical: { start: number; end: number };
  symptomOnset: number;
  individualExposureTime: number;
  diet: { start: number; end: number };
}

function findColumnRanges(headerRow1: any[], headerRow2: any[]): ColumnRanges {
  const ranges: any = {};

  // 연번 컬럼 (고정) - Excel template 에서 첫 열
  ranges.serial = 0;

  // 환자여부 컬럼 위치 탐색 (행 1 우선, 실패 시 기본 1)
  const isPatientIndex = headerRow1.findIndex(cell =>
    cell?.toString().includes('환자여부') || cell?.toString().includes('환자 여부')
  );
  ranges.isPatient = isPatientIndex !== -1 ? isPatientIndex : 1;

  // 확진 여부 컬럼 위치 탐색 (환자여부 다음)
  const isConfirmedCaseIndex = headerRow1.findIndex(cell =>
    cell?.toString().includes('확진여부') || cell?.toString().includes('확진 여부')
  );
  ranges.isConfirmedCase = isConfirmedCaseIndex !== -1 ? isConfirmedCaseIndex : -1;

  // 기본정보 범위
  const basicStart = headerRow1.findIndex(cell => cell?.toString().includes('기본정보'));
  if (basicStart === -1) throw new Error('기본정보 카테고리 없음');
  let basicEnd = basicStart + 1;
  while (basicEnd < headerRow1.length && (!headerRow1[basicEnd] || headerRow1[basicEnd].toString().trim()==='')) {
    basicEnd++;
  }
  ranges.basic = { start: basicStart, end: basicEnd };

  // 임상증상 범위
  const clinicalStart = headerRow1.findIndex(cell => cell?.toString().includes('임상증상'));
  if (clinicalStart === -1) throw new Error('임상증상 카테고리 없음');
  let clinicalEnd = clinicalStart + 1;
  while (clinicalEnd < headerRow1.length && (!headerRow1[clinicalEnd] || headerRow1[clinicalEnd].toString().trim()==='')) {
    clinicalEnd++;
  }
  ranges.clinical = { start: clinicalStart, end: clinicalEnd };

  // 증상발현시간 컬럼 (2행 검색)
  const onsetIdx = headerRow2.findIndex(cell =>
    cell?.toString().includes('증상발현시간') || cell?.toString().includes('발현시간')
  );
  if (onsetIdx === -1) throw new Error('증상발현시간 컬럼 없음');
  ranges.symptomOnset = onsetIdx;

  // 의심원 노출시간 (2행 검색, 있을 수도 있음)
  const exposureIdx = headerRow2.findIndex(cell =>
    typeof cell === 'string' && (cell.includes('의심원노출시간') || cell.includes('의심원 노출시간'))
  );
  ranges.individualExposureTime = exposureIdx; // -1 if not present

  // 식단 범위
  const dietStart = headerRow1.findIndex(cell => cell?.toString().includes('식단'));
  if (dietStart === -1) throw new Error('식단 카테고리 없음');
  ranges.diet = { start: dietStart, end: headerRow2.length };

  return ranges as ColumnRanges;
}

function convertExcelDate(cellValue: any): string {
  if (cellValue === null || cellValue === undefined || String(cellValue).trim() === '') return '';
  const str = String(cellValue).trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(str)) return str;
  const num = Number(cellValue);
  if (!isNaN(num) && num > 1) {
    const date = XLSX.SSF.parse_date_code(num);
    if (date && date.y) {
      const y = date.y;
      const m = String(date.m).padStart(2,'0');
      const d = String(date.d).padStart(2,'0');
      const hh = String(date.H||0).padStart(2,'0');
      const mm = String(date.M||0).padStart(2,'0');
      return `${y}-${m}-${d} ${hh}:${mm}`;
    }
  }
  const js = new Date(str);
  if (!isNaN(js.getTime())) {
    const y = js.getFullYear();
    const m = String(js.getMonth()+1).padStart(2,'0');
    const d = String(js.getDate()).padStart(2,'0');
    const hh = String(js.getHours()).padStart(2,'0');
    const mm = String(js.getMinutes()).padStart(2,'0');
    return `${y}-${m}-${d} ${hh}:${mm}`;
  }
  return str;
}

interface SmartMatchingResult {
  headers: string[];
  rows: string[][];
  emptyColumnCount: number;
}

/**
 * 빈 열을 감지하고 제거하는 스마트 매칭 함수
 */
function smartColumnMatching(headerRow: any[], dataRows: any[][], start: number, end: number): SmartMatchingResult {
  const validHeaderIndices: number[] = [];
  const validHeaders: string[] = [];
  let emptyColumnCount = 0;

  // 1단계: 유효한 헤더가 있는 열의 인덱스 찾기
  for (let i = start; i < end; i++) {
    const cellValue = headerRow[i];
    if (cellValue && typeof cellValue === 'string' && cellValue.trim()) {
      validHeaderIndices.push(i);
      validHeaders.push(cellValue.trim());
    } else if (cellValue && typeof cellValue !== 'string' && String(cellValue).trim()) {
      validHeaderIndices.push(i);
      validHeaders.push(String(cellValue).trim());
    } else {
      emptyColumnCount++;
    }
  }

  // 2단계: 각 행의 데이터를 유효한 헤더 인덱스에 맞춰 추출
  const alignedRows = dataRows.map(row => {
    return validHeaderIndices.map(index => 
      (row[index] ?? '').toString().trim()
    );
  });

  return {
    headers: validHeaders,
    rows: alignedRows,
    emptyColumnCount
  };
}

interface ParsedAOAData {
  headers: RecoveryHeaders;
  rows: GridRow[];
  hasIndividualExposureTime: boolean;
  hasConfirmedCase: boolean;
  emptyColumnCount: number;
}

function parseAOAData(aoa: any[][]): ParsedAOAData {
  const [headerRow1 = [], headerRow2 = []] = aoa;
  const dataRows = aoa.slice(2);

  const ranges = findColumnRanges(headerRow1, headerRow2);
  const hasIndividualExposureTime = ranges.individualExposureTime !== -1;
  const hasConfirmedCase = ranges.isConfirmedCase !== -1;

  // 스마트 매칭을 사용하여 각 카테고리 처리
  const basicResult = smartColumnMatching(headerRow2, dataRows, ranges.basic.start, ranges.basic.end);
  const clinicalResult = smartColumnMatching(headerRow2, dataRows, ranges.clinical.start, ranges.clinical.end);
  const dietResult = smartColumnMatching(headerRow2, dataRows, ranges.diet.start, ranges.diet.end);

  const headers: RecoveryHeaders = {
    basic: basicResult.headers,
    clinical: clinicalResult.headers,
    diet: dietResult.headers
  };

  const rows: GridRow[] = dataRows
    .filter(row => {
      // A열(연번) 제외하고 데이터 유무 확인 (연번은 필수 아님)
      const dataCells = row.slice(1);
      return dataCells.some(cell => cell !== null && cell !== undefined && cell.toString().trim() !== '');
    })
    .map((row, index) => ({
      isPatient: (row[ranges.isPatient] ?? '').toString().trim(),
      isConfirmedCase: hasConfirmedCase ? (row[ranges.isConfirmedCase] ?? '').toString().trim() : '',
      basicInfo: basicResult.rows[index] || [],
      clinicalSymptoms: clinicalResult.rows[index] || [],
      symptomOnset: convertExcelDate(row[ranges.symptomOnset]),
      individualExposureTime: hasIndividualExposureTime ? convertExcelDate(row[ranges.individualExposureTime]) : '',
      dietInfo: dietResult.rows[index] || []
    }));

  // 총 제거된 빈 열 개수 계산
  const totalEmptyColumns = basicResult.emptyColumnCount + clinicalResult.emptyColumnCount + dietResult.emptyColumnCount;

  return { 
    headers, 
    rows, 
    hasIndividualExposureTime,
    hasConfirmedCase,
    emptyColumnCount: totalEmptyColumns
  };
}

ctx.onmessage = function (e: MessageEvent) {
  try {
    const { buffer } = e.data;
    if (!buffer) {
      ctx.postMessage({ type: 'error', error: 'No data received' });
      return;
    }
    // Step 1: read workbook
    const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' });
    ctx.postMessage({ type: 'progress', progress: 30 });

    const firstSheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[firstSheetName];

    // Convert to AOA – streaming is not easily available in browser; this is simplified.
    const aoa = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false }) as any[][];
    ctx.postMessage({ type: 'progress', progress: 80 });

    const parsed = parseAOAData(aoa);

    ctx.postMessage({ type: 'complete', data: parsed });
  } catch (err: any) {
    ctx.postMessage({ type: 'error', error: err.message || String(err) });
  }
};