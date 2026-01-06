import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { PremiumMatch, MatchStatus } from '../../../../types/premium';
import { Applicant } from '../../../../types';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase';
import MessageLogViewer, { MessageLogEntry } from '../../common/MessageLogViewer';
import { useAdminMessageActions } from '../../../../hooks/useAdminMessageActions';
import ApplicantProfileDetail from '../../common/ApplicantProfileDetail';

// Sub-components
import MatchDetailHeader from './components/MatchDetailHeader';
import MatchDetailProfileCards from './components/MatchDetailProfileCards';
import MatchBreakForm from './components/MatchBreakForm';
import MatchSmartStepper from './components/MatchSmartStepper';

interface MatchDetailModalProps {
    match: PremiumMatch;
    maleUser?: Applicant;
    femaleUser?: Applicant;
    isDark?: boolean;
    onClose: () => void;
    onUpdateStatus: (id: string, status: MatchStatus, data?: any) => void;
    onBreakMatch: (id: string, reason: string, refundTicket: boolean, matchData?: PremiumMatch) => void;
    onDeleteMatch: (id: string) => void;
}

const MatchDetailModal: React.FC<MatchDetailModalProps> = ({ match, maleUser, femaleUser, onClose, onUpdateStatus, onBreakMatch, onDeleteMatch }) => {
    const { executeMessageAction } = useAdminMessageActions();
    const [note, setNote] = useState(match.note || '');

    // Break Match State
    const [isBreaking, setIsBreaking] = useState(false);
    const [breakReason, setBreakReason] = useState('profile_rejected');
    const [refundTicket, setRefundTicket] = useState(true);

    // Message Log View State
    const [logViewerOpen, setLogViewerOpen] = useState(false);
    const [currentLogs, setCurrentLogs] = useState<MessageLogEntry[]>([]);
    const [viewingUserName, setViewingUserName] = useState('');

    // Profile View State
    const [viewingProfile, setViewingProfile] = useState<Applicant | null>(null);

    // Last Message States
    const [maleLastSent, setMaleLastSent] = useState<string | null>(null);
    const [femaleLastSent, setFemaleLastSent] = useState<string | null>(null);

    // Fetch Last Sent Times
    React.useEffect(() => {
        const fetchLastMessage = async (userId: string | undefined, setTime: (time: string | null) => void) => {
            if (!userId) return;
            try {
                // Check premium_pool first
                const logsRef = collection(db, `premium_pool/${userId}/message_logs`);
                const q = query(logsRef, orderBy('sentAt', 'desc'));
                const snapshot = await getDocs(q);

                let foundLog = null;
                if (!snapshot.empty) {
                    foundLog = snapshot.docs[0].data();
                } else {
                    // Check users
                    const logsRef2 = collection(db, `users/${userId}/message_logs`);
                    const q2 = query(logsRef2, orderBy('sentAt', 'desc'));
                    const snapshot2 = await getDocs(q2);
                    if (!snapshot2.empty) foundLog = snapshot2.docs[0].data();
                }

                if (foundLog && foundLog.sentAt) {
                    setTime(new Date(foundLog.sentAt).toLocaleString());
                }
            } catch (e) {
                console.error("Error fetching last msg:", e);
            }
        };

        if (maleUser?.id) fetchLastMessage(maleUser.id, setMaleLastSent);
        if (femaleUser?.id) fetchLastMessage(femaleUser.id, setFemaleLastSent);
    }, [maleUser?.id, femaleUser?.id, logViewerOpen]);

    const handleViewLogs = async (userId: string, userName: string) => {
        setViewingUserName(userName);
        setLogViewerOpen(true);
        setCurrentLogs([]); // Clear previous

        try {
            const logsRef = collection(db, `premium_pool/${userId}/message_logs`);
            const q = query(logsRef, orderBy('sentAt', 'desc'));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const logs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as MessageLogEntry[];
                setCurrentLogs(logs);
            } else {
                const logsRef2 = collection(db, `users/${userId}/message_logs`);
                const q2 = query(logsRef2, orderBy('sentAt', 'desc'));
                const snapshot2 = await getDocs(q2);
                const logs = snapshot2.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as MessageLogEntry[];
                setCurrentLogs(logs);
            }
        } catch (error) {
            console.error("Failed to fetch logs:", error);
            toast.error("로그를 불러오는데 실패했습니다.");
        }
    };

    const handleConfirmBreak = () => {
        // Pass current match data for ticket refund logic
        onBreakMatch(match.id, breakReason, refundTicket, match);
    };

    const matchStatusMap: { [key in MatchStatus]: string } = {
        matched: '매칭 성사 (연락 대기)',
        notified: '알림 발송 완료 (응답 대기)',
        scheduling: '일정 조율 중',
        scheduled: '만남 확정',
        partner_rejected: '상대방 거절',
        completed: '종료 (결과 입력됨)',
        failed: '매칭 파기',
    };

    // CallbackWrapper for ProfileCards to update last sent time
    const setLastSent = (gender: 'M' | 'F', time: string) => {
        if (gender === 'M') setMaleLastSent(time);
        else setFemaleLastSent(time);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="w-full md:max-w-xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden transition-all bg-white text-gray-900 scale-100" onClick={e => e.stopPropagation()}>

                {/* --- HEADER --- */}
                <MatchDetailHeader
                    status={match.status}
                    isDark={false}
                    onClose={onClose}
                    matchStatusMap={matchStatusMap}
                />

                {/* --- SCROLLABLE BODY --- */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                    <style>{`
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 6px;
                            height: 6px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background-color: rgba(156, 163, 175, 0.5);
                            border-radius: 9999px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                            background-color: rgba(156, 163, 175, 0.8);
                        }
                    `}</style>

                    {/* 1. Profile Cards */}
                    <MatchDetailProfileCards
                        match={match}
                        maleUser={maleUser}
                        femaleUser={femaleUser}
                        maleLastSent={maleLastSent}
                        femaleLastSent={femaleLastSent}
                        isDark={false}
                        onViewProfile={setViewingProfile}
                        onViewLogs={handleViewLogs}
                        onExecuteAction={async (action, user, options) => { await executeMessageAction(action, user, options); }}
                        onUpdateStatus={onUpdateStatus}
                        setLastSent={setLastSent}
                    />

                    {/* 2. Smart Stepper (Schedule & Result) */}
                    <MatchSmartStepper
                        match={match}
                        maleUser={maleUser}
                        femaleUser={femaleUser}
                        isDark={false}
                        onUpdateStatus={onUpdateStatus}
                        onExecuteAction={async (action, user, options) => { await executeMessageAction(action, user, options); }}
                        setIsBreaking={setIsBreaking}
                    />

                    {/* Admin Note */}
                    <div>
                        <label className="text-xs font-bold font-mono uppercase mb-2 block text-gray-400">관리자 메모</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="매칭 관련 특이사항 기록..."
                            className="w-full p-3 rounded-lg border text-sm h-24 resize-none bg-gray-50 border-gray-200"
                        />
                    </div>

                    {/* Danger Zone: Break Match */}
                    {!isBreaking && match.status !== 'failed' && match.status !== 'completed' && match.status !== 'partner_rejected' && (
                        <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                            <button
                                onClick={() => setIsBreaking(true)}
                                className="text-red-500 text-sm font-bold hover:underline flex items-center gap-1"
                            >
                                <AlertTriangle size={14} /> 매칭 파기 (오류/거절 처리)
                            </button>

                            <button
                                onClick={() => onDeleteMatch(match.id)}
                                className="text-gray-400 text-xs hover:text-red-600 hover:underline"
                            >
                                ❌ 매칭 기록 삭제 (복구 불가)
                            </button>
                        </div>
                    )}

                    {/* Show delete button even if completed/failed, for cleanup purposes */}
                    {(match.status === 'failed' || match.status === 'completed' || match.status === 'partner_rejected') && (
                        <div className="pt-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => onDeleteMatch(match.id)}
                                className="text-gray-400 text-xs hover:text-red-600 hover:underline"
                            >
                                ❌ 매칭 기록 삭제 (복구 불가)
                            </button>
                        </div>
                    )}

                    {/* Break Logic Form */}
                    <MatchBreakForm
                        isBreaking={isBreaking}
                        breakReason={breakReason}
                        refundTicket={refundTicket}
                        isDark={false}
                        setBreakReason={setBreakReason}
                        setRefundTicket={setRefundTicket}
                        onConfirmBreak={handleConfirmBreak}
                        onCancel={() => setIsBreaking(false)}
                        maleName={maleUser?.name}
                        femaleName={femaleUser?.name}
                    />
                </div>
            </div>

            <MessageLogViewer
                isOpen={logViewerOpen}
                onClose={() => setLogViewerOpen(false)}
                logs={currentLogs}
                userName={viewingUserName}
            />

            {viewingProfile && (
                <ApplicantProfileDetail
                    user={viewingProfile}
                    onClose={() => setViewingProfile(null)}
                    isDark={false}
                    isPremiumContext={true}
                />
            )}
        </div>
    );
};

export default MatchDetailModal;
