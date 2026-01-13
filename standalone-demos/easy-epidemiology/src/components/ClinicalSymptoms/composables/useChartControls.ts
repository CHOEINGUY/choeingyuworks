import { ref, computed, type Ref, type ComputedRef } from 'vue';

export interface ChartControlOption {
  key: string;
  label: string;
  tooltip: string;
}

export type HighlightOption = ChartControlOption;
export type SortOption = ChartControlOption;

export type BarDirection = 'vertical' | 'horizontal';
export type DetailHighlight = 'none' | 'max' | 'min' | 'both';

export interface UseChartControlsReturn {
  fontSizes: number[];
  fontSizeLabels: ComputedRef<string[]>;
  chartWidths: number[];
  barWidthPercents: number[];
  barColors: string[];
  highlightOptions: ComputedRef<ChartControlOption[]>;
  sortOptions: ComputedRef<ChartControlOption[]>;
  chartFontSize: Ref<number>;
  chartWidth: Ref<number>;
  barWidthPercent: Ref<number>;
  selectedBarColor: Ref<string>;
  barDirection: Ref<BarDirection>;
  currentHighlight: Ref<DetailHighlight>;
  currentSort: Ref<string>;
}

/**
 * 차트 컨트롤 상태 관리 composable
 * @param t - i18n translate function
 * @returns {UseChartControlsReturn} 차트 컨트롤 관련 상태와 함수들
 */
export function useChartControls(t: (key: string) => string): UseChartControlsReturn {
  // 옵션 상수
  const fontSizes: number[] = [14, 16, 18, 20, 24];
  const fontSizeLabels = computed(() => [
    t('clinicalSymptoms.controls.fontSizeLabels.xs'),
    t('clinicalSymptoms.controls.fontSizeLabels.sm'),
    t('clinicalSymptoms.controls.fontSizeLabels.md'),
    t('clinicalSymptoms.controls.fontSizeLabels.lg'),
    t('clinicalSymptoms.controls.fontSizeLabels.xl')
  ]);
  const chartWidths: number[] = [500, 700, 900, 1100];
  const barWidthPercents: number[] = [30, 50, 70];
  const barColors: string[] = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
    '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
  ];

  // 강조 옵션
  const highlightOptions = computed(() => [
    { key: 'none', label: t('clinicalSymptoms.controls.highlightOptions.none.label'), tooltip: t('clinicalSymptoms.controls.highlightOptions.none.tooltip') },
    { key: 'max', label: t('clinicalSymptoms.controls.highlightOptions.max.label'), tooltip: t('clinicalSymptoms.controls.highlightOptions.max.tooltip') },
    { key: 'min', label: t('clinicalSymptoms.controls.highlightOptions.min.label'), tooltip: t('clinicalSymptoms.controls.highlightOptions.min.tooltip') },
    { key: 'both', label: t('clinicalSymptoms.controls.highlightOptions.both.label'), tooltip: t('clinicalSymptoms.controls.highlightOptions.both.tooltip') }
  ]);

  // 정렬 옵션
  const sortOptions = computed(() => [
    { key: 'none', label: t('clinicalSymptoms.controls.sortOptions.none.label'), tooltip: t('clinicalSymptoms.controls.sortOptions.none.tooltip') },
    { key: 'percent-asc', label: t('clinicalSymptoms.controls.sortOptions.asc.label'), tooltip: t('clinicalSymptoms.controls.sortOptions.asc.tooltip') },
    { key: 'percent-desc', label: t('clinicalSymptoms.controls.sortOptions.desc.label'), tooltip: t('clinicalSymptoms.controls.sortOptions.desc.tooltip') }
  ]);

  // 상태
  const chartFontSize = ref<number>(16);
  const chartWidth = ref<number>(700);
  const barWidthPercent = ref<number>(50);
  const selectedBarColor = ref<string>(barColors[0]);
  const barDirection = ref<BarDirection>('vertical');
  const currentHighlight = ref<DetailHighlight>('none');
  const currentSort = ref<string>('none');

  return {
    // 옵션 상수
    fontSizes,
    fontSizeLabels,
    chartWidths,
    barWidthPercents,
    barColors,
    highlightOptions,
    sortOptions,
    
    // 상태
    chartFontSize,
    chartWidth,
    barWidthPercent,
    selectedBarColor,
    barDirection,
    currentHighlight,
    currentSort
  };
}
