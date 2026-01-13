import { ref, computed } from 'vue';
import { useSettingsStore } from '../../../stores/settingsStore';

export function useChartSettings() {
    const settingsStore = useSettingsStore();

    // 상수 정의
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { t } = require('@/i18n').default.global;

    // 상수 정의
    const fontSizes: number[] = [12, 15, 18, 21, 24];
    const fontSizeLabels = computed(() => [
        t('common.size.verySmall'),
        t('common.size.small'),
        t('common.size.medium'),
        t('common.size.large'),
        t('common.size.veryLarge')
    ]);
    const chartWidths: number[] = [700, 900, 1100];
    const barColors: string[] = [
        '#5470c6', '#1E88E5', '#29ABE2', '#91cc75', '#fac858',
        '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
    ];

    // Store에서 설정 불러오기
    const chartSettings = computed(() => settingsStore.epidemicCurveSettings);

    // 유행곡선 상태
    const epiChartFontSize = ref<number>(chartSettings.value.fontSize || 18);
    const epiChartWidth = ref<number>(chartSettings.value.chartWidth || 900);
    const epiBarColor = ref<string>(chartSettings.value.barColor || '#1E88E5');
    const chartDisplayMode = ref<string>(chartSettings.value.displayMode || 'time');

    // 잠복기 차트 상태
    const incubationChartFontSize = ref<number>(chartSettings.value.incubationFontSize || 18);
    const incubationChartWidth = ref<number>(chartSettings.value.incubationChartWidth || 800);
    const incubationBarColor = ref<string>(chartSettings.value.incubationBarColor || '#91cc75');
    const incubationChartDisplayMode = ref<string>(chartSettings.value.incubationDisplayMode || 'hour');

    // 유행곡선 설정 함수
    const setEpiFontSize = (val: number) => {
        epiChartFontSize.value = val;
        settingsStore.updateEpidemicCurveSettings({ fontSize: val });
    };

    const setEpiChartWidth = (val: number) => {
        epiChartWidth.value = val;
        settingsStore.updateEpidemicCurveSettings({ chartWidth: val });
    };

    const setEpiBarColor = (val: string) => {
        epiBarColor.value = val;
        settingsStore.updateEpidemicCurveSettings({ barColor: val });
    };

    const setChartDisplayMode = (val: string) => {
        chartDisplayMode.value = val;
        settingsStore.updateEpidemicCurveSettings({ displayMode: val });
    };

    // 잠복기 설정 함수
    const setIncubationFontSize = (val: number) => {
        incubationChartFontSize.value = val;
        settingsStore.updateEpidemicCurveSettings({ incubationFontSize: val });
    };

    const setIncubationChartWidth = (val: number) => {
        incubationChartWidth.value = val;
        settingsStore.updateEpidemicCurveSettings({ incubationChartWidth: val });
    };

    const setIncubationBarColor = (val: string) => {
        incubationBarColor.value = val;
        settingsStore.updateEpidemicCurveSettings({ incubationBarColor: val });
    };

    const setIncubationDisplayMode = (val: string) => {
        incubationChartDisplayMode.value = val;
        settingsStore.updateEpidemicCurveSettings({ incubationDisplayMode: val });
    };

    // 초기화 함수
    const resetEpiChartSettings = () => {
        setEpiFontSize(18);
        setEpiChartWidth(1100);
        setEpiBarColor('#1E88E5');
        setChartDisplayMode('time');
    };

    const resetIncubationChartSettings = () => {
        setIncubationFontSize(18);
        setIncubationChartWidth(800);
        setIncubationBarColor('#91cc75');
        setIncubationDisplayMode('hour');
    };

    return {
        // 상수
        fontSizes,
        fontSizeLabels,
        chartWidths,
        barColors,
        // 유행곡선 상태
        epiChartFontSize,
        epiChartWidth,
        epiBarColor,
        chartDisplayMode,
        // 잠복기 상태
        incubationChartFontSize,
        incubationChartWidth,
        incubationBarColor,
        incubationChartDisplayMode,
        // 유행곡선 함수
        setEpiFontSize,
        setEpiChartWidth,
        setEpiBarColor,
        setChartDisplayMode,
        resetEpiChartSettings,
        // 잠복기 함수
        setIncubationFontSize,
        setIncubationChartWidth,
        setIncubationBarColor,
        setIncubationDisplayMode,
        resetIncubationChartSettings
    };
}
