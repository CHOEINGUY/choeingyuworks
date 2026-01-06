"use client";

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserFrame } from './components/BrowserFrame';

interface FieldManagementDemoProps {
    isEmbedded?: boolean;
    scale?: number;
    className?: string;
}

export function FieldManagementDemo({
    isEmbedded = false,
    scale,
    className
}: FieldManagementDemoProps) {
    const [sceneIndex, setSceneIndex] = useState(0);

    const currentScale = scale ?? (isEmbedded ? 0.55 : 1);

    const Content = (
        <div className={`relative w-full ${isEmbedded ? 'h-full' : 'max-w-[1200px] h-[800px]'} flex items-center justify-center`}
            style={{ transform: `scale(${currentScale})`, transformOrigin: 'center' }}>
            <AnimatePresence mode="wait">
                <BrowserFrame key="s1" width={1000} height={700} url="field.manager.system">
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-4">
                        <div className="text-6xl font-black opacity-10">DEMO</div>
                        <p className="text-sm font-medium">Field Management System Dashboard (Coming Soon)</p>
                    </div>
                </BrowserFrame>
            </AnimatePresence>
        </div>
    );

    if (isEmbedded) {
        return (
            <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className ?? ''}`}>
                {Content}
                <div className="absolute top-4 left-4 z-50 pointer-events-none">
                    <h3 className="inline-block font-bold text-gray-500/80 text-[10px] uppercase tracking-wider backdrop-blur-md bg-white/40 px-3 py-1 rounded-full border border-white/20 shadow-sm whitespace-nowrap pointer-events-auto">
                        Field Management Overview
                    </h3>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full min-h-screen flex items-center justify-center bg-[#e5e5e5] p-8 font-sans ${className ?? ''}`}>
            {Content}
        </div>
    );
}
