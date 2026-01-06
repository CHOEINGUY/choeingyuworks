import React, { useState } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Settings } from 'lucide-react';
import SettingsModal from './SettingsModal';
import ConfirmationModal from '../../../common/ConfirmationModal';

interface AdminSessionHeaderProps {
    selectedSessionId: string;
    onChangeSession: (id: string) => void;
    status: string;
    timeLeft: number;
    currentRound: number;
    dynamicRotations: any; // Ideally strictly typed
    isPaused: boolean;
    setIsPaused: (val: boolean) => void;
    adjustTime: (seconds: number) => void;
    resetSession: () => void;
    startRound: (round: number) => void;
    startSelection: () => void;
    endSession: () => void;
    showSettings: boolean;
    setShowSettings: (val: boolean) => void;
    config: any; // Ideally strictly typed
    updateConfig: (newConfig: any) => void;
    isDark?: boolean;
    isGlass?: boolean;
    headerBgClass?: string;
    titleTextClass?: string;
    sessions?: any; // New prop - can be Record or array
    users?: any[]; // Allow users to be passed if needed
}

const AdminSessionHeader: React.FC<AdminSessionHeaderProps> = ({
    selectedSessionId,
    // onChangeSession,
    status,
    timeLeft,
    currentRound,
    dynamicRotations,
    isPaused,
    setIsPaused,
    adjustTime,
    resetSession,
    startRound,
    startSelection,
    endSession,
    showSettings,
    setShowSettings,
    config,
    updateConfig,
    isDark,
    headerBgClass,
    titleTextClass
}) => {

    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleReset = () => {
        setShowResetConfirm(true);
    };

    return (
        <header className={`${headerBgClass} h-[72px] px-6 rounded-xl flex items-center justify-between mb-4 shrink-0 transition-colors duration-300`}>
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className={`text-2xl font-bold ${titleTextClass}`}>세션 대시보드</h1>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${status === 'LIVE' ? 'bg-green-100 text-green-700' :
                        status === 'BREAK' ? 'bg-yellow-100 text-yellow-700' :
                            status === 'SELECTION' ? 'bg-purple-100 text-purple-700' :
                                status === 'WAITING' ? 'bg-blue-100 text-blue-700' :
                                    'bg-gray-200 text-gray-700'
                        }`}>
                        {status === 'LIVE' ? '진행 중' :
                            status === 'BREAK' ? '휴식 시간' :
                                status === 'SELECTION' ? '최종 선택' :
                                    status === 'WAITING' ? '대기 중' : '종료됨'}
                    </span>

                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${isDark ? 'bg-slate-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                        <ClockIcon />
                        <span className={`font-mono text-xl font-bold min-w-[60px] text-center ${isDark ? 'text-white' : 'text-gray-700'}`}>
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </span>
                        <div className={`flex gap-1 ml-2 border-l pl-2 ${isDark ? 'border-slate-600' : 'border-gray-300'}`}>
                            <button onClick={() => adjustTime(60)} className={`p-1 rounded text-xs font-bold px-2 ${isDark ? 'hover:bg-slate-600' : 'hover:bg-white'}`} title="+1 Min">+1m</button>
                            <button onClick={() => adjustTime(-60)} className={`p-1 rounded text-xs font-bold px-2 ${isDark ? 'hover:bg-slate-600' : 'hover:bg-white'}`} title="-1 Min">-1m</button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">


                    <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-lg transition-colors ${showSettings ? (isDark ? 'bg-slate-600 text-white' : 'bg-gray-200 text-gray-800') : (isDark ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}`} title="Settings">
                        <Settings size={20} />
                    </button>

                    {/* Only show Pause/Resume in active states */}
                    {status !== 'ENDED' && status !== 'SELECTION' && (
                        <button onClick={() => setIsPaused(!isPaused)} className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'}`} title={isPaused ? "Resume" : "Pause"}>
                            {isPaused ? <Play size={20} className="text-green-600" /> : <Pause size={20} className="text-blue-600" />}
                        </button>
                    )}

                    <button onClick={handleReset} className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'}`} title="Reset Session">
                        <RotateCcw size={20} className="text-red-500" />
                    </button>



                    {/* Guided Flow Controls */}
                    {status === 'WAITING' && (
                        <button
                            onClick={() => startRound(1)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md transition-all flex items-center gap-2 animate-pulse"
                        >
                            <Play size={16} fill="currentColor" /> 1 라운드 시작
                        </button>
                    )}

                    {status === 'LIVE' && (
                        <button className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-bold cursor-not-allowed" disabled>
                            {currentRound} 라운드 진행 중...
                        </button>
                    )}

                    {status === 'BREAK' && (
                        <>
                            {dynamicRotations[currentRound + 1] ? (
                                <button
                                    onClick={() => startRound(currentRound + 1)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md transition-all flex items-center gap-2"
                                >
                                    <Play size={16} fill="currentColor" /> {currentRound + 1} 라운드 시작
                                </button>
                            ) : (
                                <button
                                    onClick={startSelection}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 shadow-md transition-all flex items-center gap-2"
                                >
                                    <CheckCircle size={16} /> 최종 선택 시작
                                </button>
                            )}
                        </>
                    )}

                    {status === 'SELECTION' && (
                        <button
                            onClick={endSession}
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 transition-all"
                        >
                            세션 종료
                        </button>
                    )}

                    {status === 'ENDED' && (
                        <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-bold">
                            세션 종료됨
                        </span>
                    )}
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <SettingsModal
                    key={selectedSessionId} // Force reset when session changes
                    config={config}
                    onSave={(newConfig) => {
                        updateConfig(newConfig);
                        setShowSettings(false);
                    }}
                    onClose={() => setShowSettings(false)}
                />
            )}

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

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

export default AdminSessionHeader;
