import React, { useState } from 'react';
import { ProfileTheme } from '../../constants/profileTheme';

interface HobbySelectorProps {
    hobbies: string[];
    onChange: (hobbies: string[]) => void;
    theme: ProfileTheme;
}

const HobbySelector: React.FC<HobbySelectorProps> = ({ hobbies = [], onChange, theme }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (!inputValue.trim()) return;
        const tag = inputValue.trim();
        if (hobbies.includes(tag)) {
            setInputValue('');
            return;
        }

        const newHobbies = [...hobbies, tag];
        onChange(newHobbies);
        setInputValue('');
    };

    const handleRemove = (tagToRemove: string) => {
        const newHobbies = hobbies.filter(tag => tag !== tagToRemove);
        onChange(newHobbies);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus-within:ring-2 ${theme.inputRing} transition-all`}>
            <div className="flex flex-wrap gap-2 mb-2">
                {hobbies.map((tag, index) => (
                    <span key={index} className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium ${theme.tagBg}`}>
                        {tag}
                        <button
                            type="button"
                            onClick={() => handleRemove(tag)}
                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-white/50 transition-colors pointer-events-auto"
                        >
                            &times;
                        </button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="태그 입력 후 엔터 (예: 요리)"
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm p-0 placeholder-gray-400"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg ${theme.addBtn} transition-colors`}
                >
                    추가
                </button>
            </div>
        </div>
    );
};

export default HobbySelector;
