"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { default as QRCodeStylingType } from "qr-code-styling";

interface InvitationViewProps {
    scrollProgress: number;
    guestName: string;
}

export function InvitationView({ scrollProgress, guestName }: InvitationViewProps) {
    const qrRef = useRef<HTMLDivElement>(null);
    const [qrCode, setQrCode] = useState<QRCodeStylingType | null>(null);

    useEffect(() => {
        import("qr-code-styling").then((QRCodeStylingModule) => {
            const QRCodeStyling = QRCodeStylingModule.default;
            const qr = new QRCodeStyling({
                width: 180,
                height: 180,
                type: "svg",
                data: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                margin: 0,
                qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: "Q" },
                dotsOptions: { type: "rounded", color: "#2c3e50", roundSize: true },
                backgroundOptions: { round: 0, color: "#ffffff" },
                cornersSquareOptions: { type: "extra-rounded", color: "#2c3e50" },
                cornersDotOptions: { color: "#2c3e50" }
            });
            setQrCode(qr);
        });
    }, []);

    useEffect(() => {
        if (qrCode && qrRef.current) {
            qrRef.current.innerHTML = "";
            qrCode.append(qrRef.current);
        }
    }, [qrCode]);

    return (
        <motion.div 
            className="w-full absolute top-0 left-0"
            animate={{ y: `-${scrollProgress * 50}%` }}
            transition={{ duration: 3, ease: [0.65, 0, 0.35, 1] }}
        >
            {/* Section 1: Header (Strict Fidelity to Header.tsx) */}
            <div className="w-full h-[470px] flex flex-col items-center justify-start pt-16 px-6 text-center">
                <motion.span 
                    className="text-[#999] text-[10px] font-light tracking-[0.3em] uppercase mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    LINDY Party Invitation
                </motion.span>

                <h1 className="text-3xl font-bold text-white leading-tight tracking-tight mb-6 break-keep">
                    이상형을 만나는<br />
                    특별한 파티
                </h1>
                
                <div className="w-10 h-[1px] bg-white/20 mb-6"></div>
                
                <h2 className="text-lg font-medium text-white mb-4 break-keep">
                    LINDY로 {guestName}님을<br />초대합니다
                </h2>
                
                <div className="flex flex-col items-center gap-1.5 text-xs text-white/80 font-normal leading-relaxed">
                    <p>장소 : 서울 강남구</p>
                    <p>일시 : 2024.12.24 (Sat) 19:00</p>
                    <p className="mt-4 opacity-50 text-[10px]">입장 전 필독 안내가 아래에 있습니다</p>
                </div>

                {/* Scroll Down Guide */}
                <div className="mt-8 flex flex-col items-center gap-2 opacity-20 animate-pulse">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* Section 2: QR Section (Centered in Viewport) */}
            <div className="w-full h-[470px] flex flex-col items-center justify-center px-8 transition-all duration-700">
                <div className="bg-white p-2 md:p-2.5 rounded-2xl shadow-[0_30px_100px_rgba(255,255,255,0.4)] border border-white/20 flex items-center justify-center relative scale-90 md:scale-100">
                    <div className="relative w-[180px] h-[180px]">
                        <div ref={qrRef} className="w-full h-full [&>svg]:w-full [&>svg]:h-full" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-1 z-20 shadow-xl w-[48px] h-[30px] flex items-center justify-center border border-slate-100">
                             <span className="text-slate-900 font-black text-[10px] tracking-tighter">LINDY</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 opacity-60">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/60">
                            <path d="M3 7V5C3 3.89543 3.89543 3 5 3H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M17 3H19C20.1046 3 21 3.89543 21 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 17V19C21 20.1046 20.1046 21 19 21H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7 21H5C3.89543 21 3 20.1046 3 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-white/80 text-[10px] font-light tracking-widest uppercase">
                            입장 시 호스트에게 QR코드를 보여주세요
                        </span>
                </div>
            </div>
        </div>
    </motion.div>
);
}
