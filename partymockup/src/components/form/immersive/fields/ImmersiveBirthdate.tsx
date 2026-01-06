import React, { useRef, useEffect } from 'react';
import InputSubmitButton from '../common/InputSubmitButton';

interface ImmersiveBirthdateProps {
    field: {
        placeholder?: string;
    };
    value: string;
    onChange: (value: string) => void;
    onNext: () => void;
    themeStyles: any;
}

const ImmersiveBirthdate: React.FC<ImmersiveBirthdateProps> = ({ field, value = '', onChange, onNext, themeStyles }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length <= 8) {
            onChange(val);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && value.length === 8) {
            onNext();
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
                    placeholder={field.placeholder || "19990101"}
                    className={`w-full bg-transparent border-b-2 py-4 text-3xl font-light focus:outline-none ${themeStyles.input_focus_border} transition-colors tracking-widest ${themeStyles.text_primary} ${themeStyles.border_base} placeholder:text-slate-400`}
                />

                <InputSubmitButton visible={value.length === 8} onClick={onNext} themeStyles={themeStyles} />
            </div>
        </div>
    );
};

export default ImmersiveBirthdate;
