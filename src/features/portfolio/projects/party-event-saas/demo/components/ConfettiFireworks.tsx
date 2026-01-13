"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const ConfettiFireworks = () => {
    const colors = ['#ff9a9e', '#a1c4fd', '#f6d365', '#84fab0'];
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[100]">
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors[i % colors.length], left: '50%', top: '50%' }}
                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                    animate={{ x: (Math.random() - 0.5) * 600, y: (Math.random() - 0.5) * 600, opacity: 0, scale: Math.random() * 1.5 + 0.5, rotate: Math.random() * 360 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: Math.random() * 0.2 }}
                />
            ))}
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={`burst-${i}`}
                    className="absolute w-1 h-1 rounded-sm"
                    style={{ backgroundColor: colors[i % colors.length], left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 60}%` }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, delay: 0.5 + Math.random() * 0.5, repeat: Infinity, repeatDelay: 2 }}
                />
            ))}
        </div>
    );
};
