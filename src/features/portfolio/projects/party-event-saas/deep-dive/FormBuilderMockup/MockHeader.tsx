import React from 'react';
import {
    ChevronDown,
    List,
    Eye,
    RotateCcw,
    Save
} from "lucide-react";

interface MockHeaderProps {
    viewMode: 'editor' | 'preview';
    onViewModeChange: (mode: 'editor' | 'preview') => void;
}

export const MockHeader: React.FC<MockHeaderProps> = ({ viewMode, onViewModeChange }) => {
    return (
        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-20 shadow-sm relative">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm md:text-base">폼 빌더</span>
                    <div className="h-3 w-px bg-slate-300 mx-2"></div>
                    <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-800 font-bold text-sm md:text-base">
                        <span>로테이션 소개팅</span>
                        <ChevronDown size={14} className="text-slate-400" />
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg mr-2">
                    <button
                        onClick={() => onViewModeChange('editor')}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded flex items-center gap-1.5 transition-all ${
                            viewMode === 'editor'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500'
                        }`}
                    >
                        <List size={12} strokeWidth={2.5} />
                        에디터
                    </button>
                    <button
                        onClick={() => onViewModeChange('preview')}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded flex items-center gap-1.5 transition-all ${
                            viewMode === 'preview'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500'
                        }`}
                    >
                        <Eye size={12} strokeWidth={2.5} />
                        미리보기
                    </button>
                </div>
                <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-slate-500 hover:text-red-600 rounded-lg transition-colors font-bold text-xs" title="초기화">
                    <RotateCcw size={14} />
                    <span>초기화</span>
                </button>
                <button className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-bold shadow-sm text-xs">
                    <Save size={14} />
                    <span>저장</span>
                </button>
            </div>
        </div>
    );
};
