import React from 'react';
import { Loader2 } from 'lucide-react';

interface WaitingScreenProps {
    gender?: 'M' | 'F' | string;
}

const WaitingScreen: React.FC<WaitingScreenProps> = ({ gender = 'F' }) => {
    // Theme logic
    const isMale = gender === 'M';
    const spinnerClass = isMale ? 'text-blue-500' : 'text-pink-500';
    const progressClass = isMale ? 'bg-blue-500' : 'bg-pink-500';
    const glowClass = isMale ? 'bg-blue-200' : 'bg-pink-200';

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in duration-700">
            <div className="relative mb-8">
                <div className={`absolute inset-0 ${glowClass} rounded-full blur-xl opacity-50 animate-pulse`}></div>
                <div className="relative bg-white p-4 rounded-full shadow-lg">
                    <Loader2 size={48} className={`${spinnerClass} animate-spin`} />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">최종 선택 완료!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
                다른 분들의 선택을 기다리고 있어요.<br />
                모두의 선택이 끝나면 결과가 공개됩니다.
            </p>

            <div className="w-full max-w-xs bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className={`h-full ${progressClass} rounded-full animate-progress-indeterminate`}></div>
            </div>
            <p className="text-xs text-gray-400 mt-4">잠시만 기다려주세요...</p>
        </div>
    );
};

export default WaitingScreen;
