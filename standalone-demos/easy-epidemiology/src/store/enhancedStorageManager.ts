
import { safeLoadFromStorage, RecoveryData } from './utils/recovery';
import { useSettingsStore, YatesCorrectionSettings, EpidemicCurveSettings, AnalysisOptions } from '@/stores/settingsStore';
import { useEpidemicStore, EpidemicHeaders } from '@/stores/epidemicStore';
import { useHistoryStore } from '@/stores/historyStore';
import { User } from '@/types/auth';
import { GridRow, GridHeader } from '@/types/grid';
import type { AnalysisResults } from '@/types/analysis';

// ----------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------

export interface EditInfo {
    cell: { rowIndex: number; colIndex: number; dataKey: string; cellIndex?: number };
    originalValue: any;
    value: any;
    columnMeta: GridHeader;
    editDuration?: number;
    hasChanged?: boolean;
}

export interface StoreData {
    version: string;
    timestamp: number;
    userId?: string;
    headers: EpidemicHeaders;
    rows: GridRow[];
    settings: {
        isIndividualExposureColumnVisible: boolean;
        isConfirmedCaseColumnVisible: boolean;
        exposureDateTime?: string;
        selectedSuspectedFoods?: string;
        epidemicCurveSettings?: EpidemicCurveSettings;
        analysisResults?: AnalysisResults;
        yatesCorrectionSettings?: YatesCorrectionSettings;
        selectedSymptomInterval?: number;
        selectedIncubationInterval?: number;
        suspectedSource?: string;
        analysisOptions?: AnalysisOptions;
    };
    validationState?: {
        errors: Record<string, { message: string; timestamp: number }>;
        version: number;
    };
}

interface PendingSave {
    editData: EditInfo;
    timeoutId: ReturnType<typeof setTimeout>;
    scheduledAt: number;
}

/**
 * 개선된 저장 매니저 클래스
 * 셀 단위 저장과 디바운싱을 통해 성능을 최적화합니다.
 */
export class EnhancedStorageManager {
    private legacyStore: any; // Keeping for compatibility
    private epidemicStore: any; // Pinia store instance
    private historyStore: any;
    private userManager: any;
    private currentUser: User | null;
    private saveTimeout: ReturnType<typeof setTimeout> | null;
    private SAVE_DELAY: number;
    private pendingSaves: Map<string, PendingSave>;
    private isProcessing: boolean;
    public isInitialized: boolean;

    constructor(legacyStore: any = null, userManager: any = null) {
        this.legacyStore = legacyStore;
        this.epidemicStore = null;
        this.userManager = userManager;
        this.currentUser = null;
        this.saveTimeout = null;
        this.SAVE_DELAY = 300;
        this.pendingSaves = new Map();
        this.isProcessing = false;
        this.isInitialized = false;

        try {
            this.epidemicStore = useEpidemicStore();
            this.historyStore = useHistoryStore();
        } catch (e) {
            console.warn('[EnhancedStorageManager] Pinia store not ready in constructor.');
        }
    }

    setStore(store: any): void {
        this.epidemicStore = store;
        try {
            if (!this.historyStore) {
                this.historyStore = useHistoryStore();
            }
        } catch (e) {
            console.warn('[EnhancedStorageManager] Failed to init historyStore in setStore');
        }
        console.log('[EnhancedStorageManager] Epidemic store set.');
    }

    setLegacyStore(legacyStore: any): void {
        this.legacyStore = legacyStore;
        console.log('[EnhancedStorageManager] Legacy store set (Deprecated).');
    }

    setUserManager(userManager: any): void {
        this.userManager = userManager;
    }

    setCurrentUser(user: User | null): void {
        this.currentUser = user;
    }

    getUserDataKey(): string {
        if (!this.currentUser) {
            return 'epidemiology_data';
        }
        const name = this.currentUser.name || (this.currentUser as any).username || 'user';
        return this.userManager?.getUserDataKey(name) || 'epidemiology_data';
    }

    public scheduleSave(editData: EditInfo): void {
        const saveKey = `${editData.cell.rowIndex}_${editData.cell.colIndex}`;
        const existingSave = this.pendingSaves.get(saveKey);
        if (existingSave) {
            clearTimeout(existingSave.timeoutId);
        }

        const timeoutId = setTimeout(() => {
            const latestSave = this.pendingSaves.get(saveKey);
            if (latestSave) {
                this.executeSave(latestSave.editData);
                this.pendingSaves.delete(saveKey);
            }
        }, this.SAVE_DELAY);

        this.pendingSaves.set(saveKey, {
            editData,
            timeoutId,
            scheduledAt: Date.now()
        });
    }

    public executeSave(editData: EditInfo): void {
        if (!this.epidemicStore && !this.legacyStore) return;
        
        const { cell, value } = editData;
        const { rowIndex, dataKey, cellIndex } = cell;

        if (this.epidemicStore) {
            if (this.historyStore) {
                this.historyStore.captureSnapshot('cell_edit', {
                    cell: editData.cell,
                    from: editData.originalValue,
                    to: editData.value
                });
            }

            this.epidemicStore.updateCell({ 
                rowIndex, 
                key: dataKey, 
                value, 
                cellIndex: cellIndex ?? undefined 
            });
        } else if (this.legacyStore) {
            this.legacyStore.dispatch('epidemic/updateCell', {
                rowIndex,
                key: dataKey,
                value,
                cellIndex
            });
        }
    }

    processPendingSaves(): void {
        if (this.pendingSaves.size === 0) return;
        for (const [, saveInfo] of this.pendingSaves) {
            clearTimeout(saveInfo.timeoutId);
            this.executeSave(saveInfo.editData);
        }
        this.pendingSaves.clear();
    }

    cancelPendingSaves(): void {
        for (const [, saveInfo] of this.pendingSaves) {
            clearTimeout(saveInfo.timeoutId);
        }
        this.pendingSaves.clear();
    }

    setSaveDelay(delay: number): void {
        this.SAVE_DELAY = delay;
        console.log(`[EnhancedStorageManager] 저장 지연 시간이 ${delay}ms로 설정되었습니다.`);
    }

    reset(): void {
        this.cancelPendingSaves();
        this.isProcessing = false;
        this.isInitialized = false;
        console.log('[EnhancedStorageManager] 저장 매니저가 초기화되었습니다.');
    }

    loadData(): StoreData | null {
        try {
            const dataKey = this.getUserDataKey();
            const newData = localStorage.getItem(dataKey);
            if (newData) {
                const parsedData = JSON.parse(newData) as StoreData;
                this.isInitialized = true;
                return parsedData;
            }

            console.log('[EnhancedStorageManager] 새로운 형식의 데이터가 없습니다. 레거시 데이터 마이그레이션을 시도합니다.');
            const legacyData: RecoveryData = safeLoadFromStorage();
            if (!legacyData) return null;

            const exposureDateTime = localStorage.getItem('exposureDateTime') || '';
            const selectedSuspectedFoods = localStorage.getItem('selectedSuspectedFoods') || '';
            
            let epidemicCurveSettings: EpidemicCurveSettings | undefined;
            try {
                const savedCurve = localStorage.getItem('epidemicCurveSettings');
                if (savedCurve) epidemicCurveSettings = JSON.parse(savedCurve);
            } catch (e) { /* ignore */ }

            let analysisResults: AnalysisResults = { caseControl: [], cohort: [] };
            try {
                const savedResults = localStorage.getItem('analysisResults');
                if (savedResults) analysisResults = JSON.parse(savedResults);
            } catch (e) { /* ignore */ }

            let yatesCorrectionSettings: YatesCorrectionSettings = { caseControl: false, cohort: false };
            try {
                const savedYates = localStorage.getItem('yatesCorrectionSettings');
                if (savedYates) yatesCorrectionSettings = JSON.parse(savedYates);
            } catch (e) { /* ignore */ }

            const migratedData: StoreData = {
                version: '2.0',
                timestamp: Date.now(),
                headers: legacyData.headers,
                rows: legacyData.rows,
                settings: {
                    isIndividualExposureColumnVisible: legacyData.settings.isIndividualExposureColumnVisible,
                    isConfirmedCaseColumnVisible: legacyData.settings.isConfirmedCaseColumnVisible,
                    exposureDateTime,
                    selectedSuspectedFoods,
                    epidemicCurveSettings,
                    analysisResults,
                    yatesCorrectionSettings,
                    selectedSymptomInterval: 6,
                    selectedIncubationInterval: 6,
                    suspectedSource: '',
                    analysisOptions: { statMethod: 'chi-square', haldaneCorrection: false }
                }
            };

            console.log('[EnhancedStorageManager] 레거시 데이터 마이그레이션 성공. 새로운 형식으로 저장합니다.');
            this.saveData(migratedData);
            this.isInitialized = true;
            return migratedData;
        } catch (error) {
            console.error('[EnhancedStorageManager] 데이터 로드 중 오류 발생:', error);
            return null;
        }
    }

    saveData(data: Partial<StoreData>): boolean {
        try {
            const saveData = {
                version: '2.0',
                timestamp: Date.now(),
                userId: (this.currentUser as any)?.id || this.currentUser?.name || (this.currentUser as any)?.username,
                ...data
            };
            const dataKey = this.getUserDataKey();
            localStorage.setItem(dataKey, JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('[EnhancedStorageManager] 데이터 저장 중 오류 발생:', error);
            return false;
        }
    }

    saveCurrentState(): boolean {
        if (!this.epidemicStore && !this.legacyStore) {
            console.error('[EnhancedStorageManager] Store 인스턴스가 설정되지 않았습니다.');
            return false;
        }

        let headers: EpidemicHeaders;
        let rows: GridRow[];
        let validationState: any;
        let settingsState: any = {};

        if (this.epidemicStore) {
            headers = this.epidemicStore.headers;
            rows = this.epidemicStore.rows;
            validationState = this.epidemicStore.validationState;
            const settingsStore = useSettingsStore();
            settingsState = { ...settingsStore.$state };
        } else {
            const state = this.legacyStore.state;
            headers = state.epidemic.headers;
            rows = state.epidemic.rows;
            validationState = state.epidemic.validationState;
            settingsState = state.settings;
        }

        const validationErrors: Record<string, { message: string; timestamp: number }> = {};
        if (validationState?.errors && validationState.errors instanceof Map) {
            for (const [key, error] of (validationState.errors as Map<string, any>).entries()) {
                validationErrors[key] = {
                    message: error.message || '유효성 검사 오류',
                    timestamp: error.timestamp || Date.now()
                };
            }
        } else if (validationState?.errors && typeof validationState.errors === 'object') {
            Object.assign(validationErrors, validationState.errors);
        }

        const data: Partial<StoreData> = {
            headers,
            rows,
            settings: {
                isIndividualExposureColumnVisible: settingsState.isIndividualExposureColumnVisible,
                isConfirmedCaseColumnVisible: settingsState.isConfirmedCaseColumnVisible,
                selectedSymptomInterval: settingsState.selectedSymptomInterval,
                exposureDateTime: settingsState.exposureDateTime,
                selectedIncubationInterval: settingsState.selectedIncubationInterval,
                analysisOptions: settingsState.analysisOptions,
                yatesCorrectionSettings: settingsState.yatesCorrectionSettings,
                selectedSuspectedFoods: settingsState.selectedSuspectedFoods,
                epidemicCurveSettings: settingsState.epidemicCurveSettings,
                suspectedSource: settingsState.suspectedSource,
                analysisResults: settingsState.analysisResults
            },
            validationState: {
                errors: validationErrors,
                version: validationState?.version || 0
            }
        };

        return this.saveData(data);
    }
}
