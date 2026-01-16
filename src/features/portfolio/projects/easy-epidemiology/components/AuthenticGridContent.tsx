import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo2, Redo2, Filter, CheckCircle2, Clock, FileDown, FileText, Copy, RefreshCw, Trash2, Upload } from 'lucide-react';

interface Props {
    isActive: boolean;
}

export function AuthenticGridContent({ isActive }: Props) {
    const [selectedCells] = useState<string[]>(['4_2']);
    const gridBodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = gridBodyRef.current;
        if (!scrollContainer) return;

        let animationFrameId: number = 0;
        // Target scroll position
        const targetScrollTop = 150; 
        
        // Speed in pixels per frame (60fps assumption). 
        // 0.5px/frame => ~30px/sec. Smooth and slow.
        const scrollSpeed = 0.5; 

        const animateScroll = () => {
            if (!isActive) return; // Stop if not active

            // Current position
            const currentScrollTop = scrollContainer.scrollTop;

            if (currentScrollTop < targetScrollTop) {
                // Determine next position
                const nextScrollTop = Math.min(currentScrollTop + scrollSpeed, targetScrollTop);
                scrollContainer.scrollTop = nextScrollTop;

                // Continue if not reached
                if (nextScrollTop < targetScrollTop) {
                    animationFrameId = requestAnimationFrame(animateScroll);
                }
            }
        };

        if (isActive) {
            // Start or Resume animation
            // Add a small delay only if starting from 0 (initial load)
            if (scrollContainer.scrollTop === 0) {
                 const timer = setTimeout(() => {
                    animationFrameId = requestAnimationFrame(animateScroll);
                 }, 800);
                 return () => clearTimeout(timer);
            } else {
                 animationFrameId = requestAnimationFrame(animateScroll);
            }
        } else {
            // If inactive, we just cancel the next frame, effectively pausing.
            // The scroll position remains as is.
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isActive]);

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden relative font-sans">
            {/* 1. Function Bar */}
            <div className="w-full bg-white flex items-center px-2 shrink-0 z-10 relative border-b border-[#d3d3d3] gap-2" 
                 style={{ minHeight: '40px' }}>
                
                {/* Cell Info Section */}
                <div className="flex items-center h-full mr-1 pr-1 border-r border-[#d3d3d3] py-1 flex-1 min-w-0">
                     <span className="px-3 text-[14px] text-black">A1</span>
                     <span className="px-1 text-[#5f6368] text-[12px]">▼</span>
                     <div className="h-[60%] w-[1px] bg-gray-300 mx-2" />
                     <span className="px-2 text-[15px] font-medium italic text-gray-500 font-serif">fx</span>
                     <div className="flex items-center h-full px-2 text-[14px] text-gray-800 flex-1 outline-none"></div>
                     
                     <div className="flex items-center gap-1 ml-2">
                         <button className="w-7 h-7 flex items-center justify-center rounded text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#1a73e8] disabled:opacity-50 transition-colors">
                            <Undo2 size={18} />
                         </button>
                         <button className="w-7 h-7 flex items-center justify-center rounded text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#1a73e8] disabled:opacity-50 transition-colors">
                            <Redo2 size={18} />
                         </button>
                     </div>
                </div>

                {/* Right Action Groups */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Filter */}
                    <button className="flex items-center gap-1.5 px-2 h-[32px] rounded hover:bg-[#f1f3f4] text-[#3c4043] hover:text-[#1a73e8] transition-colors relative group">
                         <Filter size={18} />
                         <span className="text-[14px]">필터</span>
                    </button>
                    <div className="w-[1px] h-[32px] bg-[#e0e0e0]" />
                    
                    {/* Toggles */}
                    <div className="flex gap-0.5">
                        <button className="flex items-center gap-1.5 px-2 h-[32px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors" title="확진여부">
                            <CheckCircle2 size={18} />
                            <span className="text-[14px]">확진여부</span>
                        </button>
                        <button className="flex items-center gap-1.5 px-2 h-[32px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors" title="노출시간">
                            <Clock size={18} />
                            <span className="text-[14px]">노출시간</span>
                        </button>
                    </div>
                    <div className="w-[1px] h-[32px] bg-[#e0e0e0]" />

                    {/* Data IO */}
                    <div className="flex gap-0.5">
                        <button className="flex items-center gap-1.5 px-2 h-[32px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors" title="엑셀 업로드">
                            <Upload size={18} />
                        </button>
                        <button className="flex items-center gap-1.5 px-2 h-[32px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors" title="서식 다운로드">
                            <FileText size={18} />
                            <span className="text-[14px] hidden xl:inline">서식</span>
                        </button>
                        <button className="flex items-center gap-1.5 px-2 h-[32px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors" title="내보내기">
                            <FileDown size={18} />
                            <span className="text-[14px] hidden xl:inline">내보내기</span>
                        </button>
                    </div>
                    <div className="w-[1px] h-[32px] bg-[#e0e0e0]" />

                    {/* Sheet Edit */}
                    <div className="flex gap-0.5">
                        <button className="flex items-center gap-1.5 px-2 h-[32px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors" title="전체 복사">
                            <Copy size={18} />
                            <span className="text-[14px] hidden xl:inline">복사</span>
                        </button>
                        <button className="flex items-center gap-1.5 px-2 h-[32px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors" title="빈 열 삭제">
                            <Trash2 size={18} />
                            <span className="text-[14px] hidden xl:inline">삭제</span>
                        </button>
                        <button className="flex items-center gap-1.5 px-2 h-[32px] rounded text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#1a73e8] transition-colors" title="초기화">
                            <RefreshCw size={18} />
                            <span className="text-[14px] hidden xl:inline">초기화</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Grid Header */}
            <div className="flex-none relative z-10 bg-slate-50 border-b border-gray-300 shadow-sm overflow-hidden select-none">
                <table className="w-full border-collapse table-fixed">
                    <colgroup>
                        <col style={{ width: '50px' }} /><col style={{ width: '80px' }} /><col style={{ width: '80px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '70px' }} /><col style={{ width: '70px' }} /><col style={{ width: '70px' }} /><col style={{ width: '140px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: 'auto' }} />
                    </colgroup>
                    <thead>
                        {/* Row 1: Groups */}
                        <tr className="h-[35px]">
                            {/* Serial */}
                            <th rowSpan={2} className="border border-slate-300 bg-slate-100 text-center text-[12px] font-semibold text-slate-700">연번</th>
                            
                            {/* Patient Status */}
                            <th rowSpan={2} className="border border-slate-300 bg-slate-50 text-center text-[11px] font-medium text-slate-600 hover:bg-slate-100 leading-tight px-1">
                                환자여부<br />(1/0)
                            </th>
                            {/* Confirmed Status */}
                            <th rowSpan={2} className="border border-slate-300 bg-slate-50 text-center text-[11px] font-medium text-slate-600 hover:bg-slate-100 leading-tight px-1">
                                확진여부<br />(1/0)
                            </th>
                            
                            {/* Basic Info Group */}
                            <th colSpan={2} className="border border-slate-300 bg-slate-100 text-center text-[12px] font-medium text-slate-600 relative group">
                                기본정보
                            </th>
                            
                            {/* Clinical Symptoms Group */}
                            <th colSpan={3} className="border border-slate-300 bg-red-50 text-center text-[12px] font-bold text-red-600 border-b-red-200 relative group leading-tight">
                                임상증상
                            </th>

                            {/* Symptom Onset */}
                            <th rowSpan={2} className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600">증상발현시간</th>

                            {/* Diet Group (Expanded) */}
                            <th colSpan={9} className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600 relative group leading-tight">
                                식단(1/0)
                                <div className="absolute top-1/2 left-1.5 -translate-y-1/2 flex gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <button className="w-[16px] h-[16px] flex items-center justify-center bg-white border border-slate-300 rounded text-[10px] hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400">+</button>
                                </div>
                            </th>

                            {/* Filler */}
                            <th rowSpan={2} className="border border-slate-300 bg-slate-50"></th>
                        </tr>
                        {/* Row 2: Sub Headers */}
                        <tr className="h-[35px]">
                            {/* Basic Sub */}
                            <th className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600">grade</th>
                            <th className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600">class</th>
                            
                            {/* Clinical Sub */}
                            <th className="border border-slate-300 bg-red-50/50 text-center text-[12px] font-medium text-red-600">diarrhea</th>
                            <th className="border border-slate-300 bg-red-50/50 text-center text-[12px] font-medium text-red-600">vomit</th>
                            <th className="border border-slate-300 bg-red-50/50 text-center text-[12px] font-medium text-red-600">fever</th>

                            {/* Diet Sub */}
                            <th className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600">rice</th>
                            <th className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600">soup</th>
                            <th className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600">pork</th>
                            <th className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600">kimchi</th>
                            <th className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600">radish</th>
                            <th className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600">bean_sprout</th>
                            <th className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600">spinach</th>
                            <th className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600">milk</th>
                            <th className="border border-slate-300 bg-slate-50 text-center text-[12px] font-medium text-slate-600">yogurt</th>
                        </tr>
                    </thead>
                </table>
            </div>

            {/* 3. Grid Body */}
            <div 
                ref={gridBodyRef}
                className="flex-1 bg-slate-50 relative overflow-hidden overflow-y-auto no-scrollbar"
            >
                <table className="w-full border-collapse table-fixed bg-white">
                    <colgroup>
                        <col style={{ width: '50px' }} /><col style={{ width: '80px' }} /><col style={{ width: '80px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '70px' }} /><col style={{ width: '70px' }} /><col style={{ width: '70px' }} /><col style={{ width: '140px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: '60px' }} /><col style={{ width: 'auto' }} />
                    </colgroup>
                    <tbody>
                         {Array.from({ length: 40 }).map((_, i) => { 
                             const isPatient = i < 40;
                             const isConfirmed = isPatient && i % 2 === 0;
                             
                             const hasDiarrhea = isPatient && i % 2 === 0;
                             const hasVomit = isPatient && i % 3 === 0;
                             const hasFever = isPatient && i % 4 === 0;
                             
                             const grade = (i % 6) + 1;
                             const classNum = (i % 5) + 1;

                             // Diet Data
                             const ateRice = true;
                             const ateSoup = i % 10 !== 0; // Most ate it
                             const atePork = i % 3 === 0;
                             const ateKimchi = i % 2 === 0;
                             const ateRadish = i % 3 !== 0;
                             const ateBeanSprout = i % 4 === 0;
                             const ateSpinach = i % 5 === 0;
                             const ateMilk = i % 2 !== 0;
                             const ateYogurt = i % 5 === 0;
                             
                             const isSelected = i === 3; 
                             
                             // Date Format: yyyy-mm-dd hh:mm
                             const day = 10 + (i % 5);
                             const onsetDate = `2023-09-${day} 10:00`;

                             return (
                                 <tr key={i} className="h-[35px]">
                                     {/* No */}
                                     <td className="border border-gray-300 bg-slate-100 text-center text-[12px] text-slate-500 font-medium">
                                         {i + 1}
                                     </td>
                                     {/* Patient Status */}
                                     <td className="border border-gray-300 text-center text-[13px] font-medium text-slate-700">
                                         {isPatient ? '1' : '0'}
                                     </td>
                                     {/* Confirmed Status */}
                                     <td className="border border-gray-300 text-center text-[13px] font-medium text-slate-700">
                                         {isConfirmed ? '1' : '0'}
                                     </td>
                                     
                                     {/* Grade */}
                                     <td className="border border-gray-300 text-center text-[13px] text-slate-700 relative">
                                        {grade}
                                         {isSelected && (
                                            <div className="absolute inset-0 border-[2px] border-[#1a73e8] pointer-events-none z-10" />
                                         )}
                                     </td>
                                     {/* Class */}
                                     <td className="border border-gray-300 text-center text-[13px] text-slate-700">
                                         {classNum}
                                     </td>
                                     
                                     {/* Diarrhea */}
                                     <td className="border border-gray-300 text-center text-[13px] font-medium text-slate-700">
                                         {hasDiarrhea ? '1' : '0'}
                                     </td>
                                     {/* Vomit */}
                                     <td className="border border-gray-300 text-center text-[13px] font-medium text-slate-700">
                                         {hasVomit ? '1' : '0'}
                                     </td>
                                     {/* Fever */}
                                     <td className="border border-gray-300 text-center text-[13px] font-medium text-slate-700">
                                         {hasFever ? '1' : '0'}
                                     </td>

                                     {/* Onset (Updated Format) */}
                                     <td className="border border-gray-300 text-center text-[12px] text-slate-600 font-mono tracking-tight">
                                         {isPatient ? onsetDate : ''}
                                     </td>

                                     {/* Diet: Rice */}
                                     <td className="border border-gray-300 text-center text-[13px] font-medium text-slate-700">
                                         {ateRice ? '1' : '0'}
                                     </td>
                                     {/* Diet: Soup */}
                                     <td className="border border-gray-300 text-center text-[13px] font-medium text-slate-700">
                                         {ateSoup ? '1' : '0'}
                                     </td>
                                     {/* Diet: Pork */}
                                     <td className="border border-gray-300 text-center text-[13px] font-medium text-slate-700">
                                         {atePork ? '1' : '0'}
                                     </td>
                                     {/* Diet: Kimchi */}
                                     <td className="border border-gray-300 text-center text-[13px] font-medium text-slate-700">
                                         {ateKimchi ? '1' : '0'}
                                     </td>
                                     {/* Diet: Radish */}
                                     <td className="border border-gray-300 text-center text-[13px] font-medium text-slate-700">
                                         {ateRadish ? '1' : '0'}
                                     </td>
                                     {/* Diet: Bean Sprout */}
                                     <td className="border border-gray-300 text-center text-[13px] font-medium text-slate-700">
                                         {ateBeanSprout ? '1' : '0'}
                                     </td>
                                     {/* Diet: Spinach */}
                                     <td className="border border-gray-300 text-center text-[13px] font-medium text-slate-700">
                                         {ateSpinach ? '1' : '0'}
                                     </td>
                                     {/* Diet: Milk */}
                                     <td className="border border-gray-300 text-center text-[13px] font-medium text-slate-700">
                                         {ateMilk ? '1' : '0'}
                                     </td>
                                     {/* Diet: Yogurt */}
                                     <td className="border border-gray-300 text-center text-[13px] font-medium text-slate-700">
                                         {ateYogurt ? '1' : '0'}
                                     </td>

                                     {/* Empty Filler */}
                                     <td className="border border-gray-300"></td>
                                 </tr>
                             );
                         })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

