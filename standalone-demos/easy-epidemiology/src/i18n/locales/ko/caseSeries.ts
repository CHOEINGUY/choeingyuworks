export default {
  title: '사례군 조사',
  guide: {
    button: '통계 가이드',
    title: '사례군 조사 통계 가이드',
    subtitle: '환자군 특성 및 폭로율(Exposure Rate) 분석',
    sections: {
      overview: {
        title: '분석 개요 (Overview)',
        description: '사례군 조사는 대조군 없이 {cases}을 분석하는 기술 역학 연구입니다. 특정 병원체가 확인된 환자들 중에서 각 위험요인(음식 등)에 노출된 비율을 확인하여, 공통된 노출 요인을 추정합니다.',
        cases: '환자(Case)들만의 특성'
      },
      exposureRate: {
        title: '주요 지표: 폭로율 (Exposure Rate)',
        formula: {
          rate: 'Exposure Rate',
          exposed: 'Exposed Cases',
          total: 'Total Cases'
        },
        description: '환자 중에서 해당 요인에 노출된 사람의 비율',
        interpretation: {
          high: {
            label: '높은 폭로율의 의미:',
            desc: '대부분의 환자가 해당 음식을 섭취했다면, 그 음식이 감염원일 가능성이 있음을 시사합니다.'
          },
          limit: {
            label: '해석의 한계:',
            desc: '대조군(Control)과의 비교가 없으므로, 통계적인 연관성(Odds Ratio, P-value)을 산출할 수 없으며 인과관계를 확증하기 어렵습니다.'
          }
        }
      },
      ok: '확인'
    }
  },
  controls: {
    fontSize: '폰트 크기',
    fontSizeTooltip: '폰트 크기를 {size}로 변경합니다',
    totalCount: '총 {count}명의 데이터 분석',
    small: '작게',
    medium: '보통',
    large: '크게'
  },
  toolbar: {
    title: '요인별 사례군 분석 결과',
    copyTable: '테이블 복사'
  },
  table: {
    noData: '분석할 데이터가 없거나 Vuex 스토어 연결을 확인하세요.',
    headers: {
      factor: '요인(식단)',
      caseGroup: '환자군',
      exposed: '섭취자',
      unexposed: '비섭취자',
      total: '합계',
      incidence: '발병률(%)'
    },
    legend: {
      title: '통계 검정 방법 및 표시 기준',
      na: 'N/A : 계산 불가(셀 값이 0인 경우)',
      incidenceRate: '발병률(%) : 사례군 내 해당 요인 노출자 비율'
    }
  }
};
