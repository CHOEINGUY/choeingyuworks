import React, { useRef, useEffect } from 'react';
import FieldContainer from './FieldContainer';
import { FormField } from '../../../types/form';
import { ThemeStyles } from '../../../constants/formThemes';

interface LongTextFieldProps {
    field: FormField;
    value?: string;
    onChange: (value: string) => void;
    theme: ThemeStyles;
    error?: { message: string };
}

/**
 * 스모어 스타일 장문형 텍스트 입력 필드
 */
const LongTextField: React.FC<LongTextFieldProps> = ({ field, value = '', onChange, theme, error }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;

        if (field.validation?.maxLength && newValue.length > field.validation.maxLength) {
            return;
        }

        onChange(newValue);
    };

    return (
        <FieldContainer field={field} theme={theme} error={error} bodyClassName="flex-1 flex flex-col">
            {/* Textarea */}
            <div className="space-y-4">
                <div className="relative max-w-2xl mx-auto">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        rows={6}
                        className={`w-full pb-3 text-base font-medium transition-all duration-300 outline-none resize-none placeholder:opacity-40 ${error ? 'animate-shake' : ''
                            }`}
                        style={{
                            background: 'transparent',
                            color: theme.colors.text,
                            borderBottom: `2px solid ${error ? '#EF4444' : `${theme.colors.inputBorder}80`}`,
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

                {field.validation?.maxLength && (
                    <div className="text-center text-sm opacity-60 font-medium" style={{ color: theme.colors.text }}>
                        {value.length} / {field.validation.maxLength}자
                    </div>
                )}
            </div>
        </FieldContainer>
    );
};

export default LongTextField;
