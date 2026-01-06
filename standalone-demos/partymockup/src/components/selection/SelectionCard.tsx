
import React from 'react';
import { Heart, Check, User as UserIcon } from 'lucide-react';
import { User, Feedback } from '../../types';

interface SelectionCardProps {
    candidate: User;
    feedback?: Feedback;
    isSelected: boolean;
    isSubmitting: boolean;
    gender: 'M' | 'F';
    onToggleSelection: (id: string) => void;
    onNext: () => void;
    onPrev: () => void;
}

const SelectionCard: React.FC<SelectionCardProps> = ({
    candidate,
    feedback,
    isSelected,
    isSubmitting,
    gender,
    onToggleSelection,
    onNext,
    onPrev
}) => {
    const isMale = gender === 'M';

    // Theme logic
    const buttonSelectedClass = isMale
        ? 'bg-blue-500 text-white shadow-blue-200 active:scale-95 border border-blue-500'
        : 'bg-pink-500 text-white shadow-pink-200 active:scale-95 border border-pink-500';
    const buttonOutlineBorder = isMale ? 'border-blue-300' : 'border-pink-300';
    const buttonOutlineText = isMale ? 'text-blue-500' : 'text-pink-500';

    return (
        <div className="min-w-full h-full flex flex-col relative">
            {/* Navigation Touch Zones */}
            <div className="absolute inset-0 flex z-20 pointer-events-none">
                <div onClick={onPrev} className="w-1/3 h-full pointer-events-auto cursor-pointer" role="button" aria-label="Previous" />
                <div className="w-1/3 h-full" />
                <div onClick={onNext} className="w-1/3 h-full pointer-events-auto cursor-pointer" role="button" aria-label="Next" />
            </div>

            {/* Content Body - Full Height */}
            <div className="p-5 flex-1 flex flex-col bg-white h-full justify-center">

                {/* Profile Header (Thumbnail Style) */}
                <div className="flex items-center gap-4 mb-6 px-2">
                    {candidate.avatar ? (
                        <img
                            src={candidate.avatar}
                            alt={candidate.name}
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 shadow-sm shrink-0 bg-gray-100"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full border-2 border-gray-100 shadow-sm shrink-0 bg-gray-100 flex items-center justify-center">
                            <UserIcon size={32} className="text-gray-400" />
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                            <span className="text-xs font-normal bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">
                                {new Date().getFullYear() - (candidate.birthYear || 2000) + 1}세
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{candidate.job} · {candidate.location}</p>

                        <div className="flex gap-1 mt-1 overflow-hidden">
                            {(candidate.tags || []).slice(0, 2).map((tag: string, i: number) => (
                                <span key={i} className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">#{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feedback Recap - Fixed/Standardized Area */}
                <div className="h-40 bg-gray-50 p-5 rounded-2xl flex flex-col border border-gray-100 relative z-30 shrink-0 mx-2 mb-4 shadow-inner">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">나의 메모 & 평가</p>
                        {feedback ? (
                            <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                <Heart size={12} className={`fill-${isMale ? 'blue' : 'rose'}-400 text-${isMale ? 'blue' : 'rose'}-400`} />
                                <span className="font-bold text-sm text-gray-700">{feedback.rating}점</span>
                            </div>
                        ) : null}
                    </div>

                    <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
                        {feedback ? (
                            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                                "{feedback.note || "작성된 메모가 없습니다."}"
                            </p>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2 opacity-50">
                                <span className="text-2xl">📝</span>
                                <span className="text-sm">기록된 내용이 없습니다.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Select Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering nav
                        onToggleSelection(candidate.id);
                    }}
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md z-30 relative shrink-0 mx-auto
                        ${isSelected
                            ? buttonSelectedClass
                            : `bg-white border ${buttonOutlineBorder} ${buttonOutlineText}`}`}
                    style={{ width: 'calc(100% - 16px)' }}
                >
                    {isSelected ? (
                        <>
                            <Check size={18} /> 선택됨
                        </>
                    ) : (
                        <>
                            <Heart size={18} /> 최종 선택하기
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SelectionCard;
