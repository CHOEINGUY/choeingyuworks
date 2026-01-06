"use client";

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FormScene } from './scenes/FormScene';
import { AdminScene } from './scenes/AdminScene';
import { SMSScene } from './scenes/SMSScene';
import { QRScene } from './scenes/QRScene';
import { WelcomeScene } from './scenes/WelcomeScene';
import { BrowserFrame } from './components/BrowserFrame';

interface PartySolutionDemoProps {
    isEmbedded?: boolean;
    scale?: number;
    className?: string;
}

export function PartySolutionDemo({
    isEmbedded = false,
    scale,
    className
}: PartySolutionDemoProps) {
    const [sceneIndex, setSceneIndex] = useState(0);
    const nextScene = () => setSceneIndex(prev => (prev + 1) % 5);

    const currentScale = scale ?? (isEmbedded ? 0.55 : 1);

    const Content = (
        <div className={`relative w-full ${isEmbedded ? 'h-full' : 'max-w-[1200px] h-[800px]'} flex items-center justify-center`}
            style={{ transform: `scale(${currentScale})`, transformOrigin: 'center' }}>
            <AnimatePresence mode="wait">
                {sceneIndex === 0 && (<BrowserFrame key="s1" width={400} height={750} url="lindy.party/apply" isMobile><FormScene onComplete={nextScene} /></BrowserFrame>)}
                {sceneIndex === 1 && (<BrowserFrame key="s2" width={1000} height={700} url="admin.lindy.party"><AdminScene onComplete={nextScene} /></BrowserFrame>)}
                {sceneIndex === 2 && (<BrowserFrame key="s3" width={400} height={750} url="Messages" isMobile hideAddressBar><SMSScene onComplete={nextScene} /></BrowserFrame>)}
                {sceneIndex === 3 && (<BrowserFrame key="s4" width={400} height={750} url="lindy.party/invitation" isMobile><QRScene onComplete={nextScene} /></BrowserFrame>)}
                {sceneIndex === 4 && (<BrowserFrame key="s5" width={400} height={750} url="lindy.party/welcome" isMobile><WelcomeScene onComplete={nextScene} /></BrowserFrame>)}
            </AnimatePresence>
        </div>
    );

    if (isEmbedded) {
        return (
            <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className ?? ''}`}>
                {Content}
                <div className="absolute top-4 left-4 z-50 pointer-events-none">
                    <h3 className="inline-block font-bold text-gray-500/80 text-[10px] uppercase tracking-wider backdrop-blur-md bg-white/40 px-3 py-1 rounded-full border border-white/20 shadow-sm whitespace-nowrap pointer-events-auto">
                        {sceneIndex === 0 && "Step 1: 신청서 작성"}
                        {sceneIndex === 1 && "Step 2: 관리자 승인"}
                        {sceneIndex === 2 && "Step 3: 문자 발송"}
                        {sceneIndex === 3 && "Step 4: QR 체크인"}
                        {sceneIndex === 4 && "Step 5: 환영 메시지"}
                    </h3>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full min-h-screen flex items-center justify-center bg-[#e5e5e5] p-8 font-sans ${className ?? ''}`}>
            {Content}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-center space-y-3 z-50">
                <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider backdrop-blur-md bg-white/50 px-6 py-2 rounded-full border border-white/20 shadow-sm">
                    {sceneIndex === 0 && "Step 1: User Application"}
                    {sceneIndex === 1 && "Step 2: Admin Approval"}
                    {sceneIndex === 2 && "Step 3: Invitation SMS"}
                    {sceneIndex === 3 && "Step 4: QR Check-in"}
                    {sceneIndex === 4 && "Step 5: Welcome"}
                </h3>
            </div>
        </div>
    );
}
