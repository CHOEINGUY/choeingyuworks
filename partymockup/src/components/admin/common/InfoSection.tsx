
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface InfoSectionProps {
    title: string;
    content: any;
    icon?: React.ReactNode;
    isEditing: boolean;
    onChange?: (value: any) => void;
    isDark?: boolean;
    fieldType?: string;
    onViewImage?: (src: string | string[]) => void;
    options?: any[];
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, content, icon, isEditing, onChange, isDark, fieldType, options }) => {
    const [imgIndex, setImgIndex] = useState(0);

    const getDisplayValue = (val: any) => {
        if (!val) return '';
        if (!options || options.length === 0) {
            return Array.isArray(val) ? val.join(', ') : val;
        }

        const resolve = (v: any) => {
            const opt = options.find((o: any) =>
                (typeof o === 'object' && (o.value === String(v) || o.label === String(v))) ||
                String(o) === String(v)
            );
            if (opt && typeof opt === 'object') return opt.label;
            return opt || v;
        };

        if (Array.isArray(val)) {
            return val.map(resolve).filter(Boolean).join(', ');
        }

        if (typeof val === 'string' && val.includes(',') && !options.find((o: any) => (o.value === val || o === val))) {
            return val.split(',').map(v => resolve(v.trim())).join(', ');
        }

        return resolve(val);
    };

    // 1. Image View
    if (fieldType === 'image_upload' && content && !isEditing) {
        const images = Array.isArray(content) ? content : [content];
        const currentSrc = images[imgIndex] || images[0];

        return (
            <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                <div className={`flex items-center justify-between p-3 pb-2 border-b ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                    <span className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{title}</span>
                    {images.length > 1 && (
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                            {imgIndex + 1} / {images.length}
                        </span>
                    )}
                </div>
                <div className="p-2 bg-black/5 flex justify-center relative group min-h-[200px] items-center">
                    <img
                        src={currentSrc}
                        alt={title}
                        className="max-h-80 object-contain rounded-lg shadow-sm"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "https://via.placeholder.com/300?text=No+Image";
                        }}
                    />

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); setImgIndex((prev) => (prev - 1 + images.length) % images.length); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setImgIndex((prev) => (prev + 1) % images.length); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // 2. File View
    if (fieldType === 'file_upload' && content && !isEditing) {
        return (
            <div className={`rounded-xl border ${isDark ? 'bg-slate-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                <div className={`flex items-center gap-2 p-3 pb-2 border-b ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                    <span className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{title}</span>
                </div>
                <div className={`p-4 ${isDark ? 'bg-slate-900/30' : 'bg-gray-50/30'}`}>
                    <a href={content} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline flex items-center gap-2">
                        <span className="font-bold text-sm">첨부파일 확인하기</span>
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-xl border ${isDark ? 'bg-slate-800 border-gray-600' : 'bg-white border-gray-300'}`}>
            {/* Header (Static) */}
            <div className={`flex items-center gap-2 p-3 pb-2 border-b ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                {icon && <span className="text-lg">{icon}</span>}
                <span className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{title}</span>
            </div>

            {/* Content (Always Visible) */}
            <div className={`p-3 ${isDark ? 'bg-slate-900/30' : 'bg-gray-50/30'}`}>
                {isEditing && onChange ? (
                    <textarea
                        className={`w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none ${isDark ? 'bg-slate-800 border-gray-600 text-white' : 'bg-white'}`}
                        rows={4}
                        value={content || ''}
                        onChange={e => onChange(e.target.value)}
                    />
                ) : (
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {getDisplayValue(content) || <span className="text-gray-500/50 italic">내용이 없습니다.</span>}
                    </p>
                )}
            </div>
        </div>
    );
};

export default InfoSection;
