import React, { useMemo } from 'react';
import AdminSidebar from '../common/AdminSidebar';
import RotationSessionControl from '../rotation/RotationSessionControl';
import PartySessionControl from '../party/PartySessionControl';
import AdminUserManagement from '../common/AdminUserManagement';
import AdminApplicantManagement from '../common/AdminApplicantManagement';
import AdminPremiumManager from '../premium/AdminPremiumManager';
import AdminMessageManagement from '../common/AdminMessageManagement';
import AdminManagementModal from '../common/AdminManagementModal';
import DebugControls from '../../DebugControls';
import FormAdminPage from '../../../pages/FormAdminPage';
import ProfileBuilder from '../profile_builder/ProfileBuilder';
import TransactionSimulator from '../transactions/TransactionSimulator';
import { auth } from '../../../firebase';
import { Session, User, Applicant } from '../../../types';

interface AdminDashboardDesktopProps {
    isSidebarCollapsed: boolean;
    setIsSidebarCollapsed: (v: boolean) => void;
    currentView: string;
    setCurrentView: (v: string) => void;
    handleLogout: () => Promise<void>;
    isManageAdminsOpen: boolean;
    setIsManageAdminsOpen: (v: boolean) => void;
    selectedSessionId: string | null;
    setSelectedSessionId: (id: string | null) => void;
    sessions: Record<string, Session>;
    sessionProps: any;
    isDark: boolean;
    actions: any;
    users: Record<string, User>;
    applicants: Applicant[];
    sessionApplicants: Applicant[];
    formDefinition: any;
    sessionUsers: User[];
    sessionUsersMap: Record<string, User>;
    dynamicRotations: any;
    feedbacks: any;
    selections: any;
    themeMode: string;
    themeStyle: string;
    setIsAddSessionModalOpen: (type?: 'ROTATION' | 'PARTY') => void;
    premiumApplicants: any;
    bgClass: string;
}

const AdminDashboardDesktop: React.FC<AdminDashboardDesktopProps> = ({
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    currentView,
    setCurrentView,
    handleLogout,
    isManageAdminsOpen,
    setIsManageAdminsOpen,
    selectedSessionId,
    setSelectedSessionId,
    sessions,
    sessionProps,
    isDark,
    actions,
    users,
    applicants,
    sessionApplicants,
    formDefinition,
    sessionUsers,
    sessionUsersMap,
    dynamicRotations,
    feedbacks,
    selections,
    themeMode,
    setIsAddSessionModalOpen,
    premiumApplicants,
    bgClass
}) => {
    // [NEW] Separate Sessions
    const rotationSessions = useMemo(() => {
        const output: Record<string, Session> = {};
        if (sessions) {
            Object.entries(sessions).forEach(([id, s]) => {
                if (s.type !== 'PARTY') output[id] = s;
            });
        }
        return output;
    }, [sessions]);

    const partySessions = useMemo(() => {
        const output: Record<string, Session> = {};
        if (sessions) {
            Object.entries(sessions).forEach(([id, s]) => {
                if (s.type === 'PARTY') output[id] = s;
            });
        }
        return output;
    }, [sessions]);


    // [REMOVED] Auto-switch logic moved to AdminDashboard.tsx with proper separation
    // The parent component now manages rotationSessionId and partySessionId separately

    return (
        <div className={`flex w-full h-screen overflow-hidden transition-all duration-500 ${bgClass}`}>
            <AdminSidebar
                isCollapsed={isSidebarCollapsed}
                toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                currentView={currentView}
                onViewChange={setCurrentView}
                onLogout={handleLogout}
                onManageAdmins={() => setIsManageAdminsOpen(true)}
            />
            <div className="flex-1 flex flex-col min-w-0 bg-transparent/0 relative">
                {isManageAdminsOpen && (
                    <AdminManagementModal
                        currentEmail={auth.currentUser?.email || ''}
                        onClose={() => setIsManageAdminsOpen(false)}
                    />
                )}
                {currentView === 'rotation_dashboard' && selectedSessionId && rotationSessions[selectedSessionId] && (
                    <RotationSessionControl
                        selectedSessionId={selectedSessionId}
                        onChangeSession={(id: string) => setSelectedSessionId(id)}
                        sessionProps={sessionProps}
                        users={users}
                        sessionUsers={sessionUsers}
                        sessionUsersMap={sessionUsersMap}
                        baseRotations={dynamicRotations}
                        feedbacks={feedbacks}
                        selections={selections}
                        sessions={rotationSessions}
                        themeMode={themeMode as 'day' | 'night'}
                        themeStyle={'standard'} // [REFACTOR] Force standard style to remove glassmorphism noise
                        actions={actions}
                        onAddSession={() => setIsAddSessionModalOpen('ROTATION')}
                    />
                )}
                {currentView === 'party_dashboard' && selectedSessionId && partySessions[selectedSessionId] && (
                    <PartySessionControl
                        selectedSessionId={selectedSessionId}
                        onChangeSession={(id) => setSelectedSessionId(id)}
                        sessions={partySessions}
                        isDark={isDark}
                        actions={actions}
                        users={users}
                        formFields={formDefinition?.formConfig?.fields || []}
                        onAddSession={() => setIsAddSessionModalOpen('PARTY')}
                    />
                )}

                {(currentView === 'rotation_users' || currentView === 'party_users') && (
                    <AdminUserManagement
                        selectedSessionId={selectedSessionId || ''}
                        onChangeSession={(id) => setSelectedSessionId(id)}
                        users={users}
                        sessionUsers={sessionUsers}
                        themeMode={themeMode as 'day' | 'night'}
                        actions={actions}
                        sessions={currentView === 'rotation_users' ? rotationSessions : partySessions}
                        onAddSession={() => setIsAddSessionModalOpen(currentView === 'rotation_users' ? 'ROTATION' : 'PARTY')}
                    />
                )}
                {(currentView === 'rotation_applicants' || currentView === 'party_applicants') && (
                    <AdminApplicantManagement
                        selectedSessionId={selectedSessionId || ''}
                        onChangeSession={(id) => setSelectedSessionId(id)}
                        themeMode={themeMode as 'day' | 'night'}
                        applicants={applicants}
                        sessionApplicants={sessionApplicants}
                        sessions={currentView === 'rotation_applicants' ? rotationSessions : partySessions}
                        formFields={formDefinition?.formConfig?.fields || []}
                        actions={actions}
                        onAddSession={() => setIsAddSessionModalOpen(currentView === 'rotation_applicants' ? 'ROTATION' : 'PARTY')}
                    />
                )}
                {currentView === 'forms' && (
                    <div className="flex-1 overflow-auto h-full">
                        <FormAdminPage />
                    </div>
                )}
                {currentView === 'profile_builder' && (
                    <div className="flex-1 overflow-hidden h-full">
                        <ProfileBuilder />
                    </div>
                )}
                {currentView === 'premium' && (
                    <AdminPremiumManager
                        isDark={isDark}
                        applicants={premiumApplicants}
                        actions={actions}
                    />
                )}
                {currentView === 'messages' && (
                    <AdminMessageManagement
                        isDark={isDark}
                    />
                )}
                {currentView === 'transactions' && (
                    <div className="flex-1 overflow-auto h-full p-4">
                        <TransactionSimulator applicants={applicants} />
                    </div>
                )}
            </div>

            <DebugControls
                status={sessionProps.status}
                setStatus={sessionProps.setStatus}
                currentRound={sessionProps.currentRound}
                setCurrentRound={sessionProps.setCurrentRound}
                setTimeLeft={sessionProps.setTimeLeft}
                isPaused={sessionProps.isPaused}
                setIsPaused={sessionProps.setIsPaused}
                setIsSelectionDone={() => { }}
                totalRounds={5}
            />
        </div>
    );
};

export default AdminDashboardDesktop;
