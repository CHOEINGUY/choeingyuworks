export default {
  hero: {
    title: 'Easy-Epidemiology Web v2.0',
    subtitle: '감염병 역학조사 전문 플랫폼',
    description: '집단발생 사례 분석과 역학조사를 위한 통합 웹 기반 분석 솔루션',
    startBtn: '지금 시작하기',
    manualBtn: '사용자 매뉴얼 보기'
  },
  features: {
    mainTitle: '강력한 분석 도구',
    subTitle: '역학조사의 모든 단계를 위한 전문적인 솔루션',
    f1: { title: '데이터 입력 & 검증', desc: 'Web Worker 기반 비동기 처리와 가상 스크롤 기술로 대용량 데이터를 지연 없이 입력하며 실시간 유효성 검증 수행' },
    f2: { title: '대상자 특성 분석', desc: '변수별 빈도분포와 발병률(AR) 자동 계산, 라벨 매핑 시스템을 통한 직관적인 범주 처리 및 동적 시각화' },
    f3: { title: '임상증상 분석', desc: 'ECharts 기반의 고성능 인터랙티브 차트, 다중 정렬 알고리즘과 실시간 필터링을 통한 증상 패턴 정밀 분석' },
    f4: { title: '유행곡선 & 잠복기', desc: '잠복기 통계량(최소/최대/평균/중앙값) 자동 산출 및 노출일자 추정을 위한 역학적 곡선 시각화' },
    f5: { title: '환자대조군 연구', desc: 'Fisher 정확검정(기대빈도<5), Yates 연속성 보정 자동 적용 및 Log-scale 변환을 통한 OR 95% 신뢰구간 정밀 산출' },
    f6: { title: '코호트 연구', desc: '상대위험도(RR) 및 발병률(Incidence Rate) 산출, 0셀 발생 시 Haldane 보정(0.5)을 적용한 로버스트한 통계 분석' }
  },
  system: {
    title: '시스템 특징',
    status: {
      label: '시스템 상태',
      operational: '정상 운영',
      version: '버전',
      lastUpdate: '최근 업데이트',
      lastUpdateDate: '2026년 1월 11일',
      platform: '플랫폼',
      platformValue: '웹 기반 (크로스 플랫폼)'
    },
    features: [
      '가상 스크롤 & Web Worker 기반 대용량 처리',
      '입력 데이터 실시간 유효성 검증 (Debounced)',
      'jStat 라이브러리 활용 정밀 통계분석',
      '교차분석: Fisher 정확검정 / Yates 보정 자동 선택',
      '구간추정: Log-scale 변환 95% 신뢰구간 (CI)',
      '보고서 자동 생성 및 실시간 미리보기',
      'ECharts 기반 고성능 데이터 시각화',
      '반응형 웹 디자인 (PC/Tablet 지원)'
    ],
    org: '운영 기관',
    edu: '교육과정 연계',
    deptName: '전남대학교 의과대학',
    centerName: '예방의학교실',
    subCenterName: '감염병 역학조사 및 현장 대응 연구센터',
    members: {
      role1: '통계 검증 및 자문 (전문의)',
      name1: '양정호',
      role2: '총괄 시스템 개발 및 설계',
      name2: '최인규'
    },
    education: {
      items: {
        edu1: { title: '2025년 광주전남 감염병 대응 실무자 교육', subtitle: 'FETP-F (Field Epidemiology Training Program)' },
        edu2: { title: '질병관리청 역학조사 표준교육과정', subtitle: '연계 실습도구' }
      }
    }
  },
  contact: {
    title: '운영 기관',
    center: '감염병 역학조사 및 현장 대응 연구센터',
    operate: '운영',
    dept: '부서',
    techSupport: '기술 지원',
    emailSupport: '이메일 문의',
    names: {
      yang: '양정호',
      choi: '최인규'
    },
    roles: {
      chief: '책임',
      researcher: '연구원'
    }
  },
  target: {
    title: '활용 대상',
    users: {
      gov: '질병관리청 / 시·도 보건당국',
      local: '시·군·구 감염병 대응팀 / 보건소',
      expert: '역학조사관 / FETP 교육생',
      research: '대학 연구기관 / 역학조사 실무진'
    }
  },
  quickGuide: {
    title: '분석 프로세스',
    subtitle: '데이터 입력부터 보고서 작성까지, 원스톱 워크플로우',
    steps: {
      s1: { title: '데이터 입력', desc: '조사대상자 기본정보 및 임상증상 데이터 입력' },
      s2: { title: '특성 분석', desc: '대상자 특성별 분포 분석 및 시각화' },
      s3: { title: '패턴 분석', desc: '유행곡선 생성 및 시간대별 발병 패턴 파악' },
      s4: { title: '통계 분석', desc: '환자대조군/코호트 연구 통계분석 수행' },
      s5: { title: '결과 활용', desc: '분석 결과 내보내기 및 보고서 작성' }
    }
  }
};
