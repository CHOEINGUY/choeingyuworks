export default {
  title: '임상증상',
  frequencyTable: {
    title: '임상증상별 빈도',
    copy: '테이블 복사',
    symptom: '증상명',
    count: '환자수(명)',
    percent: '백분율(%)'
  },
  controls: {
    direction: '막대 방향',
    directionVertical: '세로',
    directionHorizontal: '가로',
    directionTooltip: '막대 방향을',
    directionSuffix: '로 변경합니다',
    fontSize: '폰트 크기',
    fontSizePrefix: '폰트 크기를',
    fontSizeSuffix: '로 변경합니다',
    chartWidth: '차트 너비',
    chartWidthPrefix: '차트 너비를',
    chartWidthSuffix: 'px',
    barWidth: '막대 너비',
    barWidthPrefix: '막대 너비를',
    barWidthSuffix: '%',
    highlight: '막대 강조',
    highlightOptions: {
      none: { label: '강조 없음', tooltip: '모든 막대를 같은 색상으로 표시합니다' },
      max: { label: '최대값 강조', tooltip: '가장 큰 값의 막대를 다른 색상으로 강조합니다' },
      min: { label: '최소값 강조', tooltip: '가장 작은 값의 막대를 다른 색상으로 강조합니다' },
      both: { label: '최대/최소값 강조', tooltip: '가장 큰 값과 가장 작은 값의 막대를 강조합니다' }
    },
    sort: '정렬',
    sortOptions: {
      none: { label: '정렬 없음', tooltip: '원본 순서대로 표시합니다' },
      asc: { label: '오름차순', tooltip: '백분율이 낮은 순으로 정렬합니다' },
      desc: { label: '내림차순', tooltip: '백분율이 높은 순으로 정렬합니다' }
    },
    fontSizeLabels: {
      xs: '매우 작게',
      sm: '작게',
      md: '보통',
      lg: '크게',
      xl: '매우 크게'
    },
    color: '막대 색상',
    colorTooltip: '막대 색상을 변경합니다'
  },
  chart: {
    copy: '차트 복사',
    save: '차트 저장',
    distributionTitle: '환자의 임상증상 분포',
    noDataTitle: '임상증상 데이터가 필요합니다',
    noDataSubtext: '데이터 입력 화면에서 증상 관련 열에 데이터를 입력해주세요',
    dataInputPrompt: '📋 증상 데이터 입력 → 차트 자동 생성',
    errorFormat: '데이터 형식 오류',
    errorGenerate: '차트 생성 오류',
    percentSeries: '백분율'
  }
};
