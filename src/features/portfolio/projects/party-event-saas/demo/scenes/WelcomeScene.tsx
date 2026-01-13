"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ConfettiFireworks } from '../components/ConfettiFireworks';

export const WelcomeScene = ({ onComplete }: { onComplete: () => void }) => {
    useEffect(() => {
        const t = setTimeout(onComplete, 2500);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="h-full w-full bg-black text-white font-sans relative flex flex-col items-center justify-center text-center p-6">
            <ConfettiFireworks />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-4 mb-24 z-10">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text text-transparent leading-relaxed">
                    Lindy Party에<br />오신 것을 환영합니다!
                </h1>
            </motion.div>
            <motion.button
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}
                className="w-full max-w-[280px] bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors pointer-events-none"
            >
                입장하기
            </motion.button>
        </div>
    );
};
