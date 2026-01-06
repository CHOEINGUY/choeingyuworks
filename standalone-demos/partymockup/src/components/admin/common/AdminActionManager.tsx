import React, { useState } from 'react';
import { Session } from '../../../types';
import SmartActionDock from './SmartActionDock';
import MessageTypeSelectionModal from './MessageTypeSelectionModal';
import ConfirmDialog from '../../common/ConfirmDialog';
import { toast } from 'sonner';
import ApplicantProfileDetail from './ApplicantProfileDetail';
import AdminProfileDetail from './AdminProfileDetail';
import { useAdminMessageActions } from '../../../hooks/useAdminMessageActions';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { User } from '../../../types';
import { FormField } from '../../../types/form';

interface AdminActionManagerProps {
    type: 'guest' | 'applicant';
    selectedIds: Set<string>;
    data: User[];
    actions: {
        approveApplicant?: (id: string) => Promise<boolean>;
        rejectApplicant?: (id: string) => Promise<boolean>;
        deleteApplicant?: (id: string) => Promise<boolean>;
        updateUser?: (id: string, updates: Partial<User>) => Promise<boolean>;
        cancelUserParticipation?: (id: string) => Promise<boolean>;
        [key: string]: any;
    };
    session?: Session | null;
    isDark: boolean;
    onSelectionChange?: (ids: Set<string>) => void;
    // Optional overrides
    hiddenActions?: string[];
    columnSettings?: Record<string, any>;
    formFields?: FormField[];
    isVisible?: boolean;
    layout?: 'sidebar' | 'bottom';
    onDockAction?: (action: string) => void; // [NEW] Bubble up actions
    activeActions?: string[]; // [NEW]
}

const AdminActionManager: React.FC<AdminActionManagerProps> = ({
    type,
    selectedIds,
    data,
    actions,
    session,
    isDark,
    onSelectionChange,
    hiddenActions = [],
    columnSettings,
    formFields = [],
    isVisible = true,
    layout = 'sidebar',
    onDockAction, // [NEW]
    activeActions = [] // [NEW]
}) => {
    // UI State
    const [dialog, setDialog] = useState<{ isOpen: boolean; title: string; message: string; onConfirm?: () => Promise<void> | void; isDestructive?: boolean; confirmText?: string }>({ isOpen: false, title: '', message: '', onConfirm: undefined, isDestructive: false });

    // Message Modal State
    const [messageModal, setMessageModal] = useState<{
        isOpen: boolean;
        selectedCount: number;
        targetUsers: User[];
        mode: 'bulk' | 'single';
        defaultType?: string;
    }>({
        isOpen: false,
        selectedCount: 0,
        targetUsers: [],
        mode: 'bulk'
    });

    // Create/Edit Modal State (for Manual Create)
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [newUser, setNewUser] = useState<Partial<User> | null>(null);

    // Hooks
    const { executeMessageAction, handleSendMessage } = useAdminMessageActions();

    // --- Helpers ---
    const getTargetUsers = () => {
        return data.filter(item => selectedIds.has(item.id));
    };

    // --- Action Handlers ---

    const handleAction = async (actionType: string) => {
        // [NEW] Bubble up action first
        if (onDockAction) {
            onDockAction(actionType);
        }

        // 1. Manual Creation (No selection needed)
        if (actionType === 'create_manual') {
            const initialData: Partial<User> = {
                id: 'new_user_' + Date.now(),
                name: '',
                age: 20,
                gender: 'M',
                phone: '',
                status: 'approved',
                sessionId: session?.id || '',
                appliedSessionId: session?.id || '',
                createdAt: new Date().toISOString(),
            };
            setNewUser(initialData);
            setCreateModalOpen(true);
            return;
        }

        // 2. Global Message (No selection needed for "All")
        if (actionType === 'send_invites') {
            const targets = type === 'applicant'
                ? data.filter((d: User) => d.status === 'approved')
                : data;

            if (targets.length === 0) {
                toast.error("보낼 대상이 없습니다.");
                return;
            }

            setMessageModal({
                isOpen: true,
                selectedCount: targets.length,
                targetUsers: targets,
                mode: 'bulk',
                defaultType: 'invite'
            });
            return;
        }

        // 3. Selection Required Actions
        if (selectedIds.size === 0) {
            return;
        }

        const targetUsers = getTargetUsers();
        const count = targetUsers.length;

        switch (actionType) {
            case 'message':
                setMessageModal({
                    isOpen: true,
                    selectedCount: count,
                    targetUsers: targetUsers,
                    mode: 'bulk'
                });
                break;

            case 'approve':
                setDialog({
                    isOpen: true,
                    title: '일괄 승인',
                    message: `선택한 ${count}명을 '승인' 처리하시겠습니까?`,
                    confirmText: '승인하기',
                    onConfirm: async () => {
                        let success = 0;
                        for (const u of targetUsers) {
                            if (actions?.approveApplicant) await actions.approveApplicant(u.id);
                            else if (actions?.updateUser) await actions.updateUser(u.id, { status: 'approved' });
                            success++;
                        }
                        toast.success(`${success}명 승인 완료`);
                        onSelectionChange?.(new Set());
                        setDialog((prev: any) => ({ ...prev, isOpen: false }));
                    }
                });
                break;

            case 'reject':
                setDialog({
                    isOpen: true,
                    title: '일괄 거절',
                    message: `선택한 ${count}명을 '거절' 처리하시겠습니까?`,
                    confirmText: '거절하기',
                    isDestructive: true,
                    onConfirm: async () => {
                        let success = 0;
                        for (const u of targetUsers) {
                            if (actions?.rejectApplicant) await actions.rejectApplicant(u.id);
                            success++;
                        }
                        toast.success(`${success}명 거절 완료`);
                        onSelectionChange?.(new Set());
                        setDialog((prev: any) => ({ ...prev, isOpen: false }));
                    }
                });
                break;

            case 'check_in':
                toast.info("QR 체크인을 이용해주세요.");
                break;

            case 'move':
                toast.info("이동 기능 준비중입니다.");
                break;

            case 'delete':
                setDialog({
                    isOpen: true,
                    title: '일괄 삭제',
                    message: `선택한 ${count}명을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
                    confirmText: '삭제하기',
                    isDestructive: true,
                    onConfirm: async () => {
                        let success = 0;
                        for (const u of targetUsers) {
                            try {
                                if (type === 'applicant') {
                                    if (actions?.deleteApplicant) await actions.deleteApplicant(u.id);
                                } else {
                                    if (actions?.cancelUserParticipation) await actions.cancelUserParticipation(u.id);
                                }
                                success++;
                            } catch (e) {
                                console.error(`Failed to delete ${u.id}:`, e);
                            }
                        }
                        toast.success(`${success}명 삭제 완료`);
                        onSelectionChange?.(new Set());
                        setDialog((prev: any) => ({ ...prev, isOpen: false }));
                    }
                });
                break;
        }
    };

    // Message Send Handler
    const handleBulkSendConfirm = async (args: any) => {
        const { type: msgType = 'custom', customContent } = args || {};
        const { targetUsers } = messageModal;

        toast.info(`${targetUsers.length}명에게 전송 시작...`);
        setMessageModal((prev: any) => ({ ...prev, isOpen: false }));

        let success = 0;
        let fail = 0;

        console.group("🚀 Bulk Send Started");
        console.log("Type:", msgType);
        console.log("Targets:", targetUsers.length);

        for (const user of targetUsers) {
            try {
                let isSent = false;

                if (msgType === 'custom') {
                    isSent = await handleSendMessage(
                        user,
                        customContent || '',
                        'CUSTOM_BULK',
                        'custom',
                        'users'
                    );
                } else {
                    isSent = await executeMessageAction(msgType, user, {
                        session: session
                    });
                }

                if (isSent) success++;
                else fail++;
            } catch (e) {
                console.error(`Failed for ${user.name}:`, e);
                fail++;
            }
        }
        console.groupEnd();

        if (fail > 0) {
            toast.warning(`전송 완료: 성공 ${success}, 실패 ${fail}`);
        } else {
            toast.success(`전송 완료: 성공 ${success}`);
        }
        onSelectionChange?.(new Set());
    };

    // Create User Handler
    const handleCreateSave = async (data: any) => {
        try {
            const { id, ...rest } = data;

            // Add metadata
            const payload: Record<string, any> = {
                ...rest,
                createdAt: serverTimestamp(),
                status: rest.status || 'approved',
            };

            // [FIX] Always set both IDs for synchronization
            if (session?.id) {
                payload.sessionId = payload.sessionId || session.id;
                payload.appliedSessionId = payload.appliedSessionId || session.id;
            }

            // [NEW] Robust cleaner to remove ALL undefined values from payload
            const cleanPayload = Object.entries(payload).reduce((acc: any, [key, value]) => {
                if (value !== undefined) acc[key] = value;
                return acc;
            }, {});

            await addDoc(collection(db, 'users'), cleanPayload);

            toast.success("추가되었습니다.");
            setCreateModalOpen(false);
            setNewUser(null);
            return true;
        } catch (e) {
            console.error(e);
            toast.error("추가 실패");
            return false;
        }
    };

    return (
        <>
            <SmartActionDock
                selectedCount={selectedIds.size}
                onAction={handleAction}
                type={type}
                isDark={isDark}
                hiddenActions={hiddenActions}
                columnSettings={columnSettings}
                isVisible={isVisible}
                layout={layout}
                activeActions={activeActions}
            />

            {/* Message Modal */}
            <MessageTypeSelectionModal
                isOpen={messageModal.isOpen}
                onClose={() => setMessageModal((prev: any) => ({ ...prev, isOpen: false }))}
                onSelect={handleBulkSendConfirm}
                selectedCount={messageModal.selectedCount}
                initialType={messageModal.defaultType}
            />

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={dialog.isOpen}
                title={dialog.title}
                message={dialog.message}
                confirmText={dialog.confirmText || '확인'}
                isDestructive={dialog.isDestructive}
                onConfirm={dialog.onConfirm || (() => { })}
                onCancel={() => setDialog((prev: any) => ({ ...prev, isOpen: false }))}
            />

            {/* Create Modal */}
            {createModalOpen && newUser && (
                type === 'applicant' ? (
                    <ApplicantProfileDetail
                        user={newUser as User}
                        formFields={formFields}
                        onClose={() => setCreateModalOpen(false)}
                        isDark={isDark}
                        onSave={handleCreateSave}
                        // Dummy props for required ones
                        onApprove={async () => { }}
                        onReject={async () => { }}
                        onCancelRejection={() => { }}
                        onDelete={() => { }}
                        onCancelParticipation={() => { }}
                        onSessionMove={() => { }}
                        initialIsEditing={true} // Start in Edit Mode
                    />
                ) : (
                    <AdminProfileDetail
                        user={newUser as User}
                        formFields={formFields}
                        onClose={() => setCreateModalOpen(false)}
                        isDark={isDark}
                        onSave={handleCreateSave}
                        isApplicant={false}
                        initialIsEditing={true} // Start in Edit Mode
                        // Dummies
                        onSessionMove={() => { }}
                        onCancelParticipation={() => { }}
                    />
                )
            )}
        </>
    );
};

export default AdminActionManager;
