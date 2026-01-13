// excelProcessorSync.ts - Synchronous Excel processor with fallback support
import * as XLSX from 'xlsx';

export interface ExcelRanges {
    serial: number;
    isPatient: number;
    isConfirmedCase: number;
    basic: { start: number; end: number };
    clinical: { start: number; end: number };
    symptomOnset: number;
    individualExposureTime: number;
    diet: { start: number; end: number };
}

export interface SmartMatchResult {
    headers: string[];
    rows: string[][];
    emptyColumnCount: number;
}

export interface ParsedExcelRow {
    isPatient: string;
    isConfirmedCase: string;
    basicInfo: string[];
    clinicalSymptoms: string[];
    symptomOnset: string;
    individualExposureTime: string;
    dietInfo: string[];
}

export interface ParsedExcelData {
    headers: {
        basic: string[];
        clinical: string[];
        diet: string[];
    };
    rows: ParsedExcelRow[];
    hasIndividualExposureTime: boolean;
    hasConfirmedCase: boolean;
    emptyColumnCount: number;
}

// --- Utility functions (same as worker) ---
function findColumnRanges(headerRow1: any[], headerRow2: any[]): ExcelRanges {
    const ranges: Partial<ExcelRanges> = {};
    // 연번 컬럼 (고정) - Excel template 에서 첫 열
    ranges.serial = 0;
    // 환자여부 컬럼 위치 탐색 (행 1 우선, 실패 시 기본 1)
    const isPatientIndex = headerRow1.findIndex(cell => cell?.toString().includes('환자여부') || cell?.toString().includes('환자 여부'));
    ranges.isPatient = isPatientIndex !== -1 ? isPatientIndex : 1;
    // 확진 여부 컬럼 위치 탐색 (환자여부 다음)
    const isConfirmedCaseIndex = headerRow1.findIndex(cell => cell?.toString().includes('확진여부') || cell?.toString().includes('확진 여부'));
    ranges.isConfirmedCase = isConfirmedCaseIndex !== -1 ? isConfirmedCaseIndex : -1;
    // 기본정보 범위
    const basicStart = headerRow1.findIndex(cell => cell?.toString().includes('기본정보'));
    if (basicStart === -1)
        throw new Error('기본정보 카테고리 없음');
    let basicEnd = basicStart + 1;
    while (basicEnd < headerRow1.length && (!headerRow1[basicEnd] || headerRow1[basicEnd].toString().trim() === '')) {
        basicEnd++;
    }
    ranges.basic = { start: basicStart, end: basicEnd };
    // 임상증상 범위
    const clinicalStart = headerRow1.findIndex(cell => cell?.toString().includes('임상증상'));
    if (clinicalStart === -1)
        throw new Error('임상증상 카테고리 없음');
    let clinicalEnd = clinicalStart + 1;
    while (clinicalEnd < headerRow1.length && (!headerRow1[clinicalEnd] || headerRow1[clinicalEnd].toString().trim() === '')) {
        clinicalEnd++;
    }
    ranges.clinical = { start: clinicalStart, end: clinicalEnd };
    // 증상발현시간 컬럼 (2행 검색)
    const onsetIdx = headerRow2.findIndex(cell => cell?.toString().includes('증상발현시간') || cell?.toString().includes('발현시간'));
    if (onsetIdx === -1)
        throw new Error('증상발현시간 컬럼 없음');
    ranges.symptomOnset = onsetIdx;
    // 의심원 노출시간 (2행 검색, 있을 수도 있음)
    const exposureIdx = headerRow2.findIndex(cell => typeof cell === 'string' && (cell.includes('의심원노출시간') || cell.includes('의심원 노출시간')));
    ranges.individualExposureTime = exposureIdx; // -1 if not present
    // 식단 범위
    const dietStart = headerRow1.findIndex(cell => cell?.toString().includes('식단'));
    if (dietStart === -1)
        throw new Error('식단 카테고리 없음');
    ranges.diet = { start: dietStart, end: headerRow2.length };
    return ranges as ExcelRanges;
}

function convertExcelDate(cellValue: any): string {
    if (cellValue === null || cellValue === undefined || String(cellValue).trim() === '')
        return '';
    const str = String(cellValue).trim();
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(str))
        return str;
    const num = Number(cellValue);
    if (!isNaN(num) && num > 1) {
        const date = XLSX.SSF.parse_date_code(num);
        if (date && date.y) {
            const y = date.y;
            const m = String(date.m).padStart(2, '0');
            const d = String(date.d).padStart(2, '0');
            const hh = String(date.H || 0).padStart(2, '0');
            const mm = String(date.M || 0).padStart(2, '0');
            return `${y}-${m}-${d} ${hh}:${mm}`;
        }
    }
    const js = new Date(str);
    if (!isNaN(js.getTime())) {
        const y = js.getFullYear();
        const m = String(js.getMonth() + 1).padStart(2, '0');
        const d = String(js.getDate()).padStart(2, '0');
        const hh = String(js.getHours()).padStart(2, '0');
        const mm = String(js.getMinutes()).padStart(2, '0');
        return `${y}-${m}-${d} ${hh}:${mm}`;
    }
    return str;
}

/**
 * 빈 열을 감지하고 제거하는 스마트 매칭 함수
 */
function smartColumnMatching(headerRow: any[], dataRows: any[][], start: number, end: number): SmartMatchResult {
    const validHeaderIndices: number[] = [];
    const validHeaders: string[] = [];
    let emptyColumnCount = 0;
    // 1단계: 유효한 헤더가 있는 열의 인덱스 찾기
    for (let i = start; i < end; i++) {
        if (headerRow[i]?.toString().trim()) {
            validHeaderIndices.push(i);
            validHeaders.push(headerRow[i].toString().trim());
        }
        else {
            emptyColumnCount++;
        }
    }
    // 2단계: 각 행의 데이터를 유효한 헤더 인덱스에 맞춰 추출
    const alignedRows = dataRows.map(row => {
        return validHeaderIndices.map(index => (row[index] ?? '').toString().trim());
    });
    return {
        headers: validHeaders,
        rows: alignedRows,
        emptyColumnCount
    };
}

function parseAOAData(aoa: any[][]): ParsedExcelData {
    const [headerRow1 = [], headerRow2 = []] = aoa;
    const dataRows = aoa.slice(2);
    const ranges = findColumnRanges(headerRow1, headerRow2);
    const hasIndividualExposureTime = ranges.individualExposureTime !== -1;
    const hasConfirmedCase = ranges.isConfirmedCase !== -1;
    // 스마트 매칭을 사용하여 각 카테고리 처리
    const basicResult = smartColumnMatching(headerRow2, dataRows, ranges.basic.start, ranges.basic.end);
    const clinicalResult = smartColumnMatching(headerRow2, dataRows, ranges.clinical.start, ranges.clinical.end);
    const dietResult = smartColumnMatching(headerRow2, dataRows, ranges.diet.start, ranges.diet.end);
    const headers = {
        basic: basicResult.headers,
        clinical: clinicalResult.headers,
        diet: dietResult.headers
    };
    const rows: ParsedExcelRow[] = dataRows
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

/**
 * Excel 파일을 동기적으로 처리하는 함수
 */
export function processExcelFileSync(file: File, onProgress: (progress: number) => void = () => { }): Promise<ParsedExcelData> {
    if (!(file instanceof File)) {
        return Promise.reject(new Error('유효한 파일이 아닙니다.'));
    }
    return new Promise((resolve, reject) => {
        file
            .arrayBuffer()
            .then((buffer) => {
                try {
                    onProgress(10);
                    // Step 1: read workbook
                    const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' });
                    onProgress(30);
                    const firstSheetName = wb.SheetNames[0];
                    const sheet = wb.Sheets[firstSheetName];
                    // Convert to AOA
                    const aoa = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false }) as any[][];
                    onProgress(80);
                    const parsed = parseAOAData(aoa);
                    onProgress(100);
                    resolve(parsed);
                }
                catch (error: any) {
                    reject(new Error(error.message || 'Excel 파싱 실패'));
                }
            })
            .catch((err) => reject(err));
    });
}

/**
 * Excel 파일을 비동기적으로 처리하는 함수 (requestIdleCallback 사용)
 */
function processChunk(
    startIndex: number,
    chunkSize: number,
    filteredRows: any[][],
    processedRows: ParsedExcelRow[],
    ranges: ExcelRanges,
    basicResult: SmartMatchResult,
    clinicalResult: SmartMatchResult,
    dietResult: SmartMatchResult,
    hasIndividualExposureTime: boolean,
    hasConfirmedCase: boolean,
    onProgress: (progress: number) => void,
    resolve: (data: ParsedExcelData) => void
): void {
    const actualEndIndex = Math.min(startIndex + chunkSize, filteredRows.length);
    for (let i = startIndex; i < actualEndIndex; i++) {
        const row = filteredRows[i];
        processedRows.push({
            isPatient: (row[ranges.isPatient] ?? '').toString().trim(),
            isConfirmedCase: hasConfirmedCase ? (row[ranges.isConfirmedCase] ?? '').toString().trim() : '',
            basicInfo: basicResult.rows[i] || [],
            clinicalSymptoms: clinicalResult.rows[i] || [],
            symptomOnset: convertExcelDate(row[ranges.symptomOnset]),
            individualExposureTime: hasIndividualExposureTime ? convertExcelDate(row[ranges.individualExposureTime]) : '',
            dietInfo: dietResult.rows[i] || []
        });
    }
    const progress = 70 + Math.round((actualEndIndex / filteredRows.length) * 25);
    onProgress(progress);
    if (actualEndIndex < filteredRows.length) {
        // 다음 청크를 비동기적으로 처리
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => processChunk(actualEndIndex, 100, filteredRows, processedRows, ranges, basicResult, clinicalResult, dietResult, hasIndividualExposureTime, hasConfirmedCase, onProgress, resolve));
        }
        else {
            setTimeout(() => processChunk(actualEndIndex, 100, filteredRows, processedRows, ranges, basicResult, clinicalResult, dietResult, hasIndividualExposureTime, hasConfirmedCase, onProgress, resolve), 0);
        }
    }
    else {
        // 모든 처리 완료
        const totalEmptyColumns = basicResult.emptyColumnCount + clinicalResult.emptyColumnCount + dietResult.emptyColumnCount;
        onProgress(100);
        resolve({
            headers: {
                basic: basicResult.headers,
                clinical: clinicalResult.headers,
                diet: dietResult.headers
            },
            rows: processedRows,
            hasIndividualExposureTime,
            hasConfirmedCase,
            emptyColumnCount: totalEmptyColumns
        });
    }
}

export function processExcelFileAsync(file: File, onProgress: (progress: number) => void = () => { }): Promise<ParsedExcelData> {
    if (!(file instanceof File)) {
        return Promise.reject(new Error('유효한 파일이 아닙니다.'));
    }
    return new Promise((resolve, reject) => {
        file
            .arrayBuffer()
            .then((buffer) => {
                try {
                    onProgress(5);
                    // Step 1: read workbook (동기)
                    const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' });
                    onProgress(20);
                    const firstSheetName = wb.SheetNames[0];
                    const sheet = wb.Sheets[firstSheetName];
                    // Convert to AOA (동기)
                    const aoa = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false }) as any[][];
                    onProgress(40);
                    // Step 2: 비동기적으로 데이터 파싱
                    const [headerRow1 = [], headerRow2 = []] = aoa;
                    const dataRows = aoa.slice(2);
                    // 헤더 파싱 (동기)
                    const ranges = findColumnRanges(headerRow1, headerRow2);
                    const hasIndividualExposureTime = ranges.individualExposureTime !== -1;
                    const hasConfirmedCase = ranges.isConfirmedCase !== -1;
                    // 스마트 매칭을 사용하여 각 카테고리 처리
                    const basicResult = smartColumnMatching(headerRow2, dataRows, ranges.basic.start, ranges.basic.end);
                    const clinicalResult = smartColumnMatching(headerRow2, dataRows, ranges.clinical.start, ranges.clinical.end);
                    const dietResult = smartColumnMatching(headerRow2, dataRows, ranges.diet.start, ranges.diet.end);
                    onProgress(50);
                    // 데이터 행을 비동기적으로 처리
                    const filteredRows = dataRows.filter(row => {
                        const dataCells = row.slice(1);
                        return dataCells.some(cell => cell !== null && cell !== undefined && cell.toString().trim() !== '');
                    });
                    onProgress(70);
                    // 청크 단위로 처리
                    const processedRows: ParsedExcelRow[] = [];
                    // 첫 번째 청크 처리 시작
                    processChunk(0, 100, filteredRows, processedRows, ranges, basicResult, clinicalResult, dietResult, hasIndividualExposureTime, hasConfirmedCase, onProgress, resolve);
                }
                catch (error: any) {
                    reject(new Error(error.message || 'Excel 파싱 실패'));
                }
            })
            .catch((err) => reject(err));
    });
}
