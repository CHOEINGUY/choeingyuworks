import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface SessionLoadingProps {
    dataLoading?: boolean;
}

const SessionLoading: React.FC<SessionLoadingProps> = ({ dataLoading }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-50 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse [animation-delay:1s]"></div>

            <div className="relative text-center z-10 px-6">
                <div className="mb-8 relative inline-block">
                    <div className="absolute inset-0 bg-pink-400 blur-xl opacity-20 animate-pulse rounded-full"></div>
                    <Heart
                        size={64}
                        className="text-pink-500 animate-bounce relative z-10 drop-shadow-lg"
                        fill="#ec4899"
                    />
                    <Sparkles
                        size={24}
                        className="absolute -top-2 -right-2 text-yellow-400 animate-spin-slow"
                    />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-3 animate-slide-up tracking-tight">
                    설레는 만남을 준비 중입니다
                </h2>

                <div className="space-y-1">
                    <p className="text-gray-500 font-medium animate-pulse">
                        {dataLoading ? "데이터를 불러오고 있어요..." : "세션에 연결하고 있습니다..."}
                    </p>
                    <p className="text-xs text-pink-400 font-medium">
                        잠시만 기다려주세요
                    </p>
                </div>

                <div className="mt-8 flex gap-2 justify-center">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );
};

export default SessionLoading;
