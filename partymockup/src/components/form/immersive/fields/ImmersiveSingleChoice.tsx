import React, { useRef, useState, useEffect } from 'react';
import ImmersiveOptionButton from '../common/ImmersiveOptionButton';
import { Check } from 'lucide-react';

interface ImmersiveSingleChoiceProps {
    field: {
        options?: Array<string | { label: string; value: string }>;
    };
    value: string;
    onChange: (value: string) => void;
    onNext: (autoNext?: boolean) => void;
    themeStyles: any;
}

const ImmersiveSingleChoice: React.FC<ImmersiveSingleChoiceProps> = ({ field, value, onChange, onNext, themeStyles }) => {
    const rawOptions = field.options || [];
    const options = rawOptions.map(opt =>
        typeof opt === 'string' ? { label: opt, value: opt } : opt
    );

    // [NEW] allowOther logic
    const allowOther = (field as any).allowOther;
    const OTHER_KEY = '__custom_other__';
    const knownValues = new Set(options.map(o => o.value));
    const isCustom = !!(value && !knownValues.has(value));
    const [isOtherActive, setIsOtherActive] = useState(isCustom);
    const [otherText, setOtherText] = useState(isCustom ? value : '');

    // Sync if value changes externally (e.g. back navigation)
    useEffect(() => {
        if (!value) {
            setOtherText('');
        } else if (!knownValues.has(value)) {
            setIsOtherActive(true);
            setOtherText(value);
        } else {
            setIsOtherActive(false);
        }
    }, [value]);

    const containerRef = useRef<HTMLDivElement>(null);
    const [centerIndex, setCenterIndex] = useState(0);

    const handleScroll = () => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const maxScroll = container.scrollHeight - container.clientHeight;
        const scrollProgress = maxScroll > 0 ? Math.min(Math.max(container.scrollTop / maxScroll, 0), 1) : 0;
        const focusRatio = 0.3 + (scrollProgress * 0.4);
        const containerCenter = container.scrollTop + (container.clientHeight * focusRatio);
        let closestIndex = 0;
        let minDistance = Infinity;
        const children = container.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;
            const childCenter = child.offsetTop + (child.clientHeight / 2);
            const distance = Math.abs(containerCenter - childCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        }
        setCenterIndex(closestIndex);
    };

    useEffect(() => {
        handleScroll();
    }, []);

    const handleSelect = (optionValue: string) => {
        if (optionValue === OTHER_KEY) {
            setIsOtherActive(true);
            if (otherText.trim()) onChange(otherText); // Keep current text
            else onChange(''); // Or don't fire change? 
            return;
        }

        setIsOtherActive(false);
        onChange(optionValue);
        setTimeout(() => {
            onNext(true);
        }, 350);
    };

    const handleOtherTextChange = (text: string) => {
        setOtherText(text);
        onChange(text);
    };

    // Combine
    const displayOptions = [...options];
    if (allowOther) {
        displayOptions.push({ label: '기타 (직접 입력)', value: OTHER_KEY });
    }

    const renderOption = (option: any, index: number, extraProps: any = {}) => {
        const isOtherBtn = option.value === OTHER_KEY;
        const isSelected = isOtherBtn ? isOtherActive : value === option.value;
        const alphabet = String.fromCharCode(65 + index);

        return (
            <div key={option.value} className="space-y-2">
                <ImmersiveOptionButton
                    label={option.label}
                    value={option.value}
                    index={index}
                    isSelected={isSelected}
                    themeStyles={themeStyles}
                    onClick={() => handleSelect(option.value)}
                    alphabet={alphabet}
                    disabled={(option as any).disabled}
                    {...extraProps}
                />
                {isOtherBtn && isSelected && (
                    <div className="px-1 pt-2 animate-in slide-in-from-top-1 fade-in duration-200 relative">
                        <input
                            type="text"
                            value={otherText}
                            onChange={(e) => handleOtherTextChange(e.target.value)}
                            placeholder="입력해주세요"
                            className={`w-full py-2 bg-transparent border-b-2 ${themeStyles.border_base || 'border-gray-300'} focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors outline-none font-medium ${themeStyles.text_align_input || 'text-left'} text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 pr-10`}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && otherText.trim()) {
                                    onNext(true);
                                }
                            }}
                            autoFocus
                        />
                        <button
                            onClick={() => onNext(true)}
                            type="button"
                            className={`
                                absolute right-2 bottom-2 p-1.5 rounded-full z-10
                                ${themeStyles.highlight_bg || 'bg-gray-900'} dark:bg-white
                                ${themeStyles.text_contrast || 'text-white'} dark:text-gray-900
                                shadow-md hover:scale-110 active:scale-95 transition-all animate-in fade-in zoom-in duration-200
                                ${!otherText ? 'hidden' : ''}
                            `}
                        >
                            <Check size={18} strokeWidth={3} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col relative">
            {displayOptions.length <= 5 ? (
                // Simple List
                <div className="space-y-3 px-1">
                    {displayOptions.map((option, index) => renderOption(option, index, {
                        animate: { opacity: 1, y: 0 },
                        transition: { delay: index * 0.1 }
                    }))}
                </div>
            ) : (
                // Scroll Area
                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="h-[48dvh] overflow-y-auto px-4 pt-[calc(15dvh-3rem)] pb-[calc(15dvh-3rem)] space-y-4 no-scrollbar scroll-smooth"
                >
                    {displayOptions.map((option, index) => {
                        const distance = Math.abs(index - centerIndex);
                        let scale = 1, opacity = 1, blur = 0, y = 0;
                        if (distance <= 1) {
                            scale = 1; opacity = 1; blur = 0; y = 0;
                        } else if (distance === 2) {
                            scale = 0.95; opacity = 0.6; blur = 0; y = 0;
                        } else {
                            scale = 0.8; opacity = 0.15; blur = 3; y = (distance - 2) * 5;
                        }

                        return renderOption(option, index, {
                            distance,
                            animate: { scale, opacity, filter: `blur(${blur}px)`, y },
                            transition: { duration: 0.05 }
                        });
                    })}
                </div>
            )}
        </div>
    );
};

export default ImmersiveSingleChoice;
