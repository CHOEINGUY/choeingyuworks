
import React, { useState } from 'react';
import { Eye, List, RotateCcw, Save, ChevronDown, Check } from 'lucide-react';
import { FormMode } from '../../../types/form';
import { FORM_MODES } from '../../../constants/form';

interface FormAdminHeaderProps {
    currentFormId: FormMode;
    onModeChange: (mode: FormMode) => void;
    activeTab: 'builder' | 'theme' | 'preview' | 'json';
    onTabChange: (tab: 'builder' | 'theme' | 'preview' | 'json') => void;
    onReset: () => void;
    onSave: () => void;
    saving: boolean;
}

const formModes = [
    { id: FORM_MODES.ROTATION, label: '로테이션 소개팅', description: '기본 신청서 (users)' },
    { id: FORM_MODES.PARTY, label: '프라이빗 파티', description: '파티 참가 신청서 (users)' },
    { id: FORM_MODES.MATCH, label: '1:1 매칭', description: '프리미엄 매칭 신청서 (premium_pool)' }
];

const FormAdminHeader: React.FC<FormAdminHeaderProps> = ({
    currentFormId,
    onModeChange,
    activeTab,
    onTabChange,
    onReset,
    onSave,
    saving
}) => {
    const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);

    return (
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-20 shadow-sm">
            <div className="flex items-center gap-6">
                {/* Logo / Title */}
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-lg">폼 빌더</span>

                    <div className="h-4 w-px bg-slate-300 mx-2"></div>
                    <div className="relative">
                        <button
                            onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-800 font-bold text-lg group"
                        >
                            <span>{formModes.find(m => m.id === currentFormId)?.label}</span>
                            <ChevronDown size={18} className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isModeDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isModeDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsModeDropdownOpen(false)} />
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                    {formModes.map((mode, index) => (
                                        <React.Fragment key={mode.id}>
                                            <button
                                                onClick={() => {
                                                    onModeChange(mode.id);
                                                    setIsModeDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${currentFormId === mode.id
                                                    ? 'bg-indigo-50/50 text-indigo-600'
                                                    : 'text-slate-700 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <span className={`font-bold ${currentFormId === mode.id ? 'text-indigo-600' : 'text-slate-700'}`}>{mode.label}</span>
                                                    <span className="text-xs text-slate-400 font-normal">{mode.description}</span>
                                                </div>
                                                {currentFormId === mode.id && <Check size={16} />}
                                            </button>
                                            {index < formModes.length - 1 && <div className="h-px bg-slate-100 mx-2" />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
                <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg mr-2">
                    <button
                        onClick={() => onTabChange('builder')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'builder'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                    >
                        <List size={14} />
                        에디터
                    </button>
                    <button
                        onClick={() => onTabChange('preview')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'preview'
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                    >
                        <Eye size={14} />
                        미리보기
                    </button>
                </nav>

                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-bold text-sm"
                    title="초기화"
                >
                    <RotateCcw size={16} />
                    <span>초기화</span>
                </button>
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-bold shadow-sm active:scale-95 text-sm disabled:opacity-50"
                >
                    <Save size={16} />
                    <span>{saving ? '저장 중...' : '저장'}</span>
                </button>
            </div>
        </header>
    );
};

export default FormAdminHeader;
