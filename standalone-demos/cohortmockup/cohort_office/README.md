# 🏥 남원 코호트 진행 현황판 (Namwon Cohort Dashboard)

이 프로젝트는 남원 코호트 연구의 검사 진행 상황을 실시간으로 대기실 모니터에 표시해주는 웹 애플리케이션입니다.

## 🏗️ 아키텍처 및 데이터 흐름 (Architecture & Data Flow)

이 시스템은 **AppSheet**, **Google Sheets**, **Firebase**, **Web App**이 유기적으로 연결되어 작동합니다.

### 🔄 데이터 흐름도 (Data Flow)
1.  **AppSheet (입력)**: 직원이 환자의 검사 상태(예: '검사중', '완료')를 변경합니다.
2.  **Google Sheets (저장)**: AppSheet와 연결된 구글 시트에 데이터가 저장됩니다.
3.  **GAS Trigger (감지)**: 시트 데이터가 변경되면 Google Apps Script의 `onSheetChange` 트리거가 작동합니다.
4.  **Firebase (중계)**: GAS가 변경된 데이터를 Firebase Realtime Database로 전송(Push)합니다.
5.  **Web App (표시)**: 대기실 모니터(웹앱)는 Firebase를 보고 있다가, 데이터가 도착하는 즉시 화면을 갱신합니다.

### 🧩 구성 요소별 역할
*   **AppSheet**:
    *   **역할**: 관리자/직원용 모바일 앱.
    *   **연결**: Google Sheets를 데이터베이스로 사용합니다.
*   **Google Sheets**:
    *   **역할**: 메인 데이터베이스. 모든 데이터의 원본입니다.
    *   **연결**: AppSheet와 양방향 동기화, GAS와 직접 연결.
*   **Google Apps Script (GAS)**:
    *   **역할**: 백엔드 서버 및 웹 호스팅.
    *   **기능**: 시트 변경 감지 -> Firebase로 데이터 전송.
*   **Firebase Realtime Database**:
    *   **역할**: 실시간 데이터 중계소.
    *   **기능**: GAS에서 받은 데이터를 웹 클라이언트로 즉시 전파.
*   **Web App**:
    *   **역할**: 대기실 현황판.
    *   **기능**: Firebase 데이터 수신 및 화면 렌더링, TTS/알림음 재생.

## 📂 파일 구조 (File Structure)

| 파일명 | 설명 |
| :--- | :--- |
| **`code.js`** | 서버 사이드 스크립트. `doGet`(웹 서빙), `onSheetChange`(데이터 동기화), `include`(파일 병합) 함수 포함. |
| **`index.html`** | 웹페이지의 뼈대. Firebase SDK 로드 및 레이아웃 구조 정의. |
| **`Stylesheet.html`** | 모든 CSS 스타일 정의. (반응형 디자인, 애니메이션 등) |
| **`JavaScript.html`** | 클라이언트 사이드 로직. 화면 전환, Firebase 리스너, TTS/알림음 재생, 설정 관리 등. |

## ⚙️ 설정 및 설치 (Setup)

### 1. Google Apps Script 설정
*   **스크립트 속성 (Script Properties)**: 보안을 위해 API 키 등은 코드에 직접 쓰지 않고 스크립트 속성에 저장하는 것을 권장합니다. (현재는 코드 내 포함됨, 추후 개선 권장)
*   **트리거 (Trigger)**:
    *   함수: `onSheetChange`
    *   이벤트 소스: 스프레드시트
    *   이벤트 유형: **변경 시 (On change)**
    *   *이 트리거가 없으면 실시간 업데이트가 작동하지 않습니다.*

### 2. Firebase 설정
*   **프로젝트**: `namwon-cohort`
*   **Database URL**: `https://namwon-cohort-default-rtdb.asia-southeast1.firebasedatabase.app/`
*   **규칙 (Rules)**:
    ```json
    {
      "rules": {
        ".read": true,
        ".write": false
      }
    }
    ```
    *   웹앱은 읽기만 가능, 쓰기는 GAS(Admin)만 가능하도록 설정됨.

## 🚀 배포 (Deployment)
수정 사항을 반영하려면 **새 버전으로 배포**해야 합니다.
1.  GAS 에디터 우측 상단 **[배포]** -> **[새 배포]**.
2.  유형: **웹 앱**.
3.  설명 입력 후 **[배포]** 클릭.
4.  생성된 URL을 대기실 모니터 브라우저에 띄웁니다.

## 🛠️ 유지보수 가이드 (Maintenance)

### Q. 화면이 안 바뀌어요!
1.  인터넷 연결을 확인하세요.
2.  GAS 트리거가 정상적으로 설정되어 있는지 확인하세요. (`onSheetChange` 에러 로그 확인)
3.  Firebase 일일 사용량(Quota)을 초과했는지 확인하세요. (무료 플랜도 충분하지만, 혹시 모름)

### Q. 소리가 안 나요!
1.  브라우저의 **"자동 재생(Autoplay)"** 정책 때문일 수 있습니다. 화면을 한 번 클릭해주면 소리가 납니다.
2.  설정(좌측 상단 'SNSB-C' 클릭)에서 알림음이 켜져 있는지 확인하세요.

### Q. 2026년이 되면 어떻게 하나요?
1.  `code.js`의 `getFilteredTableData` 함수에서 시트 이름(`"2025 대상자 명단"`)을 새 연도에 맞게 수정해야 합니다.
