import React, { useState, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

interface MessageSendModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (message: string) => Promise<void>;
    recipientName: string;
    defaultMessage?: string;
}

const MessageSendModal: React.FC<MessageSendModalProps> = ({ isOpen, onClose, onSend, recipientName, defaultMessage = '' }) => {
    const [message, setMessage] = useState(defaultMessage);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMessage(defaultMessage);
        }
    }, [isOpen, defaultMessage]);

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!message.trim()) return;

        setIsSending(true);
        try {
            await onSend(message);
            onClose();
        } catch (error) {
            // Error handling is done by parent
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="px-5 py-4 border-b flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <MessageCircle size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">메시지 발송</h3>
                            <p className="text-xs text-gray-500">받는 사람: <span className="font-bold text-indigo-600">{recipientName}</span></p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">
                    <label className="block text-xs font-bold text-gray-700 mb-2">메시지 내용</label>
                    <textarea
                        className="w-full h-32 p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none outline-none leading-relaxed"
                        placeholder="전송할 메시지 내용을 입력하세요..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <div className="mt-2 text-right">
                        <span className={`text-xs ${message.length > 80 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                            {message.length}자
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        disabled={isSending}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={!message.trim() || isSending}
                        className={`px-5 py-2 text-sm font-bold text-white rounded-lg shadow-sm flex items-center gap-2 transition-all active:scale-95
                            ${!message.trim() || isSending
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
                    >
                        {isSending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                전송 중...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                전송하기
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageSendModal;
