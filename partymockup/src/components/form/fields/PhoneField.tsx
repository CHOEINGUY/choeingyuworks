import React, { useRef, useEffect } from 'react';
import FieldContainer from './FieldContainer';
import { FormField } from '../../../types/form';
import { ThemeStyles } from '../../../constants/formThemes';

interface PhoneFieldProps {
    field: FormField;
    value?: string;
    onChange: (value: string) => void;
    theme: ThemeStyles;
    error?: { message: string };
}

/**
 * 스모어 스타일 전화번호 입력 필드
 */
const PhoneField: React.FC<PhoneFieldProps> = ({ field, value = '', onChange, theme, error }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const formatPhoneNumber = (input: string) => {
        const numbers = input.replace(/[^\d]/g, '');
        const limited = numbers.slice(0, 11);

        if (limited.length <= 3) {
            return limited;
        } else if (limited.length <= 7) {
            return `${limited.slice(0, 3)}-${limited.slice(3)}`;
        } else {
            return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        onChange(formatted);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const target = e.target as HTMLInputElement;
            target.blur();
            setTimeout(() => {
                const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
                window.dispatchEvent(event);
            }, 100);
        }
    };

    return (
        <FieldContainer field={field} theme={theme} error={error} bodyClassName="flex-1 flex flex-col">
            {/* Input */}
            <div className="space-y-4">
                <div className="relative max-w-xl mx-auto">
                    <input
                        ref={inputRef}
                        type="tel"
                        value={value}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={field.placeholder}
                        className={`w-full pb-3 text-2xl font-bold tracking-widest transition-all duration-300 outline-none placeholder:opacity-40 text-center ${error ? 'animate-shake' : ''
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

            </div>
        </FieldContainer>
    );
};

export default PhoneField;
