import React from 'react';
import { Check } from 'lucide-react';
import { ThemeStyles } from '../../../../constants/formThemes';

interface ProfileTextFieldProps {
    field: any;
    themeStyles: ThemeStyles;
    variant?: 'standard' | 'immersive';
}

const ProfileTextField: React.FC<ProfileTextFieldProps> = ({ field, themeStyles, variant = 'standard' }) => {
    // IMMERSIVE STYLE
    // IMMERSIVE STYLE
    // IMMERSIVE STYLE
    if (variant === 'immersive') {
        const immersiveInputClass = `w-full bg-transparent border-b-2 py-4 text-3xl font-light focus:outline-none ${themeStyles.border_base} ${themeStyles.input_focus_border} transition-colors ${themeStyles.text_primary} placeholder:text-slate-300`;
        const immersiveTextareaClass = `w-full bg-transparent border-b-2 py-4 text-2xl font-light focus:outline-none ${themeStyles.border_base} ${themeStyles.input_focus_border} transition-colors ${themeStyles.text_primary} placeholder:text-slate-300 resize-none min-h-[300px] leading-relaxed`;

        if (field.readOnly) {
            return (
                <div
                    className={`w-full bg-transparent py-4 text-3xl font-bold ${themeStyles.text_primary} border-b border-transparent`}
                    style={{ fontFamily: themeStyles.font_family }}
                >
                    {field.value || <span className="text-gray-300 text-2xl font-normal">미입력</span>}
                </div>
            );
        }

        if (field.type === 'textarea' || field.type === 'long_text') {
            return (
                <div className="relative w-full">
                    <textarea
                        value={field.value || ''}
                        onChange={(e) => field.onChange?.(e.target.value)}
                        placeholder={field.placeholder || "내용을 입력해주세요"}
                        className={immersiveTextareaClass}
                        style={{ fontFamily: themeStyles.font_family }}
                        autoFocus
                    />
                    {field.value && (
                        <div className="absolute right-0 bottom-4 text-indigo-500 animate-in zoom-in duration-200">
                            <Check size={28} strokeWidth={3} />
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="relative w-full">
                <input
                    type={field.type === 'short_text' ? 'text' : field.type}
                    value={field.value || ''}
                    onChange={(e) => field.onChange?.(e.target.value)}
                    placeholder={field.placeholder || "입력해주세요"}
                    className={immersiveInputClass}
                    style={{ fontFamily: themeStyles.font_family }}
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                            field.onEnter?.();
                        }
                    }}
                />
                {field.value && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 text-indigo-500 animate-in zoom-in duration-200">
                        <Check size={28} strokeWidth={3} />
                    </div>
                )}
            </div>
        );
    }

    // STANDARD STYLE
    const radiusClass = themeStyles.radius_input || "rounded-xl";
    const baseInputClass = `w-full ${themeStyles.input_bg} border ${themeStyles.border_base} ${radiusClass} transition-all font-medium text-[15px]`;
    const focusClass = `focus:${themeStyles.card_bg} ${themeStyles.input_focus_border} ${themeStyles.ring_focus} outline-none`;

    if (field.type === 'textarea' || field.type === 'long_text') {
        return (
            <textarea
                rows={8}
                value={field.value || ''}
                onChange={(e) => field.onChange?.(e.target.value)}
                placeholder={field.placeholder || "내용을 입력해주세요"}
                className={`${baseInputClass} ${focusClass} px-4 py-3.5 placeholder-gray-400 ${themeStyles.text_primary} resize-none leading-relaxed min-h-[160px]`}
                style={{ fontFamily: themeStyles.font_family }}
            />
        );
    }

    return (
        <input
            type={field.type === 'short_text' ? 'text' : field.type} // Handle date, email, url, etc.
            value={field.value || ''}
            onChange={(e) => field.onChange?.(e.target.value)}
            placeholder={field.placeholder || "입력해주세요"}
            className={`${baseInputClass} ${focusClass} px-4 py-3.5 placeholder-gray-400 ${themeStyles.text_primary}`}
            style={{ fontFamily: themeStyles.font_family }}
        />
    );
};

export default ProfileTextField;
