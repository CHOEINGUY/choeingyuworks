import React, { useState } from 'react';
import { Users, MessageSquare, CheckCircle } from 'lucide-react';
// import { db } from '../../firebase'; // Unused

// Check if db is used: it was imported in original but maybe unused directly?
// Original imported db but didn't seem to use it in the truncated view except possibly in sub-calls if any logic was inline.
// Ah, line 3 was `import { db } from '../../firebase';`.
// But I don't see direct usage in the code I read. I will keep it just in case or remove if lint complaints.
// Actually, I'll remove it if unused to be clean.

import AdminSessionSidebar from '../common/AdminSessionSidebar';

// import DebugControls from '../../components/DebugControls';
import RotationSessionHeader from './components/RotationSessionHeader';
import MatchingList from './dashboard/MatchingList';
import OverviewTab from './dashboard/OverviewTab';
import FeedbackTab from './dashboard/FeedbackTab';
import SelectionTab from './dashboard/SelectionTab';
import { Session, User, RotationMap } from '../../../types';
import { Feedback, Selection } from '../../../types/form'; // Add Selection import

interface SessionProps {
    status: string;
    currentRound: number;
    timeLeft: number;
    isPaused: boolean;
    setIsPaused: (paused: boolean) => void;
    config: Record<string, any>;
    updateConfig: (config: any) => void;
    adjustTime: (seconds: number) => void;
    resetSession: () => void;
    startRound: (round: number) => void;
    startSelection: () => void;
    endSession: () => void;
    [key: string]: any;
}

interface AdminSessionControlProps {
    selectedSessionId: string;
    onChangeSession: (id: string) => void;
    sessionProps: SessionProps;
    users: Record<string, User>;
    sessionUsers: User[];
    sessionUsersMap: Record<string, User>;
    baseRotations: RotationMap;
    feedbacks: Feedback[];
    selections: Selection[]; // Strict type
    actions: any;
    sessions: Record<string, Session>;
    themeMode?: string;
    themeStyle?: string;
    onAddSession: () => void;
}

const AdminSessionControl: React.FC<AdminSessionControlProps> = ({
    selectedSessionId,
    onChangeSession,
    sessionProps, // { status, currentRound, timeLeft, setStatus, ... }
    users,
    sessionUsers, // Filtered Data (Prop)
    sessionUsersMap, // Filtered Map (Prop)
    baseRotations, // Base Rotations (Prop - Calculated from AdminDashboard)
    feedbacks,
    selections,
    actions, // Injected from AdminDashboard
    sessions, // Real session data
    themeMode = 'day', // Stabilized prop
    themeStyle = 'standard', // Stabilized prop
    onAddSession // [NEW] Injected from AdminDashboard
}) => {
    const {
        status, currentRound, timeLeft,
        isPaused, setIsPaused, config, updateConfig, adjustTime, resetSession,
        startRound, startSelection, endSession
    } = sessionProps;

    const [activeTab, setActiveTab] = useState('overview');
    const [showSettings, setShowSettings] = useState(false);

    // Derived Data (Removed - Passed as props)
    // const sessionUsers = Object.values(users).filter(u => u.sessionId === selectedSessionId);

    // State for Manual Overrides: { [round]: { [userId]: partnerId } }
    const [forcedRotations] = useState<Record<string, Record<string, string>>>({});

    // State for Row Ordering (Male IDs)
    const [orderedMaleIds, setOrderedMaleIds] = useState<string[]>([]);

    // Helper: Sort Time
    const getSortTime = (u: User) => {
        if (u.checkInAt && (u.checkInAt as any).seconds) return (u.checkInAt as any).seconds;
        if (typeof u.checkInAt === 'number') return u.checkInAt;
        return Infinity; // Default to end if undefined
    };

    // Sync Ordered Male IDs
    React.useEffect(() => {
        const males = sessionUsers.filter(u => u.gender === 'M');
        if (males.length === 0) return;

        setOrderedMaleIds(prev => {
            const currentIds = new Set(males.map(u => u.id));
            const existing = prev.filter(id => currentIds.has(id));
            const existingSet = new Set(existing);

            // New males
            const newMales = males.filter(u => !existingSet.has(u.id));
            // Sort new males by time (default behavior)
            newMales.sort((a, b) => {
                const timeA = getSortTime(a);
                const timeB = getSortTime(b);
                if (timeA !== timeB) return timeA - timeB;
                return a.id.localeCompare(b.id);
            });

            const newIds = newMales.map(u => u.id);
            // If completely empty (first load), just use the new sorted list
            if (existing.length === 0) return newIds;

            return [...existing, ...newIds];
        });
    }, [users, selectedSessionId]); // Could optimize dependency to sessionUsers

    // Merge Base with Forced
    const dynamicRotations = { ...baseRotations };
    Object.keys(forcedRotations).forEach(roundKey => {
        const round = parseInt(roundKey, 10);
        if (dynamicRotations[round]) {
            dynamicRotations[round] = {
                ...dynamicRotations[round],
                ...forcedRotations[roundKey]
            };
        }
    });

    // Listen for Lock/Unlock Events from Header


    const handleSwapUsers = async (id1: string, id2: string, table1: number, table2: number) => {
        // Updated Fixed Table Logic: Just swap table numbers in Firestore
        if (actions?.swapUserTableNumbers) {
            await actions.swapUserTableNumbers(id1, id2, table1, table2);
        }
    };

    // Filter Global Data by Session
    const sessionFeedbacks = feedbacks.filter(f => users[f.fromUserId]?.sessionId === selectedSessionId);
    const sessionSelections = selections.filter(s => users[s.userId]?.sessionId === selectedSessionId);

    // Theme Logic - Use props passed from AdminDashboard (stabilized)
    const isDark = themeMode === 'night';
    const isGlass = themeStyle === 'glass';

    const cardBgClass = isGlass
        ? (isDark ? 'bg-slate-900/60 backdrop-blur-xl border-white/10 text-white' : 'bg-white/60 backdrop-blur-xl border-white/40 text-gray-900')
        : (isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900');

    const itemBgClass = isGlass
        ? (isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-white/20')
        : (isDark ? 'bg-slate-700 border-slate-700' : 'bg-white border-gray-200');

    const headerBgClass = isGlass
        ? (isDark ? 'bg-slate-900/80 backdrop-blur-md border-b border-white/10' : 'bg-white/80 backdrop-blur-md border-b border-white/20')
        : (isDark ? 'bg-slate-800 border-b border-slate-600' : 'bg-white border-b border-gray-300');

    const titleTextClass = isDark ? 'text-gray-100' : 'text-gray-800';
    const subTextClass = isDark ? 'text-gray-400' : 'text-gray-500';

    const handleDeleteFeedback = async (id: string) => {
        if (actions) {
            if (window.confirm('이 피드백을 삭제하시겠습니까?')) {
                await actions.deleteFeedback(id);
            }
        }
    };

    // [OPTIMIZATION] Memoize Session Stats Calculation
    const sessionStats = React.useMemo(() => {
        const stats: Record<string, { total: number; male: number; female: number }> = {};
        if (!sessions || !users) return stats;

        Object.keys(sessions).forEach(sessionId => {
            const sessionSpecificUsers = Object.values(users).filter(u => u.sessionId === sessionId);
            const total = sessionSpecificUsers.length;
            const male = sessionSpecificUsers.filter(u => u.gender === 'M').length;
            const female = sessionSpecificUsers.filter(u => u.gender === 'F').length;
            stats[sessionId] = { total, male, female };
        });
        return stats;
    }, [sessions, users]);

    return (
        <div className="flex h-full overflow-hidden font-sans">
            {/* Shared Sidebar */}
            <AdminSessionSidebar
                sessions={sessions}
                selectedSessionId={selectedSessionId}
                onSelectSession={onChangeSession}
                onAddSession={onAddSession}
                title="세션 선택"
                isDark={isDark}
                // @ts-ignore - sessionStats structure check later
                sessionStats={sessionStats} // [OPTIMIZATION]
                statsRenderer={(_session: any, key: string, isSelected: boolean) => {
                    const stats = sessionStats[key] || { total: 0, male: 0, female: 0 };
                    const { total, male, female } = stats;

                    return (
                        <div className="flex items-center justify-between w-full">
                            <span className={`text-xs ${isSelected ? 'text-white/90' : 'text-gray-400'} flex items-center gap-1.5`}>
                                <span>전체 {total}명</span>
                                <span className="opacity-30">|</span>
                                <span className={`${isSelected ? 'text-blue-200' : 'text-blue-600'}`}>남 {male}</span>
                                <span className="opacity-30">|</span>
                                <span className={`${isSelected ? 'text-pink-200' : 'text-pink-600'}`}>여 {female}</span>
                            </span>
                        </div>
                    );
                }}
            />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-500 bg-transparent p-6">
                {/* [HACK] Expose lock actions to Header easily */}


                {/* Header / Controls */}
                <RotationSessionHeader
                    selectedSessionId={selectedSessionId}
                    onChangeSession={onChangeSession}
                    status={status}
                    timeLeft={timeLeft}
                    currentRound={currentRound}
                    dynamicRotations={dynamicRotations}
                    isPaused={isPaused}
                    setIsPaused={setIsPaused}
                    adjustTime={adjustTime}
                    resetSession={resetSession}
                    startRound={startRound}
                    startSelection={startSelection}
                    endSession={endSession}
                    showSettings={showSettings}
                    setShowSettings={setShowSettings}
                    config={config}
                    updateConfig={updateConfig}
                    isDark={isDark}
                    isGlass={isGlass}
                    headerBgClass={headerBgClass}
                    titleTextClass={titleTextClass}
                    sessions={sessions}
                />

                {/* Main Content - Flex Layout for Fixed Sidebar */}
                <main className="flex-1 flex gap-6 min-h-0 overflow-hidden">

                    {/* Left Panel: Active Users & Status */}
                    <MatchingList
                        currentRound={currentRound}
                        dynamicRotations={dynamicRotations}
                        users={Object.values(users)} // Global map (fallback) converted to array
                        sessionUsersMap={sessionUsersMap} // Filtered Map
                        isDark={isDark}
                        cardBgClass={cardBgClass}
                        className="w-[340px] shrink-0"
                        actions={actions}
                        onSwapUsers={handleSwapUsers}
                        orderedMaleIds={orderedMaleIds}
                    />

                    {/* Right Panel: Data Tabs (Dynamic Width) */}
                    <div className={`flex-1 min-w-0 ${cardBgClass} rounded-xl shadow-lg flex flex-col overflow-hidden border transition-colors duration-300`}>
                        {/* Tabs */}
                        <div className={`flex border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="현황판 (Overview)" icon={<Users size={16} />} isDark={isDark} />
                            <TabButton active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} label="피드백 현황" icon={<MessageSquare size={16} />} isDark={isDark} />
                            <TabButton active={activeTab === 'selection'} onClick={() => setActiveTab('selection')} label="최종 결과" icon={<CheckCircle size={16} />} isDark={isDark} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-0 scrollbar-thin">
                            {activeTab === 'overview' && (
                                <OverviewTab
                                    currentRound={currentRound}
                                    status={status}
                                    dynamicRotations={dynamicRotations}
                                    users={sessionUsersMap} // Pass Filtered Map here!
                                    sessionFeedbacks={sessionFeedbacks}
                                    titleTextClass={titleTextClass}
                                    itemBgClass={itemBgClass}
                                    isDark={isDark}
                                    orderedMaleIds={orderedMaleIds}
                                />
                            )}

                            {activeTab === 'feedback' && (
                                <FeedbackTab
                                    sessionFeedbacks={sessionFeedbacks}
                                    users={sessionUsersMap} // Pass Filtered Map
                                    isDark={isDark}
                                    titleTextClass={titleTextClass}
                                    subTextClass={subTextClass}
                                    handleDeleteFeedback={handleDeleteFeedback}
                                />
                            )}

                            {activeTab === 'selection' && (
                                <SelectionTab
                                    sessionSelections={sessionSelections}
                                    users={sessionUsersMap} // Pass Filtered Map
                                    isDark={isDark}
                                    itemBgClass={itemBgClass}
                                    titleTextClass={titleTextClass}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, label, icon, isDark }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode; isDark: boolean }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${active
            ? (isDark ? 'border-purple-500 text-purple-400' : 'border-purple-600 text-purple-600')
            : (isDark ? 'border-transparent text-gray-500 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700')
            }`}
    >
        {icon} {label}
    </button>
);

export default AdminSessionControl;
