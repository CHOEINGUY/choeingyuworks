import React, { useEffect, useRef } from 'react';
import InputSubmitButton from '../common/InputSubmitButton';

interface ImmersiveShortTextProps {
    field: {
        type: string;
        placeholder?: string;
    };
    value: string;
    onChange: (value: string) => void;
    onNext: () => void;
    themeStyles: any;
}

const ImmersiveShortText: React.FC<ImmersiveShortTextProps> = ({ field, value = '', onChange, onNext, themeStyles }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // 애니메이션 후 포커스 (약간의 지연)
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (value) onNext();
        }
    };

    return (
        <div className="w-full">
            <div className="relative">
                <input
                    ref={inputRef}
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={field.placeholder || '답변을 입력해주세요'}
                    className={`w-full bg-transparent border-b-2 py-4 text-3xl font-light focus:outline-none ${themeStyles.input_focus_border} transition-colors ${themeStyles.text_primary} ${themeStyles.border_base} placeholder:text-slate-400`}
                />

                {/* Enter Hint / Button */}
                <InputSubmitButton visible={!!value} onClick={onNext} themeStyles={themeStyles} />
            </div>
        </div>
    );
};

export default ImmersiveShortText;
