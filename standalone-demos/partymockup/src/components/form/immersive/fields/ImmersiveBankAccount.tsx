import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const BANK_LIST = [
    'KB국민은행', '신한은행', '우리은행', '하나은행', 'NH농협은행',
    'IBK기업은행', '카카오뱅크', '토스뱅크', '케이뱅크',
    'SC제일은행', '우체국', '대구은행', '부산은행', '광주은행',
    '제주은행', '전북은행', '경남은행', '새마을금고', '신협', '수협',
    '산업은행', '씨티은행', '저축은행', '산림조합'
];

interface ImmersiveBankAccountProps {
    field: any;
    value: string;
    onChange: (value: string) => void;
    onNext: () => void;
    themeStyles: any;
}

const ImmersiveBankAccount: React.FC<ImmersiveBankAccountProps> = ({ field, value, onChange, onNext, themeStyles }) => {
    // 1. Unified Text State
    const [text, setText] = useState('');

    // Sync with Props
    useEffect(() => {
        if (!value) return;
        // If coming from "Bank | Account" format, join them
        if (value.includes(' | ')) {
            setText(value.replace(' | ', ' '));
        } else {
            setText(value);
        }
    }, [value]);

    const inputRef = useRef<HTMLInputElement>(null);

    // 2. Bank Detection Logic
    // We check if the text STARTS with any known bank
    const detectedBank = useMemo(() => {
        return BANK_LIST.find(bank => text.startsWith(bank));
    }, [text]);

    // 3. Suggestions Logic
    const suggestions = useMemo(() => {
        // If we already detected a bank, no need for suggestions (unless we want to allow changing?)
        // Let's hide suggestions if a bank is already "locked in" (detected at start)
        if (detectedBank) return [];

        // Filter based on text
        // Note: text might be "국민" -> match "KB국민은행"
        // But also, handle case where text is empty -> show all or popular? Show all.
        const cleanText = text.trim();
        if (!cleanText) return BANK_LIST; // Show generic list
        return BANK_LIST.filter(bank => bank.includes(cleanText));
    }, [text, detectedBank]);

    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setText(newVal);
        onChange(newVal);
    };

    const handleSuggestionClick = (bankName: string) => {
        // Replace current text with BankName + Space
        // We assume usage is "Bank first".
        const newText = `${bankName} `;
        setText(newText);
        onChange(newText);

        // Focus back and ensure cursor is at end
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setTimeout(() => {
            const container = document.getElementById('immersive-question-container');
            if (container) {
                container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 300);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // Allow next if text is sufficient (simple check: length > 3?)
            if (text.length > 3) {
                onNext();
            }
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="space-y-4">
                <div className="relative">
                    <label className={`block text-xs font-bold uppercase mb-1.5 ml-1 ${themeStyles?.text_tertiary}`}>
                        환불 계좌 정보
                    </label>

                    {/* Input Field */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={text}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                        placeholder="예) 카카오뱅크 3333-00-1111111"
                        className={`w-full p-4 text-lg font-medium rounded-xl border outline-none transition-all ${themeStyles?.input_bg} ${themeStyles?.text_primary} ${themeStyles?.border_base} ${themeStyles?.input_focus_border} focus:ring-4 focus:ring-indigo-500/10 placeholder-slate-400`}
                    />


                </div>

                {/* Suggestions List (Only show if no bank detected yet) */}
                <AnimatePresence>
                    {!detectedBank && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid grid-cols-2 md:grid-cols-3 gap-2 overflow-hidden"
                        >
                            {suggestions.slice(0, 9).map(bank => (
                                <button
                                    key={bank}
                                    onClick={() => handleSuggestionClick(bank)}
                                    className={`p-3 text-sm rounded-lg border transition-all text-left truncate ${themeStyles?.bg_base} ${themeStyles?.border_base} hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 ${themeStyles?.text_secondary}`}
                                >
                                    {bank}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Confirm Button */}
                {text.length > 3 && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key="confirm-btn"
                        onClick={onNext}
                        className={`w-full py-4 mt-8 font-bold rounded-xl ${themeStyles.button_text || 'text-white'} shadow-lg active:scale-95 transition-all text-lg flex items-center justify-center gap-2 ${themeStyles?.button_bg} ${themeStyles?.button_hover}`}
                    >
                        <span>확인</span>
                        <Check size={20} />
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default ImmersiveBankAccount;
