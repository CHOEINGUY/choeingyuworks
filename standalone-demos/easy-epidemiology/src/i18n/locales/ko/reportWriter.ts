export default {
  modal: {
    title: '분석이 필요합니다',
    message: '해당 탭에서 통계 분석을 실행한 후 보고서를 작성할 수 있습니다.',
    confirm: '확인'
  },
  editor: {
    title: '보고서 항목',
    completed: '완료',
    studyDesign: {
      label: '조사 디자인',
      required: '선택 필요',
      selected: '선택됨',
      caseControl: '환자-대조군',
      cohort: '후향적 코호트'
    },
    items: {
      caseAttackRate: '사례 발병률',
      patientAttackRate: '환자 발병률',
      exposureDate: '추정 노출일시',
      firstCaseDate: '최초사례 발생',
      meanIncubation: '평균 잠복기',
      suspectedSource: '추정 감염원',
      foodAnalysis: '식품 섭취력 분석',
      epiCurve: '유행곡선 차트',
      incubationChart: '잠복기 차트',
      symptomsTable: '주요증상 표'
    },
    status: {
      entered: '입력됨',
      pending: '대기',
      designRequired: '디자인 선택필요'
    },
    tooltips: {
      foodLimit: '요인(식단)이 {count}개로 34개를 초과합니다.\n표4 요인별 표분석결과에 데이터가 들어가지 않습니다.',
      designRequired: '조사 디자인을 먼저 선택해주세요.'
    }
  },
  preview: {
    title: '미리보기',
    sections: {
      overview: 'Ⅰ. 발생개요',
      team: 'Ⅱ. 조사반',
      results: 'Ⅳ. 결과',
      incubation: 'Ⅴ. 잠복기'
    },
    download: '보고서 다운로드',
    designRequired: '조사 디자인 선택 필요',
    tooltips: {
      designRequired: '조사 디자인을 먼저 선택해주세요.',
      foodLimit: '요인(식단)이 {count}개로 34개를 초과합니다. 표4 요인별 표분석결과에 데이터가 들어가지 않습니다.',
      foodCount: '요인(식단) {count}개가 포함됩니다.'
    },
    toast: {
      start: '보고서 다운로드를 시작합니다.',
      success: '보고서 파일이 생성되었습니다.',
      error: '보고서 다운로드 중 오류가 발생했습니다.'
    }
  },
  generation: {
    dates: {
      year: '년',
      month: '월',
      day: '일',
      hour: '시',
      minute: '분',
      at: ' ',
      from: ' ',
      to: ' ~ ',
      period: '기간',
      days: ['일', '월', '화', '수', '목', '금', '토']
    },
    placeholders: {
      unknown: '미상',
      none: '없음',
      analyzing: '분석 중...',
      notApplicable: '해당 없음'
    },
    sections: {
      epiCurveTitle: '[그림 1] 유행곡선',
      incubationTitle: '[그림 2] 잠복기 분포',
      symptomsTitle: '[표 3] 주요 증상 현황',
      foodAnalysisTitle: '[표 4] 요인별 표분석 결과'
    },
    descriptions: {
      studyDesignPrefix: '본 조사는 ',
      studyDesignSuffix: '으로 설계되어 수행되었습니다.',
      statisticalMethod: '통계 분석은 Chi-square test 및 Fisher\'s exact test를 사용하였습니다.',
      statisticalMethodYates: 'Yates의 연속성 보정을 적용한 카이제곱검정을 통해',
      statisticalMethodYatesFisher: 'Yates의 연속성 보정을 적용한 카이제곱검정과 피셔의 정확검정을 통해',
      statisticalBase: '통계분석은 전남대학교 의과대학 예방의학교실 및 광주, 전남 감염병관리지원단에서 제공하는 역학조사 자료 전문 분석 프로그램(Easy-Epidemiology Web)을 이용하여 진행되었다.',
      incubationFormat: '최소 {min}, 최대 {max}, 평균 {avg}, 중앙값 {median}으로 나타났습니다.',
      foodIntakeResult: '식품 섭취력에 따른 환례 연관성 분석 결과, {parts}이 통계적으로 유의한 연관성을 보였다.',
      statAnalysisResult: '{metric}(OR/RR) 및 95% 신뢰 구간을 계산하였으며, {methodText} 노출요인과 질병 연관성의 통계적 유의성을 확인하였다.',
      haldaneCorrection: '교차표의 특정 셀 빈도가 0인 경우, {metric} 및 신뢰구간 계산 시 Haldane - Anscombe correction을 적용하였다.',
      incubationExposureSingle: '역학조사 결과, 감염원은 {suspected}으로 추정되었으며, 노출 시점은 {expTxt}으로 추정되었다. 이 시점을 기준으로 증상 발생까지의 평균 잠복기는 {meanH}시간으로, {incubationStats}로 나타났다.',
      incubationExposureRange: '역학조사 결과, 감염원은 {suspected}으로 추정되었으며, 노출 시점은 {startTxt}부터 {endTxt}까지의 범위로 파악되었다. 이 기간 내 노출된 환례의 증상 발생까지의 평균 잠복기는 {meanH}시간이었으며, {incubationStats}로 나타났다.',
      attackRateResult: '조사에 포함된 대상자 {total}명 중 사례 수는 {patientCount}명으로 사례 발병률은 {caseAttackRate}이다. 이 중, 인체 검사 결과 검출된 확진환자 수는 {confirmedCount}명으로 확진환자 발병률은 {confirmedAttackRate}이다.',
      firstCaseSummary: '사례정의에 부합하는 최초 사례는 {firstCaseDateTime}경에 {symptomList} 증상이 발생하였다. 이후 {lastCaseDateTime}까지 총 {patientCount}명의 환례가 있었다.'
    },
    tables: {
      caseControl: {
        headers: ['요인(식단)', '환자군', '대조군', '섭취자', '비섭취자', '합계', '카이제곱', '오즈비', '95% 신뢰구간', '하한', '상한']
      },
      cohort: {
        headers: ['요인(식단)', '섭취자(노출군)', '비섭취자(비노출군)', '대상자수', '환자수', '발병률(%)', '카이제곱', '상대위험비', '95% 신뢰구간', '하한', '상한']
      }
    },
    charts: {
      epiCurvePlaceholder: 'EpidemicCurve 탭에서 "보고서 저장" 버튼을 클릭하여 차트 이미지를 저장한 후 확인하세요.',
      incubationPlaceholder: 'EpidemicCurve 탭에서 잠복기 차트 "보고서 저장" 버튼을 클릭하여 차트 이미지를 저장한 후 확인하세요.'
    },
    filename: '역학조사보고서'
  },
  template: {
    title: '수인성 식품매개 집단발생<br/>역학조사 보고서',
    sections: {
      intro: 'Ⅰ. 발생 개요',
      team: 'Ⅱ. 역학조사반 구성 및 역할',
      design: '3. 조사디자인 선택 및 조사 대상자 선정',
      sample: '3. 채취한 검체 종류 및 검사항목',
      caseDef: '4. 환례 정의',
      action: '5. 현장 조치 사항',
      stat: '6. 통계분석에 사용한 분석기법',
      results: 'Ⅳ. 결과',
      firstCase: '1. 최초 환자 발생일시',
      attackRate: '2. 발병률',
      commonExposure: '3. 공동노출원 조사',
      epiCurve: '4. 유행곡선',
      symptoms: '5. 주요증상',
      foodAnalysis: '6. 식품 섭취력 분석',
      env: '7. 조리, 식자재 공급 환경 조사 결과',
      water: '8. 물 조사 결과',
      incubation: 'Ⅴ. 잠복기 및 노출 시기'
    },
    labels: {
      reportDate: '발생신고 일시',
      exposureDate: '추정위험 노출일시',
      investDate: '현장 역학조사 일시',
      firstCaseDate: '최초사례 발생일시',
      region: '발생지역',
      incubation: '평균잠복기',
      place: '발생장소 또는 기관',
      pathogen: '추정 원인병원체',
      design: '조사디자인',
      source: '추정 감염원',
      attackRate: '사례발병률 (발병규모)',
      endDate: '유행종료 일자',
      patientAttackRate: '환자발병률 (최종확진자 발병규모)',
      labDate: '최종검사결과 통보일',
      omitted: '생략',
      designLabel: '조사디자인',
      symptomTitle: '[표3] 주요증상별 환례수 및 백분율',
      symptomHeader: '증상',
      caseHeader: '환례(N=%patientCount%)',
      countHeader: '환례(명)',
      percentHeader: '%',
      epiCurveCaption: '[그림1] 증상 발생 시점에 따른 유행 곡선',
      incubationCaption: '[그림2] 추정 노출 시점을 기준으로 한 잠복기 분포'
    }
  }
};
