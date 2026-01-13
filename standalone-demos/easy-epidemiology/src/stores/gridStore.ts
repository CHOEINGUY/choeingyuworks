
import { defineStore } from 'pinia';
import { ref, computed, reactive, watch } from 'vue';
import { useEpidemicStore } from '@/stores/epidemicStore';
import { GridRow, GridHeader } from '@/types/grid';

// ----------------------------------------------------------------------
// Interfaces for Input State
// ----------------------------------------------------------------------

export interface CellIdentifier {
  rowIndex: number;
  colIndex: number;
  dataKey?: string;
  cellIndex?: number | null;
}

export interface EditInfo {
  cell: CellIdentifier;
  originalValue: any;
  value?: any;  
  tempValue?: any; 
  columnMeta: GridHeader;
  editDuration: number;
  hasChanged?: boolean;
}

const FILTER_STORAGE_KEY = 'epidemiology_filter_state';

export const useGridStore = defineStore('grid', () => {
    const epidemicStore = useEpidemicStore();
    
    // --- Filtering State ---
    const activeFilters = reactive(new Map<string, string[]>());
    // Explicit mappings for virtual scroll performance
    const filteredRowMapping = ref<number[]>([]); 
    const originalToFilteredMapping = ref<number[]>([]);

    // --- Input / Edit State ---
    const isEditing = ref(false);
    const currentCell = ref<CellIdentifier | null>(null);
    const originalValue = ref<any>(null);
    const tempValue = ref<any>(null);
    const editingColumnMeta = ref<GridHeader | null>(null);
    const editStartTime = ref<number | null>(null);

    // --- Getters ---
    
    // Filtered Rows
    const filteredRows = computed(() => {
        if (activeFilters.size > 0 && filteredRowMapping.value.length > 0) {
            return filteredRowMapping.value.map(idx => epidemicStore.rows[idx]).filter(Boolean);
        }
        // If there are filters but 0 matches, map is empty, return empty
        if (activeFilters.size > 0 && filteredRowMapping.value.length === 0) {
             return [];
        }
        return epidemicStore.rows; 
    });

    const isFiltered = computed(() => activeFilters.size > 0);
    
    const filterStateData = computed(() => ({
        isFiltered: isFiltered.value,
        filteredRowCount: isFiltered.value ? filteredRowMapping.value.length : epidemicStore.rows.length,
        originalRowCount: epidemicStore.rows.length,
        activeFilters: activeFilters
    }));

    function setFilter(key: string, values: string[]) {
        if (values.length === 0) {
            activeFilters.delete(key);
        } else {
            activeFilters.set(key, values);
        }
        _applyFilters();
        _saveFilterState();
    }

    // Toggle a single value for a specific filter key
    function toggleFilterValue(key: string, value: string) {
        const currentValues = activeFilters.get(key) || [];
        const index = currentValues.indexOf(value);
        
        let newValues: string[];
        if (index === -1) {
            newValues = [...currentValues, value];
        } else {
            newValues = currentValues.filter(v => v !== value);
        }

        setFilter(key, newValues);
    }

    function clearFilter(key: string) {
        activeFilters.delete(key);
        _applyFilters();
        _saveFilterState();
    }

    function clearAllFilters() {
        activeFilters.clear();
        _applyFilters();
        _saveFilterState();
    }
    
    // ...

    // Helper to check match
    function _matchesFilter(row: GridRow, colIndex: number | string, filterConfig: string[] | { values: string[] }): boolean {
        // filterConfig is now string[] (the set of selected values)
        const filterValues = Array.isArray(filterConfig) ? filterConfig : (filterConfig as any).values;
        if (!filterValues || filterValues.length === 0) return true;
        
        // OR logic: if cell matches ANY of the selected filter values
        
        // ... (data extraction logic same as before, get 'cellValue') ...
        let cellValue = '';
        
        if (String(colIndex) === 'isPatient') cellValue = (row.isPatient === null || row.isPatient === undefined) ? '' : String(row.isPatient);
        else if (String(colIndex) === 'isConfirmedCase') cellValue = (row.isConfirmedCase === null || row.isConfirmedCase === undefined) ? '' : String(row.isConfirmedCase);
        else if (String(colIndex) === 'symptomOnset' || String(colIndex) === 'individualExposureTime') {
             const rawVal = (String(colIndex) === 'symptomOnset' ? row.symptomOnset : row.individualExposureTime);
             const valStr = (rawVal === null || rawVal === undefined) ? '' : String(rawVal);
             
             return filterValues.some((fVal: string) => {
                 if (fVal === '') return valStr === '';
                 return valStr.startsWith(fVal);
             });
        }
        else {
             // Complex keys like basicInfo-0
             const parts = String(colIndex).split('-');
             if (parts.length === 2) {
                 const [type, idxStr] = parts;
                 const idx = parseInt(idxStr, 10);
                 const arr = (row as any)[type]; 
                 if (Array.isArray(arr)) {
                     const val = arr[idx];
                     if (val !== undefined) {
                        cellValue = String(val);
                     }
                 } else {
                     // Empty fallback
                 }
             } else {
                 // Fallback: try direct property access
                 cellValue = String((row as any)[colIndex] ?? '');
             }
        }
        
        // Exact match check for other columns
        return filterValues.includes(cellValue);
    }

    function _applyFilters() {
        if (activeFilters.size === 0) {
            filteredRowMapping.value = [];
            originalToFilteredMapping.value = [];
            return;
        }

        const mapping: number[] = [];
        const reverseMapping: number[] = [];

        epidemicStore.rows.forEach((row, index) => {
            let isMatch = true;
            for (const [key, filterVal] of activeFilters) {
                if (!_matchesFilter(row, key, filterVal)) {
                    isMatch = false;
                    break;
                }
            }

            if (isMatch) {
                mapping.push(index);
                reverseMapping[index] = mapping.length - 1;
            } else {
                reverseMapping[index] = -1;
            }
        });

        filteredRowMapping.value = mapping;
        originalToFilteredMapping.value = reverseMapping;
    }

    function _saveFilterState() {
        const obj = Object.fromEntries(activeFilters);
        localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(obj));
    }

    function _loadFilterState() {
        try {
            const raw = localStorage.getItem(FILTER_STORAGE_KEY);
            if (raw) {
                const obj = JSON.parse(raw);
                for (const k in obj) {
                    activeFilters.set(k, obj[k]);
                }
                _applyFilters();
            }
        } catch (e) {
            console.error('Failed to load filter state', e);
        }
    }

    // --- Actions: Input State (Replacing CellInputState) ---

    function startEditing(rowIndex: number, colIndex: number, val: any, columnMeta: GridHeader) {
        if (isEditing.value) {
            cancelEditing();
        }

        isEditing.value = true;
        currentCell.value = {
            rowIndex,
            colIndex,
            dataKey: columnMeta.dataKey,
            cellIndex: columnMeta.cellIndex
        };
        originalValue.value = val;
        tempValue.value = val;
        editingColumnMeta.value = { ...columnMeta };
        editStartTime.value = Date.now();
    }

    function updateTempValue(val: any) {
        if (!isEditing.value) return;
        tempValue.value = val;
    }

    function cancelEditing(): EditInfo | null {
        if (!isEditing.value || !currentCell.value || !editingColumnMeta.value) return null;

        const info: EditInfo = {
            cell: { ...currentCell.value },
            originalValue: originalValue.value,
            tempValue: tempValue.value,
            columnMeta: { ...editingColumnMeta.value },
            editDuration: editStartTime.value ? Date.now() - editStartTime.value : 0
        };

        _resetEditState();
        return info;
    }

    function confirmEditing(): EditInfo | null {
        if (!isEditing.value || !currentCell.value || !editingColumnMeta.value) return null;

        const info: EditInfo = {
            cell: { ...currentCell.value },
            originalValue: originalValue.value,
            value: tempValue.value,
            columnMeta: { ...editingColumnMeta.value },
            editDuration: editStartTime.value ? Date.now() - editStartTime.value : 0,
            hasChanged: originalValue.value !== tempValue.value
        };

        _resetEditState();
        return info;
    }

    function stopEditing(shouldSave: boolean = true) {
        if (shouldSave) {
            confirmEditing();
        } else {
            cancelEditing();
        }
    }

    function _resetEditState() {
        isEditing.value = false;
        currentCell.value = null;
        originalValue.value = null;
        tempValue.value = null;
        editingColumnMeta.value = null;
        editStartTime.value = null;
    }
    
    function getActualRowIndex(viewIndex: number): number {
        if (activeFilters.size === 0) return viewIndex;
        return filteredRowMapping.value[viewIndex] ?? -1;
    }

    // Watch for row changes in main store to re-apply filters
    watch(() => epidemicStore.rows, () => {
        if (activeFilters.size > 0) {
            _applyFilters();
        }
    }, { deep: true });

    // Initialize
    _loadFilterState();

    return {
        // State
        activeFilters,
        isEditing,
        currentCell,
        tempValue,
        
        // Getters
        filteredRows,
        isFiltered,
        filterState: filterStateData,
        
        // Actions
        setFilter,
        clearFilter,
        clearAllFilters,
        startEditing,
        updateTempValue,
        cancelEditing,
        confirmEditing,
        stopEditing,
        getActualRowIndex,
        toggleFilterValue,
        
        // Internal exposure for strict consumers if needed
        matchesFilter: _matchesFilter
    };
});
