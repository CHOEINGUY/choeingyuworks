import React, { useState, useEffect, useCallback } from 'react';
import { Undo2, CheckCircle, Ban } from 'lucide-react';

import AdminDetailHeader from './AdminDetailHeader';
import CoreStatsGrid from './CoreStatsGrid';
import AdminManagementPanel from './AdminManagementPanel';

import { toast } from 'sonner';
import ConfirmDialog from '../../common/ConfirmDialog';
import { getAge } from '../../../utils/ageUtils';
import { SYSTEM_FIELDS, DEFAULT_FORM_SCHEMA } from '../../../data/formSchema';
import { FormField } from '../../../types/form';
import MessageSendModal from './MessageSendModal';
import MessageLogViewer from './MessageLogViewer';
import { useAdminMessageActions } from '../../../hooks/useAdminMessageActions';
import { useMessageLogSync } from '../../../hooks/useMessageLogSync';
import InfoSection from './InfoSection';

import { User, Session } from '../../../types';

interface AdminProfileDetailProps {
    user: User;
    formFields?: FormField[];
    onClose: () => void;
    isApplicant?: boolean;
    onApprove?: () => void;
    onReject?: () => void;
    onDelete?: (id: string) => void;
    onSave?: (data: User) => Promise<boolean>;
    isDark?: boolean;
    onCancelParticipation?: () => void;
    onSessionMove?: () => void;
    onCancelRejection?: () => void;
    initialIsEditing?: boolean;
    session?: Session;
}

const AdminProfileDetail: React.FC<AdminProfileDetailProps> = ({ user, formFields, onClose, isApplicant, onApprove, onReject, onDelete, onSave, isDark, onCancelParticipation, onSessionMove, onCancelRejection, initialIsEditing, session }) => {
    const [isEditing, setIsEditing] = useState(initialIsEditing || false);
    const [formData, setFormData] = useState<User>({ ...user });
    const [mobileTab, setMobileTab] = useState<'profile' | 'admin'>('profile');

    // Helper: Message Logs & Sync
    const { messageLogs } = useMessageLogSync(user.id, setFormData);

    // UI Feedback
    const [dialog, setDialog] = useState<{ isOpen: boolean; title: string; message: string; onConfirm?: () => void; isDestructive?: boolean; confirmText?: string }>({ isOpen: false, title: '', message: '', onConfirm: undefined, isDestructive: false });

    // Message Custom Modal State
    const [messageModal, setMessageModal] = useState({ isOpen: false, recipientName: '', defaultMessage: '' });
    // Log Viewer Modal State
    const [logViewerOpen, setLogViewerOpen] = useState(false);

    // Custom Hook for Admin Message Actions
    const { executeMessageAction, handleSendMessage } = useAdminMessageActions();

    // ensure formData updates if user prop changes (though modal usually unmounts)
    useEffect(() => {
        if (user.id !== formData.id) {
            setFormData({ ...user });
        }
    }, [user, formData.id]);

    // Auto-calculate age when birthDate changes
    useEffect(() => {
        if (formData.birthDate && formData.birthDate.length === 8) {
            const calculated = getAge(formData.birthDate);
            const ageNum = typeof calculated === 'number' ? calculated : parseInt(calculated, 10);

            if (!isNaN(ageNum) && ageNum !== formData.age) {
                setFormData(prev => prev.age === ageNum ? prev : ({ ...prev, age: ageNum }));
            }
        }
    }, [formData.birthDate, formData.age]);

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleChange = useCallback(<K extends keyof User>(field: K, value: User[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleNestedChange = useCallback(<K extends keyof User>(parent: K, field: string, value: unknown) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...(prev[parent] as Record<string, unknown>),
                [field]: value
            }
        }));
    }, []);

    // [MODIFIED] Save Full Object (for manual edits)
    const handleSave = async () => {
        if (onSave) {
            const payload = { ...formData, id: user.id };
            if (payload.birthDate) {
                const calculatedAge = getAge(payload.birthDate);
                if (calculatedAge !== '??') {
                    const ageNum = typeof calculatedAge === 'number' ? calculatedAge : parseInt(calculatedAge, 10);
                    if (!isNaN(ageNum)) payload.age = ageNum;
                }
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
            await onSave({ id: user.id, memo: formData.memo } as User);
            toast.success("메모가 저장되었습니다.");
        }
    };

    // Action Handlers
    const handleAction = (action: string) => {
        if (action === 'delete') {
            setDialog({
                isOpen: true,
                title: '신청자 삭제',
                message: `[${user.name}]님을 정말로 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
                confirmText: '삭제하기',
                isDestructive: true,
                onConfirm: () => {
                    if (onDelete) onDelete(user.id);
                    setDialog(prev => ({ ...prev, isOpen: false }));
                    onClose();
                }
            });
            return;
        }
        if (action === 'cancel_participation') {
            setDialog({
                isOpen: true,
                title: '참가 취소',
                message: `[${user.name}]님의 참가를 정말 취소하시겠습니까?\n취소 후에는 복구할 수 없습니다.`,
                confirmText: '취소하기',
                isDestructive: true,
                onConfirm: () => {
                    if (onCancelParticipation) onCancelParticipation();
                    toast.success('참가가 취소되었습니다.');
                    setDialog(prev => ({ ...prev, isOpen: false }));
                    onClose();
                }
            });
            return;
        }
        if (action === 'custom_message') {
            setMessageModal({ isOpen: true, recipientName: formData.name || 'User', defaultMessage: '' });
            return;
        }

        const dialogMap: Record<string, { title: string; message: string; confirmText: string }> = {
            'invite': { title: '초대장 발송', message: `[${user.name}]님에게 초대장을 발송하시겠습니까?\n발송 후에는 취소할 수 없습니다.`, confirmText: '발송하기' },
            'deposit': { title: '입금 요청 발송', message: `[${user.name}]님에게 입금 요청 메시지를 보내시겠습니까?`, confirmText: '보내기' },
            'refund': { title: '환불 계좌 요청', message: `[${user.name}]님에게 정말 환불 정보를 요청하시겠습니까?`, confirmText: '발송하기' }
        };

        const config = dialogMap[action];
        if (config) {
            setDialog({
                isOpen: true,
                title: config.title,
                message: config.message,
                confirmText: config.confirmText,
                onConfirm: async () => {
                    await executeMessageAction(action, formData, { session });
                    setDialog(prev => ({ ...prev, isOpen: false }));
                }
            });
        }
    };

    // Primary Action Button (Rendered Multiple Times)
    const renderActionButtons = (isMobileFooter = false) => (
        <div className={`flex items-center gap-2 ${isMobileFooter ? 'w-full' : ''}`}>
            <button
                onClick={onApprove}
                className={`flex-1 py-3 text-base font-bold rounded-xl text-white shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 ${formData.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
                <CheckCircle size={18} />
                {formData.status === 'approved' ? '승인됨' : '승인'}
            </button>
            {formData.status === 'rejected' ? (
                <button
                    onClick={onCancelRejection}
                    className={`flex-1 py-3 text-base font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border ${isDark ? 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-700 hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Undo2 size={18} className="shrink-0" />
                    <span>거절 취소</span>
                </button>
            ) : (
                <button
                    onClick={onReject}
                    className={`flex-1 py-3 text-base font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 ${isDark ? 'bg-slate-800 text-gray-400 hover:bg-slate-700' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Ban size={18} />
                    거절
                </button>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className={`w-full md:max-w-3xl h-[85vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden transition-all ${isDark ? 'bg-slate-900 text-white border border-gray-700' : 'bg-white text-gray-900'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* --- HEADER --- */}
                <AdminDetailHeader
                    formData={formData}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(!isEditing)}
                    onSave={handleSave}
                    onDelete={() => handleAction('delete')}
                    onCancelParticipation={onCancelParticipation ? () => handleAction('cancel_participation') : undefined}
                    onSessionMove={onSessionMove}
                    onClose={onClose}
                    isDark={isDark}
                    isApplicant={isApplicant}
                    handleAnswerChange={(key, val) => handleChange(key as keyof User, val)}
                />

                {/* --- [NEW] MOBILE TAB NAVIGATION (MOVED TO TOP) --- */}
                <div className="md:hidden flex border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <button
                        onClick={() => setMobileTab('profile')}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${mobileTab === 'profile'
                            ? (isDark ? 'text-white border-pink-500' : 'text-gray-900 border-pink-500')
                            : (isDark ? 'text-gray-500 border-transparent' : 'text-gray-400 border-transparent')
                            }`}
                    >
                        프로필 정보
                    </button>
                    <button
                        onClick={() => setMobileTab('admin')}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${mobileTab === 'admin'
                            ? (isDark ? 'text-white border-pink-500' : 'text-gray-900 border-pink-500')
                            : (isDark ? 'text-gray-500 border-transparent' : 'text-gray-400 border-transparent')
                            }`}
                    >
                        관리 메뉴
                    </button>
                </div>

                {/* --- MAIN BODY --- */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                    {/* --- LEFT PANEL: PROFILE INFO --- */}
                    <div className={`flex-1 overflow-y-auto scrollbar-thin p-4 flex flex-col gap-4 w-full max-w-xl mx-auto ${mobileTab === 'admin' ? 'hidden md:flex' : 'flex'}`}>

                        <CoreStatsGrid
                            data={formData}
                            isEditing={isEditing}
                            onChange={(field, val) => handleChange(field as keyof User, val)}
                            isDark={isDark}
                        />

                        <div className={`grid grid-cols-2 gap-x-4 gap-y-3 text-sm p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <InfoItem label="종교" value={formData.religion} isDark={isDark} />
                            <InfoItem label="음주" value={formData.drinking} isDark={isDark} />
                            <InfoItem label="흡연" value={formData.smoking} isDark={isDark} />
                        </div>

                        <div className="space-y-3">
                            <InfoSection
                                title="자기소개"
                                icon={null}
                                isEditing={isEditing}
                                content={isApplicant ? formData.answers?.introduction : formData.introduction}
                                onChange={(val: string) => isApplicant ? handleNestedChange('answers', 'introduction', val) : handleChange('introduction', val)}
                                isDark={isDark}
                            />
                            <InfoSection
                                title="나의 매력"
                                icon={null}
                                isEditing={isEditing}
                                content={formData.pros}
                                onChange={(val: string) => handleChange('pros', val)}
                                isDark={isDark}
                            />
                            <InfoSection
                                title="이상형"
                                icon={null}
                                isEditing={isEditing}
                                content={
                                    isApplicant
                                        ? formData.answers?.idealType
                                        : (formData.idealType || (formData.idealTypePersonality ? (formData.idealTypePersonality + " / " + formData.idealTypeAppearance) : ''))
                                }
                                onChange={(val: string) => isApplicant ? handleNestedChange('answers', 'idealType', val) : handleChange('idealType', val)}
                                isDark={isDark}
                            />
                            <InfoSection
                                title="취미/관심사"
                                icon={null}
                                isEditing={isEditing}
                                content={
                                    isApplicant
                                        ? (formData.answers?.hobby as string)
                                        : (formData.hobby || (formData.hobbies as string))
                                }
                                onChange={(val: unknown) => isApplicant ? handleNestedChange('answers', 'hobby', val) : handleChange('hobby', val as string)}
                                isDark={isDark}
                            />
                        </div>

                        <div className="space-y-3 pt-2">
                            {(formFields && formFields.length > 0 ? formFields : DEFAULT_FORM_SCHEMA)
                                .filter(field => !(Object.values(SYSTEM_FIELDS) as string[]).includes(field.id) && !['face_photo', 'full_body_photo'].includes(field.id) && field.adminProps?.showInCard !== false)
                                .map(field => (
                                    <InfoSection
                                        key={field.id}
                                        title={
                                            (formData.fieldLogs && formData.fieldLogs[field.id]) ||
                                            field.adminProps?.cardLabel ||
                                            field.title
                                        }
                                        icon={null}
                                        content={
                                            (formData.answers?.[field.id] as string | number) || (formData[field.id] as string | number)
                                        }
                                        fieldType={field.type}
                                        isEditing={isEditing}
                                        onChange={(val: unknown) => handleNestedChange('answers', field.id, val)}
                                        isDark={isDark}
                                    />
                                ))
                            }
                        </div>
                        {/* Mobile Spacer */}
                        <div className="h-10 md:hidden"></div>
                    </div>

                    {/* --- RIGHT PANEL: MANAGEMENT --- */}
                    <div className={`${mobileTab === 'profile' ? 'hidden' : 'flex'} md:flex flex-1 w-full md:w-96 flex-col min-h-0 md:border-l ${isDark ? 'border-slate-600 bg-slate-900' : 'border-gray-300 bg-gray-50/50'}`}>
                        <div className="flex-1 overflow-y-auto scrollbar-thin">
                            <AdminManagementPanel
                                formData={formData}
                                isDark={isDark}
                                isApplicant={isApplicant}
                                onAction={(action) => {
                                    if (action === 'move' && onSessionMove) onSessionMove();
                                    else handleAction(action);
                                }}
                                memo={formData.memo || ''}
                                onMemoChange={(val) => handleChange('memo', val)}
                                onMemoBlur={handleMemoBlur}
                                onApprove={onApprove!}
                                onReject={onReject!}
                                onCancelRejection={onCancelRejection}
                                onPaymentStatusChange={async (status) => {
                                    const updates = {
                                        paymentStatus: status,
                                        isDeposited: status === 'deposited'
                                    };
                                    setFormData(prev => ({ ...prev, ...updates }));
                                    if (onSave) {
                                        const success = await onSave({ id: user.id, ...updates } as User);
                                        if (success) toast.success("입금 상태가 저장되었습니다.");
                                        else toast.error("저장 실패");
                                    }
                                }}
                                hideActionButtons={true}
                                isEditing={isEditing}
                                onRefundAccountChange={(val) => {
                                    if (isApplicant) handleNestedChange('answers', SYSTEM_FIELDS.REFUND_ACCOUNT, val);
                                    else handleChange('refundAccount', val);
                                }}
                                onViewLogs={() => setLogViewerOpen(true)}
                            />
                            {/* Mobile Spacer */}
                            <div className="h-10 md:hidden"></div>
                        </div>

                        {/* Desktop Bottom Action Bar */}
                        {!isEditing && (
                            <div className={`hidden md:block shrink-0 p-4 border-t ${isDark ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                                {renderActionButtons(false)}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- [NEW] MOBILE FIXED BOTTOM ACTION BAR --- */}
                {/* Rendered OUTSIDE the tabs, always visible on mobile if not editing */}
                {!isEditing && (
                    <div className={`md:hidden shrink-0 p-4 border-t z-10 pb-6 ${isDark ? 'border-gray-800 bg-slate-900' : 'border-gray-100 bg-white'}`}>
                        {renderActionButtons(true)}
                    </div>
                )}

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
                        const success = await handleSendMessage(formData, text, 'CUSTOM', 'custom');
                        if (success) {
                            toast.success("메세지가 전송되었습니다.");
                        }
                    }}
                />
                <MessageLogViewer
                    isOpen={logViewerOpen}
                    onClose={() => setLogViewerOpen(false)}
                    logs={messageLogs}
                    userName={user.name}
                />
            </div >
        </div >
    );
};

const InfoItem = ({ label, value, icon, isDark }: { label: string; value?: string | number | null; icon?: React.ReactNode; isDark?: boolean }) => (
    <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{label}</span>
        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-1 text-right truncate pl-2`}>
            {icon}{value || '-'}
        </span>
    </div>
);

export default AdminProfileDetail;
