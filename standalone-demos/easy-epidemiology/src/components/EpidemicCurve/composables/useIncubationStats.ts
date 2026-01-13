// useIncubationStats.ts - 잠복기 데이터 계산 로직
import { computed, ComputedRef, WritableComputedRef } from 'vue';
import { useEpidemicStore } from '../../../stores/epidemicStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { GridRow } from '@/types/grid';

export interface IncubationTableData {
    intervalLabel: string;
    count: number;
}

export function useIncubationStats() {
    const epidemicStore = useEpidemicStore();
    const settingsStore = useSettingsStore();
    // 기본 데이터
    const rows = computed(() => epidemicStore.rows || []);
    const isIndividualExposureColumnVisible = computed(() => settingsStore.isIndividualExposureColumnVisible);
    
    const exposureDateTime: WritableComputedRef<string> = computed({
        get: () => settingsStore.exposureDateTime,
        set: (value: string) => settingsStore.updateExposureDateTime(value)
    });
    
    const selectedIncubationInterval: WritableComputedRef<number> = computed({
        get: () => settingsStore.selectedIncubationInterval,
        set: (value: number) => settingsStore.updateIncubationInterval(value)
    });
    // 유틸리티: HH:MM 형식으로 포맷팅
    const formatDurationHHMM = (durationMillis: number): string => {
        if (isNaN(durationMillis) || durationMillis < 0)
            return '--:--';
        const totalMinutes = Math.round(durationMillis / (60 * 1000));
        if (isNaN(totalMinutes))
            return '--:--';
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };
    // 노출 타임스탬프
    const exposureTimestamp: ComputedRef<number | null> = computed(() => {
        const expStr = exposureDateTime.value;
        if (!expStr)
            return null;
        try {
            const dateStr = expStr.includes('T') ? expStr : expStr.replace(' ', 'T');
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? null : d.getTime();
        }
        catch {
            return null;
        }
    });
    // 노출시간 포맷팅
    const formattedExposureDateTime = computed(() => {
        if (!exposureDateTime.value)
            return '';
        try {
            const date = new Date(exposureDateTime.value);
            if (isNaN(date.getTime()))
                return '';
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        }
        catch {
            return '';
        }
    });
    // 잠복기 durations (밀리초)
    const incubationDurations: ComputedRef<number[]> = computed(() => {
        const patientRows = rows.value.filter((row) => row.isPatient === '1');
        if (isIndividualExposureColumnVisible.value) {
            // 개별 노출 시간 사용
            return patientRows.map((row) => {
                if (!row.symptomOnset || !row.individualExposureTime)
                    return null;
                const onset = new Date(row.symptomOnset as string);
                const exposure = new Date(row.individualExposureTime as string);
                if (isNaN(onset.getTime()) || isNaN(exposure.getTime()) || onset < exposure)
                    return null;
                return onset.getTime() - exposure.getTime();
            }).filter((duration): duration is number => duration !== null);
        }
        else {
            // 공통 노출 시간 사용
            const exposureDate = new Date(exposureDateTime.value);
            if (isNaN(exposureDate.getTime()))
                return [];
            return patientRows.map((row) => {
                if (!row.symptomOnset)
                    return null;
                const onset = new Date(row.symptomOnset as string);
                if (isNaN(onset.getTime()) || onset < exposureDate)
                    return null;
                return onset.getTime() - exposureDate.getTime();
            }).filter((duration): duration is number => duration !== null);
        }
    });
    // 잠복기 요약 정보
    const minIncubationPeriodFormatted = computed(() => {
        if (incubationDurations.value.length === 0)
            return '--:--';
        return formatDurationHHMM(Math.min(...incubationDurations.value));
    });
    const maxIncubationPeriodFormatted = computed(() => {
        if (incubationDurations.value.length === 0)
            return '--:--';
        return formatDurationHHMM(Math.max(...incubationDurations.value));
    });
    const avgIncubationPeriodFormatted = computed(() => {
        if (incubationDurations.value.length === 0)
            return '--:--';
        const sum = incubationDurations.value.reduce((acc, val) => acc + val, 0);
        return formatDurationHHMM(sum / incubationDurations.value.length);
    });
    const medianIncubationPeriodFormatted = computed(() => {
        if (incubationDurations.value.length === 0)
            return '--:--';
        const sortedDurations = [...incubationDurations.value].sort((a, b) => a - b);
        const mid = Math.floor(sortedDurations.length / 2);
        let medianDuration;
        if (sortedDurations.length % 2 === 0) {
            medianDuration = (sortedDurations[mid - 1] + sortedDurations[mid]) / 2;
        }
        else {
            medianDuration = sortedDurations[mid];
        }
        return formatDurationHHMM(medianDuration);
    });
    // 잠복기 테이블 데이터
    const createIncubationPeriodTableData = (displayMode: 'hhmm' | string): IncubationTableData[] => {
        const intervalHours = selectedIncubationInterval.value;
        const durations = incubationDurations.value;
        if (!intervalHours || durations.length === 0)
            return [];
        const intervalMillis = intervalHours * 3600000;
        const maxDuration = Math.max(...durations);
        const totalBins = Math.ceil((maxDuration + intervalMillis) / intervalMillis);
        const bins = Array(totalBins).fill(0);
        for (const duration of durations) {
            const binIndex = Math.floor(duration / intervalMillis);
            if (binIndex >= 0 && binIndex < totalBins) {
                bins[binIndex]++;
            }
        }
        return bins.map((count, index) => {
            const startTime = index * intervalMillis;
            const endTime = (index + 1) * intervalMillis;
            let intervalLabel;
            if (displayMode === 'hhmm') {
                const displayEndTime = endTime - 60000;
                intervalLabel = `${formatDurationHHMM(startTime)} ~ ${formatDurationHHMM(displayEndTime)}`;
            }
            else {
                intervalLabel = `${formatDurationHHMM(startTime)} ~ ${formatDurationHHMM(endTime)}`;
            }
            return { intervalLabel, count };
        });
    };
    // 데이터 유효성
    const hasValidExposureData = computed(() => {
        const hasPatientData = rows.value.some((row) => row.isPatient === '1' && row.symptomOnset);
        if (!hasPatientData)
            return false;
        if (isIndividualExposureColumnVisible.value) {
            return incubationDurations.value.length > 0;
        }
        else {
            return exposureTimestamp.value !== null;
        }
    });
    return {
        // 기본 데이터
        rows,
        isIndividualExposureColumnVisible,
        exposureDateTime,
        selectedIncubationInterval,
        exposureTimestamp,
        formattedExposureDateTime,
        // 잠복기 데이터
        incubationDurations,
        minIncubationPeriodFormatted,
        maxIncubationPeriodFormatted,
        avgIncubationPeriodFormatted,
        medianIncubationPeriodFormatted,
        createIncubationPeriodTableData,
        // 유효성 검사
        hasValidExposureData,
        // 유틸리티
        formatDurationHHMM
    };
}
