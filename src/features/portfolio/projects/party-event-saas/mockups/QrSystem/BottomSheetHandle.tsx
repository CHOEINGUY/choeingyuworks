"use client";

import { motion } from "framer-motion";

export function BottomSheetHandle() {
    return (
        <div className="absolute bottom-0 left-0 w-full z-40">
            <div className="w-full bg-[#111] rounded-t-[2rem] h-20 border-t border-zinc-800/50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center relative overflow-hidden group">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                
                <div className="w-12 h-1 rounded-full bg-zinc-700/50 mb-3" />
                <div className="flex flex-col items-center gap-1">
                    <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                    </motion.div>
                    <p className="text-zinc-400 text-[10px] tracking-[0.2em] font-bold uppercase">
                        입장 전 필독 안내
                    </p>
                </div>
            </div>
        </div>
    );
}
