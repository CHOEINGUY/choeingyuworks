import React, { useMemo, useState } from 'react';
import MobileAdminLayout from './MobileAdminLayout';
import MobileSessionDashboard from './MobileSessionDashboard';
import AdminQRScanner from './AdminQRScanner';
import AdminCheckInModal from './AdminCheckInModal';
import { toast } from 'sonner';
import MobileParticipantManagement from './MobileParticipantManagement';
import MobileApplicantManagement from './MobileApplicantManagement';
import MobileSettingsModal from './MobileSettingsModal';
import AdminProfileDetail from '../common/AdminProfileDetail'; // [NEW] Import Modal
import SessionMoveModal from '../common/SessionMoveModal'; // [NEW] Import

// [NEW] Party Mode Components
import MobilePartyDashboard from './party/MobilePartyDashboard';
import MobilePartyParticipants from './party/MobilePartyParticipants';
import MobilePartyApplicants from './party/MobilePartyApplicants';

import { Session, User, Applicant } from '../../../types';
import MobilePremiumManager from './premium/MobilePremiumManager';

interface AdminDashboardMobileProps {
    mobileView: string;
    setMobileView: (v: string) => void;
    mobilePageTitles: Record<string, string>;
    isDark: boolean;
    selectedSessionId: string | null;
    setSelectedSessionId: (id: string | null) => void;
    sessions: Record<string, Session>;
    sessionProps: any;
    users: Record<string, User>;
    sessionUsers: User[];
    sessionUsersMap: Record<string, User>;
    dynamicRotations: any;
    feedbacks: any;
    selections: any;
    isGlass: boolean;
    setIsMobileSettingsOpen: (v: boolean) => void;
    actions: any;
    applicants: Applicant[];
    sessionApplicants: Applicant[];
    formDefinition: any;
    isMobileSettingsOpen: boolean;
    handleMobileUpdateConfig: (sessionId: string, key: string, value: any) => void;
    premiumApplicants?: Applicant[];
}

const AdminDashboardMobile: React.FC<AdminDashboardMobileProps> = ({
    mobileView,
    setMobileView,
    mobilePageTitles,
    isDark,
    selectedSessionId,
    setSelectedSessionId,
    sessions,
    sessionProps,
    users,
    sessionUsers,
    sessionUsersMap,
    dynamicRotations,
    feedbacks,
    selections,
    isGlass,
    setIsMobileSettingsOpen,
    actions,
    applicants,
    sessionApplicants,
    formDefinition,
    isMobileSettingsOpen,
    handleMobileUpdateConfig,
    premiumApplicants = []
}) => {
    // [STATE] Selected User for Profile Modal
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    // [STATE] Session Move Modal
    const [moveModal, setMoveModal] = useState<{ isOpen: boolean; user: User | null }>({ isOpen: false, user: null });

    // [STATE] QR Scanner & Check-In
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [checkInModal, setCheckInModal] = useState<{ isOpen: boolean; user: any | null; loading: boolean }>({
        isOpen: false, user: null, loading: false
    });

    // [HANDLER] QR Scan
    const handleScan = async (scannedText: string) => {
        setIsScannerOpen(false);
        let userId = scannedText;
        try {
            if (scannedText.includes('key=')) {
                userId = new URL(scannedText).searchParams.get('key') || userId;
            }
        } catch (e) {
            console.error("QR Parse Error", e);
        }

        if (!userId) return toast.error("유효하지 않은 QR 코드입니다.");

        // Check user via actions
        if (actions.getCheckInUser) {
            const user = await actions.getCheckInUser(userId);
            if (user) {
                setCheckInModal({ isOpen: true, user, loading: false });
            } else {
                toast.error("사용자를 찾을 수 없습니다.");
            }
        } else {
            console.warn("getCheckInUser action missing");
        }
    };

    // [HANDLER] Confirm Check-In
    const handleConfirmCheckIn = async (userId: string) => {
        if (!actions.confirmCheckIn) return;
        setCheckInModal(prev => ({ ...prev, loading: true }));

        // Pass gender if needed for stats, though usually backend handles it. 
        // Logic from MobileSessionDashboard uses user.gender
        const user = checkInModal.user;
        const success = await actions.confirmCheckIn(userId, user.sessionId || selectedSessionId, user.gender);

        if (success) {
            toast.success(`${user.name} 님 입장 확인 완료!`);
            setCheckInModal({ isOpen: false, user: null, loading: false });
        } else {
            toast.error("체크인 실패");
            setCheckInModal(prev => ({ ...prev, loading: false }));
        }
    };

    // [UI] Page Titles Mapping
    const PAGE_TITLES: Record<string, string> = {
        'party_dashboard': '파티 대시보드',
        'party_participants': '파티 참가자 관리',
        'party_applicants': '파티 신청자 관리',
        'rotation_dashboard': '로테이션 대시보드',
        'rotation_participants': '로테이션 참가자 관리',
        'rotation_applicants': '로테이션 신청자 관리',
        'premium_manager': '1:1 프리미엄 관리',
    };

    // [DATA PREP] Calculate Stats for Party Dashboard
    const partyStats = useMemo(() => {
        const total = sessionApplicants.length + sessionUsers.length;

        const checkedInCount = sessionUsers.filter(u => u.isEntered).length;
        const maleCount = sessionUsers.filter(u => u.gender === 'male').length;
        const femaleCount = sessionUsers.filter(u => u.gender === 'female').length;
        const maleCheckedIn = sessionUsers.filter(u => u.gender === 'male' && u.isEntered).length;
        const femaleCheckedIn = sessionUsers.filter(u => u.gender === 'female' && u.isEntered).length;

        return {
            total: sessionUsers.length,
            checkedIn: checkedInCount,
            male: maleCount,
            female: femaleCount,
            maleCheckedIn,
            femaleCheckedIn
        };
    }, [sessionUsers, sessionApplicants]);

    return (
        <MobileAdminLayout
            activePage={mobileView}
            onMenuClick={(page) => setMobileView(page)}
            title={PAGE_TITLES[mobileView] || mobilePageTitles[mobileView] || mobileView}
            isDark={isDark}
            selectedSessionId={selectedSessionId || undefined}
            onChangeSession={(id) => setSelectedSessionId(id || null)}
            sessions={sessions}
        >
            {/* --- PARTY MODE --- */}
            {mobileView === 'party_dashboard' && (
                <MobilePartyDashboard
                    session={sessions[selectedSessionId || '']}
                    stats={partyStats}
                    onScanQr={() => {
                        setIsScannerOpen(true);
                    }}
                    onManualCheckIn={() => {
                        setMobileView('party_participants');
                    }}
                    isDark={isDark}
                />
            )}

            {mobileView === 'party_participants' && (
                <MobilePartyParticipants
                    users={sessionUsers}
                    isDark={isDark}
                    onSelectUser={(user) => setSelectedUser(user)}
                    onMoveUser={(user: User) => {
                        setMoveModal({ isOpen: true, user });
                    }}
                    actions={actions}
                />
            )}

            {mobileView === 'party_applicants' && (
                <MobilePartyApplicants
                    applicants={sessionApplicants as unknown as User[]} // Cast if type diff
                    isDark={isDark}
                    onSelectApplicant={(user) => setSelectedUser(user)}
                    onApprove={(user) => actions.approveApplicant && actions.approveApplicant(user.id)}
                    onReject={(user) => actions.rejectApplicant && actions.rejectApplicant(user.id)}
                    actions={actions}
                />
            )}


            {/* --- ROTATION MODE (Legacy / Hybrid) --- */}
            {(mobileView === 'rotation_dashboard' || mobileView === 'dashboard') && (
                <MobileSessionDashboard
                    selectedSessionId={selectedSessionId || ''}
                    onChangeSession={(id) => setSelectedSessionId(id)}
                    sessionProps={sessionProps}
                    users={Object.values(users)}
                    sessionUsers={sessionUsers}
                    sessionUsersMap={sessionUsersMap}
                    dynamicRotations={dynamicRotations}
                    feedbacks={feedbacks}
                    selections={selections}
                    isDark={isDark}
                    isGlass={isGlass}
                    onOpenSettings={() => setIsMobileSettingsOpen(true)}
                    actions={actions}
                />
            )}

            {/* Fallback for Rotation Lists until we build them */}
            {mobileView === 'rotation_participants' && (
                <MobileParticipantManagement
                    selectedSessionId={selectedSessionId || ''}
                    isDark={isDark}
                    users={Object.values(users)}
                    sessionUsers={sessionUsers}
                    actions={actions}
                    sessions={sessions}
                />
            )}
            {mobileView === 'rotation_applicants' && (
                <MobileApplicantManagement
                    selectedSessionId={selectedSessionId || ''}
                    isDark={isDark}
                    applicants={applicants}
                    sessionApplicants={sessionApplicants}
                    actions={actions}
                    formFields={formDefinition?.formConfig?.fields || []}
                    sessions={sessions}
                />
            )}

            {/* --- PREMIUM MODE --- */}
            {mobileView === 'premium_manager' && (
                <MobilePremiumManager
                    isDark={isDark}
                    applicants={premiumApplicants}
                    actions={actions}
                />
            )}

            {/* Modal for Settings */}
            {isMobileSettingsOpen && selectedSessionId && sessions[selectedSessionId] && (
                <MobileSettingsModal
                    session={{
                        ...sessions[selectedSessionId],
                        config: sessionProps.config
                    } as any}
                    sessionId={selectedSessionId}
                    onClose={() => setIsMobileSettingsOpen(false)}
                    onUpdateConfig={handleMobileUpdateConfig}
                />
            )}

            {/* [NEW] Profile Detail Modal */}
            {selectedUser && (
                <AdminProfileDetail
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    isDark={isDark}
                    isApplicant={mobileView.includes('applicants')} // Auto-detect mode
                    onApprove={actions.approveApplicant ? () => {
                        actions.approveApplicant(selectedUser.id);
                        setSelectedUser(null);
                    } : undefined}
                    onReject={actions.rejectApplicant ? () => {
                        actions.rejectApplicant(selectedUser.id);
                        setSelectedUser(null);
                    } : undefined}
                    onCancelRejection={actions.updateApplicant ? async () => {
                        await actions.updateApplicant(selectedUser.id, { status: 'pending' });
                        toast.success('거절이 취소되었습니다.');
                        setSelectedUser(null);
                    } : undefined}
                    onCancelParticipation={actions.cancelCheckIn ? () => {
                        actions.cancelCheckIn(selectedUser.id); // Or cancel participation logic
                        setSelectedUser(null);
                    } : undefined}
                    onSessionMove={() => {
                        setMoveModal({ isOpen: true, user: selectedUser });
                    }}
                    onSave={async (data) => {
                        try {
                            if (mobileView.includes('applicants')) {
                                if (actions.updateApplicant) {
                                    await actions.updateApplicant(data.id, data);
                                    return true;
                                }
                            } else {
                                if (actions.updateUser) {
                                    await actions.updateUser(data.id, data);
                                    return true;
                                }
                            }
                            toast.error("저장 기능이 지원되지 않습니다.");
                            return false;
                        } catch (e) {
                            console.error("Save failed", e);
                            return false;
                        }
                    }}
                />
            )}

            {/* [NEW] Session Move Modal */}
            {moveModal.isOpen && moveModal.user && (
                <SessionMoveModal
                    isOpen={moveModal.isOpen}
                    onClose={() => setMoveModal({ isOpen: false, user: null })}
                    user={moveModal.user}
                    sessions={sessions}
                    onMove={async (targetSessionId) => {
                        if (actions.moveUser) {
                            const success = await actions.moveUser(moveModal.user!.id, targetSessionId);
                            if (success) {
                                toast.success("이동되었습니다.");
                                setMoveModal({ isOpen: false, user: null });
                                setSelectedUser(null);
                            } else {
                                toast.error("이동 실패");
                            }
                        } else {
                            toast.error("이동 액션이 없습니다.");
                        }
                    }}
                    isDark={isDark}
                />
            )}

            {/* [NEW] QR Scanners & Modals */}
            <AdminQRScanner
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScan={handleScan}
            />

            <AdminCheckInModal
                isOpen={checkInModal.isOpen}
                onClose={() => setCheckInModal({ isOpen: false, user: null, loading: false })}
                onConfirm={handleConfirmCheckIn}
                user={checkInModal.user}
                isCheckingIn={checkInModal.loading}
            />
        </MobileAdminLayout>
    );
};

export default AdminDashboardMobile;
