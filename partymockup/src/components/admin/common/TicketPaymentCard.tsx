import React from 'react';
import { Ticket, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { PaymentLog } from '../../../types/admin';

interface TicketPaymentCardProps {
    ticketLabel?: string;
    ticketPrice?: number;
    isDeposited?: boolean;
    paymentStatus: 'unpaid' | 'pending' | 'deposited' | string;
    onStatusChange?: (status: string) => void;
    refundAccountInfo?: string;
    paymentHistory?: PaymentLog[];
    isEditing?: boolean;
    onRefundAccountChange?: (value: string) => void;
    isDark?: boolean;
    ticketCount?: number; // [NEW]
    onTicketCountChange?: (count: number) => void; // [NEW]
}

const TicketPaymentCard: React.FC<TicketPaymentCardProps> = ({
    ticketLabel,
    ticketPrice,
    isDeposited,
    paymentStatus, // 'unpaid' | 'pending' | 'deposited'
    onStatusChange,
    refundAccountInfo,
    paymentHistory, // NEW: Payment logs
    isEditing, // NEW: Editing mode
    onRefundAccountChange, // NEW: Handler
    isDark,
    ticketCount, // [NEW]
    onTicketCountChange // [NEW]
}) => {
    // Derive current status for backward compatibility
    // If no paymentStatus is provided, fallback to isDeposited boolean
    const currentStatus = paymentStatus || (isDeposited ? 'deposited' : 'unpaid');

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'deposited':
                return {
                    label: '입금완료',
                    badgeClass: isDark ? 'bg-green-900/30 text-green-400 border-green-900/50' : 'bg-green-100 text-green-700 border-green-200',
                    indicatorClass: 'bg-green-500',
                    icon: <CheckCircle2 size={14} />
                };
            case 'pending':
                return {
                    label: '확인필요',
                    badgeClass: isDark ? 'bg-orange-900/30 text-orange-400 border-orange-900/50' : 'bg-orange-100 text-orange-700 border-orange-200',
                    indicatorClass: 'bg-orange-500',
                    icon: <AlertCircle size={14} />
                };
            case 'unpaid':
            default:
                return {
                    label: '미입금',
                    badgeClass: isDark ? 'bg-red-900/30 text-red-400 border-red-900/50' : 'bg-red-100 text-red-700 border-red-200',
                    indicatorClass: 'bg-red-500',
                    icon: <XCircle size={14} />
                };
        }
    };

    const config = getStatusConfig(currentStatus);

    return (
        <div className={`p-4 rounded-2xl border relative overflow-hidden transition-all ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-sm'}`}>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className={`text-sm font-bold flex items-center gap-1.5 flex-1 min-w-0 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Ticket size={14} className="shrink-0" />
                        <span className="truncate">{ticketLabel || '기본 입장권'}</span>
                    </div>
                </div>

                {/* [NEW] Ticket Counter (For Premium) */}
                {typeof ticketCount === 'number' && (
                    <div className={`flex items-center justify-between p-3 rounded-xl mb-3 border ${isDark ? 'bg-slate-950 border-slate-700' : 'bg-white border-indigo-100'}`}>
                        <span className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>보유 이용권</span>
                        <div className="flex items-center gap-3">
                            {onTicketCountChange && isEditing && (
                                <button
                                    onClick={() => onTicketCountChange(Math.max(0, ticketCount - 1))}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                                >
                                    -
                                </button>
                            )}
                            <span className={`text-lg font-bold ${ticketCount > 0 ? 'text-indigo-500' : 'text-gray-400'}`}>
                                {ticketCount}매
                            </span>
                            {onTicketCountChange && isEditing && (
                                <button
                                    onClick={() => onTicketCountChange(ticketCount + 1)}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                                >
                                    +
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>결제 금액</span>
                    <div className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {Number(ticketPrice || 0).toLocaleString()}원
                    </div>
                </div>

                {/* Status Toggle Buttons */}
                {onStatusChange && (
                    <div className={`grid grid-cols-3 gap-1 p-1 rounded-xl mb-3 ${isDark ? 'bg-slate-950/50' : 'bg-gray-100'}`}>
                        {[
                            { id: 'unpaid', label: '미입금' },
                            { id: 'pending', label: '확인필요' },
                            { id: 'deposited', label: '입금완료' }
                        ].map((option) => (
                            <button
                                key={option.id}
                                onClick={() => onStatusChange(option.id)}
                                className={`
                                    py-1.5 text-[11px] font-bold rounded-lg transition-all
                                    ${currentStatus === option.id
                                        ? (isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                                        : (isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600')
                                    }
                                `}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Deposit History Log & Status Badge */}
                <div className={`mt-2 pt-2 border-t ${isDark ? 'border-slate-700/50' : 'border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-2 opacity-70">
                        <span className="text-[10px] font-bold uppercase">입금내역</span>
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 transition-colors ${config.badgeClass}`}>
                            {config.icon}
                            {config.label}
                        </div>
                    </div>

                    {paymentHistory && paymentHistory.length > 0 ? (
                        <table className="w-full text-xs font-medium">
                            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-50/50'}`}>
                                {paymentHistory.map((log, index) => (
                                    <tr key={index} className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                        <td className="py-1 opacity-70 tracking-tight">{log.date}</td>
                                        <td className="py-1 text-right">{log.sender}</td>
                                        <td className="py-1 text-right text-blue-500 tabular-nums">
                                            {Number(log.amount).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            없음
                        </div>
                    )}
                </div>

                {/* Refund Account Info */}
                <div className={`pt-3 mt-3 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-1.5 mb-1 opacity-70">
                        <span className="text-[10px] font-bold uppercase">환불 계좌</span>
                    </div>
                    {isEditing ? (
                        <input
                            type="text"
                            value={refundAccountInfo || ''}
                            onChange={(e) => onRefundAccountChange && onRefundAccountChange(e.target.value)}
                            placeholder="환불 계좌를 입력하세요 (예: 은행 계좌번호 예금주)"
                            className={`w-full text-xs p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${isDark
                                ? 'bg-slate-900 border-slate-600 text-white placeholder-gray-600'
                                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                }`}
                        />
                    ) : (
                        <div className={`text-xs font-medium break-all ${!refundAccountInfo ? 'text-gray-400 italic' : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>
                            {refundAccountInfo || "입력된 환불 계좌 정보가 없습니다."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketPaymentCard;
