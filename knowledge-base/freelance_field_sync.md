# 외주 5 - 시식 행사 현장 업무 보고 자동화 시스템 (Field Sync)

## 한 줄 요약
마트 시식 행사 현장 직원들이 행사 정보와 사진을 모바일로 제출하면, 데이터 집계·보고서 생성까지 자동으로 이어지는 End-to-End 파이프라인.

## 기술 스택

- Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript (모바일 최적화 웹앱)
- Google Apps Script (백엔드, 별도 서버 없이 데이터·파일 관리)
- Google Sheets (데이터 DB), Google Drive (이미지 저장), Google Slides (보고서)
- AppSheet (관리자 대시보드)
- Vercel 배포

## 주요 기능

**현장 직원 (모바일 웹앱)**:
- 날짜, 지점명(초성 검색), 매장명, 사원 정보 입력
- 카메라 촬영 또는 갤러리 선택으로 사진 첨부 (미리보기, 업로드 상태 피드백)
- 제출 시 Google Sheets에 데이터 기록 + Google Drive에 이미지 저장

**관리자**:
- AppSheet 대시보드: 역할별 접근 제어 (지점 관리자는 담당 지점만, 시스템 관리자는 전체)
- 월별/사원별/지점별 데이터 집계 자동화
- 버튼 클릭으로 Google Slides(프레젠테이션) + Spreadsheet(근무계획표) 보고서 자동 생성
- 월별 리포트 뼈대(껍데기) 자동 생성

## 아키텍처 특징

Next.js API Route가 GAS Web App으로 프록시 역할 (재시도 로직 포함). GAS가 Sheets, Drive, Slides 모두 핸들링해서 별도 서버·DB 없이 운영.
