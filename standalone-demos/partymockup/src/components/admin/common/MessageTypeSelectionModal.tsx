import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRightLeft, Send, X, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

// Common Modal Component for selecting Message Type
// Returns schema: { type: 'invite'|'deposit'|'refund'|'custom', templateId: string|null, customContent: string|null }

export interface MessageSelectionResult {
    type: string;
    templateId?: string | null;
    customContent?: string | null;
}

interface MessageTypeSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (result: MessageSelectionResult) => void;
    selectedCount?: number;
    initialType?: string; // e.g., 'custom', 'invite', etc.
}

const MessageTypeSelectionModal: React.FC<MessageTypeSelectionModalProps> = ({ isOpen, onClose, onSelect, selectedCount = 1, initialType }) => {
    const [step, setStep] = useState<'select' | 'custom'>(initialType === 'custom' ? 'custom' : 'select'); // select | custom

    const [customText, setCustomText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleCustomSubmit = () => {
        if (isSubmitting) return;
        if (!customText.trim()) return toast.warning("메세지 내용을 입력해주세요.");

        setIsSubmitting(true);
        onSelect({
            type: 'custom',
            templateId: 'CUSTOM', // Special ID for filtering
            customContent: customText
        });

        // Reset after short delay or rely on parent closing
        setTimeout(() => {
            setCustomText('');
            setStep('select');
            setIsSubmitting(false);
            onClose();
        }, 100);
    };

    const handleTypeSelect = (typeId: string) => {
        if (isSubmitting) return;

        if (typeId === 'custom') {
            setStep('custom');
        } else {
            setIsSubmitting(true);
            onSelect({ type: typeId });
            // Close after short delay
            setTimeout(() => {
                setIsSubmitting(false);
                onClose();
            }, 100);
        }
    };

    const TYPES = [
        { id: 'invite', label: '초대장 발송', icon: Mail, color: 'text-indigo-600', bg: 'bg-indigo-50 hover:bg-indigo-100', desc: '초대 링크가 포함된 안내 메시지' },
        { id: 'deposit', label: '입금 요청', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 hover:bg-green-100', desc: '미입금자 대상 계좌 안내' },
        { id: 'refund', label: '환불 안내', icon: ArrowRightLeft, color: 'text-red-600', bg: 'bg-red-50 hover:bg-red-100', desc: '환불 완료 또는 계좌 요청' },
        { id: 'custom', label: '직접 입력', icon: MessageCircle, color: 'text-gray-600', bg: 'bg-gray-50 hover:bg-gray-100', desc: '자유롭게 메시지 내용 작성' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Send size={18} className="text-pink-500" />
                            메시지 발송 ({selectedCount}명)
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            전송할 메시지 타입을 선택해주세요.
                        </p>
                    </div>
                    <button onClick={onClose} disabled={isSubmitting} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 disabled:opacity-50">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">
                    {step === 'select' ? (
                        <div className="grid grid-cols-1 gap-3">
                            {TYPES.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => handleTypeSelect(t.id)}
                                    disabled={isSubmitting}
                                    className={`flex items-center gap-4 p-4 rounded-xl border border-transparent transition-all text-left group ${t.bg} dark:bg-slate-700/50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm ${t.color}`}>
                                        <t.icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-bold text-sm text-gray-900 dark:text-gray-200`}>{t.label}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.desc}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                                        <Send size={16} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        // Custom Message Input Step
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">메시지 내용</label>
                                <textarea
                                    value={customText}
                                    onChange={(e) => setCustomText(e.target.value)}
                                    placeholder="전송할 내용을 입력하세요..."
                                    className="w-full h-40 p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setStep('select')}
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 dark:bg-slate-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    이전
                                </button>
                                <button
                                    onClick={handleCustomSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 text-sm font-bold text-white bg-pink-500 rounded-xl hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            전송중...
                                        </>
                                    ) : (
                                        '발송하기'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageTypeSelectionModal;
