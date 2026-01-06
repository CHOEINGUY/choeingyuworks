import React, { useState, useEffect } from 'react';
import { Upload, X, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeStyles } from '../../../../constants/formThemes';
import { useFileUpload } from '../../../../hooks/useFileUpload';

interface ProfileImageFieldProps {
    field: any;
    themeStyles: ThemeStyles;
    variant?: 'standard' | 'immersive';
}



const ProfileImageField: React.FC<ProfileImageFieldProps> = ({ field, themeStyles, variant = 'standard' }) => {
    const [previews, setPreviews] = useState<string[]>([]);
    const [isCompressing, setIsCompressing] = useState(false);
    const { upload, isUploading: hookIsUploading } = useFileUpload();

    // Combined loading state
    const isLoading = isCompressing || hookIsUploading;

    useEffect(() => {
        if (field.value) {
            setPreviews(Array.isArray(field.value) ? field.value : [field.value]);
        } else {
            setPreviews([]);
        }
    }, [field.value]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (previews.length + files.length > 3) {
            toast.warning('이미지는 최대 3장까지 업로드 가능합니다.');
            return;
        }

        setIsCompressing(true);
        const newPreviews = [...previews];

        try {
            for (const file of files) {
                // Upload to R2 via Hook (handling compression internally)
                const uploadedUrl = await upload(file);

                if (uploadedUrl) {
                    newPreviews.push(uploadedUrl);
                } else {
                    console.error("Upload returned no URL");
                    toast.error("이미지 업로드에 실패했습니다. (URL 반환 없음)");
                }
            }

            setPreviews(newPreviews);
            field.onChange?.(newPreviews);
        } catch (error) {
            console.error("Image processing/upload failed:", error);
            toast.error("이미지 업로드 중 오류가 발생했습니다.");
        } finally {
            setIsCompressing(false);
            e.target.value = '';
        }
    };

    const handleRemove = (index: number) => {
        const newPreviews = previews.filter((_, i) => i !== index);
        setPreviews(newPreviews);
        field.onChange?.(newPreviews);
    };

    const radiusClass = themeStyles.radius_input || "rounded-xl";
    const bgClass = themeStyles.input_bg || "bg-slate-50";

    // IMMERSIVE VARIANT
    if (variant === 'immersive') {
        return (
            <div className="w-full space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    {previews.map((src, idx) => (
                        <div key={idx} className={`relative aspect-[3/4] ${radiusClass} overflow-hidden shadow-lg group`}>
                            <img src={src} className="w-full h-full object-cover" alt="Preview" />
                            <button
                                onClick={() => handleRemove(idx)}
                                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ))}

                    {previews.length < 3 && (
                        <label className={`aspect-[3/4] flex flex-col items-center justify-center border-2 border-dashed ${themeStyles.border_base} ${radiusClass} ${bgClass} cursor-pointer hover:bg-white/50 transition-colors relative`}>
                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} disabled={isLoading} />
                            {isLoading ? (
                                <Loader2 size={32} className={`animate-spin ${themeStyles.text_accent}`} />
                            ) : (
                                <Plus size={32} className={themeStyles.text_secondary} />
                            )}
                            <span className={`text-sm mt-2 opacity-60 ${themeStyles.text_secondary}`}>
                                {isLoading ? '업로드 중...' : `사진 추가 (${previews.length}/3)`}
                            </span>
                        </label>
                    )}
                </div>
            </div>
        );
    }

    // STANDARD VARIANT
    return (
        <div className="w-full space-y-3">
            <div className="flex flex-wrap gap-3">
                {previews.map((src, idx) => (
                    <div key={idx} className={`relative w-24 h-24 ${radiusClass} overflow-hidden border ${themeStyles.border_base}`}>
                        <img src={src} className="w-full h-full object-cover" alt="Preview" />
                        <button
                            onClick={() => handleRemove(idx)}
                            className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}

                {previews.length < 3 && (
                    <label className={`w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed ${themeStyles.border_base} ${radiusClass} ${bgClass} cursor-pointer hover:bg-white transition-colors group relative`}>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} disabled={isLoading} />
                        {isLoading ? (
                            <Loader2 size={20} className={`animate-spin ${themeStyles.text_accent}`} />
                        ) : (
                            <Upload size={20} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        )}
                        <span className="text-[10px] text-slate-400 mt-1">
                            {isLoading ? '처리 중' : '업로드'}
                        </span>
                    </label>
                )}
            </div>
        </div>
    );
};

export default ProfileImageField;
