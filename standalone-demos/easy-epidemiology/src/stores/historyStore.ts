
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { StoreData } from '@/store/utils/recovery';
import { useEpidemicStore } from '@/stores/epidemicStore';
import { useSettingsStore } from '@/stores/settingsStore';

// ----------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------

export interface HistorySnapshot {
  timestamp: number;
  action: string;
  data: StoreData;
  meta?: Record<string, any>;
}

const HISTORY_STORAGE_KEY = 'epidemiology_history';
const DEFAULT_MAX_HISTORY = 15;

// 안전한 deep-clone
// 안전한 deep-clone
function deepClone<T>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    console.warn('[HistoryStore] deepClone failed:', e);
    return obj; // 실패 시 원본 반환 (위험하지만 에러는 방지)
  }
}

export const useHistoryStore = defineStore('history', () => {
    // --- State ---
    const undoStack = ref<HistorySnapshot[]>([]);
    const redoStack = ref<HistorySnapshot[]>([]);
    const isRestoring = ref(false);
    const MAX_HISTORY = ref(DEFAULT_MAX_HISTORY);

    // --- Getters ---
    const canUndo = computed(() => undoStack.value.length > 0);
    const canRedo = computed(() => redoStack.value.length > 0);

    // --- Actions ---

    /**
     * 현재 스토어들의 상태를 스냅샷으로 캡처하여 히스토리에 저장합니다.
     */
    /**
     * 현재 스토어들의 상태를 스냅샷 데이터로 생성합니다.
     */
    function _createSnapshotData(): StoreData {
        const epidemicStore = useEpidemicStore();
        const settingsStore = useSettingsStore();

        return {
            version: '2.0',
            timestamp: Date.now(),
            headers: deepClone(epidemicStore.headers),
            rows: deepClone(epidemicStore.rows),
            settings: {
                isIndividualExposureColumnVisible: settingsStore.isIndividualExposureColumnVisible,
                isConfirmedCaseColumnVisible: settingsStore.isConfirmedCaseColumnVisible,
                // Add other settings if critical for undo/redo
            },
            validationState: {
                version: epidemicStore.validationState.version,
                errors: new Map(epidemicStore.validationState.errors) // Explicitly clone Map
            }
        };
    }

    /**
     * 현재 스토어들의 상태를 스냅샷으로 캡처하여 히스토리에 저장합니다.
     */
    function captureSnapshot(action: string = 'unknown', meta: Record<string, any> = {}) {
        if (isRestoring.value) return;

        const snapshotData = _createSnapshotData();

        // De-duplicate: Check if idential to last snapshot
        const lastSnapshot = undoStack.value[undoStack.value.length - 1];
        if (lastSnapshot && JSON.stringify(lastSnapshot.data) === JSON.stringify(snapshotData)) {
            return;
        }

        const snapshot: HistorySnapshot = {
            timestamp: Date.now(),
            action,
            data: snapshotData,
            meta
        };

        undoStack.value.push(snapshot);
        redoStack.value = []; // Clear redo stack on new action
        
        if (undoStack.value.length > MAX_HISTORY.value) {
            undoStack.value.shift();
        }

        _persist();
    }

    function undo() {
        if (undoStack.value.length === 0) return;

        isRestoring.value = true;
        
        const prevSnapshot = undoStack.value.pop();
        if (prevSnapshot) {
            // Capture CURRENT state and push to Redo Stack before restoring previous state
            const currentData = _createSnapshotData();
            const currentSnapshot: HistorySnapshot = {
                timestamp: Date.now(),
                action: 'undo_save', // Internal action name
                data: currentData
            };
            redoStack.value.push(currentSnapshot);

            _restoreState(prevSnapshot.data);
            _persist();
        }

        isRestoring.value = false;
    }

    function redo() {
        if (redoStack.value.length === 0) return;

        isRestoring.value = true;

        const nextSnapshot = redoStack.value.pop();
        if (nextSnapshot) {
             // Capture CURRENT state and push to Undo Stack before restoring next state
            const currentData = _createSnapshotData();
            const currentSnapshot: HistorySnapshot = {
                timestamp: Date.now(),
                action: 'redo_save', // Internal action name
                data: currentData
            };
            undoStack.value.push(currentSnapshot);

            _restoreState(nextSnapshot.data);
            _persist();
        }

        isRestoring.value = false;
    }

    function clear() {
        undoStack.value = [];
        redoStack.value = [];
        _persist();
    }

    function _restoreState(data: StoreData) {
        const epidemicStore = useEpidemicStore();
        const settingsStore = useSettingsStore(); // Access if needed for restore

        // Restore Epidemic Data
        if (data.headers && data.rows) {
             epidemicStore.setInitialData({ headers: data.headers, rows: data.rows });
        }
        
        // Restore Validation
        if (data.validationState) {
             // epidemicStore needs simpler way to set full validation state depending on implementation
             // Checking epidemicStore.ts (Step 20): it has setValidationErrors(Map)
             // StoreData validationState might be object or Map depending on storage format.
             // We need to ensure it's a Map if passed to setValidationErrors
             
             let errorsMap = new Map();
             const errorsRaw = data.validationState.errors;
             
             if (errorsRaw instanceof Map) {
                 errorsMap = errorsRaw;
             } else if (typeof errorsRaw === 'object' && errorsRaw !== null) {
                 Object.entries(errorsRaw).forEach(([k, v]) => errorsMap.set(k, v));
             }
             
             epidemicStore.setValidationErrors(errorsMap);
        }
    }

    function _persist() {
        try {
            const payload = {
                version: '2.0',
                lastSaved: Date.now(),
                undoStack: undoStack.value,
                redoStack: redoStack.value
            };
            
            // Custom replacer to handle Map serialization
            const replacer = (key: string, value: any) => {
                if (value instanceof Map) {
                    return { dataType: 'Map', value: Array.from(value.entries()) };
                }
                return value;
            };

            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(payload, replacer));
        } catch (err) {
            console.error('[HistoryStore] persist error:', err);
        }
    }

    function loadFromStorage() {
        try {
            const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
            if (!raw) return;

            // Custom reviver to restore Maps
            const reviver = (key: string, value: any) => {
                if (typeof value === 'object' && value !== null && value.dataType === 'Map') {
                    return new Map(value.value);
                }
                return value;
            };

            const parsed = JSON.parse(raw, reviver);
            if (Array.isArray(parsed?.undoStack)) undoStack.value = parsed.undoStack;
            if (Array.isArray(parsed?.redoStack)) redoStack.value = parsed.redoStack;
        } catch (err) {
            console.warn('[HistoryStore] load failed, resetting history', err);
            undoStack.value = [];
            redoStack.value = [];
        }
    }

    // Initialize
    loadFromStorage();

    return {
        undoStack,
        redoStack,
        isRestoring, // [추가] 외부에서 restore 상태 감지용
        canUndo,
        canRedo,
        captureSnapshot,
        undo,
        redo,
        clear
    };
});
