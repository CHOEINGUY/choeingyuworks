import { User, Phone, MapPin, Calendar, Briefcase, Heart, Type, List, CheckSquare, Image as ImageIcon, Paperclip, CreditCard, Info, Ticket, Instagram, Ruler, FileText } from 'lucide-react';
import { FIELD_TYPES } from '../constants/fieldTypes';
import { SYSTEM_FIELDS } from '../constants/systemFields';
import { REGION_DATA } from './regionData';
import React from 'react';

// Define Preset Interface
export interface Preset {
    label: string;
    id?: string;
    icon: React.ReactNode;
    type: string;
    title: string;
    required: boolean;
    placeholder?: string;
    description?: string;
    isLocked?: boolean;
    isSystem?: boolean;
    isTypeLocked?: boolean;
    isLabelLocked?: boolean;
    isSessionSelector?: boolean;
    isTicket?: boolean;
    options?: any[]; // Keep flexible for string[] or object[]
    paymentDetails?: string;
    bankName?: string;
    accountNumber?: string;
    accountHolder?: string;
    otherInfo?: string;
    adminProps?: {
        cardLabel: string;
        showInCard: boolean;
    };
    showInReview?: boolean;
    storeRawValue?: boolean; // [NEW] Added for strict value fields
}

// 1. 필수 템플릿 (Mandatory)
export const MANDATORY_PRESETS: Preset[] = [
    {
        label: '이름', id: SYSTEM_FIELDS.NAME, icon: <User size={18} />, type: FIELD_TYPES.SHORT_TEXT, title: '이름을 입력해주세요', required: true, placeholder: '홍길동', isLocked: true, isSystem: true,
        adminProps: { cardLabel: '이름', showInCard: true },
        showInReview: true
    },
    {
        label: '연락처', id: SYSTEM_FIELDS.PHONE, icon: <Phone size={18} />, type: FIELD_TYPES.PHONE, title: '연락처를 입력해주세요', required: true, placeholder: '010-1234-5678', isLocked: true, isSystem: true,
        adminProps: { cardLabel: '연락처', showInCard: true },
        showInReview: true
    },
    {
        label: '성별', id: SYSTEM_FIELDS.GENDER, icon: <User size={18} />, type: FIELD_TYPES.SINGLE_CHOICE, title: '성별을 선택해주세요', required: true,
        options: [{ label: '남성', value: 'M' }, { label: '여성', value: 'F' }],
        isLocked: true, isSystem: true, isLabelLocked: true, storeRawValue: true, // [NEW] Save 'M'/'F' instead of '남성'/'여성'
        adminProps: { cardLabel: '성별', showInCard: true },
        showInReview: true
    },
    {
        label: '생년월일', id: SYSTEM_FIELDS.BIRTH_DATE, icon: <Calendar size={18} />, type: FIELD_TYPES.BIRTH_DATE, title: '생년월일을 입력해주세요', required: true, placeholder: '19950101', description: '8자리 숫자로 입력해주세요', isLocked: true, isSystem: true,
        adminProps: { cardLabel: '생년월일', showInCard: true },
        showInReview: true
    },
    {
        label: '참가 일정', id: SYSTEM_FIELDS.SCHEDULE, icon: <Calendar size={18} />, type: FIELD_TYPES.SINGLE_CHOICE, title: '참여 가능한 일정을 선택해주세요', description: '가장 편하신 날짜를 선택해주세요', required: true,
        options: [
            { label: '주말 오후 (12시-18시)', value: '주말 오후 (12시-18시)' },
            { label: '주말 저녁 (18시 이후)', value: '주말 저녁 (18시 이후)' },
            { label: '평일 저녁 (19시 이후)', value: '평일 저녁 (19시 이후)' },
            { label: '자유롭게 가능 (협의)', value: '자유롭게 가능 (협의)' }
        ],
        isLocked: false, isTypeLocked: true, isSessionSelector: true, isSystem: true, isLabelLocked: true, // storeRawValue removed
        adminProps: { cardLabel: '참석일정', showInCard: false },
        showInReview: true
    },
    {
        label: '입금 안내', id: SYSTEM_FIELDS.PAYMENT_INFO, icon: <CreditCard size={18} />, type: FIELD_TYPES.PAYMENT_INFO, title: '참가비 입금 안내', required: false,
        description: '신청서 작성 후 티켓 비용을 입금해주세요',
        paymentDetails: '남성: 50,000원\n여성: 30,000원',
        bankName: '국민은행',
        accountNumber: '123456-01-123456',
        accountHolder: '김민수',
        otherInfo: '입금자명과 신청자명을 꼭 동일하게 해주세요',
        isLocked: false, isSystem: true, isTypeLocked: true, isLabelLocked: true,
        adminProps: { cardLabel: '입금', showInCard: false }
    }
];

// 2. 필수 추천 (Core)
export const CORE_PRESETS: Preset[] = [
    {
        label: '지역', id: SYSTEM_FIELDS.LOCATION, icon: <MapPin size={18} />, type: FIELD_TYPES.REGION, title: '거주 지역을 선택해주세요', description: '시/도 선택 후 시·군·구를 선택해주세요', required: true, isLocked: false, isTypeLocked: true, isSystem: true, isLabelLocked: true,
        options: REGION_DATA,
        adminProps: { cardLabel: '거주지', showInCard: true }
    },
    {
        label: '직업', id: SYSTEM_FIELDS.JOB, icon: <Briefcase size={18} />, type: FIELD_TYPES.SHORT_TEXT, title: '직업을 입력해주세요', required: true, placeholder: '회사원', isLocked: true, isSystem: true, isLabelLocked: true,
        adminProps: { cardLabel: '직업', showInCard: true }
    },
    {
        label: '티켓/참가비', id: SYSTEM_FIELDS.TICKET_OPTION, icon: <Ticket size={18} />, type: FIELD_TYPES.SINGLE_CHOICE, title: '티켓을 선택해주세요', required: true,
        description: '본인에게 해당하는 티켓을 선택해주세요.',
        options: [
            { label: '남성 (1차) - 50,000원', value: 'ticket_m_1', price: 50000 },
            { label: '여성 (1차) - 30,000원', value: 'ticket_f_1', price: 30000 },
        ],
        isLocked: false, isTicket: true, isTypeLocked: true, isSystem: true, isLabelLocked: true, storeRawValue: true, // [NEW] Save ticket ID (e.g. ticket_m_1)
        adminProps: { cardLabel: '티켓', showInCard: true },
        showInReview: true
    },
    {
        label: '얼굴 사진',
        id: 'face_photo',
        type: FIELD_TYPES.IMAGE_UPLOAD,
        icon: <ImageIcon size={18} />,
        title: '얼굴이 잘 나온 사진을 올려주세요',
        required: true,
        description: '본인 확인을 위해 얼굴이 명확하게 나온 사진을 첨부해주세요.',
        isSystem: true,
        isLabelLocked: true,
        adminProps: { cardLabel: '얼굴사진', showInCard: true }
    },
    {
        label: '전신 사진',
        id: 'full_body_photo',
        type: FIELD_TYPES.IMAGE_UPLOAD,
        icon: <ImageIcon size={18} />,
        title: '전신이 나온 사진을 올려주세요',
        required: true,
        description: '스타일 확인을 위해 전신 사진을 첨부해주세요.',
        isSystem: true,
        isLabelLocked: true,
        adminProps: { cardLabel: '전신사진', showInCard: true }
    }
];

// 3. 상세 옵션 (Add-on)
export const ADDON_PRESETS: Preset[] = [
    {
        label: '키', id: SYSTEM_FIELDS.HEIGHT, icon: <Ruler size={18} />, type: FIELD_TYPES.NUMBER, title: '키(cm)를 입력해주세요', description: '숫자만 입력해주세요', required: false, placeholder: '175', isSystem: true, isLabelLocked: true,
        adminProps: { cardLabel: '키', showInCard: true }
    },
    {
        label: 'MBTI', id: FIELD_TYPES.MBTI, icon: <CheckSquare size={18} />, type: FIELD_TYPES.MBTI, title: 'MBTI를 선택해주세요', required: false, isTypeLocked: true, isSystem: true, isLocked: true,
        adminProps: { cardLabel: 'MBTI', showInCard: true }
    },
    {
        label: '음주', id: SYSTEM_FIELDS.DRINKING, icon: <CheckSquare size={18} />, type: FIELD_TYPES.SINGLE_CHOICE, title: '음주 스타일을 선택해주세요', required: false,
        options: [{ label: '안 마심', value: 'none' }, { label: '가끔', value: 'sometimes' }, { label: '즐김', value: 'often' }], isSystem: true, isLabelLocked: true,
        adminProps: { cardLabel: '음주', showInCard: true }
    },
    {
        label: '흡연', id: SYSTEM_FIELDS.SMOKING, icon: <CheckSquare size={18} />, type: FIELD_TYPES.SINGLE_CHOICE, title: '흡연 여부를 선택해주세요', required: false,
        options: [{ label: '비흡연', value: 'no' }, { label: '흡연', value: 'yes' }], isSystem: true, isLabelLocked: true,
        adminProps: { cardLabel: '흡연', showInCard: true }
    },
    {
        label: '취미', id: SYSTEM_FIELDS.HOBBY, icon: <Heart size={18} />, type: FIELD_TYPES.MULTIPLE_CHOICE, title: '취미를 선택해주세요', description: '최대 3개까지 선택 가능합니다', required: false,
        options: [
            { value: "sports", label: "운동", emoji: "⚽" },
            { value: "reading", label: "독서", emoji: "📚" },
            { value: "movie", label: "영화/드라마", emoji: "🎬" },
            { value: "travel", label: "여행", emoji: "✈️" },
            { value: "music", label: "음악", emoji: "🎵" },
            { value: "game", label: "게임", emoji: "🎮" },
            { value: "cooking", label: "요리", emoji: "🍳" },
            { value: "art", label: "미술/사진", emoji: "🎨" }
        ],
        isLocked: false, isSystem: true, isLabelLocked: true,
        adminProps: { cardLabel: '취미', showInCard: true }
    },
    {
        label: '자기소개', id: SYSTEM_FIELDS.INTRODUCTION, icon: <FileText size={18} />, type: FIELD_TYPES.LONG_TEXT, title: '자기소개를 작성해주세요', required: true, placeholder: '자유롭게 작성해주세요', description: '최대 500자까지 입력 가능합니다', isLocked: true, isSystem: true, isLabelLocked: true,
        adminProps: { cardLabel: '자기소개', showInCard: true }
    },
    {
        label: '환불 계좌', id: SYSTEM_FIELDS.REFUND_ACCOUNT, icon: <CreditCard size={18} />, type: FIELD_TYPES.BANK_ACCOUNT, title: '환불 계좌를 입력해주세요', required: false, placeholder: '예) 카카오뱅크 3333-00-1111111',
        description: '매칭 실패 시 환불을 위해 정확히 입력해주세요.',
        isLocked: false, isTypeLocked: true, isSystem: true, isLabelLocked: true,
        adminProps: { cardLabel: '환불계좌', showInCard: true },
        showInReview: true
    },
    {
        label: '인스타그램', id: SYSTEM_FIELDS.INSTAGRAM, icon: <Instagram size={18} />, type: FIELD_TYPES.SHORT_TEXT, title: '인스타그램 ID를 입력해주세요', required: false, placeholder: 'instagram_id',
        description: '정확한 ID를 입력해주세요. (사진 확인을 위해 잠시만 비공개를 풀어주세요)',
        isLocked: false, isTypeLocked: true, isSystem: true, isLabelLocked: true,
        adminProps: { cardLabel: '인스타', showInCard: true }
    }
];

// 4. 기본 도구 (Custom)
export const BASIC_TOOLS: Preset[] = [
    { label: '단답형', icon: <Type size={18} />, type: FIELD_TYPES.SHORT_TEXT, title: '질문 제목', required: false, adminProps: { cardLabel: '', showInCard: true } },
    { label: '장문형', icon: <List size={18} />, type: FIELD_TYPES.LONG_TEXT, title: '질문 제목', required: false, adminProps: { cardLabel: '', showInCard: true } },
    { label: '객관식', icon: <CheckSquare size={18} />, type: FIELD_TYPES.SINGLE_CHOICE, title: '질문 제목', required: false, options: ['옵션 1'], adminProps: { cardLabel: '', showInCard: true } },
    { label: '이미지', icon: <ImageIcon size={18} />, type: FIELD_TYPES.IMAGE_UPLOAD, title: '이미지를 업로드해주세요', required: false, adminProps: { cardLabel: '', showInCard: true } },
    { label: '첨부파일', icon: <Paperclip size={18} />, type: FIELD_TYPES.FILE_UPLOAD, title: '파일을 첨부해주세요', required: false, adminProps: { cardLabel: '', showInCard: true } },
    { label: '안내 문구', icon: <Info size={18} />, type: FIELD_TYPES.NOTICE, title: '안내사항', description: '내용을 입력해주세요', required: false, adminProps: { cardLabel: '', showInCard: false } },
];
