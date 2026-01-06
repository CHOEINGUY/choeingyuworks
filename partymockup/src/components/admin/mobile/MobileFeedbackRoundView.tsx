import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, MessageSquare } from 'lucide-react'; // Changed Star to Heart

interface MobileFeedbackRoundViewProps {
    currentRound: number;
    feedbacks: any;
    users: any;
    rotations: any;
    isDark?: boolean;
}

const MobileFeedbackRoundView: React.FC<MobileFeedbackRoundViewProps> = ({
    currentRound: globalCurrentRound,
    feedbacks,
    users,
    rotations,
    isDark
}) => {
    // ... (state and logic unchanged)
    const [viewRound, setViewRound] = useState(globalCurrentRound || 1);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);

    const maxRounds = Object.keys(rotations).length;
    const currentPairs = rotations[viewRound] || {};
    const pairsList = Object.entries(currentPairs);
    const totalPairs = pairsList.length;

    useEffect(() => {
        setCurrentPairIndex(0);
    }, [viewRound]);

    const handlePrevRound = () => setViewRound(prev => Math.max(1, prev - 1));
    const handleNextRound = () => setViewRound(prev => Math.min(maxRounds, prev + 1));

    const handlePrevPair = () => setCurrentPairIndex(prev => Math.max(0, prev - 1));
    const handleNextPair = () => setCurrentPairIndex(prev => Math.min(totalPairs - 1, prev + 1));

    const getFeedbackData = (userId: string, partnerId: string | null) => {
        if (!userId || !partnerId) return { rating: 0, note: "매칭 없음", tags: [] };

        // Handle Map
        if (!Array.isArray(feedbacks)) {
            return feedbacks[userId] || { rating: 0, note: "아직 평가가 없습니다.", tags: [] };
        }

        // Handle Array (Standard)
        const fb = (feedbacks as any[]).find(f => f.fromUserId === userId && f.toUserId === partnerId);
        return fb ? fb : { rating: 0, note: "아직 평가가 없습니다.", tags: [] };
    };

    const activePair = pairsList[currentPairIndex];
    const maleId = activePair ? activePair[0] : null;
    const femaleId = activePair ? (activePair[1] as string) : null;

    const maleUser = maleId ? (users[maleId] || { name: 'Unknown', age: '?', job: '?' }) : null;
    const femaleUser = femaleId ? (users[femaleId] || { name: 'Unknown', age: '?', job: '?' }) : null;

    const maleFeedback = maleId ? getFeedbackData(maleId, femaleId) : null;
    const femaleFeedback = femaleId ? getFeedbackData(femaleId, maleId) : null;

    return (
        <div className={`flex flex-col h-full ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* Round Selector Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b sticky top-0 z-10 shrink-0 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                <button
                    onClick={handlePrevRound}
                    disabled={viewRound === 1}
                    className={`p-2 rounded-full disabled:opacity-30 transition-colors ${isDark ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center">
                    <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>ROUND {viewRound}</span>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{totalPairs}쌍 매칭</span>
                </div>

                <button
                    onClick={handleNextRound}
                    disabled={viewRound === maxRounds}
                    className={`p-2 rounded-full disabled:opacity-30 transition-colors ${isDark ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Carousel Content Area */}
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
                {totalPairs > 0 ? (
                    <div className="flex-1 flex flex-col h-full">
                        {/* The Card */}
                        <div className="flex-1 flex flex-col justify-center mb-4 min-h-0">
                            <FeedbackPairCard
                                key={`${viewRound}-${maleId}-${femaleId}`}
                                maleUser={maleUser}
                                femaleUser={femaleUser}
                                maleFeedback={maleFeedback}
                                femaleFeedback={femaleFeedback}
                                isDark={isDark}
                            />
                        </div>

                        {/* Pagination / Navigation Controls */}
                        <div className={`flex items-center justify-between p-3 rounded-full shadow-sm border shrink-0 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <button
                                onClick={handlePrevPair}
                                disabled={currentPairIndex === 0}
                                className={`p-2 rounded-full disabled:opacity-30 transition-colors ${isDark ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            <div className="flex flex-col items-center">
                                <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {currentPairIndex + 1} / {totalPairs}
                                </span>
                                <span className="text-[10px] text-gray-400">COUPLE</span>
                            </div>

                            <button
                                onClick={handleNextPair}
                                disabled={currentPairIndex === totalPairs - 1}
                                className={`p-2 rounded-full disabled:opacity-30 transition-colors ${isDark ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={`flex-1 flex items-center justify-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        이 라운드에는 매칭 데이터가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

interface FeedbackPairCardProps {
    maleUser: any;
    femaleUser: any;
    maleFeedback: any;
    femaleFeedback: any;
    isDark?: boolean;
}

const FeedbackPairCard: React.FC<FeedbackPairCardProps> = ({ maleUser, femaleUser, maleFeedback, femaleFeedback, isDark }) => {
    return (
        <div className={`rounded-2xl shadow-md border overflow-y-auto max-h-full ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            {/* Male Section (Top) */}
            <div className={`p-4 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50/20'}`}>
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">

                        <div>
                            <div className="flex items-center gap-1">
                                <span className={`font-bold ${isDark ? 'text-blue-100' : 'text-gray-900'}`}>{maleUser.name}</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>{maleUser.age}세</span>
                            </div>
                            <div className="text-xs text-blue-500 font-medium">{maleUser.job}</div>
                        </div>
                    </div>
                    <HeartRating rating={maleFeedback.rating} color="text-blue-500" />
                </div>

                <div className={`p-3 rounded-xl border text-sm relative ${isDark ? 'bg-slate-900/50 border-blue-900/30 text-gray-300' : 'bg-white border-blue-100 text-gray-600'}`}>
                    <div className="absolute top-3 left-3 opacity-20"><MessageSquare size={16} /></div>
                    <p className="pl-6 italic mb-2">"{maleFeedback.note}"</p>
                    {maleFeedback.tags && maleFeedback.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pl-6">
                            {maleFeedback.tags.map((tag: string) => (
                                <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded-full border ${isDark ? 'bg-blue-900/30 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Divider */}
            <div className={`h-px flex items-center justify-center relative my-0 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <span className={`px-2 text-[10px] font-bold uppercase tracking-widest border rounded-full py-0.5 ${isDark ? 'bg-slate-800 text-gray-500 border-slate-700' : 'bg-white text-gray-400 border-gray-200'}`}>
                    Mutual Feedback
                </span>
            </div>

            {/* Female Section (Bottom) */}
            <div className={`p-4 ${isDark ? 'bg-pink-900/20' : 'bg-pink-50/20'}`}>
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">

                        <div>
                            <div className="flex items-center gap-1">
                                <span className={`font-bold ${isDark ? 'text-pink-100' : 'text-gray-900'}`}>{femaleUser.name}</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>{femaleUser.age}세</span>
                            </div>
                            <div className="text-xs text-pink-500 font-medium">{femaleUser.job}</div>
                        </div>
                    </div>
                    <HeartRating rating={femaleFeedback.rating} color="text-pink-500" />
                </div>

                <div className={`p-3 rounded-xl border text-sm relative ${isDark ? 'bg-slate-900/50 border-pink-900/30 text-gray-300' : 'bg-white border-pink-100 text-gray-600'}`}>
                    <div className="absolute top-3 left-3 opacity-20"><MessageSquare size={16} /></div>
                    <p className="pl-6 italic mb-2">"{femaleFeedback.note}"</p>
                    {femaleFeedback.tags && femaleFeedback.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pl-6">
                            {femaleFeedback.tags.map((tag: string) => (
                                <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded-full border ${isDark ? 'bg-pink-900/30 text-pink-300 border-pink-800' : 'bg-pink-50 text-pink-600 border-pink-100'}`}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface HeartRatingProps {
    rating: number;
    color: string;
}

const HeartRating: React.FC<HeartRatingProps> = ({ rating, color }) => {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((idx) => (
                <Heart
                    key={idx}
                    size={14}
                    className={`${idx <= rating ? `${color} fill-current` : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
};

export default MobileFeedbackRoundView;
