import React, { useMemo, useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { toast } from 'sonner';

import { SYSTEM_FIELDS } from '../data/formSchema';
import { FIELD_TYPES } from '../constants/fieldTypes';
import ApplyFormEngine from '../components/form/immersive/ApplyFormEngine';
import { useSessions } from '../hooks/useSessions';
import { useForms } from '../hooks/useForms';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Question } from '../types/formConfig';
import PageTitle from '../components/common/PageTitle';



/**
 * 신청 폼 페이지 (엔드유저용)
 * 새로운 몰입형 엔진(ApplyFormEngine)을 사용
 */
const ApplyFormPage: React.FC = () => {
    const { formId } = useParams<{ formId: string }>(); // [NEW] Get formId from URL
    const [searchParams] = useSearchParams();
    const { processAnswers, constructDocData } = useFormSubmission(); // [NEW] Hook Usage

    // Note: session param is ONLY for pre-fill or tracking, NOT for form config loading anymore.
    // Form Config is loaded by formId (rotation, party, match)
    // Note: session param is ONLY for pre-fill or tracking, NOT for form config loading anymore.
    // Form Config is loaded by formId (rotation, party, match)
    // const sessionId = searchParams.get('session') || 'demo'; // Unused

    const isPreview = searchParams.get('preview') === 'true';
    const { sessions } = useSessions(); // Fetch real sessions
    const { getForm } = useForms();

    const [liveFormConfig, setLiveFormConfig] = useState<any>(null);
    const [loading, setLoading] = useState(!isPreview); // Preview doesn't fetch
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isPreview && formId) {
            const fetchForm = async () => {
                let formData = await getForm(formId);

                // Fallback for transition period: if 'rotation' not found, try 'default'
                if (!formData && formId === 'rotation') {
                    formData = await getForm('default');
                }

                if (formData && formData.formConfig) {
                    setLiveFormConfig(formData.formConfig);
                } else if (!formData) {
                    // If completely missing, we might want to show error or empty state
                    console.error(`Form ${formId} not found`);
                }
                setLoading(false);
            };
            fetchForm();
        }
    }, [isPreview, getForm, formId]);

    // 실제로는 Firestore에서 formConfig를 로드
    // 프리뷰 모드일 경우 로컬스토리지에서 로드
    const formConfig = useMemo(() => {
        if (isPreview) {
            try {
                const saved = localStorage.getItem('preview_form_data');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    return parsed.formConfig;
                }
            } catch (e) {
                console.error('Preview data load failed:', e);
            }
        }
        return liveFormConfig || null;
    }, [isPreview, liveFormConfig]);

    if (!loading && !formConfig) {
        return (
            <div className="flex items-center justify-center h-screen bg-white flex-col gap-4">
                <p className="text-gray-500">폼을 불러올 수 없습니다.</p>
            </div>
        );
    }

    const sortedQuestions = useMemo(() => {
        if (!formConfig) return [];
        let questions: Question[] = [...(formConfig.fields || [])].sort((a: Question, b: Question) => (a.order || 0) - (b.order || 0));

        // Inject Real Session Options (Only for Rotation/Party)
        // For Match mode, we rely on the saved options in 'q.options' (Customizable)
        if (sessions && Object.keys(sessions).length > 0) {
            questions = questions.map((q: Question) => {
                if (q.isSessionSelector) {
                    // If match mode, do NOT inject sessions. Let it use its own options.
                    if (formId === 'match') {
                        return q;
                    }

                    // Determine expected type
                    const targetType = formId === 'party' ? 'PARTY' : 'ROTATION';

                    // Default Logic (Rotation/Party): Inject Sessions if available
                    const todayKST = new Date(Date.now() + 32400000).toISOString().split('T')[0];

                    const sessionOptions = Object.entries(sessions)
                        .filter(([_, session]) =>
                            session.type === targetType &&
                            (session.date || '') >= todayKST // Hide past sessions
                        )
                        .map(([id, session]) => {
                            const isClosed = session.isApplicationClosed;
                            return {
                                value: id,
                                label: `${session.title}${isClosed ? ' (마감)' : ''}`,
                                emoji: "🗓️",
                                disabled: isClosed
                            };
                        });
                    return { ...q, options: sessionOptions };
                }
                return q;
            });
        }

        // [NEW] Filter out Ticket Question if Price Mode is FIXED
        if (formConfig.pricingMode === 'fixed') {
            questions = questions.filter((q: Question) => q.id !== SYSTEM_FIELDS.TICKET_OPTION);
        }

        // [NEW] 1:1 Match Mode Specific Overrides
        if (formId === 'match') {
            questions = questions.map((q: Question) => {
                // Force Schedule to be Multiple Choice
                if (q.id === SYSTEM_FIELDS.SCHEDULE) {
                    return {
                        ...q,
                        type: FIELD_TYPES.MULTIPLE_CHOICE,
                        title: '가능한 일정을 모두 선택해주세요',
                        description: '매칭 성공 확률을 높이기 위해 가능한 시간을 모두 선택해주세요.'
                    };
                }
                return q;
            });
        }

        return questions;
    }, [formConfig, sessions]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }


    const handleSubmit = async (rawAnswers: Record<string, any>) => {
        if (saving) return; // Prevent double submit
        setSaving(true);

        try {
            // 1. Determine Session ID (Strictly from Form Selection)
            // The user clarified that URL params are not used for session targeting.
            // We rely solely on the 'schedule' field selected in the form.
            const selectedSessionByForm = rawAnswers['schedule'];
            const finalSessionId = selectedSessionByForm || 'demo';

            // 2. Lookup Session Title for readability
            let finalSessionTitle = 'Unknown Session';
            if (sessions && sessions[finalSessionId]) {
                finalSessionTitle = sessions[finalSessionId].title;
            }

            // 3. Prepare Data
            // [NEW] Process Answers to save Labels instead of Values via Hook
            const processedAnswers = processAnswers(rawAnswers, sortedQuestions);
            const docData = constructDocData(rawAnswers, processedAnswers, sortedQuestions, finalSessionId, finalSessionTitle) as Record<string, any>;

            // [NEW] 티켓 정보 및 가격 처리 (Refactored Structure)
            const ticketInfo = {
                id: rawAnswers[SYSTEM_FIELDS.TICKET_OPTION] || 'fixed_price', // Default ID for fixed
                label: '',
                price: 0,
                isDeposited: false, // Default status
                purchasedAt: new Date().toISOString()
            };

            // A. Fixed Price Mode: 성별에 따라 자동 계산
            if (formConfig?.pricingMode === 'fixed') {
                const userGender = rawAnswers['gender']; // '남성' or '여성'
                let price = 0;

                if (userGender === '남성') price = formConfig.globalPrices?.male || 0;
                if (userGender === '여성') price = formConfig.globalPrices?.female || 0;

                ticketInfo.price = price;
                ticketInfo.label = '기본 참가비 (성별 고정)';
                ticketInfo.id = `fixed_${userGender === '남성' ? 'm' : 'f'}`;
            }
            // B. Option Mode (Desktop/Default): 사용자가 선택한 티켓 옵션
            else {
                const ticketQuestion = sortedQuestions.find((q: Question) => q.id === SYSTEM_FIELDS.TICKET_OPTION);
                if (ticketQuestion) {
                    const selectedValue = rawAnswers[SYSTEM_FIELDS.TICKET_OPTION]; // e.g. 'ticket_m_1'
                    const selectedOption = ticketQuestion.options?.find((opt: any) => (typeof opt === 'object' ? opt.value : opt) === selectedValue);

                    if (selectedOption && typeof selectedOption === 'object') {
                        ticketInfo.price = selectedOption.price || 0;
                        ticketInfo.label = selectedOption.label || '';
                        ticketInfo.id = selectedValue;
                    }
                }
            }

            // Assign aggregated ticket object
            docData.ticket = ticketInfo;
            // Legacy compatibility (Optional: We can keep them or remove them. Removing them since we have Adapter)
            // docData.ticketPrice = ticketInfo.price;
            // docData.ticketLabel = ticketInfo.label;

            // 4. Save to collection based on Mode
            // [NEW] Separation Logic: 1:1 Match -> 'premium_pool', Others -> 'users'
            const collectionName = formId === 'match' ? 'premium_pool' : 'users';

            await addDoc(collection(db, collectionName), docData);

            // 5. Success Feedback handled by ApplyFormEngine
            // alert('신청이 완료되었습니다!'); 

        } catch (error) {
            console.error('Application submission failed:', error);
            toast.error('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
            setSaving(false); // Only reset if error
            throw error;
        }
    };

    return (
        <React.Fragment>
            <PageTitle title="신청하기 | Dating App" />
            <ApplyFormEngine
                questions={sortedQuestions}

                theme={formConfig.theme}
                themeColor={formConfig.themeColor}
                title={formConfig.title}
                description={formConfig.description}
                coverImage={formConfig.coverImage}
                logoImage={formConfig.logoImage} // [NEW] Pass Logo
                completionPage={formConfig.completionPage}
                // [NEW] Design Settings
                fontFamily={formConfig.fontFamily}
                buttonStyle={formConfig.buttonStyle}
                // [NEW] Option Design
                optionStyle={formConfig.optionStyle}
                optionAlign={formConfig.optionAlign}
                optionSize={formConfig.optionSize}

                onSubmit={handleSubmit}
            />
        </React.Fragment>
    );
};

export default ApplyFormPage;
