import React, { useState } from 'react';
import MobileSessionHeader from './MobileSessionHeader';
import { toast } from 'sonner';

import AdminQRScanner from './AdminQRScanner';
import AdminCheckInModal from './AdminCheckInModal';
// import { db } from '../../../firebase'; // Unused
// import { useAdminActions } from '../../../hooks/useAdminActions'; // Imported in JSX but unused directly in component body (passed in props)
import OverviewTab from '../rotation/dashboard/OverviewTab';
import MatchingList from '../rotation/dashboard/MatchingList';
// import FeedbackTab from '../rotation/dashboard/FeedbackTab'; // Unused
import MobileFeedbackRoundView from './MobileFeedbackRoundView';
import SelectionTab from '../rotation/dashboard/SelectionTab';
import { Users, Grid, MessageSquare, Award, Camera, LucideIcon } from 'lucide-react';
import { User } from '../../../types';

interface MobileSessionDashboardProps {
    selectedSessionId: string;
    onChangeSession: (sessionId: string) => void;
    sessionProps: {
        status: string;
        currentRound: number;
        timeLeft: number;
        isPaused: boolean;
        setIsPaused: (isPaused: boolean) => void;
        adjustTime: (seconds: number) => void;
        resetSession: () => void;
        startRound: (round: number) => void;
        startSelection: () => void;
        endSession: () => void;
        [key: string]: any;
    };
    users: User[]; // Real Data
    sessionUsers?: User[]; // Filtered Data (Prop) - unused in body?
    sessionUsersMap: Record<string, User>; // Filtered Map (Prop)
    dynamicRotations: any; // Shared Rotations (Prop)
    feedbacks: any; // Real Data
    selections: any; // Real Data
    isDark?: boolean;
    isGlass?: boolean;
    onOpenSettings: () => void;
    actions: any; // Receive actions from parent
    orderedMaleIds?: string[]; // [NEW] For stable sorting
}

interface CheckInModalState {
    isOpen: boolean;
    user: any | null; // User to check in
    loading: boolean;
}

const MobileSessionDashboard: React.FC<MobileSessionDashboardProps> = ({
    selectedSessionId,
    onChangeSession,
    sessionProps, // Shared Session Logic
    users, // Real Data
    // sessionUsers, // Filtered Data (Prop) - unused
    sessionUsersMap, // Filtered Map (Prop)
    dynamicRotations, // Shared Rotations (Prop)
    feedbacks, // Real Data
    selections, // Real Data
    isDark,
    isGlass,
    onOpenSettings,
    actions, // Receive actions from parent
    orderedMaleIds // [NEW]
}) => {
    // Destructure Shared Logic
    const {
        status, currentRound, timeLeft,
        isPaused, setIsPaused,
        adjustTime, resetSession,
        startRound, startSelection, endSession
    } = sessionProps;

    // QR Scanner Logic
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [checkInModal, setCheckInModal] = useState<CheckInModalState>({ isOpen: false, user: null, loading: false });

    const [activeTab, setActiveTab] = useState<'matching' | 'overview' | 'feedback' | 'result'>('matching');

    // Derived Data
    // Note: sessionUsersList, sessionUsersMap, dynamicRotations now come from props! (Refactored)

    // Theme Classes Logic (Parity with Web Admin)
    const cardBgClass = isGlass
        ? (isDark ? 'bg-slate-900/60 backdrop-blur-xl border-white/10 text-white' : 'bg-white/60 backdrop-blur-xl border-white/40 text-gray-900')
        : (isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900');

    const itemBgClass = isGlass
        ? (isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-white/20')
        : (isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200');

    // Gradient Background for Glass Mode
    const containerBg = isGlass
        ? (isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-pink-50 to-blue-50')
        : (isDark ? 'bg-slate-900' : 'bg-gray-50');

    // Handlers mapped to sessionProps
    const handleStartSelection = () => {
        startSelection();
        setActiveTab('result');
    };

    const TABS: { id: 'matching' | 'overview' | 'feedback' | 'result'; label: string; icon: LucideIcon }[] = [
        { id: 'matching', label: '매칭', icon: Grid },
        { id: 'overview', label: '현황', icon: Users },
        { id: 'feedback', label: '피드백', icon: MessageSquare },
        { id: 'result', label: '결과', icon: Award },
    ];

    // QR Handlers
    const handleScan = async (scannedText: string) => {
        setIsScannerOpen(false); // Close camera first

        let userId = scannedText;
        // Parse if URL:  https://domain.com/invite?key=USER_ID
        try {
            if (scannedText.includes('key=')) {
                userId = new URL(scannedText).searchParams.get('key') || userId;
            }
        } catch (e) {
            console.error("QR Parse Error, assuming raw ID", e);
        }

        if (!userId) return toast.error("유효하지 않은 QR 코드입니다.");

        // Fetch user info for confirmation
        const user = await actions.getCheckInUser(userId);
        if (user) {
            setCheckInModal({ isOpen: true, user: user, loading: false });
        } else {
            toast.error("사용자를 찾을 수 없습니다.");
        }
    };

    const handleConfirmCheckIn = async (userId: string) => {
        setCheckInModal(prev => ({ ...prev, loading: true }));
        const user = checkInModal.user;
        const success = await actions.confirmCheckIn(userId, user.sessionId, user.gender);
        if (success) {
            toast.success(`${user.name} 님 입장 확인 완료!`);
            setCheckInModal({ isOpen: false, user: null, loading: false });
        } else {
            toast.error("체크인 실패");
            setCheckInModal(prev => ({ ...prev, loading: false }));
        }
    };

    const handleSwapUsers = async (user1Id: string, user2Id: string, table1: number, table2: number) => {
        if (!actions?.swapUserTableNumbers) return;
        await actions.swapUserTableNumbers(user1Id, user2Id, table1, table2);
    };

    return (
        <div className={`flex flex-col h-full pb-16 transition-colors duration-300 ${containerBg}`}> {/* pb-16 for bottom nav */}
            <MobileSessionHeader
                selectedSessionId={selectedSessionId}
                onChangeSession={onChangeSession}
                status={status}
                timeLeft={timeLeft}
                currentRound={currentRound}
                isPaused={isPaused}
                setIsPaused={setIsPaused}
                adjustTime={adjustTime}
                resetSession={resetSession}
                startRound={startRound}
                startSelection={handleStartSelection}
                endSession={endSession}
                dynamicRotations={dynamicRotations}
                onOpenSettings={onOpenSettings}
                isDark={isDark}
                users={users}
            />

            <div className="flex-1 overflow-y-auto">
                {activeTab === 'matching' && (
                    <div className="p-4">
                        <MatchingList
                            currentRound={currentRound}
                            dynamicRotations={dynamicRotations}
                            users={users}
                            sessionUsersMap={sessionUsersMap} // Pass filtered users map
                            isDark={isDark}
                            cardBgClass={cardBgClass}
                            className="w-full"
                            actions={actions} // Pass actions to MatchingList
                            isMobile={true}
                            onSwapUsers={handleSwapUsers}
                            orderedMaleIds={orderedMaleIds}
                        />
                    </div>
                )}
                {activeTab === 'overview' && (
                    <OverviewTab
                        currentRound={currentRound}
                        status={status}
                        dynamicRotations={dynamicRotations}
                        users={sessionUsersMap} // Use filtered users map
                        sessionFeedbacks={feedbacks} // Use real feedbacks
                        titleTextClass={isDark ? "text-white" : "text-gray-900"}
                        itemBgClass={itemBgClass}
                        isDark={isDark}
                    />
                )}
                {activeTab === 'feedback' && (
                    <div className="flex-1 h-full"> {/* Full height for the internal scroll of MobileFeedbackRoundView */}
                        <MobileFeedbackRoundView
                            currentRound={currentRound}
                            feedbacks={feedbacks}
                            users={users}
                            rotations={dynamicRotations}
                            isDark={isDark}
                        />
                    </div>
                )}
                {activeTab === 'result' && (
                    <div className="p-4">
                        <SelectionTab
                            finalSelections={selections}
                            users={users}
                            isDark={isDark}
                            itemBgClass={itemBgClass}
                            titleTextClass={isDark ? "text-white" : "text-gray-900"}
                        />
                    </div>
                )}
            </div>

            {/* QR Scanner FAB */}
            <button
                onClick={() => setIsScannerOpen(true)}
                className="fixed bottom-24 right-5 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform hover:bg-gray-900 border-2 border-white/20"
                aria-label="QR Scan"
            >
                <Camera size={26} />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
            </button>

            {/* QR Scanner Overlay */}
            <AdminQRScanner
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScan={handleScan}
            />

            {/* Check-In Confirmation Modal */}
            <AdminCheckInModal
                isOpen={checkInModal.isOpen}
                onClose={() => setCheckInModal({ isOpen: false, user: null, loading: false })}
                onConfirm={handleConfirmCheckIn}
                user={checkInModal.user}
                isCheckingIn={checkInModal.loading}
            />

            {/* Bottom Navigation */}
            <div className={`fixed bottom-0 left-0 right-0 border-t z-30 flex items-center justify-around h-16 pb-safe transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                {TABS.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-pink-600' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <tab.icon size={24} className={`mb-1 ${isActive ? 'fill-pink-100' : ''}`} />
                            <span className="text-[10px] font-bold">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileSessionDashboard;
