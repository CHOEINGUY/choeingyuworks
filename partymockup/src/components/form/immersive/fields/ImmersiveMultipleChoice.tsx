import React, { useRef, useState, useEffect } from 'react';
import ImmersiveOptionButton from '../common/ImmersiveOptionButton';
import { Check } from 'lucide-react';

interface ImmersiveMultipleChoiceProps {
    field: {
        options?: Array<string | { label: string; value: string }>;
        validation?: {
            maxSelect?: number;
        };
    };
    value: string[];
    onChange: (value: string[]) => void;
    onNext?: () => void;
    themeStyles: any;
}

const ImmersiveMultipleChoice: React.FC<ImmersiveMultipleChoiceProps> = ({ field, value = [], onChange, themeStyles }) => {
    const selectedValues = Array.isArray(value) ? value : [];
    const rawOptions = field.options || [];
    const options = rawOptions.map(opt =>
        typeof opt === 'string' ? { label: opt, value: opt } : opt
    );

    // [NEW] allowOther handling
    const allowOther = (field as any).allowOther;
    const OTHER_KEY = '__custom_other__';

    // Identify if "Other" is active based on whether we have a value not in standard options
    const knownValues = new Set(options.map(o => o.value));
    const customValue = selectedValues.find(v => !knownValues.has(v)) || '';
    const [isOtherActive, setIsOtherActive] = useState(!!customValue);
    const [otherText, setOtherText] = useState(customValue);

    const containerRef = useRef<HTMLDivElement>(null);

    // Center Focus Logic
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

    // Sync otherText (local) with external value change if needed
    useEffect(() => {
        const foundCustom = selectedValues.find(v => !knownValues.has(v));
        if (foundCustom !== undefined) {
            setOtherText(foundCustom);
            setIsOtherActive(true);
        } else if (isOtherActive && !foundCustom) {
            // If active locally but missing from props, keep local state active (user might have cleared text)
            // But if we want to enforce consistency:
            // setIsOtherActive(false); // Depends on UX. Let's keep separate state to avoid flickering.
        }
    }, [selectedValues, knownValues]);

    const toggleSelect = (optionValue: string) => {
        if (optionValue === OTHER_KEY) {
            // Toggle Other
            const nextActive = !isOtherActive;
            setIsOtherActive(nextActive);

            let newValues = [...selectedValues];
            if (nextActive) {
                // Activated: Add current text if distinct
                if (otherText && !selectedValues.includes(otherText)) {
                    newValues.push(otherText);
                }
            } else {
                // Deactivated: Remove custom value
                newValues = selectedValues.filter(v => knownValues.has(v));
            }
            onChange(newValues);
            return;
        }

        let newValues;
        if (selectedValues.includes(optionValue)) {
            newValues = selectedValues.filter(v => v !== optionValue);
        } else {
            if (field.validation?.maxSelect && selectedValues.length >= field.validation.maxSelect) {
                // If max reached, maybe replace first? or warn? Standard is prevent.
                // But if "Other" counts as one, we need to consider it.
                // If isOtherActive and valid text, it's 1.
                // Current selectedValues includes the custom text, so length check is correct.
                return;
            }
            newValues = [...selectedValues, optionValue];
        }
        onChange(newValues);
    };

    const handleOtherTextChange = (text: string) => {
        setOtherText(text);

        // Update values: Remove old custom value, add new one
        // 1. Filter out only the PREVIOUS custom value? 
        // Safer: Filter out all unknown values, then append new one.
        const standardSelected = selectedValues.filter(v => knownValues.has(v));

        if (text.trim()) {
            onChange([...standardSelected, text]);
        } else {
            onChange(standardSelected);
        }
    };

    // Combine options with "Other" placeholder
    const displayOptions = [...options];
    if (allowOther) {
        displayOptions.push({ label: '기타 (직접 입력)', value: OTHER_KEY });
    }

    return (
        <div className="w-full h-full flex flex-col relative">
            <div className="relative flex-1 min-h-0 group">
                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="max-h-[55dvh] min-h-[300px] overflow-y-auto px-4 pt-4 pb-24 space-y-4 no-scrollbar scroll-smooth overscroll-contain"
                >
                    {displayOptions.map((option, index) => {
                        const isOtherBtn = option.value === OTHER_KEY;
                        const isSelected = isOtherBtn ? isOtherActive : selectedValues.includes(option.value);

                        const alphabet = String.fromCharCode(65 + index);
                        const distance = Math.abs(index - centerIndex);

                        let scale = 1, opacity = 1, blur = 0, y = 0;

                        if (distance <= 2) {
                            scale = 1; opacity = 1; blur = 0; y = 0;
                        } else if (distance === 2) {
                            scale = 0.95; opacity = 0.6; blur = 0; y = 0;
                        } else {
                            scale = 0.8; opacity = 0.15; blur = 3; y = (distance - 2) * 5;
                        }

                        return (
                            <div key={option.value} className="space-y-2">
                                <ImmersiveOptionButton
                                    label={option.label}
                                    value={option.value}
                                    index={index}
                                    isSelected={isSelected}
                                    themeStyles={themeStyles}
                                    onClick={() => toggleSelect(option.value)}
                                    alphabet={alphabet}
                                    distance={distance}
                                    animate={{ scale, opacity, filter: `blur(${blur}px)`, y }}
                                    transition={{ duration: 0.05 }}
                                    disabled={(option as any).disabled}
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
                                            autoFocus
                                        />
                                        <button
                                            onClick={(e) => {
                                                e?.stopPropagation();
                                                (document.activeElement as HTMLElement)?.blur();
                                            }}
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
                    })}
                </div>
            </div>
        </div>
    );
};

export default ImmersiveMultipleChoice;
