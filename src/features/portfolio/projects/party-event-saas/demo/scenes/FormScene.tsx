"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Camera, Copy } from 'lucide-react';
import { LindyLogo } from '../components/LindyLogo';
import { DemoProgressBar } from '../components/DemoProgressBar';
import { DemoNavButtons } from '../components/DemoNavButtons'; // Keeping if needed or remove? removed usage in code so remove import.
import { DemoBottomNavigation } from '../components/DemoBottomNavigation';

export const FormScene = ({ onComplete, isActive = true }: { onComplete: () => void; isActive?: boolean }) => {
    const [step, setStep] = useState<'cover' | 'name' | 'phone' | 'schedule' | 'photo' | 'payment' | 'success'>('cover');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
    const [photoProgress, setPhotoProgress] = useState(0);
    const [isClicking, setIsClicking] = useState(false);

    // Helper to safely execute sequence
    const mounted = useRef(true);
    useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
    const wait = (ms: number) => new Promise(res => setTimeout(res, ms));
    const click = useCallback(async () => { if (!mounted.current) return; setIsClicking(true); await wait(180); if (mounted.current) setIsClicking(false); }, []);
    const typeName = useCallback(async (text: string) => { for (let i = 1; i <= text.length; i++) { if (!mounted.current) return; setName(text.slice(0, i)); await wait(70); } }, []);
    const typePhone = useCallback(async (text: string) => { for (let i = 1; i <= text.length; i++) { if (!mounted.current) return; setPhone(text.slice(0, i)); await wait(50); } }, []);

    useEffect(() => {
        if (!isActive) return; // Stop sequence if not active

        let active = true;
        const sequence = async () => {
            if (active) await wait(500); // Initial delay
            if (step === 'cover') { await wait(220); if (active) { await click(); await wait(180); if (active) setStep('name'); } }
            if (step === 'name') { await wait(480); if (active) { await click(); await typeName("최인규"); await wait(300); if (active) await click(); if (active) setStep('phone'); } }
            if (step === 'phone') { await wait(420); if (active) { await click(); await typePhone("010-1234-5678"); await wait(300); if (active) await click(); if (active) setStep('schedule'); } }
            if (step === 'schedule') { await wait(600); if (active) { await click(); setSelectedSchedule('fri'); await wait(420); if (active) await click(); if (active) setStep('photo'); } }
            if (step === 'photo') { await wait(600); if (active) { await click(); for (let i = 0; i <= 100; i += 20) { if (!active) break; setPhotoProgress(i); await wait(50); } await wait(300); if (active) await click(); if (active) setStep('payment'); } }
            if (step === 'payment') { await wait(1000); if (active) { await click(); await wait(180); if (active) setStep('success'); } }
            if (step === 'success') { await wait(1000); if (active) onComplete(); }
        };
        sequence();
        return () => { active = false; };
    }, [step, onComplete, click, typeName, typePhone, isActive]);

    const getStepIndex = () => {
        switch (step) {
            case 'name': return 1;
            case 'phone': return 2;
            case 'schedule': return 3;
            case 'photo': return 4;
            case 'payment': return 5;
            default: return 0;
        }
    };

    const activeStepIndex = getStepIndex();
    const TOTAL_STEPS = 5;
    const showNav = ['name', 'phone', 'schedule', 'photo', 'payment'].includes(step);

    const getMainButtonLabel = () => {
        if (step === 'cover') return '시작하기';
        if (step === 'payment') return '입금 완료';
        return '다음';
    };

    return (
        <div className="h-full flex flex-col bg-white font-sans relative overflow-hidden text-left">
            <AnimatePresence mode="wait">
                {step === 'cover' && (
                    <motion.div key="cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col items-center p-8 text-center pt-32 pb-28">
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="mb-6 scale-110"><LindyLogo /></div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Lindy Party<br />신청하기</h1>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                좋은 사람들과 함께하는 특별한 저녁,<br />
                                지금 바로 시작해보세요.
                            </p>
                        </div>
                        <div className="w-full h-14 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transform transition-transform" style={{ scale: isClicking ? 0.95 : 1 }}>
                            시작하기 <ChevronRight size={20} />
                        </div>
                    </motion.div>
                )}
                {step === 'name' && (
                    <motion.div key="name" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col p-6 justify-center pb-32 overflow-y-auto">
                        <div className="mb-2 text-blue-600 font-bold text-sm">Step 1</div>
                        <h2 className="text-2xl font-bold mb-8 text-gray-900">이름을 입력해주세요</h2>
                        <div className="relative">
                            <input type="text" value={name} readOnly className="w-full text-3xl font-bold border-b-2 border-gray-200 py-2 bg-transparent outline-none text-gray-900 pr-12" placeholder="이름 입력" />
                            <AnimatePresence>
                                {name.length > 0 && (
                                    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute right-0 bottom-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md"><Check size={18} strokeWidth={3} /></motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
                {step === 'phone' && (
                    <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col p-6 justify-center pb-32 overflow-y-auto">
                        <div className="mb-2 text-blue-600 font-bold text-sm">Step 2</div>
                        <h2 className="text-2xl font-bold mb-8 text-gray-900">전화번호를 입력해주세요</h2>
                        <div className="relative">
                            <input type="text" value={phone} readOnly className="w-full text-3xl font-bold border-b-2 border-gray-200 py-2 bg-transparent outline-none text-gray-900 pr-12" placeholder="010-0000-0000" />
                            <AnimatePresence>
                                {phone.length > 0 && (
                                    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute right-0 bottom-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md"><Check size={18} strokeWidth={3} /></motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
                {step === 'schedule' && (
                    <motion.div key="schedule" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col p-6 justify-center pb-32 overflow-y-auto">
                        <div className="mb-2 text-blue-600 font-bold text-sm">Step 3</div>
                        <h2 className="text-2xl font-bold mb-8 text-gray-900">참여하실 일정을 선택해주세요</h2>
                        <div className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedSchedule === 'fri' ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`} style={{ scale: isClicking && !selectedSchedule ? 0.98 : 1 }}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${selectedSchedule === 'fri' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>금</div>
                                <div><div className="font-bold text-gray-900">이번 주 금요일 8PM</div><div className="text-xs text-gray-400">강남구 테헤란로 (잔여 2석)</div></div>
                                {selectedSchedule === 'fri' && <Check className="ml-auto text-blue-500" size={20} />}
                            </div>
                        </div>
                    </motion.div>
                )}
                {step === 'photo' && (
                    <motion.div key="photo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col p-6 justify-center pb-32 overflow-y-auto">
                        <div className="mb-2 text-blue-600 font-bold text-sm">Step 4</div>
                        <h2 className="text-2xl font-bold mb-2 text-gray-900">프로필 사진을 등록해주세요</h2>
                        <div className="aspect-[3/4] w-full max-w-[240px] mx-auto bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-3 relative overflow-hidden" style={{ scale: isClicking && photoProgress === 0 ? 0.98 : 1 }}>
                            {photoProgress === 0 ? (<><div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400"><Camera size={32} /></div><span className="font-bold text-gray-500 text-sm">사진 업로드하기</span></>) : (<><img src="/profile.jpg" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${photoProgress === 100 ? 'opacity-100' : 'opacity-50 blur-sm'}`} />{photoProgress < 100 && (<div className="absolute inset-x-8 top-1/2 rounded-full h-2 bg-gray-200 overflow-hidden z-10"><div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${photoProgress}%` }} /></div>)}</>)}
                        </div>
                    </motion.div>
                )}
                {step === 'payment' && (
                    <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col p-6 justify-center pb-32 overflow-y-auto">
                        <div className="mb-2 text-blue-600 font-bold text-sm">Step 5</div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">입금을 진행해주세요</h2>
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                            <div className="space-y-1">
                                <div className="text-xs text-gray-500">은행</div>
                                <div className="font-bold text-gray-900">국민은행</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs text-gray-500">계좌번호</div>
                                <div className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                    1234-56-7890123
                                    <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-600 font-normal">복사</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs text-gray-500">예금주</div>
                                <div className="font-bold text-gray-900">최인규 (Lindy)</div>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">입금액</span>
                                    <span className="text-xl font-bold text-blue-600">30,000원</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-400 text-center">
                            입금 확인 후 승인이 완료됩니다.
                        </div>
                    </motion.div>
                )}
                {step === 'success' && (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 text-center">
                        <div className="mb-8"><LindyLogo /></div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">신청 완료!</h2>
                        <p className="text-gray-500">잠시 후 관리자 승인이 진행됩니다.</p>
                    </motion.div>
                )}
            </AnimatePresence>
            {showNav && (
                <DemoBottomNavigation
                    currentStepIndex={activeStepIndex}
                    totalSteps={TOTAL_STEPS}
                    stepName={step}
                    onNext={() => { }}
                    onPrev={() => { }}
                    mainButtonLabel={getMainButtonLabel()}
                    isClicking={isClicking && (step !== 'schedule' || !!selectedSchedule) && (step !== 'photo' || photoProgress === 100) && (step !== 'phone' || phone.length > 5)}
                    isNextDisabled={(step === 'name' && name.length === 0) || (step === 'phone' && phone.length === 0)}
                    showMainButton={!['name', 'phone', 'schedule'].includes(step)}
                />
            )}
        </div>
    );
};
