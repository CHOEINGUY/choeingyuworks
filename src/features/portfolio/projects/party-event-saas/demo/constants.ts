"use client";

export const INITIAL_APPLICANTS = [
    { id: '1', name: '김민지', phone: '010-8888-9999', status: 'approved', time: '10분 전', gender: 'F' },
    { id: '2', name: '이준호', phone: '010-5555-4444', status: 'pending', time: '12분 전', gender: 'M' },
    { id: '3', name: '박서연', phone: '010-3333-2222', status: 'approved', time: '15분 전', gender: 'F' },
];

export const NEW_APPLICANT = {
    id: 'new',
    name: '최인규',
    phone: '010-1234-5678',
    status: 'pending',
    time: '방금',
    gender: 'M',
    age: 28,
    job: '프론트엔드 개발자',
    location: '서울 강남구',
    mbti: 'ENTJ',
    tags: ['#개발자', '#스타트업', '#와인_러버', '#여행'],
    intro: '안녕하세요! 좋은 분들과 즐거운 시간 보내고 싶습니다.',
    drinking: '가끔 즐김',
    smoking: '비흡연'
};

export type ScanState = 'idle' | 'scrolling' | 'scanning' | 'approved';
