"use client";

import { X, Mail, CreditCard, Edit2 } from 'lucide-react';

interface MockMessageSelectModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (templateId: string) => void;
}

export function MockMessageSelectModal({ visible, onClose, onSelect }: MockMessageSelectModalProps) {
    if (!visible) return null;

    const templates = [
        { id: 'invite', icon: <Mail size={18} />, title: '초대장 발송', desc: '참가 확정 안내 + 초대 링크', color: 'text-indigo-600 bg-indigo-50' },
        { id: 'deposit', icon: <CreditCard size={18} />, title: '입금 요청', desc: '입금 계좌 안내 메시지', color: 'text-green-600 bg-green-50' },
        { id: 'custom', icon: <Edit2 size={18} />, title: '커스텀 메시지', desc: '직접 메시지 작성', color: 'text-gray-600 bg-gray-100' },
    ];

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="w-full max-w-xs rounded-2xl shadow-2xl overflow-hidden bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">메시지 유형 선택</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400"><X size={18} /></button>
                </div>
                <div className="p-3 space-y-2">
                    {templates.map(t => (
                        <button
                            key={t.id}
                            onClick={() => onSelect(t.id)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-gray-50 border border-gray-100 transition-colors group"
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.color}`}>
                                {t.icon}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-sm text-gray-800 group-hover:text-indigo-600">{t.title}</p>
                                <p className="text-xs text-gray-400">{t.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
