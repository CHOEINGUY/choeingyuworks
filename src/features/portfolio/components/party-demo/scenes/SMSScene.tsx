"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Battery } from 'lucide-react';
import { LindyLogo } from '../components/LindyLogo';

export const SMSScene = ({ onComplete }: { onComplete: () => void }) => {
    const [isClicking, setIsClicking] = useState(false);
    const mounted = useRef(true);
    useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
    const wait = (ms: number) => new Promise(res => setTimeout(res, ms));
    const click = async () => { if (!mounted.current) return; setIsClicking(true); await wait(100); if (mounted.current) setIsClicking(false); };

    useEffect(() => {
        let active = true;
        const sequence = async () => {
            await wait(1500); if (!active) return; await click(); await wait(300); if (!active) return; onComplete();
        };
        sequence();
        return () => { active = false; };
    }, []);

    return (
        <div className="h-full w-full bg-white flex flex-col font-sans relative cursor-pointer text-left">
            <div className="h-12 bg-[#f2f2f7] flex justify-between items-end pb-2 px-6 text-black/90 font-semibold text-[15px]">
                <span>9:41</span>
                <div>
                    <Battery size={20} strokeWidth={2.5} className="text-black/50" />
                </div>
            </div>
            <div className="h-12 bg-[#f2f2f7] border-b border-gray-300 flex items-center justify-center relative z-10">
                <div className="flex flex-row items-center gap-1">
                    <span className="text-xs text-gray-500">To:</span>
                    <span className="text-sm font-normal text-black">Lindy</span>
                </div>
                <ChevronLeft className="absolute left-4 text-blue-500" />
            </div>
            <div className="flex-1 bg-white p-4 space-y-4">
                <div className="text-center text-[10px] text-gray-400 my-4">Today 9:41 AM</div>
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="flex flex-col items-start max-w-[85%]">
                    <div className="bg-[#e9e9eb] p-3 rounded-2xl rounded-tl-sm text-black text-sm leading-relaxed shadow-sm w-full">
                        <p className="font-bold mb-1">[Lindy Party] 파티 초대장 도착</p>
                        <p>최인규님, 신청하신 [이번 주 금요일 파티] 참가가 승인되었습니다! 🎉</p>
                        <div className="mt-3 bg-white rounded-xl overflow-hidden border border-gray-200/50 shadow-sm group transition-transform" style={{ scale: isClicking ? 0.95 : 1 }}>
                            <div className="h-32 w-full relative bg-gray-50 flex flex-col items-center justify-center gap-2">
                                <div className="scale-75 origin-center">
                                    <LindyLogo />
                                </div>
                            </div>
                            <div className="p-3 bg-[#fdfdfd]">
                                <div className="font-bold text-sm text-gray-900">Lindy Party INVITATION</div>
                                <div className="text-xs text-gray-400 mt-0.5">lindy.party</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            <div className="h-16 border-t border-gray-200 bg-white flex items-center px-4 gap-3 text-gray-400"><div className="w-8 h-8 rounded-full bg-gray-200" /><div className="flex-1 h-9 rounded-full border border-gray-300" /></div>
        </div>
    );
};
