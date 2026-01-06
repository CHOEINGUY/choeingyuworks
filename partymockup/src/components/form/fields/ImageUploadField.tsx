import React, { useState, useEffect } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import FieldContainer from './FieldContainer';
import { FormField } from '../../../types/form';
import { ThemeStyles } from '../../../constants/formThemes';
import { useFileUpload } from '../../../hooks/useFileUpload';

interface ImageUploadFieldProps {
    field: FormField;
    value?: string[];
    onChange: (value: string[]) => void;
    theme: ThemeStyles;
    error?: { message: string };
}

/**
 * 스모어 스타일 이미지 업로드 필드 (하이브리드 방식)
 * 1. 초기 상태: 큰 드롭존 (심미성 & 다중 선택 지원)
 * 2. 업로드 후: 그리드 + 추가 슬롯 (쉬운 네비게이션 & 추가 업로드 지원)
 */
const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ field, value, onChange, theme, error }) => {
    const initialPreviews = Array.isArray(value) ? value : (value ? [value] : []);
    const [previews, setPreviews] = useState<string[]>(initialPreviews as string[]);
    const { upload, isUploading } = useFileUpload();

    useEffect(() => {
        const nextPreviews = Array.isArray(value) ? value : (value ? [value] : []);
        setPreviews(nextPreviews as string[]);
    }, [value]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        if (previews.length + files.length > 3) {
            toast.warning('이미지는 최대 3장까지 업로드 가능합니다.');
            return;
        }

        // Validation
        const validFiles: File[] = [];
        for (const file of files) {
            if (field.validation?.maxSize && file.size > field.validation.maxSize) {
                toast.error(`파일 크기는 ${(field.validation.maxSize / 1024 / 1024).toFixed(1)}MB 이하여야 합니다.`);
                return;
            }
            if (field.validation?.allowedTypes && !field.validation.allowedTypes.includes(file.type)) {
                toast.error('JPG, PNG 파일만 업로드 가능합니다.');
                return;
            }
            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        // Upload
        const newPreviews = [...previews];

        try {
            for (const file of validFiles) {
                const url = await upload(file); // Real Upload
                if (url) {
                    newPreviews.push(url);
                } else {
                    console.error("No URL returned from upload");
                }
            }

            setPreviews(newPreviews);
            onChange(newPreviews);

        } catch (err) {
            console.error("Upload failed", err);
            toast.error("이미지 업로드에 실패했습니다.");
        }

        e.target.value = '';
    };

    const handleRemove = (index: number) => {
        const newPreviews = previews.filter((_, i) => i !== index);
        setPreviews(newPreviews);
        onChange(newPreviews);
    };

    const remainingSlots = 3 - previews.length;
    const isLoading = isUploading;

    return (
        <FieldContainer field={field} theme={theme} error={error} bodyClassName="flex-1 flex flex-col">
            <div className="space-y-4">

                {/* CASE 1: Empty -> Large Dropzone */}
                {previews.length === 0 ? (
                    <label
                        className={`w-full max-w-xs mx-auto aspect-square flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:scale-[1.02] group relative overflow-hidden rounded-2xl border-2 border-dashed ${error ? 'border-red-500' : theme.border_base} ${theme.input_bg} shadow-sm`}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            disabled={isLoading}
                            className="hidden"
                        />

                        {isLoading ? (
                            <div className={`flex flex-col items-center gap-2 ${theme.text_secondary}`}>
                                <Upload size={40} className="animate-bounce" />
                                <span className="text-sm font-medium">업로드 중...</span>
                            </div>
                        ) : (
                            <>
                                <Upload
                                    size={40}
                                    className={`relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${theme.text_secondary} group-hover:${theme.text_accent}`}
                                />
                                <p className={`mt-6 text-base font-semibold relative z-10 transition-all duration-500 group-hover:scale-105 ${theme.text_primary}`}>
                                    이미지 업로드
                                </p>
                                <p className={`mt-2 text-sm opacity-60 relative z-10 ${theme.text_secondary}`}>
                                    최대 3장까지 가능합니다
                                </p>
                            </>
                        )}
                    </label>
                ) : (
                    /* CASE 2: Has Images -> Grid + Slot */
                    <div className="grid grid-cols-3 gap-3">
                        {previews.map((src, index) => (
                            <div key={index} className="relative aspect-square group animate-in fade-in zoom-in duration-300">
                                <div className={`absolute inset-0 rounded-2xl overflow-hidden shadow-sm border ${theme.border_base}`}>
                                    <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm transition-all active:scale-95 z-10"
                                >
                                    <X size={14} className="text-white" />
                                </button>

                                {index === 0 && (
                                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm">
                                        <span className="text-[10px] font-bold text-white">대표</span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {remainingSlots > 0 && (
                            <label
                                className={`relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 overflow-hidden group ${error ? 'border-red-500' : theme.border_base} ${theme.input_bg} hover:${theme.highlight_bg}`}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileSelect}
                                    disabled={isLoading}
                                    className="hidden"
                                />
                                <div className="flex flex-col items-center justify-center text-center p-2">
                                    {isLoading ? (
                                        <div className={`p-3 rounded-full mb-1 ${theme.text_secondary}`}>
                                            <Upload size={20} className="animate-spin" />
                                        </div>
                                    ) : (
                                        <>
                                            <div className={`p-3 rounded-full mb-1 group-hover:scale-110 transition-transform ${theme.card_bg} shadow-sm ${theme.text_secondary}`}>
                                                <Plus size={20} />
                                            </div>
                                            <span className={`text-[10px] font-bold ${theme.text_secondary}`}>
                                                추가하기
                                            </span>
                                            <span className={`text-[9px] opacity-40 mt-0.5 ${theme.text_tertiary}`}>
                                                {previews.length}/3
                                            </span>
                                        </>
                                    )}
                                </div>
                            </label>
                        )}
                    </div>
                )}

            </div>
        </FieldContainer>
    );
};

export default ImageUploadField;
