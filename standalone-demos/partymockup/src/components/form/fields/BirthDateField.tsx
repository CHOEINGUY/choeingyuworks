import React, { useRef, useEffect } from 'react';
import FieldContainer from './FieldContainer';
import { FormField } from '../../../types/form';
import { ThemeStyles } from '../../../constants/formThemes';

interface BirthDateFieldProps {
    field: FormField;
    value?: string;
    onChange: (value: string) => void;
    theme: ThemeStyles;
    error?: { message: string };
}

/**
 * 스모어 스타일 생년월일 입력 필드 (8자리)
 * YYYYMMDD 형식
 */
const BirthDateField: React.FC<BirthDateFieldProps> = ({ field, value = '', onChange, theme, error }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 숫자만 추출
        const numbers = e.target.value.replace(/[^\d]/g, '');

        // 최대 8자리
        const limited = numbers.slice(0, 8);

        onChange(limited);
    };

    const formatDisplay = (input: string) => {
        if (input.length <= 4) return input;
        if (input.length <= 6) return `${input.slice(0, 4)}.${input.slice(4)}`;
        return `${input.slice(0, 4)}.${input.slice(4, 6)}.${input.slice(6, 8)}`;
    };

    // description에서 예시 부분 제거 (예: 19950101 같은 부분)
    const cleanDescription = field.description
        ? field.description.replace(/\s*\(예[^)]*\)/g, '').replace(/\s*예:\s*[0-9]+/g, '').trim()
        : null;

    return (
        <FieldContainer field={field} theme={theme} error={error} description={cleanDescription} bodyClassName="flex-1 flex flex-col">
            {/* Input */}
            <div className="space-y-4">
                <div className="relative max-w-xl mx-auto">
                    <input
                        ref={inputRef}
                        type="tel"
                        value={formatDisplay(value)}
                        onChange={handleChange}
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

                {/* Format Hint */}
                {value.length > 0 && value.length < 8 && (
                    <div
                        className="text-center text-sm opacity-60 font-medium"
                        style={{ color: theme.colors.text }}
                    >
                        {value.length} / 8자
                    </div>
                )}

            </div>
        </FieldContainer>
    );
};

export default BirthDateField;
