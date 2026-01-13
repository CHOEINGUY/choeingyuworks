export default {
  title: '대상자 특성 분포',
  guide: {
    title: '분석할 변수를 선택해주세요',
    description: '위의 변수 선택 버튼 중 하나를 클릭하여 차트로 분석할 특성을 선택하세요.',
    step1: '분석하고 싶은 변수 버튼을 클릭하세요',
    step2: '선택한 변수의 분포 차트가 자동으로 생성됩니다',
    step3: 'Click "Execute Analysis" button'
  },
  summary: {
    totalParticipants: '조사 대상자 수',
    totalPatients: '총 환자 수',
    attackRate: '발병률',
    confirmedRate: '확진율',
    unitPerson: '명',
    attackRateTooltip: '발병률 = (환자여부에 1을 입력한 사람 수 ÷ 전체 조사 대상자 수) × 100',
    confirmedRateTooltip: '확진율 = (확진여부에 1을 입력한 사람 수 ÷ 전체 조사 대상자 수) × 100'
  },
  frequencyTable: {
    copyTable: '테이블 복사',
    category: '구분',
    participantsCount: '대상자 수',
    participantsRatio: '대상자 비율',
    patientsCount: '환자 수',
    patientsRatio: '환자 비율',
    none: '(없음)'
  },
  labelMapping: {
    title: '라벨 매핑',
    placeholder: '차트에 표시될 새 라벨',
    noCategories: '매핑할 카테고리가 없습니다.'
  },
  chartControl: {
    target: '차트 대상:',
    total: '전체 대상자',
    totalTooltip: '차트 표시 대상을 전체 대상자로 변경합니다',
    patient: '환자',
    patientTooltip: '차트 표시 대상을 환자로 변경합니다',
    dataType: '데이터 유형:',
    dataCount: '수',
    dataCountTooltip: '데이터를 개수(명)으로 표시합니다',
    dataPercent: '비율(%)',
    dataPercentTooltip: '데이터를 비율(%)로 표시합니다',
    fontSize: '폰트 크기:',
    sizeVerySmall: '매우 작게',
    sizeSmall: '작게',
    sizeNormal: '보통',
    sizeLarge: '크게',
    sizeVeryLarge: '매우 크게',
    sizeTooltipPrefix: '폰트 크기를',
    sizeTooltipSuffix: '로 변경합니다',
    chartWidth: '차트 너비:',
    widthTooltipPrefix: '차트 너비를',
    barWidth: '막대 너비:',
    barWidthTooltipPrefix: '막대 너비를',
    highlight: '막대 강조:',
    highlightNone: '강조 없음',
    highlightNoneTooltip: '모든 막대를 같은 색상으로 표시합니다',
    highlightMax: '최대값 강조',
    highlightMaxTooltip: '가장 큰 값의 막대를 다른 색상으로 강조합니다',
    highlightMin: '최소값 강조',
    highlightMinTooltip: '가장 작은 값의 막대를 다른 색상으로 강조합니다',
    highlightBoth: '최대/최소값 강조',
    highlightBothTooltip: '가장 큰 값과 가장 작은 값의 막대를 강조합니다',
    totalDistributionTitle: '전체 대상자 {header} 분포',
    patientDistributionTitle: '환자 {header} 분포',
    barColor: '막대 색상:',
    barColorTooltip: '막대 색상을 변경합니다'
  },
  chart: {
    type: '차트 유형',
    bar: '막대',
    pie: '원형',
    line: '선형',
    copy: '차트 복사',
    save: '차트 저장'
  }
};
