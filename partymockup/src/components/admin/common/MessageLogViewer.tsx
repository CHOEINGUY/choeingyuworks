import React from 'react';
import { X, CheckCircle, XCircle, Clock, Mail } from 'lucide-react';

export interface MessageLogEntry {
    id?: string;
    sentAt: number | string;
    type: 'invite' | 'deposit' | 'refund' | 'custom' | string;
    status: 'success' | 'failed' | 'sent' | string;
    content?: string;
    error?: string;
}

interface MessageLogViewerProps {
    isOpen: boolean;
    onClose: () => void;
    logs?: MessageLogEntry[];
    userName?: string;
}

const MessageLogViewer: React.FC<MessageLogViewerProps> = ({ isOpen, onClose, logs = [], userName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Mail size={20} className="text-pink-500" />
                            메시지 발송 내역
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {userName}님에게 발송된 모든 메시지 기록입니다.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* List Body */}
                <div className="flex-1 overflow-y-auto p-0 bg-gray-50/50 dark:bg-slate-950/50">
                    {logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <Mail size={48} className="mb-3 opacity-20" />
                            <span className="text-sm">발송된 메시지가 없습니다.</span>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-slate-800">
                            {logs.map((log) => (
                                <div key={log.id || log.sentAt} className="p-5 hover:bg-white dark:hover:bg-slate-900 transition-colors bg-white dark:bg-slate-900">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border
                                                ${log.type === 'invite' ? 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800' :
                                                    log.type === 'deposit' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' :
                                                        log.type === 'refund' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800' :
                                                            'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                                }`}>
                                                {log.type === 'invite' ? '초대장' :
                                                    log.type === 'deposit' ? '입금요청' :
                                                        log.type === 'refund' ? '환불안내' : '기타'}
                                            </span>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Clock size={10} />
                                                {new Date(log.sentAt).toLocaleString()}
                                            </span>
                                        </div>
                                        {/* Status Badge */}
                                        {log.status === 'success' ? (
                                            <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                                                <CheckCircle size={12} /> 성공
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                                                <XCircle size={12} /> 실패
                                            </span>
                                        )}
                                    </div>

                                    {/* Content Preview */}
                                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 overflow-x-auto">
                                        {typeof log.content === 'object' ? JSON.stringify(log.content, null, 2) : log.content}
                                    </div>

                                    {/* Error Message if failed */}
                                    {log.status === 'failed' && log.error && (
                                        <div className="mt-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/10 p-2 rounded-lg">
                                            Error: {log.error}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 text-center">
                    <button onClick={onClose} className="w-full py-3 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageLogViewer;
