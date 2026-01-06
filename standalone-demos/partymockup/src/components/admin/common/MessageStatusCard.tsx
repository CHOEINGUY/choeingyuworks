import React from 'react';
import { Mail, CheckCircle, XCircle, Send, Check } from 'lucide-react';

interface MessageStatusCardProps {
    isSmsSent?: boolean;
    smsSentDate?: number | string;
    isInviteSent?: boolean;
    inviteSentDate?: number | string;
    isRefundSent?: boolean;
    refundSentDate?: number | string;
    onAction?: (action: string) => void;
    isDark?: boolean;
    inviteStatus?: string;
    depositStatus?: string;
    refundStatus?: string;
    onViewLogs?: () => void;
    isPremium?: boolean;
}

const MessageStatusRow = ({
    label,
    isSent,
    date,
    status,
    isDark,
    successColor = 'indigo'
}: {
    label: string,
    isSent?: boolean,
    date?: number | string,
    status?: string,
    isDark?: boolean,
    successColor?: 'indigo' | 'purple'
}) => {
    const isFailed = status === 'failed';
    const isSuccess = status === 'success' || status === 'sent' || isSent;

    const formatDisplayDate = (dateInput?: number | string | any) => {
        if (!dateInput) return null;

        // [FIX] Handle Firestore Timestamp (object with seconds)
        if (typeof dateInput === 'object' && dateInput.seconds) {
            const date = new Date(dateInput.seconds * 1000);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${month}.${day} ${hours}:${minutes}`;
        }

        const timestamp = Number(dateInput);
        if (!isNaN(timestamp) && timestamp > 0) {
            const date = new Date(timestamp);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${month}.${day} ${hours}:${minutes}`;
        }
        const date = new Date(dateInput);
        if (!isNaN(date.getTime())) {
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${month}.${day} ${hours}:${minutes}`;
        }
        return String(dateInput);
    };

    const dotColorClass = isFailed
        ? 'bg-red-500 animate-pulse'
        : (isSuccess
            ? (successColor === 'purple' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]')
            : 'bg-gray-300');

    return (
        <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${dotColorClass}`}></div>
                <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {label}
                </span>
            </div>
            <div className="text-right">
                {isFailed ? (
                    <div className="flex flex-col items-end">
                        <span className="text-[11px] font-bold text-red-500 flex items-center gap-1">
                            <XCircle size={12} /> 발송 실패
                        </span>
                        <span className={`text-[10px] tabular-nums ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatDisplayDate(date) || '-'}
                        </span>
                    </div>
                ) : isSuccess ? (
                    <div className="flex flex-col items-end">
                        <span className={`text-[11px] font-bold flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Check size={12} /> 발송 완료
                        </span>
                        <span className={`text-[10px] tabular-nums ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatDisplayDate(date) || '-'}
                        </span>
                    </div>
                ) : (
                    <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>미발송</span>
                )}
            </div>
        </div>
    );
};

const MessageStatusCard: React.FC<MessageStatusCardProps> = (props) => {
    const { isSmsSent, smsSentDate, isInviteSent, inviteSentDate, isRefundSent, refundSentDate, onAction, isDark, inviteStatus, depositStatus, refundStatus, onViewLogs, isPremium } = props;

    return (
        <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-2.5 opacity-80">
                <div className="flex items-center gap-2">
                    <Mail size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                    <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>메시지 관리</span>
                </div>
                {onViewLogs && (
                    <button
                        onClick={onViewLogs}
                        className={`text-[10px] font-bold px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                        전체 내역
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {isPremium ? (
                    // --- PREMIUM STATUS ROWS ---
                    <>
                        {/* 1. Profile Request Status */}
                        <MessageStatusRow
                            label="프로필 요청"
                            isSent={isInviteSent}
                            date={inviteSentDate}
                            status={inviteStatus}
                            isDark={isDark}
                            successColor="purple"
                        />

                        <div className={`border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`}></div>

                        {/* 2. Match Notification Status */}
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full shrink-0 bg-gray-300`}></div>
                                <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                                    매칭 알림
                                </span>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>내역 확인</span>
                            </div>
                        </div>
                    </>
                ) : (
                    // --- STANDARD STATUS ROWS (ROTATION / PARTY) ---
                    <>
                        {/* 1. Deposit Request SMS Status */}
                        <MessageStatusRow
                            label="입금 요청 문자"
                            isSent={isSmsSent}
                            date={smsSentDate}
                            status={depositStatus}
                            isDark={isDark}
                            successColor="indigo"
                        />

                        <div className={`border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`}></div>

                        {/* 2. Invitation (QR) Status */}
                        <MessageStatusRow
                            label="초대장(QR)"
                            isSent={isInviteSent}
                            date={inviteSentDate}
                            status={inviteStatus}
                            isDark={isDark}
                            successColor="indigo"
                        />

                        <div className={`border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`}></div>

                        {/* 3. Refund Request Status */}
                        <MessageStatusRow
                            label="환불 계좌 요청"
                            isSent={isRefundSent}
                            date={refundSentDate}
                            status={refundStatus}
                            isDark={isDark}
                            successColor="indigo"
                        />
                    </>
                )}
            </div>

            {/* Action Buttons Footer */}
            <div className={`mt-4 pt-3 border-t grid ${isPremium ? 'grid-cols-5' : 'grid-cols-4'} gap-2 ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                <button
                    onClick={() => onAction && onAction('deposit')}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all active:scale-95 hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 text-gray-300' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                >
                    <Mail size={16} className="text-indigo-600" />
                    <span className="text-[11px] font-semibold">입금 요청</span>
                </button>

                {isPremium ? (
                    <>
                        <button
                            onClick={() => onAction && onAction('request_profile')}
                            className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all active:scale-95 hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 text-gray-300' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                        >
                            <Send size={16} className="text-indigo-600" />
                            <span className="text-[11px] font-semibold">프로필 요청</span>
                        </button>
                        <button
                            onClick={() => onAction && onAction('match_found')}
                            className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all active:scale-95 hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 text-gray-300' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                        >
                            <CheckCircle size={16} className="text-indigo-600" />
                            <span className="text-[11px] font-semibold">매칭</span>
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => onAction && onAction('invite')}
                        className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all active:scale-95 hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 text-gray-300' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                    >
                        <Send size={16} className="text-indigo-600" />
                        <span className="text-[11px] font-semibold">초대장</span>
                    </button>
                )}

                <button
                    onClick={() => onAction && onAction('refund')}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all active:scale-95 hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 text-gray-300' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                >
                    <XCircle size={16} className="text-indigo-600" />
                    <span className="text-[11px] font-semibold">환불 요청</span>
                </button>
                <button
                    onClick={() => onAction && onAction('custom_message')}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border transition-all active:scale-95 hover:shadow-md ${isDark ? 'bg-slate-800 border-slate-600 hover:bg-slate-700 text-gray-300' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                >
                    <Mail size={16} className="text-indigo-600" />
                    <span className="text-[11px] font-semibold">직접 입력</span>
                </button>
            </div>
        </div>
    );
};

export default MessageStatusCard;
