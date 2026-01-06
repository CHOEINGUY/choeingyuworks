import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import FullscreenLayout from '../FullscreenLayout';

interface FormCompletionStepProps {
    completionPage?: {
        title?: string;
        description?: string;
    };
    themeStyles: any;
    variants?: any;
}

const FormCompletionStep: React.FC<FormCompletionStepProps> = ({ completionPage, themeStyles, variants }) => {
    return (
        <FullscreenLayout bgColor={themeStyles.bg_app}>
            <motion.div
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${themeStyles.bg_app}`}
            >
                <div className={`w-24 h-24 ${themeStyles.highlight_bg} ${themeStyles.text_accent} rounded-full flex items-center justify-center mb-8 shadow-sm`}>
                    <Check size={48} strokeWidth={3} />
                </div>
                <h1 className={`text-3xl font-black mb-4 whitespace-pre-wrap break-keep break-words leading-tight ${themeStyles.text_primary}`}>
                    {completionPage?.title || "신청이 완료되었습니다"}
                </h1>
                <p className={`text-lg leading-relaxed whitespace-pre-wrap break-keep break-words mb-12 max-w-sm ${themeStyles.text_secondary}`}>
                    {completionPage?.description || "검토 후 순차적으로 연락드리겠습니다."}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className={`px-10 py-4 font-bold text-lg rounded-2xl transition-colors shadow-lg active:scale-95 ${themeStyles.button_bg} ${themeStyles.button_hover} ${themeStyles.button_text}`}
                >
                    확인
                </button>
            </motion.div>
        </FullscreenLayout>
    );
};

export default FormCompletionStep;
