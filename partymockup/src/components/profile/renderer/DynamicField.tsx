import React from 'react';
import { Lock, X, UploadCloud, FileText, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useFileUpload } from '../../../hooks/useFileUpload';
import MBTISelector from '../MBTISelector';

// [FIX] Define partial theme for MBTISelector or use full theme
const MBTI_THEME_OVERRIDE: any = {
    activeBtn: "bg-indigo-600 text-white border-indigo-600 shadow-md",
    inactiveBtn: "bg-white text-gray-400 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
};

interface DynamicFieldProps {
    field: any; // Fallback to any for now to resolve import error, will refine later
    variant?: 'standard' | 'immersive';
    themeStyles?: any; // [NEW] Accept themeStyles
}

const DynamicField: React.FC<DynamicFieldProps> = ({ field, variant = 'standard', themeStyles = {} }) => {
    // [REF] Removed local state. Now controlled by parent via field.value & field.onChange
    const { upload, isUploading, progress } = useFileUpload(); // Corrected: No arguments

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const uploadedUrl = await upload(file);
            field.onChange?.(uploadedUrl); // Update Parent
        } catch (err) {
            console.error("Upload failed", err);
            toast.error("업로드에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleFileRemove = async () => {
        if (!window.confirm("파일을 삭제하시겠습니까?")) return;
        try {
            // await remove(field.value); // Optional: Strict delete
            field.onChange?.('');
        } catch (err) {
            console.error("Remove failed", err);
        }
    };


    // 0. VISIBILITY CHECK
    if (field.visible === false) return null;

    // --- READ ONLY VIEW (Compact Row) ---
    if (field.readOnly) {
        let displayValue = field.placeholder || "정보 없음";
        // Mock value resolution
        if (field.type === 'radio' && field.options) {
            displayValue = field.options.find((o: any) => (o.value || o) === field.value)?.label || field.value || "-";
        } else if (field.value) {
            displayValue = field.value;
        }

        return (
            <div className={`flex items-center justify-between py-2 border-b last:border-0 ${themeStyles.border_base} ${variant === 'immersive' ? 'hidden' : ''}`}>
                <div className={`flex items-center gap-1.5 ${themeStyles.text_secondary}`}>
                    <span className="text-sm font-medium">{field.label}</span>
                    <Lock size={11} className={`${themeStyles.text_tertiary}`} />
                </div>
                <div className="text-right">
                    <span className={`text-sm font-bold ${themeStyles.text_primary}`}>{displayValue}</span>
                </div>
            </div>
        );
    }

    // --- EDITABLE VIEW (Vertical Stack) ---
    const renderLabel = () => {
        if (variant === 'immersive') return null; // Immersive mode hides label (uses section title usually or placeholder)
        return (
            <label className={`block text-sm font-bold mb-2.5 ${themeStyles.text_primary || 'text-gray-800'}`}>
                {field.label}
                {field.required && <span className="text-indigo-500 ml-0.5">*</span>}
            </label>
        );
    };

    const renderInput = () => {
        // IMMERSIVE STYLE
        if (variant === 'immersive') {
            // Updated immersive class to use theme variables mostly, but keeping some transparency
            const immersiveClass = `w-full bg-transparent border-b-2 py-4 text-3xl font-light focus:outline-none ${themeStyles.border_base} focus:border-indigo-600 transition-colors ${themeStyles.text_primary} placeholder:text-slate-300`;

            switch (field.type) {
                case 'short_text':
                case 'text':
                    return (
                        <input
                            type="text"
                            value={field.value || ''}
                            onChange={(e) => field.onChange?.(e.target.value)}
                            placeholder={field.placeholder || "입력해주세요"}
                            className={immersiveClass}
                            style={{ fontFamily: themeStyles.font_family }} // Apply font
                            autoFocus
                        />
                    );
                default:
                    // Fallback to standard for non-text fields in immersive mode for now
                    break;
            }
        }

        // STANDARD STYLE - Now using themeStyles for radius/font
        const radiusClass = themeStyles.radius_button || "rounded-xl"; // Default fallback
        const baseInputClass = `w-full ${themeStyles.input_bg} border ${themeStyles.border_base} ${radiusClass} transition-all font-medium text-[15px]`;
        const focusClass = `focus:${themeStyles.card_bg} ${themeStyles.input_focus_border} focus:ring-4 focus:ring-indigo-500/10 outline-none`;

        switch (field.type) {
            case 'short_text':
            case 'text':
                return (
                    <input
                        type="text"
                        value={field.value || ''}
                        onChange={(e) => field.onChange?.(e.target.value)}
                        placeholder={field.placeholder || "입력해주세요"}
                        className={`${baseInputClass} ${focusClass} px-4 py-3.5 placeholder-gray-400 ${themeStyles.text_primary}`}
                        style={{ fontFamily: themeStyles.font_family }}
                    />
                );

            case 'long_text': // Fixed: matched with FIELD_TYPES.LONG_TEXT
            case 'textarea':
                return (
                    <textarea
                        rows={4}
                        value={field.value || ''}
                        onChange={(e) => field.onChange?.(e.target.value)}
                        placeholder={field.placeholder || "내용을 입력해주세요"}
                        className={`${baseInputClass} ${focusClass} px-4 py-3.5 placeholder-gray-400 ${themeStyles.text_primary} resize-none leading-relaxed`}
                        style={{ fontFamily: themeStyles.font_family }}
                    />
                );
            case 'dropdown':
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
                                <option key={i} value={opt.value || opt} className="text-slate-900">{opt.label || opt}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>
                );
            case 'number':
                return (
                    <input
                        type="number"
                        value={field.value || ''}
                        onChange={(e) => field.onChange?.(e.target.value)}
                        placeholder={field.placeholder || "숫자 입력"}
                        className={`${baseInputClass} ${focusClass} px-4 py-3.5 placeholder-gray-400 ${themeStyles.text_primary}`}
                        style={{ fontFamily: themeStyles.font_family }}
                    />
                );
            case 'email':
                return (
                    <input
                        type="email"
                        value={field.value || ''}
                        onChange={(e) => field.onChange?.(e.target.value)}
                        placeholder={field.placeholder || "example@email.com"}
                        className={`${baseInputClass} ${focusClass} px-4 py-3.5 placeholder-gray-400 ${themeStyles.text_primary}`}
                        style={{ fontFamily: themeStyles.font_family }}
                    />
                );
            case 'url':
                return (
                    <input
                        type="url"
                        value={field.value || ''}
                        onChange={(e) => field.onChange?.(e.target.value)}
                        placeholder={field.placeholder || "https://"}
                        className={`${baseInputClass} ${focusClass} px-4 py-3.5 placeholder-gray-400 ${themeStyles.text_primary}`}
                        style={{ fontFamily: themeStyles.font_family }}
                    />
                );
            case 'date':
                return (
                    <input
                        type="date"
                        value={field.value || ''}
                        onChange={(e) => field.onChange?.(e.target.value)}
                        className={`${baseInputClass} ${focusClass} px-4 py-3.5 placeholder-gray-400 ${themeStyles.text_primary}`}
                        style={{ fontFamily: themeStyles.font_family }}
                    />
                );
            case 'radio':
            case 'single_choice':
                const optionRadius = themeStyles.radius_option || "rounded-xl";
                const optionAlign = themeStyles.text_align_option || "text-center";
                const optionSize = themeStyles.text_size_option || "text-sm";

                return (
                    <div className="flex flex-wrap gap-2">
                        {field.options?.map((opt: any, i: number) => {
                            const optValue = opt.value || opt;
                            const optLabel = opt.label || opt;
                            const isSelected = field.value === optValue;
                            return (
                                <button
                                    key={i}
                                    onClick={() => field.onChange?.(optValue)}
                                    className={`px-5 py-3 ${optionRadius} border ${optionAlign} ${optionSize} transition-all active:scale-[0.98] ${isSelected
                                        ? `bg-indigo-500 border-indigo-500 text-white shadow-md font-bold`
                                        : `${themeStyles.border_base} ${themeStyles.card_bg} ${themeStyles.text_secondary} hover:${themeStyles.input_bg} hover:border-indigo-200 hover:text-indigo-600 font-medium`
                                        }`}
                                    style={{ fontFamily: themeStyles.font_family }}
                                >
                                    {optLabel}
                                </button>
                            );
                        })}
                    </div>
                );
            case 'mbti_selector':
                return (
                    <MBTISelector
                        value={field.value || ''}
                        onChange={(val) => {
                            field.onChange?.(val);
                        }}
                        theme={MBTI_THEME_OVERRIDE}
                    />
                );
            case 'tags':
                return (
                    <div className={`${baseInputClass} ${focusClass} min-h-[52px] flex items-center px-4`}>
                        <span className="text-gray-400 text-sm font-medium">{field.placeholder || "#태그 입력"}</span>
                    </div>
                );
            case 'phone':
                return (
                    <input
                        type="tel"
                        value={field.value || ''}
                        onChange={(e) => field.onChange?.(e.target.value.replace(/[^0-9-]/g, ''))}
                        placeholder={field.placeholder || "010-1234-5678"}
                        className={`${baseInputClass} ${focusClass} px-4 py-3.5 placeholder-gray-400 text-gray-800`}
                        maxLength={13}
                    />
                );
            case 'birth_date':
                return (
                    <input
                        type="text"
                        value={field.value || ''}
                        onChange={(e) => field.onChange?.(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))}
                        placeholder={field.placeholder || "YYYYMMDD"}
                        className={`${baseInputClass} ${focusClass} px-4 py-3.5 placeholder-gray-400 text-gray-800 tracking-widest`}
                    />
                );
            case 'region':
                // Simple Region Selector Mock
                return (
                    <select
                        value={field.value || ''}
                        onChange={(e) => field.onChange?.(e.target.value)}
                        className={`${baseInputClass} ${focusClass} px-4 py-3.5 text-gray-800 appearance-none`}
                    >
                        <option value="">지역을 선택해주세요</option>
                        {field.options && Object.keys(field.options).map((sido) => (
                            <option key={sido} value={sido}>{sido}</option>
                        ))}
                        {!field.options && <option value="seoul">서울 (Mock)</option>}
                    </select>
                );
            case 'multiple_choice':
                // Define variables here or hoist them up if reused frequently
                const mcOptionRadius = themeStyles.radius_option || "rounded-xl";
                const mcOptionAlign = themeStyles.text_align_option || "text-center";
                const mcOptionSize = themeStyles.text_size_option || "text-sm";

                const selectedValues = Array.isArray(field.value) ? field.value : [];
                return (
                    <div className="flex flex-wrap gap-2">
                        {field.options?.map((opt: any, i: number) => {
                            const optValue = opt.value;
                            const isSelected = selectedValues.includes(opt.value);
                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        if (isSelected) {
                                            field.onChange?.(selectedValues.filter((v: any) => v !== optValue));
                                        } else {
                                            field.onChange?.([...selectedValues, optValue]);
                                        }
                                    }}
                                    className={`px-5 py-3 ${mcOptionRadius} border ${mcOptionAlign} ${mcOptionSize} font-bold transition-all active:scale-[0.98] ${isSelected
                                        ? 'bg-indigo-500 border-indigo-500 text-white shadow-md'
                                        : `${themeStyles.border_base} ${themeStyles.card_bg} ${themeStyles.text_secondary} hover:${themeStyles.input_bg} hover:border-indigo-200 hover:text-indigo-600`
                                        }`}
                                    style={{ fontFamily: themeStyles.font_family }}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                );
            case 'payment_info':
                return (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200" style={{ fontFamily: themeStyles.font_family }}>
                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                <span className="block text-xs font-bold text-slate-400 mb-1">입금 계좌</span>
                                <div className="flex items-center gap-2 text-slate-800 text-lg font-bold">
                                    <span>{field.bankName}</span>
                                    <span>{field.accountNumber}</span>
                                </div>
                                <span className="text-sm text-slate-500 mt-1 block">예금주: {field.accountHolder}</span>
                            </div>
                            <pre className="text-sm text-slate-600 font-medium font-sans whitespace-pre-wrap leading-relaxed">
                                {field.paymentDetails}
                            </pre>
                            <div className="text-xs text-slate-400 bg-slate-100 p-3 rounded-lg">
                                {field.otherInfo}
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
            case 'image_upload':
            case 'file_upload':
                return (
                    <div className="w-full">
                        {field.value ? (
                            <div className="relative group max-w-sm">
                                {field.type === 'image_upload' ? (
                                    <div className="relative rounded-xl overflow-hidden border border-gray-200">
                                        <img
                                            src={field.value}
                                            alt="Uploaded content"
                                            className="w-full h-48 object-cover bg-gray-50"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                                            <FileText size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-800 truncate">업로드된 파일</p>
                                            <a href={field.value} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 hover:underline truncate block">
                                                파일 보기
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleFileRemove}
                                    className="absolute -top-2 -right-2 p-1.5 bg-white text-gray-500 rounded-full shadow-md border border-gray-100 hover:text-red-500 hover:bg-red-50 transition-colors z-10"
                                    type="button"
                                    title="파일 삭제"
                                >
                                    <X size={16} strokeWidth={3} />
                                </button>
                            </div>
                        ) : (
                            <label className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer group ${isUploading
                                ? 'border-indigo-300 bg-indigo-50/30 cursor-wait'
                                : 'border-slate-300 bg-slate-50/50 hover:bg-white hover:border-indigo-400 hover:text-indigo-500'
                                }`}>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    accept={field.type === 'image_upload' ? "image/*" : "*/*"}
                                    disabled={isUploading}
                                />
                                {isUploading ? (
                                    <div className="flex flex-col items-center animate-pulse">
                                        <Loader size={24} className="text-indigo-500 animate-spin mb-3" />
                                        <span className="text-sm font-bold text-indigo-600">업로드 중... {progress}%</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                                        <UploadCloud size={32} className="mb-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-sm font-bold">클릭하여 파일 업로드</span>
                                        <span className="text-xs mt-1 opacity-70">
                                            {field.type === 'image_upload' ? 'JPG, PNG, GIF' : '모든 파일 형식 가능'}
                                        </span>
                                    </div>
                                )}
                            </label>
                        )}
                    </div>
                );
            case 'bank_account':
                return (
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="은행명 (예: 국민)"
                            className={`${baseInputClass} ${focusClass} px-4 py-3 placeholder-gray-400 ${themeStyles.text_primary}`}
                            style={{ fontFamily: themeStyles.font_family }}
                        />
                        <input
                            type="text"
                            placeholder="계좌번호 (-없이 입력)"
                            className={`${baseInputClass} ${focusClass} px-4 py-3 placeholder-gray-400 ${themeStyles.text_primary}`}
                            style={{ fontFamily: themeStyles.font_family }}
                        />
                        <input
                            type="text"
                            placeholder="예금주명"
                            className={`${baseInputClass} ${focusClass} px-4 py-3 placeholder-gray-400 ${themeStyles.text_primary}`}
                            style={{ fontFamily: themeStyles.font_family }}
                        />
                    </div>
                );
            default:
                return (
                    <div className="p-3 bg-red-50 text-red-500 text-xs rounded-lg">
                        Unknown: {field.type}
                    </div>
                );
        }
    };

    return (
        <div className={variant === 'immersive' ? 'w-full' : ''}>
            {renderLabel()}
            {renderInput()}
        </div>
    );
};

export default DynamicField;
