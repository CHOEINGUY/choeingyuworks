"use client";

import { useState } from 'react';
import { X, Briefcase, MapPin, Phone, Send, CreditCard, RefreshCcw, Edit2, Ban, CheckCircle2 } from 'lucide-react';
import type { MockGuest } from './types';

// Helper: Collapsible Info Section
function InfoSection({ title, content, icon, defaultOpen = false }: { title: string; content: string; icon: string; defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="rounded-xl border border-gray-100 overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <span>{icon}</span>
                    <span>{title}</span>
                </div>
                <span className={`transition-transform duration-200 text-gray-400 text-xs ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && (
                <div className="p-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{content}</div>
            )}
        </div>
    );
}

// Helper: Action Button
function ActionBtn({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
    return (
        <button className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all border bg-gray-50 border-gray-200 hover:bg-gray-100 group">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>{icon}</div>
            <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-800">{label}</span>
        </button>
    );
}

interface MockDetailModalProps {
    guest: MockGuest | null;
    onClose: () => void;
    onApprove?: () => void;
}

export function MockDetailModal({ guest, onClose, onApprove }: MockDetailModalProps) {
    const [mobileTab, setMobileTab] = useState<'profile' | 'admin'>('profile');
    if (!guest) return null;

    const isFemale = guest.gender === 'F';
    const job = isFemale ? "UI/UX 디자이너" : "서비스 기획자";
    const location = isFemale ? "서울시 강남구" : "경기도 성남시";
    const isApproved = guest.status === 'approved';

    const handleApprove = () => {
        if (onApprove) onApprove();
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-2 md:p-4">
            <div className="w-full max-w-2xl max-h-[90%] flex flex-col rounded-3xl shadow-2xl overflow-hidden bg-white text-gray-900" onClick={(e) => e.stopPropagation()}>
                {/* HEADER */}
                <div className="p-4 flex items-start gap-3 border-b border-gray-100 bg-gray-50/80 shrink-0">
                    <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-2xl shadow-sm border-2 border-white shrink-0">
                        {isFemale ? '👩🏻' : '👨🏻'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h2 className="text-lg font-bold truncate text-slate-900">{guest.name}</h2>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${!isFemale ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>{guest.age}세</span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Briefcase size={10} /> {job}</span>
                            <span className="flex items-center gap-1"><MapPin size={10} /> {location}</span>
                            <span className="flex items-center gap-1 font-medium text-gray-700"><Phone size={10} /> {guest.phone}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 bg-gray-200 rounded-full text-gray-500 hover:bg-gray-300 transition-colors shrink-0"><X size={16} /></button>
                </div>

                {/* SPLIT BODY (50:50) */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
                    {/* LEFT: Profile Info */}
                    <div className={`flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3 ${mobileTab === 'admin' ? 'hidden md:block' : 'block'}`}>
                        <div className="grid grid-cols-2 gap-2">
                            <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-0.5 ${isApproved ? 'bg-green-50 border-green-100 text-green-700' : 'bg-yellow-50 border-yellow-100 text-yellow-700'}`}>
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">상태</span>
                                <span className="font-bold text-sm">{isApproved ? '승인 완료' : '승인 대기'}</span>
                            </div>
                            <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-0.5 ${guest.inviteSent ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">초대장</span>
                                <span className="font-bold text-sm">{guest.inviteSent ? '발송 완료' : '미발송'}</span>
                            </div>
                        </div>
                        <InfoSection title="자기소개" content="안녕하세요! 새로운 사람들과 즐겁게 대화하고 싶어서 신청했습니다. 잘 부탁드립니다 :)" icon="💬" defaultOpen={true} />
                        <InfoSection title="이상형" content="대화가 잘 통하고 유머 감각이 있는 분이 좋아요." icon="❤️" />
                        <InfoSection title="취미/관심사" content="맛집 탐방, 전시회 관람, 넷플릭스 보기" icon="🎨" />
                    </div>

                    {/* RIGHT: Management Menu (50:50 with flex-1) */}
                    <div className={`flex-1 flex flex-col min-h-0 border-t md:border-t-0 md:border-l border-gray-200 bg-gray-50/50 ${mobileTab === 'profile' ? 'hidden md:flex' : 'flex'}`}>
                        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">빠른 액션</p>
                                <div className="grid grid-cols-4 gap-2">
                                    <ActionBtn icon={<Send size={14} />} label="초대" color="text-blue-600 bg-blue-50" />
                                    <ActionBtn icon={<CreditCard size={14} />} label="입금" color="text-green-600 bg-green-50" />
                                    <ActionBtn icon={<RefreshCcw size={14} />} label="환불" color="text-red-600 bg-red-50" />
                                    <ActionBtn icon={<Edit2 size={14} />} label="수정" color="text-gray-600 bg-gray-100" />
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">관리자 메모</p>
                                <textarea disabled placeholder="특이사항 입력..." className="w-full p-3 rounded-xl text-xs border resize-none bg-white border-gray-200 outline-none" rows={4} />
                            </div>
                        </div>
                        {/* Fixed Action Buttons */}
                        <div className="p-4 border-t border-gray-200 bg-white flex gap-2 shrink-0">
                            <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center gap-1.5">
                                <Ban size={14} /> 거절
                            </button>
                            <button onClick={handleApprove} className={`flex-1 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5 ${isApproved ? 'shadow-green-200 bg-green-500' : 'shadow-pink-200 bg-gradient-to-r from-pink-500 to-rose-500'}`}>
                                <CheckCircle2 size={14} /> {isApproved ? '승인됨' : '승인하기'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Tab Footer */}
                <div className="md:hidden flex border-t border-gray-200 shrink-0">
                    <button onClick={() => setMobileTab('profile')} className={`flex-1 py-3 text-xs font-bold ${mobileTab === 'profile' ? 'bg-white text-gray-900' : 'bg-gray-50 text-gray-400'}`}>프로필 정보</button>
                    <div className="w-px bg-gray-200" />
                    <button onClick={() => setMobileTab('admin')} className={`flex-1 py-3 text-xs font-bold ${mobileTab === 'admin' ? 'bg-white text-gray-900' : 'bg-gray-50 text-gray-400'}`}>관리 메뉴</button>
                </div>
            </div>
        </div>
    );
}
