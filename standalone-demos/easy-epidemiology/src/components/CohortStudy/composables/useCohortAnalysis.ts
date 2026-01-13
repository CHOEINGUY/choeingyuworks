import { computed, watch, Ref } from 'vue';
import { useSettingsStore } from '../../../stores/settingsStore';
import { EpidemicHeaders } from '../../../stores/epidemicStore';
import { jStat } from 'jstat';
import { CohortResult } from '@/types/analysis';
import { GridRow, GridHeader } from '@/types/grid';

export function useCohortAnalysis(
    rows: Ref<GridRow[]>, 
    headers: Ref<EpidemicHeaders>, 
    useYatesCorrection: Ref<boolean>
) {
    const settingsStore = useSettingsStore();

    // Cast rows to expected type internally
    const typedRows = computed(() => rows.value || []);
    const typedHeaders = computed(() => headers.value || { diet: [] });

    // --- Helper Functions ---
    // 팩토리얼 계산 함수
    const factorial = (n: number): number => {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    };

    // Fisher의 정확검정 계산 함수 (양측 검정)
    const calculateFisherExactTest = (a: number, b: number, c: number, d: number): number => {
        const n = a + b + c + d;
        const row1 = a + b;
        const row2 = c + d;
        const col1 = a + c;
        const col2 = b + d;

        const observedProb = (factorial(row1) * factorial(row2) * factorial(col1) * factorial(col2)) /
            (factorial(n) * factorial(a) * factorial(b) * factorial(c) * factorial(d));

        let pValue = 0;
        for (let x = 0; x <= Math.min(row1, col1); x++) {
            const y = row1 - x;
            const z = col1 - x;
            const w = row2 - z;
            if (y >= 0 && z >= 0 && w >= 0) {
                const currentProb = (factorial(row1) * factorial(row2) * factorial(col1) * factorial(col2)) /
                    (factorial(n) * factorial(x) * factorial(y) * factorial(z) * factorial(w));
                if (currentProb <= observedProb) {
                    pValue += currentProb;
                }
            }
        }
        return pValue;
    };

    // 카이제곱 항 계산 함수 (Yates' 보정 포함)
    const calculateChiTerm = (observed: number, expected: number): number => {
        if (expected === 0) {
            console.warn(`기대빈도가 0입니다. observed: ${observed}, expected: ${expected}`);
            return 0;
        }
        const diff = Math.abs(observed - expected);
        const correctedDiff = Math.max(0, diff - 0.5);
        return (correctedDiff * correctedDiff) / expected;
    };

    // 통계 계산 검증 함수
    const validateCohortStatistics = (result: CohortResult, factorName: string): boolean => {
        const issues: string[] = [];
        if (typeof result.pValue === 'number') {
            if (result.pValue < 0 || result.pValue > 1) {
                issues.push(`P-value 범위 오류: ${result.pValue}`);
            }
        }
        if (result.relativeRisk !== undefined && result.relativeRisk !== 'N/A' && result.relativeRisk !== 'Inf' && result.relativeRisk !== 'Error') {
            const rr = typeof result.relativeRisk === 'string' ? parseFloat(result.relativeRisk) : result.relativeRisk;
            if (rr === undefined || isNaN(rr as number) || (rr as number) < 0) {
                issues.push(`Relative Risk 값 오류: ${result.relativeRisk}`);
            }
        }
        if (result.incidence_exposed_formatted !== undefined && result.incidence_exposed_formatted !== 'N/A') {
            const val = String(result.incidence_exposed_formatted);
            const exposed = parseFloat(val);
            if (!isNaN(exposed) && (exposed < 0 || exposed > 100)) {
                issues.push(`노출군 발병률 범위 오류: ${val}`);
            }
        }
        if (result.incidence_unexposed_formatted !== undefined && result.incidence_unexposed_formatted !== 'N/A') {
            const val = String(result.incidence_unexposed_formatted);
            const unexposed = parseFloat(val);
            if (!isNaN(unexposed) && (unexposed < 0 || unexposed > 100)) {
                issues.push(`비노출군 발병률 범위 오류: ${val}`);
            }
        }
        if (issues.length > 0) {
            console.warn(`코호트 통계 검증 오류 - ${factorName}:`, issues);
        }
        return issues.length === 0;
    };

    // --- Main Calculation Logic ---
    const cohortAnalysisResults = computed<CohortResult[]>(() => {
        if (!typedRows.value || typedRows.value.length === 0) {
            console.warn('코호트 분석을 위한 rows 데이터가 없습니다.');
            return [];
        }

        const dietHeaders = typedHeaders.value.diet || [];
        if (dietHeaders.length === 0) {
            const defaultDietItems: string[] = [];
            for (let i = 0; i < 10; i++) {
                defaultDietItems.push(`식단${i + 1}`);
            }
            dietHeaders.push(...defaultDietItems);
        }

        const z_crit = jStat.normal.inv(0.975, 0, 1);

        return dietHeaders.map((dietItem: string, index: number) => {
            const factorName = dietItem;
            let a_obs = 0, b_obs = 0, c_obs = 0, d_obs = 0;

            typedRows.value.forEach((row: GridRow) => {
                const isPatient = String(row.isPatient);
                const dietInfo = row.dietInfo as (string | number | null)[];
                const dietValue = dietInfo && dietInfo.length > index
                    ? String(dietInfo[index])
                    : null;
                if (dietValue === '1') {
                    if (isPatient === '1') a_obs++;
                    else if (isPatient === '0') b_obs++;
                } else if (dietValue === '0') {
                    if (isPatient === '1') c_obs++;
                    else if (isPatient === '0') d_obs++;
                }
            });

            const rowTotal_Exposed = a_obs + b_obs;
            const rowTotal_Unexposed = c_obs + d_obs;
            const colTotal_Disease = a_obs + c_obs;
            const colTotal_NoDisease = b_obs + d_obs;
            const grandTotal = rowTotal_Exposed + rowTotal_Unexposed;

            let adj_chi: number | null = null;
            let pValue: number | null = null;
            let relativeRisk: string | number = 'N/A';
            let rr_ci_lower: string | number = 'N/A';
            let rr_ci_upper: string | number = 'N/A';
            let hasCorrection = false;

            let incidence_exposed_formatted = 'N/A';
            let incidence_unexposed_formatted = 'N/A';

            if (rowTotal_Exposed > 0) {
                const incidence_exposed = (a_obs / rowTotal_Exposed) * 100;
                incidence_exposed_formatted = `${incidence_exposed.toFixed(1)}%`;
            }
            if (rowTotal_Unexposed > 0) {
                const incidence_unexposed = (c_obs / rowTotal_Unexposed) * 100;
                incidence_unexposed_formatted = `${incidence_unexposed.toFixed(1)}%`;
            }

            if (grandTotal > 0) {
                const a_exp = (rowTotal_Exposed * colTotal_Disease) / grandTotal;
                const b_exp = (rowTotal_Exposed * colTotal_NoDisease) / grandTotal;
                const c_exp = (rowTotal_Unexposed * colTotal_Disease) / grandTotal;
                const d_exp = (rowTotal_Unexposed * colTotal_NoDisease) / grandTotal;

                const canApplyChiSquare = rowTotal_Exposed > 0 && rowTotal_Unexposed > 0 &&
                    colTotal_Disease > 0 && colTotal_NoDisease > 0 &&
                    a_exp > 0 && b_exp > 0 && c_exp > 0 && d_exp > 0;

                if (canApplyChiSquare) {
                    const hasSmallExpected = a_exp < 5 || b_exp < 5 || c_exp < 5 || d_exp < 5;
                    if (hasSmallExpected) {
                        try {
                            pValue = calculateFisherExactTest(a_obs, b_obs, c_obs, d_obs);
                            adj_chi = null;
                        } catch (e) {
                            console.error(`Fisher's exact test calculation error for item ${factorName}:`, e);
                            pValue = null;
                            adj_chi = null;
                        }
                    } else {
                        if (useYatesCorrection.value) {
                            const term1 = calculateChiTerm(a_obs, a_exp);
                            const term2 = calculateChiTerm(b_obs, b_exp);
                            const term3 = calculateChiTerm(c_obs, c_exp);
                            const term4 = calculateChiTerm(d_obs, d_exp);
                            adj_chi = term1 + term2 + term3 + term4;
                        } else {
                            const term1 = ((a_obs - a_exp) * (a_obs - a_exp)) / a_exp;
                            const term2 = ((b_obs - b_exp) * (b_obs - b_exp)) / b_exp;
                            const term3 = ((c_obs - c_exp) * (c_obs - c_exp)) / c_exp;
                            const term4 = ((d_obs - d_exp) * (d_obs - d_exp)) / d_exp;
                            adj_chi = term1 + term2 + term3 + term4;
                        }

                        if (adj_chi !== null && isFinite(adj_chi) && adj_chi >= 0) {
                            try {
                                pValue = 1 - jStat.chisquare.cdf(adj_chi, 1);
                                if (isNaN(pValue)) pValue = null;
                            } catch (e) {
                                console.error(`P-value calculation error for item ${factorName}:`, e);
                                pValue = null;
                            }
                        } else {
                            adj_chi = null;
                        }
                    }
                } else {
                    adj_chi = null;
                    pValue = null;
                }
            }

            if (rowTotal_Exposed > 0 && rowTotal_Unexposed > 0) {
                const hasZeroCell = a_obs === 0 || b_obs === 0 || c_obs === 0 || d_obs === 0;
                
                const a_prime = hasZeroCell ? a_obs + 0.5 : a_obs;
                const b_prime = hasZeroCell ? b_obs + 0.5 : b_obs;
                const c_prime = hasZeroCell ? c_obs + 0.5 : c_obs;
                const d_prime = hasZeroCell ? d_obs + 0.5 : d_obs;
                
                if (hasZeroCell) hasCorrection = true;

                const total_exposed_prime = a_prime + b_prime;
                const total_unexposed_prime = c_prime + d_prime;

                try {
                    const risk_exposed = a_prime / total_exposed_prime;
                    const risk_unexposed = c_prime / total_unexposed_prime;
                    let rr_calc = NaN;

                    if (risk_unexposed > 0) {
                        rr_calc = risk_exposed / risk_unexposed;
                    } else if (risk_exposed > 0 && risk_unexposed === 0) {
                        rr_calc = Infinity;
                    }

                    if (isFinite(rr_calc) && rr_calc >= 0) {
                        relativeRisk = rr_calc.toFixed(3);
                        const logRR = Math.log(rr_calc <= 0 ? Number.EPSILON : rr_calc);
                        let se_logRR = NaN;
                        if (a_prime > 0 && c_prime > 0) {
                            se_logRR = Math.sqrt((b_prime / (a_prime * total_exposed_prime)) + (d_prime / (c_prime * total_unexposed_prime)));
                        }
                        if (isFinite(se_logRR)) {
                            const logCI_lower = logRR - z_crit * se_logRR;
                            const logCI_upper = logRR + z_crit * se_logRR;
                            rr_ci_lower = Math.exp(logCI_lower).toFixed(3);
                            rr_ci_upper = Math.exp(logCI_upper).toFixed(3);
                        }
                    } else if (rr_calc === Infinity) {
                        relativeRisk = 'Inf';
                        rr_ci_lower = 'Inf';
                        rr_ci_upper = 'Inf';
                    }
                } catch (e) {
                    console.error(`RR/CI calculation error for item ${factorName}:`, e);
                }
            }

            const result: CohortResult = {
                item: factorName,
                a_obs,
                rowTotal_Exposed,
                incidence_exposed_formatted,
                c_obs,
                rowTotal_Unexposed,
                incidence_unexposed_formatted,
                adj_chi,
                pValue,
                relativeRisk,
                rr_ci_lower,
                rr_ci_upper,
                hasCorrection
            };

            validateCohortStatistics(result, factorName);
            return result;
        });
    });

    watch([cohortAnalysisResults, useYatesCorrection], () => {
        const fisherUsed = cohortAnalysisResults.value.some((r) => r.adj_chi === null && typeof r.pValue === 'number');
        const yatesUsed = useYatesCorrection.value;
        let statMethod = 'chi-square';
        if (fisherUsed && yatesUsed) statMethod = 'yates-fisher';
        else if (fisherUsed && !yatesUsed) statMethod = 'chi-fisher';
        else if (!fisherUsed && yatesUsed) statMethod = 'yates';

        const haldaneCorrectionUsed = cohortAnalysisResults.value.some((r) => r.hasCorrection);
        settingsStore.setAnalysisOptions({ statMethod, haldaneCorrection: haldaneCorrectionUsed });

        settingsStore.setAnalysisResults({
            type: 'cohort',
            results: cohortAnalysisResults.value
        });
    }, { immediate: true });

    return {
        cohortAnalysisResults
    };
}
