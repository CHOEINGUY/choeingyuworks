
import React, { useState } from 'react';
import { User, Feedback } from '../types';
import { toast } from 'sonner';
import { useSwipe } from '../hooks/useSwipe';
import { User as UserIcon } from 'lucide-react';
import SelectionCard from './selection/SelectionCard';

interface SelectionFormProps {
    onSubmit: (selectedIds: string[]) => void;
    onSelectionChange?: (isComplete: boolean) => void;
    feedbackData?: Record<string, Feedback>;
    gender?: 'M' | 'F';
    usersData?: Record<string, User>;
    currentUserId?: string;
}

const SelectionForm: React.FC<SelectionFormProps> = ({
    onSubmit,
    onSelectionChange,
    feedbackData = {},
    gender = 'F',
    usersData = {}
}) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isMale = gender === 'M';
    const dotActive = isMale ? 'bg-blue-500 w-3' : 'bg-pink-500 w-3';
    const badgeBg = isMale ? 'bg-blue-50 border-blue-100' : 'bg-pink-50 border-pink-100';

    // Filter candidates from props
    const candidates = Object.entries(usersData || {})
        .filter(([, user]) => user.gender !== gender)
        .map(([id, user]) => ({ ...user, id }));

    const handleNext = () => setCurrentIndex(prev => (prev < candidates.length - 1 ? prev + 1 : prev));
    const handlePrev = () => setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));

    // Use custom swipe hook
    const swipeHandlers = useSwipe(handleNext, handlePrev);

    const toggleSelection = (id: string) => {
        if (isSubmitting) return;

        let newSelectedIds;
        if (selectedIds.includes(id)) {
            newSelectedIds = selectedIds.filter(sid => sid !== id);
        } else {
            if (selectedIds.length < 2) {
                newSelectedIds = [...selectedIds, id];
            } else {
                toast.warning("최대 2명까지만 선택할 수 있습니다. 기존 선택을 해제하고 시도해주세요.");
                return;
            }
        }
        setSelectedIds(newSelectedIds);
        if (onSelectionChange) {
            onSelectionChange(newSelectedIds.length === 2);
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        if (selectedIds.length === 0) {
            toast.error("최소 1명 이상 선택해주세요!");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(selectedIds);
        } catch (e) {
            console.error(e);
            setIsSubmitting(false); // Only reset on error
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden relative">
            {/* Header */}
            <div className="text-center pt-6 pb-4 relative z-10 bg-white">
                <h2 className="text-xl font-bold text-gray-800">최종 선택</h2>
                <p className="text-xs text-gray-500">마음에 들었던 분을 선택해주세요. (최대 2명)</p>
            </div>

            {/* Slideshow Area - Carousel Container */}
            <div
                className="flex-1 relative overflow-hidden group touch-pan-y bg-gray-100 border-y border-gray-200"
                {...swipeHandlers}
            >
                {/* Visual Slide Track */}
                <div
                    className="flex h-full transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {candidates.map((candidate) => (
                        <SelectionCard
                            key={candidate.id}
                            candidate={candidate}
                            feedback={feedbackData[candidate.id]}
                            isSelected={selectedIds.includes(candidate.id)}
                            isSubmitting={isSubmitting}
                            gender={gender}
                            onToggleSelection={toggleSelection}
                            onNext={handleNext}
                            onPrev={handlePrev}
                        />
                    ))}
                </div>
            </div>

            {/* Pagination/Dots */}
            <div className="flex justify-center gap-1.5 pt-3 pb-2 relative z-10 bg-white">
                {candidates.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300
                            ${idx === currentIndex
                                ? dotActive
                                : 'bg-gray-300'}`}
                    />
                ))}
            </div>

            {/* Footer: Selected Status & Submit */}
            <div className="bg-white p-4 relative z-10">
                <div className="flex flex-col gap-2 mb-4">
                    <span className="text-sm font-bold text-gray-800 mb-1">나의 선택 ({selectedIds.length}/2)</span>
                    <div className="flex gap-2 min-h-[50px]">
                        {selectedIds.length === 0 && (
                            <div className="w-full text-center text-gray-400 text-xs py-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                마음에 드는 분을 선택해주세요
                            </div>
                        )}
                        {selectedIds.map(id => {
                            const user = usersData[id] || { name: 'Unknown', avatar: '', birthYear: 2000, job: '' };
                            return (
                                <div
                                    key={id}
                                    onClick={() => {
                                        const idx = candidates.findIndex(c => c.id === id);
                                        if (idx !== -1) setCurrentIndex(idx);
                                    }}
                                    className={`flex-1 flex items-center gap-2 p-2 rounded-lg border animate-in zoom-in duration-200 cursor-pointer active:scale-95 transition-all ${badgeBg}`}
                                >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            className="w-8 h-8 rounded-full bg-white object-cover"
                                            alt={user.name || ''}
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <UserIcon size={16} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs font-bold text-gray-900 truncate">{user.name}</span>
                                            <span className="text-[10px] text-gray-500 shrink-0">{new Date().getFullYear() - (user.birthYear || 2000) + 1}세</span>
                                        </div>
                                        <span className="text-[10px] text-gray-500 truncate">{user.job}</span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSelection(id);
                                        }}
                                        disabled={isSubmitting}
                                        className="ml-auto text-gray-400 hover:text-red-500 shrink-0 p-1 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <div className="sr-only">삭제</div>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            );
                        })}
                        {selectedIds.length === 1 && (
                            <div className="flex-1 flex items-center justify-center gap-2 bg-gray-50 p-2 rounded-lg border border-dashed border-gray-200 opacity-50">
                                <span className="text-xs text-gray-400">선택 추가 가능</span>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={selectedIds.length === 0 || isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2
                        ${selectedIds.length > 0 && !isSubmitting
                            ? 'bg-gradient-to-r from-gray-800 to-black text-white hover:shadow-xl active:scale-95'
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            제출 중...
                        </>
                    ) : (
                        "최종 결정 완료"
                    )}
                </button>
            </div>
        </div>
    );
};
export default SelectionForm;
