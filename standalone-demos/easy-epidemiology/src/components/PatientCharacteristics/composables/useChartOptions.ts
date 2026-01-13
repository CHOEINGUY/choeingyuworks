import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import type { FrequencyData } from './usePatientStats';

// Color generation helper
export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface GradientColors {
  lightColor: string;
  darkColor: string;
}

export interface ChartOptions {
  chartFontSize: number;
  barWidthPercent: number;
  selectedBarColor: string;
  currentHighlight: 'none' | 'max' | 'min' | 'both';
  getMappedLabel: (label: string) => string;
  t: (key: string) => string;
}

export function generateGradientColors(baseColor: string): GradientColors {
  const hex2rgb = (hex: string): RGB | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  const rgb2hex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };
  
  const adjustBrightness = (color: string, percent: number): string => {
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

// Total Chart Options
export function generateTotalChartOptions(
  header: string, 
  data: FrequencyData, 
  dataType: 'count' | 'percentage', 
  options: ChartOptions
): any {
  const { 
    chartFontSize, 
    barWidthPercent, 
    selectedBarColor, 
    currentHighlight, 
    getMappedLabel,
    t
  } = options;

  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return {};
  }

  const originalCategories = Object.keys(data);
  const totalCounts = originalCategories.map((key) => (data[key] ? data[key].count : 0));
  const totalPercentages = originalCategories.map((key) => (data[key] ? data[key].totalPercentage || 0 : 0));
  
  const chartData = dataType === 'percentage' ? totalPercentages : totalCounts;

  // Highlight logic
  const maxValue = Math.max(...chartData);
  const minValue = Math.min(...chartData);
  const maxIndices = chartData.map((value, index) => value === maxValue ? index : -1).filter(i => i !== -1);
  const minIndices = chartData.map((value, index) => value === minValue ? index : -1).filter(i => i !== -1);

  const getBarColor = (index: number): string => {
    let baseColor = selectedBarColor;
    
    if (currentHighlight !== 'none') {
      const isMax = maxIndices.includes(index);
      const isMin = minIndices.includes(index);
      
      if (currentHighlight === 'max' && isMax) {
        baseColor = '#ff6b6b';
      } else if (currentHighlight === 'min' && isMin) {
        baseColor = '#4ecdc4';
      } else if (currentHighlight === 'both') {
        if (isMax) baseColor = '#ff6b6b';
        else if (isMin) baseColor = '#4ecdc4';
      }
    }
    
    return baseColor;
  };

  return {
    textStyle: {
      fontFamily: 'Noto Sans KR, sans-serif'
    },
    title: { 
      text: t('patientChars.chartControl.totalDistributionTitle')?.replace('{header}', header || t('patientChars.frequencyTable.none')) || `전체 대상자 ${header || '(알 수 없음)'} 분포`, 
      left: 'center', 
      textStyle: { 
        fontSize: chartFontSize, 
        fontFamily: 'Noto Sans KR, sans-serif' 
      }
    },
    tooltip: {
      trigger: 'axis', 
      axisPointer: { type: 'shadow' },
      formatter: (params: unknown) => {
        const paramsArray = Array.isArray(params) ? params : [params];
        if (paramsArray.length === 0) return '';
        
        const param = paramsArray[0] as any;
        const dataIndex = param.dataIndex;
        const originalCategory = originalCategories[dataIndex];
        const displayLabel = getMappedLabel(originalCategory);
        const categoryData = data[originalCategory];

        if (!categoryData) return '';
        
        const value = param.value;
        const seriesName = param.seriesName;

        let tooltipText = `<strong>${displayLabel}</strong><br/>`;

        if (dataType === 'percentage') {
          tooltipText += `${seriesName}: <strong>${value}</strong>%`;
          if (categoryData.count !== undefined) {
            tooltipText += ` (${categoryData.count}명)`;
          }
        } else {
          tooltipText += `${seriesName}: <strong>${value}</strong>명`;
          if (categoryData.totalPercentage !== undefined) {
            tooltipText += ` (${categoryData.totalPercentage.toFixed(1)}%)`;
          }
        }
        return tooltipText;
      }
    },
    legend: { 
      data: [{
        name: dataType === 'percentage' ? (t('patientChars.frequencyTable.participantsRatio') || '대상자 비율') : (t('patientChars.frequencyTable.participantsCount') || '대상자 수'),
        icon: 'rect',
        itemStyle: {
          color: selectedBarColor
        }
      }], 
      top: 'bottom', 
      selectedMode: false, 
      textStyle: { 
        fontSize: chartFontSize,
        fontFamily: 'Noto Sans KR, sans-serif'
      }
    },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: originalCategories.map(cat => getMappedLabel(cat)),
      axisLabel: {
        interval: 0, 
        rotate: originalCategories.length > 10 ? 30 : 0,
        fontSize: chartFontSize, 
        hideOverlap: true,
        fontFamily: 'Noto Sans KR, sans-serif'
      }
    },
    yAxis: { 
      type: 'value', 
      axisLabel: { 
        fontSize: chartFontSize,
        fontFamily: 'Noto Sans KR, sans-serif'
      }
    },
    series: [{
      name: dataType === 'percentage' ? (t('patientChars.frequencyTable.participantsRatio') || '대상자 비율') : (t('patientChars.frequencyTable.participantsCount') || '대상자 수'), 
      type: 'bar', 
      data: chartData,
      itemStyle: { 
        color: (params: unknown) => {
          const p = params as { dataIndex: number };
          const baseColor = getBarColor(p.dataIndex);
          const colors = generateGradientColors(baseColor);
          return new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors.lightColor }, 
            { offset: 1, color: colors.darkColor }
          ]);
        }
      },
      barWidth: `${barWidthPercent}%`,
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
        show: chartData.length < 15, 
        position: 'top',
        fontSize: Math.max(10, chartFontSize - 4), 
        color: '#333',
        fontFamily: 'Noto Sans KR, sans-serif',
        formatter: (params: unknown) => {
          const p = params as { dataIndex: number };
          const dataIndex = p.dataIndex;
          const count = totalCounts[dataIndex];
          const percentage = totalPercentages[dataIndex].toFixed(1);
          if (dataType === 'percentage') {
            return `${percentage}% (${count})`;
          }
          return `${count} (${percentage}%)`;
        }
      }
    }]
  };
}

// Patient Chart Options
export function generatePatientChartOptions(
  header: string, 
  data: FrequencyData, 
  dataType: 'count' | 'percentage', 
  options: ChartOptions
): any {
  const { 
    chartFontSize, 
    barWidthPercent, 
    selectedBarColor, 
    currentHighlight, 
    getMappedLabel,
    t
  } = options;

  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return {};
  }

  const allOriginalCategories = Object.keys(data);
  const patientCounts = allOriginalCategories.map((key) => (data[key] ? data[key].patientCount : 0));
  const patientPercentages = allOriginalCategories.map((key) => (data[key] ? data[key].patientPercentage || 0 : 0));

  const filteredOriginalCategories: string[] = [];
  const filteredPatientCounts: number[] = [];
  const filteredPatientPercentages: number[] = [];
  const filteredDataMap: FrequencyData = {};

  allOriginalCategories.forEach((cat, index) => {
    if (patientCounts[index] > 0) {
      filteredOriginalCategories.push(cat);
      filteredPatientCounts.push(patientCounts[index]);
      filteredPatientPercentages.push(patientPercentages[index]);
      if (data[cat]) { filteredDataMap[cat] = data[cat]; }
    }
  });

  const chartData = dataType === 'percentage' ? filteredPatientPercentages : filteredPatientCounts;

  if (filteredOriginalCategories.length === 0) {
    return {};
  }

  // Highlight logic
  const maxValue = Math.max(...chartData);
  const minValue = Math.min(...chartData);
  const maxIndices = chartData.map((value, index) => value === maxValue ? index : -1).filter(i => i !== -1);
  const minIndices = chartData.map((value, index) => value === minValue ? index : -1).filter(i => i !== -1);

  const getPatientBarColor = (index: number): string => {
    let baseColor = selectedBarColor;
    
    if (currentHighlight !== 'none') {
      const isMax = maxIndices.includes(index);
      const isMin = minIndices.includes(index);
      
      if (currentHighlight === 'max' && isMax) {
        baseColor = '#ff6b6b';
      } else if (currentHighlight === 'min' && isMin) {
        baseColor = '#4ecdc4';
      } else if (currentHighlight === 'both') {
        if (isMax) baseColor = '#ff6b6b';
        else if (isMin) baseColor = '#4ecdc4';
      }
    }
    
    return baseColor;
  };

  return {
    textStyle: {
      fontFamily: 'Noto Sans KR, sans-serif'
    },
    title: { 
      text: t('patientChars.chartControl.patientDistributionTitle')?.replace('{header}', header || t('patientChars.frequencyTable.none')) || `환자 ${header || '(알 수 없음)'} 분포`, 
      left: 'center', 
      textStyle: { 
        fontSize: chartFontSize, 
        fontFamily: 'Noto Sans KR, sans-serif' 
      }
    },
    tooltip: {
      trigger: 'axis', 
      axisPointer: { type: 'shadow' },
      formatter: (params: unknown) => {
        const paramsArray = Array.isArray(params) ? params : [params];
        if (paramsArray.length === 0) return '';
        
        const param = paramsArray[0] as any;
        const dataIndex = param.dataIndex;
        const originalCategory = filteredOriginalCategories[dataIndex];
        const displayLabel = getMappedLabel(originalCategory);
        const categoryData = filteredDataMap[originalCategory];

        if (!categoryData) return '';
        
        const value = param.value;
        const seriesName = param.seriesName;

        let tooltipText = `<strong>${displayLabel}</strong><br/>`;

        if (dataType === 'percentage') {
          tooltipText += `${seriesName}: <strong>${value}</strong>%`;
          if (categoryData.patientCount !== undefined) {
            tooltipText += ` (${categoryData.patientCount}명)`;
          }
        } else {
          tooltipText += `${seriesName}: <strong>${value}</strong>명`;
          if (categoryData.patientPercentage !== undefined) {
            tooltipText += ` (${categoryData.patientPercentage.toFixed(1)}%)`;
          }
        }
        return tooltipText;
      }
    },
    legend: { 
      data: [{
        name: dataType === 'percentage' ? (t('patientChars.frequencyTable.patientsRatio') || '환자 비율') : (t('patientChars.frequencyTable.patientsCount') || '환자 수'),
        icon: 'rect',
        itemStyle: {
          color: selectedBarColor
        }
      }], 
      top: 'bottom', 
      selectedMode: false, 
      textStyle: { 
        fontSize: chartFontSize,
        fontFamily: 'Noto Sans KR, sans-serif'
      }
    },
    grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: filteredOriginalCategories.map(cat => getMappedLabel(cat)),
      axisLabel: {
        interval: 0, 
        rotate: filteredOriginalCategories.length > 10 ? 30 : 0,
        fontSize: chartFontSize, 
        hideOverlap: true,
        fontFamily: 'Noto Sans KR, sans-serif'
      }
    },
    yAxis: { 
      type: 'value', 
      axisLabel: { 
        fontSize: chartFontSize,
        fontFamily: 'Noto Sans KR, sans-serif'
      }
    },
    series: [{
      name: dataType === 'percentage' ? (t('patientChars.frequencyTable.patientsRatio') || '환자 비율') : (t('patientChars.frequencyTable.patientsCount') || '환자 수'), 
      type: 'bar', 
      data: chartData,
      itemStyle: { 
        color: (params: unknown) => {
          const p = params as { dataIndex: number };
          const baseColor = getPatientBarColor(p.dataIndex);
          const colors = generateGradientColors(baseColor);
          return new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors.lightColor }, 
            { offset: 1, color: colors.darkColor }
          ]);
        }
      },
      barWidth: `${barWidthPercent}%`,
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
        show: chartData.length < 15, 
        position: 'top',
        fontSize: Math.max(10, chartFontSize - 4), 
        color: '#333',
        fontFamily: 'Noto Sans KR, sans-serif',
        formatter: (params: unknown) => {
          const p = params as { dataIndex: number };
          const dataIndex = p.dataIndex;
          const count = filteredPatientCounts[dataIndex];
          const percentage = filteredPatientPercentages[dataIndex].toFixed(1);
          if (dataType === 'percentage') {
            return `${percentage}% (${count})`;
          }
          return `${count} (${percentage}%)`;
        }
      }
    }]
  };
}

export function useChartOptions() {
  return {
    generateGradientColors,
    generateTotalChartOptions,
    generatePatientChartOptions
  };
}
