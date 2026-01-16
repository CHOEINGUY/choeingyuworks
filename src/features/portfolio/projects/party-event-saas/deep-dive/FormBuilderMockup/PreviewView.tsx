import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Palette, ChevronRight, Type, Square, Check } from "lucide-react";

interface PreviewViewProps {
    themeKey: number;
    isDarkMode: boolean;
    subTab: 'style' | 'color';
    onSubTabChange: (tab: 'style' | 'color') => void;
}

export const PreviewView: React.FC<PreviewViewProps> = ({ themeKey, isDarkMode, subTab, onSubTabChange }) => {

    return (
        <div className="flex flex-1 overflow-hidden relative">
            {/* Left: Mobile Phone Frame Preview (Fixed Proportions) */}
            <div className="flex-1 bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="h-[120%] aspect-[9/18.5] bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border-[6px] border-slate-300 relative translate-y-12">
                    <div className={`w-full h-full relative rounded-[2rem] overflow-hidden transition-colors duration-700 flex flex-col ${isDarkMode ? 'bg-[#020617]' : 'bg-white'}`}>
                        
                        {/* Phone Status Bar */}
                        <div className={`h-8 shrink-0 flex items-center justify-between px-8 text-[11px] font-bold ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                            <span>9:41</span>
                            <div className="flex items-center gap-1.5">
                                <div className={`w-5 h-2 rounded-sm border ${isDarkMode ? 'bg-white/20 border-white/10' : 'bg-slate-300 border-slate-200'}`}></div>
                            </div>
                        </div>

                        {/* Immersive Form Content (Strict Fidelity to ImmersiveCover.tsx) */}
                        <div className="flex-1 relative flex flex-col overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${themeKey}-${isDarkMode}`}
                                    initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                                    transition={{ duration: 1.2, ease: [0.19, 1.0, 0.22, 1.0] }}
                                    className="absolute inset-0 flex flex-col items-center text-center p-8 justify-center gap-12"
                                >
                                    {/* Top Section: Logo + Title + Description (ImmersiveCover.tsx:39) */}
                                    <div className="flex flex-col items-center w-full">
                                        {/* Logo (No shell, per user request) */}
                                        <div className="mb-6 md:mb-8">
                                            <div className={`text-xs font-black tracking-[0.2em] opacity-80 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                                                LINDY PARTY
                                            </div>
                                        </div>

                                        <h1 className={`text-lg font-bold mb-3 whitespace-pre-wrap break-keep leading-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                            12/24{"\n"}크리스마스 로테이션 파티 신청
                                        </h1>
                                        <p className={`text-xs whitespace-pre-line leading-relaxed break-keep opacity-50 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                            올해의 마지막 밤,{"\n"}특별한 인연을 만나보세요.
                                        </p>
                                    </div>

                                    {/* Bottom: CTA Button (EXACT MATCH to ImmersiveCover.tsx:100) */}
                                    <div className="w-full flex justify-center pb-4">
                                        <div className={`
                                            w-full max-w-xs font-bold py-4 flex items-center justify-center gap-2 group transition-all shadow-lg rounded-xl text-sm
                                            ${isDarkMode
                                                ? 'bg-white text-slate-900 shadow-white/10'
                                                : 'bg-slate-900 text-white shadow-slate-900/20'}
                                        `}>
                                            <span>시작하기</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Design Panel (DesignPanel.tsx Style) */}
            <div className="w-[280px] bg-white border-l border-slate-200 flex flex-col z-20 hidden lg:flex">
                {/* Panel Header */}
                <div className="p-5 pb-0 bg-white">
                    <h3 className="text-sm font-bold text-slate-800 mb-1">디자인 설정</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                        폼의 디자인과 색상을 설정합니다.
                    </p>

                    {/* Sub Tabs (DesignPanel.tsx:36) */}
                    <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
                        <button
                            onClick={() => onSubTabChange('style')}
                            className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${subTab === 'style'
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            스타일
                        </button>
                        <button
                            onClick={() => onSubTabChange('color')}
                            className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${subTab === 'color'
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            색상
                        </button>
                    </div>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                {/* Panel Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {subTab === 'style' ? (
                        <>
                            {/* Font Style Section */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <Type size={14} className="text-slate-400" />
                                    폰트 스타일
                                </label>
                                <div className="space-y-2">
                                    <div className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-600">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className="block text-xs font-bold text-indigo-900">프리텐다드</span>
                                                <span className="text-[10px] text-slate-400 mt-0.5 block">깔끔하고 현대적인 고딕</span>
                                            </div>
                                        </div>
                                        <Check size={14} className="text-indigo-600" strokeWidth={3} />
                                    </div>
                                </div>
                            </div>

                            {/* Button Style Section (DesignPanel.tsx:85) */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <Square size={14} className="text-slate-400" />
                                    버튼 스타일
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'rounded', label: '라운드', radius: 'rounded-lg', active: true },
                                        { id: 'square', label: '스퀘어', radius: 'rounded-none', active: false },
                                        { id: 'pill', label: '필(Pill)', radius: 'rounded-full', active: false },
                                    ].map((style) => (
                                        <div
                                            key={style.id}
                                            className={`relative flex flex-col items-center justify-center py-3 border rounded-xl transition-all ${style.active ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-sm' : 'border-slate-200'}`}
                                        >
                                            <div className={`w-8 h-4 bg-slate-200 mb-1.5 ${style.radius}`} />
                                            <span className={`text-[9px] font-bold ${style.active ? 'text-indigo-700' : 'text-slate-500'}`}>{style.label}</span>
                                            {style.active && <div className="absolute top-1 right-1 text-indigo-600"><Check size={8} strokeWidth={4} /></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6">
                            {/* Mode Section */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <Palette size={14} className="text-slate-400" />
                                    테마 모드
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <motion.button
                                        animate={{
                                            scale: !isDarkMode ? 1.02 : 1,
                                            borderColor: !isDarkMode ? 'rgb(79, 70, 229)' : 'rgb(226, 232, 240)',
                                            backgroundColor: !isDarkMode ? 'rgb(238, 242, 255)' : 'rgb(255, 255, 255)'
                                        }}
                                        className={`flex items-center justify-center p-3 rounded-xl border transition-all gap-2 relative
                                            ${!isDarkMode ? 'text-indigo-700 ring-1 ring-indigo-600 shadow-sm' : 'text-slate-500'}`}
                                    >
                                        <Sun size={14} />
                                        <span className="text-[11px] font-bold">라이트</span>
                                        {!isDarkMode && <div className="absolute top-1 right-1 text-indigo-600"><Check size={10} strokeWidth={3} /></div>}
                                    </motion.button>
                                    <motion.button
                                        animate={{
                                            scale: isDarkMode ? 1.02 : 1,
                                            borderColor: isDarkMode ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)',
                                            backgroundColor: isDarkMode ? 'rgb(30, 41, 59)' : 'rgb(255, 255, 255)'
                                        }}
                                        className={`flex items-center justify-center p-3 rounded-xl border transition-all gap-2 relative
                                            ${isDarkMode ? 'text-white ring-1 ring-slate-800 shadow-sm' : 'text-slate-500'}`}
                                    >
                                        <Moon size={14} />
                                        <span className="text-[11px] font-bold">다크</span>
                                        {isDarkMode && <div className="absolute top-1 right-1 text-white"><Check size={10} strokeWidth={3} /></div>}
                                    </motion.button>
                                </div>
                            </div>

                            {/* Color Palette (DesignPanel.tsx:202) */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    포인트 컬러
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { id: 'indigo', bg: 'bg-indigo-600', active: true },
                                        { id: 'rose', bg: 'bg-rose-500', active: false },
                                        { id: 'emerald', bg: 'bg-emerald-500', active: false },
                                        { id: 'amber', bg: 'bg-amber-500', active: false }
                                    ].map((color) => (
                                        <div
                                            key={color.id}
                                            className={`relative flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${color.active ? 'bg-slate-100 ring-1 ring-slate-200' : ''}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center ${color.bg} ${color.active ? 'scale-110' : ''}`}>
                                                {color.active && <Check size={12} className="text-white" strokeWidth={3} />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
