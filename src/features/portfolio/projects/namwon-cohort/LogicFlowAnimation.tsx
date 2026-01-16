"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Check, X, Clock, Volume2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Candidate } from "@/types";

interface LogicFlowAnimationProps {
    step: number;
    candidates: Candidate[];
    room: string;
}

export function LogicFlowAnimation({ step, candidates, room }: LogicFlowAnimationProps) {
    const t = useTranslations("CohortDashboard.LogicFlow");
    const winner = candidates.find(c => c.id === 4);

    return (
        <div className="bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 border border-slate-200 relative h-[500px] md:h-[580px] flex flex-col shadow-inner overflow-hidden transition-all duration-300">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 md:mb-8 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[11px] md:text-xs font-bold text-slate-500 tracking-wider">{t('header')}</span>
                    </div>
                    <div className="px-2.5 py-1 bg-white rounded-full border border-slate-200 text-[10px] font-mono font-bold text-slate-400">
                        {t('phase')}: {step}/4
                    </div>
                </div>

                {/* Content Area - Using LayoutGroup/AnimatePresence for smooth swapping */}
                <div className="flex-1 flex flex-col gap-3 md:gap-4">
                    <AnimatePresence mode="popLayout">
                        {candidates.map((person) => {
                            const isBlockedByStatus = step >= 1 && person.status === "Active";
                            const isBlockedByPrereq = step >= 2 && !isBlockedByStatus && !person.prereq;
                            const isWinner = person.id === 4;
                            
                            // In step 4, we only show the winner
                            if (step === 4 && !isWinner) return null;

                            return (
                                <motion.div
                                    key={person.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ 
                                        opacity: (isBlockedByStatus || isBlockedByPrereq) ? 0.4 : 1,
                                        scale: 1, 
                                        y: 0,
                                        filter: (isBlockedByStatus || isBlockedByPrereq) ? "grayscale(0.4)" : "none"
                                    }}
                                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className={`bg-white items-center justify-between border-2
                                        ${(step === 4 && isWinner) 
                                            ? "p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-blue-500 shadow-xl flex" 
                                            : "p-3 md:p-4 rounded-xl md:rounded-2xl border-slate-100 shadow-sm flex"}
                                        ${(isBlockedByStatus || isBlockedByPrereq) ? "bg-slate-50/50" : "bg-white"}
                                    `}
                                >
                                    <div className="flex items-center gap-3 md:gap-5">
                                        <div className={`flex items-center justify-center font-bold shrink-0 transition-colors duration-300
                                            ${(step === 4 && isWinner) 
                                                ? "w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl text-lg md:text-xl bg-blue-100 text-blue-700" 
                                                : "w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl text-xs md:text-sm bg-slate-100 text-slate-400"}`}>
                                            {step >= 3 && isWinner ? "1st" : <User className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />}
                                        </div>
                                        <div>
                                            <div className={`font-bold text-slate-900 flex items-center gap-1.5 md:gap-2 transition-all duration-300 ${(step === 4 && isWinner) ? "text-xl md:text-2xl" : "text-sm md:text-base"}`}>
                                                {person.name}
                                                {isBlockedByStatus && <span className="text-[9px] md:text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full whitespace-nowrap">{t('status.active')}</span>}
                                                {isBlockedByPrereq && <span className="text-[9px] md:text-[10px] bg-orange-50 text-orange-500 px-1.5 py-0.5 rounded-full whitespace-nowrap">{t('status.locked')}</span>}
                                            </div>
                                            <div className={`text-slate-500 flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1 transition-all duration-300 ${(step === 4 && isWinner) ? "text-xs md:text-sm" : "text-[10px] md:text-xs"}`}>
                                                <Clock className={(step === 4 && isWinner) ? "w-3.5 h-3.5 md:w-4 md:h-4" : "w-3 h-3"} /> {person.time}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 md:gap-3">
                                        {(isBlockedByStatus || isBlockedByPrereq) ? (
                                            <div className="flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-3 md:py-1.5 bg-slate-100 rounded-lg text-[10px] md:text-[11px] font-bold text-slate-400 whitespace-nowrap">
                                                <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                                {person.reason}
                                            </div>
                                        ) : step >= 1 && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`flex items-center gap-1 md:gap-1.5 rounded-lg font-bold text-emerald-600 bg-emerald-50 whitespace-nowrap
                                                ${(step === 4 && isWinner) ? "px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm" : "px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-[11px]"}`}>
                                                <Check className={(step === 4 && isWinner) ? "w-3.5 h-3.5 md:w-4 md:h-4" : "w-3 h-3 md:w-3.5 md:h-3.5"} /> {t('status.waiting')}
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}

                        {step === 4 && winner && (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
                                className="mt-4" // slight margin top
                            >
                                <div className="bg-blue-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-500/40">
                                    {/* Animated Waves */}
                                    <div className="absolute top-0 right-0 p-8 flex gap-1 items-end h-full opacity-20 group">
                                        {[0.4, 0.7, 0.5, 0.9, 0.6].map((h, i) => (
                                            <motion.div 
                                                key={i}
                                                className="w-2 bg-white rounded-full"
                                                animate={{ height: ['20%', '80%', '20%'] }}
                                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                                            />
                                        ))}
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4 opacity-70">
                                            <Volume2 className="w-5 h-5" />
                                            <span className="text-xs font-bold tracking-widest uppercase">{t('ttsLabel')}</span>
                                        </div>
                                        <h4 className="text-2xl font-black mb-2 leading-tight" dangerouslySetInnerHTML={{ __html: t('ttsMessage', {name: winner.name, room: room}) }} />
                                        <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold">
                                            {t('ttsActive')}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>


            </div>
        </div>
    );
}
