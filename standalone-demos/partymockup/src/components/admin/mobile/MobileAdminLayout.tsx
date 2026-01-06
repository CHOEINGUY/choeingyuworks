import React, { useState, useMemo } from 'react';
import { Menu } from 'lucide-react';
import useBackHandler from '../../../hooks/useBackHandler';
import SessionDropdown from '../common/SessionDropdown';
import MobileAdminSidebar from './MobileAdminSidebar';

interface MobileAdminLayoutProps {
    children: React.ReactNode;
    activePage: string;
    onMenuClick?: (pageId: string) => void;
    title?: string;
    isDark?: boolean;
    selectedSessionId?: string;
    onChangeSession?: (sessionId: string) => void;
    sessions?: Record<string, any>;
    onLogout?: () => void;
}

const MobileAdminLayout: React.FC<MobileAdminLayoutProps> = ({ children, activePage, onMenuClick, title, isDark, selectedSessionId, onChangeSession, sessions, onLogout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Intercept Back Button for Sidebar
    useBackHandler(isSidebarOpen, () => setIsSidebarOpen(false));

    // [SMART FILTER] Filter Sessions based on Active Page Domain
    const filteredSessions = useMemo(() => {
        if (!sessions) return {};

        const isPartyPage = activePage.startsWith('party_');
        const isRotationPage = activePage.startsWith('rotation_');
        const isPremiumPage = activePage.startsWith('premium_');

        // Premium: Hide Sessions (return empty object or handle in UI)
        // For Dropdown, if we return empty, it might look broken. 
        // Better to return specific sessions if the page demands it, but for Premium, maybe we don't show the dropdown at all.
        if (isPremiumPage) return {};

        const filtered: Record<string, any> = {};
        Object.entries(sessions).forEach(([key, session]) => {
            // Check Session Type
            // Assuming session.type exists. If not, fallback to all.
            const sessionType = session.type || 'ROTATION'; // Default to Rotation if unknown

            if (isPartyPage && sessionType === 'PARTY') {
                filtered[key] = session;
            } else if (isRotationPage && sessionType === 'ROTATION') {
                filtered[key] = session;
            }
            // If neither (e.g. settings), maybe show all? Or just Rotation?
            // Let's show all if page is neutral
            else if (!isPartyPage && !isRotationPage && !isPremiumPage) {
                filtered[key] = session;
            }
        });

        // Fallback: If filter resulted in empty (e.g. no Party sessions yet), show everything or keep empty
        // Showing everything might be confusing. Keep empty effectively hides it or shows "No sessions".
        return Object.keys(filtered).length > 0 ? filtered : {};

    }, [sessions, activePage]);

    const showSessionDropdown = activePage.startsWith('party_') || activePage.startsWith('rotation_');

    return (
        <div className={`min-h-screen flex flex-col ${isDark ? 'dark bg-slate-900' : 'bg-gray-50'}`}>
            {/* Mobile Header (Global for Sidebar) */}
            <header className={`border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50 transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className={`p-2 rounded-lg active:scale-95 transition-transform ${isDark ? 'hover:bg-slate-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-lg">{title || "관리자"}</span>
                </div>

                {/* Mobile Session Dropdown (Conditional) */}
                {sessions && showSessionDropdown && (
                    <SessionDropdown
                        sessions={filteredSessions}
                        selectedSessionId={selectedSessionId || ''}
                        onChangeSession={onChangeSession!}
                        isDark={isDark}
                        className="shrink-0 max-w-[150px]"
                    />
                )}
            </header>

            {/* Main Content Area */}
            <main
                className={`flex-1 overflow-x-hidden min-h-0 relative flex flex-col ${activePage === 'premium' ? 'h-[calc(100vh-65px)]' : ''}`}
            >
                {children}
            </main>

            {/* Sidebar Component */}
            <MobileAdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activePage={activePage}
                onMenuClick={(pageId) => {
                    if (onMenuClick) onMenuClick(pageId);
                }}
                onLogout={onLogout || (() => { })}
                isDark={isDark}
            />
        </div>
    );
};

export default MobileAdminLayout;
