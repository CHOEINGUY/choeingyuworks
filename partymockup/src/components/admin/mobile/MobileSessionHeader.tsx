import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Settings, Clock, CheckCircle } from 'lucide-react';
import ConfirmationModal from '../../common/ConfirmationModal';

interface MobileSessionHeaderProps {
    selectedSessionId: string;
    onChangeSession: (sessionId: string) => void;
    status: string; // 'LIVE' | 'BREAK' | 'SELECTION' | 'WAITING' | 'ENDED'
    timeLeft: number;
    currentRound: number;
    isPaused: boolean;
    setIsPaused: (isPaused: boolean) => void;
    adjustTime: (seconds: number) => void;
    resetSession: () => void;
    startRound: (round: number) => void;
    startSelection: () => void;
    endSession: () => void;
    dynamicRotations: any; // Ideally Rotation[]
    onOpenSettings: () => void;
    isDark?: boolean;
    users?: any;
}

const MobileSessionHeader: React.FC<MobileSessionHeaderProps> = ({
    selectedSessionId,
    onChangeSession,
    status,
    timeLeft,
    currentRound,
    isPaused,
    setIsPaused,
    adjustTime,
    resetSession,
    startRound,
    startSelection,
    endSession,
    dynamicRotations, // Needed for logic check
    onOpenSettings,
    isDark,
    users
}) => {

    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleReset = () => {
        setShowResetConfirm(true);
    };

    // Unused function
    // const formatSessionDate = (dateStr: string) => {
    //     if (!dateStr) return '';
    //     return dateStr.replace(':00', '') + '시';
    // };

    return (
        <header className={`border-b p-4 sticky top-0 z-20 shadow-sm transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-600' : 'bg-white border-gray-300'}`}>
            {/* Middle Row: Timer & Main Controls */}
            <div className={`flex flex-col gap-3 p-3 rounded-2xl border mb-3 shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>



                {/* Timer & Time Controls Row */}
                <div className="flex items-center justify-between w-full">
                    {/* Time Controls (Left) - Explicit Request */}
                    <div className="flex items-center gap-1.5">
                        <button onClick={() => adjustTime(-60)} className={`px-3 py-2 rounded-xl border text-sm font-bold shadow-sm active:scale-95 transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}>-1분</button>
                        <button onClick={() => adjustTime(60)} className={`px-3 py-2 rounded-xl border text-sm font-bold shadow-sm active:scale-95 transition-all ${isDark ? 'bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}>+1분</button>
                    </div>

                    {/* Timer Display (Right/Center) */}
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                        <Clock size={16} className={isDark ? "text-pink-400" : "text-pink-500"} />
                        <span className={`font-mono text-xl font-bold tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                </div>

                {/* Session Process Controls Row (Separated from Timer Adjustment) */}
                <div className="flex items-center gap-2 w-full pt-2 border-t mt-1 border-dashed border-gray-200/20">

                    {/* Pause/Resume (Main Action) */}
                    {status !== 'ENDED' && status !== 'SELECTION' && (
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className={`flex-1 py-2.5 rounded-xl transition-all shadow-sm border flex items-center justify-center gap-2 font-bold text-sm ${isPaused
                                ? (isDark ? 'bg-blue-500 text-white border-blue-600' : 'bg-blue-500 text-white border-blue-600')
                                : (isDark ? 'bg-slate-700 border-slate-600 text-gray-300' : 'bg-white border-gray-200 text-gray-600')
                                }`}
                        >
                            {isPaused ? <><Play size={16} fill="currentColor" /> 재개</> : <><Pause size={16} fill="currentColor" /> 일시정지</>}
                        </button>
                    )}

                    {/* Spacer for safety if needed, or just gap */}

                    {/* Reset (Safety Color) */}
                    <button onClick={handleReset} className={`p-2.5 rounded-xl border shadow-sm transition-colors ${isDark
                        ? 'bg-slate-700 border-slate-600 text-gray-400 hover:text-red-400 hover:bg-slate-600'
                        : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                        aria-label="세션 초기화"
                    >
                        <RotateCcw size={18} />
                    </button>

                    {/* Settings */}
                    <button onClick={onOpenSettings} className={`p-2.5 rounded-xl border shadow-sm transition-colors ${isDark
                        ? 'bg-slate-700 border-slate-600 text-gray-400 hover:text-gray-200'
                        : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600'
                        }`}
                        aria-label="설정"
                    >
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            {/* Bottom Row: Dynamic Action Button (Full Width) */}
            <div className="flex items-center gap-2">
                {/* Status Badge */}
                <span className={`shrink-0 px-3 py-3 rounded-xl text-sm font-bold shadow-sm border flex items-center justify-center ${status === 'LIVE' ? 'bg-green-50 text-green-700 border-green-200' :
                    status === 'BREAK' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        status === 'SELECTION' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            status === 'WAITING' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-gray-50 text-gray-600 border-gray-200'
                    }`} style={{ minHeight: '46px' }}>
                    {status === 'LIVE' ? '진행 중' :
                        status === 'BREAK' ? '휴식' :
                            status === 'SELECTION' ? '선택' :
                                status === 'WAITING' ? '대기' : '종료'}
                </span>

                <div className="flex-1">
                    {status === 'WAITING' && (
                        <button
                            onClick={() => startRound(1)}
                            className="w-full py-3 bg-green-500 text-white rounded-xl font-bold shadow-md active:bg-green-600 flex items-center justify-center gap-2 text-sm animate-pulse"
                        >
                            <Play size={16} fill="currentColor" /> 1 라운드 시작
                        </button>
                    )}

                    {status === 'LIVE' && (
                        <button className={`w-full py-3 rounded-xl font-bold border text-sm cursor-not-allowed ${isDark ? 'bg-slate-800 text-gray-500 border-slate-700' : 'bg-gray-100 text-gray-400 border-gray-200'
                            }`} disabled>
                            {currentRound} 라운드 진행 중...
                        </button>
                    )}

                    {status === 'BREAK' && (
                        <>
                            {dynamicRotations[currentRound + 1] ? (
                                <button
                                    onClick={() => startRound(currentRound + 1)}
                                    className="w-full py-3 bg-green-500 text-white rounded-xl font-bold shadow-md active:bg-green-600 flex items-center justify-center gap-2 text-sm"
                                >
                                    <Play size={16} fill="currentColor" /> {currentRound + 1} 라운드 시작
                                </button>
                            ) : (
                                <button
                                    onClick={startSelection}
                                    className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold shadow-md active:bg-purple-600 flex items-center justify-center gap-2 text-sm"
                                >
                                    <CheckCircle size={16} /> 최종 선택 시작
                                </button>
                            )}
                        </>
                    )}

                    {status === 'SELECTION' && (
                        <button
                            onClick={endSession}
                            className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold shadow-md active:bg-gray-900 text-sm"
                        >
                            세션 종료
                        </button>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={showResetConfirm}
                onClose={() => setShowResetConfirm(false)}
                onConfirm={resetSession}
                title="세션 초기화"
                message="현재 진행 중인 세션의 모든 상태가 초기화됩니다.&#13;&#10;이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?"
                confirmText="초기화"
                cancelText="취소"
                isDistructive={true}
            />
        </header>
    );
};

export default MobileSessionHeader;
