import React from 'react';
import { CheckCircle, Ban, RefreshCcw } from 'lucide-react';
// import AdminActionButtons from './AdminActionButtons'; // Merged into MessageStatusCard
import TicketPaymentCard from './TicketPaymentCard';
import MessageStatusCard from './MessageStatusCard';

interface AdminManagementPanelProps {
    formData: any; // Using any for data flexibility for now
    isDark?: boolean;
    isApplicant?: boolean;
    onAction: (action: string) => void;
    memo: string;
    onMemoChange: (val: string) => void;
    onMemoBlur: () => void;
    onApprove: () => void;
    onReject: () => void;
    onCancelRejection?: () => void;
    refundAccountInfo?: string;
    onPaymentStatusChange?: (status: string) => void;
    isEditing?: boolean;
    onRefundAccountChange?: (val: string) => void;
    hideActionButtons?: boolean;
    onViewLogs?: () => void;
    isPremium?: boolean;
    onTicketCountChange?: (count: number) => void;
}

const AdminManagementPanel: React.FC<AdminManagementPanelProps> = ({
    formData,
    isDark,
    isApplicant,
    onAction,
    memo,
    onMemoChange,
    onMemoBlur,
    onApprove,
    onReject,
    onCancelRejection, // New prop
    refundAccountInfo,
    onPaymentStatusChange, // New prop
    isEditing, // [NEW]
    onRefundAccountChange, // [NEW]
    hideActionButtons = false, // [NEW] Optional prop to hide action buttons
    onViewLogs, // [NEW] Handler for viewing notification logs
    isPremium,
    onTicketCountChange // [NEW]
}) => {
    return (
        <div className="p-4 space-y-4">
            {/* 0. Status Information */}
            <div className="space-y-3">
                {/* Ticket & Payment Card */}
                <TicketPaymentCard
                    ticketLabel={formData.ticketLabel || '기본 입장권'}
                    ticketPrice={formData.ticketPrice || 0}
                    isDeposited={formData.isDeposited}
                    paymentStatus={formData.paymentStatus} // Pass status
                    onStatusChange={onPaymentStatusChange} // Pass handler
                    refundAccountInfo={refundAccountInfo}
                    paymentHistory={formData.paymentHistory}
                    isEditing={isEditing}
                    onRefundAccountChange={onRefundAccountChange}
                    ticketCount={formData.ticketCount} // [NEW] Link data
                    onTicketCountChange={onTicketCountChange} // [NEW] Link handler
                    isDark={isDark}
                />
                {/* Message Status Card */}
                <MessageStatusCard
                    isSmsSent={formData.isSmsSent}
                    smsSentDate={formData.smsSentDate}
                    depositStatus={formData.depositRequestStatus}
                    isInviteSent={formData.isInviteSent}
                    inviteSentDate={formData.inviteSentDate}
                    inviteStatus={formData.inviteStatus}
                    isRefundSent={formData.isRefundSent}
                    refundSentDate={formData.refundSentDate}
                    refundStatus={formData.refundStatus}
                    onAction={onAction} // Pass onAction to enable inline buttons
                    isDark={isDark}
                    onViewLogs={onViewLogs}
                    isPremium={isPremium}
                />
            </div>

            {/* 1. Action Buttons Grid - Removed (Merged into MessageStatusCard & Header) */}
            {/* <AdminActionButtons
                onAction={onAction}
                isDark={isDark}
                isApplicant={isApplicant}
            /> */}

            {/* 2. Admin Memo */}
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>

                <textarea
                    className={`w-full h-12 text-sm resize-none focus:outline-none bg-transparent ${isDark ? 'text-gray-300 placeholder-gray-600' : 'text-gray-700 placeholder-gray-400'}`}
                    placeholder="관리자 전용 메모를 입력하세요..."
                    value={memo || ''}
                    onChange={(e) => onMemoChange(e.target.value)}
                    onBlur={onMemoBlur}
                />
            </div>

            {/* 3. Approve/Reject Actions */}
            {!hideActionButtons && (
                <div className="flex items-center gap-2 pt-2">
                    <button
                        onClick={onApprove}
                        className={`flex-1 py-3 text-base font-bold rounded-xl text-white shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 ${formData.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'}`}
                    >
                        <CheckCircle size={18} />
                        {formData.status === 'approved' ? '승인됨' : '승인'}
                    </button>
                    {formData.status === 'rejected' ? (
                        <button
                            onClick={onCancelRejection}
                            className={`hidden md:flex flex-1 py-3 text-base font-bold rounded-xl transition-colors items-center justify-center gap-1.5 ${isDark ? 'bg-slate-800 text-gray-400 hover:bg-slate-700' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            <RefreshCcw size={18} />
                            거절 취소
                        </button>
                    ) : (
                        <button
                            onClick={onReject}
                            className={`flex-1 py-3 text-base font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 ${isDark ? 'bg-slate-800 text-gray-400 hover:bg-slate-700' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Ban size={18} />
                            거절
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminManagementPanel;
