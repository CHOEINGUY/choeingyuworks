# 최인규 | Ingyu Choe

비효율을 발견하면 구조와 흐름을 파악하고 자동화로 해결합니다.

[이력서 및 포트폴리오 보러가기](https://choeingyu.works/ko)

---

## 주요 특징

| 기능               | 설명                                                         |
| ------------------ | ------------------------------------------------------------ |
| **인터랙티브 데모** | 각 프로젝트의 핵심 로직을 실시간으로 시연하는 자동 재생 데모 |
| **반응형 디자인**   | 모바일부터 데스크톱까지 최적화된 UX                          |
| **프린트 최적화**   | 이력서 페이지 인쇄 시 깔끔한 레이아웃 유지                   |

---

## 프로젝트 하이라이트

### 1. 역학조사 통합 분석 솔루션 (Easy-Epidemiology)

> 보건소 담당자의 수작업 분석을 즉시 자동화

- **문제**: 환자 대조군 분석 및 보고서 작성에 수 시간 소요
- **해결**: 브라우저 기반 경량 통계 알고리즘 + 한글/PDF 자동 생성
- **성과**: 분석 시간을 '즉시 완료' 수준으로 단축

### 2. 실시간 코호트 검진 관제 시스템

> 검진 현장 병목 해소 및 대기 시간 최적화

- **문제**: 수기 관리로 인한 현장 혼선
- **해결**: Firebase 실시간 연동 + Google TTS 자동 호명
- **성과**: 검진 회차당 소요 시간 15% 단축

### 3. 출강 업체 강의 관리 시스템

> 구글 시트만으로 운영하던 CPR 출강 업체의 전 업무 자동화

- **문제**: 강의 공고·강사 배정·현장 운영·정산을 수작업으로 처리
- **해결**: 앱시트·웹앱·구글 챗·AI를 연결한 통합 운영 시스템 구축
- **성과**: 1인 운영 체제 확립, 반복 행정업무 제거

### 4. 현장 직원 안전점검 관리 시스템

> 수백 명 현장 직원의 일일 안전점검 자동화

- **문제**: 수작업 수집으로 인한 누락·지연
- **해결**: 모바일 웹 제출 → 근무계획 매칭 → 미제출자 자동 식별 및 문자 발송
- **성과**: 담당자 수작업 대폭 감소, 미제출 실시간 파악

### 5. 지역사회건강조사 통계집 자동화

> 전남 14개 시군 통계집 수작업 반복을 Python·Excel VBA로 해결

- **문제**: 3명이 2개월 이상 소요되는 엑셀·한글 반복작업
- **해결**: Python + VBA 기반 자동화 파이프라인 구축
- **성과**: 혼자 3주 만에 완료

---

## 기술 스택

### Frontend

```
Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4
Framer Motion · Recharts · Lucide Icons
```

### Backend & Infrastructure

```
Firebase (Auth, Firestore, Realtime DB)
Google Cloud Run · Vercel · Cloudflare R2
```

### Development & Testing

```
Vitest · React Testing Library · ESLint
next-intl (i18n) · react-hook-form
```

---

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   └── [locale]/           # 다국어 라우팅
│       ├── page.tsx        # 랜딩 페이지
│       ├── resume/         # 이력서
│       └── portfolio/      # 포트폴리오 상세
├── features/               # 기능별 모듈
│   ├── hero/               # Hero 섹션
│   ├── portfolio/          # 포트폴리오 컴포넌트
│   │   └── projects/       # 개별 프로젝트 데모
│   └── resume/             # 이력서 컴포넌트
├── components/             # 공통 UI 컴포넌트
├── hooks/                  # 커스텀 훅
├── lib/                    # 유틸리티
└── messages/               # i18n 번역 파일
```

---

## 빠른 시작

```bash
git clone https://github.com/CHOEINGUY/choeingyuworks.git
cd choeingyuworks
npm install
npm run dev
```

---

## AI 도구 활용

| 활용 영역     | 도구                  | 적용 사례                                               |
| ------------- | --------------------- | ------------------------------------------------------- |
| **코드 생성** | Google Antigravity, Claude Code   | 복잡한 애니메이션 로직, 데모 컴포넌트 빠른 프로토타이핑 |
| **디버깅**    | Claude Code, Google Antigravity   | 에러 트러블슈팅, 성능 최적화 분석                       |
| **자동화**    | AppSheet, Apps Script + AI | 업무 흐름 자동화, 현장 운영 시스템 구축                |

AI로 개발 속도를 높이고, 확보한 시간은 현장 검증과 안정성 테스트에 투자

---

## 연락처

- Email: chldlsrb07@gmail.com
- GitHub: [@CHOEINGUY](https://github.com/CHOEINGUY)
- Phone: 010-3323-7008
