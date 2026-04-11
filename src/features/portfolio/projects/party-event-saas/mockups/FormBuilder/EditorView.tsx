import React from 'react';
import { motion } from "framer-motion";
import {
    Plus,
    GripVertical,
    ChevronDown,
    CheckSquare,
    ClipboardCheck
} from "lucide-react";
import { Typewriter } from './Typewriter';

interface EditorViewProps {
    loopKey: number;
}

export const EditorView: React.FC<EditorViewProps> = ({ loopKey }) => {
    return (
        <div className="flex-1 bg-slate-50 overflow-y-auto scrollbar-thin p-4 md:p-8 flex justify-center relative">
            <div className="w-full max-w-2xl flex flex-col gap-4 pb-20">

                {/* Form Cover (Collapsed Style) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 flex items-center gap-4 hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <ClipboardCheck size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-bold text-slate-700 group-hover:text-indigo-900 transition-colors">
                                폼 제목 및 커버
                            </h3>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-400 border border-slate-200">
                                COVER
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                            12/24 크리스마스 로테이션 파티 신청
                        </p>
                    </div>
                </div>

                {/* Questions List */}
                <div key={loopKey} className="flex flex-col gap-3 relative min-h-[400px]">

                    {/* Q1: Active Question (Simulating Typing) */}
                    <motion.div
                        className="bg-white rounded-xl border border-indigo-500 ring-1 ring-indigo-500 shadow-lg relative overflow-hidden z-20"
                        animate={{
                            // 0~4.8s Static (0)
                            // 4.8~6.0s Move (84)
                            // 6.0~8.0s Stay (84)
                            y: [0, 0, 84, 84] 
                        }}
                        transition={{ 
                            duration: 8,
                            times: [0, 0.6, 0.75, 1],
                            ease: "easeInOut"
                        }}
                    >
                        {/* Editor Header */}
                        <div className="flex items-start p-4 pb-0 gap-3">
                            <div className="flex-1 space-y-3">
                                {/* Row 1: Title & Label */}
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">질문 제목</label>
                                        <div className="w-full p-2.5 text-base font-normal bg-white border border-slate-200 rounded-lg outline-none ring-2 ring-indigo-500/10 border-indigo-500 text-slate-800 flex items-center min-h-[42px]">
                                            <Typewriter text="이상형을 선택해주세요" delay={1500} />
                                            <motion.span
                                                animate={{ opacity: [1, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                                className="inline-block w-[1.5px] h-4 bg-indigo-500 ml-0.5 align-middle"
                                            />
                                        </div>
                                    </div>
                                    
                                </div>

                                {/* Row 2: Description & Type */}
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">질문 설명</label>
                                        <div className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-400">
                                            질문 설명 (선택)
                                        </div>
                                    </div>
                                    <div className="w-32 shrink-0">
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1">답변 유형</label>
                                        <div className="relative">
                                            <div className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-xs font-medium bg-white text-slate-700 flex items-center">
                                                객관식
                                            </div>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"><ChevronDown size={14} /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Option List Area */}
                        <div className="px-4 pb-0 pt-2">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mt-2">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase ml-1">옵션 목록</span>
                                </div>
                                
                                <div className="space-y-2">
                                    {['대화가 잘 통하는 사람', '취미가 비슷한 사람', '유머 코드가 맞는 사람'].map((opt, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm group hover:border-indigo-300 transition-all">
                                            <div className="text-slate-300 cursor-grab hover:text-slate-500"><GripVertical size={14} /></div>
                                            <div className="flex-1 text-xs text-slate-700 font-medium">{opt}</div>
                                            <div className="text-slate-300 hover:text-red-500 cursor-pointer p-1"><Plus size={14} className="rotate-45" /></div>
                                        </div>
                                    ))}
                                </div>

                                <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 py-2 px-1 flex items-center gap-1.5 mt-2">
                                    <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <Plus size={10} />
                                    </div>
                                    옵션 추가하기
                                </button>
                            </div>
                        </div>

                        {/* Footer Toolbar */}
                        <div className="px-6 py-4 mt-2 border-t border-slate-100 flex items-center justify-between bg-white">
                            <button className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg shadow-sm shadow-indigo-200">
                                <CheckSquare size={14} />
                                <span>완료</span>
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 opacity-50">
                                    <div className="text-[11px] font-bold text-slate-500">기타 허용</div>
                                    <div className="w-9 h-5 rounded-full bg-slate-200 relative"><div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-[11px] font-bold text-slate-600">필수 응답</div>
                                    <div className="w-9 h-5 rounded-full bg-indigo-600 relative"><div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm translate-x-4" /></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Q2: Floating Draggable Item - Single Run Swap */}
                    <motion.div
                        className="bg-white rounded-xl border border-slate-300 relative group z-30"
                        animate={{
                            // 0~4.8 Static
                            // 4.8~6.0 Move Up to -330
                            // 6.0~8.0 Stay (-330)
                            y: [0, 0, 0, -330, -330], 
                            scale: [1, 1, 1.02, 1.02, 1], 
                            zIndex: [10, 10, 30, 30, 30], 
                            boxShadow: [
                                "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                            ]
                        }}
                        transition={{
                            duration: 8,
                            times: [0, 0.6, 0.65, 0.75, 1],
                            ease: "easeInOut"
                        }}
                    >
                        <div className="flex items-center p-3 md:p-4 gap-3 md:gap-4">
                            <div className="p-1 text-slate-300 rounded bg-transparent">
                                <GripVertical size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold border border-slate-200">2</span>
                                    <span className="text-xs md:text-sm font-bold text-slate-700 truncate">나의 성격 유형 (MBTI)</span>
                                </div>
                                <div className="text-[10px] text-red-500 font-medium mt-0.5 pl-7">* 필수 응답</div>
                            </div>
                            <div className="px-2 py-1 bg-slate-50 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wide border border-slate-100 hidden sm:block">
                                단답형
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};
