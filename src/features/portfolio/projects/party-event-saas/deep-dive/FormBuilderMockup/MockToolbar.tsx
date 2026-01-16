import React from 'react';
import {
    Type,
    Calendar,
    CheckSquare,
    Phone,
    List,
    FileVideo,
    Users,
    Check,
    Briefcase,
    MapPin
} from "lucide-react";

export const MockToolbar: React.FC = () => {
    return (
        <div className="w-[280px] bg-white border-l border-slate-200 flex flex-col z-20 hidden lg:flex">

            {/* Sticky Header */}
            <div className="p-4 border-b border-slate-100 bg-white sticky top-0">
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    아래 목록에서 원하는 항목을 클릭하면<br />
                    왼쪽 화면에 바로 추가됩니다.
                </p>
            </div>

            <div className="p-4 space-y-6 overflow-y-auto scrollbar-thin">

                {/* 1. Mandatory (System) - Red Theme */}
                <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">기본 정보 (시스템)</div>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { icon: <Users size={14} />, label: '이름/성함' },
                            { icon: <Phone size={14} />, label: '연락처' },
                            { icon: <Users size={14} />, label: '성별' },
                            { icon: <Calendar size={14} />, label: '생년월일' }
                        ].map((item, i) => (
                            <div key={i} className="relative flex items-center gap-2 p-2 rounded-lg border bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed text-left group">
                                <div className="text-slate-400 shrink-0">{item.icon}</div>
                                <span className="text-[11px] font-bold text-slate-500 truncate">{item.label}</span>
                                <div className="absolute top-1/2 right-2 -translate-y-1/2">
                                    <Check size={14} className="text-slate-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Core - Indigo Theme */}
                <div>
                    <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-2 px-1 flex items-center gap-1">
                        필수 추천 (Core)
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="relative flex items-center gap-2 p-2.5 rounded-lg border bg-white border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md transition-all text-slate-600 cursor-pointer group">
                            <div className="text-slate-400 group-hover:text-indigo-600"><Briefcase size={16} /></div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-medium">직업 / 하는 일</span>
                            </div>
                        </div>
                        <div className="relative flex items-center gap-2 p-2.5 rounded-lg border bg-white border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md transition-all text-slate-600 cursor-pointer group">
                            <div className="text-slate-400 group-hover:text-indigo-600"><MapPin size={16} /></div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] font-medium">거주 지역 (시/구)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Basic Tools */}
                <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">기본 도구 (커스텀)</div>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { icon: <Type size={16} />, label: '단답형' },
                            { icon: <List size={16} />, label: '객관식' },
                            { icon: <CheckSquare size={16} />, label: '체크박스' },
                            { icon: <FileVideo size={16} />, label: '설명글' }
                        ].map((item, i) => (
                            <div key={i} className="col-span-1 flex items-center gap-2 p-2.5 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all cursor-pointer group">
                                <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">{item.icon}</div>
                                <span className="text-[11px] font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
