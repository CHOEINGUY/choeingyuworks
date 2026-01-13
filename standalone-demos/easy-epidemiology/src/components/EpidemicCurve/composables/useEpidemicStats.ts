// useEpidemicStats.ts - 유행데이터 계산 로직 (Refactored)
import { computed, ComputedRef, WritableComputedRef } from 'vue';
import { useEpidemicStore } from '../../../stores/epidemicStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { GridRow } from '@/types/grid';

// ─────────────────────────────────────────────────────────────────────────────
// 인터페이스 정의
// ─────────────────────────────────────────────────────────────────────────────
export interface OnsetTableData {
    intervalLabel: string;
    count: number;
}

interface GenerateOnsetTableParams {
    onsetTimes: Date[];
    intervalHours: number;
    firstOnsetTime: Date;
    lastOnsetTime: Date;
    floorToIntervalStart: (timestamp: number, intervalHours: number) => number;
    formatDateTime: (date: Date) => string;
    formatDateTimeEnd: (date: Date) => string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 헬퍼 함수: 날짜 문자열을 안전하게 Date 객체로 변환
// ─────────────────────────────────────────────────────────────────────────────
function safeParseDate(dateStr: string | null | undefined): Date | null {
    if (!dateStr || typeof dateStr !== 'string')
        return null;
    try {
        // 공백을 'T'로 통일하여 ISO 형식으로 변환
        const normalized = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
        const date = new Date(normalized);
        return isNaN(date.getTime()) ? null : date;
    }
    catch {
        return null;
    }
}
// ─────────────────────────────────────────────────────────────────────────────
// 헬퍼 함수: 히스토그램 테이블 데이터 생성 (중복 제거용)
// ─────────────────────────────────────────────────────────────────────────────
const MAX_INTERVALSCount = 10000; // 안전 제한 (약 1년 분량, 1시간 단위 기준)
function generateOnsetTableData({ onsetTimes, intervalHours, firstOnsetTime, lastOnsetTime, floorToIntervalStart, formatDateTime, formatDateTimeEnd }: GenerateOnsetTableParams): OnsetTableData[] {
    if (!intervalHours || !onsetTimes || onsetTimes.length === 0 || !firstOnsetTime || !lastOnsetTime) {
        return [];
    }
    const intervalMillis = intervalHours * 3600000;
    const minTimestamp = firstOnsetTime.getTime();
    const maxTimestamp = lastOnsetTime.getTime();
    const PADDING_INTERVALS_BEFORE = 1;
    const PADDING_INTERVALS_AFTER = 1;
    const blockStartTimestamp = floorToIntervalStart(minTimestamp, intervalHours);
    if (isNaN(blockStartTimestamp))
        return [];
    let firstPatientIntervalStart = blockStartTimestamp;
    while (firstPatientIntervalStart > minTimestamp) {
        firstPatientIntervalStart -= intervalMillis;
    }
    if (minTimestamp >= firstPatientIntervalStart + intervalMillis) {
        firstPatientIntervalStart += intervalMillis;
    }
    const firstIntervalStart = firstPatientIntervalStart - (PADDING_INTERVALS_BEFORE * intervalMillis);
    const extendedMaxTimestamp = maxTimestamp + (PADDING_INTERVALS_AFTER * intervalMillis);
    const data: OnsetTableData[] = [];
    let currentIntervalStart = firstIntervalStart;
    let guard = 0;
    while (currentIntervalStart <= extendedMaxTimestamp && guard < MAX_INTERVALSCount) {
        const currentIntervalEnd = currentIntervalStart + intervalMillis;
        let count = 0;
        for (const time of onsetTimes) {
            const timestamp = time.getTime();
            if (timestamp >= currentIntervalStart && timestamp < currentIntervalEnd) {
                count++;
            }
        }
        const displayEndTime = new Date(currentIntervalEnd - 60000);
        data.push({
            intervalLabel: `${formatDateTime(new Date(currentIntervalStart))} ~ ${formatDateTimeEnd(displayEndTime)}`,
            count
        });
        currentIntervalStart = currentIntervalEnd;
        guard++;
    }
    return data;
}
// ─────────────────────────────────────────────────────────────────────────────
// useEpidemicStats 컴퍼저블
// ─────────────────────────────────────────────────────────────────────────────
export function useEpidemicStats() {
    const epidemicStore = useEpidemicStore();
    const settingsStore = useSettingsStore();
    // 기본 데이터
    const rows = computed(() => epidemicStore.rows || []);
    const isIndividualExposureColumnVisible = computed(() => settingsStore.isIndividualExposureColumnVisible);
    const isConfirmedCaseColumnVisible = computed(() => settingsStore.isConfirmedCaseColumnVisible);
    
    const exposureDateTime: WritableComputedRef<string> = computed({
        get: () => settingsStore.exposureDateTime,
        set: (value: string) => settingsStore.updateExposureDateTime(value)
    });
    
    const selectedSymptomInterval: WritableComputedRef<number> = computed({
        get: () => settingsStore.selectedSymptomInterval,
        set: (value: number) => settingsStore.updateSymptomInterval(value)
    });
    // 유틸리티 함수
    const formatDateTime = (date: Date): string => {
        if (!date || !(date instanceof Date) || isNaN(date.getTime()))
            return '';
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${month}-${day} ${hours}:${minutes}`;
    };
    const formatDateTimeEnd = (date: Date): string => {
        if (!date || !(date instanceof Date) || isNaN(date.getTime()))
            return '';
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        return `${month}-${day} ${hours}:59`;
    };
    const formatShortDateTime = (date: Date | null): string => {
        if (!date || !(date instanceof Date) || isNaN(date.getTime()))
            return 'N/A';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    const floorToIntervalStart = (timestamp: number, intervalHours: number): number => {
        if (isNaN(timestamp) || isNaN(intervalHours) || intervalHours <= 0)
            return NaN;
        const date = new Date(timestamp);
        if (isNaN(date.getTime()))
            return NaN;
        const localHours = date.getHours();
        const startHour = Math.floor(localHours / intervalHours) * intervalHours;
        const blockStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHour, 0, 0, 0);
        return blockStartDate.getTime();
    };
    // ─────────────────────────────────────────────────────────────────────────
    // 환자 행 유효성 검사 (중복 제거용 내부 헬퍼)
    // ─────────────────────────────────────────────────────────────────────────
    const isValidPatientRow = (row: GridRow, requireConfirmed = false): boolean => {
        if (row.isPatient !== '1' || !row.symptomOnset)
            return false;
        if (requireConfirmed && row.isConfirmedCase !== '1')
            return false;
        const onset = safeParseDate(row.symptomOnset as string);
        if (!onset)
            return false;
        if (isIndividualExposureColumnVisible.value) {
            if (row.individualExposureTime) {
                const exposure = safeParseDate(row.individualExposureTime as string);
                if (exposure && onset < exposure)
                    return false;
            }
        }
        else {
            if (exposureDateTime.value) {
                const exposureDate = safeParseDate(exposureDateTime.value);
                if (exposureDate && onset < exposureDate)
                    return false;
            }
        }
        return true;
    };
    // ─────────────────────────────────────────────────────────────────────────
    // 환자 증상 발현 시간 목록
    // ─────────────────────────────────────────────────────────────────────────
    const patientOnsetTimes: ComputedRef<Date[]> = computed(() => {
        if (!rows.value || rows.value.length === 0)
            return [];
        return rows.value
            .filter((r) => isValidPatientRow(r, false))
            .map((r) => safeParseDate(r.symptomOnset as string))
            .filter((d): d is Date => d !== null)
            .sort((a, b) => a.getTime() - b.getTime());
    });
    // ─────────────────────────────────────────────────────────────────────────
    // 확진자 증상 발현 시간 목록
    // ─────────────────────────────────────────────────────────────────────────
    const confirmedCaseOnsetTimes: ComputedRef<Date[]> = computed(() => {
        if (!rows.value || rows.value.length === 0)
            return [];
        return rows.value
            .filter((r) => isValidPatientRow(r, true))
            .map((r) => safeParseDate(r.symptomOnset as string))
            .filter((d): d is Date => d !== null)
            .sort((a, b) => a.getTime() - b.getTime());
    });
    // 최초/최종 발생 시간
    const firstOnsetTime: ComputedRef<Date | null> = computed(() => patientOnsetTimes.value.length > 0 ? patientOnsetTimes.value[0] : null);
    const lastOnsetTime: ComputedRef<Date | null> = computed(() => patientOnsetTimes.value.length > 0 ? patientOnsetTimes.value[patientOnsetTimes.value.length - 1] : null);
    const formattedFirstOnsetTime = computed(() => formatShortDateTime(firstOnsetTime.value));
    const formattedLastOnsetTime = computed(() => formatShortDateTime(lastOnsetTime.value));
    // ─────────────────────────────────────────────────────────────────────────
    // 증상 발현 테이블 데이터 (리팩토링: 공통 함수 사용)
    // ─────────────────────────────────────────────────────────────────────────
    const symptomOnsetTableData: ComputedRef<OnsetTableData[]> = computed(() => {
        if (!firstOnsetTime.value || !lastOnsetTime.value)
            return [];
        return generateOnsetTableData({
            onsetTimes: patientOnsetTimes.value,
            intervalHours: selectedSymptomInterval.value,
            firstOnsetTime: firstOnsetTime.value,
            lastOnsetTime: lastOnsetTime.value,
            floorToIntervalStart,
            formatDateTime,
            formatDateTimeEnd
        });
    });
    // ─────────────────────────────────────────────────────────────────────────
    // 확진자 증상 발현 테이블 데이터 (리팩토링: 공통 함수 사용)
    // ─────────────────────────────────────────────────────────────────────────
    const confirmedCaseOnsetTableData: ComputedRef<OnsetTableData[]> = computed(() => {
        if (!firstOnsetTime.value || !lastOnsetTime.value)
            return [];
        return generateOnsetTableData({
            onsetTimes: confirmedCaseOnsetTimes.value,
            intervalHours: selectedSymptomInterval.value,
            firstOnsetTime: firstOnsetTime.value,
            lastOnsetTime: lastOnsetTime.value,
            floorToIntervalStart,
            formatDateTime,
            formatDateTimeEnd
        });
    });
    // 데이터 유효성
    const hasValidData = computed(() => Array.isArray(rows.value) && rows.value.length > 0);
    const hasValidPatientData = computed(() => {
        if (!hasValidData.value)
            return false;
        return rows.value.some((row) => row.isPatient === '1' && row.symptomOnset);
    });
    return {
        // 기본 데이터
        rows,
        isIndividualExposureColumnVisible,
        isConfirmedCaseColumnVisible,
        exposureDateTime,
        selectedSymptomInterval,
        // 증상 발현 데이터
        patientOnsetTimes,
        confirmedCaseOnsetTimes,
        firstOnsetTime,
        lastOnsetTime,
        formattedFirstOnsetTime,
        formattedLastOnsetTime,
        symptomOnsetTableData,
        confirmedCaseOnsetTableData,
        // 유효성 검사
        hasValidData,
        hasValidPatientData,
        // 유틸리티
        formatDateTime,
        formatDateTimeEnd,
        formatShortDateTime,
        floorToIntervalStart
    };
}
