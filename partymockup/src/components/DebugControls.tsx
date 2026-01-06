import React, { Dispatch, SetStateAction } from 'react';
import { Settings, Play, Pause, FastForward, CheckSquare, AlertTriangle } from 'lucide-react';

interface DebugControlsProps {
    status: string;
    setStatus: (status: string) => void;
    currentRound: number;
    setCurrentRound: (round: number) => void;
    setTimeLeft: (time: number) => void;
    isPaused: boolean;
    setIsPaused: (paused: boolean) => void;
    setIsSelectionDone: Dispatch<SetStateAction<boolean>>;
    totalRounds?: number;
}

const DebugControls: React.FC<DebugControlsProps> = ({ status, setStatus, currentRound, setCurrentRound, setTimeLeft, isPaused, setIsPaused, setIsSelectionDone, totalRounds = 5 }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [explode, setExplode] = React.useState(false);

    if (explode) {
        throw new Error("Test Error triggered from DebugControls");
    }

    // Use Vite specific env check
    if (import.meta.env.PROD) return null;

    return (
        <div className="fixed bottom-4 left-4 z-[100]">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors opacity-70 hover:opacity-100 flex items-center gap-2 border border-gray-700"
            >
                <Settings size={24} />
                {isPaused && <Pause size={12} className="text-yellow-400 animate-pulse absolute top-0 right-0" />}
            </button>

            {isExpanded && (
                <div className="absolute bottom-16 left-0 bg-white p-4 rounded-xl shadow-2xl border border-gray-200 w-72 animate-in fade-in slide-in-from-bottom-2 max-h-[80vh] overflow-y-auto">
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Developer Controls</h3>

                    <div className="space-y-4">
                        {/* Status Jump */}
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Status Jump</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => setStatus('LIVE')} className={`text-xs p-1.5 rounded border ${status === 'LIVE' ? 'bg-pink-100 border-pink-500 text-pink-700' : 'hover:bg-gray-50'}`}>LIVE</button>
                                <button onClick={() => setStatus('BREAK')} className={`text-xs p-1.5 rounded border ${status === 'BREAK' ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'hover:bg-gray-50'}`}>BREAK</button>
                                <button onClick={() => setStatus('SELECTION')} className={`text-xs p-1.5 rounded border ${status === 'SELECTION' ? 'bg-purple-100 border-purple-500 text-purple-700' : 'hover:bg-gray-50'}`}>SELECTION</button>
                                <button onClick={() => setStatus('ENDED')} className={`text-xs p-1.5 rounded border ${status === 'ENDED' ? 'bg-gray-100 border-gray-500 text-gray-700' : 'hover:bg-gray-50'}`}>ENDED</button>
                            </div>
                        </div>

                        {/* Round Control */}
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Round Control ({currentRound})</label>
                            <input
                                type="range"
                                min="1"
                                max={totalRounds}
                                value={currentRound}
                                onChange={(e) => setCurrentRound(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Play/Pause Control */}
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Timer Control</label>
                            <button
                                onClick={() => setIsPaused(!isPaused)}
                                className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2
                                    ${isPaused
                                        ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'}`}
                            >
                                {isPaused ? <Play size={14} /> : <Pause size={14} />}
                                {isPaused ? "RESUME TIMER" : "PAUSE TIMER"}
                            </button>
                        </div>

                        {/* Force Actions */}
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-1">Actions</label>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setTimeLeft(2)}
                                    className="w-full py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                                >
                                    <FastForward size={12} />
                                    Skip to End of Timer (2s)
                                </button>

                                {/* Error Boundary Test Trigger - Always Visible */}
                                <button
                                    onClick={() => {
                                        setExplode(true);
                                    }}
                                    className="w-full py-1.5 bg-red-900 text-white rounded-lg text-xs font-bold border border-red-700 hover:bg-red-800 transition-all flex items-center justify-center gap-2"
                                >
                                    <AlertTriangle size={12} />
                                    Test Crash
                                </button>

                                {status === 'SELECTION' && (
                                    <>
                                        <button
                                            onClick={() => setIsSelectionDone((prev) => !prev)}
                                            className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold border border-indigo-200 hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckSquare size={14} />
                                            Toggle My Submit (Waiting)
                                        </button>

                                        <button
                                            onClick={() => setStatus('ENDED')}
                                            className="w-full py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckSquare size={14} />
                                            Force Complete Selection
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DebugControls;
