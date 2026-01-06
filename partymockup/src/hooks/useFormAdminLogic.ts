
import { useState, useEffect } from 'react';
import { useForms } from './useForms';
import { DEFAULT_FORM_SCHEMA, SYSTEM_FIELDS } from '../data/formSchema';
import { FormConfig, FormField, FormMode } from '../types/form';
import { FORM_MODES, FORM_MODE_LABELS } from '../constants/form';
import { toast } from 'sonner';

export const useFormAdminLogic = () => {
    const [activeTab, setActiveTab] = useState<'builder' | 'theme' | 'preview' | 'json'>('builder');
    const { saveForm, getForm, loading: saving } = useForms();
    const [loading, setLoading] = useState(true);

    // Form ID Handling
    const [currentFormId, setCurrentFormId] = useState<FormMode>(FORM_MODES.ROTATION);

    // Form Settings
    const [formSettings, setFormSettings] = useState<FormConfig>({
        title: "2025년 1월 소개팅 신청서",
        theme: "love",
        transitionAnimation: "slide",
        logoText: "WAVY",
        description: "",
        completionPage: {
            title: "신청이 완료되었습니다",
            description: "검토 후 카카오톡으로 연락드리겠습니다."
        },
        pricingMode: 'option',
        globalPrices: { male: 0, female: 0 },
        fields: []
    });

    const [questions, setQuestions] = useState<FormField[]>([]);
    const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // --- Reset Logic ---
    const handleReset = () => {
        setIsResetConfirmOpen(true);
    };

    const confirmReset = () => {
        // Restore only system questions from DEFAULT_FORM_SCHEMA
        const initialSystemQuestions = DEFAULT_FORM_SCHEMA.filter(q => q.isSystem);
        setQuestions(initialSystemQuestions);
        toast.success('폼이 초기 세팅으로 복원되었습니다.');
        setIsResetConfirmOpen(false);
    };

    // --- Dirty State Tracking ---
    useEffect(() => {
        if (!loading && questions.length > 0) {
            setIsDirty(true);
        }
    }, [questions, formSettings, loading]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    // --- Load Form ---
    useEffect(() => {
        const loadForm = async () => {
            setLoading(true);
            try {
                let formData = await getForm(currentFormId);

                // Migration/Fallback: If 'rotation' missing, try 'default'
                if (!formData && currentFormId === 'rotation') {
                    formData = await getForm('default');
                }

                if (formData) {
                    setFormSettings(formData.formConfig);
                    setQuestions(formData.formConfig.fields || []);
                } else {
                    // Initialize default values based on mode
                    const defaultTitle = currentFormId === FORM_MODES.PARTY
                        ? '프라이빗 파티 신청'
                        : (currentFormId === FORM_MODES.MATCH ? '1:1 매칭 신청' : '2025년 1월 소개팅 신청서');

                    setFormSettings({
                        title: defaultTitle,
                        theme: "love",
                        description: "",
                        transitionAnimation: 'slide',
                        logoText: 'WAVY',
                        completionPage: {
                            title: "신청이 완료되었습니다",
                            description: "검토 후 카카오톡으로 연락드리겠습니다."
                        },
                        pricingMode: 'option',
                        globalPrices: { male: 0, female: 0 },
                        fields: []
                    });

                    // Default Questions Initialization
                    if (currentFormId === FORM_MODES.MATCH) {
                        const defaultQuestions = DEFAULT_FORM_SCHEMA.map((q, idx) => {
                            if (q.id === SYSTEM_FIELDS.SCHEDULE) {
                                return {
                                    ...q,
                                    options: [
                                        { label: '주말 오후 (12시-18시)', value: 'weekend_afternoon' },
                                        { label: '주말 저녁 (18시 이후)', value: 'weekend_evening' },
                                        { label: '평일 저녁 (19시 이후)', value: 'weekday_evening' },
                                        { label: '자유롭게 가능 (협의)', value: 'flexible' }
                                    ]
                                };
                            }
                            return { ...q, order: idx + 1 };
                        });
                        setQuestions(defaultQuestions);
                    } else {
                        setQuestions([]);
                    }
                }
            } catch (error) {
                console.error("Form load failed", error);
            } finally {
                setLoading(false);
            }
        };
        loadForm();
    }, [getForm, currentFormId]);

    const handleSave = async () => {
        const updatedConfig: FormConfig = {
            ...formSettings,
            fields: questions
        };

        const requiredFields = [
            { id: SYSTEM_FIELDS.NAME, label: '이름' },
            { id: SYSTEM_FIELDS.PHONE, label: '연락처' },
            { id: SYSTEM_FIELDS.GENDER, label: '성별' },
            { id: SYSTEM_FIELDS.BIRTH_DATE, label: '생년월일' },
            { id: SYSTEM_FIELDS.SCHEDULE, label: '참가 일정' },
            { id: SYSTEM_FIELDS.PAYMENT_INFO, label: '입금 안내' }
        ];

        const missingFields = requiredFields.filter(req => !questions.some(q => q.id === req.id));

        if (missingFields.length > 0) {
            toast.error(`필수 문항이 누락되었습니다: ${missingFields.map(f => f.label).join(', ')}`);
            return;
        }

        const payload = {
            formConfig: updatedConfig,
            updatedAt: new Date().toISOString(),
            mode: currentFormId
        };

        const cleanPayload = JSON.parse(JSON.stringify(payload));

        const success = await saveForm(currentFormId, cleanPayload);
        if (success) {
            toast.success(`${FORM_MODE_LABELS[currentFormId]} 저장 완료!`);
            setIsDirty(false);
        } else {
            toast.error('저장에 실패했습니다.');
        }
    };

    return {
        state: {
            activeTab,
            loading,
            currentFormId,
            formSettings,
            questions,
            activeQuestionId,
            isResetConfirmOpen,
            saving,
            isDirty
        },
        actions: {
            setActiveTab,
            setCurrentFormId,
            setFormSettings,
            setQuestions,
            setActiveQuestionId,
            setIsResetConfirmOpen,
            handleReset,
            confirmReset,
            handleSave
        }
    };
};
