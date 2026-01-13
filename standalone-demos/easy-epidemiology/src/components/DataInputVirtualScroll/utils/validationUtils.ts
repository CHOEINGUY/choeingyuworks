/**
 * 고유 식별자 관련 유틸리티 함수들
 */
import { GridHeader } from '@/types/grid';

/**
 * 열 메타데이터로부터 고유 식별자 생성
 */
export function getColumnUniqueKey(columnMeta: GridHeader | null): string | null {
    if (!columnMeta)
        return null;
    // 기본 속성들
    const dataKey = columnMeta.dataKey || '';
    const type = columnMeta.type || '';
    const cellIndex = columnMeta.cellIndex !== null && columnMeta.cellIndex !== undefined ? columnMeta.cellIndex : '';
    // Special case for group if it exists on GridHeader, but it's not in the interface.
    // Assuming it might be dynamic property.
    const group = (columnMeta as any).group || '';
    // 특수 열들의 경우 추가 식별자 사용
    if (type === 'individualExposureTime') {
        return `exposure_${dataKey}_${cellIndex}`;
    }
    if (type === 'isConfirmedCase') {
        return 'confirmed_case';
    }
    if (type === 'patientId') {
        return 'patient_id';
    }
    if (type === 'patientName') {
        return 'patient_name';
    }
    // 일반적인 경우: dataKey + type + cellIndex + group 조합
    const parts = [dataKey, type, cellIndex === '' ? null : cellIndex, group].filter(val => val !== null && val !== undefined && val !== '');
    return parts.join('__');
}
/**
 * 행과 열 정보로부터 에러 키 생성
 */
export function getErrorKey(rowIndex: number, uniqueKey: string): string {
    return `${rowIndex}_${uniqueKey}`;
}
/**
 * 에러 키에서 행 인덱스와 고유 식별자 분리
 */
export function parseErrorKey(errorKey: string): { rowIndex: number; uniqueKey: string } | null {
    const parts = errorKey.split('_');
    if (parts.length < 2)
        return null;
    const rowIndex = parseInt(parts[0]);
    const uniqueKey = parts.slice(1).join('_');
    return { rowIndex, uniqueKey };
}
/**
 * 고유 식별자 기반으로 에러 여부 확인
 */
export function hasValidationError(rowIndex: number, colIndex: number, columnMeta: GridHeader | null, validationErrors: Map<string, any> | null): boolean {
    if (!validationErrors || !columnMeta)
        return false;
    const uniqueKey = getColumnUniqueKey(columnMeta);
    if (!uniqueKey)
        return false;
    const errorKey = getErrorKey(rowIndex, uniqueKey);
    return validationErrors.has(errorKey);
}
/**
 * 고유 식별자 기반으로 에러 메시지 조회
 */
export function getValidationMessage(rowIndex: number, colIndex: number, columnMeta: GridHeader | null, validationErrors: Map<string, any> | null): string {
    if (!validationErrors || !columnMeta)
        return '';
    const uniqueKey = getColumnUniqueKey(columnMeta);
    if (!uniqueKey)
        return '';
    const errorKey = getErrorKey(rowIndex, uniqueKey);
    if (validationErrors.has(errorKey)) {
        const error = validationErrors.get(errorKey);
        return error.message || '유효성 검사 오류';
    }
    return '';
}