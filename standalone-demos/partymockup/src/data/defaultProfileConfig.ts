export interface ProfileField {
    id: string;
    type: string;
    label: string;
    required: boolean;
    isSystem: boolean;
    readOnly?: boolean;
    visible: boolean;
    placeholder?: string;
    options?: { label: string; value: string }[];
    badgeStyle?: string;
}

export interface ProfileSection {
    id: string;
    title: string;
    description: string;
    isSystem?: boolean;
    fields: ProfileField[];
}

export interface ProfileConfig {
    title: string;
    description?: string;
    theme?: {
        color?: string;
        mode?: 'light' | 'dark';
    };
    design?: {
        fontFamily?: 'PRETENDARD' | 'NOTO_SERIF' | 'NANUM_SQUARE';
        buttonStyle?: 'rounded' | 'square' | 'pill';
        layoutDensity?: 'compact' | 'comfortable';
    };
    updatedAt: string;
    sections: ProfileSection[];
}


export const DEFAULT_PROFILE_CONFIG: ProfileConfig = {
    title: "프로필 빌더",
    design: {
        fontFamily: 'PRETENDARD',
        buttonStyle: 'rounded',
        layoutDensity: 'comfortable',
        optionStyle: 'rounded',
        optionAlign: 'left',
        optionSize: 'md'
    },
    updatedAt: new Date().toISOString(),
    sections: [
        {
            id: 'section_nickname',
            title: '닉네임 설정',
            description: '프로필 카드에 표시될 닉네임을 입력해주세요.',
            isSystem: true,
            fields: [
                {
                    id: 'nickname',
                    type: 'short_text',
                    label: '닉네임',
                    required: true,
                    isSystem: true,
                    readOnly: false,
                    visible: true,
                    placeholder: '예: 션'
                }
            ]
        },
        {
            id: 'section_basic',
            title: '기본 정보',
            description: '매칭에 사용되는 필수 정보입니다.',
            isSystem: true,
            fields: [
                {
                    id: 'name',
                    type: 'short_text',
                    label: '이름 (본명)',
                    required: true,
                    isSystem: true,
                    readOnly: true, // 수정 불가
                    visible: true,  // 표시 여부 (Toggle 가능하도록 설계)
                    placeholder: '예: 김민수'
                },
                {
                    id: 'gender',
                    type: 'single_choice',
                    label: '성별',
                    required: true,
                    isSystem: true,
                    readOnly: true, // 수정 불가
                    visible: true,
                    options: [
                        { label: '남성', value: 'M' },
                        { label: '여성', value: 'F' }
                    ]
                },
                {
                    id: 'birthDate',
                    type: 'birth_date',
                    label: '생년월일',
                    required: true,
                    isSystem: true,
                    readOnly: true, // 수정 불가
                    visible: true
                },
                {
                    id: 'job',
                    type: 'short_text',
                    label: '직업',
                    required: true,
                    isSystem: true,
                    readOnly: true, // 수정 불가
                    visible: true
                },
                {
                    id: 'location',
                    type: 'short_text',
                    label: '거주지',
                    required: true,
                    isSystem: true,
                    readOnly: true, // 수정 불가
                    visible: true
                }
            ]
        },
        {
            id: 'section_lifestyle',
            title: '라이프스타일',
            description: '나의 생활 패턴을 알려주세요.',
            fields: [
                {
                    id: 'mbti',
                    type: 'mbti_selector',
                    label: 'MBTI',
                    required: true,
                    visible: true,
                    badgeStyle: 'filled',
                    isSystem: false
                },
                {
                    id: 'drinking',
                    type: 'single_choice',
                    label: '음주 스타일',
                    required: false,
                    visible: true,
                    options: [
                        { label: '못함', value: '못함' },
                        { label: '가끔', value: '가끔' },
                        { label: '즐김', value: '즐김' }
                    ]
                }
            ]
        },
        {
            id: 'section_intro',
            title: '자기소개',
            description: '상대방에게 나를 어필해보세요.',
            fields: [
                {
                    id: 'hobby',
                    type: 'tags',
                    label: '취미 / 관심사',
                    required: false,
                    visible: true,
                    placeholder: '태그를 입력하고 엔터를 눌러주세요',
                    isSystem: false
                },
                {
                    id: 'introduction',
                    type: 'textarea',
                    label: '자기소개',
                    required: true,
                    visible: true,
                    placeholder: '자유롭게 본인을 소개해주세요.',
                    isSystem: false
                }
            ]
        }
    ]
};
