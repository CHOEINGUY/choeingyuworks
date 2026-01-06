import React from 'react';
import { Check } from 'lucide-react';
import FieldContainer from './FieldContainer';
import { FormField } from '../../../types/form';
import { ThemeStyles } from '../../../constants/formThemes';

interface MultipleChoiceFieldProps {
    field: FormField;
    value?: string[];
    onChange: (value: string[]) => void;
    theme: ThemeStyles;
    error?: { message: string };
    listStyleMode?: string;
}

const getListStyles = (mode: string, theme: ThemeStyles) => {
    switch (mode) {
        case 'snap':
            return {
                wrapperClass: '',
                containerClass: 'snap-y snap-mandatory overflow-y-auto scroll-smooth',
                itemClass: 'snap-start',
                overlayTop: null,
                overlayBottom: null
            };
        case 'carousel':
            return {
                wrapperClass: '',
                containerClass: 'overflow-x-auto overflow-y-hidden scroll-smooth pb-2',
                itemClass: '',
                overlayTop: null,
                overlayBottom: null
            };
        case 'fade-scroll':
        default:
            return {
                wrapperClass: '',
                containerClass: 'overflow-y-auto scroll-smooth px-1',
                itemClass: '',
                overlayTop: null,
                overlayBottom: null
            };
    }
};

/**
 * 스모어 스타일 객관식 복수 선택 필드
 */
const MultipleChoiceField: React.FC<MultipleChoiceFieldProps> = ({ field, value = [], onChange, theme, error, listStyleMode = 'fade-scroll' }) => {
    const handleToggle = (optionValue: string) => {
        const currentArray = Array.isArray(value) ? value : [];

        if (currentArray.includes(optionValue)) {
            onChange(currentArray.filter(v => v !== optionValue));
        } else {
            const maxSelect = field.validation?.maxSelect;
            if (maxSelect && currentArray.length >= maxSelect) {
                return;
            }
            onChange([...currentArray, optionValue]);
        }
    };

    const selectedCount = Array.isArray(value) ? value.length : 0;
    const maxSelect = field.validation?.maxSelect;

    const { containerClass, itemClass, overlayTop, overlayBottom, wrapperClass } = getListStyles(listStyleMode, theme);

    return (
        <FieldContainer
            field={field}
            theme={theme}
            error={error}
            description={field.description}
            bodyClassName="flex-1 flex flex-col"
        >
            {maxSelect && (
                <p className="text-sm opacity-60 font-medium text-center mb-2 shrink-0" style={{ color: theme.colors.text }}>
                    {selectedCount} / {maxSelect} 선택됨
                </p>
            )}

            <div className={`flex-1 flex flex-col min-h-0 ${wrapperClass || ''}`}>
                <div className={`relative flex-1 min-h-0 ${containerClass}`}>
                    {overlayTop}
                    {overlayBottom}
                    <div className={`${listStyleMode === 'carousel' ? 'flex gap-3' : 'grid grid-cols-2 sm:grid-cols-3 gap-3'}`}>
                        {field.options?.map((option: any, index: number) => {
                            const isSelected = Array.isArray(value) && value.includes(option.value);

                            // Unified Sizing Logic
                            const hasLongText = field.options?.some((opt: any) => opt.label?.length > 28);
                            const shouldUseCompactMode = hasLongText;

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleToggle(option.value)}
                                    className={`${listStyleMode === 'carousel' ? 'min-w-[200px]' : ''} px-4 py-4 text-base font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-[80px] shrink-0 ${itemClass}`}
                                    style={{
                                        background: isSelected
                                            ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
                                            : `linear-gradient(135deg, ${theme.colors.card}90, ${theme.colors.input}80)`,
                                        color: isSelected ? '#FFFFFF' : theme.colors.text,
                                        border: `2px solid ${isSelected ? theme.colors.primary : `${theme.colors.inputBorder}40`}`,
                                        borderRadius: '16px',
                                        animationDelay: `${index * 50}ms`,
                                        boxShadow: isSelected
                                            ? `0 8px 24px ${theme.colors.primary}30, inset 0 1px 0 rgba(255,255,255,0.2)`
                                            : `0 4px 12px ${theme.colors.primary}08, inset 0 1px 0 rgba(255,255,255,0.1)`,
                                        opacity: !isSelected && maxSelect && selectedCount >= maxSelect ? 0.5 : 1
                                    }}
                                    disabled={!isSelected && !!maxSelect && selectedCount >= maxSelect}
                                >
                                    {/* Shimmer effect when selected */}
                                    {isSelected && (
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-16"
                                            style={{
                                                background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
                                                backgroundSize: '200% 100%',
                                                animation: 'shimmer 2s infinite'
                                            }}
                                        />
                                    )}

                                    {/* Emoji */}
                                    {option.emoji && (
                                        <span
                                            className="text-2xl transition-all duration-300"
                                            style={{
                                                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                                filter: isSelected ? 'drop-shadow(0 0 6px rgba(255,255,255,0.5))' : 'none'
                                            }}
                                        >
                                            {option.emoji}
                                        </span>
                                    )}

                                    {/* Label - Updated to support dynamic sizing but REMOVED multiline support */}
                                    <span className={`text-center leading-tight px-1 ${shouldUseCompactMode ? 'text-sm' : 'text-base'}`}>{option.label}</span>

                                    {/* Check mark */}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                            <Check size={12} className="text-white" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </FieldContainer>
    );
};

export default MultipleChoiceField;
