import React from 'react';
import { ChevronDown } from 'lucide-react';
import FieldContainer from './FieldContainer';
import { FormField } from '../../../types/form';
import { ThemeStyles } from '../../../constants/formThemes';

interface DropdownFieldProps {
    field: FormField;
    value?: string;
    onChange: (value: string) => void;
    theme: ThemeStyles;
    error?: { message: string };
}

/**
 * 스모어 스타일 드롭다운 선택 필드
 */
const DropdownField: React.FC<DropdownFieldProps> = ({ field, value = '', onChange, theme, error }) => {
    return (
        <FieldContainer field={field} theme={theme} error={error} bodyClassName="flex-1 flex flex-col">
            {/* Dropdown */}
            <div className="space-y-4">
                <div className="relative max-w-lg mx-auto">
                    <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`w-full pb-3 text-lg font-semibold transition-all duration-300 outline-none appearance-none cursor-pointer ${error ? 'animate-shake' : ''
                            }`}
                        style={{
                            background: 'transparent',
                            color: theme.colors.text,
                            borderBottom: `2px solid ${error ? '#EF4444' : `${theme.colors.inputBorder}80`}`
                        }}
                        onFocus={(e) => {
                            e.target.style.borderBottomColor = theme.colors.primary;
                        }}
                        onBlur={(e) => {
                            e.target.style.borderBottomColor = error ? '#EF4444' : `${theme.colors.inputBorder}80`;
                        }}
                    >
                        <option value="" style={{ color: `${theme.colors.text}80` }}>선택해주세요</option>
                        {field.options?.map((option: any) => (
                            <option key={option.value} value={option.value} style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Custom dropdown arrow */}
                    <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: theme.colors.text }}
                    >
                        <ChevronDown size={20} />
                    </div>
                </div>

            </div>
        </FieldContainer>
    );
};

export default DropdownField;
