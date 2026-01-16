"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Send } from 'lucide-react';
import { LindyLogo } from '../components/LindyLogo';
import { INITIAL_APPLICANTS, NEW_APPLICANT } from '../constants';

export const AdminScene = ({ onComplete }: { onComplete: () => void }) => {
    const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
    const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
    const [showNewRow, setShowNewRow] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const [isApproved, setIsApproved] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const mounted = useRef(true);
    useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

    const wait = (ms: number) => new Promise(res => setTimeout(res, ms));
    const click = useCallback(async () => { if (!mounted.current) return; setIsClicking(true); await wait(100); if (mounted.current) setIsClicking(false); }, []);

    useEffect(() => {
        let active = true;
        const scenario = async () => {
            await wait(600); if (!active) return;
            setNotification("🔔 새로운 참가 신청이 도착했습니다!");
            await wait(1440); if (!active) return;
            setNotification(null);
            setShowNewRow(true);
            await wait(720); if (!active) return; await click(); setSelectedApplicant(NEW_APPLICANT);
            await wait(1440); if (!active) return; await click(); setIsApproved(true);
            await wait(1200); if (!active) return; await click();
            const toast = document.createElement('div');
            toast.className = 'absolute top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium z-[60] animate-fade-in-down transition-opacity';
            toast.innerText = "초대장이 발송되었습니다.";
            document.querySelector('.admin-scene-container')?.appendChild(toast);
            await wait(1800); if (!active) return; onComplete();
        };
        scenario();
        return () => { active = false; };
    }, [onComplete, click]);

    return (
        <div className="h-full w-full bg-gray-50 flex flex-col font-sans admin-scene-container relative">
            <AnimatePresence>
                {notification && (
                    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="absolute top-6 left-1/2 -translate-x-1/2 z-[70] bg-black text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3"><Bell className="text-yellow-400 animate-bounce" size={20} /><span className="font-bold text-sm tracking-wide">{notification}</span></motion.div>
                )}
                {selectedApplicant && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90%]">

                            {/* Header */}
                            <div className="p-6 pb-4 border-b border-gray-100 flex items-start gap-5">
                                <img src="/profile.jpg" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md bg-gray-100" />
                                <div className="flex-1 min-w-0 pt-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedApplicant.name}</h2>
                                        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {isApproved ? '승인됨 (Approved)' : '승인 대기 (Pending)'}
                                        </div>
                                    </div>
                                    <div className="text-gray-500 font-medium text-sm flex items-center gap-2 mb-3">
                                        <span>{selectedApplicant.age}세</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span>{selectedApplicant.gender === 'M' ? '남성' : '여성'}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span>{selectedApplicant.job}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedApplicant.tags?.map((tag: string) => (
                                            <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium border border-gray-200">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Left: Basic Details */}
                                    <div className="space-y-5">
                                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">기본 정보</h3>
                                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                                                <div>
                                                    <div className="text-gray-500 text-xs mb-0.5">거주지</div>
                                                    <div className="font-medium text-gray-900">{selectedApplicant.location || '-'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500 text-xs mb-0.5">MBTI</div>
                                                    <div className="font-medium text-gray-900">{selectedApplicant.mbti || '-'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500 text-xs mb-0.5">음주</div>
                                                    <div className="font-medium text-gray-900">{selectedApplicant.drinking || '-'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500 text-xs mb-0.5">흡연</div>
                                                    <div className="font-medium text-gray-900">{selectedApplicant.smoking || '-'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">한줄 소개</h3>
                                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selectedApplicant.intro || '-'}</p>
                                        </div>
                                    </div>

                                    {/* Right: Management & Actions */}
                                    <div className="space-y-4">
                                        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-bold text-blue-900">입금 상태</span>
                                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">확인됨</span>
                                            </div>
                                            <div className="text-xs text-blue-600/80">
                                                신한은행 110-333-444444 (30,000원)<br />
                                                2024.01.03 14:30 입금 확인 완료
                                            </div>
                                        </div>

                                        {/* Action Buttons Area */}
                                        <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm space-y-3">
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">관리자 액션</div>
                                            {!isApproved ? (
                                                <button
                                                    className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all flex items-center justify-center gap-2 active:scale-95"
                                                    style={{ scale: isClicking ? 0.98 : 1 }}
                                                >
                                                    <span className="text-lg">✨</span> 승인 처리하기
                                                </button>
                                            ) : (
                                                <button
                                                    className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                                                    style={{ scale: isClicking ? 0.98 : 1 }}
                                                >
                                                    <span>초대장 문자 발송</span>
                                                    <Send size={16} />
                                                </button>
                                            )}
                                            <button className="w-full py-2.5 rounded-xl font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors text-sm">
                                                거절 / 환불 처리
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0"><LindyLogo className="scale-75 origin-left" /><div className="flex items-center gap-4"><span className="text-sm text-gray-500">관리자님 환영합니다</span><div className="w-8 h-8 bg-gray-200 rounded-full" /></div></header>
            <main className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 text-left"><div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"><table className="w-full text-sm text-left"><thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium"><tr><th className="px-6 py-3">이름 / 나이</th><th className="px-6 py-3">직업</th><th className="px-6 py-3">상태</th></tr></thead><tbody className="divide-y divide-gray-100">{showNewRow && (<motion.tr initial={{ backgroundColor: "#f0f9ff" }} animate={{ backgroundColor: "#ffffff" }} className="hover:bg-gray-50 transition-colors"><td className="px-6 py-4 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs relative">최</div><div><div className="font-bold text-gray-900">최인규</div></div></td><td className="px-6 py-4 text-gray-600">개발자</td><td className="px-6 py-4">{isApproved ? (<span className="px-2 py-1 rounded-md bg-green-100 text-green-700 font-bold text-xs">승인 완료</span>) : (<span className="px-2 py-1 rounded-md bg-yellow-100 text-yellow-700 font-bold text-xs">승인 대기</span>)}</td></motion.tr>)}{applicants.map(app => (<tr key={app.id} className="hover:bg-gray-50"><td className="px-6 py-4 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-xs">{app.name[0]}</div><div><div className="font-bold text-gray-900">{app.name}</div></div></td><td className="px-6 py-4 text-gray-600">직장인</td><td className="px-6 py-4"><span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 font-bold text-xs">승인 완료</span></td></tr>))}</tbody></table></div></main>
        </div>
    );
};
