import React, { useState, useEffect } from 'react';
import { Ban, CheckCircle, RefreshCcw } from 'lucide-react';

// Removed unused db import
import AdminDetailHeader from './AdminDetailHeader';
import CoreStatsGrid from './CoreStatsGrid';
import AdminManagementPanel from './AdminManagementPanel';
import { toast } from 'sonner';
import ConfirmDialog from '../../common/ConfirmDialog';
import { SYSTEM_FIELDS, DEFAULT_FORM_SCHEMA } from '../../../data/formSchema';
import { getAge } from '../../../utils/ageUtils';
import MessageSendModal from './MessageSendModal';
import MessageLogViewer from './MessageLogViewer';
import { useAdminMessageActions } from '../../../hooks/useAdminMessageActions';
import { useMessageLogSync } from '../../../hooks/useMessageLogSync';
import InfoSection from './InfoSection';
import { useProfileData } from '../../../hooks/useProfileData';
import { User, Session } from '../../../types'; // Assuming types import -- added Session
import { FormField } from '../../../types/form';

interface ApplicantProfileDetailProps {
    user: User;
    formFields?: FormField[]; // Replace with correct FormField type
    onClose: () => void;
    onApprove?: () => Promise<void>;
    onReject?: () => Promise<void>;
    onCancelRejection?: () => void;
    onDelete?: (id: string) => void;
    onCancelParticipation?: () => void;
    onSave?: (data: User) => Promise<boolean>;

    onSessionMove?: () => void;
    isDark?: boolean;
    isPremiumContext?: boolean; // [NEW] Force premium UI context
    initialIsEditing?: boolean; // [NEW] Start in edit mode
    session?: Session; // [NEW] Session Context
}

const ApplicantProfileDetail: React.FC<ApplicantProfileDetailProps> = ({ user, formFields, onClose, onApprove, onReject, onCancelRejection, onDelete, onCancelParticipation, onSave, onSessionMove, isDark, isPremiumContext, initialIsEditing = false, session }) => {
    const [isEditing, setIsEditing] = useState(initialIsEditing);

    // Custom Hook for Data Management
    const { formData, setFormData, getFieldValue, handleAnswerChange, getSystemSectionInfo } = useProfileData(user, onSave);

    // UI Feedback
    // UI Feedback removed toastState
    const [dialog, setDialog] = useState<{ isOpen: boolean; title: string; message: string; onConfirm?: () => void; isDestructive?: boolean; confirmText?: string }>({ isOpen: false, title: '', message: '', onConfirm: undefined, isDestructive: false });

    // Message Custom Modal State
    const [messageModal, setMessageModal] = useState({ isOpen: false, recipientName: '', defaultMessage: '' });
    // Log Viewer Modal State
    const [logViewerOpen, setLogViewerOpen] = useState(false);



    // Custom Hook for Admin Message Actions (Replaces useMessageSender + local logic)
    const { executeMessageAction, handleSendMessage } = useAdminMessageActions();

    // Sync prop changes
    useEffect(() => {
        setFormData({ ...user });
    }, [user, setFormData]);

    // Auto-calculate age
    useEffect(() => {
        const birthDate = formData.birthDate || (formData.answers && (formData.answers.birth_date as string));
        if (birthDate && birthDate.length === 8) {
            // Assuming getAge takes object or string based on utils.
            // If getAge expects object:
            const age = getAge({ birthDate } as any);
            // If getAge expects string: const age = getAge(birthDate); check utils.
            // Based on previous file, it seemed to return number or '??'.
            if (age && (typeof age === 'number' ? age : parseInt(age as string)) !== formData.age) {
                setFormData(prev => ({ ...prev, age: typeof age === 'number' ? age : parseInt(age as string) }));
            }
        }
    }, [formData.birthDate, formData.answers, setFormData]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);


    const handleSave = async () => {
        if (onSave) {
            // Ensure we send ID
            const payload = { ...formData, id: user.id };

            // Age Safety
            const birthDate = payload.birthDate || (payload.answers && payload.answers.birth_date);
            if (birthDate) {
                const calculatedAge = getAge({ birthDate } as any);
                if (calculatedAge && calculatedAge !== '??') payload.age = typeof calculatedAge === 'number' ? calculatedAge : parseInt(calculatedAge as string);
            }

            const success = await onSave(payload);
            if (success) {
                toast.success("저장되었습니다.");
                setIsEditing(false);
            } else {
                toast.error("저장 실패");
            }
        }
    };

    // [MODIFIED] Partial Save for Memo
    const handleMemoBlur = async () => {
        if (onSave) {
            // Send ONLY memo update
            await onSave({ id: formData.id, memo: formData.memo } as User);
            toast.success("메모가 저장되었습니다.");
        }
    };

    // --- Message Sending Logic ---
    // Replaced by handleSendMessage from useAdminMessageActions
    // Now using shared hook logic

    // Helper: Message Logs & Sync
    const logCollection = (isPremiumContext || formData.serviceType === 'PREMIUM') ? 'premium_pool' : 'users';
    const { messageLogs } = useMessageLogSync(user.id, setFormData, logCollection);

    // [REMOVED] Sync Local State with Message Logs - Handled by useMessageLogSync


    // Action Handlers
    const handleAction = (action: string) => {
        // ... (existing logic) ...
        // Determine Service Type from formData (user props)
        // const currentServiceType = formData.serviceType || (formData.applied_party ? 'PARTY' : 'ROTATION');

        // Handle local logic first
        if (action === 'delete') {
            setDialog({
                isOpen: true,
                title: '신청자 삭제',
                message: `[${formData.name}]님을 정말로 삭제하시겠습니까?`,
                confirmText: '삭제하기',
                isDestructive: true,
                onConfirm: () => { onDelete && onDelete(user.id); onClose(); }
            });
            return;
        }
        if (action === 'move') {
            if (onSessionMove) {
                onSessionMove();
            } else {
                toast.error('세션 이동 핸들러가 없습니다.');
            }
            return;
        }
        if (action === 'custom_message') {
            setMessageModal({ isOpen: true, recipientName: formData.name || 'User', defaultMessage: '' });
            return;
        }

        // Delegate Message Actions to Hook
        const dialogMap: any = {
            'invite': { title: '초대장 발송', message: `[${formData.name}]님에게 초대장을 발송하시겠습니까?`, confirmText: '발송하기' },
            'deposit': { title: '입금 요청 발송', message: `[${formData.name}]님에게 입금 요청 메시지를 보내시겠습니까?`, confirmText: '보내기' },
            'refund': { title: '환불 계좌 요청', message: `[${formData.name}]님에게 정말 환불 정보를 요청하시겠습니까?`, confirmText: '발송하기' },
            'request_profile': { title: '프로필 작성 요청', message: `[${formData.name}]님에게 프로필 작성 요청 메시지를 보내시겠습니까?`, confirmText: '요청하기' },
            'copy_premium_link': { // [NEW] Copy Link Action
                title: '프리미엄 신청 링크',
                message: '고객 전용 프로필 작성 링크를 생성하시겠습니까?',
                confirmText: '링크 생성 및 복사',
                customAction: async () => {
                    const link = `${window.location.origin}/profile/premium?userId=${formData.id}&configId=premium`;
                    try {
                        await navigator.clipboard.writeText(link);
                        toast.success('링크가 클립보드에 복사되었습니다.');
                    } catch (err) {
                        console.error('Copy failed', err);
                        toast.error('링크 복사 실패');
                    }
                }
            },
            'match_found': { title: '매칭 성공 알림', message: `[${formData.name}]님에게 매칭 성공 및 일정 조율 요청 메시지를 보내시겠습니까?`, confirmText: '보내기' }
        };

        const config = dialogMap[action];
        if (config) {
            setDialog({
                isOpen: true,
                title: config.title,
                message: config.message,
                confirmText: config.confirmText,
                onConfirm: async () => {
                    if ((config as any).customAction) {
                        await (config as any).customAction();
                    } else {
                        await executeMessageAction(action, formData as User, {
                            serviceType: (isPremiumContext || formData.serviceType === 'PREMIUM') ? 'PREMIUM' : undefined,
                            session: session // [FIX] Pass session data
                        });
                    }
                    setDialog(prev => ({ ...prev, isOpen: false }));
                }
            });
        }
    };

    // [MODIFIED] Auto-close on Approve/Reject
    const handleApproveWithClose = async () => {
        if (onApprove) {
            await onApprove();
        }
        onClose();
    };

    const handleRejectWithClose = async () => {
        if (onReject) {
            await onReject();
        }
        onClose();
    };

    // --- Renderers ---

    const [mobileTab, setMobileTab] = useState<'profile' | 'admin'>('profile');

    // 1. System Field Sections (Fixed Layout)
    const renderSystemSection = (fieldId: string, icon: any) => {
        const { schema, content, title } = getSystemSectionInfo(fieldId, (formFields as any[]) || []);

        if (!schema && !content && !isEditing) return null;

        return (
            <InfoSection
                key={fieldId}
                title={title}
                icon={icon}
                content={content}
                isEditing={isEditing}
                onChange={(val: any) => handleAnswerChange(fieldId, val)}
                isDark={isDark}
                options={schema?.options}
            />
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className={`w-full md:max-w-3xl h-[85vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden transition-all ${isDark ? 'bg-slate-900 text-white border border-gray-700' : 'bg-white text-gray-900'}`} onClick={e => e.stopPropagation()}>

                {/* --- HEADER (Unified) --- */}
                <AdminDetailHeader
                    formData={formData}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(!isEditing)}
                    onSave={handleSave}
                    onDelete={onDelete ? () => handleAction('delete') : undefined}
                    onCancelParticipation={onCancelParticipation ? () => handleAction('cancel_participation') : undefined}
                    onSessionMove={onSessionMove ? () => handleAction('move') : undefined}
                    onClose={onClose}
                    isDark={isDark}
                    isApplicant={true}
                    handleAnswerChange={handleAnswerChange}
                    onCopyProfileLink={(isPremiumContext || formData.serviceType === 'PREMIUM') ? () => handleAction('copy_premium_link') : undefined}
                />

                {/* --- MAIN BODY (SPLIT VIEW) --- */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                    {/* --- LEFT PANEL: PROFILE INFO (Scrollable) --- */}
                    <div className={`flex-1 overflow-y-auto scrollbar-thin p-4 flex flex-col gap-4 w-full max-w-xl mx-auto ${mobileTab === 'admin' ? 'hidden md:flex' : 'flex'}`}>


                        {/* Mobile Action Buttons (Approve/Reject) */}
                        {!isEditing && (
                            <div className="md:hidden grid grid-cols-2 gap-2">
                                <button
                                    onClick={handleRejectWithClose}
                                    className={`py-3 text-sm font-bold rounded-xl border flex items-center justify-center gap-2 active:scale-95 transition-transform ${isDark ? 'bg-slate-800 border-slate-700 text-gray-400' : 'bg-white border-gray-200 text-gray-600'}`}
                                >
                                    <Ban size={16} />
                                    거절
                                </button>
                                <button
                                    onClick={handleApproveWithClose}
                                    className={`py-3 text-sm font-bold rounded-xl text-white shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform ${formData.status === 'approved' ? 'bg-green-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}
                                >
                                    <CheckCircle size={18} />
                                    {formData.status === 'approved' ? '승인됨' : '참가 승인'}
                                </button>
                            </div>
                        )}

                        {/* Core Stats Grid */}
                        <CoreStatsGrid
                            data={formData}
                            isEditing={isEditing}
                            onChange={(field, val) => handleAnswerChange(field, val)}
                            isDark={isDark}
                        />

                        {/* 2. System Profile Sections */}
                        <div className="space-y-3">
                            {renderSystemSection(SYSTEM_FIELDS.INTRODUCTION, null)}
                            {renderSystemSection(SYSTEM_FIELDS.IDEAL_TYPE, null)}
                            {renderSystemSection(SYSTEM_FIELDS.HOBBY, null)}
                            {renderSystemSection(SYSTEM_FIELDS.DRINKING, null)}
                            {renderSystemSection(SYSTEM_FIELDS.SMOKING, null)}
                        </div>

                        {/* 3. Custom Fields Section (Dynamic) */}
                        <div className="space-y-3 pt-2">
                            <div className={`text-xs font-bold uppercase tracking-wider px-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                추가 정보 (Custom Fields)
                            </div>
                            {(formFields && formFields.length > 0 ? formFields : DEFAULT_FORM_SCHEMA)
                                .filter(field => !Object.values(SYSTEM_FIELDS).includes(field.id as any) && !['face_photo', 'full_body_photo'].includes(field.id) && field.adminProps?.showInCard !== false)
                                .map(field => (
                                    <InfoSection
                                        key={field.id}
                                        title={
                                            ((formData as any).fieldLogs && (formData as any).fieldLogs[field.id]) ||
                                            field.adminProps?.cardLabel ||
                                            field.title
                                        }
                                        icon={null}
                                        content={getFieldValue(field.id as any)}
                                        fieldType={field.type}
                                        isEditing={isEditing}
                                        onChange={(val: any) => handleAnswerChange(field.id as any, val)}

                                        isDark={isDark}
                                        options={field.options}
                                    />
                                ))
                            }
                        </div>
                    </div>

                    {/* --- RIGHT PANEL: MANAGEMENT (DESKTOP ONLY) --- */}
                    <div className={`${mobileTab === 'profile' ? 'hidden' : 'flex'} md:flex flex-1 w-full md:w-96 flex-col min-h-0 md:border-l ${isDark ? 'border-slate-600 bg-slate-900' : 'border-gray-300 bg-gray-50/50'}`}>
                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto scrollbar-thin">
                            <AdminManagementPanel
                                formData={formData}
                                isDark={isDark}
                                isApplicant={true}
                                onAction={handleAction}
                                memo={formData.memo || ''}
                                onMemoChange={(val) => handleAnswerChange('memo', val)}
                                onMemoBlur={handleMemoBlur}
                                onApprove={handleApproveWithClose}
                                onReject={handleRejectWithClose}
                                onCancelRejection={onCancelRejection} // Handled in footer, but okay to pass
                                refundAccountInfo={(getFieldValue(SYSTEM_FIELDS.REFUND_ACCOUNT) as string) || ''}
                                onPaymentStatusChange={async (status) => {
                                    const updates = {
                                        paymentStatus: status,
                                        isDeposited: status === 'deposited'
                                    };
                                    // 1. Update Local UI
                                    setFormData(prev => ({ ...prev, ...updates }));

                                    // 2. [FIX] Partial Save
                                    if (onSave) {
                                        const success = await onSave({ id: formData.id, ...updates } as User);
                                        if (success) {
                                            toast.success("입금 상태가 저장되었습니다.");
                                        } else {
                                            toast.error("저장 실패");
                                        }
                                    }
                                }}
                                hideActionButtons={true} // [NEW] Hide internal buttons
                                isEditing={isEditing}
                                onRefundAccountChange={(val) => handleAnswerChange(SYSTEM_FIELDS.REFUND_ACCOUNT, val)}
                                onViewLogs={() => setLogViewerOpen(true)}
                                isPremium={isPremiumContext || formData.serviceType === 'PREMIUM' || (formData as any).type === 'premium_test' || (formData as any).appliedSessionId === 'premium_1on1'}
                                onTicketCountChange={async (count) => {
                                    // 1. Update Local
                                    setFormData(prev => ({ ...prev, ticketCount: count }));
                                    // 2. Save Immediately
                                    if (onSave) {
                                        const success = await onSave({ id: formData.id, ticketCount: count } as User);
                                        if (success) toast.success("변경되었습니다.");
                                        else toast.error("변경 실패");
                                    }
                                }}
                            />
                        </div>

                        {/* [NEW] Fixed Bottom Action Bar */}
                        {!isEditing && (
                            <div className={`shrink-0 p-4 border-t flex flex-col gap-3 ${isDark ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                                {/* Premium Actions */}
                                {isPremiumContext && null}


                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleApproveWithClose}
                                        className={`flex-1 py-3 text-base font-bold rounded-xl text-white shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 ${formData.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'}`}
                                    >
                                        <CheckCircle size={18} />
                                        {formData.status === 'approved' ? '승인됨' : '참가 승인'}
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
                                            onClick={handleRejectWithClose}
                                            className={`flex-1 py-3 text-base font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 ${isDark ? 'bg-slate-800 text-gray-400 hover:bg-slate-700' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <Ban size={18} />
                                            거절
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div >

                {/* Footer for Mobile View (Tab Navigation) */}
                < div className="md:hidden flex border-t border-gray-200 dark:border-gray-700 shrink-0" >
                    <button
                        onClick={() => setMobileTab('profile')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${mobileTab === 'profile'
                            ? (isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-900')
                            : (isDark ? 'bg-slate-900 text-gray-500' : 'bg-gray-50 text-gray-400')
                            }`}
                    >
                        프로필 정보
                    </button>
                    <div className={`w-px ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
                    <button
                        onClick={() => setMobileTab('admin')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${mobileTab === 'admin'
                            ? (isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-900')
                            : (isDark ? 'bg-slate-900 text-gray-500' : 'bg-gray-50 text-gray-400')
                            }`}
                    >
                        관리 메뉴
                    </button>
                </div >

                <MessageLogViewer
                    isOpen={logViewerOpen}
                    onClose={() => setLogViewerOpen(false)}
                    logs={messageLogs}
                    userName={formData.name}
                />
                {/* Notification Components (Local) removed legacy Toast */}
                <ConfirmDialog
                    isOpen={dialog.isOpen}
                    title={dialog.title}
                    message={dialog.message}
                    confirmText={dialog.confirmText}
                    isDestructive={dialog.isDestructive}
                    onConfirm={dialog.onConfirm || (() => { })}
                    onCancel={() => setDialog({ ...dialog, isOpen: false })}
                />
                <MessageSendModal
                    isOpen={messageModal.isOpen}
                    onClose={() => setMessageModal(prev => ({ ...prev, isOpen: false }))}
                    recipientName={messageModal.recipientName}
                    defaultMessage={messageModal.defaultMessage}
                    onSend={async (text) => {
                        // Fix: Pass targetCollection to handleSendMessage
                        const targetCollection = (isPremiumContext || formData.serviceType === 'PREMIUM') ? 'premium_pool' : 'users';
                        const success = await handleSendMessage(formData as User, text, 'CUSTOM', 'custom', targetCollection);
                        if (success) {
                            toast.success("메세지가 전송되었습니다.");
                        }
                    }}
                />
            </div >
        </div >
    );
};

// --- Helper Components ---




export default ApplicantProfileDetail;
