// ... existing imports
import { computed, type Ref, type ComputedRef } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

export interface SymptomStatItem {
  name: string;
  count: number;
  percent: number | string;
}

export interface ChartOptionsParams {
  sortedSymptomStats: Ref<SymptomStatItem[]>;
  barDirection: Ref<string>;
  chartFontSize: Ref<number>;
  selectedBarColor: Ref<string>;
  currentHighlight: Ref<string>;
  barWidthPercent: Ref<number>;
  t: (key: string) => string; // Add translation function
}

// ... existing GradientColors interface and generateGradientColors function

/**
 * ECharts 옵션 생성 composable
 */
export function useChartOptions(options: ChartOptionsParams): UseChartOptionsReturn {
  const {
    sortedSymptomStats,
    barDirection,
    chartFontSize,
    selectedBarColor,
    currentHighlight,
    barWidthPercent,
    t // Get translation function
  } = options;

  const chartOptions = computed<any>(() => {
    try {
      const stats = sortedSymptomStats.value;
      
      if (!Array.isArray(stats) || stats.length === 0) {
        console.warn('chartOptions: 유효하지 않은 증상 데이터');
        return { 
          title: { 
            text: t('clinicalSymptoms.chart.noDataTitle') || '임상증상 데이터가 필요합니다',
            subtext: t('clinicalSymptoms.chart.noDataSubtext') || '데이터 입력 화면에서 증상 관련 열에 데이터를 입력해주세요',
            left: 'center',
            textStyle: { 
              fontSize: 18, 
              fontFamily: 'Noto Sans KR, sans-serif',
              color: '#666'
            },
            subtextStyle: {
              fontSize: 14,
              color: '#999'
            }
          },
          graphic: {
            type: 'text',
            left: 'center',
            top: '60%',
            style: {
              text: t('clinicalSymptoms.chart.dataInputPrompt') || '📋 증상 데이터 입력 → 차트 자동 생성',
              fontSize: 16,
              fill: '#1a73e8',
              fontFamily: 'Noto Sans KR, sans-serif'
            }
          }
        };
      }
      
      const isHorizontal = barDirection.value === 'horizontal';
      const fontSize = chartFontSize.value || 16;
      
      // 데이터 검증
      const hasValidNames = stats.every(item => 
        item && typeof item.name === 'string' && item.name.trim() !== ''
      );
      
      if (!hasValidNames) {
        console.error('chartOptions: 유효하지 않은 증상명 데이터');
        return { title: { text: t('clinicalSymptoms.chart.errorFormat') || '데이터 형식 오류' } };
      }
      
      // 차트 데이터 준비
      const names = stats.map(item => item.name);
      const percentData = stats.map(item => {
        const percent = Number(item.percent);
        return isNaN(percent) ? 0 : percent;
      });

      // 강조 기능
      const maxValue = Math.max(...percentData);
      const minValue = Math.min(...percentData);
      const maxIndices = percentData.map((value, index) => value === maxValue ? index : -1).filter(i => i !== -1);
      const minIndices = percentData.map((value, index) => value === minValue ? index : -1).filter(i => i !== -1);
      
      const getBarColor = (index: number) => {
        let baseColor = selectedBarColor.value;
        
        if (currentHighlight.value !== 'none') {
          const isMax = maxIndices.includes(index);
          const isMin = minIndices.includes(index);
          
          if (currentHighlight.value === 'max' && isMax) {
            baseColor = '#ff6b6b';
          } else if (currentHighlight.value === 'min' && isMin) {
            baseColor = '#4ecdc4';
          } else if (currentHighlight.value === 'both') {
            if (isMax) baseColor = '#ff6b6b';
            else if (isMin) baseColor = '#4ecdc4';
          }
        }
        return baseColor;
      };
      
      console.log('차트 옵션 생성:', {
        direction: barDirection.value,
        fontSize,
        color: selectedBarColor.value,
        dataCount: stats.length
      });

      return {
        textStyle: {
          fontFamily: 'Noto Sans KR, sans-serif'
        },
        title: {
          text: t('clinicalSymptoms.chart.distributionTitle') || '환자의 임상증상 분포',
          left: 'center',
          textStyle: { fontSize, fontFamily: 'Noto Sans KR, sans-serif' }
        },
        tooltip: { 
          trigger: 'axis',
          formatter(params: any) {
            if (params && params[0]) {
              const data = params[0];
              const statsData = sortedSymptomStats.value.find(s => s.name === data.name);
              let result = `<strong>${data.name}</strong><br/>${data.seriesName}: <strong>${data.value}</strong>%`;
              if(statsData) {
                result += ` (${statsData.count}${t('clinicalSymptoms.frequencyTable.unitPerson') || '명'})`;
              }
              return result;
            }
            return '';
          }
        },
        grid: { 
          left: '8%', 
          right: isHorizontal ? '20%' : '8%', 
          bottom: isHorizontal ? '15%' : '10%', 
          top: '15%', 
          containLabel: true 
        },
        xAxis: isHorizontal
          ? { 
            type: 'value', 
            name: t('clinicalSymptoms.frequencyTable.percent'), 
            nameTextStyle: { fontSize, fontFamily: 'Noto Sans KR, sans-serif' }, 
            axisLabel: { fontSize, fontFamily: 'Noto Sans KR, sans-serif' }, 
            max: 100,
            min: 0
          }
          : { 
            type: 'category', 
            data: names, 
            axisLabel: { 
              interval: 0, 
              rotate: stats.length > 10 ? 30 : 0, 
              fontSize,
              fontFamily: 'Noto Sans KR, sans-serif'
            } 
          },
        yAxis: isHorizontal
          ? { 
            type: 'category', 
            data: names, 
            axisLabel: { fontSize, fontFamily: 'Noto Sans KR, sans-serif' } 
          }
          : { 
            type: 'value', 
            name: t('clinicalSymptoms.frequencyTable.percent'), 
            nameTextStyle: { fontSize, fontFamily: 'Noto Sans KR, sans-serif' }, 
            axisLabel: { fontSize, fontFamily: 'Noto Sans KR, sans-serif' }, 
            max: 100,
            min: 0
          },
        series: [
          {
            name: t('clinicalSymptoms.chart.percentSeries') || '백분율',
            type: 'bar',
            data: percentData,
            itemStyle: { 
              color(params: any) {
                const baseColor = getBarColor(params.dataIndex);
                const colors = generateGradientColors(baseColor);
                if (barDirection.value === 'horizontal') {
                  return new (echarts as any).graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: colors.darkColor },
                    { offset: 1, color: colors.lightColor }
                  ]);
                }
                return new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: colors.lightColor },
                  { offset: 1, color: colors.darkColor }
                ]);
              }
            },
            emphasis: {
              focus: 'series',
              itemStyle: {
                color: isHorizontal
                  ? new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: '#F9A825' },
                    { offset: 1, color: '#FDB813' }
                  ])
                  : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#FDB813' },
                    { offset: 1, color: '#F9A825' }
                  ])
              }
            },
            label: { 
              show: true, 
              position: isHorizontal ? 'right' : 'top', 
              fontSize: Math.max(10, fontSize - 2), 
              formatter: '{c}%',
              fontFamily: 'Noto Sans KR, sans-serif',
              color: '#333'
            },
            barWidth: `${barWidthPercent.value}%`
          }
        ]
      };
    } catch (error) {
      console.error('chartOptions 생성 오류:', error);
      return { title: { text: t('clinicalSymptoms.chart.errorGenerate') || '차트 생성 오류' } };
    }
  });

  return {
    chartOptions,
    generateGradientColors
  };
}


export interface GradientColors {
  lightColor: string;
  darkColor: string;
}

export interface UseChartOptionsReturn {
  chartOptions: ComputedRef<any>;
  generateGradientColors: (baseColor: string) => GradientColors;
}

/**
 * 그라디언트 색상 생성 함수
 * @param {string} baseColor - 기본 색상 (HEX)
 * @returns {GradientColors} { lightColor, darkColor }
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
    if (!rgb) return color;

    const factor = percent / 100;
    const r = Math.min(255, Math.max(0, Math.round(rgb.r + (255 - rgb.r) * factor)));
    const g = Math.min(255, Math.max(0, Math.round(rgb.g + (255 - rgb.g) * factor)));
    const b = Math.min(255, Math.max(0, Math.round(rgb.b + (255 - rgb.b) * factor)));

    return rgb2hex(r, g, b);
  };

  const lightColor = adjustBrightness(baseColor, 30);
  const darkColor = baseColor;

  return { lightColor, darkColor };
}

