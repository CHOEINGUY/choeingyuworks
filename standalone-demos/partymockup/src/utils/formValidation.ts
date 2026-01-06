import { Question } from '../types/formConfig';

export const validateField = (field: Question, value: any): string | null => {
    if (!field.required) return null;

    if (value === undefined || value === null || value === '') {
        return '필수 입력 항목입니다.';
    }

    if (Array.isArray(value) && value.length === 0) {
        return '최소 1개 이상 선택해주세요.';
    }

    if (typeof value === 'string' && value.trim() === '') {
        return '필수 입력 항목입니다.';
    }

    // Regex Validation (Pattern)
    if (field.validation?.pattern && value) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
            return '올바른 형식이 아닙니다. (예: 010-1234-5678)';
        }
    }

    // Birthdate Validation
    if (field.type === 'birth_date' && value) {
        if (value.length !== 8) {
            return '8자리 숫자로 입력해주세요 (예: 19950101)';
        }

        const year = parseInt(value.substring(0, 4));
        const month = parseInt(value.substring(4, 6));
        const day = parseInt(value.substring(6, 8));

        const date = new Date(year, month - 1, day);
        if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
            return '유효하지 않은 날짜입니다.';
        }

        const currentYear = new Date().getFullYear();
        const age = currentYear - year + 1;

        // [Refactored] Dynamic Age Limits
        const minAge = field.validation?.minAge || 20;
        const maxAge = field.validation?.maxAge || 45;

        if (age < minAge) return `${minAge}세 이상만 참여 가능합니다.`;
        if (age > maxAge) return `${maxAge}세 이하만 참여 가능합니다.`;
    }

    // Number Field Validation
    if (field.type === 'number' && value) {
        // Check if value is numeric
        if (isNaN(Number(value))) {
            return '숫자만 입력해주세요.';
        }
    }

    return null;
};
