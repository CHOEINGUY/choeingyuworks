/**
 * 폼 필드 타입 정의
 */

export const FIELD_TYPES = {
    // 텍스트 계열
    SHORT_TEXT: 'short_text',        // 한 줄 입력 (이름, 회사명)
    LONG_TEXT: 'long_text',          // 여러 줄 (자기소개)

    // 숫자 계열
    NUMBER: 'number',                // 일반 숫자 (키)
    PHONE: 'phone',                  // 전화번호 (010-xxxx-xxxx)

    // 날짜 계열
    DATE: 'date',                    // 날짜 선택기
    BIRTH_DATE: 'birth_date',        // 생년월일 8자리 (19950101)

    // 선택 계열
    SINGLE_CHOICE: 'single_choice',  // 객관식 단일 선택 (성별)
    MULTIPLE_CHOICE: 'multiple_choice', // 객관식 복수 선택 (취미)
    DROPDOWN: 'dropdown',            // 드롭다운 (지역)
    REGION: 'region',                // 시/도 + 시군구 2단 선택

    // 파일
    IMAGE_UPLOAD: 'image_upload',    // 이미지 업로드 (프로필 사진)
    FILE_UPLOAD: 'file_upload',      // 일반 파일 첨부

    // 특수
    EMAIL: 'email',                  // 이메일
    URL: 'url',                      // 링크
    PAYMENT_INFO: 'payment_info',    // 입금 안내
    NOTICE: 'notice',                 // 안내 문구 (입력 없음)
    BANK_ACCOUNT: 'bank_account',    // 계좌 정보 입력 (은행, 계좌번호, 예금주)

    // 프로필 전용
    MBTI: 'mbti_selector',           // MBTI 선택기
    TAGS: 'tags'                     // 태그 입력
} as const;

export type FieldType = typeof FIELD_TYPES[keyof typeof FIELD_TYPES];

export const FIELD_TYPE_LABELS: Record<string, string> = {
    [FIELD_TYPES.SHORT_TEXT]: '단답형',
    [FIELD_TYPES.LONG_TEXT]: '장문형',
    [FIELD_TYPES.NUMBER]: '숫자',
    [FIELD_TYPES.PHONE]: '전화번호',
    [FIELD_TYPES.DATE]: '날짜',
    [FIELD_TYPES.BIRTH_DATE]: '생년월일',
    [FIELD_TYPES.SINGLE_CHOICE]: '객관식 (단일선택)',
    [FIELD_TYPES.MULTIPLE_CHOICE]: '객관식 (복수선택)',
    [FIELD_TYPES.DROPDOWN]: '드롭다운',
    [FIELD_TYPES.REGION]: '지역 (시/군/구)',
    [FIELD_TYPES.IMAGE_UPLOAD]: '이미지 업로드',
    [FIELD_TYPES.FILE_UPLOAD]: '파일 첨부',
    [FIELD_TYPES.EMAIL]: '이메일',
    [FIELD_TYPES.URL]: '링크',
    [FIELD_TYPES.PAYMENT_INFO]: '입금 안내',
    [FIELD_TYPES.NOTICE]: '안내 문구',
    [FIELD_TYPES.BANK_ACCOUNT]: '계좌번호 입력',
    [FIELD_TYPES.MBTI]: 'MBTI 선택기',
    [FIELD_TYPES.TAGS]: '태그 입력'
};
