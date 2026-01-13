export default {
  title: '유행곡선 및 잠복기 분석',
  symptomAnalysis: '증상 발현 분석',
  incubationAnalysis: '잠복기 분석',
  suspectedFood: {
    title: '추정 감염원 선택',
    placeholder: '추정 감염원을 선택하거나 직접 입력하세요',
    multiSelectTitle: '추정 감염원 선택 (다중 선택 가능)',
    status: {
      pending: '분석 대기',
      analyzing: '분석 중...',
      completed: '분석 완료',
      caseControlSuccess: '환자-대조군 연구 분석 성공',
      cohortSuccess: '코호트 연구 분석 성공',
      error: '분석 오류'
    },
    tooltip: {
      success: '분석이 성공적으로 완료되었습니다.',
      pending: '분석 대기 중입니다.',
      noData: '분석할 데이터가 없습니다.',
      error: '분석 중 오류가 발생했습니다.',
      checking: '분석 상태 확인 중...'
    }
  },
  contextMenu: {
    copy: '테이블 복사'
  },
  symptomTable: {
    title: '증상 발현 시간별 환자 수',
    time: '증상 발현 시간',
    count: '수',
    guide: {
      title: '증상 발현 시간 필요',
      desc: '유행곡선 생성을 위한 필수 정보입니다.',
      step1: '증상발현시간 입력',
      step2: '최소 2명 이상 데이터',
      step3: '형식: YYYY-MM-DD HH:MM'
    },
    summary: {
      title: '발생 요약 정보',
      first: '최초 발생일시 :',
      last: '최종 발생일시 :'
    }
  },
  controls: {
    intervalLabel: '증상발현 시간간격 :',
    intervalTooltip: '증상 발현 시간 간격을 변경합니다',
    confirmedLine: '확진자 꺾은선:',
    show: '표시',
    hide: '숨김',
    confirmedTooltip: '확진자 꺾은선 표시/숨김',
    fontSize: '글자 크기',
    fontSizeTooltip: '차트의 전체 글자 크기를 변경합니다',
    chartWidth: '차트 너비',
    chartWidthTooltip: '차트의 전체 너비를 조절합니다',
    chartDisplay: '표시 기준',
    color: '막대 색상',
    colorTooltip: '막대 색상을 변경합니다',
    countUnit: '명'
  },
  displayMode: {
    hour: '시 단위',
    hourTooltip: '간단한 시 단위 표시',
    datetime: '날짜+시간',
    datetimeTooltip: '정확한 날짜와 시간 표시',
    incubationHour: '시간 단위',
    incubationHourTooltip: '시간 단위로 표시합니다',
    incubationHHMM: '시:분 단위',
    incubationHHMMTooltip: '상세 시간을 표시합니다'
  },
  exposure: {
    title: '의심원 노출시간 설정',
    placeholder: '의심원 노출시간을 설정하세요 (YYYY-MM-DD HH:MM)',
    tooltip: '기준 의심원 노출일을 설정합니다.'
  },
  incubationTable: {
    title: '예상 잠복 기간별 환자 수',
    interval: '예상 잠복 기간',
    count: '수',
    guide: {
      title: '노출시간 설정 필요',
      desc: '잠복기 분석의 기준이 됩니다.',
      step1: '상단 입력란 클릭',
      step2: '기준 노출시간 설정',
      step3: '설정 시 자동 분석',
      noExposureTitle: '의심원 노출시간 설정',
      noExposureDesc: '잠복기 분석을 위해 의심원 노출시간을 설정해주세요.'
    },
    summary: {
      title: '잠복기 요약 정보',
      min: '최소 잠복기 :',
      max: '최대 잠복기 :',
      avg: '평균 잠복기 :',
      median: '중앙 잠복기 :'
    }
  },
  incubationControls: {
    intervalLabel: '계급 간격(시간) :',
    intervalTooltip: '잠복기 계산 간격을 변경합니다'
  },
  warning: {
    title: '증상발현시간을 노출시간 이후로 바꿔주세요',
    desc: '잠복기는 \'노출 이후\' 경과시간으로 계산됩니다. 현재는 모두 노출 이전으로 입력되어 계산할 수 없습니다.',
    step1: '현재 노출시간: {time}',
    step2: '상단 의심원 노출시간 입력란을 클릭해 올바른 기준시간으로 다시 설정합니다',
    step3: '또는 데이터 입력 화면에서 각 환자의 증상발현시간을 노출시간 이후로 수정합니다'
  },
  charts: {
    epidemicCurve: '유행 곡선',
    incubationPeriod: '잠복기 분포'
  }
};
