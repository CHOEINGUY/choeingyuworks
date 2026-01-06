import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Check, ArrowRight } from 'lucide-react';
import FlowProgressBar from './FlowProgressBar';
import { Question } from '../../../types/formConfig';

interface FormNavigationProps {
    currentStep: number;
    totalSteps: number;
    currentQuestion: Question | null;
    answers: Record<string, any>;
    theme: 'light' | 'dark';
    themeStyles: any;
    onNext: () => void;
    onPrev: () => void;
    isNextDisabled?: boolean;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
    currentStep,
    totalSteps,
    currentQuestion,
    answers,
    themeStyles,
    onNext,
    onPrev,
    isNextDisabled = false
}) => {
    // Hide for LongText or if invalid step
    if (currentStep < 0 || currentQuestion?.type === 'long_text') return null;

    return (
        <div
            className={`flex-none px-6 pt-4 bg-gradient-to-t z-10 relative ${themeStyles.nav_gradient}`}
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1.25rem)' }}
        >
            {/* Contextual Action Button (Floating above nav) */}
            <AnimatePresence mode="wait">
                {/* Multiple Choice Button (Split Layout) */}
                {currentQuestion?.type === 'multiple_choice' && Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].length > 0 && (
                    <motion.div
                        key="multi-choice-btn"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="absolute bottom-full left-0 w-full flex justify-center gap-3 pb-6 pointer-events-none px-6"
                    >
                        {/* Status Pill (Left) */}
                        <div className="pointer-events-auto bg-white border border-slate-100 shadow-xl rounded-full px-6 py-3 flex items-center justify-center min-w-[140px]">
                            <span className={`${themeStyles.text_accent} font-bold text-lg`}>
                                {answers[currentQuestion.id].length}개 선택됨
                            </span>
                        </div>

                        {/* Action Button (Right) */}
                        <button
                            onClick={onNext}
                            className={`pointer-events-auto flex-1 ${themeStyles.button_bg} ${themeStyles.button_hover} ${themeStyles.button_text} shadow-xl rounded-full px-8 py-3 flex items-center justify-center gap-2 font-bold text-lg active:scale-95 transition-all`}
                        >
                            <span>다음</span>
                            <ArrowRight size={20} strokeWidth={3} />
                        </button>
                    </motion.div>
                )}

                {/* Image Upload Button */}
                {currentQuestion?.type === 'image_upload' && answers[currentQuestion.id] && (
                    <motion.div
                        key="image-upload-btn"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="absolute bottom-full left-0 w-full flex justify-center pb-6 pointer-events-none"
                    >
                        <button
                            onClick={onNext}
                            className={`pointer-events-auto px-8 py-3 rounded-full font-black text-lg shadow-xl ${themeStyles.button_bg} ${themeStyles.button_hover} ${themeStyles.button_text} active:scale-95 transition-all flex items-center gap-2`}
                        >
                            <span>다음 단계</span>
                            <ChevronDown size={20} strokeWidth={3} />
                        </button>
                    </motion.div>
                )}

                {/* Payment Info Button (Fixed) */}
                {currentQuestion?.type === 'payment_info' && (
                    <motion.div
                        key="payment-btn"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ delay: 1.0, type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute bottom-full left-0 w-full flex justify-center gap-3 pb-6 pointer-events-none px-6"
                    >
                        <button
                            onClick={onNext}
                            className={`pointer-events-auto w-[90%] md:w-auto px-8 py-4 font-medium text-lg shadow-xl ${themeStyles.radius_button} ${themeStyles.button_bg} ${themeStyles.button_hover} ${themeStyles.button_text} active:scale-95 transition-all flex items-center justify-center gap-2`}
                        >
                            <span>신청 후 바로 입금할게요</span>
                            <Check size={20} className="stroke-[3]" />
                        </button>
                    </motion.div>
                )}

                {/* Notice Button (Fixed) */}
                {currentQuestion?.type === 'notice' && (
                    <motion.div
                        key="notice-btn"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute bottom-full left-0 w-full flex justify-center gap-3 pb-6 pointer-events-none px-6"
                    >
                        <button
                            onClick={onNext}
                            className={`pointer-events-auto w-[90%] md:w-auto px-8 py-4 font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ${themeStyles.radius_button} ${themeStyles.button_bg} ${themeStyles.button_hover} ${themeStyles.button_text}`}
                        >
                            <span>알겠습니다</span>
                            <ArrowRight size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Bar (Centered, 3/5 width) */}
            <div className="flex justify-center mb-6">
                <div className="w-[60%] mx-auto">
                    <FlowProgressBar current={currentStep} total={totalSteps} themeStyles={themeStyles} />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <button
                    onClick={onPrev}
                    className={`p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 active:scale-95 ${themeStyles.radius_button} ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                >
                    <ChevronUp size={24} />
                </button>

                <div className={`text-xs font-medium ${themeStyles.text_tertiary}`}>
                    {currentStep + 1} / {totalSteps}
                </div>
                {/* Next Button */}
                <button
                    onClick={onNext}
                    disabled={isNextDisabled}
                    className={`p-4 shadow-xl transition-all active:scale-95 flex items-center justify-center ${themeStyles.radius_button} ${themeStyles.button_bg} ${themeStyles.button_text} ${themeStyles.button_hover}
                     ${isNextDisabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                >
                    <ChevronDown size={24} />
                </button>
            </div>
        </div>
    );
};

export default FormNavigation;
