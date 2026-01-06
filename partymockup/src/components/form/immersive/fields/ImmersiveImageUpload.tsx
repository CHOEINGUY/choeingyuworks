import React, { useRef, useState, useEffect } from 'react';
import { Image as ImageIcon, X, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useFileUpload } from '../../../../hooks/useFileUpload';

interface ImmersiveImageUploadProps {
    field: any;
    value: string[];
    onChange: (value: string[]) => void;
    onNext: () => void;
    themeStyles: any;
}

const ImmersiveImageUpload: React.FC<ImmersiveImageUploadProps> = ({ field: _, value, onChange, onNext: __, themeStyles }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // value가 배열이 아니면 배열로 변환
    const initialImages = Array.isArray(value) ? value : (value ? [value] : []);
    const [images, setImages] = useState<string[]>(initialImages);
    const [uploadingIds, setUploadingIds] = useState<number[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    // File Upload Hook
    const { upload } = useFileUpload();

    // Sync from parent
    useEffect(() => {
        const nextImages = Array.isArray(value) ? value : (value ? [value] : []);
        if (nextImages.length !== images.length || nextImages[0] !== images[0]) {
            setImages(nextImages);
        }
    }, [value]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement> | { target: { files: FileList | null } }) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Check Limit
        if (images.length + files.length > 3) {
            toast.warning('최대 3장까지 업로드 가능합니다.');
            return;
        }

        const validFiles = files.filter(f => f.type.startsWith('image/'));
        if (validFiles.length !== files.length) {
            toast.error('이미지 파일만 선택해주세요.');
        }
        if (validFiles.length === 0) return;

        // Process Uploads
        const newImages = [...images];
        const startIdx = newImages.length;

        const uploadingIndexes: number[] = [];
        validFiles.forEach((file, i) => {
            const blobUrl = URL.createObjectURL(file);
            newImages.push(blobUrl);
            uploadingIndexes.push(startIdx + i);
        });

        setImages(newImages);
        setUploadingIds(prev => [...prev, ...uploadingIndexes]);

        const uploadPromises = validFiles.map(async (file, i) => {
            const index = startIdx + i;
            try {
                const remoteUrl = await upload(file);
                setImages(prev => {
                    const next = [...prev];
                    next[index] = remoteUrl;
                    return next;
                });
                return remoteUrl;
            } catch (err) {
                console.error("Upload failed", err);
                toast.error('이미지 업로드에 실패했습니다.');
                setImages(prev => prev.filter((_, idx) => idx !== index));
            } finally {
                setUploadingIds(prev => prev.filter(id => id !== index));
            }
        });

        await Promise.all(uploadPromises);
    };

    // Propagate changes
    useEffect(() => {
        if (uploadingIds.length === 0) {
            // [FIX] Infinite Loop Prevention
            // Only call onChange if the local state actually differs from the parent's value
            const propImages = Array.isArray(value) ? value : (value ? [value] : []);
            const isDifferent = JSON.stringify(images) !== JSON.stringify(propImages);

            if (isDifferent) {
                onChange(images);
            }
        }
    }, [images, uploadingIds, onChange, value]);

    const handleRemove = (indexToRemove: number) => {
        setImages(prev => prev.filter((_, i) => i !== indexToRemove));
        const nextImages = images.filter((_, i) => i !== indexToRemove);
        onChange(nextImages);
    };

    const remainingSlots = 3 - images.length;

    // --- Drag & Drop Handlers for the Large Dropzone ---
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => {
        setIsDragging(false);
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        // Reuse handleFileSelect logic by mocking event
        const files = e.dataTransfer.files;
        handleFileSelect({ target: { files } });
    };


    return (
        <div className="w-full">
            <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
            />

            <AnimatePresence mode="wait">
                {/* CASE 1: Empty State -> Show Large Centered Dropzone (User Preference) */}
                {images.length === 0 ? (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`
                            w-full aspect-square max-h-[40vh] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all
                            ${isDragging ? `${themeStyles.border_checked} ${themeStyles.highlight_bg}` : `${themeStyles.border_base} ${themeStyles.input_bg} ${themeStyles.hover_border_light}`}
                        `}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className={`w-20 h-20 rounded-full shadow-sm flex items-center justify-center ${themeStyles.text_accent} mb-2 ${themeStyles.bg_app}`}>
                            <ImageIcon size={40} />
                        </div>
                        <div className="text-center">
                            <p className={`text-xl font-bold ${themeStyles.text_primary}`}>이미지 업로드</p>
                            <p className={`mt-1 ${themeStyles.text_tertiary}`}>터치하여 사진을 선택하세요 (최대 3장)</p>
                        </div>
                    </motion.div>
                ) : (
                    /* CASE 2: Has Images -> Show Grid with Mini Slot for Add More */
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-3 gap-3"
                    >
                        <AnimatePresence initial={false}>
                            {images.map((src, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className={`relative aspect-square rounded-2xl overflow-hidden shadow-sm border ${themeStyles.border_base || 'border-gray-200'}`}
                                >
                                    <img src={src} alt="Uploaded" className="w-full h-full object-cover" />

                                    {uploadingIds.includes(index) && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                            <Loader2 className="animate-spin text-white" size={24} />
                                        </div>
                                    )}

                                    {!uploadingIds.includes(index) && (
                                        <button
                                            onClick={() => handleRemove(index)}
                                            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500/80 transition-colors backdrop-blur-md"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}

                                    {!uploadingIds.includes(index) && index === 0 && (
                                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-lg backdrop-blur-md">
                                            <span className="text-[10px] font-bold text-white block leading-none">대표 사진</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {remainingSlots > 0 && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => fileInputRef.current?.click()}
                                className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all group ${themeStyles.border_base} ${themeStyles.input_bg} hover:${themeStyles.highlight_bg}`}
                            >
                                <div className={`p-3 rounded-full ${themeStyles.bg_app} shadow-sm group-hover:scale-110 transition-transform`}>
                                    <Plus className={themeStyles.text_primary} size={24} />
                                </div>
                                <div className="text-center">
                                    <span className={`text-xs font-bold ${themeStyles.text_secondary}`}>
                                        추가하기
                                    </span>
                                    <span className={`block text-[10px] ${themeStyles.text_tertiary} mt-0.5`}>
                                        {images.length}/3
                                    </span>
                                </div>
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImmersiveImageUpload;
