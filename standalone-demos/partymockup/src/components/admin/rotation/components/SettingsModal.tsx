import React from 'react';
import { createPortal } from 'react-dom';
import { Settings } from 'lucide-react';
import { useSessionSettings } from '../../../../hooks/useSessionSettings';

interface SettingsModalProps {
    config: any;
    onSave: (config: any) => void;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ config, onSave, onClose }) => {
    // Custom Hook for Logic
    const { config: localConfig, handleChange, saveSettings } = useSessionSettings(config, onSave);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveSettings();
        onClose(); // Close after save
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200 m-4">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Settings className="text-pink-500" />
                        세션 설정
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">대화 시간 (초)</label>
                            <input
                                name="roundDuration"
                                type="number"
                                value={localConfig.roundDuration}
                                onChange={(e) => handleChange('roundDuration', e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">쉬는 시간 (초)</label>
                            <input
                                name="breakDuration"
                                type="number"
                                value={localConfig.breakDuration}
                                onChange={(e) => handleChange('breakDuration', e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">테마 설정 (Visual)</h4>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">분위기 (Mode)</label>
                            <div className="grid grid-cols-2 gap-2">
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="themeMode"
                                        value="day"
                                        checked={localConfig.themeMode === 'day'}
                                        onChange={() => handleChange('themeMode', 'day')}
                                        className="peer sr-only"
                                    />
                                    <div className="p-3 rounded-lg border-2 border-gray-200 text-center text-gray-600 peer-checked:border-yellow-400 peer-checked:bg-yellow-50 peer-checked:text-gray-900 transition-all font-medium hover:bg-gray-50">
                                        ☀️ Day
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="themeMode"
                                        value="night"
                                        checked={localConfig.themeMode === 'night'}
                                        onChange={() => handleChange('themeMode', 'night')}
                                        className="peer sr-only"
                                    />
                                    <div className="p-3 rounded-lg border-2 border-gray-200 text-center text-gray-600 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-900 transition-all font-medium hover:bg-gray-50">
                                        🌙 Night
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">스타일 Context</label>
                            <div className="grid grid-cols-2 gap-2">
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="themeStyle"
                                        value="standard"
                                        checked={localConfig.themeStyle === 'standard'}
                                        onChange={() => handleChange('themeStyle', 'standard')}
                                        className="peer sr-only"
                                    />
                                    <div className="p-3 rounded-lg border-2 border-gray-200 text-center text-gray-600 peer-checked:border-gray-400 peer-checked:bg-white peer-checked:text-gray-900 transition-all font-medium hover:bg-gray-50">
                                        Standard (기본)
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name="themeStyle"
                                        value="glass"
                                        checked={localConfig.themeStyle === 'glass'}
                                        onChange={() => handleChange('themeStyle', 'glass')}
                                        className="peer sr-only"
                                    />
                                    <div className="p-3 rounded-lg border-2 border-gray-200 text-center text-gray-600 peer-checked:border-pink-400 peer-checked:bg-pink-50 peer-checked:text-pink-900 transition-all font-medium hover:bg-gray-50">
                                        🔮 Glass (유리)
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:transfrom hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl">
                        설정 저장 및 적용
                    </button>

                </form>
            </div>
        </div>,
        document.body
    );
};

export default SettingsModal;
