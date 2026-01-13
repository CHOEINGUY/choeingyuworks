import { computed } from 'vue';
import { useEpidemicStore } from '../../../stores/epidemicStore';
import { CaseSeriesResult } from '@/types/analysis';
import { GridRow } from '@/types/grid';
import { EpidemicHeaders } from '../../../stores/epidemicStore';

/**
 * Composable for Case Series Analysis logic.
 */
export function useCaseSeriesAnalysis() {
    const epidemicStore = useEpidemicStore();

    // --- Data from Vuex ---
    const headers = computed<EpidemicHeaders>(() => epidemicStore.headers || { basic: [], clinical: [], diet: [] });
    const rows = computed<GridRow[]>(() => epidemicStore.rows || []);

    /**
     * Calculates the analysis results for the Case Series.
     * Only looks at patients (isPatient === '1').
     */
    const caseSeriesResults = computed<CaseSeriesResult[]>(() => {
        if (!headers.value?.diet || headers.value.diet.length === 0 || rows.value.length === 0) {
            console.warn('사례군 분석을 위한 headers.diet 또는 rows 데이터가 없습니다.');
            return [];
        }

        return headers.value.diet.map((dietItem: string, index: number) => {
            const factorName = dietItem;
            let exposedCases = 0; // 섭취자 (환자)
            let unexposedCases = 0; // 비섭취자 (환자)

            rows.value.forEach((row: GridRow) => {
                const isPatient = String(row.isPatient);
                const dietInfo = row.dietInfo as (string | number | null)[];
                const dietValue = dietInfo && dietInfo.length > index ? String(dietInfo[index]) : null;

                // Only count patients
                if (isPatient === '1') {
                    if (dietValue === '1') exposedCases++;
                    else if (dietValue === '0') unexposedCases++;
                }
            });

            const totalCases = exposedCases + unexposedCases;

            // Incidence (%) calculation: Proportion of exposed cases among all cases
            let incidence_formatted = 'N/A';
            if (totalCases > 0) {
                const incidence = (exposedCases / totalCases) * 100;
                incidence_formatted = `${incidence.toFixed(1)}%`;
            }

            return {
                item: factorName,
                exposedCases,
                unexposedCases,
                totalCases,
                incidence_formatted
            };
        });
    });

    const rowCount = computed(() => rows.value.length);

    return {
        headers,
        rows,
        caseSeriesResults,
        rowCount
    };
}
