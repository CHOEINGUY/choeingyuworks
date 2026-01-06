import React from 'react';
import { Play, CheckCircle } from 'lucide-react';

interface SessionMainActionButtonProps {
    status: string;
    currentRound: number;
    dynamicRotations: any; // RotationMap
    startRound: (round: number) => void;
    startSelection: () => void;
    endSession: () => void;
    className?: string;
}

export const SessionMainActionButton: React.FC<SessionMainActionButtonProps> = ({
    status,
    currentRound,
    dynamicRotations,
    startRound,
    startSelection,
    endSession,
    // Optional styles override
    className = ""
}) => {

    // WAITING -> 1 Round Start
    if (status === 'WAITING') {
        return (
            <button
                onClick={() => startRound(1)}
                className={`px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md transition-all flex items-center justify-center gap-2 animate-pulse ${className}`}
            >
                <Play size={16} fill="currentColor" /> 1 라운드 시작
            </button>
        );
    }

    // LIVE -> Disabled
    if (status === 'LIVE') {
        return (
            <button
                className={`px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-bold cursor-not-allowed border border-gray-200 flex items-center justify-center ${className}`}
                disabled
            >
                {currentRound} 라운드 진행 중...
            </button>
        );
    }

    // BREAK -> Next Round OR Selection
    if (status === 'BREAK') {
        const nextRound = currentRound + 1;
        const hasNextRound = dynamicRotations && dynamicRotations[nextRound];

        if (hasNextRound) {
            return (
                <button
                    onClick={() => startRound(nextRound)}
                    className={`px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md transition-all flex items-center justify-center gap-2 ${className}`}
                >
                    <Play size={16} fill="currentColor" /> {nextRound} 라운드 시작
                </button>
            );
        } else {
            return (
                <button
                    onClick={startSelection}
                    className={`px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 shadow-md transition-all flex items-center justify-center gap-2 ${className}`}
                >
                    <CheckCircle size={16} /> 최종 선택 시작
                </button>
            );
        }
    }

    // SELECTION -> End Session
    if (status === 'SELECTION') {
        return (
            <button
                onClick={endSession}
                className={`px-4 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 transition-all flex items-center justify-center ${className}`}
            >
                세션 종료
            </button>
        );
    }

    // ENDED
    if (status === 'ENDED') {
        return (
            <span className={`px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-bold text-center border border-gray-200 ${className}`}>
                세션 종료됨
            </span>
        );
    }

    return null;
};
