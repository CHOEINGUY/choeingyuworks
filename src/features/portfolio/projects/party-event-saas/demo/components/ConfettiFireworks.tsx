/* eslint-disable react-hooks/purity */
"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const ConfettiFireworks = () => {
    const colors = ['#ff9a9e', '#a1c4fd', '#f6d365', '#84fab0'];

    const particles = useMemo(() => {
        return [...Array(30)].map((_, i) => ({
            id: i,
            color: colors[i % colors.length],
            x: (Math.random() - 0.5) * 600,
            y: (Math.random() - 0.5) * 600,
            scale: Math.random() * 1.5 + 0.5,
            rotate: Math.random() * 360,
            delay: Math.random() * 0.2
        }));
    }, []);

    const bursts = useMemo(() => {
        return [...Array(30)].map((_, i) => ({
            id: `burst-${i}`,
            color: colors[i % colors.length],
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            delay: 0.5 + Math.random() * 0.5
        }));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[100]">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ backgroundColor: p.color, left: '50%', top: '50%' }}
                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                    animate={{ x: p.x, y: p.y, opacity: 0, scale: p.scale, rotate: p.rotate }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: p.delay }}
                />
            ))}
            {bursts.map((b) => (
                <motion.div
                    key={b.id}
                    className="absolute w-1 h-1 rounded-sm"
                    style={{ backgroundColor: b.color, left: b.left, top: b.top }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, delay: b.delay, repeat: Infinity, repeatDelay: 2 }}
                />
            ))}
        </div>
    );
};
