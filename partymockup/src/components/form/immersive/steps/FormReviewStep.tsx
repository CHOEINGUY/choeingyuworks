import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import FullscreenLayout from '../FullscreenLayout';

import { Question } from '../../../types/formConfig';

interface FormReviewStepProps {
    questions: Question[];
    answers: Record<string, any>;
    onSubmit: () => void;
    onEdit: () => void;
    themeStyles: any;
}

const FormReviewStep: React.FC<FormReviewStepProps> = ({ questions, answers, onSubmit, onEdit, themeStyles }) => {

    // Helper to format values
    const formatValue = (q: Question) => {
        let displayValue = answers[q.id];
        if (!displayValue) return <span className="text-slate-300 italic">미입력</span>;
        if (q.type === 'birth_date' && displayValue.length === 8) {
            return `${displayValue.substring(0, 4)}.${displayValue.substring(4, 6)}.${displayValue.substring(6, 8)}`;
        }
        if (q.type === 'single_choice' && q.options) {
            const opt = q.options.find((o: any) => o.value === displayValue);
            return opt ? opt.label : displayValue;
        }
        if (Array.isArray(displayValue)) return displayValue.join(', ');
        if (q.type === 'region' && typeof displayValue === 'object') {
            return `${displayValue.city} ${displayValue.district}`;
        }
        return displayValue;
    };

    // Filter fields to show in review
    // Fix: Use nullish coalescing to respect explicit 'false' setting
    // Logic: If showInReview is set (true/false), use it. If not, default to 'required'.
    // Logic: If showInReview is set (true/false), use it. If not, default to 'required'.
    // [MODIFIED] Explicitly exclude Image/File Uploads from review page
    const filteredFields = questions.filter(q =>
        (q.showInReview ?? q.required) &&
        q.type !== 'image_upload' &&
        q.type !== 'file_upload'
    );

    // Grouping Logic (Optional: Special layout for Name/Gender/Phone)
    // We can keep it simple or maintain the compact layout if fields exist
    const nameField = filteredFields.find(q => q.id === 'name' || q.label === '이름'); // Fallback to label for safety
    const genderField = filteredFields.find(q => q.id === 'gender' || q.label === '성별');
    const otherFields = filteredFields.filter(q => q !== nameField && q !== genderField);

    return (
        <FullscreenLayout bgColor={themeStyles.bg_app}>
            <div className={`flex-1 flex flex-col px-6 py-6 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-500`}>

                {/* Header */}
                <div className="text-center pt-8 md:pt-12 mb-8">
                    <div className={`inline-flex items-center justify-center p-3 rounded-full mb-4 ${themeStyles.highlight_bg} ${themeStyles.text_accent}`}>
                        <Check size={32} />
                    </div>
                    <h2 className={`text-2xl font-bold mb-2 ${themeStyles.text_primary}`}>마지막으로 확인해주세요</h2>
                    <p className={`text-base ${themeStyles.text_secondary}`}>
                        작성하신 필수 정보를 확인 후 제출해주세요.
                    </p>
                </div>

                {/* Review Card */}
                <div className="flex-1 overflow-y-auto min-h-0 mb-6 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className={`rounded-3xl p-6 space-y-6 shadow-sm border ${themeStyles.card_bg} ${themeStyles.border_base}`}>

                        {/* Compact Row for Name & Gender */}
                        {(nameField || genderField) && (
                            <div className={`flex items-center gap-4 pb-4 border-b ${themeStyles.border_base}`}>
                                {nameField && (
                                    <div className="flex-1">
                                        <span className={`block text-xs font-bold uppercase tracking-wider mb-1 ${themeStyles.text_tertiary}`}>
                                            {nameField.label || '이름'}
                                        </span>
                                        <span className={`text-lg font-medium ${themeStyles.text_primary}`}>
                                            {formatValue(nameField)}
                                        </span>
                                    </div>
                                )}
                                {genderField && (
                                    <div className="flex-1 border-l pl-4 dark:border-slate-700">
                                        <span className={`block text-xs font-bold uppercase tracking-wider mb-1 ${themeStyles.text_tertiary}`}>
                                            {genderField.label || '성별'}
                                        </span>
                                        <span className={`text-lg font-medium ${themeStyles.text_primary}`}>
                                            {formatValue(genderField)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Rest of the fields */}
                        {otherFields.map((q) => (
                            <div key={q.id} className={`flex flex-col border-b last:border-0 pb-4 last:pb-0 ${themeStyles.border_base}`}>
                                <span className={`text-xs font-bold uppercase tracking-wider mb-1 ${themeStyles.text_tertiary}`}>
                                    {q.label || q.title}
                                </span>
                                <span className={`text-lg font-medium break-words ${themeStyles.text_primary}`}>
                                    {formatValue(q)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pb-safe-bottom">
                    <button
                        onClick={onSubmit}
                        className={`w-full py-4 text-lg font-bold shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ${themeStyles.radius_button} ${themeStyles.button_bg} ${themeStyles.button_hover} ${themeStyles.button_text}`}
                    >
                        <span>최종 제출하기</span>
                        <ArrowRight size={20} />
                    </button>
                    <button
                        onClick={onEdit}
                        className={`w-full py-3 text-base font-medium transition-colors ${themeStyles.radius_button} ${themeStyles.text_secondary} hover:bg-slate-100 dark:hover:bg-slate-800`}
                    >
                        수정하기
                    </button>
                </div>
            </div>
        </FullscreenLayout>
    );
};

export default FormReviewStep;
