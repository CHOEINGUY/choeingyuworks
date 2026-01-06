import React from 'react';
import { Save, RefreshCcw, LayoutTemplate } from 'lucide-react';

interface MessageBuilderHeaderProps {
    serviceType: string;
    setServiceType: (type: string) => void;
    onSave: () => void;
    onReset: () => void; // For resetting defaults
    isSaving: boolean;
}

const SERVICE_TABS = [
    { id: 'PARTY', label: '프라이빗 파티' },
    { id: 'ROTATION', label: '로테이션' },
    { id: 'PREMIUM', label: '1:1 프리미엄' },
    { id: 'COMMON', label: '공통' }
];

const MessageBuilderHeader: React.FC<MessageBuilderHeaderProps> = ({
    serviceType,
    setServiceType,
    onSave,
    onReset,
    isSaving
}) => {
    return (
        <div className="h-[72px] px-6 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm shrink-0 z-20">
            {/* Left: Title */}
            <div className="flex items-center gap-2">
                <LayoutTemplate className="text-indigo-600" size={20} />
                <span className="font-bold text-slate-900 text-lg">메세지 템플릿 관리</span>
                <div className="h-4 w-px bg-slate-300 mx-2"></div>
            </div>

            {/* Center: Service Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                {SERVICE_TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setServiceType(tab.id)}
                        className={`
                            px-4 py-1.5 text-xs font-bold rounded-md transition-all
                            ${serviceType === tab.id
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors font-bold text-sm"
                    title="기본 템플릿 복구"
                >
                    <div className="rotate-180">
                        <RefreshCcw size={18} />
                    </div>
                    <span>초기화</span>
                </button>
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-bold shadow-sm active:scale-95 text-sm disabled:opacity-50"
                >
                    <Save size={18} />
                    <span>{isSaving ? '저장 중...' : '저장'}</span>
                </button>
            </div>
        </div>
    );
};

export default MessageBuilderHeader;
