import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FullscreenLayout from './FullscreenLayout';
// FlowProgressBar removed from here (moved to FormNavigation) - wait, it is used there. Do I need it here? No.
import ImmersiveFieldRenderer from './ImmersiveFieldRenderer';
import ImmersiveCover from './fields/ImmersiveCover';
import FormReviewStep from './steps/FormReviewStep';
import FormCompletionStep from './steps/FormCompletionStep';
import FormNavigation from './FormNavigation'; // [NEW]
import { Question } from '../../../types/formConfig';
import { getThemeStyles } from '../../../constants/formThemes';
import { validateField } from '../../../utils/formValidation'; // [NEW]

interface ApplyFormEngineProps {
    questions: Question[];
    onSubmit: (answers: Record<string, any>) => void;
    theme?: 'light' | 'dark';
    themeColor?: string;
    // Design additions
    fontFamily?: 'PRETENDARD' | 'NOTO_SERIF' | 'NANUM_SQUARE';
    buttonStyle?: 'rounded' | 'square' | 'pill';
    optionStyle?: 'rounded' | 'square' | 'pill';
    optionAlign?: 'left' | 'center';
    optionSize?: 'sm' | 'md' | 'lg';
    title?: string;
    description?: string;
    coverImage?: string;
    logoImage?: string; // [NEW]
    completionPage?: any;
}

const ApplyFormEngine: React.FC<ApplyFormEngineProps> = ({
    questions,
    onSubmit,
    theme = 'light',
    themeColor = 'indigo',
    fontFamily = 'PRETENDARD',
    buttonStyle,
    optionStyle,
    optionAlign,
    optionSize,
    title,
    description,
    coverImage,
    logoImage,
    completionPage
}) => {
    // 1. Theme Setup (Dynamic)
    // Memoize this to prevent re-calculations on every render
    const themeStyles = React.useMemo(() => getThemeStyles(themeColor, theme, {
        fontFamily,
        buttonStyle,
        optionStyle,
        optionAlign,
        optionSize
    }), [themeColor, theme, fontFamily, buttonStyle, optionStyle, optionAlign, optionSize]);

    // 2. Dynamic Mobile Theme Color (Browser Bar)
    useEffect(() => {
        const metaThemeColor = document.querySelector("meta[name='theme-color']");
        if (metaThemeColor) {
            // Light: #ffffff, Dark: #020617 (slate-950)
            metaThemeColor.setAttribute("content", theme === 'dark' ? '#020617' : '#ffffff');
        }
    }, [theme]);

    const [currentStep, setCurrentStep] = useState(-1); // -1: Cover Page
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [direction, setDirection] = useState(0); // 1: next, -1: prev
    const [isCompleted, setIsCompleted] = useState(false);
    const [error, setError] = useState<string | null>(null); // Validation error message

    const totalSteps = questions.length;
    const currentQuestion = currentStep === -1 ? null : questions[currentStep];

    // Clear error when changing steps
    useEffect(() => {
        setError(null);
    }, [currentStep]);

    // --- History API Integration ---
    // 브라우저 뒤로가기 처리를 위한 이벤트 리스너
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            setDirection(-1); // 뒤로가기 애니메이션 (Slide down/reverse)

            const state = event.state;
            if (state?.review) {
                // 리뷰 페이지로 복귀
                setIsReviewing(true);
            } else if (typeof state?.step === 'number') {
                // 특정 문항 단계로 복귀
                setIsReviewing(false);
                setCurrentStep(state.step);
            } else {
                // 초기 상태 or 알 수 없는 상태 -> 커버 페이지(-1)로 이동
                setIsReviewing(false);
                setCurrentStep(-1);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // [Refactored] validateField moved to utils/formValidation.ts

    // 이전 단계로 이동 (브라우저 뒤로가기 Trigger)
    const goPrev = () => {
        // History API를 이용해 뒤로가기 실행 -> popstate 이벤트 발생 -> handlePopState에서 UI 업데이트
        window.history.back();
    };

    // 답변 저장 및 자동 진행 (선택형 등에서 사용)
    const handleAnswer = (value: any, autoAdvance = false) => {
        if (!currentQuestion) return;
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));

        if (autoAdvance) {
            setTimeout(() => goNext(), 400); // 약간의 딜레이 후 전환
        }
    };

    // --- Review Step Logic ---
    const [isReviewing, setIsReviewing] = useState(false);

    const handleComplete = () => {
        onSubmit(answers);
        setIsCompleted(true);
    };

    const goNext = (force: any = false) => {
        // 'force' might be boolean or event object, so check strictly for true
        if (force !== true && currentQuestion) {
            const errorMsg = validateField(currentQuestion, answers[currentQuestion.id]);
            if (errorMsg) {
                setError(errorMsg);
                if (navigator.vibrate) navigator.vibrate(200);
                return;
            }
        }

        if (currentStep < totalSteps - 1) {
            setDirection(1);
            const nextStep = currentStep + 1;
            // 다음 단계 히스토리 추가
            window.history.pushState({ step: nextStep }, '', '');
            setCurrentStep(nextStep);
        } else {
            // Last step -> Go to Review instead of Complete
            // 리뷰 페이지 히스토리 추가
            window.history.pushState({ review: true }, '', '');
            setIsReviewing(true);
        }
    };

    // 애니메이션 변수
    const variants = {
        enter: (direction: number) => ({
            y: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            y: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            y: direction > 0 ? -50 : 50,
            opacity: 0,
        }),
    };


    // --- Review UI ---
    if (isReviewing && !isCompleted) {
        return (
            <FormReviewStep
                questions={questions}
                answers={answers}
                onSubmit={handleComplete}
                onEdit={() => setIsReviewing(false)}
                themeStyles={themeStyles}
            />
        );
    }

    if (isCompleted) {
        return (
            <FormCompletionStep
                completionPage={completionPage}
                themeStyles={themeStyles}
                variants={variants}
            />
        );
    }

    return (
        <FullscreenLayout bgColor={themeStyles.bg_app} className={themeStyles.font_family}>


            {/* 2. Main Content (Scrollable but 100% height focus) */}
            <div className="flex-1 relative flex flex-col overflow-hidden">
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute inset-0 flex flex-col px-6 py-4 overflow-y-auto overflow-x-hidden"
                    >
                        {/* Question Container */}
                        <div className={`flex-1 flex flex-col justify-start min-h-0 ${currentStep === -1 ? 'pt-4 pb-4' : 'pt-28 md:pt-36 pb-32'}`}>
                            {currentStep === -1 ? (
                                <ImmersiveCover
                                    title={title || ''}
                                    description={description || ''}
                                    coverImage={coverImage || ''}
                                    logoImage={logoImage}
                                    onStart={goNext}
                                    themeStyles={themeStyles}
                                    theme={theme}
                                />
                            ) : (
                                <ImmersiveFieldRenderer
                                    field={currentQuestion}
                                    value={answers[currentQuestion.id]}
                                    onChange={handleAnswer}
                                    onNext={goNext}
                                    onPrev={goPrev}
                                    error={error || undefined}
                                    themeStyles={themeStyles}
                                />
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 3. Navigation Controls (Extracted to FormNavigation) */}
            <FormNavigation
                currentStep={currentStep}
                totalSteps={totalSteps}
                currentQuestion={currentQuestion}
                answers={answers}
                theme={theme}
                themeStyles={themeStyles}
                onNext={goNext}
                onPrev={goPrev}
            />
        </FullscreenLayout>
    );
};

export default ApplyFormEngine;
