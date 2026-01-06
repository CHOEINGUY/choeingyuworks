import { useState, useCallback } from 'react';
import { SYSTEM_FIELDS } from '../constants/systemFields'; // Fixed import path - assuming constants are moved
import { DEFAULT_FORM_SCHEMA } from '../data/formSchema'; // Keeping this js import for now, assuming data/ is not converted yet
import { User } from '../types';

export const useProfileData = (initialData: Partial<User>, onSave?: (data: User) => void) => {
    const [formData, setFormData] = useState<Partial<User>>({ ...initialData });

    /**
     * 필드 ID로 데이터 값을 찾아오는 헬퍼 함수
     * 1. formData[id] (최상위 호환)
     * 2. formData.answers[id] (폼 응답 데이터)
     */
    const getFieldValue = useCallback((fieldId: string) => {
        if (!formData) return '';

        // 1. System Field Top-level search
        if (fieldId === SYSTEM_FIELDS.NAME && formData.name) return formData.name;
        if (fieldId === SYSTEM_FIELDS.PHONE && (formData.phone || formData.phoneNumber)) return formData.phone || formData.phoneNumber;
        if (fieldId === SYSTEM_FIELDS.GENDER && formData.gender) return formData.gender;
        if (fieldId === SYSTEM_FIELDS.BIRTH_DATE && (formData.birthDate || formData.birthYear)) return formData.birthDate || formData.birthYear;
        if (fieldId === SYSTEM_FIELDS.JOB && formData.job) return formData.job;
        if (fieldId === SYSTEM_FIELDS.LOCATION && formData.location) return formData.location;
        if (fieldId === SYSTEM_FIELDS.HEIGHT && formData.height) return formData.height;
        if (fieldId === SYSTEM_FIELDS.DRINKING) return formData.drinking || (formData.answers && formData.answers['q_drinking_habit']);
        if (fieldId === SYSTEM_FIELDS.SMOKING && formData.smoking) return formData.smoking;
        if (fieldId === SYSTEM_FIELDS.MBTI && formData.mbti) return formData.mbti;

        // 2. Answers (Dynamic & Legacy Mixed)
        if (formData.answers && formData.answers[fieldId] !== undefined) {
            return formData.answers[fieldId];
        }

        return '';
    }, [formData]);

    const handleAnswerChange = useCallback((fieldId: string, newValue: any) => {
        // System fields that need top-level update
        const isSystemTopLevel = [
            SYSTEM_FIELDS.JOB, SYSTEM_FIELDS.LOCATION, SYSTEM_FIELDS.BIRTH_DATE,
            SYSTEM_FIELDS.NAME, 'memo', SYSTEM_FIELDS.HEIGHT,
            SYSTEM_FIELDS.DRINKING, SYSTEM_FIELDS.SMOKING, SYSTEM_FIELDS.MBTI,
            SYSTEM_FIELDS.GENDER
        ].includes(fieldId as any);

        setFormData(prev => {
            const next = { ...prev };
            // Update answers (keep for compatibility)
            if (!next.answers) next.answers = {};
            next.answers = { ...next.answers, [fieldId]: newValue };

            // Update top-level if needed
            if (isSystemTopLevel) {
                let propName = fieldId;
                if (fieldId === 'birth_date') propName = 'birthDate';
                next[propName] = newValue;
            }
            return next;
        });
    }, []);

    // System Section Info Resolver
    const getSystemSectionInfo = useCallback((fieldId: string, formFields: any[]) => {
        let schema = (formFields && formFields.length > 0 ? formFields : DEFAULT_FORM_SCHEMA).find(f => f.id === fieldId);
        const content = getFieldValue(fieldId);

        // 타이틀 결정 (스키마 > 로그 > 하드코딩 디폴트)
        let title = schema?.adminProps?.cardLabel || schema?.label || schema?.title;
        // fieldLogs is not strictly typed yet, assume it exists loosely on User
        if (!title && formData.fieldLogs && formData.fieldLogs[fieldId]) {
            title = formData.fieldLogs[fieldId];
        }
        if (!title) {
            const fallbackMap: Record<string, string> = {
                [SYSTEM_FIELDS.INTRODUCTION]: '자기소개',
                [SYSTEM_FIELDS.IDEAL_TYPE]: '이상형',
                [SYSTEM_FIELDS.HOBBY]: '취미',
                [SYSTEM_FIELDS.HEIGHT]: '키',
                [SYSTEM_FIELDS.DRINKING]: '음주',
                [SYSTEM_FIELDS.SMOKING]: '흡연',
                [SYSTEM_FIELDS.MBTI]: 'MBTI'
            };
            title = fallbackMap[fieldId] || fieldId;
        }

        return { schema, content, title };
    }, [formData, getFieldValue]);

    return {
        formData,
        setFormData,
        getFieldValue,
        handleAnswerChange,
        getSystemSectionInfo
    };
};
