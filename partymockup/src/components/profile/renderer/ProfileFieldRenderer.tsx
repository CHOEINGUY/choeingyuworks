import React from 'react';
import { ThemeStyles } from '../../../constants/formThemes';
import ProfileTextField from './fields/ProfileTextField';
import ProfileChoiceField from './fields/ProfileChoiceField';
import ProfileSelectField from './fields/ProfileSelectField';
import { Lock } from 'lucide-react';
import MBTISelector from '../MBTISelector';
import ProfileTagsField from './fields/ProfileTagsField';
import ProfileImageField from './fields/ProfileImageField';

// Specialized components will be imported as needed. 
// For now, complex ones like PaymentInfo can stay here or be extracted later if very large.

interface ProfileFieldRendererProps {
    field: any;
    variant?: 'standard' | 'immersive';
    themeStyles: ThemeStyles;
}

const ProfileFieldRenderer: React.FC<ProfileFieldRendererProps> = ({ field, variant = 'standard', themeStyles }) => {

    // 0. VISIBILITY & READ ONLY
    if (field.visible === false) return null;



    // Legacy ReadOnly (Standard Mode System Fields)
    if (field.readOnly && (variant as string) !== 'immersive') {
        let displayValue = field.placeholder || "정보 없음";
        // Mock value resolution
        if ((field.type === 'radio' || field.type === 'single_choice') && field.options) {
            displayValue = field.options.find((o: any) => (o.value || o) === field.value)?.label || field.value || "-";
        } else if (field.value) {
            displayValue = field.value;
        }

        return (
            <div className={`flex items-center justify-between py-2 border-b last:border-0 ${themeStyles.border_base || 'border-gray-100'} ${variant === 'immersive' ? 'hidden' : ''}`}>
                <div className={`flex items-center gap-1.5 ${themeStyles.text_secondary || 'text-gray-500'}`}>
                    <span className="text-sm font-medium">{field.label}</span>
                    <Lock size={11} className={`${themeStyles.text_tertiary || 'text-gray-300'}`} />
                </div>
                <div className="text-right">
                    <span className={`text-sm font-bold ${themeStyles.text_primary || 'text-gray-900'}`}>{displayValue}</span>
                </div>
            </div>
        );
    }

    // 1. RENDERER DISPATCHER
    const renderFieldInput = () => {
        switch (field.type) {
            case 'short_text':
            case 'text':
            case 'long_text':
            case 'textarea':
            case 'number':
            case 'email':
            case 'url':
            case 'date':
            case 'birth_date': // Treated as date for now
                return <ProfileTextField field={field} themeStyles={themeStyles} variant={variant} />;

            case 'radio':
            case 'single_choice':
            case 'multiple_choice':
                return <ProfileChoiceField field={field} themeStyles={themeStyles} />;

            case 'mbti_selector':
                return (
                    <MBTISelector
                        value={field.value}
                        onChange={(val: any) => field.onChange?.(val)}
                        theme={{
                            activeBtn: `${themeStyles.bg_checked} ${themeStyles.check_color} ${themeStyles.border_checked} shadow-md`,
                            inactiveBtn: `${themeStyles.card_bg} ${themeStyles.text_secondary} ${themeStyles.border_base} hover:${themeStyles.input_bg}`
                        } as any}
                    />
                );

            case 'dropdown':
            case 'region_selector':
                return <ProfileSelectField field={field} themeStyles={themeStyles} />;

            case 'tags':
                return <ProfileTagsField field={field} themeStyles={themeStyles} />;

            case 'image_upload':
                return <ProfileImageField field={field} themeStyles={themeStyles} variant={variant} />;

            // Custom / Complex Types (Legacy inline for now, to be extracted if needed)
            case 'payment_info':
                return (
                    <div className={`${themeStyles.input_bg} p-6 rounded-2xl border ${themeStyles.border_base}`} style={{ fontFamily: themeStyles.font_family }}>
                        <div className="space-y-4">
                            <div className={`${themeStyles.card_bg} p-4 rounded-xl border ${themeStyles.border_base} shadow-sm`}>
                                <span className={`block text-xs font-bold mb-1 ${themeStyles.text_tertiary}`}>입금 계좌</span>
                                <div className={`text-lg font-bold flex items-center gap-2 ${themeStyles.text_primary}`}>
                                    <span>신한은행</span>
                                    <span>110-123-456789</span>
                                </div>
                            </div>
                            <div className={`text-xs ${themeStyles.text_secondary} leading-relaxed`}>
                                입금 후 '입금 완료' 버튼을 눌러주세요.<br />
                                확인 후 매칭이 시작됩니다.
                            </div>
                        </div>
                    </div>
                );

            case 'notice':
                return (
                    <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm font-medium leading-relaxed" style={{ fontFamily: themeStyles.font_family }}>
                        {field.description}
                    </div>
                );

            case 'bank_account':
                // Inline for now
                const radiusClass = themeStyles.radius_button || "rounded-xl";
                const baseInputClass = `w-full ${themeStyles.input_bg} border ${themeStyles.border_base} ${radiusClass} transition-all font-medium text-[15px]`;
                const focusClass = `focus:${themeStyles.card_bg} ${themeStyles.input_focus_border} focus:ring-4 focus:ring-indigo-500/10 outline-none`;

                return (
                    <div className="space-y-3">
                        <input type="text" placeholder="은행명" className={`${baseInputClass} ${focusClass} px-4 py-3 placeholder-gray-400 ${themeStyles.text_primary}`} style={{ fontFamily: themeStyles.font_family }} />
                        <input type="text" placeholder="계좌번호" className={`${baseInputClass} ${focusClass} px-4 py-3 placeholder-gray-400 ${themeStyles.text_primary}`} style={{ fontFamily: themeStyles.font_family }} />
                        <input type="text" placeholder="예금주명" className={`${baseInputClass} ${focusClass} px-4 py-3 placeholder-gray-400 ${themeStyles.text_primary}`} style={{ fontFamily: themeStyles.font_family }} />
                    </div>
                );

            default:
                return (
                    <div className="p-4 bg-red-50 text-red-500 text-sm rounded-lg">
                        지원하지 않는 필드 타입입니다: {field.type}
                    </div>
                );
        }
    };

    // 2. LABEL RENDERING (Standard Mode Only)
    const renderLabel = () => {
        if (variant === 'immersive') return null;
        return (
            <label className={`block text-sm font-bold mb-2.5 ${themeStyles.text_primary || 'text-gray-900'}`}>
                {field.label}
                {field.required && <span className="text-indigo-500 ml-0.5">*</span>}
            </label>
        );
    };

    return (
        <div className="w-full">
            {renderLabel()}
            {renderFieldInput()}
        </div>
    );
};

export default ProfileFieldRenderer;
