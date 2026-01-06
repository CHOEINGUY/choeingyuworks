import { Grid, Users, Crown, PartyPopper, Mail } from 'lucide-react';
import React from 'react';

// Define Message Template Interfaces
export interface MessageTemplate {
    id: string;
    serviceType: string;
    category: string;
    title: string;
    content: string;
    lastUpdated: number;
}

export interface ServiceType {
    id: string;
    label: string;
    icon: React.ReactNode;
}

export interface TemplateVariable {
    label: string;
    value: string;
    type: string;
}

export interface Category {
    id: string;
    label: string;
    color: string;
}

// Service Types
export const SERVICE_TYPES: ServiceType[] = [
    { id: 'ALL', label: '전체', icon: <Grid size={16} /> },
    { id: 'ROTATION', label: '로테이션', icon: <Users size={16} /> },
    { id: 'PREMIUM', label: '1:1 프리미엄', icon: <Crown size={16} /> },
    { id: 'PARTY', label: '파티', icon: <PartyPopper size={16} /> },
    { id: 'COMMON', label: '공통', icon: <Mail size={16} /> }
];

// Refined Templates with Service Types
export const DEFAULT_TEMPLATES: MessageTemplate[] = [
    // --- PARTY ---
    {
        id: 'PARTY_INVITE',
        serviceType: 'PARTY',
        category: 'INVITATION',
        title: '파티 확정 안내',
        content: `웨이비 파티 확정 안내\n\n예약 날짜 : {파티날짜}\n\n안녕하세요. {이름}님은 웨이비 파티 참여자로 확정되셨습니다.\n\n이번에도 어김 없이 선남선녀 분들이 많이 신청해 주셨는데요. \n\n파티 안내 사항은 아래 링크에 남겨두었으니 \n꼭! 확인 부탁드려요!\n\n주소 : {지점명}\n\n초대링크\n{초대링크}`,
        lastUpdated: Date.now()
    },
    {
        id: 'PARTY_WELCOME',
        serviceType: 'PARTY',
        category: 'INVITATION',
        title: '파티 환영 인사',
        content: `{이름}님, WAVY에 오신 것을 진심으로 환영합니다!\n\n파티명 : {파티날짜}\n방 번호 : {방번호}\n\n참여 링크: {참여링크}\n\n위 링크를 클릭하거나 QR 코드를 스캔하여 파티에 참여하세요!`,
        lastUpdated: Date.now()
    },

    // --- ROTATION ---
    {
        id: 'ROTATION_INVITE',
        serviceType: 'ROTATION',
        category: 'INVITATION',
        title: '로테이션 데이팅 초대',
        content: `안녕하세요 {이름}님! 웨이비 로테이션 데이팅에 초대되셨습니다.\n\n일시: {파티날짜}\n장소: {장소}\n\n설레는 만남이 기다리고 있습니다. 아래 링크에서 상세 내용을 확인해주세요.\n\n초대링크: {초대링크}`,
        lastUpdated: Date.now()
    },
    {
        id: 'ROTATION_RESULT',
        serviceType: 'ROTATION',
        category: 'NOTICE',
        title: '매칭 결과 확인 알림',
        content: `[WAVY] {이름}님, 오늘 로테이션 데이팅 즐거우셨나요?\n매칭 결과가 나왔습니다! \n\n지금 바로 아래 링크에서 결과를 확인해보세요.\n\n결과 확인하기: {결과링크}`,
        lastUpdated: Date.now()
    },

    // --- PREMIUM 1:1 ---
    {
        id: 'PREMIUM_PROFILE_REQUEST',
        serviceType: 'PREMIUM',
        category: 'REQUIREMENT',
        title: '프로필 작성 요청',
        content: `[WAVY 프리미엄] 안녕하세요 {이름}님!\n1:1 프리미엄 매칭을 위한 프로필 작성 요청드립니다.\n\n아래 링크를 통해 프로필을 완성해주시면, 매니저가 내용을 확인 후 매칭을 진행해 드립니다.\n\n프로필 작성하기: {프로필링크}\n\n감사합니다.`,
        lastUpdated: Date.now()
    },
    {
        id: 'PREMIUM_MATCH_FOUND',
        serviceType: 'PREMIUM',
        category: 'MATCHING',
        title: '매칭 성공 및 일정 조율 요청',
        content: `[WAVY 프리미엄] 안녕하세요 {이름}님!\n축하드립니다! 이상형에 가까운 분과 매칭이 성사되었습니다.\n\n원활한 만남을 위해 가능한 날짜와 시간을 알려주시면 조율을 도와드리겠습니다.\n\n상대방 프로필 보기: {상대방프로필링크}\n담당 매니저: {매니저연락처}`,
        lastUpdated: Date.now()
    },
    {
        id: 'PREMIUM_DATE_CONFIRM',
        serviceType: 'PREMIUM',
        category: 'MATCHING',
        content: `[WAVY 프리미엄] 만남 일정이 확정되었습니다.\n\n일시: {약속시간}\n장소: {약속장소}\n상대방: {상대방이름}\n\n설레는 첫 만남, 즐거운 시간 보내시길 바랍니다!\n변동 사항이 생기면 즉시 담당 매니저에게 연락 부탁드립니다.`,
    },
    {
        id: 'PREMIUM_AFTER_CARE',
        serviceType: 'PREMIUM',
        category: 'FEEDBACK',
        title: '만남 후기 요청',
        content: `[WAVY 프리미엄] {이름}님, 오늘 만남은 어떠셨나요?\n더 좋은 매칭을 위해 {이름}님의 소중한 후기를 들려주세요.\n\n간단 후기 남기기: {설문링크}\n\n감사합니다.`,
        lastUpdated: Date.now()
    },

    // --- COMMON ---
    {
        id: 'PAYMENT_REMINDER',
        serviceType: 'COMMON',
        category: 'PAYMENT',
        title: '입금 요청 (미입금자)',
        content: `안녕하세요! {이름}님 웨이비 입니다! \n신청서 작성 후 입금을 안 하셔서 연락드려요! \n참가 의사가 있으실까요?`,
        lastUpdated: Date.now()
    },
    {
        id: 'PAYMENT_REFUND_COMPLETE',
        serviceType: 'COMMON',
        category: 'PAYMENT',
        title: '환불 완료 안내',
        content: `안녕하세요! 웨이비입니다. {이름}님 아쉽지만 환불 도와드렸습니다.`,
        lastUpdated: Date.now()
    },
    {
        id: 'PAYMENT_REQ_ACCOUNT',
        serviceType: 'COMMON',
        category: 'PAYMENT',
        title: '환불 계좌 요청',
        content: `안녕하세요 웨이비입니다.\n{이름}님 환불 처리를 위해 계좌번호 회신 부탁드립니다.`,
        lastUpdated: Date.now()
    }
];

export const AVAILABLE_VARIABLES: TemplateVariable[] = [
    // Common
    { label: '이름', value: '{이름}', type: 'COMMON' },
    { label: '파티날짜', value: '{파티날짜}', type: 'COMMON' },
    { label: '장소', value: '{장소}', type: 'COMMON' },
    { label: '초대링크', value: '{초대링크}', type: 'COMMON' },

    // Party
    { label: '방번호', value: '{방번호}', type: 'PARTY' },
    { label: '지점명', value: '{지점명}', type: 'PARTY' },
    { label: '참여링크', value: '{참여링크}', type: 'PARTY' },

    // Rotation
    { label: '결과링크', value: '{결과링크}', type: 'ROTATION' },

    // Premium
    { label: '상대방이름', value: '{상대방이름}', type: 'PREMIUM' },
    { label: '상대방직업', value: '{상대방직업}', type: 'PREMIUM' },
    { label: '약속시간', value: '{약속시간}', type: 'PREMIUM' },
    { label: '약속장소', value: '{약속장소}', type: 'PREMIUM' },
    { label: '매니저연락처', value: '{매니저연락처}', type: 'PREMIUM' },
    { label: '상대방프로필', value: '{상대방프로필링크}', type: 'PREMIUM' },
    { label: '설문링크', value: '{설문링크}', type: 'PREMIUM' },
    { label: '프로필링크', value: '{프로필링크}', type: 'PREMIUM' },
];

export const CATEGORIES: Category[] = [
    { id: 'INVITATION', label: '초대/안내', color: 'blue' },
    { id: 'MATCHING', label: '매칭/일정', color: 'pink' }, // New for Premium
    { id: 'PAYMENT', label: '결제/환불', color: 'green' },
    { id: 'REQUIREMENT', label: '요청사항', color: 'amber' },
    { id: 'NOTICE', label: '공지사항', color: 'gray' },
    { id: 'FEEDBACK', label: '후기/피드백', color: 'purple' },
    { id: 'ETC', label: '기타', color: 'gray' }
];
