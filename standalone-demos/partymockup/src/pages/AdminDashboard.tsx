import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useAdminData } from '../hooks/useAdminData';
import { useAdminActions } from '../hooks/useAdminActions';
import { useFirebaseSession } from '../hooks/useFirebaseSession';
import { usePremiumData } from '../hooks/usePremiumData';
import { useSessions } from '../hooks/useSessions';
import { generateRotations } from '../utils/rotationUtils';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'sonner';

// Layout & Components (Desktop)
import AdminDashboardDesktop from '../components/admin/desktop/AdminDashboardDesktop';
// Layout & Components (Mobile)
import AdminDashboardMobile from '../components/admin/mobile/AdminDashboardMobile';

import AddSessionModal from '../components/admin/common/AddSessionModal';
import { useForms } from '../hooks/useForms';
import { User } from '../types';
import { FormConfig } from '../types/form';
import PageTitle from '../components/common/PageTitle';


const AdminDashboard: React.FC = () => {
    // -------------------------------------------------------------------------

    // 1. Data Loading (Sessions)
    // -------------------------------------------------------------------------
    const { sessions, loading: sessionsLoading } = useSessions();

    // -------------------------------------------------------------------------
    // 2. Global State
    // -------------------------------------------------------------------------
    // [FIX] Separate session IDs for each mode with localStorage persistence
    const [rotationSessionId, setRotationSessionId] = useState<string | null>(() => {
        return localStorage.getItem('admin_rotation_session_id');
    });
    const [partySessionId, setPartySessionId] = useState<string | null>(() => {
        return localStorage.getItem('admin_party_session_id');
    });

    // [FIX] Persist currentView with localStorage
    const [currentView, setCurrentViewState] = useState(() => {
        return localStorage.getItem('admin_current_view') || 'rotation_dashboard';
    });

    // Wrap setter to persist changes
    const setCurrentView = (view: string) => {
        setCurrentViewState(view);
        localStorage.setItem('admin_current_view', view);
    };
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { getForm } = useForms();
    const [formDefinition, setFormDefinition] = useState<FormConfig | null>(null);

    // [FIX] Persist mobileView with localStorage (moved here to use before isPartyMode)
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
    const [mobileViewState, setMobileViewStateRaw] = useState(() => {
        return localStorage.getItem('admin_mobile_view') || 'dashboard';
    });
    const mobileView = mobileViewState;
    const setMobileView = (view: string) => {
        setMobileViewStateRaw(view);
        localStorage.setItem('admin_mobile_view', view);
    };

    // [FIX] Derive mode from currentView (Desktop) OR mobileView (Mobile)
    const activeView = isMobile ? mobileView : currentView;
    const isPartyMode = activeView.startsWith('party_');

    // [FIX] selectedSessionId derived from current mode
    const selectedSessionId = isPartyMode ? partySessionId : rotationSessionId;

    // [FIX] Smart setter that respects current mode (uses activeView for mobile/desktop)
    const setSelectedSessionId = useCallback((id: string | null) => {
        if (id === null) return;

        // Determine target mode from ACTIVE view (mobile or desktop)
        const currentActiveView = isMobile ? mobileView : currentView;
        const targetIsParty = currentActiveView.startsWith('party_');

        if (targetIsParty) {
            setPartySessionId(id);
            localStorage.setItem('admin_party_session_id', id);
        } else {
            setRotationSessionId(id);
            localStorage.setItem('admin_rotation_session_id', id);
        }
    }, [isMobile, mobileView, currentView]);

    // [NEW] Centralized Session Creation State
    const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);
    const [addSessionType, setAddSessionType] = useState<'ROTATION' | 'PARTY' | undefined>(undefined);

    const handleOpenAddSession = (type?: 'ROTATION' | 'PARTY') => {
        setAddSessionType(type);
        setIsAddSessionModalOpen(true);
    };

    // Fetch Form Definition (Global)
    useEffect(() => {
        const loadForm = async () => {
            try {
                const formData = await getForm('default');
                if (formData) {
                    setFormDefinition(formData.formConfig);
                }
            } catch (error) {
                console.error("Failed to load form definition", error);
            }
        };
        loadForm();
    }, [getForm]);

    // Mobile Specific State (isMobile and mobileView moved above for early use)
    const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
    const [isManageAdminsOpen, setIsManageAdminsOpen] = useState(false); // Admin Management Modal

    // Auth - Now handled by AdminRoute, so we can assume true for data hooks
    const isAuthenticated = true;

    // [FIX] Auto-select session for each type when sessions load
    useEffect(() => {
        if (sessionsLoading || !sessions || Object.keys(sessions).length === 0) return;

        const allSessions = Object.values(sessions);

        // 1. Validate/Init Rotation Session
        const rotationSessions = allSessions.filter(s => s.type === 'ROTATION' || !s.type);
        const currentRotSession = rotationSessionId ? sessions[rotationSessionId] : null;
        const isRotValid = currentRotSession && (currentRotSession.type === 'ROTATION' || !currentRotSession.type);

        if (!isRotValid) {
            if (rotationSessions.length > 0) {
                const target = rotationSessions[0];
                setRotationSessionId(target.id);
                localStorage.setItem('admin_rotation_session_id', target.id);
            } else {
                setRotationSessionId(null);
                localStorage.removeItem('admin_rotation_session_id');
            }
        }

        // 2. Validate/Init Party Session
        const partySessions = allSessions.filter(s => s.type === 'PARTY');
        const currentPartySession = partySessionId ? sessions[partySessionId] : null;
        const isPartyValid = currentPartySession && currentPartySession.type === 'PARTY';

        if (!isPartyValid) {
            if (partySessions.length > 0) {
                const target = partySessions[0];
                setPartySessionId(target.id);
                localStorage.setItem('admin_party_session_id', target.id);
            } else {
                setPartySessionId(null);
                localStorage.removeItem('admin_party_session_id');
            }
        }
    }, [sessions, sessionsLoading, rotationSessionId, partySessionId]);

    // -------------------------------------------------------------------------
    // 3. Session Hook (Connects to the *Selected* Session)
    // -------------------------------------------------------------------------
    // Pass null if no session selected to avoid errors in hook
    const sessionProps = useFirebaseSession(selectedSessionId || "unselected_session");

    // -------------------------------------------------------------------------
    // 4. New Data & Action Hooks
    // -------------------------------------------------------------------------
    // Pass empty string if null
    const { users, applicants, feedbacks, selections } = useAdminData(selectedSessionId || "", isAuthenticated);
    const { premiumApplicants } = usePremiumData(isAuthenticated); // [NEW] Fetch Premium Data
    const actions = useAdminActions();

    // -------------------------------------------------------------------------
    // 5. Shared Computed Data (Refactored)
    // -------------------------------------------------------------------------
    // Filter users for this session
    const sessionUsers = useMemo(() => {
        return Object.values(users).filter(u => u.sessionId === selectedSessionId);
    }, [users, selectedSessionId]);

    // Filter applicants for this session
    const sessionApplicants = useMemo(() => {
        return applicants.filter(a => a.appliedSessionId === selectedSessionId);
    }, [applicants, selectedSessionId]);

    // Create Map {id: user} for easy lookup
    const sessionUsersMap = useMemo(() => {
        const map: Record<string, User> = {};
        sessionUsers.forEach(u => {
            map[u.id] = u;
        });
        return map;
    }, [sessionUsers]);

    // Compute Dynamic Rotations
    const dynamicRotations = useMemo(() => {
        return generateRotations(sessionUsers);
    }, [sessionUsers]);

    // -------------------------------------------------------------------------
    // 6. Responsive Listener
    // -------------------------------------------------------------------------
    const prevWidth = useRef(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);

            // [RESPONSIVE] Stage 1: Auto-collapse Global Sidebar on smaller laptops
            // Only collapse if we are CROSSING the threshold downwards (shrinking)
            // This prevents re-collapsing if user manually opened it and resizes slightly within the range
            if (prevWidth.current >= 1360 && width < 1360 && width > 768) {
                setIsSidebarCollapsed(true);
            }

            prevWidth.current = width;
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // -------------------------------------------------------------------------
    // 7. Handlers
    // -------------------------------------------------------------------------

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Listener will update state
        } catch (error) {
            console.error("Logout failed", error);
            toast.error('로그아웃 중 오류가 발생했습니다.');
        }
    };

    // [NEW] Central Session Creation Handler
    const handleCreateSession = async (sessionData: any) => {
        try {
            if (actions?.addSession) {
                const newId = await actions.addSession(sessionData); // { title, date, type }
                if (newId) {
                    setIsAddSessionModalOpen(false);
                    // Select new session
                    setSelectedSessionId(newId);
                }
            } else {
                console.error("actions.addSession not available");
                toast.error("세션 생성 기능이 로드되지 않았습니다.");
            }
        } catch (err) {
            console.error(err);
            toast.error("세션 생성 중 오류가 발생했습니다.");
        }
    };

    // Mobile Settings Wrapper
    const handleMobileUpdateConfig = (sessionId: string, key: string, value: any) => {
        // Only allow updating current session for now as hook is bound to it
        if (sessionId === selectedSessionId && sessionProps.updateConfig) {
            sessionProps.updateConfig({ [key]: value });
        } else {
            toast.warning("현재 선택된 세션 설정만 변경 가능합니다.");
        }
    };

    // -------------------------------------------------------------------------
    // 8. Theme Logic (with Persistence to prevents flickering)
    // -------------------------------------------------------------------------
    const { config, loading: sessionLoading } = sessionProps;
    const persistentTheme = useRef({ mode: 'day', style: 'standard' });

    // Update persistent theme ONLY when NOT loading and config is available
    if (!sessionLoading && config) {
        persistentTheme.current = {
            mode: config.themeMode || 'day',
            style: config.themeStyle || 'standard'
        };
    }

    // If loading, force use of persistent storage to prevent flashing default 'day'
    // If not loading, use config (or fallback if missing)
    const themeMode = (!sessionLoading && config?.themeMode) ? config.themeMode : persistentTheme.current.mode;
    const themeStyle = (!sessionLoading && config?.themeStyle) ? config.themeStyle : persistentTheme.current.style;

    const isDark = themeMode === 'night';
    const isGlass = themeStyle === 'glass';

    const bgClass = (() => {
        // [REFACTOR] Unified Neutral Background
        // Removing complex gradients and gender-based colors
        if (isDark) return 'bg-[#0f172a] text-white'; // Slate 900
        return 'bg-slate-50 text-gray-900'; // Slate 50
    })();

    const mobilePageTitles: Record<string, string> = {
        'dashboard': '세션 대시보드',
        'applicants': '신청자 관리',
        'users': '참가자 관리'
    };

    // -------------------------------------------------------------------------
    // 9. Render
    // -------------------------------------------------------------------------

    // Loading State
    if (sessionsLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    // --- RENDER ---
    if (isMobile) {
        return (
            <AdminDashboardMobile
                mobileView={mobileView}
                setMobileView={setMobileView}
                mobilePageTitles={mobilePageTitles}
                isDark={isDark}
                selectedSessionId={selectedSessionId}
                setSelectedSessionId={setSelectedSessionId}
                sessions={sessions}
                sessionProps={sessionProps}
                users={users}
                sessionUsers={sessionUsers}
                sessionUsersMap={sessionUsersMap}
                dynamicRotations={dynamicRotations}
                feedbacks={feedbacks}
                selections={selections}
                isGlass={isGlass}
                setIsMobileSettingsOpen={setIsMobileSettingsOpen}
                actions={actions}
                applicants={applicants}
                sessionApplicants={sessionApplicants}
                formDefinition={formDefinition}
                isMobileSettingsOpen={isMobileSettingsOpen}
                handleMobileUpdateConfig={handleMobileUpdateConfig}
                premiumApplicants={premiumApplicants}
            />
        );
    }

    return (
        <div className="flex w-full bg-gray-50 min-h-screen font-sans text-gray-900">
            <PageTitle title="관리자 페이지 | Dating App" />
            {/* Sidebar (Desktop) */}
            <AdminDashboardDesktop
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
                currentView={currentView}
                setCurrentView={setCurrentView}
                handleLogout={handleLogout}
                isManageAdminsOpen={isManageAdminsOpen}
                setIsManageAdminsOpen={setIsManageAdminsOpen}
                selectedSessionId={selectedSessionId}
                setSelectedSessionId={setSelectedSessionId}
                sessions={sessions}
                sessionProps={sessionProps}
                isDark={isDark}
                actions={actions}
                users={users}
                applicants={applicants}
                sessionApplicants={sessionApplicants}
                formDefinition={formDefinition}
                sessionUsers={sessionUsers}
                sessionUsersMap={sessionUsersMap}
                dynamicRotations={dynamicRotations}
                feedbacks={feedbacks}
                selections={selections}
                themeMode={themeMode}
                themeStyle={themeStyle}
                setIsAddSessionModalOpen={handleOpenAddSession}
                premiumApplicants={premiumApplicants}
                bgClass={bgClass}
            />

            {/* Global Create Session Modal */}
            <AddSessionModal
                isOpen={isAddSessionModalOpen}
                onClose={() => setIsAddSessionModalOpen(false)}
                onSave={handleCreateSession}
                isDark={isDark}
                defaultType={addSessionType}
                lockType={!!addSessionType}
            />
        </div>
    );
};

export default AdminDashboard;
