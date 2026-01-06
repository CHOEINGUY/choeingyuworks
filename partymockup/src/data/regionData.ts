/**
 * Region Data for Location Dropdowns
 * Single source of truth for Korean administrative divisions
 */

export interface Region {
    value: string;
    label: string;
    districts: string[];
}

export const REGION_DATA: Region[] = [
    { value: 'seoul', label: '서울특별시', districts: ['강남구', '마포구', '송파구', '광진구', '노원구', '서초구'] },
    { value: 'gyeonggi', label: '경기도', districts: ['수원시', '성남시', '고양시', '용인시', '안양시', '화성시', '부천시', '남양주시'] },
    { value: 'incheon', label: '인천광역시', districts: ['연수구', '남동구', '부평구', '계양구', '미추홀구', '중구', '동구', '서구'] },
    { value: 'busan', label: '부산광역시', districts: ['해운대구', '수영구', '사하구', '동래구', '연제구', '부산진구', '남포동', '중구'] },
    { value: 'daegu', label: '대구광역시', districts: ['수성구', '달서구', '동구', '북구', '중구', '남구', '서구', '달성군'] },
    { value: 'gwangju', label: '광주광역시', districts: ['광산구', '서구', '북구', '동구', '남구'] },
    { value: 'daejeon', label: '대전광역시', districts: ['유성구', '서구', '동구', '대덕구', '중구'] },
    { value: 'ulsan', label: '울산광역시', districts: ['남구', '중구', '동구', '북구', '울주군'] },
    { value: 'sejong', label: '세종특별자치시', districts: ['세종시'] },
    { value: 'gangwon', label: '강원특별자치도', districts: ['춘천시', '원주시', '강릉시', '속초시', '동해시', '삼척시', '태백시'] },
    { value: 'chungbuk', label: '충청북도', districts: ['청주시', '충주시', '제천시', '음성군', '진천군', '괴산군', '영동군'] },
    { value: 'chungnam', label: '충청남도', districts: ['천안시', '아산시', '공주시', '서산시', '논산시', '계룡시', '당진시'] },
    { value: 'jeonbuk', label: '전라북도', districts: ['전주시', '군산시', '익산시', '남원시', '정읍시', '김제시', '완주군'] },
    { value: 'jeonnam', label: '전라남도', districts: ['화순군', '목포시', '여수시', '순천시', '광양시', '나주시', '해남군'] },
    { value: 'gyeongbuk', label: '경상북도', districts: ['포항시', '구미시', '경주시', '안동시', '김천시', '칠곡군', '영천시'] },
    { value: 'gyeongnam', label: '경상남도', districts: ['창원시', '김해시', '진주시', '거제시', '양산시', '거창군', '합천군'] },
    { value: 'jeju', label: '제주특별자치도', districts: ['제주시', '서귀포시'] },
    { value: 'other', label: '기타 지역 (직접 입력 희망 시 연락처로 알려주세요)', districts: ['기타'] }
];
