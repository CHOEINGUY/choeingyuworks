import { MessageData } from '../types';

/**
 * 메시지 템플릿의 변수({이름}, {파티날짜} 등)를 실제 데이터로 치환하는 유틸리티
 * 
 * @param {string} templateContent - 템플릿 원본 텍스트 (예: "안녕하세요 {이름}님")
 * @param {object} data - 치환할 데이터 객체 (예: { name: "홍길동", date: "12월 25일" })
 * @returns {string} - 치환된 완성 메시지
 */
export const fillMessageTemplate = (templateContent: string, data: MessageData): string => {
    if (!templateContent) return "";

    // 치환 맵핑 테이블 (Placeholder -> Data Field)
    // 템플릿에 쓰이는 변수명과 실제 데이터 객체의 필드명을 연결합니다.
    const replacementMap: Record<string, string> = {
        // 공통
        '{이름}': data.name || '',
        '{파티날짜}': data.partyDate || '', // 날짜 형식 변환 필요시 여기서 처리 or 데이터 넘길때 처리
        '{장소}': data.location || '',
        '{초대링크}': data.inviteLink || '',

        // 파티 관련
        '{방번호}': data.roomNumber || '',
        '{지점명}': data.branchName || '',
        '{참여링크}': data.partyLink || '',

        // 로테이션 관련
        '{결과링크}': data.resultLink || '',

        // 프리미엄(1:1) 관련
        '{상대방이름}': data.partnerName || '상대방', // Default value example
        '{상대방직업}': data.partnerJob || '',
        '{약속시간}': data.meetingTime || '',
        '{약속장소}': data.meetingLocation || '',
        '{매니저연락처}': data.managerPhone || '',
        '{상대방프로필링크}': data.partnerProfileLink || '',
        '{설문링크}': data.surveyLink || '',
        '{프로필링크}': data.프로필링크 || '', // [FIX] Added missing key
    };

    let result = templateContent;

    // 모든 키를 순회하며 치환 (String.replaceAll 사용)
    Object.keys(replacementMap).forEach(key => {
        // 해당 키가 템플릿에 존재할 때만 치환 수행
        if (result.includes(key)) {
            const value = replacementMap[key];
            // replaceAll은 최신 브라우저 지원. 안전하게 split/join 사용하거나 정규식 사용 가능.
            result = result.split(key).join(value);
        }
    });

    return result;
};
