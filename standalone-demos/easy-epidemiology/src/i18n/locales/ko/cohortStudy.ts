export default {
  title: '코호트 연구',
  guide: {
    button: '통계 가이드',
    title: '코호트 연구 통계 가이드',
    subtitle: '상대위험비(RR)와 발병률 분석 이해하기',
    sections: {
      contingencyTable: {
        title: '2x2 분할표 (Contingency Table)',
        description: '코호트 연구는 위험요인 노출 여부에 따른 질병 발생률을 직접 비교하는 연구입니다. 각 집단의 발병률(Incidence)을 계산하여 비교합니다.',
        headers: {
          category: '구분',
          case: '환자 (Case)',
          nonCase: '비환자 (Non-Case)',
          total: '합계'
        },
        rows: {
          exposed: { label: '노출군', sub: 'Exposed' },
          unexposed: { label: '비노출군', sub: 'Unexposed' },
          total: '합계'
        },
        cells: {
          a: '노출+발병',
          b: '노출+미발병',
          c: '비노출+발병',
          d: '비노출+미발병'
        }
      },
      rr: {
        title: '상대위험비 (Relative Risk, RR)',
        formula: {
          incidence: 'Incidence',
          rr: 'RR Formula'
        },
        def: {
          title: '정의',
          desc: '위험요인 노출군에서의 발병률이 비노출군에 비해 몇 배나 높은지를 나타내는 지표입니다.'
        },
        interpretation: {
          title: '결과 해석',
          risk: { label: 'RR > 1', desc: '요인 노출 시 발병 위험 증가 (위험요인)' },
          paramount: { label: 'RR < 1', desc: '요인 노출 시 발병 위험 감소 (방어요인)' },
          null: { label: 'RR = 1', desc: '발병 위험의 차이가 없음' }
        }
      },
      pvalue: {
        title: '유의확률 (P-value)',
        description: '계산된 상대위험비(RR)가 우연에 의해 관찰되었을 확률입니다. 통상적으로 {highlight} 미만일 때 통계적으로 유의하다고 판단합니다.',
        method: {
          title: '검정 방법 선택 기준',
          chiSquare: { label: '카이제곱 검정 (Chi-square)', desc: '두 집단의 발병률 차이를 검정' },
          fisher: { label: '피셔의 정확 검정 (Fisher\'s Exact)', desc: '빈도가 5 미만인 경우 사용' }
        }
      },
      ci: {
        title: '95% 신뢰구간 (95% CI)',
        description: '상대위험비의 참값이 존재할 것으로 확신하는 95% 범위입니다. 신뢰구간이 {includes}가 중요합니다.',
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
    title: '요인별 표 분석 결과(코호트)',
    yatesActive: 'Yates 보정 적용',
    yatesInactive: 'Yates 보정 미적용',
    copyTable: '테이블 복사'
  },
  table: {
    noData: '분석할 데이터가 없거나 Vuex 스토어 연결을 확인하세요.',
    headers: {
      factor: '요인(식단)',
      exposedGroup: '섭취자(노출군)',
      unexposedGroup: '비섭취자(비노출군)',
      pvalue: '카이제곱\nP-value',
      rr: '상대위험비\nRelative Risk',
      ci: '95% 신뢰구간',
      subjects: '대상자수',
      cases: '환자수',
      incidence: '발병률(%)',
      lower: '하한',
      upper: '상한'
    },
    legend: {
      title: '통계 검정 방법 및 표시 기준',
      fisher: '* : Fisher\'s Exact Test (기대빈도 < 5인 셀이 있을 때)',
      chiSquare: '- : Chi-square Test (모든 셀 기대빈도 ≥ 5)',
      yatesChiSquare: '- : Yates\' Corrected Chi-square Test (모든 셀 기대빈도 ≥ 5)',
      na: 'N/A : 계산 불가(셀 값이 0인 경우)',
      correctionNote: '0인 셀이 있는 행에만 모든 셀에 0.5를 더하여 상대위험비 계산 (Haldane-Anscombe 보정)',
      correctionApplied: '† : 0.5 보정 적용'
    },
    tooltips: {
      fisher: 'Fisher의 정확검정 (기대빈도 < 5)',
      yates: 'Yates 보정 카이제곱 검정 (기대빈도 ≥ 5)',
      chiSquare: '일반 카이제곱 검정 (기대빈도 ≥ 5)'
    }
  }
};
