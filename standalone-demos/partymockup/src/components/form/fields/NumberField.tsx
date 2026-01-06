import React, { useRef, useEffect } from 'react';
import FieldContainer from './FieldContainer';
import { FormField } from '../../../types/form';
import { ThemeStyles } from '../../../constants/formThemes';

interface NumberFieldProps {
    field: FormField;
    value?: string;
    onChange: (value: string) => void;
    theme: ThemeStyles;
    error?: { message: string };
}

/**
 * 스모어 스타일 숫자 입력 필드
 */
const NumberField: React.FC<NumberFieldProps> = ({ field, value = '', onChange, theme, error }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = e.target.value.replace(/[^\d]/g, '');

        // Allow free typing; boundary checks run during form validation
        onChange(numericValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const navigationKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'];
        const isShortcut = (e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase());

        if (navigationKeys.includes(e.key) || isShortcut) {
            return;
        }

        if (/^\d$/.test(e.key)) {
            return;
        }

        e.preventDefault();
    };

    return (
        <FieldContainer field={field} theme={theme} error={error} bodyClassName="flex-1 flex flex-col">
            {/* Input */}
            <div className="space-y-4">
                <div className="relative max-w-xl mx-auto">
                    <input
                        ref={inputRef}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        value={value}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={field.placeholder}
                        className={`w-full pb-3 text-2xl font-bold text-center transition-all duration-300 outline-none placeholder:opacity-40 ${error ? 'animate-shake' : ''
                            }`}
                        style={{
                            color: theme.colors.text,
                            borderBottom: `2px solid ${error ? '#EF4444' : `${theme.colors.inputBorder}80`}`,
                            background: 'transparent',
                            caretColor: theme.colors.primary
                        }}
                        onFocus={(e) => {
                            e.target.style.borderBottomColor = theme.colors.primary;
                        }}
                        onBlur={(e) => {
                            e.target.style.borderBottomColor = error ? '#EF4444' : `${theme.colors.inputBorder}80`;
                        }}
                    />
                </div>

                {field.validation && (
                    <div className="text-center text-sm opacity-60 font-medium" style={{ color: theme.colors.text }}>
                        {field.validation.min && field.validation.max &&
                            `${field.validation.min} ~ ${field.validation.max}`
                        }
                    </div>
                )}

            </div>
        </FieldContainer>
    );
};

export default NumberField;
