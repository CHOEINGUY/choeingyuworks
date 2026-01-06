import React from 'react';
import { X, Moon, Sun, Clock, Coffee } from 'lucide-react';
import { useSessionSettings } from '../../../hooks/useSessionSettings';
import { Session } from '../../../types';

interface MobileSettingsModalProps {
    session: Session;
    sessionId: string;
    onClose: () => void;
    onUpdateConfig: (sessionId: string, key: string, value: any) => void;
}

const MobileSettingsModal: React.FC<MobileSettingsModalProps> = ({ session, sessionId, onClose, onUpdateConfig }) => {
    if (!session) return null;

    const isDark = session.config?.themeMode === 'night';

    // Use the unifying hook. 
    // We pass onUpdateConfig as the onUpdate callback for the hook.
    // Note: The hook expects onUpdate(newConfig).
    // The prop onUpdateConfig signature is (sessionId, key, value) OR it might depend on implementation.
    // Let's check `AdminDashboard.jsx`'s `handleMobileUpdateConfig`:
    // It calls `sessionProps.updateConfig({ [key]: value });`
    // So we need an adapter if we use the hook's `onUpdate(fullConfig)`.

    // Adapter for hook's onUpdate
    const handleSaveAdapter = (newConfig: any) => {
        // We can loop updates or pass full object if backend supports it.
        // sessionSettings hook returns full config object.
        // Let's assume onUpdateConfig can handle multiple updates or we iterate.
        // Actually `MobileSettingsModal` prop `onUpdateConfig` signature from `MobileSessionDashboard` is:
        // (sessionId, key, value) => ...
        // We should change `MobileSessionDashboard` or adapte here.
        // Let's adapt here.
        Object.entries(newConfig).forEach(([key, value]) => {
            if (session.config?.[key] !== value) {
                onUpdateConfig(sessionId, key, value);
            }
        });
    };

    const { config: localConfig, handleChange, handleTimeChange, saveSettings } = useSessionSettings(
        session.config || {},
        handleSaveAdapter
    );

    const handleThemeToggle = (mode: string) => {
        handleChange('themeMode', mode);
    };

    const onConfirm = () => {
        saveSettings();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Card */}
            <div className={`relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden transition-all transform animate-in fade-in zoom-in duration-200 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>

                {/* Header */}
                <div className={`px-5 py-4 flex items-center justify-between border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        세션 설정
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-6">
                    {/* Theme Section */}
                    <div>
                        <label className={`block text-xs font-bold mb-3 uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            테마 설정
                        </label>
                        <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                            <button
                                onClick={() => handleThemeToggle('day')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${!isDark
                                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                <Sun size={16} />
                                Day Mode
                            </button>
                            <button
                                onClick={() => handleThemeToggle('night')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${isDark
                                    ? 'bg-slate-700 text-blue-400 shadow-sm ring-1 ring-white/10'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <Moon size={16} />
                                Night Mode
                            </button>
                        </div>
                    </div>

                    {/* Style Context Section (New) */}
                    <div>
                        <label className={`block text-xs font-bold mb-3 uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            스타일 설정
                        </label>
                        <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                            <button
                                onClick={() => handleChange('themeStyle', 'standard')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${localConfig.themeStyle !== 'glass'
                                    ? (isDark ? 'bg-slate-700 text-white shadow-sm ring-1 ring-white/10' : 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5')
                                    : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600')
                                    }`}
                            >
                                Standard
                            </button>
                            <button
                                onClick={() => handleChange('themeStyle', 'glass')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${localConfig.themeStyle === 'glass'
                                    ? (isDark ? 'bg-pink-900/40 text-pink-300 shadow-sm ring-1 ring-pink-500/50' : 'bg-pink-50 text-pink-600 shadow-sm ring-1 ring-pink-200')
                                    : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600')
                                    }`}
                            >
                                🔮 Glass
                            </button>
                        </div>
                    </div>

                    {/* Time Settings Section */}
                    <div>
                        <label className={`block text-xs font-bold mb-3 uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            시간 설정 (초 단위)
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Round Duration */}
                            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center gap-2 mb-2 text-xs font-medium text-gray-400">
                                    <Clock size={14} /> 라운드 시간
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={localConfig.roundDuration}
                                        onChange={(e) => handleTimeChange('round', e.target.value)}
                                        className={`w-full bg-transparent text-xl font-bold outline-none ${isDark ? 'text-white' : 'text-gray-900'}`}
                                    />
                                    <span className="text-sm text-gray-400 font-medium">초</span>
                                </div>
                            </div>

                            {/* Break Duration */}
                            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center gap-2 mb-2 text-xs font-medium text-gray-400">
                                    <Coffee size={14} /> 휴식 시간
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={localConfig.breakDuration}
                                        onChange={(e) => handleTimeChange('break', e.target.value)}
                                        className={`w-full bg-transparent text-xl font-bold outline-none ${isDark ? 'text-white' : 'text-gray-900'}`}
                                    />
                                    <span className="text-sm text-gray-400 font-medium">초</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        * 이 설정은 현재 세션({session.date})에만 적용됩니다.
                    </p>
                </div>

                {/* Footer */}
                <div className={`px-5 py-4 border-t flex justify-end ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-gray-100 bg-gray-50'}`}>
                    <button
                        onClick={onConfirm}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${isDark
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30'
                            : 'bg-black hover:bg-gray-800 text-white shadow-lg shadow-gray-200'
                            }`}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileSettingsModal;
