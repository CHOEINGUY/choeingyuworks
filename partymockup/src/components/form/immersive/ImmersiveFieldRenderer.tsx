import React from 'react';
import { FIELD_TYPES } from '../../../constants/fieldTypes';
import ImmersiveShortText from './fields/ImmersiveShortText';
import ImmersiveSingleChoice from './fields/ImmersiveSingleChoice';
import ImmersiveMultipleChoice from './fields/ImmersiveMultipleChoice';
import ImmersiveLongText from './fields/ImmersiveLongText';
import ImmersiveBirthdate from './fields/ImmersiveBirthdate';
import ImmersiveRegion from './fields/ImmersiveRegion';
import ImmersivePhoneInput from './fields/ImmersivePhoneInput';
import ImmersiveImageUpload from './fields/ImmersiveImageUpload';
import ImmersivePayment from './fields/ImmersivePayment';
import ImmersiveNotice from './fields/ImmersiveNotice';
import ImmersiveBankAccount from './fields/ImmersiveBankAccount';
import ImmersiveMBTI from './fields/ImmersiveMBTI';

interface ImmersiveFieldRendererProps {
    field: any;
    value: any;
    onChange: (value: any) => void;
    onNext: () => void;
    onPrev: () => void;
    error?: string;
    themeStyles: any;
}

const ImmersiveFieldRenderer: React.FC<ImmersiveFieldRendererProps> = ({ field, value, onChange, onNext, onPrev, error, themeStyles }) => {

    // Pass themeStyles to all child fields
    const commonProps = { field, value, onChange, onNext, onPrev, themeStyles };

    const renderField = () => {
        switch (field.type) {
            case FIELD_TYPES.SHORT_TEXT:
            case FIELD_TYPES.NUMBER:
                return <ImmersiveShortText {...commonProps} />;

            case FIELD_TYPES.PHONE:
                return <ImmersivePhoneInput {...commonProps} />;

            case FIELD_TYPES.LONG_TEXT:
                return <ImmersiveLongText {...commonProps} />;

            case FIELD_TYPES.SINGLE_CHOICE:
                return <ImmersiveSingleChoice {...commonProps} />;

            case FIELD_TYPES.MULTIPLE_CHOICE:
                return <ImmersiveMultipleChoice {...commonProps} />;

            case FIELD_TYPES.BIRTH_DATE:
                return <ImmersiveBirthdate {...commonProps} />;

            case FIELD_TYPES.REGION:
                return <ImmersiveRegion {...commonProps} />;

            case FIELD_TYPES.IMAGE_UPLOAD:
            case FIELD_TYPES.FILE_UPLOAD:
                return <ImmersiveImageUpload {...commonProps} />;

            case FIELD_TYPES.PAYMENT_INFO:
                return <ImmersivePayment {...commonProps} />;

            case FIELD_TYPES.BANK_ACCOUNT:
                return <ImmersiveBankAccount {...commonProps} />;

            case FIELD_TYPES.MBTI:
                return <ImmersiveMBTI {...commonProps} />;

            case FIELD_TYPES.NOTICE:
                return <ImmersiveNotice {...commonProps} />;

            default:
                return (
                    <div className={`p-6 rounded-xl border text-center ${themeStyles.input_bg} ${themeStyles.border_base} ${themeStyles.text_secondary}`}>
                        <p>지원하지 않는 필드 타입입니다: {field.type}</p>
                        <button onClick={onNext} className="mt-4 px-4 py-2 bg-slate-200 rounded-lg text-sm font-bold text-slate-700">건너뛰기</button>
                    </div>
                );
        }
    };

    return (
        <div id="immersive-question-container" className="space-y-8 max-w-2xl mx-auto w-full">
            {field.type !== FIELD_TYPES.NOTICE && (
                <div className="space-y-4">
                    {/* 질문 번호는 필요하다면 추가 */}
                    <h2 className={`text-3xl md:text-3xl font-bold leading-tight break-keep break-words ${themeStyles.text_primary}`}>
                        {field.title || field.label}
                        {field.required && <span className={`${themeStyles.text_accent} ml-1 text-2xl align-top`}>*</span>}
                    </h2>
                    {field.description && (
                        <p className={`text-lg font-normal leading-relaxed whitespace-pre-wrap break-keep break-words ${themeStyles.text_secondary}`}>
                            {field.description}
                        </p>
                    )}
                </div>
            )}

            <div className="pt-2">
                {renderField()}
                {error && (
                    <div className="mt-3 pl-1 flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in duration-300">
                        <span className="text-rose-500 font-medium text-sm">{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImmersiveFieldRenderer;
