"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { InvitationView } from "./InvitationView";
import { BottomSheetHandle } from "./BottomSheetHandle";
import { WelcomeView } from "./WelcomeView";

export function QrSystemMockup() {
    const GUEST_NAME = "최인규";
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const runAnimation = async () => {
            while (isMounted) {
                // 1. Show Header (Text first, 4s)
                setShowWelcome(false);
                setScrollProgress(0);
                await new Promise(r => setTimeout(r, 4000));
                if (!isMounted) break;

                // 2. Scroll to QR (Smooth transition, 3s wait)
                setScrollProgress(1); 
                await new Promise(r => setTimeout(r, 4000));
                if (!isMounted) break;

                // 3. Transition to Welcome Page (Simulate Scan)
                setShowWelcome(true);
                await new Promise(r => setTimeout(r, 5000));
                if (!isMounted) break;
            }
        };
        runAnimation();
        return () => { isMounted = false; };
    }, []);

    return (
        <motion.div
            className="w-full aspect-[3/4] md:aspect-[16/10] bg-[#F7F5FF] rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-200/50 flex items-center justify-center relative overflow-hidden ring-1 ring-black/5"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-purple-100 rounded-full blur-[80px]" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-100 rounded-full blur-[60px]" />
            </div>

            {/* Scaler Wrapper for Mobile Content */}
            <div className="w-[160%] h-[160%] scale-[0.625] origin-center flex items-center justify-center md:w-full md:h-full md:scale-100">
                <div className="relative h-[95%] aspect-[9/18.5] bg-white rounded-[36px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] border border-slate-200/80 flex flex-col overflow-hidden z-10 font-sans">
                    <div className="h-10 bg-slate-50/90 border-b border-slate-100 flex items-center px-6 shrink-0 backdrop-blur-md z-30 rounded-t-[36px]">
                        <div className="flex-1 bg-white h-6 rounded-full border border-slate-200 flex items-center justify-center text-[10px] text-slate-500 shadow-sm relative">
                             <span className="flex items-center gap-0.5 opacity-80">
                                <span className="opacity-50">pass.partysaas.com</span>
                                <span className="opacity-30">/</span>
                                <span className="text-slate-800 font-medium">invitation</span>
                             </span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col relative overflow-hidden bg-black text-white">
                        {!showWelcome ? (
                            <>
                                <InvitationView scrollProgress={scrollProgress} guestName={GUEST_NAME} />
                                <BottomSheetHandle />
                            </>
                        ) : (
                            <WelcomeView guestName={GUEST_NAME} />
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
