import * as echarts from 'echarts';

interface GradientColors {
    lightColor: string;
    darkColor: string;
}

interface YAxisMaxAndStep {
    yMax: number;
    step: number;
}

interface EpiCurveChartOptionsParams {
    symptomOnsetTableData: any[];
    confirmedCaseOnsetTableData: any[];
    selectedSymptomInterval: number;
    chartDisplayMode: string;
    epiChartFontSize: number;
    epiBarColor: string;
    suspectedFood: string;
    isConfirmedCaseColumnVisible: boolean;
    showConfirmedCaseLine: boolean;
    t: (key: string) => string;
}

/**
 * 선택된 색상을 기반으로 그라디언트 생성
 */
export function generateGradientColors(baseColor: string): GradientColors {
    const hex2rgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const rgb2hex = (r: number, g: number, b: number) => {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    const adjustBrightness = (color: string, percent: number) => {
        const rgb = hex2rgb(color);
        if (!rgb)
            return color;
        const factor = percent / 100;
        const r = Math.min(255, Math.max(0, Math.round(rgb.r + (255 - rgb.r) * factor)));
        const g = Math.min(255, Math.max(0, Math.round(rgb.g + (255 - rgb.g) * factor)));
        const b = Math.min(255, Math.max(0, Math.round(rgb.b + (255 - rgb.b) * factor)));
        return rgb2hex(r, g, b);
    };

    const lightColor = adjustBrightness(baseColor, 40);
    const darkColor = baseColor;
    return { lightColor, darkColor };
}

/**
 * Y축 최대값과 간격 계산
 */
export function getNiceYAxisMaxAndStep(maxValue: number): YAxisMaxAndStep {
    let yMax: number;
    if (maxValue < 10) {
        yMax = Math.max(maxValue + 1, Math.ceil(maxValue * 1.1));
    }
    else if (maxValue < 20) {
        yMax = Math.ceil(maxValue / 5) * 5;
    }
    else {
        yMax = Math.ceil((maxValue * 1.1) / 10) * 10;
    }

    let step = 1;
    if (yMax > 100)
        step = 20;
    else if (yMax > 50)
        step = 10;
    else if (yMax > 20)
        step = 5;
    else if (yMax > 10)
        step = 2;

    yMax = Math.ceil(yMax / step) * step;
    return { yMax, step };
}

/**
 * 동적 왼쪽 여백 계산
 */
export function getDynamicLeftMargin(displayMode: string, fontSize: number): string {
    if (displayMode !== 'datetime')
        return '3%';
    const baseMargin = 80;
    let fontSizeAdjustment: number;
    if (fontSize <= 15)
        fontSizeAdjustment = 0;
    else if (fontSize <= 18)
        fontSizeAdjustment = (fontSize - 15) * 8;
    else if (fontSize <= 21)
        fontSizeAdjustment = (fontSize - 15) * 9;
    else
        fontSizeAdjustment = (fontSize - 15) * 15;

    const minMargin = 80;
    const calculatedMargin = Math.max(minMargin, baseMargin + fontSizeAdjustment);
    return `${calculatedMargin}px`;
}

/**
 * 유행곡선 차트 옵션 생성
 */
export function generateEpiCurveChartOptions({ 
    symptomOnsetTableData, 
    confirmedCaseOnsetTableData, 
    selectedSymptomInterval, 
    chartDisplayMode, 
    epiChartFontSize, 
    epiBarColor, 
    suspectedFood, 
    isConfirmedCaseColumnVisible, 
    showConfirmedCaseLine,
    t
}: EpiCurveChartOptionsParams): any {
    const data = symptomOnsetTableData;
    if (!Array.isArray(data) || data.length === 0) {
        return {
            title: {
                text: '',
                subtext: '',
                left: 'center'
            }
        } as any;
    }

    // 데이터 가공
    const processedData = data.map(item => {
        const intervalLabel = item.intervalLabel;
        const parts = intervalLabel.split(' ~ ');
        const startDateStr = parts[0];
        const datePart = startDateStr.split(' ')[0];
        const timePart = startDateStr.split(' ')[1];
        const [month, day] = datePart.split('-').map((p: string) => parseInt(p, 10));
        const year = new Date().getFullYear();
        const dateObj = new Date(year, month - 1, day);
        const dayOfWeekMap = ['일', '월', '화', '수', '목', '금', '토'];
        const dayOfWeek = dayOfWeekMap[dateObj.getDay()];
        const formattedDate = `${month}. ${day}.(${dayOfWeek})`;
        const startTime = timePart.split(':')[0];

        let formattedTime;
        if (chartDisplayMode === 'datetime') {
            formattedTime = item.intervalLabel;
        }
        else {
            const startHour = parseInt(startTime, 10);
            const intervalHours = selectedSymptomInterval || 3;
            const endHour = (startHour + intervalHours) % 24;
            formattedTime = `${startHour}~${endHour === 0 ? 24 : endHour}시`;
        }
        return { formattedDate, formattedTime, value: Number(item.count) || 0 };
    });

    const timeData = processedData.map(item => item.formattedTime);
    const seriesData = processedData.map(item => item.value);
    const confirmedCaseSeriesData = confirmedCaseOnsetTableData.map(item => Number(item.count) || 0);

    // 날짜 그룹 생성
    const dateGroups: { name: string; startIndex: number; count: number }[] = [];
    const dateMap = new Map<string, { startIndex: number; count: number }>();
    processedData.forEach((item, index) => {
        if (!dateMap.has(item.formattedDate)) {
            dateMap.set(item.formattedDate, { startIndex: index, count: 0 });
        }
        const group = dateMap.get(item.formattedDate)!;
        group.count++;
    });
    dateMap.forEach((value, key) => {
        dateGroups.push({ name: key, ...value });
    });

    const allValues = [...seriesData, ...confirmedCaseSeriesData];
    const maxValue = Math.max(...allValues);
    const { yMax, step } = getNiceYAxisMaxAndStep(maxValue);
    const gradientColors = generateGradientColors(epiBarColor || '#1E88E5');

    const options: any = {
        textStyle: { fontFamily: 'Noto Sans KR, sans-serif' },
        title: {
            text: t('epidemicCurve.charts.epidemicCurve'),
            left: 'center',
            textStyle: { fontSize: (epiChartFontSize || 15) + 4, fontWeight: 'bold' },
            top: 15
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params: any) => {
                if (!Array.isArray(params) || params.length === 0)
                    return '';
                const dataIndex = params[0].dataIndex;
                const item = processedData[dataIndex];
                const confirmedCaseCount = confirmedCaseSeriesData[dataIndex] || 0;
                let tooltipContent = chartDisplayMode === 'datetime'
                    ? `<strong>${item.formattedTime}</strong><br/>${t('epidemicCurve.symptomTable.count')}: <strong>${item.value}</strong> `
                    : `<strong>${item.formattedDate}</strong><br/>${item.formattedTime} : <strong>${item.value}</strong> `;
                if (isConfirmedCaseColumnVisible && showConfirmedCaseLine && confirmedCaseCount > 0) {
                    tooltipContent += `<br/>${t('dataInput.headers.confirmed')}: <strong style="color: #e74c3c;">${confirmedCaseCount}</strong> `;
                }
                return tooltipContent;
            }
        },
        grid: {
            left: getDynamicLeftMargin(chartDisplayMode, epiChartFontSize),
            right: chartDisplayMode === 'datetime' ? 60 : '4%',
            bottom: suspectedFood && suspectedFood.trim() ? '15%' : '7%',
            top: 80,
            containLabel: true
        },
        xAxis: chartDisplayMode === 'datetime'
            ? [{
                    type: 'category' as const,
                    data: timeData,
                    axisLine: { show: true, onZero: false },
                    axisTick: { show: false },
                    axisLabel: {
                        interval: 0,
                        color: '#333',
                        fontSize: epiChartFontSize || 15,
                        margin: 10,
                        rotate: 45
                    },
                    splitLine: { show: false },
                    boundaryGap: true
                }]
            : [
                {
                    type: 'category' as const,
                    data: timeData,
                    axisLine: { show: true, onZero: false },
                    axisTick: { show: false },
                    axisLabel: {
                        interval: 0,
                        color: '#333',
                        fontSize: epiChartFontSize || 15,
                        margin: 10,
                        rotate: 0
                    },
                    splitLine: { show: false },
                    boundaryGap: true
                },
                {
                    type: 'category' as const,
                    position: 'bottom',
                    offset: 35,
                    axisLine: { show: true, lineStyle: { color: '#cccccc', width: 2 } },
                    axisTick: {
                        show: true,
                        inside: false,
                        length: 70,
                        lineStyle: { color: '#cccccc', width: 2 }
                    },
                    axisLabel: {
                        show: true,
                        color: '#333',
                        fontSize: epiChartFontSize || 15
                    },
                    splitLine: { show: false },
                    data: dateGroups.flatMap(group => {
                        const groupData = Array(group.count).fill('');
                        if (groupData.length > 0)
                            groupData[0] = group.name;
                        return groupData;
                    })
                }
            ],
        yAxis: {
            type: 'value' as const,
            name: t('epidemicCurve.symptomTable.count') + ' (' + (t('epidemicCurve.controls.countUnit') || 'N') + ')',
            nameTextStyle: { padding: [0, 0, 0, 60], fontSize: epiChartFontSize || 15 },
            axisLabel: { fontSize: epiChartFontSize || 15 },
            splitLine: { show: true, lineStyle: { type: 'dashed' } },
            max: yMax,
            interval: step
        },
        legend: {
            show: isConfirmedCaseColumnVisible && showConfirmedCaseLine && confirmedCaseSeriesData.length > 0,
            data: [t('epidemicCurve.symptomTable.count'), t('dataInput.headers.confirmed')],
            top: 50,
            right: 20,
            textStyle: { fontSize: epiChartFontSize || 15 }
        },
        series: [
            {
                name: t('epidemicCurve.symptomTable.count'),
                type: 'bar',
                xAxisIndex: 0,
                data: seriesData,
                barWidth: '100%',
                itemStyle: {
                    color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: gradientColors.lightColor },
                        { offset: 1, color: gradientColors.darkColor }
                    ])
                },
                emphasis: {
                    focus: 'series',
                    itemStyle: {
                        color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#FDB813' },
                            { offset: 1, color: '#F9A825' }
                        ])
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    fontSize: Math.max(10, (epiChartFontSize || 15) - 1)
                }
            },
            ...(isConfirmedCaseColumnVisible && showConfirmedCaseLine && confirmedCaseSeriesData.length > 0 ? [{
                    name: t('dataInput.headers.confirmed'),
                    type: 'line' as const,
                    xAxisIndex: 0,
                    data: confirmedCaseSeriesData,
                    symbol: 'circle',
                    symbolSize: 6,
                    lineStyle: { color: '#e74c3c', width: 3 },
                    itemStyle: { color: '#e74c3c', borderColor: '#fff', borderWidth: 2 },
                    emphasis: {
                        focus: 'series' as const,
                        itemStyle: { color: '#c0392b', borderColor: '#fff', borderWidth: 2 }
                    },
                    label: {
                        show: true,
                        position: 'top' as const,
                        fontSize: Math.max(10, (epiChartFontSize || 15) - 1),
                        color: '#e74c3c',
                        formatter: (params: any) => {
                            const barValue = seriesData[params.dataIndex] || 0;
                            const lineValue = params.value || 0;
                            return barValue !== lineValue ? String(lineValue) : '';
                        }
                    }
                }] : [])
        ]
    };

    // Add graphic for suspected food if present
    if (suspectedFood && suspectedFood.trim()) {
        options.graphic = [{
                type: 'text',
                left: '5%',
                bottom: '5%',
                style: {
                    text: `${t('epidemicCurve.suspectedFood.title')} : ${suspectedFood}`,
                    fontSize: epiChartFontSize || 15,
                    fill: '#333',
                    fontWeight: 'normal'
                }
            }];
    }

    return options;
}
