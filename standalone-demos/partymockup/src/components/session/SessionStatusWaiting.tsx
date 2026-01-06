import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Users } from 'lucide-react';

interface SessionStatusWaitingProps {
    userName?: string;
    themeMode?: string;
    userId?: string;
}

const SessionStatusWaiting: React.FC<SessionStatusWaitingProps> = ({ userName, themeMode, userId }) => {
    const navigate = useNavigate();
    const [isRevealing, setIsRevealing] = useState(false);

    const handleNavigateToPartners = () => {
        setIsRevealing(true);
        // "Mist" effect duration (1000ms fade/blur) + slight buffer
        setTimeout(() => {
            navigate(`/partners?key=${userId}`);
        }, 800);
    };

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 -mt-16 overflow-hidden">

            {/* Mist Overlay (Initially hidden) */}
            <div
                className={`fixed inset-0 z-50 pointer-events-none transition-all duration-1000 ease-in-out
                ${isRevealing ? 'backdrop-blur-[20px] bg-white/60 opacity-100' : 'backdrop-blur-none bg-transparent opacity-0'}`}
            />

            {/* Content Container (Scales down slightly and blurs out as mist comes in) */}
            <div className={`w-full flex flex-col items-center transition-all duration-1000 ease-in-out
                ${isRevealing ? 'scale-95 opacity-0 blur-md' : 'animate-in fade-in zoom-in duration-700'}`}
            >
                <div className="relative mb-8">
                    <div className={`absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse ${themeMode === 'night' ? 'bg-pink-900' : 'bg-pink-300'}`}></div>
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg relative border transition-colors ${themeMode === 'night' ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-pink-100 to-white border-pink-50'}`}>
                        <Heart size={40} className="text-pink-500 animate-bounce" fill="#ec4899" />
                        <Sparkles size={20} className="absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
                    </div>
                </div>

                <h2 className={`text-2xl font-bold mb-3 tracking-tight ${themeMode === 'night' ? 'text-white' : 'text-gray-800'}`}>
                    {userName ? `${userName}님, 환영합니다!` : '환영합니다!'}
                    <br />
                    <span className="text-xl font-medium opacity-90">설레는 만남이 곧 시작됩니다</span>
                </h2>
                <p className={`leading-relaxed font-medium ${themeMode === 'night' ? 'text-gray-300' : 'text-gray-500'}`}>
                    모든 참가자가 준비되면<br />
                    <span className="text-pink-600 font-bold">매니저</span>가 데이트를 시작할 예정입니다.
                </p>

                <div className="mt-8 flex gap-2 justify-center mb-8">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                </div>

                {/* View Partners Button */}
                {userId && (
                    <button
                        onClick={handleNavigateToPartners}
                        className={`
                            relative group overflow-hidden px-10 py-5 rounded-3xl shadow-xl transition-all active:scale-95 hover:scale-105 duration-300
                            ${themeMode === 'night'
                                ? 'bg-slate-800/90 text-blue-200 border border-slate-600 hover:bg-slate-700'
                                : 'bg-white/90 text-blue-600 border border-blue-200 hover:bg-blue-50'}
                        `}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        <div className="flex items-center gap-3 relative z-10">
                            <Users size={24} className="group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-lg">상대방 미리보기</span>
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
};

export default SessionStatusWaiting;
