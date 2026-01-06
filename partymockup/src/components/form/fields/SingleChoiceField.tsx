import React, { useEffect, useRef, useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import FieldContainer from './FieldContainer';
import { FormField } from '../../../types/form';
import { ThemeStyles } from '../../../constants/formThemes';

interface SingleChoiceFieldProps {
    field: FormField;
    value?: string | any[];
    onChange: (value: string | any) => void;
    theme: ThemeStyles;
    error?: { message: string };
    listStyleMode?: 'snap' | 'carousel' | 'fade-scroll' | string;
}

const getListStyles = (mode: string, theme: ThemeStyles) => {
    switch (mode) {
        case 'snap':
            return {
                wrapperClass: '',
                containerClass: 'overflow-y-auto scroll-smooth',
                itemClass: '',
                overlayTop: null,
                overlayBottom: null,
                snapEnabled: true
            };
        case 'carousel':
            return {
                wrapperClass: '',
                containerClass: 'overflow-x-auto overflow-y-hidden scroll-smooth pb-2',
                itemClass: '',
                overlayTop: null,
                overlayBottom: null,
                snapEnabled: false
            };
        case 'fade-scroll':
        default:
            return {
                wrapperClass: '',
                containerClass: 'overflow-y-auto scroll-smooth px-1',
                itemClass: '',
                overlayTop: null,
                overlayBottom: null,
                snapEnabled: false
            };
    }
};

/**
 * 스모어 스타일 객관식 단일 선택 필드
 */
const SingleChoiceField: React.FC<SingleChoiceFieldProps> = ({ field, value = '', onChange, theme, error, listStyleMode = 'fade-scroll' }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const [visibleOptions, setVisibleOptions] = useState<Record<string, boolean>>({});

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
    };

    const { containerClass, itemClass, overlayTop, overlayBottom, wrapperClass, snapEnabled } = getListStyles(listStyleMode, theme);

    // q10 (field_available_date)에 스크롤 스냅 적용 (강제)
    const shouldUseSnap = snapEnabled || field.id === 'field_available_date';
    const snapContainerClass = shouldUseSnap ? 'snap-y snap-mandatory scroll-py-3' : '';
    const listLayoutClass = shouldUseSnap
        ? 'flex flex-col gap-3'
        : listStyleMode === 'carousel'
            ? 'flex gap-3'
            : `grid gap-3 ${field.options && field.options.length <= 4 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 sm:grid-cols-2'}`;

    const markInitiallyVisible = () => {
        if (!containerRef.current || !field.options?.length) return;
        const rootRect = containerRef.current.getBoundingClientRect();
        setVisibleOptions((prev) => {
            const next = { ...prev };
            field.options?.forEach((option: any) => {
                const node = optionRefs.current[option.value];
                if (!node) return;
                const rect = node.getBoundingClientRect();
                const intersects =
                    rect.bottom >= rootRect.top + rootRect.height * -0.05 &&
                    rect.top <= rootRect.bottom + rootRect.height * 0.05;
                if (intersects) {
                    next[option.value] = true;
                }
            });
            return next;
        });
    };

    useEffect(() => {
        const root = containerRef.current;
        if (!root || !field.options?.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                setVisibleOptions((prev) => {
                    const next = { ...prev };
                    entries.forEach((entry) => {
                        const key = (entry.target as HTMLElement).dataset.value;
                        if (!key) return;
                        if (entry.isIntersecting) {
                            next[key] = true;
                        } else {
                            // keep once visible to avoid flicker
                            next[key] = next[key] || false;
                        }
                    });
                    return next;
                });
            },
            {
                root,
                threshold: 0.2
            }
        );

        field.options.forEach((option: any) => {
            const node = optionRefs.current[option.value];
            if (node) {
                observer.observe(node);
            }
        });

        // 초기 가시 항목 한 번 계산 (Observer 신호가 늦을 경우 대비)
        markInitiallyVisible();

        return () => {
            observer.disconnect();
        };
    }, [field.options]);

    return (
        <FieldContainer field={field} theme={theme} error={error} bodyClassName="flex-1 flex flex-col">
            <div className={`flex-1 flex flex-col min-h-0 ${wrapperClass || ''}`}>
                <div
                    className={`relative flex-1 min-h-0 ${containerClass} ${snapContainerClass}`}
                    ref={containerRef}
                    style={shouldUseSnap ? {
                        scrollSnapType: 'y mandatory',
                        WebkitOverflowScrolling: 'touch'
                    } : {}}
                >
                    {overlayTop}
                    {overlayBottom}
                    <div className={listLayoutClass}>
                        {field.options?.map((option: any, index: number) => {
                            const isSelected = value === option.value;

                            // Unified Sizing Logic
                            const hasLongText = field.options?.some((opt: any) => opt.label?.length > 28);
                            const shouldUseCompactMode = hasLongText;

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    ref={(node) => {
                                        optionRefs.current[option.value] = node;
                                    }}
                                    data-value={option.value}
                                    className={`${listStyleMode === 'carousel' ? 'min-w-[260px]' : 'w-full'} ${shouldUseCompactMode ? 'px-4 py-3 min-h-[50px] text-sm' : 'px-4 py-4 min-h-[60px] text-base'} font-semibold flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden shrink-0 ${itemClass} ${shouldUseSnap ? 'snap-start' : ''}`}
                                    style={{
                                        ...(shouldUseSnap ? {
                                            scrollSnapAlign: 'start',
                                            scrollSnapStop: 'always'
                                        } : {}),
                                        transform: visibleOptions[option.value] ? 'translateY(0) scale(1)' : 'translateY(80px) scale(0.9)',
                                        opacity: visibleOptions[option.value] ? 1 : 0,
                                        transition: 'transform 1100ms cubic-bezier(0.16,1,0.3,1), opacity 1100ms cubic-bezier(0.16,1,0.3,1), box-shadow 600ms ease-out',
                                        willChange: 'transform, opacity',
                                        boxShadow: isSelected
                                            ? `0 20px 44px ${theme.colors.primary}35, 0 10px 28px ${theme.colors.primary}22, inset 0 1px 0 rgba(255,255,255,0.25)`
                                            : `0 6px 20px ${theme.colors.primary}14, inset 0 1px 0 rgba(255,255,255,0.1)`,
                                        background: isSelected
                                            ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
                                            : `linear-gradient(135deg, ${theme.colors.card}90, ${theme.colors.input}80)`,
                                        color: isSelected ? '#FFFFFF' : theme.colors.text,
                                        border: `2px solid ${isSelected ? theme.colors.primary : `${theme.colors.inputBorder}40`}`,
                                        borderRadius: '20px',
                                        animationDelay: `${index * 120}ms`,
                                        opacity: !isSelected && field.validation?.maxSelect && Array.isArray(value) && value.length >= field.validation.maxSelect ? 0.5 : (visibleOptions[option.value] ? 1 : 0)
                                    }}
                                    disabled={
                                        !isSelected &&
                                        field.validation?.maxSelect &&
                                        Array.isArray(value) &&
                                        value.length >= (field.validation.maxSelect || 0)
                                    }
                                >
                                    {/* Shimmer effect when selected */}
                                    {isSelected && (
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{
                                                background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
                                                backgroundSize: '200% 100%',
                                                animation: 'shimmer 2s infinite'
                                            }}
                                        />
                                    )}

                                    {/* Emoji/Icon - Adjust for compact mode */}
                                    {option.emoji && (
                                        <span
                                            className={`${shouldUseCompactMode ? 'text-xl' : 'text-2xl'} transition-all duration-300 shrink-0`}
                                            style={{
                                                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                                filter: isSelected ? 'drop-shadow(0 0 6px rgba(255,255,255,0.5))' : 'none'
                                            }}
                                        >
                                            {option.emoji}
                                        </span>
                                    )}

                                    {/* Label - Left align always, removed whitespace-pre-wrap logic */}
                                    <span className="flex-1 text-left">
                                        {option.label}
                                    </span>

                                    {/* Check mark */}
                                    {isSelected && (
                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center ml-auto">
                                            <Check size={12} className="text-white" />
                                        </div>
                                    )}

                                    {/* Sparkle effect when selected */}
                                    {isSelected && (
                                        <Sparkles
                                            size={12}
                                            className="absolute top-2 right-2 text-white opacity-60"
                                            style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }}
                                        />
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

export default SingleChoiceField;
