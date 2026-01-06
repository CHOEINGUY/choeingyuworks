import React, { useRef, useEffect } from 'react';
import InputSubmitButton from '../common/InputSubmitButton';

interface ImmersivePhoneInputProps {
    field: any;
    value: string;
    onChange: (value: string) => void;
    onNext: () => void;
    themeStyles: any;
}

const ImmersivePhoneInput: React.FC<ImmersivePhoneInputProps> = ({ field, value = '', onChange, onNext, themeStyles }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const formatPhoneNumber = (input: string) => {
        const cleaned = input.replace(/\D/g, '');
        let formatted = cleaned;

        if (cleaned.length > 3 && cleaned.length <= 7) {
            formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
        } else if (cleaned.length > 7) {
            formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
        }
        return formatted;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        // 최대 13자리 (010-0000-0000)
        if (formatted.length <= 13) {
            onChange(formatted);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // 11자리 숫자(하이픈 포함 13자리)일 때만 넘어감
            if (value.length === 13) onNext();
        }
    };

    return (
        <div className="w-full">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="tel"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="010-1234-5678"
                    className={`w-full bg-transparent border-b-2 py-4 text-3xl font-light focus:outline-none ${themeStyles.input_focus_border} transition-colors tracking-widest ${themeStyles.text_primary} ${themeStyles.border_base} placeholder:text-slate-400`}
                />

                <InputSubmitButton visible={value.length === 13} onClick={onNext} themeStyles={themeStyles} />
            </div>
        </div>
    );
};

export default ImmersivePhoneInput;
