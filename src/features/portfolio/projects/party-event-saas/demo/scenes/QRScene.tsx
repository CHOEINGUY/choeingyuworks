"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Check, Camera, AlertCircle, List, Mail, MapPin, Clock, Info } from 'lucide-react';
import { useScrollTrap } from '../hooks/useScrollTrap';
import { QRCodeGenerator } from '../components/QRCodeGenerator';
import { ScanState } from '../constants';

/**
 * Bottom Sheet Refinement:
 * 1. Single Overlay Sheet: Avoids "two handles" issue by removing the static one.
 * 2. Scrolling Sync: Starts hidden, rises to 'peek' as the page scrolls down.
 * 3. Caught at Bottom: Stays in 'peek' state after closing from 'full'.
 */

type SheetState = 'hidden' | 'peek' | 'full';

const PEER_HEIGHT = 80; // px

export const QRScene = ({ onComplete }: { onComplete: () => void }) => {
    const [scanState, setScanState] = useState<ScanState>('idle');
    const [sheetState, setSheetState] = useState<SheetState>('hidden');
    const qrSectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const spacerRef = useRef<HTMLDivElement>(null);
    const sheetContentRef = useRef<HTMLDivElement>(null);

    // Apply strict scroll trap
    useScrollTrap(containerRef, true);

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        // 1. Scroll to bottom (starts rising the handle) (0.7s)
        timers.push(setTimeout(() => {
            setScanState('scrolling');
            setSheetState('peek'); // Start showing the handle as we scroll down
            if (containerRef.current) {
                containerRef.current.scrollTo({
                    top: containerRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 720));

        // 2. Expand sheet (2.2s)
        timers.push(setTimeout(() => {
            setSheetState('full');
        }, 2200));

        // 3. Scroll sheet content 33% (3.6s)
        timers.push(setTimeout(() => {
            if (sheetContentRef.current) {
                const scrollAmount = sheetContentRef.current.scrollHeight / 3;
                sheetContentRef.current.scrollTo({ top: scrollAmount, behavior: 'smooth' });
            }
        }, 3600));

        // 4. Scroll sheet content 66% (4.8s)
        timers.push(setTimeout(() => {
            if (sheetContentRef.current) {
                const scrollAmount = (sheetContentRef.current.scrollHeight / 3) * 2;
                sheetContentRef.current.scrollTo({ top: scrollAmount, behavior: 'smooth' });
            }
        }, 4800));

        // 5. Collapse sheet (6s)
        timers.push(setTimeout(() => {
            setSheetState('peek');
        }, 6000));

        // 6. Start Scanning (7s)
        timers.push(setTimeout(() => { setScanState('scanning'); }, 7000));

        // 7. Approved (9s)
        timers.push(setTimeout(() => { setScanState('approved'); }, 9000));

        // 8. Complete (10.8s)
        timers.push(setTimeout(() => { onComplete(); }, 10800));

        return () => timers.forEach(t => clearTimeout(t));
    }, [onComplete]);

    // Helper for Y transform
    const getSheetY = () => {
        if (sheetState === 'hidden') return '100%';
        if (sheetState === 'peek') return `calc(100% - ${PEER_HEIGHT}px)`;
        return '15%'; // Full
    };

    return (
        <div className="h-full w-full relative overflow-hidden bg-white text-gray-900 font-sans">
            {/* ===== SCROLLABLE PAGE CONTENT ===== */}
            <div
                ref={containerRef}
                className="h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-thin text-center"
                style={{ overscrollBehavior: 'contain', msScrollChaining: 'none' }}
            >
                {/* Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full filter blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full filter blur-[100px] translate-y-1/3 -translate-x-1/3" />
                </div>

                {/* Invitation Header */}
                <section className="min-h-full flex flex-col items-center relative z-10 px-6 pt-[20vh] pb-8 box-border text-center">
                    <header className="flex flex-col items-center animate-fade-in-down mb-12">
                        <div className="text-[10px] tracking-[0.4em] text-blue-600 font-bold mb-2 font-mono uppercase">Lindy Party Invitation</div>
                        <span className="text-2xl mb-2">🌊</span>
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-8">Lindy Party로<br />최인규님을 초대합니다</h1>
                        <div className="space-y-2 text-gray-600 text-sm leading-relaxed mb-12 text-center">
                            <p>장소 : 서울특별시 강남구 테헤란로 123, 3층</p>
                            <p>일시 : 1월 10일 (토) 저녁 7시</p>
                        </div>
                        <p className="text-gray-400 text-xs mb-8">입장 전 필독 안내가 아래에 있습니다</p>
                    </header>
                    <button className="mt-auto flex flex-col items-center gap-4 animate-bounce opacity-80">
                        <span className="text-gray-500 text-sm font-light tracking-widest uppercase opacity-80">입장 QR코드 확인하기</span>
                        <ChevronUp className="rotate-180 text-gray-400" size={20} />
                    </button>
                </section>

                {/* QR Section */}
                <section ref={qrSectionRef} className="flex flex-col items-center justify-center relative z-10 py-12 gap-8 text-center min-h-[50vh]">
                    <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 min-h-[232px] min-w-[232px] flex items-center justify-center relative overflow-hidden">
                        {scanState === 'scanning' && (
                            <motion.div
                                initial={{ top: '-20%' }}
                                animate={{ top: "120%" }}
                                transition={{ duration: 1.5, ease: "linear", repeat: Infinity, repeatDelay: 0.5 }}
                                className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent backdrop-blur-[1px] z-20"
                            />
                        )}

                        <motion.div
                            className="relative z-10"
                            animate={scanState === 'approved' ? { scale: 0.9, opacity: 0.2, filter: 'blur(4px)' } : { scale: 1, opacity: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 0.5 }}
                        >
                            <QRCodeGenerator data="b7e4cef0-fb26-4cf9-8254-ee1886896286" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 px-2 py-1 rounded border border-gray-100">
                                <span className="font-serif text-black font-bold tracking-tighter italic">Lindy</span>
                            </div>
                        </motion.div>

                        <AnimatePresence>
                            {scanState === 'approved' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-4">
                                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-green-200">
                                        <Check size={40} className="text-white" strokeWidth={4} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">입장 확인</h3>
                                    <p className="text-gray-600 text-sm mt-1 font-medium">최인규 님 환영합니다!</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="flex items-center gap-3">
                        <Camera size={16} className="text-gray-400" />
                        <span className="text-gray-500 text-xs font-light tracking-widest uppercase">입장 시 QR코드를 보여주세요</span>
                    </div>
                </section>

                {/* ===== SPACER (Makes page scrollable to the bottom) ===== */}
                <div ref={spacerRef} className="h-[120px]" />
            </div>

            {/* ===== SINGLE OVERLAY SHEET ===== */}
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: getSheetY() }}
                transition={{
                    type: "tween",
                    duration: 0.45,
                    ease: [0.33, 1, 0.68, 1]
                }}
                className="absolute inset-x-0 bottom-0 h-[85%] bg-white text-black rounded-t-[1.5rem] z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] border-t border-gray-100 flex flex-col"
            >
                <SheetHandle />
                <div
                    ref={sheetContentRef}
                    className="flex-1 overflow-y-auto scrollbar-thin scroll-smooth"
                >
                    <SheetBody />
                </div>
            </motion.div>
        </div>
    );
};

// --- Sub Components (Moved outside) ---

const SheetHandle = () => (
    <div className="px-6 pt-5 pb-3 bg-white rounded-t-[1.5rem]">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <h3 className="font-bold text-base text-center text-gray-900 flex items-center justify-center gap-2">
            <Info size={18} className="text-blue-500" />
            파티 가이드
        </h3>
        <p className="text-gray-400 text-[11px] text-center mt-1.5 tracking-tight">즐거운 파티를 위한 안내사항입니다</p>
    </div>
);

const SheetBody = () => (
    <div className="space-y-4 text-left px-5 pb-8 pt-2">
        {/* Notice Section */}
        <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100/80">
            <h4 className="text-xs font-bold text-orange-900/80 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertCircle size={14} /> Check List
            </h4>
            <ul className="space-y-2 text-gray-600 text-[11px] leading-relaxed tracking-tight">
                <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-orange-300 mt-1.5 shrink-0"/>
                    <span>현장 스냅과 공식 SNS에 업로드될 수 있어요!</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 shrink-0"/>
                    <span className="font-bold text-orange-700">18:50까지 현장 부스에 도착해주세요! (지각은 손해임)</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-orange-300 mt-1.5 shrink-0"/>
                    <span>간단한 핑거푸드만 제공되니 식사는 미리!</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-orange-300 mt-1.5 shrink-0"/>
                    <span>주차가 어려워요. 대중교통 이용을 권장합니다.</span>
                </li>
            </ul>
        </div>

        {/* Rules Section */}
        <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
            <h4 className="text-xs font-bold text-gray-800 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <List size={14} /> Party Rules
            </h4>
            <ul className="space-y-2 text-gray-500 text-[11px] leading-relaxed">
                <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-300 mt-1.5 shrink-0"/>
                    <span>1시간마다 로테이션으로 자리가 변경됩니다.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-300 mt-1.5 shrink-0"/>
                    <span>마음에 드는 분께 '익명 하트'를 보내보세요!</span>
                </li>
            </ul>
        </div>

        {/* Letter Section */}
        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/80">
            <h4 className="text-xs font-bold text-blue-900/80 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <Mail size={14} /> Message Preview
            </h4>
            <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-100 text-[11px] text-gray-600 relative">

                <p className="italic leading-relaxed">
                    <span className="font-bold text-blue-600 not-italic mr-1">To. 카리나</span>
                    이번 주말에 시간 괜찮으시면 같이 카페 가실래요?
                    <br />
                    <span className="text-gray-400 text-[10px] mt-1 block text-right">- From. 박서준 -</span>
                </p>
            </div>
        </div>

        <div className="pt-6 text-center">
            <p className="text-gray-300 text-[10px] tracking-widest uppercase">Have a Good Time</p>
        </div>
    </div>
);
