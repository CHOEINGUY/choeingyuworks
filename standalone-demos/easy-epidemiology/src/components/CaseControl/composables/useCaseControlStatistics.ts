import { computed, ref, watch, Ref } from 'vue';
import { useEpidemicStore } from '../../../stores/epidemicStore';
import { useSettingsStore } from '../../../stores/settingsStore';
import { jStat } from 'jstat';
import { CaseControlResult } from '@/types/analysis';
import { GridRow } from '@/types/grid';
import { EpidemicHeaders } from '../../../stores/epidemicStore';

export function useCaseControlStatistics() {
    const epidemicStore = useEpidemicStore();
    const settingsStore = useSettingsStore();

    // Yates 보정 토글 변수 (store에서 관리)
    const yatesSettings = computed(() => settingsStore.yatesCorrectionSettings);
    const useYatesCorrection = computed<boolean>({
        get: () => yatesSettings.value?.caseControl ?? false,
        set: (value: boolean) => settingsStore.setYatesCorrectionSettings({ type: 'caseControl', enabled: value })
    });

    // Vuex 스토어에서 headers와 rows 데이터 가져오기
    const headers = computed<EpidemicHeaders>(() => epidemicStore.headers || { basic: [], clinical: [], diet: [] });
    const rows = computed<GridRow[]>(() => epidemicStore.rows || []);

    // 오즈비 필터링 상태
    const isOrFilterActive = ref(false);
    const orThresholds = [2, 3, 4]; // 2 → 3 → 4 → 2
    const currentOrThreshold = ref(2);

    // 오즈비 필터 토글 함수
    const toggleOrFilter = () => {
        isOrFilterActive.value = !isOrFilterActive.value;
    };

    // 오즈비 임계값 순환 함수
    const cycleOrThreshold = () => {
        const currentIndex = orThresholds.indexOf(currentOrThreshold.value);
        const nextIndex = (currentIndex + 1) % orThresholds.length;
        currentOrThreshold.value = orThresholds[nextIndex];
    };

    // Yates 보정 토글 함수
    const toggleYatesCorrection = () => {
        useYatesCorrection.value = !useYatesCorrection.value;
    };

    // --- 팩토리얼 계산 함수 ---
    const factorial = (n: number): number => {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    };

    // --- Fisher의 정확검정 계산 함수 (양측 검정) ---
    const calculateFisherExactTest = (a: number, b: number, c: number, d: number): number => {
        // 2x2 분할표에서 Fisher의 정확검정 계산 (양측 검정)
        const n = a + b + c + d;
        const row1 = a + b;
        const row2 = c + d;
        const col1 = a + c;
        const col2 = b + d;

        // 관측된 분할표의 확률 계산
        const observedProb = (factorial(row1) * factorial(row2) * factorial(col1) * factorial(col2)) /
            (factorial(n) * factorial(a) * factorial(b) * factorial(c) * factorial(d));

        let pValue = 0;
        // 모든 가능한 분할표에 대해 확률 계산
        for (let x = 0; x <= Math.min(row1, col1); x++) {
            const y = row1 - x;
            const z = col1 - x;
            const w = row2 - z;

            if (y >= 0 && z >= 0 && w >= 0) {
                // 현재 분할표의 확률
                const currentProb = (factorial(row1) * factorial(row2) * factorial(col1) * factorial(col2)) /
                    (factorial(n) * factorial(x) * factorial(y) * factorial(z) * factorial(w));

                // 관측된 분할표보다 극단적인 경우의 확률만 합산 (양측 검정)
                if (currentProb <= observedProb) {
                    pValue += currentProb;
                }
            }
        }
        return pValue;
    };

    // --- 카이제곱 항 계산 함수 (Yates' 보정 포함) ---
    const calculateChiTerm = (observed: number, expected: number): number => {
        // 기대빈도가 0이면 카이제곱 검정 적용 불가
        if (expected === 0) {
            console.warn(`기대빈도가 0입니다. observed: ${observed}, expected: ${expected}`);
            return 0; // 이 경우는 상위에서 canApplyChiSquare로 미리 걸러짐
        }

        const diff = Math.abs(observed - expected);
        // Yates' 보정: 절대값 차이에서 0.5를 빼줌 (최소 0)
        const correctedDiff = Math.max(0, diff - 0.5);
        return (correctedDiff * correctedDiff) / expected;
    };

    // --- 통계 계산 검증 함수 ---
    const validateStatistics = (result: CaseControlResult, factorName: string): boolean => {
        const issues: string[] = [];

        // P-value 검증
        if (typeof result.pValue === 'number') {
            if (result.pValue < 0 || result.pValue > 1) {
                issues.push(`P-value 범위 오류: ${result.pValue}`);
            }
        }

        // Odds Ratio 검증
        if (result.oddsRatio !== undefined && result.oddsRatio !== 'N/A' && result.oddsRatio !== 'Inf' && result.oddsRatio !== 'Error') {
            const or = typeof result.oddsRatio === 'string' ? parseFloat(result.oddsRatio) : result.oddsRatio;
            if (or === undefined || isNaN(or) || or < 0) {
                issues.push(`Odds Ratio 값 오류: ${result.oddsRatio}`);
            }
        }

        // 신뢰구간 검증
        if (result.ci_lower !== undefined && result.ci_upper !== undefined && result.ci_lower !== 'N/A' && result.ci_upper !== 'N/A') {
            const lower = typeof result.ci_lower === 'string' ? parseFloat(result.ci_lower) : result.ci_lower;
            const upper = typeof result.ci_upper === 'string' ? parseFloat(result.ci_upper) : result.ci_upper;
            if (lower !== undefined && upper !== undefined && !isNaN(lower) && !isNaN(upper) && lower > upper) {
                issues.push(`신뢰구간 순서 오류: ${result.ci_lower} > ${result.ci_upper}`);
            }
        }

        if (issues.length > 0) {
            console.warn(`통계 검증 오류 - ${factorName}:`, issues);
        }

        return issues.length === 0;
    };

    // --- 분석 결과 계산 (Computed Property) ---
    const analysisResults = computed<CaseControlResult[]>(() => {
        // 조건 완화: 식단 헤더가 없어도 기본 분석 가능하도록 수정
        if (!rows.value || rows.value.length === 0) {
            console.warn('분석을 위한 rows 데이터가 없습니다.');
            return [];
        }

        // 식단 헤더가 없으면 기본 헤더 생성
        const dietHeaders = headers.value?.diet || [];
        if (dietHeaders.length === 0) {
            console.log('식단 헤더가 없어 기본 분석을 수행합니다.');
            // 기본 식단 항목들 생성 (실제 데이터에서 추출)
            const defaultDietItems: string[] = [];
            for (let i = 0; i < 10; i++) {
                defaultDietItems.push(`식단${i + 1}`);
            }
            dietHeaders.push(...defaultDietItems);
        }

        // 95% CI를 위한 Z-score (양측 검정, 표준정규분포에서 0.975에 해당하는 값)
        const z_crit = jStat.normal.inv(0.975, 0, 1); // 약 1.96

        return dietHeaders.map((dietItem: string, index: number) => {
            const factorName = dietItem;
            let b_obs = 0, // 환자군 + 요인 노출
                c_obs = 0, // 환자군 + 요인 비노출
                e_obs = 0, // 대조군 + 요인 노출
                f_obs = 0; // 대조군 + 요인 비노출

            // 데이터 순회하며 각 셀 관측값 계산
            rows.value.forEach((row: GridRow) => {
                const isPatient = String(row.isPatient);
                const dietInfo = row.dietInfo as (string | number | null)[];
                const dietValue = dietInfo && dietInfo.length > index
                    ? String(dietInfo[index])
                    : null;

                if (isPatient === '1') {
                    // 환자군
                    if (dietValue === '1') b_obs++;
                    else if (dietValue === '0') c_obs++;
                } else if (isPatient === '0') {
                    // 대조군
                    if (dietValue === '1') e_obs++;
                    else if (dietValue === '0') f_obs++;
                }
            });

            // 각 행/열 합계 계산
            const rowTotal_Case = b_obs + c_obs;
            const rowTotal_Control = e_obs + f_obs;
            const colTotal_Exposed = b_obs + e_obs;
            const colTotal_Unexposed = c_obs + f_obs;
            const grandTotal = rowTotal_Case + rowTotal_Control;

            // 결과 변수 초기화
            let adj_chi: number | null = null; // Yates' 보정 카이제곱 값
            let pValue: number | null = null; // P-value
            let oddsRatio: string | number = 'N/A'; // Odds Ratio 추정치
            let ci_lower: string | number = 'N/A'; // 95% CI 하한
            let ci_upper: string | number = 'N/A'; // 95% CI 상한
            let hasCorrection = false; // 0.5 보정 적용 여부

            // --- 카이제곱 및 P-value 계산 ---
            if (grandTotal > 0) {
                // 기대 빈도 계산
                const b_exp = (rowTotal_Case * colTotal_Exposed) / grandTotal;
                const c_exp = (rowTotal_Case * colTotal_Unexposed) / grandTotal;
                const e_exp = (rowTotal_Control * colTotal_Exposed) / grandTotal;
                const f_exp = (rowTotal_Control * colTotal_Unexposed) / grandTotal;

                // 카이제곱 검정 적용 가능성 검사
                const canApplyChiSquare = colTotal_Exposed > 0 && colTotal_Unexposed > 0 &&
                    rowTotal_Case > 0 && rowTotal_Control > 0 &&
                    b_exp > 0 && c_exp > 0 && e_exp > 0 && f_exp > 0;

                if (canApplyChiSquare) {
                    // 기대빈도 5미만 체크
                    const hasSmallExpected = b_exp < 5 || c_exp < 5 || e_exp < 5 || f_exp < 5;

                    if (hasSmallExpected) {
                        // 기대빈도 5미만: Fisher의 정확검정 사용
                        try {
                            pValue = calculateFisherExactTest(b_obs, c_obs, e_obs, f_obs);
                            adj_chi = null; // Fisher 검정에서는 카이제곱 값 계산 안함
                        } catch (e) {
                            console.error(`Fisher's exact test calculation error for item ${factorName}:`, e);
                            pValue = null;
                            adj_chi = null;
                        }
                    } else {
                        // 기대빈도 5이상: 일반 카이제곱 또는 Yates' 보정 카이제곱 검정 사용
                        if (useYatesCorrection.value) {
                            // Yates' 보정 카이제곱 검정 사용
                            const term1 = calculateChiTerm(b_obs, b_exp);
                            const term2 = calculateChiTerm(c_obs, c_exp);
                            const term3 = calculateChiTerm(e_obs, e_exp);
                            const term4 = calculateChiTerm(f_obs, f_exp);
                            adj_chi = term1 + term2 + term3 + term4;
                        } else {
                            // 일반 카이제곱 검정 사용 (보정 없음)
                            const term1 = ((b_obs - b_exp) * (b_obs - b_exp)) / b_exp;
                            const term2 = ((c_obs - c_exp) * (c_obs - c_exp)) / c_exp;
                            const term3 = ((e_obs - e_exp) * (e_obs - e_exp)) / e_exp;
                            const term4 = ((f_obs - f_exp) * (f_obs - f_exp)) / f_exp;
                            adj_chi = term1 + term2 + term3 + term4;
                        }

                        // P-value 계산 (자유도=1)
                        if (adj_chi !== null && isFinite(adj_chi) && adj_chi >= 0) {
                            try {
                                const pVal = 1 - jStat.chisquare.cdf(adj_chi, 1);
                                pValue = isNaN(pVal) ? null : pVal;
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

            // --- Odds Ratio 및 95% CI 계산 ---
            if (colTotal_Exposed > 0 && colTotal_Unexposed > 0 &&
                rowTotal_Case > 0 && rowTotal_Control > 0) {
                
                const hasZeroCell = b_obs === 0 || c_obs === 0 || e_obs === 0 || f_obs === 0;
                
                const b_prime = hasZeroCell ? b_obs + 0.5 : b_obs;
                const c_prime = hasZeroCell ? c_obs + 0.5 : c_obs;
                const e_prime = hasZeroCell ? e_obs + 0.5 : e_obs;
                const f_prime = hasZeroCell ? f_obs + 0.5 : f_obs;
                
                if (hasZeroCell) hasCorrection = true;

                // Odds Ratio 계산: OR = (b*f)/(c*e)
                const or_calc = (b_prime * f_prime) / (c_prime * e_prime);
                if (isFinite(or_calc) && or_calc > 0) {
                    oddsRatio = or_calc.toFixed(3);
                    const logOR = Math.log(or_calc);
                    // sqrt(1/b + 1/c + 1/e + 1/f)
                    const se_logOR = Math.sqrt(1 / b_prime + 1 / c_prime + 1 / e_prime + 1 / f_prime);
                    
                    if (isFinite(se_logOR)) {
                        const logCI_lower = logOR - z_crit * se_logOR;
                        const logCI_upper = logOR + z_crit * se_logOR;
                        ci_lower = Math.exp(logCI_lower).toFixed(3);
                        ci_upper = Math.exp(logCI_upper).toFixed(3);
                    }
                } else if (or_calc === 0) {
                    oddsRatio = '0.000';
                    ci_lower = '0.000';
                    ci_upper = '0.000';
                } else {
                    if (c_prime * e_prime === 0 && b_prime * f_prime > 0) {
                        oddsRatio = 'Inf';
                        ci_lower = 'Inf';
                        ci_upper = 'Inf';
                    } else {
                        oddsRatio = 'N/A';
                        ci_lower = 'N/A';
                        ci_upper = 'N/A';
                    }
                }
            }

            const result: CaseControlResult = {
                item: factorName,
                b_obs,
                c_obs,
                rowTotal_Case,
                e_obs,
                f_obs,
                rowTotal_Control,
                adj_chi,
                pValue,
                oddsRatio,
                ci_lower,
                ci_upper,
                hasCorrection
            };

            validateStatistics(result, factorName);
            return result;
        });
    });

    // --- 필터링된 분석 결과 (오즈비 임계값 이상) ---
    const filteredAnalysisResults = computed<CaseControlResult[]>(() => {
        if (!isOrFilterActive.value) {
            return analysisResults.value;
        }
        return analysisResults.value.filter(result => {
            const orValue = typeof result.oddsRatio === 'string' ? parseFloat(result.oddsRatio) : result.oddsRatio;
            return !isNaN(orValue as number) && (orValue as number) >= currentOrThreshold.value;
        });
    });

    // --- Vuex: 분석 요약 업데이트 ---
    watch([analysisResults, useYatesCorrection], () => {
        const fisherUsed = analysisResults.value.some(r => r.adj_chi === null && typeof r.pValue === 'number');
        const yatesUsed = useYatesCorrection.value;
        let statMethod = 'chi-square';
        if (fisherUsed && yatesUsed) statMethod = 'yates-fisher';
        else if (fisherUsed && !yatesUsed) statMethod = 'chi-fisher';
        else if (!fisherUsed && yatesUsed) statMethod = 'yates';

        const haldaneCorrectionUsed = analysisResults.value.some(r => r.hasCorrection);
        settingsStore.setAnalysisOptions({ statMethod, haldaneCorrection: haldaneCorrectionUsed });

        // 분석 결과를 store에 저장 (의심식단 드롭다운용)
        settingsStore.setAnalysisResults({
            type: 'caseControl',
            results: analysisResults.value
        });
    }, { immediate: true });

    return {
        headers,
        rows,
        useYatesCorrection,
        toggleYatesCorrection,
        isOrFilterActive,
        toggleOrFilter,
        currentOrThreshold,
        cycleOrThreshold,
        analysisResults,
        filteredAnalysisResults
    };
}
