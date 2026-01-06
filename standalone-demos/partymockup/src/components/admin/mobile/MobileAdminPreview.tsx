import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { doc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import { db } from '../../../firebase';
import { useSessions } from '../../../hooks/useSessions';
import { useFirebaseSession } from '../../../hooks/useFirebaseSession';
import { useSessionData } from '../../../hooks/useSessionData';
import { useAdminActions } from '../../../hooks/useAdminActions';
import { toast } from 'sonner';

import MobileAdminLayout from './MobileAdminLayout';
import MobileSessionDashboard from './MobileSessionDashboard';
import MobileApplicantManagement from './MobileApplicantManagement';
import MobileParticipantManagement from './MobileParticipantManagement';

// Party Components
import MobilePartyDashboard from './party/MobilePartyDashboard';
import MobilePartyParticipants from './party/MobilePartyParticipants';
import MobilePartyApplicants from './party/MobilePartyApplicants';

import MobileSettingsModal from './MobileSettingsModal';
import { User } from '../../../types';
import PageTitle from '../../common/PageTitle';

const MobileAdminPreview: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activePage = searchParams.get('tab') || 'rotation_dashboard';

    // 1. Global Sessions & Selection
    const { sessions } = useSessions();

    // [FIX] Separate IDs with localStorage initialization
    const [rotationSessionId, setRotationSessionId] = useState<string | null>(() => {
        return localStorage.getItem('mobile_admin_rot_id');
    });
    const [partySessionId, setPartySessionId] = useState<string | null>(() => {
        return localStorage.getItem('mobile_admin_party_id');
    });

    // Derive mode from activePage
    const isPartyMode = activePage.startsWith('party_');

    // [FIX] Use useCallback to prevent stale closure - takes mode as ARGUMENT, not closure
    const handleSetSessionId = useCallback((id: string, forPartyMode?: boolean) => {
        // If forPartyMode is explicitly passed, use it. Otherwise, infer from current URL.
        const targetIsParty = forPartyMode !== undefined ? forPartyMode : activePage.startsWith('party_');

        if (targetIsParty) {
            setPartySessionId(id);
            localStorage.setItem('mobile_admin_party_id', id);
        } else {
            setRotationSessionId(id);
            localStorage.setItem('mobile_admin_rot_id', id);
        }
    }, [activePage]);

    // [FIX] selectedSessionId derived STRICTLY from mode
    const selectedSessionId = isPartyMode ? partySessionId : rotationSessionId;

    // Auto-select latest session for each type
    useEffect(() => {
        if (sessions && Object.keys(sessions).length > 0) {
            const allSessions = Object.values(sessions);

            // 1. Validate or Init Rotation Session
            // Strict Filter: Type must be ROTATION or undefined (legacy)
            const rotationSessions = allSessions.filter(s => s.type === 'ROTATION' || !s.type);
            const currentRotSession = rotationSessionId ? sessions[rotationSessionId] : null;

            // Check if current ID is valid AND matches type requirements
            const isCurrentRotValid = currentRotSession && (currentRotSession.type === 'ROTATION' || !currentRotSession.type);

            if (!isCurrentRotValid) {
                // Current is invalid (deleted or WRONG TYPE), pick latest valid
                if (rotationSessions.length > 0) {
                    const target = rotationSessions[0];
                    setRotationSessionId(target.id);
                    localStorage.setItem('mobile_admin_rot_id', target.id);
                } else {
                    setRotationSessionId(null);
                    localStorage.removeItem('mobile_admin_rot_id');
                }
            }

            // 2. Validate or Init Party Session
            const partySessions = allSessions.filter(s => s.type === 'PARTY');
            const currentPartySession = partySessionId ? sessions[partySessionId] : null;

            const isCurrentPartyValid = currentPartySession && currentPartySession.type === 'PARTY';

            if (!isCurrentPartyValid) {
                if (partySessions.length > 0) {
                    const target = partySessions[0];
                    setPartySessionId(target.id);
                    localStorage.setItem('mobile_admin_party_id', target.id);
                } else {
                    setPartySessionId(null);
                    localStorage.removeItem('mobile_admin_party_id');
                }
            }
        }
    }, [sessions, rotationSessionId, partySessionId]);

    // [SAFETY] Explicitly clear Rotation ID if it points to a Party Session
    useEffect(() => {
        if (!sessions || !rotationSessionId) return;
        const current = sessions[rotationSessionId];
        // If it's definitely a PARTY session, kill it from Rotation context
        if (current && current.type === 'PARTY') {
            console.warn("Safety Cleanup: Removing Party Session from Rotation Context");
            setRotationSessionId(null);
            localStorage.removeItem('mobile_admin_rot_id');
        }
    }, [rotationSessionId, sessions]);

    // 2. Session Logic Hooks
    const sessionProps = useFirebaseSession(selectedSessionId);
    const { usersData, rotationsData } = useSessionData(selectedSessionId, null, sessionProps.currentRound);
    const actions = useAdminActions();

    // 3. Local Data State (Feedbacks & Selections - not in useSessionData yet)
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [selections, setSelections] = useState<any[]>([]);
    const [allApplicants, setAllApplicants] = useState<any[]>([]);

    // Fetch Feedbacks & Selections & Applicants for the selected session
    useEffect(() => {
        if (!selectedSessionId) {
            setFeedbacks([]);
            setSelections([]);
            setAllApplicants([]);
            return;
        }

        // Feedbacks
        const qFeedbacks = query(collection(db, 'feedbacks'), where('sessionId', '==', selectedSessionId));
        const unsubFeedbacks = onSnapshot(qFeedbacks, (snap) => {
            const list: any[] = [];
            snap.forEach(d => list.push({ id: d.id, ...d.data() }));
            setFeedbacks(list);
        });

        // Selections
        const qSelections = query(collection(db, 'selections'), where('sessionId', '==', selectedSessionId));
        const unsubSelections = onSnapshot(qSelections, (snap) => {
            const list: any[] = [];
            snap.forEach(d => list.push({ id: d.id, ...d.data() }));
            setSelections(list);
        });

        // Applicants
        const qApplicants = query(collection(db, 'applicants'), where('appliedSessionId', '==', selectedSessionId));
        const unsubApplicants = onSnapshot(qApplicants, (snap) => {
            const list: any[] = [];
            snap.forEach(d => list.push({ id: d.id, ...d.data() }));
            setAllApplicants(list);
        });

        return () => {
            unsubFeedbacks();
            unsubSelections();
            unsubApplicants();
        };
    }, [selectedSessionId]);

    // 4. Derived State
    const currentSession = selectedSessionId && sessions ? sessions[selectedSessionId] : undefined;
    const isDark = currentSession?.config?.themeMode === 'night';
    const isGlass = currentSession?.config?.themeStyle === 'glass';

    const usersList = useMemo(() => usersData ? Object.values(usersData) : [], [usersData]);
    const usersMap = usersData || {};

    // [FIX] Calculate Ordered Male IDs for consistent Matching List (Parity with Desktop)
    const orderedMaleIds = useMemo(() => {
        const males = usersList.filter(u => u.gender === 'M');
        if (males.length === 0) return [];

        // Sort by CheckIn Time
        return males.sort((a, b) => {
            const timeA = typeof a.checkInAt === 'number' ? a.checkInAt : (a.checkInAt?.seconds || Infinity);
            const timeB = typeof b.checkInAt === 'number' ? b.checkInAt : (b.checkInAt?.seconds || Infinity);
            if (timeA !== timeB) return timeA - timeB;
            return a.id.localeCompare(b.id);
        }).map(u => u.id);
    }, [usersList]);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Handler to update session config
    const updateSessionConfig = async (sessionId: string, key: string, value: any) => {
        try {
            const sessionRef = doc(db, 'sessions', sessionId);
            await updateDoc(sessionRef, {
                [`config.${key}`]: value
            });
        } catch (error: any) {
            console.error("Failed to update session config:", error);
            toast.error("설정 저장 실패: " + error.message);
        }
    };

    const handleMenuClick = (pageId: string) => {
        if (pageId === 'settings') {
            setIsSettingsOpen(true);
            return;
        }
        setSearchParams({ tab: pageId });
    };

    // Render Content Switch
    const renderContent = () => {
        if (!selectedSessionId || !currentSession) return <div className="p-8 text-center">세션을 선택해주세요.</div>;

        // Calculate Stats for Party Dashboard
        const partyStats = {
            total: allApplicants.length,
            checkedIn: usersList.filter(u => u.isEntered || u.isCheckedIn || u.tableNumber).length,
            male: allApplicants.filter(u => u.gender === 'M').length,
            female: allApplicants.filter(u => u.gender === 'F').length,
            maleCheckedIn: usersList.filter(u => u.gender === 'M' && (u.isEntered || u.isCheckedIn || u.tableNumber)).length,
            femaleCheckedIn: usersList.filter(u => u.gender === 'F' && (u.isEntered || u.isCheckedIn || u.tableNumber)).length
        };

        // Handlers (Ideally these should open modals or call actions)
        const handleSelectUser = (user: User) => {
            // Placeholder: Maybe open a detailed view modal?
            // MobileParticipantManagement has its own modal logic internal or passed?
            // Checking MobileParticipantManagement... it manages selectedUser internally.
            // But MobilePartyParticipants expects onSelectUser.
            console.log("Selected User:", user);
        };

        const handleSelectApplicant = (user: User) => {
            console.log("Selected Applicant:", user);
        };

        switch (activePage) {
            // --- Rotation Menu ---
            case 'rotation_dashboard':
                return (
                    <MobileSessionDashboard
                        selectedSessionId={selectedSessionId}
                        onChangeSession={handleSetSessionId}
                        sessionProps={sessionProps}
                        users={usersList}
                        sessionUsersMap={usersMap}
                        dynamicRotations={rotationsData || {}}
                        feedbacks={feedbacks}
                        selections={selections}
                        isDark={isDark}
                        isGlass={isGlass}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                        actions={actions}
                        orderedMaleIds={orderedMaleIds}
                    />
                );
            case 'rotation_participants':
                return (
                    <MobileParticipantManagement
                        selectedSessionId={selectedSessionId}
                        isDark={isDark}
                        users={usersMap}
                        sessionUsers={usersList}
                        actions={actions}
                        sessions={sessions}
                    />
                );
            case 'rotation_applicants':
                return (
                    <MobileApplicantManagement
                        selectedSessionId={selectedSessionId}
                        isDark={isDark}
                        applicants={allApplicants}
                        sessionApplicants={allApplicants}
                        actions={actions}
                        sessions={sessions}
                    />
                );

            // --- Party Menu ---
            case 'party_dashboard':
                return (
                    <MobilePartyDashboard
                        session={currentSession}
                        stats={partyStats}
                        onScanQr={() => toast.info("QR 스캐너 준비중")}
                        onManualCheckIn={() => toast.info("수동 체크인 준비중")}
                        isDark={isDark}
                    />
                );
            case 'party_participants':
                return (
                    <MobilePartyParticipants
                        users={usersList}
                        actions={actions}
                        isDark={isDark}
                        session={currentSession}
                        onSelectUser={handleSelectUser}
                        onMoveUser={(u) => toast.info(`${u.name} 이동`)}
                    />
                );
            case 'party_applicants':
                return (
                    <MobilePartyApplicants
                        applicants={allApplicants} // Applicants are Users? Type check might differ but User is generic
                        actions={actions}
                        isDark={isDark}
                        session={currentSession}
                        onSelectApplicant={handleSelectApplicant}
                        onApprove={(u) => actions.approveApplicant?.(u.id)}
                        onReject={(u) => actions.rejectApplicant?.(u.id)}
                    />
                );

            // --- Default ---
            case 'dashboard': // Legacy fallback
            default:
                return (
                    <MobileSessionDashboard
                        selectedSessionId={selectedSessionId}
                        onChangeSession={handleSetSessionId}
                        sessionProps={sessionProps}
                        users={usersList}
                        sessionUsersMap={usersMap}
                        dynamicRotations={rotationsData || {}}
                        feedbacks={feedbacks}
                        selections={selections}
                        isDark={isDark}
                        isGlass={isGlass}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                        actions={actions}
                    />
                );
        }
    };

    const pageTitles: Record<string, string> = {
        'rotation_dashboard': '로테이션 대시보드',
        'rotation_participants': '로테이션 참가자',
        'rotation_applicants': '로테이션 신청자',
        'party_dashboard': '파티 대시보드',
        'party_participants': '파티 참가자',
        'party_applicants': '파티 신청자',
        'premium_manager': '프리미엄 소개팅'
    };

    return (
        <>
            <PageTitle title="관리자 페이지 | Dating App" />
            <MobileAdminLayout
                activePage={activePage}
                onMenuClick={handleMenuClick}
                title={pageTitles[activePage] || '관리자'}
                isDark={isDark}
                selectedSessionId={selectedSessionId || ""}
                onChangeSession={handleSetSessionId}
                sessions={sessions}
                onLogout={() => window.location.reload()}
            >
                {renderContent()}

                {isSettingsOpen && currentSession && selectedSessionId && (
                    <MobileSettingsModal
                        session={currentSession}
                        sessionId={selectedSessionId}
                        onClose={() => setIsSettingsOpen(false)}
                        onUpdateConfig={updateSessionConfig}
                    />
                )}
            </MobileAdminLayout>
        </>
    );
};

export default MobileAdminPreview;

