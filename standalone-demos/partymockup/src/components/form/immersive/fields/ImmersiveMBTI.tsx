import React from 'react';
import { motion } from 'framer-motion';

interface ImmersiveMBTIProps {
    field: any;
    value: string;
    onChange: (value: string) => void;
    onNext: (autoNext?: boolean) => void;
    themeStyles: any;
}

const ImmersiveMBTI: React.FC<ImmersiveMBTIProps> = ({ field, value, onChange, onNext, themeStyles }) => {
    // Current MBTI chars or placeholders
    // value format: "ESTJ" or undefined/null
    const currentChars = (value || '____').split('');

    const pairs = [
        ['E', 'I'],
        ['S', 'N'],
        ['T', 'F'],
        ['J', 'P']
    ];

    const labels: Record<string, string> = {
        'E': '외향형', 'I': '내향형',
        'S': '감각형', 'N': '직관형',
        'T': '사고형', 'F': '감정형',
        'J': '판단형', 'P': '인식형'
    };

    const handleSelect = (index: number, char: string) => {
        const newChars = [...currentChars];
        newChars[index] = char;
        const newValue = newChars.join('');
        onChange(newValue);

        // Auto-advance if all 4 are selected
        if (!newValue.includes('_')) {
            setTimeout(() => {
                onNext(true);
            }, 500);
        }
    };

    return (
        <div className="w-full flex flex-col gap-3 py-2">
            {pairs.map(([left, right], idx) => {
                const currentVal = currentChars[idx];
                const isLeftSelected = currentVal === left;
                const isRightSelected = currentVal === right;

                return (
                    <div key={idx} className="flex w-full gap-3">
                        {/* Left Option */}
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => handleSelect(idx, left)}
                            className={`flex-1 py-4 px-2 rounded-xl text-lg font-bold transition-all relative border overflow-hidden
                                ${isLeftSelected
                                    ? `${themeStyles.border_checked} ${themeStyles.solid_bg} ${themeStyles.solid_text} shadow-md`
                                    : `${themeStyles.card_bg} ${themeStyles.border_base} ${themeStyles.text_secondary} hover:bg-slate-50 dark:hover:bg-slate-800`
                                }
                            `}
                        >
                            <span className="relative z-10 flex flex-col items-center">
                                <span className="text-xl">{left}</span>
                                <span className="text-xs opacity-80 font-normal mt-1">{labels[left]}</span>
                            </span>
                        </motion.button>

                        {/* Right Option */}
                        <motion.button
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => handleSelect(idx, right)}
                            className={`flex-1 py-4 px-2 rounded-xl text-lg font-bold transition-all relative border overflow-hidden
                                ${isRightSelected
                                    ? `${themeStyles.border_checked} ${themeStyles.solid_bg} ${themeStyles.solid_text} shadow-md`
                                    : `${themeStyles.card_bg} ${themeStyles.border_base} ${themeStyles.text_secondary} hover:bg-slate-50 dark:hover:bg-slate-800`
                                }
                            `}
                        >
                            <span className="relative z-10 flex flex-col items-center">
                                <span className="text-xl">{right}</span>
                                <span className="text-xs opacity-80 font-normal mt-1">{labels[right]}</span>
                            </span>
                        </motion.button>
                    </div>
                );
            })}
        </div>
    );
};

export default ImmersiveMBTI;
