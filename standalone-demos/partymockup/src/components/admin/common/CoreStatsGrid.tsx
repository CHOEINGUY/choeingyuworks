import React, { useState } from 'react';
import { Briefcase, MapPin, Calendar, Instagram, Brain, Ruler, Image as ImageIcon, X, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { SYSTEM_FIELDS } from '../../../constants/systemFields';

interface CoreStatsGridProps {
    data: any; // Using any for now to be flexible with Applicant structure, but should ideally be Applicant
    isEditing: boolean;
    onChange: (fieldId: string, value: string) => void;
    isDark?: boolean;
}

const CoreStatsGrid: React.FC<CoreStatsGridProps> = ({ data, isEditing, onChange, isDark }) => {
    const [viewImage, setViewImage] = useState<string | string[] | null>(null);
    const [modalImgIndex, setModalImgIndex] = useState(0);

    const openModal = (imgData: string | string[]) => {
        if (!imgData) return;
        setViewImage(imgData);
        setModalImgIndex(0);
    };

    const getFieldValue = (fieldId: string) => {
        // System fields first (top level)
        if (data[fieldId]) return data[fieldId];

        // Handle answers
        if (data.answers) {
            // If array
            if (Array.isArray(data.answers)) {
                const answer = data.answers.find((a: any) => a.questionId === fieldId);
                return answer ? answer.value : '';
            }
            // If object
            return data.answers[fieldId] || '';
        }
        return '';
    };


    // Grid Configuration
    const GRID_ITEMS = [
        { id: SYSTEM_FIELDS.JOB, label: '직업', icon: <Briefcase size={12} /> },
        { id: SYSTEM_FIELDS.LOCATION, label: '거주지', icon: <MapPin size={12} /> },
        { id: SYSTEM_FIELDS.BIRTH_DATE, label: '생년월일', icon: <Calendar size={12} />, placeholder: 'YYYYMMDD' },
        { id: 'instagram', label: '인스타그램', icon: <Instagram size={12} />, placeholder: '@ID', isLink: true },
        { id: SYSTEM_FIELDS.HEIGHT, label: '키', icon: <Ruler size={12} />, placeholder: '키 입력' },
        { id: SYSTEM_FIELDS.MBTI, label: 'MBTI', icon: <Brain size={12} />, placeholder: 'MBTI 입력' },
        { id: SYSTEM_FIELDS.GENDER, label: '성별', icon: <User size={12} /> },
        { id: 'photo_view', label: '프로필 사진', icon: <ImageIcon size={12} /> }
    ];

    // Filter items to show
    const visibleItems = GRID_ITEMS.filter(item => {
        // [NEW] Hide gender from grid in edit mode since it's in the header toggle
        if (isEditing && item.id === SYSTEM_FIELDS.GENDER) return false;

        if (isEditing) return true; // Always show other items in edit mode
        if (item.id === 'photo_view') {
            const face = getFieldValue('face_photo');
            const body = getFieldValue('full_body_photo');
            return face || body;
        }
        const val = getFieldValue(item.id);
        return val && val !== ''; // Show only if has value
    });

    // Helper for modal view
    const currentViewImages = viewImage ? (Array.isArray(viewImage) ? viewImage : [viewImage]) : [];
    const currentModalSrc = currentViewImages[modalImgIndex] || currentViewImages[0];


    // Helper for button styles
    const getPhotoButtonStyle = (isActive: any, isDark?: boolean) => {
        if (isActive) {
            return isDark
                ? 'bg-slate-800 text-white border-slate-500 hover:bg-slate-700'
                : 'bg-white text-slate-900 border-slate-900 hover:bg-slate-50';
        }
        return isDark
            ? 'bg-slate-800 text-slate-600 border-slate-700'
            : 'bg-slate-100 text-slate-400 border-slate-200';
    };

    // Touch handlers for mobile swipe
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            // Next
            setModalImgIndex((prev) => (prev + 1) % currentViewImages.length);
        }
        if (isRightSwipe) {
            // Prev
            setModalImgIndex((prev) => (prev - 1 + currentViewImages.length) % currentViewImages.length);
        }
    };

    return (
        <>
            <div className={`grid grid-cols-2 w-full h-fit shrink-0 rounded-xl overflow-hidden border ${isDark ? 'bg-slate-900 border-slate-600' : 'bg-white border-gray-300'}`}>
                {visibleItems.map((item, index) => {
                    const value = getFieldValue(item.id);
                    const isLastRow = index >= visibleItems.length - (visibleItems.length % 2 === 0 ? 2 : 1);
                    const isLeftCol = index % 2 === 0;

                    // Special Render for Photo View
                    if (item.id === 'photo_view') {
                        const face = getFieldValue('face_photo');
                        const body = getFieldValue('full_body_photo');

                        return (
                            <div
                                key={item.id}
                                className={`p-3 ${isDark ? 'bg-slate-900' : 'bg-white'} 
                                    ${!isLastRow ? (isDark ? 'border-b border-slate-700' : 'border-b border-gray-200') : ''} 
                                    ${isLeftCol ? (isDark ? 'border-r border-slate-700' : 'border-r border-gray-200') : ''}
                                `}
                            >
                                <div className="flex items-center gap-1.5 mb-2 opacity-70">
                                    {item.icon}
                                    <span className="text-xs font-bold">{item.label}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); face && openModal(face); }}
                                        disabled={!face}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors border ${getPhotoButtonStyle(face, isDark)}`}
                                    >
                                        얼굴 {Array.isArray(face) && face.length > 1 && `(${face.length})`}
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); body && openModal(body); }}
                                        disabled={!body}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors border ${getPhotoButtonStyle(body, isDark)}`}
                                    >
                                        전신 {Array.isArray(body) && body.length > 1 && `(${body.length})`}
                                    </button>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={item.id}
                            className={`p-3 ${isDark ? 'bg-slate-900' : 'bg-white'} 
                                ${!isLastRow ? (isDark ? 'border-b border-slate-700' : 'border-b border-gray-200') : ''} 
                                ${isLeftCol ? (isDark ? 'border-r border-slate-700' : 'border-r border-gray-200') : ''}
                            `}
                        >
                            <div className="flex items-center gap-1.5 mb-1 opacity-70">
                                {item.icon}
                                <span className="text-xs font-bold">{item.label}</span>
                            </div>

                            {isEditing ? (
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => onChange(item.id, e.target.value)}
                                    className={`w-full p-1 text-sm border rounded mt-1 outline-none ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-blue-300'}`}
                                    placeholder={item.placeholder || ''}
                                />
                            ) : (
                                item.isLink && value ? (
                                    <a
                                        href={`https://instagram.com/${value.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`font-medium text-sm transition-colors block truncate ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        @{value.replace('@', '')}
                                    </a>
                                ) : (
                                    <div className="font-medium text-sm">
                                        {item.id === SYSTEM_FIELDS.GENDER
                                            ? (value === 'M' ? '남성' : value === 'F' ? '여성' : '-')
                                            : (value || '-')}
                                    </div>
                                )
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Image Modal */}
            {viewImage && (
                <div
                    className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setViewImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 z-50"
                        onClick={() => setViewImage(null)}
                    >
                        <X size={24} />
                    </button>

                    <div
                        className="relative flex items-center justify-center w-full h-full"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <img
                            src={currentModalSrc}
                            alt="Profile Detail"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg select-none"
                            draggable={false}
                        />

                        {currentViewImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setModalImgIndex((prev) => (prev - 1 + currentViewImages.length) % currentViewImages.length); }}
                                    className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setModalImgIndex((prev) => (prev + 1) % currentViewImages.length); }}
                                    className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
                                >
                                    <ChevronRight size={32} />
                                </button>

                                {/* Pagination Dots */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {currentViewImages.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-2 h-2 rounded-full transition-all ${idx === modalImgIndex ? 'bg-white scale-110' : 'bg-white/30'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default CoreStatsGrid;
