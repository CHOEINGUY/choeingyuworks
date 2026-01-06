import React, { useRef, useEffect } from 'react';
import { Check, ChevronLeft } from 'lucide-react';

interface ImmersiveLongTextProps {
    field: {
        placeholder?: string;
    };
    value: string;
    onChange: (value: string) => void;
    onNext: () => void;
    onPrev: () => void;
    themeStyles: any;
}

const ImmersiveLongText: React.FC<ImmersiveLongTextProps> = ({ field, value = '', onChange, onNext, onPrev, themeStyles }) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        // Use the explicit ID we added to the container in ImmersiveFieldRenderer
        const container = document.getElementById('immersive-question-container');

        if (container) {
            // Android Chrome needs a slight delay for the keyboard to resize the viewport
            setTimeout(() => {
                container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full">
            <div className="relative">
                <textarea
                    ref={inputRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={handleFocus}
                    placeholder={field.placeholder || "내용을 입력해주세요"}
                    className={`w-full h-80 border rounded-2xl p-6 text-xl font-light focus:outline-none ${themeStyles.input_focus_border} focus:ring-1 ${themeStyles.ring_focus} transition-all resize-none leading-relaxed ${themeStyles.input_bg} ${themeStyles.border_base} ${themeStyles.text_primary} placeholder:text-slate-400`}
                />
            </div>

            <div className="mt-6 flex justify-between items-center">
                {/* Local Back Button */}
                <button
                    onClick={onPrev}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${themeStyles.text_secondary}`}
                >
                    <ChevronLeft size={24} />
                    <span>이전</span>
                </button>

                {/* Local Next Button */}
                <button
                    onClick={onNext}
                    disabled={!value}
                    className={`
                flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all shadow-md active:scale-95
                ${value
                            ? `${themeStyles.button_bg} ${themeStyles.button_text} ${themeStyles.button_hover} shadow-xl`
                            : `${themeStyles.input_bg} ${themeStyles.text_tertiary}`
                        }
            `}
                >
                    <span>다음</span>
                    <Check size={20} className="stroke-[3]" />
                </button>
            </div>
        </div>
    );
};

export default ImmersiveLongText;
