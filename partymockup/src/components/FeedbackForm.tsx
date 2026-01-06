import React, { useState, useEffect } from 'react';
import { Heart, CheckCircle } from 'lucide-react';

interface FeedbackFormProps {
    partnerName: string;
    onSubmit: (data: { rating: number; note: string; tags: string[] }) => void;
    themeMode?: 'day' | 'night';
    themeStyle?: 'standard' | 'glass';
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ partnerName, onSubmit, themeMode = 'day', themeStyle = 'standard' }) => {
    const [rating, setRating] = useState(0);
    const [note, setNote] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    // Keywords
    const FEEDBACK_KEYWORDS = ["유머러스함", "경청을 잘해요", "매너가 좋아요", "대화가 잘 통해요", "미소가 예뻐요"];
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

    const toggleKeyword = (keyword: string) => {
        if (selectedKeywords.includes(keyword)) {
            setSelectedKeywords(prev => prev.filter(k => k !== keyword));
        } else {
            setSelectedKeywords(prev => [...prev, keyword]);
        }
    };

    // Load draft from localStorage on mount
    useEffect(() => {
        const draft = localStorage.getItem(`feedback_draft_${partnerName}`);
        if (draft) {
            try {
                const { rating: savedRating, note: savedNote, tags: savedTags } = JSON.parse(draft);
                setRating(savedRating || 0);
                setNote(savedNote || "");
                setSelectedKeywords(savedTags || []);
            } catch (e) {
                console.error("Failed to parse draft", e);
            }
        }
    }, [partnerName]);

    // Save draft on changes
    useEffect(() => {
        // Only save if not submitted and has some content
        if (!isSubmitted && (rating > 0 || note.length > 0 || selectedKeywords.length > 0)) {
            const draft = JSON.stringify({ rating, note, tags: selectedKeywords });
            localStorage.setItem(`feedback_draft_${partnerName}`, draft);
        }
    }, [rating, note, selectedKeywords, isSubmitted, partnerName]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Submit rating, note, and keywords
        onSubmit({ rating, note, tags: selectedKeywords });
        setIsSubmitted(true);
        // Clear draft
        localStorage.removeItem(`feedback_draft_${partnerName}`);
    };

    // ... (Rating Logic omitted from paste, keeping existing)
    // Rating Descriptions for Context
    const getRatingLabel = (score: number) => {
        switch (score) {
            case 1: return "아쉬웠어요 (코드 불일치)";
            case 2: return "평범했어요 (쏘쏘)";
            case 3: return "즐거웠어요 (좋은 대화)";
            case 4: return "설렜어요! (매력적임)";
            case 5: return "놓치기 싫어요! (완전 내 스타일)";
            default: return "이 사람과의 '설렘 농도'는?";
        }
    };

    // Theme Logic
    const isDark = themeMode === 'night';
    const isGlass = themeStyle === 'glass';

    const cardBgClass = isGlass
        ? isDark
            ? 'bg-slate-900/40 backdrop-blur-xl border border-white/10'
            : 'bg-white/40 backdrop-blur-xl border border-white/40'
        : isDark
            ? 'bg-slate-800 border border-slate-700'
            : 'bg-white border border-pink-50';

    const textColorClass = isDark ? 'text-white' : 'text-gray-800';
    const subTextColorClass = isDark ? 'text-gray-400' : 'text-gray-400';
    const tagBaseClass = isDark
        ? 'bg-slate-700 text-gray-300 border-slate-600 hover:bg-slate-600'
        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50';
    const tagSelectedClass = 'bg-pink-100 border-pink-200 text-pink-600 ring-1 ring-pink-400 font-bold shadow-sm';

    // Input Style
    const inputBgClass = isGlass
        ? isDark
            ? 'bg-black/20 border-white/10 text-white placeholder-white/40 focus:bg-black/30'
            : 'bg-white/50 border-white/40 text-gray-800 placeholder-gray-500 focus:bg-white/70'
        : isDark
            ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
            : 'bg-gray-50 border-gray-200 text-base';

    return (
        <div className={`${cardBgClass} rounded-3xl shadow-xl p-8 max-w-sm mx-auto transition-all duration-500`}>
            <h3 className={`text-xl font-bold text-center mb-2 ${textColorClass}`}>
                <span className="text-pink-500 text-2xl relative inline-block mr-1">
                    {partnerName}
                </span>
                님과의 시간, 어땠나요?
            </h3>
            <p className={`text-center text-xs mb-6 ${subTextColorClass}`}>작성한 내용은 최종 선택 시 다시 볼 수 있어요</p>

            {/* Vibe Score Display */}
            <div className="text-center h-6 mb-4">
                <p className={`text-sm font-bold transition-all duration-300 ${rating > 0 ? 'text-pink-500 scale-100' : 'text-gray-400 scale-95'}`}>
                    {getRatingLabel(rating)}
                </p>
            </div>

            {/* Heart Rating System */}
            <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((score) => (
                    <button
                        key={score}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => setRating(score)}
                        className={`focus:outline-none transition-all duration-300 relative group
                            ${isSubmitted ? 'cursor-default' : 'hover:scale-110 active:scale-90'}`}
                    >
                        <Heart
                            size={36}
                            className={`transition-all duration-300
                                ${rating >= score
                                    ? 'fill-rose-500 text-rose-500 drop-shadow-md'
                                    : isDark ? 'text-slate-600 fill-slate-800' : 'text-gray-200 fill-gray-50'
                                }
                                ${isSubmitted && rating < score ? 'opacity-20' : ''}
                            `}
                        />
                        {/* Pulse effect for selected high scores */}
                        {rating >= 4 && rating >= score && !isSubmitted && (
                            <span className="absolute inset-0 rounded-full bg-rose-400 opacity-20 animate-ping" />
                        )}
                    </button>
                ))}
            </div>

            {/* Keyword Tags */}
            <div className={`flex flex-wrap gap-2 mb-6 justify-center transition-opacity duration-500 ${isSubmitted ? 'opacity-50 pointer-events-none' : ''}`}>
                {FEEDBACK_KEYWORDS.map((keyword) => (
                    <button
                        key={keyword}
                        type="button"
                        onClick={() => !isSubmitted && toggleKeyword(keyword)}
                        className={`px-3 py-1.5 rounded-full text-xs transition-all border
                            ${selectedKeywords.includes(keyword) ? tagSelectedClass : tagBaseClass}
                        `}
                    >
                        {keyword}
                    </button>
                ))}
            </div>

            <textarea
                className={`w-full rounded-xl p-4 text-base focus:ring-0 focus:outline-none mb-6 resize-none transition-colors shadow-inner border-2
                    ${inputBgClass}
                    ${isSubmitted ? 'text-gray-400 cursor-not-allowed opacity-50' : 'focus:border-pink-500'}`}
                rows={3}
                placeholder={isSubmitted ? "설렘 기록이 저장되었습니다." : "그 분의 어떤 점이 심쿵 포인트였나요?"}
                value={note}
                disabled={isSubmitted}
                onChange={(e) => setNote(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitted}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2
                    ${isSubmitted
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-green-200 cursor-default transform scale-[0.98]'
                        : rating > 0
                            ? isGlass ? 'bg-pink-500/80 backdrop-blur-md text-white hover:bg-pink-500' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                            : 'bg-gray-100/10 text-gray-400 cursor-not-allowed'}`}
            >
                {isSubmitted ? (
                    <>
                        <CheckCircle size={24} />
                        설렘 기록 저장 완료!
                    </>
                ) : (
                    <>
                        <Heart size={20} className={rating > 0 ? "fill-white animate-bounce" : ""} />
                        나만의 기록 남기기
                    </>
                )}
            </button>
        </div>
    );
};
export default FeedbackForm;
