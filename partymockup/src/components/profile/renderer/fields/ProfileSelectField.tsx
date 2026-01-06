import React from 'react';
import { ThemeStyles } from '../../../../constants/formThemes';
import { ChevronDown } from 'lucide-react';

interface ProfileSelectFieldProps {
    field: any;
    themeStyles: ThemeStyles;
}

const ProfileSelectField: React.FC<ProfileSelectFieldProps> = ({ field, themeStyles }) => {
    const radiusClass = themeStyles.radius_input || "rounded-xl";
    const baseInputClass = `w-full ${themeStyles.input_bg} border ${themeStyles.border_base} ${radiusClass} transition-all font-medium text-[15px]`;
    const focusClass = `focus:${themeStyles.card_bg} ${themeStyles.input_focus_border} ${themeStyles.ring_focus} outline-none`;

    return (
        <div className="relative">
            <select
                value={field.value || ''}
                onChange={(e) => field.onChange?.(e.target.value)}
                className={`${baseInputClass} ${focusClass} px-4 py-3.5 ${themeStyles.text_primary} appearance-none`}
                style={{ fontFamily: themeStyles.font_family }}
            >
                <option value="">선택해주세요</option>
                {field.options?.map((opt: any, i: number) => (
                    <option key={i} value={opt.value || opt} className="text-slate-900">
                        {opt.label || opt}
                    </option>
                ))}
            </select>
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${themeStyles.text_tertiary}`}>
                <ChevronDown size={16} />
            </div>
        </div>
    );
};

export default ProfileSelectField;
