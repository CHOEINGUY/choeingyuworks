export default {
  title: '환자대조군 연구',
  guide: {
    button: '통계 가이드',
    title: '통계 분석 가이드',
    subtitle: '환자-대조군 연구의 핵심 통계 지표 이해하기',
    sections: {
      contingencyTable: {
        title: '2x2 분할표 (Contingency Table)',
        description: '환자-대조군 연구는 특정 요인에 노출된 집단과 비노출된 집단 간의 질병 발생 여부를 비교하는 연구입니다. 데이터는 아래와 같은 2x2 표로 정리되어 분석됩니다.',
        headers: {
          category: '구분',
          case: '환자군 (Case)',
          control: '대조군 (Control)',
          total: '합계'
        },
        rows: {
          exposed: { label: '노출 (Yes)', sub: '위험요인 O' },
          unexposed: { label: '비노출 (No)', sub: '위험요인 X' },
          total: '합계'
        },
        cells: {
          a: '환자+노출',
          b: '대조+노출',
          c: '환자+비노출',
          d: '대조+비노출'
        }
      },
      or: {
        title: '교차비 (Odds Ratio)',
        formula: {
          label: 'Formula',
          content: 'OR = ( a × d ) / ( b × c )'
        },
        def: {
          title: '정의',
          desc: '환자군이 대조군보다 위험요인에 노출되었을 가능성이(Odds) 몇 배 더 높은지 나타내는 지표입니다.'
        },
        interpretation: {
          title: '결과 해석',
          risk: { label: 'OR > 1', desc: '질병의 위험 요인' },
          protective: { label: 'OR < 1', desc: '질병의 방어 요인' },
          null: { label: 'OR = 1', desc: '연관성 없음' }
        }
      },
      pvalue: {
        title: '유의확률 (P-value)',
        description: '구해진 교차비(OR)가 우연히 나왔을 확률을 의미합니다. 통상적으로 {highlight} 미만일 때 통계적으로 유의하다고 판단합니다.',
        method: {
          title: '검정 방법 선택 기준',
          chiSquare: { label: '카이제곱 검정 (Chi-square)', desc: '관측 빈도가 충분할 때 사용' },
          fisher: { label: '피셔의 정확 검정 (Fisher\'s Exact)', desc: '빈도가 5 미만인 셀이 있을 때 사용' },
          yates: { label: 'Yates\' Continuity Correction', desc: '보정 옵션 활성화 시 적용' }
        }
      },
      ci: {
        title: '95% 신뢰구간 (95% CI)',
        description: '오즈비의 참값이 존재할 것으로 확신하는 범위입니다. 신뢰구간이 {includes}가 통계적 유의성 판단의 핵심입니다.',
        includesOne: '1을 포함하는지 여부',
        significant: {
          label: '통계적 유의성 있음',
          desc: '구간이 1을 포함하지 않음'
        },
        notSignificant: {
          label: '통계적 유의성 없음',
          desc: '구간이 1을 포함함'
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
    title: '요인별 표 분석 결과',
    filterActive: '(오즈비 ≥ {threshold}.0 필터 적용)',
    orFilter: 'OR ≥',
    yatesActive: 'Yates 보정 적용',
    yatesInactive: 'Yates 보정 미적용',
    copyTable: '테이블 복사'
  },
  table: {
    noDataFilter: '오즈비 {threshold}.0 이상인 데이터가 없습니다.',
    noData: '분석할 데이터가 없거나 Vuex 스토어 연결을 확인하세요.',
    headers: {
      factor: '요인(식단)',
      caseGroup: '환자군',
      controlGroup: '대조군',
      pvalue: '카이제곱\nP-value',
      oddsRatio: '오즈비\n(Odds Ratio)',
      ci: '95% 신뢰구간',
      exposed: '섭취자',
      unexposed: '비섭취자',
      total: '합계',
      lower: '하한',
      upper: '상한'
    },
    legend: {
      title: '통계 검정 방법 및 표시 기준',
      fisher: '* : Fisher\'s Exact Test (기대빈도 < 5인 셀이 있을 때)',
      chiSquare: '- : Chi-square Test (모든 셀 기대빈도 ≥ 5)',
      yatesChiSquare: '- : Yates\' Corrected Chi-square Test (모든 셀 기대빈도 ≥ 5)',
      na: 'N/A : 계산 불가(셀 값이 0인 경우)',
      correctionNote: '0인 셀이 있는 행에만 모든 셀에 0.5를 더하여 오즈비 계산 (Haldane-Anscombe 보정)',
      correctionApplied: '† : 0.5 보정 적용'
    },
    tooltips: {
      fisher: 'Fisher의 정확검정 (기대빈도 < 5)',
      yates: 'Yates 보정 카이제곱 검정 (기대빈도 ≥ 5)',
      chiSquare: '일반 카이제곱 검정 (기대빈도 ≥ 5)'
    }
  }
};
