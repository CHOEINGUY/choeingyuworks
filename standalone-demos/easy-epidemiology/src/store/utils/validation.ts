import { GridRow } from '@/types/grid';
import { RecoveryHeaders } from './recovery';

export interface ValidationRule {
    type: 'binary' | 'string' | 'datetime';
    required?: boolean;
    allowEmpty?: boolean;
    maxLength?: number;
    format?: string;
    message?: string;
}

export interface ValidationResult {
    valid: boolean;
    message?: string;
}

export interface ValidationError {
    field: string;
    message?: string;
    rowIndex?: number;
}

export interface DataValidationResult {
    valid: boolean;
    errors: ValidationError[];
    totalErrors?: number;
}

// ----------------------------------------------------------------------
// Validation Rules
// ----------------------------------------------------------------------

export const VALIDATION_RULES: Record<string, ValidationRule> = {
    isPatient: {
        type: 'binary',
        required: false,
        allowEmpty: true,
        message: '0 또는 1만 입력 가능합니다.'
    },
    isConfirmedCase: {
        type: 'binary',
        required: false,
        allowEmpty: true,
        message: '0 또는 1만 입력 가능합니다.'
    },
    basicInfo: {
        type: 'string',
        maxLength: 100,
        required: false,
        allowEmpty: true,
        message: ''
    },
    clinicalSymptoms: {
        type: 'binary',
        required: false,
        allowEmpty: true,
        message: '0 또는 1만 입력 가능합니다.'
    },
    symptomOnset: {
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm',
        required: false,
        allowEmpty: true,
        message: 'YYYY-MM-DD HH:mm 형식으로 입력하세요.'
    },
    individualExposureTime: {
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm',
        required: false,
        allowEmpty: true,
        message: 'YYYY-MM-DD HH:mm 형식으로 입력하세요.'
    },
    dietInfo: {
        type: 'binary',
        required: false,
        allowEmpty: true,
        message: '0 또는 1만 입력 가능합니다.'
    }
};

// ----------------------------------------------------------------------
// Core Validation Functions
// ----------------------------------------------------------------------

/**
 * 빈 값인지 확인합니다.
 */
export function isEmpty(value: any): boolean {
    if (value === null || value === undefined)
        return true;
    if (typeof value === 'string')
        return value.trim() === '';
    if (typeof value === 'number')
        return false;
    if (Array.isArray(value))
        return value.length === 0;
    return false;
}

/**
 * 이진 값(0/1)인지 검증합니다.
 */
export function validateBinary(value: any): ValidationResult {
    if (isEmpty(value))
        return { valid: true };
    const normalizedValue = String(value).trim();
    if (normalizedValue === '0' || normalizedValue === '1') {
        return { valid: true };
    }
    return {
        valid: false,
        message: '0 또는 1만 입력 가능합니다.'
    };
}

/**
 * 문자열 값을 검증합니다.
 */
export function validateString(value: any, rule: ValidationRule): ValidationResult {
    if (isEmpty(value)) {
        return rule.required ?
            { valid: false, message: '필수 입력 항목입니다.' } :
            { valid: true };
    }
    const stringValue = String(value);
    if (rule.maxLength && stringValue.length > rule.maxLength) {
        return {
            valid: false,
            message: rule.message || `최대 ${rule.maxLength}자까지 입력 가능합니다.`
        };
    }
    return { valid: true };
}

/**
 * 날짜/시간 값을 검증합니다.
 */
export function validateDateTime(value: any, rule: ValidationRule): ValidationResult {
    if (isEmpty(value)) {
        return rule.required ?
            { valid: false, message: '필수 입력 항목입니다.' } :
            { valid: true };
    }
    const stringValue = String(value).trim();
    // YYYY-MM-DD HH:mm 형식 검증
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!regex.test(stringValue)) {
        return {
            valid: false,
            message: rule.message || 'YYYY-MM-DD HH:mm 형식으로 입력하세요.'
        };
    }
    // 실제 유효한 날짜인지 검증 (Strict check)
    const date = new Date(stringValue.replace(' ', 'T'));
    if (isNaN(date.getTime())) {
        return {
            valid: false,
            message: '올바른 날짜를 입력하세요.'
        };
    }
    // 입력된 문자열과 파싱된 날짜 객체의 각 부분이 일치하는지 확인 (롤오버 방지)
    const [datePart, timePart] = stringValue.split(' ');
    const [y, m, d] = datePart.split('-').map(Number);
    const [hh, mm] = timePart.split(':').map(Number);
    if (date.getFullYear() !== y ||
        (date.getMonth() + 1) !== m ||
        date.getDate() !== d ||
        date.getHours() !== hh ||
        date.getMinutes() !== mm) {
        return {
            valid: false,
            message: '올바른 날짜를 입력하세요.'
        };
    }
    return { valid: true };
}

/**
 * 셀 값을 검증합니다.
 */
export function validateCell(value: any, columnType: string): ValidationResult {
    const rule = VALIDATION_RULES[columnType];
    if (!rule) {
        return { valid: true };
    }
    // 빈 값 처리
    if (isEmpty(value)) {
        return rule.required ?
            { valid: false, message: '필수 입력 항목입니다.' } :
            { valid: true };
    }
    // 타입별 검증
    switch (rule.type) {
        case 'binary':
            return validateBinary(value);
        case 'string': {
            const stringResult = validateString(value, rule);
            // 기본정보는 길이 제한이 있어도 툴팁을 표시하지 않음 (기존 로직 유지)
            if (columnType === 'basicInfo' && !stringResult.valid) {
                return { valid: false, message: '' };
            }
            return stringResult;
        }
        case 'datetime':
            return validateDateTime(value, rule);
        default:
            return { valid: true };
    }
}

/**
 * 행 데이터를 검증합니다.
 */
export function validateRow(row: GridRow, _headers?: any): { valid: boolean; errors: ValidationError[] } {
    const errors: ValidationError[] = [];

    // 환자여부 검증
    if (row.isPatient !== undefined) {
        const result = validateCell(row.isPatient, 'isPatient');
        if (!result.valid) {
            errors.push({ field: 'isPatient', message: result.message });
        }
    }

    // 확진자 여부 검증
    if (row.isConfirmedCase !== undefined) {
        const result = validateCell(row.isConfirmedCase, 'isConfirmedCase');
        if (!result.valid) {
            errors.push({ field: 'isConfirmedCase', message: result.message });
        }
    }

    // 기본정보 검증
    const basicInfo = row.basicInfo as any[];
    if (basicInfo && Array.isArray(basicInfo)) {
        basicInfo.forEach((value, index) => {
            const result = validateCell(value, 'basicInfo');
            if (!result.valid) {
                errors.push({ field: `basicInfo[${index}]`, message: result.message });
            }
        });
    }

    // 임상증상 검증
    const clinicalSymptoms = row.clinicalSymptoms as any[];
    if (clinicalSymptoms && Array.isArray(clinicalSymptoms)) {
        clinicalSymptoms.forEach((value, index) => {
            const result = validateCell(value, 'clinicalSymptoms');
            if (!result.valid) {
                errors.push({ field: `clinicalSymptoms[${index}]`, message: result.message });
            }
        });
    }

    // 증상발현시간 검증
    if (row.symptomOnset !== undefined) {
        const result = validateCell(row.symptomOnset, 'symptomOnset');
        if (!result.valid) {
            errors.push({ field: 'symptomOnset', message: result.message });
        }
    }

    // 개별 노출시간 검증
    if (row.individualExposureTime !== undefined) {
        const result = validateCell(row.individualExposureTime, 'individualExposureTime');
        if (!result.valid) {
            errors.push({ field: 'individualExposureTime', message: result.message });
        }
    }

    // 식단정보 검증
    const dietInfo = row.dietInfo as any[];
    if (dietInfo && Array.isArray(dietInfo)) {
        dietInfo.forEach((value, index) => {
            const result = validateCell(value, 'dietInfo');
            if (!result.valid) {
                errors.push({ field: `dietInfo[${index}]`, message: result.message });
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * 전체 데이터를 검증합니다.
 */
export function validateData(rows: GridRow[], headers?: any): DataValidationResult {
    const allErrors: ValidationError[] = [];

    rows.forEach((row, rowIndex) => {
        const rowValidation = validateRow(row, headers);
        if (!rowValidation.valid) {
            rowValidation.errors.forEach(error => {
                allErrors.push({
                    rowIndex,
                    field: error.field,
                    message: error.message
                });
            });
        }
    });

    return {
        valid: allErrors.length === 0,
        errors: allErrors,
        totalErrors: allErrors.length
    };
}

// ----------------------------------------------------------------------
// DOM Feedback Utilities
// ----------------------------------------------------------------------

/**
 * 실시간 검증을 위한 함수 (DOM 조작 포함)
 */
export function validateAndShowFeedback(value: any, columnType: string, cellElement: HTMLElement): boolean {
    const result = validateCell(value, columnType);
    if (!result.valid) {
        cellElement.classList.add('validation-error');
        if (result.message) {
            showValidationTooltip(cellElement, result.message);
        }
    }
    else {
        cellElement.classList.remove('validation-error');
        hideValidationTooltip(cellElement);
    }
    return result.valid;
}

/**
 * 검증 오류 툴팁을 표시합니다.
 */
export function showValidationTooltip(element: HTMLElement, message: string): void {
    // 기존 툴팁 제거
    hideValidationTooltip(element);

    // 새 툴팁 생성
    const tooltip = document.createElement('div');
    tooltip.className = 'validation-tooltip';
    tooltip.textContent = message;
    tooltip.style.cssText = `
    position: absolute;
    background: #ff4444;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
    pointer-events: none;
    white-space: nowrap;
  `;
    element.appendChild(tooltip);

    tooltip.style.left = '0px';
    tooltip.style.top = '-30px';

    // 3초 후 자동 제거
    setTimeout(() => {
        hideValidationTooltip(element);
    }, 3000);
}

/**
 * 검증 오류 툴팁을 숨깁니다.
 */
export function hideValidationTooltip(element: HTMLElement): void {
    const tooltip = element.querySelector('.validation-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}
