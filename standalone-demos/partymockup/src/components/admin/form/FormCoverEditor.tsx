import React, { useState } from 'react';
import { ClipboardCheck, Check, Loader2, UploadCloud } from 'lucide-react';
import { FormSettings } from '../../../types/formConfig';
import { useFileUpload } from '../../../hooks/useFileUpload'; // [NEW] Use Hook
import { toast } from 'sonner';

interface FormCoverEditorProps {
    formSettings: FormSettings;
    setFormSettings: (settings: FormSettings) => void;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onActivate: () => void;
}

const FormCoverEditor: React.FC<FormCoverEditorProps> = ({ formSettings, setFormSettings, isOpen, onOpen, onClose, onActivate }) => {
    // [NEW] Use Hook
    const { upload } = useFileUpload();
    // Local state to track WHICH field is uploading (cover vs logo)
    const [activeUploadType, setActiveUploadType] = useState<'cover' | 'logo' | null>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'logo') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation (Max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("이미지 크기는 5MB 이하여야 합니다.");
            return;
        }

        setActiveUploadType(type);
        try {
            // [MODIFIED] Use R2 Hook
            // Disable compression for LOGO
            const url = await upload(file, { skipCompression: type === 'logo' });

            setFormSettings({
                ...formSettings,
                [type === 'cover' ? 'coverImage' : 'logoImage']: url
            });
            toast.success("이미지가 업로드되었습니다.");
        } catch (error: any) {
            console.error(error);
            const msg = error.message || "이미지 업로드에 실패했습니다.";
            toast.error(msg);
        } finally {
            setActiveUploadType(null);
            // Reset input
            e.target.value = '';
        }
    };

    const ImageUploader = ({ type, value, placeholder, label }: { type: 'cover' | 'logo', value?: string, placeholder: string, label: string }) => (
        <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">{label}</label>
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => setFormSettings({
                            ...formSettings,
                            [type === 'cover' ? 'coverImage' : 'logoImage']: e.target.value
                        })}
                        className="w-full pl-3 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm text-slate-800 placeholder-slate-400"
                        placeholder={placeholder}
                    />
                    {/* Upload Trigger Button (Overlay on Input) */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <label className={`
                            flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-all
                            ${activeUploadType === type ? 'bg-slate-100 cursor-wait' : 'bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 border border-slate-200'}
                        `}>
                            {activeUploadType === type ? (
                                <Loader2 size={14} className="animate-spin text-indigo-600" />
                            ) : (
                                <UploadCloud size={16} />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={activeUploadType === type}
                                onChange={(e) => handleUpload(e, type)}
                            />
                        </label>
                    </div>
                </div>

                {/* Preview Thumbnail */}
                {value && (
                    <div className="w-16 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative group">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e: any) => e.target.style.display = 'none'}
                        />
                        {/* Remove Button */}
                        <button
                            onClick={() => setFormSettings({
                                ...formSettings,
                                [type === 'cover' ? 'coverImage' : 'logoImage']: ''
                            })}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <span className="text-white text-xs font-bold">삭제</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div
            onClick={() => {
                onOpen();
                onActivate();
            }}
            className={`group relative bg-white border rounded-2xl transition-all cursor-pointer overflow-hidden mb-6
                ${isOpen
                    ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg scale-[1.01]'
                    : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'}`}
        >
            {/* Header / Summary View */}
            <div className="px-6 py-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                    ${isOpen ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                    <ClipboardCheck size={20} strokeWidth={3} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h3 className={`text-base font-bold transition-colors ${isOpen ? 'text-indigo-900' : 'text-slate-700'}`}>
                            폼 제목 및 커버
                        </h3>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-400 border border-slate-200">
                            COVER
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">
                        {formSettings.title || "사용자에게 표시될 제목을 입력하세요"}
                    </p>
                </div>
            </div>

            {/* Editor View (Expanded) */}
            {isOpen && (
                <div className="px-6 pb-6 pt-5 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200 cursor-default" onClick={e => e.stopPropagation()}>
                    <div className="space-y-5">

                        {/* 1. Logo Image (New) */}
                        <ImageUploader
                            type="logo"
                            value={formSettings.logoImage}
                            label="로고 이미지 (선택)"
                            placeholder="상단 로고 이미지 URL 또는 업로드"
                        />

                        {/* 2. Title */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">폼 제목</label>
                            <textarea
                                value={formSettings.title || ''}
                                onChange={(e) => setFormSettings({ ...formSettings, title: e.target.value })}
                                className="w-full p-3 text-lg font-bold bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-slate-300 text-slate-800 resize-none h-24 leading-tight"
                                placeholder="예: 7/27(토)\n로테이션 소개팅 신청"
                                autoFocus
                            />
                        </div>

                        {/* 3. Description */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">설명 / 안내 문구</label>
                            <textarea
                                value={formSettings.description || ''}
                                onChange={(e) => setFormSettings({ ...formSettings, description: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm text-slate-600 resize-none leading-relaxed"
                                rows={3}
                                placeholder="신청 폼에 대한 간단한 설명을 입력해주세요."
                            />
                        </div>

                        {/* 4. Cover Image */}
                        <div>
                            <ImageUploader
                                type="cover"
                                value={formSettings.coverImage}
                                label="커버 이미지 (선택)"
                                placeholder="중앙 커버 이미지 URL 또는 업로드"
                            />
                            <p className="text-[11px] text-slate-400 mt-1.5 ml-1">
                                * 제목과 시작 버튼 사이에 표시됩니다.
                            </p>
                        </div>

                        {/* Bottom Action */}
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm active:scale-95 shadow-indigo-200"
                            >
                                <Check size={16} strokeWidth={3} />
                                <span>완료</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormCoverEditor;
