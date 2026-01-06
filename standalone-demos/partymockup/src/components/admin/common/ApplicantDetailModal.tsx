import React, { useState } from 'react';
import { X, MapPin, Briefcase, Phone, Send, CreditCard, RefreshCcw, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

import { Applicant } from '../../../types';

interface ApplicantDetailModalProps {
    app: Applicant;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
    isDark?: boolean;
}

const ApplicantDetailModal: React.FC<ApplicantDetailModalProps> = ({ app, onClose, onApprove, onReject, isDark }) => {
    const [note, setNote] = useState(app.adminNote || '');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4" onClick={onClose}>
            <div
                className={`w-full max-w-sm max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-900 text-white border border-gray-700' : 'bg-white text-gray-900'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* 1. Compact Business Header */}
                <div className={`p-5 flex items-start gap-4 border-b ${isDark ? 'border-gray-800 bg-slate-800/50' : 'border-gray-100 bg-gray-50/80'}`}>
                    <img
                        src={app.profileImage}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                        alt="Profile"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-xl font-bold truncate">{app.name}</h2>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${app.gender === 'M' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
                                }`}>
                                {app.age}세
                            </span>
                        </div>
                        <div className="space-y-0.5 text-sm text-gray-500">
                            <p className="flex items-center gap-1.5 truncate"><Briefcase size={12} /> {app.job}</p>
                            <p className="flex items-center gap-1.5 truncate"><MapPin size={12} /> {app.location}</p>
                            <p className="flex items-center gap-1.5 truncate font-medium text-gray-800"><Phone size={12} /> {app.phone}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 bg-gray-200 rounded-full text-gray-500 hover:bg-gray-300">
                        <X size={16} />
                    </button>
                </div>

                {/* 2. Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">

                    {/* Status Cards Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 ${app.status === 'approved' ? 'bg-green-50 border-green-100 text-green-700' :
                            app.status === 'rejected' ? 'bg-red-50 border-red-100 text-red-700' :
                                'bg-yellow-50 border-yellow-100 text-yellow-700'
                            }`}>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-70">상태</span>
                            <span className="font-bold text-sm">
                                {app.status === 'pending' ? '승인 대기' : (app.status === 'approved' ? '승인 완료' : '반려됨')}
                            </span>
                        </div>
                        <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 ${app.isDeposited ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-400'
                            }`}>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-70">입금 여부</span>
                            <span className="font-bold text-sm">{app.isDeposited ? '입금 완료' : '미입금'}</span>
                        </div>
                    </div>

                    {/* Action Buttons (New) */}
                    <div className="grid grid-cols-4 gap-2">
                        <ActionBtn
                            icon={<Send size={16} />}
                            label="초대"
                            onClick={() => toast.info(`[${app.name}] 초대장 발송 (기능 구현 예정)`)}
                            color={isDark ? "text-blue-400 bg-blue-900/20 hover:bg-blue-900/30" : "text-blue-600 bg-blue-50 hover:bg-blue-100"}
                            isDark={isDark}
                        />
                        <ActionBtn
                            icon={<CreditCard size={16} />}
                            label="입금"
                            onClick={() => toast.info(`[${app.name}] 입금 요청 (기능 구현 예정)`)}
                            color={isDark ? "text-green-400 bg-green-900/20 hover:bg-green-900/30" : "text-green-600 bg-green-50 hover:bg-green-100"}
                            isDark={isDark}
                        />
                        <ActionBtn
                            icon={<RefreshCcw size={16} />}
                            label="환불"
                            onClick={() => toast.info(`[${app.name}] 환불 요청 (기능 구현 예정)`)}
                            color={isDark ? "text-red-400 bg-red-900/20 hover:bg-red-900/30" : "text-red-600 bg-red-50 hover:bg-red-100"}
                            isDark={isDark}
                        />
                        <ActionBtn
                            icon={<Edit2 size={16} />}
                            label="수정"
                            onClick={() => toast.info(`[${app.name}] 정보 수정 (기능 구현 예정)`)}
                            color={isDark ? "text-gray-400 bg-slate-800 hover:bg-slate-700" : "text-gray-600 bg-gray-100 hover:bg-gray-200"}
                            isDark={isDark}
                        />
                    </div>

                    {/* Admin Note Input */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 mb-1.5 block ml-1">관리자 메모</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="특이사항 입력..."
                            className={`w-full p-3 rounded-xl text-sm border resize-none ${isDark ? 'bg-slate-800 border-gray-700' : 'bg-gray-50 border-gray-200'} focus:ring-2 focus:ring-pink-500 outline-none`}
                            rows={2}
                        />
                    </div>

                    {/* Collapsible Sections */}
                    <div className="space-y-2">
                        <InfoSection title="자기소개" content={app.answers?.introduction as string} icon="💬" defaultOpen={true} />
                        <InfoSection title="이상형" content={app.answers?.idealType as string} icon="❤️" />
                        <InfoSection title="취미/관심사" content={app.answers?.hobby as string} icon="🎨" />
                    </div>
                </div>

                {/* 3. Sticky Action Bar */}
                <div className={`p-4 border-t flex gap-3 ${isDark ? 'border-gray-800 bg-slate-900' : 'border-gray-100 bg-white'}`}>
                    <button
                        onClick={onReject}
                        className="flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-500 hover:bg-gray-200"
                    >
                        거절
                    </button>
                    <button
                        onClick={onApprove}
                        className="flex-[2] py-3 rounded-xl font-bold text-white shadow-lg shadow-pink-200 bg-gradient-to-r from-pink-500 to-rose-500 active:scale-95 transition-transform"
                    >
                        {app.status === 'approved' ? '승인완료' : '승인하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface InfoSectionProps {
    title: string;
    content: string;
    icon: string;
    defaultOpen?: boolean;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, content, icon, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="rounded-xl border border-gray-100 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <span>{icon}</span>
                    <span>{title}</span>
                </div>
                <span className={`transition-transform duration-200 text-gray-400 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>
            {isOpen && (
                <div className="p-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {content}
                </div>
            )}
        </div>
    );
};

interface ActionBtnProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    color: string;
    isDark?: boolean;
}

const ActionBtn: React.FC<ActionBtnProps> = ({ icon, label, onClick, color, isDark }) => (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }} className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all border ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} group`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <span className={`text-[10px] font-bold ${isDark ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-500 group-hover:text-gray-800'}`}>{label}</span>
    </button>
);

export default ApplicantDetailModal;
