import React from 'react';
import { ThemeStyles } from '../../../../constants/formThemes';

interface ProfileChoiceFieldProps {
    field: any;
    themeStyles: ThemeStyles;
}

const ProfileChoiceField: React.FC<ProfileChoiceFieldProps> = ({ field, themeStyles }) => {
    const isMultiple = field.type === 'multiple_choice';
    // Use configured option style or fallback to button style
    const optionRadius = themeStyles.radius_option || themeStyles.radius_button || "rounded-xl";
    const optionAlign = themeStyles.text_align_option || "text-center justify-center";
    const optionSize = themeStyles.text_size_option || "text-base py-3 px-4";

    const selectedValues = isMultiple
        ? (Array.isArray(field.value) ? field.value : [])
        : field.value;

    const rawOptions = field.options || [];
    const options = rawOptions.map((opt: any) => typeof opt === 'object' ? opt : { label: opt, value: opt });

    // [NEW] Allow Other Logic
    const allowOther = field.allowOther;
    const knownValues = new Set(options.map((o: any) => o.value));

    // Determine active other state
    const customValue = isMultiple
        ? selectedValues.find((v: any) => !knownValues.has(v))
        : (selectedValues && !knownValues.has(selectedValues) ? selectedValues : '');

    const [isOtherActive, setIsOtherActive] = React.useState(!!customValue);
    const [otherText, setOtherText] = React.useState(customValue || '');

    // Sync external changes
    React.useEffect(() => {
        if (customValue) {
            setIsOtherActive(true);
            setOtherText(customValue);
        } else if (!customValue && isOtherActive) {
            // optional: reset if external cleared
        }
    }, [customValue]);


    const handleSelect = (val: string) => {
        if (isMultiple) {
            if (selectedValues.includes(val)) {
                field.onChange?.(selectedValues.filter((v: any) => v !== val));
            } else {
                field.onChange?.([...selectedValues, val]);
            }
        } else {
            field.onChange?.(val);
        }
    };

    const toggleOther = () => {
        if (isOtherActive) {
            // Turning off
            setIsOtherActive(false);
            if (isMultiple) {
                // Remove custom value
                field.onChange?.(selectedValues.filter((v: any) => knownValues.has(v)));
            } else {
                field.onChange?.('');
            }
        } else {
            // Turning on
            setIsOtherActive(true);
            if (isMultiple) {
                // Don't add text yet if empty, or add empty string? Best to wait for input.
                if (otherText) field.onChange?.([...selectedValues, otherText]);
            } else {
                field.onChange?.(otherText);
            }
        }
    };

    const handleOtherText = (text: string) => {
        setOtherText(text);
        if (isMultiple) {
            const standard = selectedValues.filter((v: any) => knownValues.has(v));
            if (text) field.onChange?.([...standard, text]);
            else field.onChange?.(standard);
        } else {
            field.onChange?.(text);
        }
    };

    // Add Other Option if enabled
    const displayOptions = [...options];

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {displayOptions.map((opt: any, i: number) => {
                    const optValue = opt.value || opt;
                    const optLabel = opt.label || opt;
                    const isSelected = isMultiple
                        ? selectedValues.includes(optValue)
                        : selectedValues === optValue;

                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(optValue)}
                            className={`flex items-center ${optionSize} ${optionRadius} border ${optionAlign} font-bold transition-all active:scale-[0.98] ${isSelected
                                ? `${themeStyles.bg_checked} ${themeStyles.border_checked} ${themeStyles.check_color} ${themeStyles.shadow_checked}` // Active state
                                : `${themeStyles.border_base} ${themeStyles.card_bg} ${themeStyles.text_secondary} hover:${themeStyles.input_bg} ${themeStyles.hover_border_light} font-medium`
                                }`}
                            style={{ fontFamily: themeStyles.font_family }}
                        >
                            {optLabel}
                        </button>
                    );
                })}

                {allowOther && (
                    <button
                        onClick={toggleOther}
                        className={`flex items-center ${optionSize} ${optionRadius} border ${optionAlign} font-bold transition-all active:scale-[0.98] ${isOtherActive
                            ? `${themeStyles.bg_checked} ${themeStyles.border_checked} ${themeStyles.check_color} ${themeStyles.shadow_checked}`
                            : `${themeStyles.border_base} ${themeStyles.card_bg} ${themeStyles.text_secondary} hover:${themeStyles.input_bg} ${themeStyles.hover_border_light} font-medium`
                            }`}
                        style={{ fontFamily: themeStyles.font_family }}
                    >
                        기타 (직접 입력)
                    </button>
                )}
            </div>

            {/* Other Input Area */}
            {allowOther && isOtherActive && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <input
                        type="text"
                        value={otherText}
                        onChange={(e) => handleOtherText(e.target.value)}
                        placeholder="입력해주세요"
                        className={`w-full py-2 bg-transparent border-b-2 border-gray-200 focus:border-indigo-500 transition-colors outline-none font-medium text-sm text-center`}
                    />
                </div>
            )}
        </div>
    );
};

export default ProfileChoiceField;
