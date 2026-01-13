"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { 
    Layers, 
    MousePointerClick, 
    Filter, 
    CheckCircle2, 
    Zap,
    Lock,
    ArrowRight,
    Undo2,
    Redo2,
    Clock,
    FileDown,
    FileText,
    Copy,
    RefreshCw,
    Trash2,
    Upload
} from "lucide-react";

export function VirtualScrollDemo() {
    const t = useTranslations("EasyEpidemiology.VirtualScroll");
    const containerRef = useRef<HTMLDivElement>(null);
    
    // "Shell" implementation - Just enough rows to look like a grid
    const mockRows = Array.from({ length: 20 }).map((_, i) => ({
        index: i,
        isPatient: i < 15 || (i > 50 && i < 65),
        isConfirmed: (i < 15 || (i > 50 && i < 65)) && i % 2 === 0,
        hasDiarrhea: (i < 15 || (i > 50 && i < 65)) && i % 2 === 0,
        hasVomit: (i < 15 || (i > 50 && i < 65)) && i % 3 === 0,
        hasFever: (i < 15 || (i > 50 && i < 65)) && i % 4 === 0,
        grade: (i % 6) + 1,
        classNum: (i % 5) + 1,
        
        // Diet Data
        ateRice: true,
        ateSoup: i % 10 !== 0,
        atePork: i % 3 === 0,
        ateKimchi: i % 2 === 0,
        ateRadish: i % 3 !== 0,
        ateBeanSprout: i % 4 === 0,
        ateSpinach: i % 5 === 0,
        ateMilk: i % 2 !== 0,
        ateYogurt: i % 5 === 0,

        // Date
        onsetDate: `2023-09-${10 + (i % 5)} 10:00`
    }));

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                
                <div className="text-center mb-16">
                    <span className="text-emerald-600 font-bold tracking-wider text-sm uppercase mb-3 block">
                        Core Technology
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 whitespace-pre-line">
                        {t('title')}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto break-keep">
                        {t('description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    
                    {/* Left: Authentic Virtual Grid Demo */}
                    <div className="relative aspect-[16/12] w-full max-w-full mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50/50 to-slate-100/80 border border-emerald-100/50 shadow-2xl shadow-emerald-100/20">
                        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent)]" />
                        
                        <div className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center p-2 md:p-4">
                            {/* Browser Window Shell */}
                            <div 
                                className="w-full h-full bg-white rounded-[8px] md:rounded-[10px] shadow-2xl border border-gray-300 overflow-hidden relative flex flex-col ring-1 ring-slate-900/5"
                                style={{ maskImage: 'linear-gradient(white, white)', WebkitMaskImage: 'linear-gradient(white, white)' }}
                            >
                                 {/* 0. Browser Address Bar */}
                                <div className="h-[32px] bg-[#f9f9fb] flex items-center px-3 gap-2 border-b border-gray-200 shrink-0 relative z-30">
                                    <div className="flex-1 h-6 bg-white border border-gray-200 rounded-full flex items-center px-3 gap-2 text-[10px] text-gray-600 shadow-sm relative">
                                        <Lock size={10} className="text-green-500" />
                                        <span className="flex-1 truncate text-center text-[10px]">easy-epi.io</span>
                                        <ArrowRight size={10} className="text-gray-400" />
                                    </div>
                                </div>
                                
                                 {/* 1. App Header */}
                                 <div className="min-h-[28px] bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-3 shrink-0 z-20">
                                     <h1 className="m-0 text-[11px] font-light text-slate-700 tracking-tight" style={{ fontFamily: '"Noto Sans KR", sans-serif' }}>
                                         VirtualGrid Engine <span>v2.0</span>
                                     </h1>
                                </div>

                                {/* 2. Function Bar */}
                                <div className="w-full bg-white flex items-center px-2 shrink-0 z-10 relative border-b border-[#d3d3d3] gap-2 overflow-x-auto no-scrollbar" 
                                     style={{ minHeight: '34px' }}>
                                    
                                    {/* Cell Info Section */}
                                    <div className="flex items-center h-full mr-1 pr-1 border-r border-[#d3d3d3] py-0.5 flex-shrink-0">
                                         <span className="px-2 text-[12px] text-black">A1</span>
                                         <span className="px-0.5 text-[#5f6368] text-[10px]">▼</span>
                                         <div className="h-[60%] w-[1px] bg-gray-300 mx-1.5" />
                                         <span className="px-1 text-[13px] font-medium italic text-gray-500 font-serif">fx</span>
                                         <div className="flex items-center h-full px-2 text-[12px] text-gray-800 outline-none w-[30px]">
                                             1
                                         </div>
                                         
                                         <div className="flex items-center gap-0.5 ml-1">
                                             <button className="w-6 h-6 flex items-center justify-center rounded text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors">
                                                <Undo2 size={14} />
                                             </button>
                                             <button className="w-6 h-6 flex items-center justify-center rounded text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors">
                                                <Redo2 size={14} />
                                             </button>
                                         </div>
                                    </div>

                                    {/* Right Action Groups */}
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        {/* Filter */}
                                        <button className="flex items-center gap-1 px-1.5 h-[26px] rounded hover:bg-[#f1f3f4] text-[#3c4043] transition-colors whitespace-nowrap">
                                             <Filter size={14} />
                                             <span className="text-[11px]">필터</span>
                                        </button>
                                        <div className="w-[1px] h-[20px] bg-[#e0e0e0]" />
                                        
                                        {/* Toggles */}
                                        <div className="flex gap-0.5">
                                            <button className="flex items-center gap-1 px-1.5 h-[26px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors whitespace-nowrap">
                                                <CheckCircle2 size={14} />
                                                <span className="text-[11px]">확진여부</span>
                                            </button>
                                        </div>
                                        <div className="w-[1px] h-[20px] bg-[#e0e0e0]" />

                                        {/* Sheet Edit */}
                                        <div className="flex gap-0.5">
                                            <button className="flex items-center gap-1 px-1.5 h-[26px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors">
                                                <Copy size={14} />
                                            </button>
                                            <button className="flex items-center gap-1 px-1.5 h-[26px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* 3. Unified Scrollable Grid Area */}
                                <div 
                                    ref={containerRef}
                                    className="flex-1 overflow-auto relative bg-slate-50 overscroll-contain no-scrollbar"
                                >
                                    <table className="min-w-[900px] w-full border-collapse table-fixed bg-white">
                                        <colgroup>
                                            <col style={{ width: '45px' }} /><col style={{ width: '70px' }} /><col style={{ width: '70px' }} /><col style={{ width: '55px' }} /><col style={{ width: '55px' }} /><col style={{ width: '65px' }} /><col style={{ width: '65px' }} /><col style={{ width: '65px' }} /><col style={{ width: '120px' }} /><col style={{ width: '55px' }} /><col style={{ width: '55px' }} /><col style={{ width: '55px' }} /><col style={{ width: '55px' }} /><col style={{ width: '55px' }} /><col style={{ width: '55px' }} /><col style={{ width: '55px' }} /><col style={{ width: '55px' }} /><col style={{ width: '55px' }} /><col style={{ width: 'auto' }} />
                                        </colgroup>
                                        <thead className="sticky top-0 z-10 shadow-sm">
                                            {/* Row 1: Groups */}
                                            <tr className="h-[28px]">
                                                {/* Serial */}
                                                <th rowSpan={2} className="border border-slate-300 bg-slate-100 text-center text-[11px] font-semibold text-slate-700">연번</th>
                                                
                                                {/* Patient Status */}
                                                <th rowSpan={2} className="border border-slate-300 bg-slate-50 text-center text-[10px] font-medium text-slate-600 hover:bg-slate-100 leading-tight px-1">
                                                    환자여부<br />(1/0)
                                                </th>
                                                {/* Confirmed Status */}
                                                <th rowSpan={2} className="border border-slate-300 bg-slate-50 text-center text-[10px] font-medium text-slate-600 hover:bg-slate-100 leading-tight px-1">
                                                    확진여부<br />(1/0)
                                                </th>
                                                
                                                {/* Basic Info Group */}
                                                <th colSpan={2} className="border border-slate-300 bg-slate-100 text-center text-[11px] font-medium text-slate-600 relative group">
                                                    기본정보
                                                </th>
                                                
                                                {/* Clinical Symptoms Group */}
                                                <th colSpan={3} className="border border-slate-300 bg-red-50 text-center text-[11px] font-bold text-red-600 border-b-red-200 relative group leading-tight">
                                                    임상증상
                                                </th>

                                                {/* Symptom Onset */}
                                                <th rowSpan={2} className="border border-slate-300 bg-slate-50 text-center text-[11px] font-medium text-slate-600">증상발현시간</th>

                                                {/* Diet Group (Expanded) */}
                                                <th colSpan={9} className="border border-slate-300 bg-slate-50 text-center text-[11px] font-medium text-slate-600 relative group leading-tight">
                                                    식단 (점심)
                                                    <div className="absolute top-1/2 left-1.5 -translate-y-1/2 flex gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                        <button className="w-[14px] h-[14px] flex items-center justify-center bg-white border border-slate-300 rounded text-[9px] hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400">+</button>
                                                    </div>
                                                </th>

                                                {/* Filler */}
                                                <th rowSpan={2} className="border border-slate-300 bg-slate-50"></th>
                                            </tr>
                                            {/* Row 2: Sub Headers */}
                                            <tr className="h-[28px]">
                                                {/* Basic Sub */}
                                                <th className="border border-slate-300 bg-slate-50 text-center text-[10px] font-medium text-slate-600">grade</th>
                                                <th className="border border-slate-300 bg-slate-50 text-center text-[10px] font-medium text-slate-600">class</th>
                                                
                                                {/* Clinical Sub */}
                                                <th className="border border-slate-300 bg-red-50/50 text-center text-[10px] font-medium text-red-600">diarrhea</th>
                                                <th className="border border-slate-300 bg-red-50/50 text-center text-[10px] font-medium text-red-600">vomit</th>
                                                <th className="border border-slate-300 bg-red-50/50 text-center text-[10px] font-medium text-red-600">fever</th>

                                                {/* Diet Sub */}
                                                <th className="border border-slate-300 bg-slate-50 text-center text-[10px] font-medium text-slate-600">rice</th>
                                                <th className="border border-slate-300 bg-slate-50 text-center text-[10px] font-medium text-slate-600">soup</th>
                                                <th className="border border-slate-300 bg-slate-50 text-center text-[10px] font-medium text-slate-600">pork</th>
                                                <th className="border border-slate-300 bg-slate-50 text-center text-[10px] font-medium text-slate-600">kimchi</th>
                                                <th className="border border-slate-300 bg-slate-50 text-center text-[10px] font-medium text-slate-600">radish</th>
                                                <th className="border border-slate-300 bg-slate-50 text-center text-[10px] font-medium text-slate-600">bean_sprout</th>
                                                <th className="border border-slate-300 bg-slate-50 text-center text-[10px] font-medium text-slate-600">spinach</th>
                                                <th className="border border-slate-300 bg-slate-50 text-center text-[10px] font-medium text-slate-600">milk</th>
                                                <th className="border border-slate-300 bg-slate-50 text-center text-[10px] font-medium text-slate-600">yogurt</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mockRows.map((item) => (
                                                <tr key={item.index} className="h-[28px]">
                                                        <td className="border border-gray-300 bg-slate-100 text-center text-[10px] text-slate-500 font-medium">
                                                            {item.index + 1}
                                                        </td>
                                                        <td className="border border-gray-300 text-center text-[11px] font-medium text-slate-700">
                                                            {item.isPatient ? '1' : '0'}
                                                        </td>
                                                        <td className="border border-gray-300 text-center text-[11px] font-medium text-slate-700">
                                                            {item.isConfirmed ? '1' : '0'}
                                                        </td>
                                                        
                                                        <td className="border border-gray-300 text-center text-[11px] text-slate-700">{item.grade}</td>
                                                        <td className="border border-gray-300 text-center text-[11px] text-slate-700">{item.classNum}</td>
                                                        
                                                        <td className="border border-gray-300 text-center text-[11px] text-slate-700">{item.hasDiarrhea ? '1' : '0'}</td>
                                                        <td className="border border-gray-300 text-center text-[11px] text-slate-700">{item.hasVomit ? '1' : '0'}</td>
                                                        <td className="border border-gray-300 text-center text-[11px] text-slate-700">{item.hasFever ? '1' : '0'}</td>
                                                        
                                                        {/* Onset */}
                                                        <td className="border border-gray-300 text-center text-[11px] text-slate-600 font-mono tracking-tight">
                                                             {item.isPatient ? item.onsetDate : ''}
                                                        </td>

                                                        {/* Diet Columns */}
                                                        <td className="border border-gray-300 text-center text-[11px] text-slate-700">{item.ateRice ? '1' : '0'}</td>
                                                        <td className="border border-gray-300 text-center text-[11px] text-slate-700">{item.ateSoup ? '1' : '0'}</td>
                                                        <td className="border border-gray-300 text-center text-[11px] text-slate-700">{item.atePork ? '1' : '0'}</td>
                                                        <td className="border border-gray-300 text-center text-[11px] text-slate-700">{item.ateKimchi ? '1' : '0'}</td>
                                                        <td className="border border-gray-300 text-center text-[11px] text-slate-700">{item.ateRadish ? '1' : '0'}</td>
                                                        <td className="border border-gray-300 text-center text-[11px] text-slate-700">{item.ateBeanSprout ? '1' : '0'}</td>
                                                        <td className="border border-gray-300 text-center text-[11px] text-slate-700">{item.ateSpinach ? '1' : '0'}</td>
                                                        <td className="border border-gray-300 text-center text-[11px] text-slate-700">{item.ateMilk ? '1' : '0'}</td>
                                                        <td className="border border-gray-300 text-center text-[11px] text-slate-700">{item.ateYogurt ? '1' : '0'}</td>

                                                        <td className="border border-gray-300"></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    {/* Right: Explanation */}
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                                <Layers className="text-emerald-600 w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {t('recyclingTitle')}
                                </h3>
                                <p className="text-gray-600 leading-relaxed break-keep">
                                    {t('recyclingDesc')}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                                <Zap className="text-blue-600 w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {t('performanceTitle')}
                                </h3>
                                <p className="text-gray-600 leading-relaxed break-keep">
                                    {t('performanceDesc')}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
