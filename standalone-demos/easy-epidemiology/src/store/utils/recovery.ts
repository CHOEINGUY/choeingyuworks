import { GridRow } from '@/types/grid';

export interface RecoveryHeaders {
    basic: string[];
    clinical: string[];
    diet: string[];
}

export interface RecoveryData {
    version: string;
    timestamp: number;
    headers: RecoveryHeaders;
    rows: GridRow[];
    settings: {
        isIndividualExposureColumnVisible: boolean;
        isConfirmedCaseColumnVisible: boolean;
    };
    validationState?: any;
}

export type StoreData = RecoveryData;

export interface RecoveryBackup {
    timestamp: number;
    data: RecoveryData;
    version: string;
}

// ----------------------------------------------------------------------
// Default Generators
// ----------------------------------------------------------------------

/**
 * 기본 헤더 구조를 생성합니다.
 */
export function createDefaultHeaders(): RecoveryHeaders {
    return {
        basic: ['', ''],
        clinical: ['', '', '', '', ''],
        diet: Array(30).fill('')
    };
}

/**
 * 기본 행 구조를 생성합니다.
 */
export function createDefaultRow(headers: RecoveryHeaders): GridRow {
    return {
        isPatient: '',
        basicInfo: Array(headers?.basic?.length || 2).fill(''),
        clinicalSymptoms: Array(headers?.clinical?.length || 5).fill(''),
        symptomOnset: '',
        individualExposureTime: '',
        dietInfo: Array(headers?.diet?.length || 30).fill(''),
        isConfirmedCase: ''
    };
}

/**
 * 기본 데이터 구조를 생성합니다.
 */
export function createDefaultData(): RecoveryData {
    const headers = createDefaultHeaders();
    const rows = Array.from({ length: 10 }, () => createDefaultRow(headers));
    return {
        version: '1.0',
        timestamp: Date.now(),
        headers,
        rows,
        settings: {
            isIndividualExposureColumnVisible: false,
            isConfirmedCaseColumnVisible: false
        }
    };
}

// ----------------------------------------------------------------------
// Repair Functions
// ----------------------------------------------------------------------

/**
 * 헤더 데이터를 복구합니다.
 */
export function repairHeaders(headers: any): RecoveryHeaders {
    if (!headers || typeof headers !== 'object') {
        console.warn('[Recovery] 헤더 데이터가 유효하지 않아 기본값으로 복구합니다.');
        return createDefaultHeaders();
    }

    const repaired: RecoveryHeaders = {
        basic: Array.isArray(headers.basic) ? headers.basic : ['', ''],
        clinical: Array.isArray(headers.clinical) ? headers.clinical : ['', '', '', '', ''],
        diet: Array.isArray(headers.diet) ? headers.diet : Array(30).fill('')
    };

    // 빈 배열이거나 null/undefined 값들을 빈 문자열로 정규화
    repaired.basic = repaired.basic.map((item: any) => item || '');
    repaired.clinical = repaired.clinical.map((item: any) => item || '');
    repaired.diet = repaired.diet.map((item: any) => item || '');

    return repaired;
}

/**
 * 배열 길이를 조정합니다.
 */
function adjustArrayLength(array: any[], targetLength: number): string[] {
    if (!Array.isArray(array)) {
        return Array(targetLength).fill('');
    }

    const adjusted = [...array];
    // 길이가 부족하면 빈 문자열로 채움
    while (adjusted.length < targetLength) {
        adjusted.push('');
    }
    // 길이가 초과하면 자름
    if (adjusted.length > targetLength) {
        adjusted.splice(targetLength);
    }
    // null/undefined 값을 빈 문자열로 변환하고 String으로 보장
    return adjusted.map(item => (item === null || item === undefined) ? '' : String(item));
}

/**
 * 행 데이터를 복구합니다.
 */
export function repairRows(rows: any, headers: RecoveryHeaders): GridRow[] {
    if (!Array.isArray(rows)) {
        console.warn('[Recovery] 행 데이터가 유효하지 않아 기본값으로 복구합니다.');
        return Array.from({ length: 10 }, () => createDefaultRow(headers));
    }

    return rows.map((row, index) => {
        if (!row || typeof row !== 'object') {
            console.warn(`[Recovery] 행 ${index}가 유효하지 않아 기본값으로 복구합니다.`);
            return createDefaultRow(headers);
        }

        const repairedRow: GridRow = {
            isPatient: row.isPatient || '',
            basicInfo: adjustArrayLength(Array.isArray(row.basicInfo) ? row.basicInfo : [], headers?.basic?.length || 2),
            clinicalSymptoms: adjustArrayLength(Array.isArray(row.clinicalSymptoms) ? row.clinicalSymptoms : [], headers?.clinical?.length || 5),
            symptomOnset: row.symptomOnset || '',
            individualExposureTime: row.individualExposureTime || '',
            dietInfo: adjustArrayLength(Array.isArray(row.dietInfo) ? row.dietInfo : [], headers?.diet?.length || 30),
            isConfirmedCase: row.isConfirmedCase || ''
        };

        return repairedRow;
    });
}

/**
 * 설정 데이터를 복구합니다.
 */
export function repairSettings(settings: any) {
    if (!settings || typeof settings !== 'object') {
        return {
            isIndividualExposureColumnVisible: false,
            isConfirmedCaseColumnVisible: false
        };
    }

    return {
        isIndividualExposureColumnVisible: Boolean(settings.isIndividualExposureColumnVisible),
        isConfirmedCaseColumnVisible: Boolean(settings.isConfirmedCaseColumnVisible)
    };
}

/**
 * 전체 데이터를 복구합니다.
 */
export function repairData(rawData: any): RecoveryData {
    try {
        if (!rawData || typeof rawData !== 'object') {
            console.warn('[Recovery] 데이터가 유효하지 않아 기본값으로 복구합니다.');
            return createDefaultData();
        }

        const headers = repairHeaders(rawData.headers);
        const repaired: RecoveryData = {
            version: rawData.version || '1.0',
            timestamp: rawData.timestamp || Date.now(),
            headers: headers,
            rows: repairRows(rawData.rows, headers),
            settings: repairSettings(rawData.settings),
            validationState: rawData.validationState
        };

        return repaired;
    }
    catch (error) {
        console.error('[Recovery] 데이터 복구 중 오류 발생:', error);
        return createDefaultData();
    }
}

// ----------------------------------------------------------------------
// LocalStorage Operations
// ----------------------------------------------------------------------

/**
 * localStorage에서 데이터를 안전하게 로드합니다.
 * (For Legacy Migration support)
 */
export function safeLoadFromStorage(): RecoveryData {
    try {
        const headersData = localStorage.getItem('headers');
        const rowsData = localStorage.getItem('rows');
        const visibilityData = localStorage.getItem('isIndividualExposureColumnVisible');
        const confirmedCaseVisibilityData = localStorage.getItem('isConfirmedCaseColumnVisible');

        if (!headersData || !rowsData) {
            console.warn('[Recovery] localStorage에 데이터가 없어 기본값을 사용합니다.');
            return createDefaultData();
        }

        const headers = JSON.parse(headersData);
        const rows = JSON.parse(rowsData);
        const isIndividualExposureColumnVisible = visibilityData ?
            JSON.parse(visibilityData) : false;
        const isConfirmedCaseColumnVisible = confirmedCaseVisibilityData ?
            JSON.parse(confirmedCaseVisibilityData) : false;

        const rawData = {
            headers,
            rows,
            settings: {
                isIndividualExposureColumnVisible,
                isConfirmedCaseColumnVisible
            }
        };

        return repairData(rawData);
    }
    catch (error) {
        console.error('[Recovery] localStorage 로드 중 오류 발생:', error);
        return createDefaultData();
    }
}

/**
 * 데이터 무결성을 검사합니다.
 */
export function validateDataIntegrity(data: any): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!data) {
        issues.push('데이터가 없습니다.');
        return { valid: false, issues };
    }

    if (!data.headers) {
        issues.push('헤더 데이터가 없습니다.');
    }
    else {
        if (!Array.isArray(data.headers.basic)) {
            issues.push('기본정보 헤더가 배열이 아닙니다.');
        }
        if (!Array.isArray(data.headers.clinical)) {
            issues.push('임상증상 헤더가 배열이 아닙니다.');
        }
        if (!Array.isArray(data.headers.diet)) {
            issues.push('식단정보 헤더가 배열이 아닙니다.');
        }
    }

    if (!Array.isArray(data.rows)) {
        issues.push('행 데이터가 배열이 아닙니다.');
    }
    else {
        data.rows.forEach((row: any, index: number) => {
            if (!row || typeof row !== 'object') {
                issues.push(`행 ${index}가 유효하지 않습니다.`);
            }
            else {
                if (!Array.isArray(row.basicInfo)) {
                    issues.push(`행 ${index}의 기본정보가 배열이 아닙니다.`);
                }
                if (!Array.isArray(row.clinicalSymptoms)) {
                    issues.push(`행 ${index}의 임상증상이 배열이 아닙니다.`);
                }
                if (!Array.isArray(row.dietInfo)) {
                    issues.push(`행 ${index}의 식단정보가 배열이 아닙니다.`);
                }
            }
        });
    }

    return {
        valid: issues.length === 0,
        issues
    };
}

/**
 * 데이터 백업을 생성합니다.
 */
export function createBackup(data: RecoveryData): RecoveryBackup {
    return {
        timestamp: Date.now(),
        data: JSON.parse(JSON.stringify(data)), // 깊은 복사
        version: '1.0'
    };
}

/**
 * 백업에서 데이터를 복원합니다.
 */
export function restoreFromBackup(backup: RecoveryBackup | null): RecoveryData | null {
    if (!backup || !backup.data) {
        console.error('[Recovery] 백업 데이터가 유효하지 않습니다.');
        return null;
    }
    try {
        const restored = repairData(backup.data);
        console.log('[Recovery] 백업에서 데이터가 복원되었습니다.');
        return restored;
    }
    catch (error) {
        console.error('[Recovery] 백업 복원 중 오류 발생:', error);
        return null;
    }
}
