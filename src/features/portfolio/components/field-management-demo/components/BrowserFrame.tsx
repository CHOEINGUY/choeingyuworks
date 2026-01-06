"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';

interface BrowserFrameProps {
    children: React.ReactNode;
    className?: string;
    url: string;
    width: number;
    height: number;
    isMobile?: boolean;
    hideAddressBar?: boolean; // Hide for native app simulations (SMS, etc.)
}

export const BrowserFrame = ({ children, className = "", url, width, height, hideAddressBar = false }: BrowserFrameProps) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col bg-white rounded-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.35)] border border-gray-200/80 overflow-hidden relative transform-gpu ${className}`}
            style={{ width, height, maskImage: 'linear-gradient(white, white)', WebkitMaskImage: 'linear-gradient(white, white)' }}
        >
            {!hideAddressBar && (
                <div className="h-[48px] bg-[#f9f9fb] flex items-center px-4 gap-2 border-b border-gray-200 shrink-0 relative z-20">
                    <div className="flex-1 h-8 bg-white border border-gray-200 rounded-full flex items-center px-4 gap-2 text-xs text-gray-600 shadow-sm relative">
                        <Lock size={10} className="text-green-500" /><span className="flex-1 truncate text-center text-[10px]">{url}</span><ArrowRight size={12} className="text-gray-400" />
                    </div>
                </div>
            )}
            <div className="flex-1 relative bg-white overflow-hidden" style={{ overscrollBehavior: 'contain' }}>{children}</div>
        </motion.div>
    );
};
