import React from 'react';
import { ProfileTheme } from '../../constants/profileTheme';

interface MBTISelectorProps {
    value: string;
    onChange: (value: string) => void;
    theme: ProfileTheme;
}

const MBTISelector: React.FC<MBTISelectorProps> = ({ value = '', onChange, theme }) => {
    // Current MBTI chars or placeholders
    const currentChars = (value || '____').split('');

    const pairs = [
        ['E', 'I'],
        ['S', 'N'],
        ['T', 'F'],
        ['J', 'P']
    ];

    const handleSelect = (index: number, char: string) => {
        const newChars = [...currentChars];
        newChars[index] = char;
        onChange(newChars.join(''));
    };

    return (
        <div className="flex flex-col gap-2">
            {pairs.map(([left, right], idx) => {
                const currentVal = currentChars[idx];
                return (
                    <div key={idx} className="flex w-full gap-2">
                        <button
                            type="button"
                            onClick={() => handleSelect(idx, left)}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${currentVal === left
                                ? theme.activeBtn
                                : theme.inactiveBtn
                                }`}
                        >
                            {left}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSelect(idx, right)}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${currentVal === right
                                ? theme.activeBtn
                                : theme.inactiveBtn
                                }`}
                        >
                            {right}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default MBTISelector;
