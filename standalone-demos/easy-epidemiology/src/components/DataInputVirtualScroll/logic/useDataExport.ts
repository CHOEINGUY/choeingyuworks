import * as XLSX from 'xlsx';
import type { GridHeader, GridRow } from '@/types/grid';

interface ExcelRange {
    s: { r: number; c: number };
    e: { r: number; c: number };
}

/**
 * 가상 스크롤 버전 전용: 데이터 내보내기/템플릿 다운로드 유틸리티
 * (Refactor 버전의 useDataExport 를 복사하여 의존성 제거)
 */
export function useDataExport() {
    /**
     * 표준 템플릿 헤더 구조 생성
     */
    const generateStandardHeaders = (allColumnsMeta: GridHeader[], hasIndividualExposure = false, hasConfirmedCase = false) => {
        const headerRow1: string[] = [];
        const headerRow2: string[] = [];
        // 실제 컬럼 순서에 맞게 표준 순서 수정
        const standardOrder = [
            'serial', 'isPatient',
            ...(hasConfirmedCase ? ['isConfirmedCase'] : []),
            'basic', 'clinicalSymptoms',
            ...(hasIndividualExposure ? ['individualExposureTime'] : []), 'symptomOnset', 'dietInfo'
        ];
        // 표준 순서에 따라 헤더 생성
        standardOrder.forEach(type => {
            const columns = allColumnsMeta.filter(col => col.type === type);
            if (type === 'basic') {
                // 기본정보 그룹
                columns.forEach((_col, index) => {
                    if (index === 0) {
                        headerRow1.push('기본정보');
                    }
                    else {
                        headerRow1.push('');
                    }
                    headerRow2.push(getCleanHeaderText(_col));
                });
            }
            else if (type === 'clinicalSymptoms') {
                // 임상증상 그룹
                columns.forEach((_col, index) => {
                    if (index === 0) {
                        headerRow1.push('임상증상');
                    }
                    else {
                        headerRow1.push('');
                    }
                    headerRow2.push(getCleanHeaderText(_col));
                });
            }
            else if (type === 'dietInfo') {
                // 식단 그룹
                columns.forEach((_col, index) => {
                    if (index === 0) {
                        headerRow1.push('식단');
                    }
                    else {
                        headerRow1.push('');
                    }
                    headerRow2.push(getCleanHeaderText(_col));
                });
            }
            else if (type === 'serial') {
                // 연번 (1행과 2행 병합)
                headerRow1.push('연번');
                headerRow2.push('');
            }
            else if (type === 'isPatient') {
                // 환자여부 (1행과 2행 병합)
                headerRow1.push('환자여부');
                headerRow2.push('');
            }
            else if (type === 'isConfirmedCase') {
                // 확진여부 (1행과 2행 병합)
                headerRow1.push('확진여부');
                headerRow2.push('');
            }
            else if (type === 'symptomOnset') {
                // 증상발현시간 (1행: 형식 설명, 2행: 헤더) - 병합 없음
                headerRow1.push('yyyy/mm/dd OR yyyy-mm-dd hh:mm ');
                headerRow2.push('증상발현시간');
            }
            else if (type === 'individualExposureTime') {
                // 개별 노출시간 (1행: 형식 설명, 2행: 헤더) - 병합 없음
                headerRow1.push('yyyy/mm/dd OR yyyy-mm-dd hh:mm ');
                headerRow2.push('의심원 노출시간');
            }
        });
        return { headerRow1, headerRow2 };
    };
    /**
     * 헤더 텍스트에서 HTML 태그 제거 및 정리
     */
    const getCleanHeaderText = (columnMeta: GridHeader): string => {
        if (!columnMeta || !columnMeta.headerText)
            return '';
        return columnMeta.headerText
            .replace(/<br\s*\/?>/gi, ' ') // <br> 태그를 공백으로 변환
            .replace(/<[^>]*>/g, '') // 모든 HTML 태그 제거
            .trim();
    };
    /**
     * 컬럼을 표준 순서로 정렬
     */
    const reorderColumnsForExport = (allColumnsMeta: GridHeader[], hasIndividualExposure = false, hasConfirmedCase = false): GridHeader[] => {
        const standardOrder = [
            'serial', 'isPatient',
            ...(hasConfirmedCase ? ['isConfirmedCase'] : []),
            'basic', 'clinicalSymptoms',
            ...(hasIndividualExposure ? ['individualExposureTime'] : []), 'symptomOnset', 'dietInfo'
        ];
        const orderedColumns: GridHeader[] = [];
        standardOrder.forEach(type => {
            const typeColumns = allColumnsMeta.filter(col => col.type === type);
            orderedColumns.push(...typeColumns);
        });
        return orderedColumns;
    };
    /**
     * 날짜/시간 형식을 표준 형식으로 변환
     */
    const ensureDateTimeFormat = (value: any): string => {
        if (!value || value.toString().trim() === '')
            return '';
        const strValue = value.toString().trim();
        // 이미 표준 형식인지 확인
        const standardFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
        if (standardFormat.test(strValue))
            return strValue;
        // 다른 형식이면 변환 시도
        try {
            const date = new Date(strValue);
            if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${year}-${month}-${day} ${hours}:${minutes}`;
            }
        }
        catch (error) {
            console.warn('Date conversion failed:', error);
        }
        return strValue; // 변환 실패시 원본 반환
    };
    /**
     * 셀 값을 표준 형식으로 변환
     */
    const formatCellValue = (value: any, columnMeta: GridHeader): string => {
        if (!value && value !== 0)
            return '';
        // 날짜/시간 컬럼의 경우 표준 형식으로 변환
        if (columnMeta.type === 'symptomOnset' || columnMeta.type === 'individualExposureTime') {
            return ensureDateTimeFormat(value);
        }
        return value.toString();
    };
    /**
     * 헤더 병합 정보 생성 (템플릿과 동일한 구조)
     */
    const generateMerges = (headerRow1: string[], headerRow2: string[], allColumnsMeta: GridHeader[], hasIndividualExposure = false, hasConfirmedCase = false) => {
        const merges: ExcelRange[] = [];
        // 현재 컬럼 인덱스 추적
        let currentCol = 0;
        // 표준 순서에 따라 병합 정보 생성
        const standardOrder = [
            'serial', 'isPatient',
            ...(hasConfirmedCase ? ['isConfirmedCase'] : []),
            'basic', 'clinicalSymptoms',
            ...(hasIndividualExposure ? ['individualExposureTime'] : []), 'symptomOnset', 'dietInfo'
        ];
        standardOrder.forEach(type => {
            const columns = allColumnsMeta.filter(col => col.type === type);
            if (type === 'serial') {
                // 연번: 1행과 2행 병합 (컬럼 개수와 상관없이)
                if (columns.length > 0) {
                    merges.push({ s: { c: currentCol, r: 0 }, e: { c: currentCol, r: 1 } });
                    currentCol += columns.length;
                }
            }
            else if (type === 'isPatient') {
                // 환자여부: 1행과 2행 병합 (컬럼 개수와 상관없이)
                if (columns.length > 0) {
                    merges.push({ s: { c: currentCol, r: 0 }, e: { c: currentCol, r: 1 } });
                    currentCol += columns.length;
                }
            }
            else if (type === 'isConfirmedCase') {
                // 확진 여부: 1행과 2행 병합 (컬럼 개수와 상관없이)
                if (columns.length > 0) {
                    merges.push({ s: { c: currentCol, r: 0 }, e: { c: currentCol, r: 1 } });
                    currentCol += columns.length;
                }
            }
            else if (type === 'basic') {
                // 기본정보: 1행에서 해당 컬럼들 병합 (2개 이상일 때만)
                if (columns.length > 1) {
                    merges.push({ s: { c: currentCol, r: 0 }, e: { c: currentCol + columns.length - 1, r: 0 } });
                }
                currentCol += columns.length;
            }
            else if (type === 'clinicalSymptoms') {
                // 임상증상: 1행에서 해당 컬럼들 병합 (2개 이상일 때만)
                if (columns.length > 1) {
                    merges.push({ s: { c: currentCol, r: 0 }, e: { c: currentCol + columns.length - 1, r: 0 } });
                }
                currentCol += columns.length;
            }
            else if (type === 'symptomOnset') {
                // 증상발현시간: 병합 없음 (1행: 형식 설명, 2행: 헤더)
                currentCol += columns.length;
            }
            else if (type === 'individualExposureTime') {
                // 개별 노출시간: 병합 없음 (1행: 형식 설명, 2행: 헤더)
                currentCol += columns.length;
            }
            else if (type === 'dietInfo') {
                // 식단: 1행에서 해당 컬럼들 병합 (2개 이상일 때만)
                if (columns.length > 1) {
                    merges.push({ s: { c: currentCol, r: 0 }, e: { c: currentCol + columns.length - 1, r: 0 } });
                }
                currentCol += columns.length;
            }
        });
        return merges;
    };
    /**
     * 현재 날짜와 시간을 파일명에 쓸 수 있는 문자열로 반환
     */
    const getCurrentDateTimeString = () => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}-${min}`;
    };
    /**
     * 스마트 내보내기 - 가져오기와 완전 호환되는 형식으로 내보내기
     */
    const downloadXLSXSmart = (
        allColumnsMeta: GridHeader[],
        rows: GridRow[],
        getCellValue: (row: GridRow, col: GridHeader, rIdx: number) => any,
        hasIndividualExposure = false,
        hasConfirmedCase = false,
        fileName?: string
    ) => {
        try {
            // 파일명 자동 생성 (기본값)
            if (!fileName) {
                fileName = `Easy-Epi_exported_data_${getCurrentDateTimeString()}.xlsx`;
            }
            // 디버깅: 컬럼 구조 확인
            console.log('=== 스마트 내보내기 디버깅 ===');
            console.log('hasIndividualExposure:', hasIndividualExposure);
            console.log('전체 컬럼 메타데이터:', allColumnsMeta.map(col => ({ type: col.type, dataKey: col.dataKey, headerText: col.headerText })));
            // 1. 표준 헤더 구조 생성
            const { headerRow1, headerRow2 } = generateStandardHeaders(allColumnsMeta, hasIndividualExposure, hasConfirmedCase);
            console.log('생성된 헤더 1행:', headerRow1);
            console.log('생성된 헤더 2행:', headerRow2);
            // 2. 컬럼 순서 표준화
            const orderedColumns = reorderColumnsForExport(allColumnsMeta, hasIndividualExposure, hasConfirmedCase);
            console.log('정렬된 컬럼들:', orderedColumns.map(col => ({ type: col.type, dataKey: col.dataKey })));
            // 3. 데이터 행 생성 (표준 순서 적용)
            const dataRows = rows.map((row, rIdx) => {
                return orderedColumns.map(col => {
                    const rawValue = getCellValue(row, col, rIdx);
                    return formatCellValue(rawValue, col);
                });
            });
            // 4. 워크시트 데이터 구성
            const worksheetData = [headerRow1, headerRow2, ...dataRows];
            console.log('워크시트 데이터 샘플 (첫 3행):', worksheetData.slice(0, 3));
            // 5. 병합 정보 생성 (템플릿과 동일한 구조)
            const merges = generateMerges(headerRow1, headerRow2, allColumnsMeta, hasIndividualExposure, hasConfirmedCase);
            console.log('생성된 병합 정보:', merges);
            // 6. Excel 파일 생성 및 다운로드
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            // 병합 정보 적용
            if (merges.length > 0) {
                worksheet['!merges'] = merges;
            }
            // 헤더 스타일 적용 (선택사항)
            worksheet['!freeze'] = { xSplit: 1, ySplit: 2 }; // 첫 번째 열과 첫 두 행 고정
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, fileName);
            console.log('스마트 내보내기 완료:', fileName);
        }
        catch (err: any) {
            console.error('스마트 내보내기 실패:', err);
            throw new Error(`스마트 내보내기 중 오류가 발생했습니다: ${err.message}`);
        }
    };
    /**
     * XLSX 파일 다운로드 (기존 버전)
     */
    const downloadXLSX = (worksheetData: any[][], merges: ExcelRange[] = [], fileName = 'exported_data.xlsx') => {
        try {
            if (!worksheetData)
                throw new Error('워크시트 데이터가 제공되지 않았습니다.');
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            if (merges.length)
                worksheet['!merges'] = merges;
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, fileName);
        }
        catch (err) {
            console.error('XLSX 다운로드 실패:', err);
            // TODO: toast 시스템 도입 시 사용자 알림 추가
        }
    };
    /**
     * 템플릿 XLSX 다운로드 (basic | individual)
     */
    const downloadTemplate = (type = 'basic') => {
        const link = document.createElement('a');
        // 절대 경로를 사용하여 URL 구조와 관계없이 올바른 파일 경로 보장
        const baseUrl = (import.meta as any).env?.BASE_URL || '/';
        if (type === 'individual') {
            link.href = `${baseUrl}Easy-Epidemiology_Individual_Exposure_Time_Template.xlsx`;
            link.setAttribute('download', 'Easy-Epidemiology_Individual_Exposure_Time_Template.xlsx');
        }
        else {
            link.href = `${baseUrl}Easy-Epidemiology_Template.xlsx`;
            link.setAttribute('download', 'Easy-Epidemiology_Template.xlsx');
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return {
        downloadXLSX,
        downloadXLSXSmart,
        downloadTemplate,
        generateStandardHeaders,
        generateMerges,
        reorderColumnsForExport,
        ensureDateTimeFormat,
        formatCellValue
    };
}
