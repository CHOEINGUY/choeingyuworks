export default {
  title: '로그인',
  registerTitle: '회원가입',
  logoutConfirmTitle: '로그아웃',
  logoutConfirmMessage: '정말로 로그아웃하시겠습니까?{br}진행 중인 모든 작업은 안전하게 저장됩니다.',
  savedTitle: '저장 완료!',
  savedMessage: '모든 데이터가 안전하게 저장되었습니다.{br}잠시 후 로그인 화면으로 이동합니다.',
  goToLoginNow: '지금 이동',
  btnLogin: '로그인',
  btnRegister: '회원가입',
  hero: {
    subtitle: '신속하고 정확한 역학조사를 위한{br}전문 데이터 분석 솔루션',
    feature1: '직관적인 데이터 입력',
    feature2: '자동화된 유행곡선 분석',
    feature3: 'OR/RR 통계 분석',
    guestAccess: '로그인 없이 기능 둘러보기'
  },
  login: {
    demoNoticeTitle: '포트폴리오 체험용 페이지입니다',
    demoNoticeDesc: '별도의 정보 입력 없이 하단의 {strong} 버튼을 누르시면 자동으로 연결됩니다.',
    demoBtn: '로그인 버튼',
    identifierLabel: '이메일 또는 전화번호',
    passwordLabel: '비밀번호',
    autoLoginBtn: '체험용 자동 로그인',
    emailPlaceholder: '이메일',
    phonePlaceholder: '전화번호',
    errors: {
      identifierRequired: '이메일 또는 전화번호를 입력해주세요.',
      invalidEmail: '올바른 이메일 형식이 아닙니다.',
      invalidPhone: '올바른 전화번호 형식이 아닙니다.',
      passwordRequired: '비밀번호를 입력해주세요.',
      loginFailed: '로그인 중 오류가 발생했습니다.',
      invalidCredentials: '이메일/전화번호 또는 비밀번호가 올바르지 않습니다.',
      userNotFound: '등록되지 않은 사용자입니다.',
      accountNotApproved: '관리자 승인을 기다려주세요.',
      networkError: '네트워크 연결을 확인해주세요.',
      logoutError: '로그아웃 중 오류가 발생했습니다.'
    }
  },
  register: {
    steps: {
      basicInfo: '기본 정보 입력',
      password: '비밀번호 설정',
      affiliation: '소속 정보 입력'
    },
    step1: {
      joinDate: '가입일'
    },
    labels: {
      name: '이름',
      email: '이메일 주소',
      phone: '전화번호',
      password: '비밀번호',
      confirmPassword: '비밀번호 확인',
      affiliationType: '소속 유형',
      affiliation: '소속명',
      passwordVisibility: '비밀번호 보기/숨기기'
    },
    placeholders: {
      name: '실명을 입력하세요',
      email: '이메일 주소를 입력하세요',
      phone: '전화번호를 입력하세요',
      password: '8자 이상의 안전한 비밀번호를 입력하세요',
      confirmPassword: '비밀번호를 다시 입력하세요',
      affiliationType: '소속 유형을 선택하세요',
      affiliation: '소속 기관명을 입력하세요'
    },
    info: {
      loginNotice: '이메일 또는 전화번호로 로그인할 수 있습니다.'
    },
    buttons: {
      next: '다음 단계',
      prev: '이전 단계',
      checking: '확인 중...',
      completing: '회원가입 중...',
      complete: '회원가입 완료'
    },
    errors: {
      nameRequired: '이름을 입력해주세요.',
      nameTooShort: '이름은 2자 이상 입력해주세요.',
      emailRequired: '이메일 주소를 입력해주세요.',
      invalidEmail: '올바른 이메일 형식이 아닙니다.',
      phoneRequired: '전화번호를 입력해주세요.',
      invalidPhone: '올바른 전화번호 형식이 아닙니다.',
      passwordRequired: '비밀번호를 입력해주세요.',
      passwordTooShort: '비밀번호는 최소 6자 이상이어야 합니다.',
      confirmPasswordRequired: '비밀번호를 다시 입력해주세요.',
      passwordMismatch: '비밀번호가 일치하지 않습니다.',
      affiliationTypeRequired: '소속 유형을 선택해주세요.',
      affiliationRequired: '소속을 입력해주세요.',
      emailExists: '이미 사용 중인 이메일 주소입니다.',
      emailCheckError: '이메일 확인 중 오류가 발생했습니다.',
      phoneExists: '이미 사용 중인 전화번호입니다.',
      phoneCheckError: '전화번호 확인 중 오류가 발생했습니다.',
      checkError: '확인 중 오류가 발생했습니다.'
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
  }
};
