import React from 'react';
import { MessageTemplate, CATEGORIES, AVAILABLE_VARIABLES, SERVICE_TYPES } from '../../../data/messageTemplates';
import { Grid, Palette, Trash2 } from 'lucide-react';

interface MessagePropertiesPanelProps {
    template: MessageTemplate | null;
    onChange: (updates: Partial<MessageTemplate>) => void;
    onInsertVariable: (variable: string) => void;
    onDelete: () => void;
    serviceType: string;
}

const MessagePropertiesPanel: React.FC<MessagePropertiesPanelProps> = ({
    template,
    onChange,
    onInsertVariable,
    onDelete,
    serviceType
}) => {
    if (!template) {
        return (
            <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full items-center justify-center text-slate-400 text-xs">
                <span>템플릿을 선택해주세요</span>
            </div>
        );
    }

    // Filter variables based on service type
    const relevantVariables = AVAILABLE_VARIABLES.filter(v =>
        v.type === 'COMMON' || v.type === serviceType || serviceType === 'ALL'
    );

    return (
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-xl z-10">
            {/* Header */}
            <div className="h-12 border-b border-slate-100 flex items-center px-4 bg-slate-50/50">
                <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Grid size={14} className="text-indigo-600" />
                    속성 및 변수
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-thin">

                {/* 1. Settings Section */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Palette size={12} /> 카테고리 설정
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => onChange({ category: cat.id })}
                                className={`
                                    px-3 py-2 text-xs rounded-lg border text-left transition-all
                                    ${template.category === cat.id
                                        ? `border-${cat.color}-500 bg-${cat.color}-50 text-${cat.color}-700 font-bold ring-1 ring-${cat.color}-500`
                                        : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                    }
                                `}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* 2. Variables Section */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center">
                        <span>사용 가능 변수</span>
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{relevantVariables.length}</span>
                    </label>
                    <div className="flex flex-col gap-2">
                        {relevantVariables.map(v => (
                            <button
                                key={v.value}
                                onClick={() => onInsertVariable(v.value)}
                                className="group flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left"
                            >
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700">{v.label}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">{v.value}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    삽입
                                </span>
                            </button>
                        ))}
                    </div>
                    {relevantVariables.length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-4">사용 가능한 변수가 없습니다.</p>
                    )}
                </div>

                <div className="h-px bg-slate-100" />

                {/* 3. Danger Zone */}
                <div className="pt-4">
                    <button
                        onClick={onDelete}
                        className="w-full py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <Trash2 size={14} />
                        템플릿 삭제
                    </button>
                </div>

            </div>
        </div>
    );
};

export default MessagePropertiesPanel;
