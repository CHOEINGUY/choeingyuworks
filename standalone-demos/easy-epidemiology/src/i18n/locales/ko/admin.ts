export default {
  dashboard: {
    title: '관리자 대시보드',
    subtitle: '사용자 관리 및 시스템 모니터링'
  },
  stats: {
    totalUsers: '전체 사용자',
    pendingUsers: '승인 대기',
    approvedUsers: '최종 승인',
    adminUsers: '시스템 관리자'
  },
  tabs: {
    pending: '승인 대기',
    allUsers: '전체 사용자',
    settings: '시스템 설정'
  },
  emptyState: {
    title: '승인 대기 중인 사용자가 없습니다',
    description: '모든 신규 가입 요청이 처리되었습니다.'
  },
  loading: {
    title: '데이터 동기화 중...',
    subtitle: '잠시만 기다려 주세요.'
  },
  userNotFound: {
    title: '사용자를 찾을 수 없습니다',
    description: '검색 조건과 일치하는 사용자가 없습니다.'
  },
  role: {
    admin: '시스템 관리자',
    user: '일반 사용자',
    support: '기술 지원 팀',
    pending: '승인 대기'
  },
  status: {
    approved: '승인됨',
    pending: '대기 중',
    rejected: '거절됨',
    suspended: '정지됨'
  },
  actions: {
    approve: '승인',
    reject: '거절',
    delete: '삭제',
    edit: '수정'
  },
  table: {
    name: '성명',
    email: '이메일',
    role: '권한',
    status: '상태',
    actions: '관리',
    noName: '이름 없음',
    id: 'ID'
  },
  settings: {
    title: '사이트 설정 관리',
    subtitle: '홈페이지의 정보를 동적으로 관리할 수 있습니다.',
    tabs: {
      basic: '기본 정보',
      organization: '조직 정보',
      features: '기능 및 시스템 특징',
      contact: '연락처 및 지원'
    },
    organization: {
      title: '조직 정보',
      institution: '기관명',
      department: '부서',
      center: '센터명',
      team: {
        title: '팀원 정보',
        role: '역할',
        name: '이름',
        add: '팀원 추가하기'
      }
    },
    features: {
      title: '기능 카드',
      systemTitle: '시스템 특징',
      icon: '아이콘',
      featureTitle: '제목',
      description: '설명',
      placeholderEmoji: '이모지',
      placeholderTitle: '기능 제목',
      placeholderDesc: '기능에 대한 상세 설명을 입력하세요',
      addFeature: '새 기능 카드 추가하기',
      addSystem: '시스템 특징 추가'
    },
    actions: {
      reset: '기본값으로 복원',
      save: '모든 설정 저장하기'
    }
  },
  toolbar: {
    filter: {
      affiliationType: '소속 유형',
      affiliation: '소속',
      today: '오늘',
      todayTooltip: '오늘 가입자만 보기'
    },
    search: {
      placeholder: '이름, 소속, 전화번호 등 검색',
      clear: '검색어 지우기'
    },
    bulkApprove: {
      label: '일괄 승인',
      tooltip: '선택된 {count}명 승인',
      tooltipEmpty: '승인할 사용자를 선택하세요'
    },

    affiliationTypes: {
      hospital: '병원',
      clinic: '의원',
      public_health: '보건소',
      university: '대학교',
      research: '연구기관',
      government: '정부기관',
      other: '기타'
    }
  },
  messages: {
    systemNotice: '시스템 알림',
    systemWarning: '시스템 경고',
    pendingRefreshed: '승인 대기 목록이 갱신되었습니다.',
    allRefreshed: '전체 사용자 목록이 갱신되었습니다.',
    todayOnly: '오늘 가입한 사용자만 표시합니다.',
    showAll: '모든 사용자를 표시합니다.',
    approved: '사용자가 승인되었습니다.',
    confirmReject: '이 사용자의 가입을 거절하시겠습니까?',
    rejected: '사용자 가입이 거절되었습니다.',
    confirmDelete: '이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    deleted: '사용자가 삭제되었습니다.',
    roleChanged: '사용자 권한이 변경되었습니다.',
    confirmBulkApprove: '선택한 {count}명의 사용자를 일괄 승인하시겠습니까?',
    bulkApproved: '{count}명의 사용자가 승인되었습니다.',
    confirmLogout: '로그아웃 하시겠습니까?',
    settingsSaved: '설정이 저장되었습니다.',
    settingsSaveFailed: '설정 저장 실패: {error}',
    confirmReset: '모든 설정을 기본값으로 초기화하시겠습니까?',
    settingsReset: '설정이 초기화되었습니다.',
    settingsResetFailed: '설정 초기화 실패: {error}'
  }
};

