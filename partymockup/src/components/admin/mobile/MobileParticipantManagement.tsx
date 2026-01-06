import React, { useState } from 'react';
import AdminActionManager from '../common/AdminActionManager';
import { toast } from 'sonner';
import { User, Session } from '../../../types';
import { CheckCircle, Briefcase, MapPin, X, CalendarDays } from 'lucide-react';
import AdminProfileDetail from '../common/AdminProfileDetail';

interface MobileParticipantManagementProps {
    selectedSessionId: string;
    isDark?: boolean;
    users: Record<string, User> | User[]; // Handle both object (from parent state) or array
    sessionUsers?: User[];
    actions?: any;
    sessions?: Record<string, Session>;
}

const MobileParticipantManagement: React.FC<MobileParticipantManagementProps> = ({ selectedSessionId, isDark, users, sessionUsers = [], actions, sessions }) => {
    const [activeTab, setActiveTab] = useState<'all' | 'male' | 'female'>('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [sessionChangeUser, setSessionChangeUser] = useState<User | null>(null);

    // Cancelled Users State (To hide them locally)
    const [cancelledUserIds, setCancelledUserIds] = useState<Set<string>>(new Set());

    // [NEW] Use Set for selectedIds to match AdminActionManager
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [selectionMode, setSelectionMode] = useState(false);

    // Message Modal State - REMOVED (Handled by Manager)
    // const [messageModalOpen, setMessageModalOpen] = useState(false);
    // const { sendMessage } = useMessageSender(); // Kept for legacy if any, but Manager has its own



    // Filter Users
    // Use prop if available, else filter from global users
    const activeSessionUsers = sessionUsers.length > 0
        ? sessionUsers.filter(u => !cancelledUserIds.has(u.id))
        : (Array.isArray(users) ? users : Object.values(users))
            .filter(u => u.sessionId === selectedSessionId && !cancelledUserIds.has(u.id));

    const maleUsers = activeSessionUsers.filter(u => u.gender === 'M');
    const femaleUsers = activeSessionUsers.filter(u => u.gender === 'F');

    const handleSelectUser = (userId: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(userId)) newSet.delete(userId);
        else newSet.add(userId);
        setSelectedIds(newSet);
    };

    const handleSelectAll = (tabUsers: User[]) => {
        const ids = tabUsers.map(u => u.id);
        const allSelected = ids.every(id => selectedIds.has(id));
        const newSet = new Set(selectedIds);

        ids.forEach(id => {
            if (allSelected) newSet.delete(id);
            else newSet.add(id);
        });
        setSelectedIds(newSet);
    };

    // Toggle Selection Mode wrapper
    const toggleSelectionMode = () => {
        setSelectionMode(!selectionMode);
        setSelectedIds(new Set());
    };


    // Handlers
    const handleCheckIn = async (user: User, e: React.MouseEvent) => {
        e.stopPropagation();

        // 1. If already checked in -> Undo Check-in
        if (user.isCheckedIn || user.tableNumber) {
            if (window.confirm(`${user.name}님의 체크인을 취소하시겠습니까?\n(배정된 테이블 정보가 초기화됩니다)`)) {
                if (actions?.cancelCheckIn) {
                    await actions.cancelCheckIn(user.id);
                }
            }
            return;
        }

        // 2. If not checked in -> Confirm & Assign
        if (window.confirm(`${user.name}님을 체크인 하시겠습니까?`)) {
            if (actions?.confirmCheckIn) {
                // Pass sessionId and gender to help calculate table number
                await actions.confirmCheckIn(user.id, user.sessionId, user.gender);
            }
        }
    };

    const handleCancelParticipation = (user: User) => {
        if (window.confirm(`${user.name}님의 참가를 취소하시겠습니까? 리스트에서 제외됩니다.`)) {
            setCancelledUserIds(prev => new Set(prev).add(user.id));
            if (selectedUser?.id === user.id) setSelectedUser(null);
        }
    };

    const handleSessionMove = (user: User) => {
        setSessionChangeUser(user);
        if (selectedUser?.id === user.id) setSelectedUser(null);
    };







    return (
        <div className={`flex flex-col h-full ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* Toast */}
            {/* Toast handled by AdminActionManager */}

            {/* Tab Header with Selection Toggle */}
            <div className={`border-b sticky top-0 z-20 transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-600' : 'bg-white border-gray-300'}`}>
                <div className="flex p-2 gap-2 items-center">
                    {(['all', 'male', 'female'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors border ${activeTab === tab
                                ? 'bg-pink-500 text-white border-pink-600'
                                : (isDark ? 'bg-slate-800 text-gray-400 border-slate-700 hover:bg-slate-700' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50')
                                }`}
                        >
                            {tab === 'all' ? '전체' : (tab === 'male' ? '남성' : '여성')}
                        </button>
                    ))}
                    <button
                        onClick={toggleSelectionMode}
                        className={`p-2 rounded-lg border ml-1 ${selectionMode
                            ? 'bg-blue-500 text-white border-blue-600'
                            : (isDark ? 'bg-slate-800 border-slate-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500')}`}
                    >
                        <CheckCircle size={20} />
                    </button>
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-2 space-y-4 pb-24">
                {(activeTab === 'all' || activeTab === 'male') && (
                    <div className={`rounded-xl border overflow-hidden shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                        <div className={`px-4 py-1.5 border-b flex justify-between items-center ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-gray-50/50 border-gray-100'}`}>
                            <div className="flex items-center gap-1.5">
                                {selectionMode && (
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500 mr-1"
                                        checked={maleUsers.length > 0 && maleUsers.every(u => selectedIds.has(u.id))}
                                        onChange={() => handleSelectAll(maleUsers)}
                                    />
                                )}
                                <div className={`w-0.5 h-3 rounded-full bg-blue-400`} />
                                <h3 className={`text-[10px] font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>남</h3>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] shadow-sm border ${isDark ? 'bg-slate-700 text-blue-400 border-slate-600' : 'bg-white text-blue-600 border-blue-100'}`}>{maleUsers.length}명</span>
                        </div>
                        <div className="">
                            {maleUsers.map(user => (
                                <MobileUserCard
                                    key={user.id}
                                    user={user}
                                    theme="blue"
                                    assignedTable={user.tableNumber}
                                    onClick={() => selectionMode ? handleSelectUser(user.id) : setSelectedUser(user)}
                                    onCheckIn={(e) => handleCheckIn(user, e)}
                                    isDark={isDark}
                                    isSelected={selectedIds.has(user.id)}
                                    selectionMode={selectionMode}
                                />
                            ))}
                            {maleUsers.length === 0 && <div className="p-8 text-center text-gray-400 text-sm">참가자가 없습니다.</div>}
                        </div>
                    </div>
                )}

                {(activeTab === 'all' || activeTab === 'female') && (
                    <div className={`rounded-xl border overflow-hidden shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                        <div className={`px-4 py-1.5 border-b flex justify-between items-center ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-gray-50/50 border-gray-100'}`}>
                            <div className="flex items-center gap-1.5">
                                {selectionMode && (
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500 mr-1"
                                        checked={femaleUsers.length > 0 && femaleUsers.every(u => selectedIds.has(u.id))}
                                        onChange={() => handleSelectAll(femaleUsers)}
                                    />
                                )}
                                <div className={`w-0.5 h-3 rounded-full bg-pink-400`} />
                                <h3 className={`text-[10px] font-bold ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>여</h3>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] shadow-sm border ${isDark ? 'bg-slate-700 text-pink-400 border-slate-600' : 'bg-white text-pink-600 border-pink-100'}`}>{femaleUsers.length}명</span>
                        </div>
                        <div className="">
                            {femaleUsers.map(user => (
                                <MobileUserCard
                                    key={user.id}
                                    user={user}
                                    theme="pink"
                                    assignedTable={user.tableNumber}
                                    onClick={() => selectionMode ? handleSelectUser(user.id) : setSelectedUser(user)}
                                    onCheckIn={(e) => handleCheckIn(user, e)}
                                    isDark={isDark}
                                    isSelected={selectedIds.has(user.id)}
                                    selectionMode={selectionMode}
                                />
                            ))}
                            {femaleUsers.length === 0 && <div className="p-8 text-center text-gray-400 text-sm">참가자가 없습니다.</div>}
                        </div>
                    </div>
                )}
            </div>

            {/* Smart Action Dock Replaced by AdminActionManager */}
            <AdminActionManager
                type="guest"
                selectedIds={selectedIds}
                data={activeSessionUsers}
                actions={actions}
                session={sessions ? sessions[selectedSessionId] : null}
                isDark={!!isDark}
                onSelectionChange={setSelectedIds}
                isVisible={selectionMode}
            />

            {/* Profile Modal - Now with Cancel & Move Actions */}
            {selectedUser && (
                <AdminProfileDetail
                    user={selectedUser}
                    isApplicant={false}
                    onClose={() => setSelectedUser(null)}
                    isDark={isDark}
                    // Pass handlers for new buttons in Detail View
                    onCancelParticipation={() => handleCancelParticipation(selectedUser)}
                    onSessionMove={() => handleSessionMove(selectedUser)}
                />
            )}

            {/* Session Change Modal */}
            {sessionChangeUser && sessions && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className={`w-full max-w-sm rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                        <div className={`p-5 border-b flex justify-between items-center ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                            <div>
                                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>세션 이동</h3>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>대상: {sessionChangeUser.name}</p>
                            </div>
                            <button
                                onClick={() => setSessionChangeUser(null)}
                                className={`p-2 rounded-full transition-colors ${isDark ? 'bg-slate-700 text-gray-400 hover:bg-slate-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-4 space-y-3">
                            <p className={`text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>이동할 세션을 선택하세요</p>
                            {sessions && Object.entries(sessions).map(([sid, session]: [string, any]) => {
                                if (sessionChangeUser.sessionId === sid) return null;
                                return (
                                    <button
                                        key={sid}
                                        onClick={() => {
                                            if (actions) {
                                                if (window.confirm(`${sessionChangeUser.name}님을 [${session.title}] 세션으로 이동하시겠습니까?`)) {
                                                    actions.moveUserSession(sessionChangeUser.id, sid, sessionChangeUser.name);
                                                    setSessionChangeUser(null);
                                                }
                                            } else {
                                                toast.error("Action handling not available in prototype.");
                                                setSessionChangeUser(null);
                                            }
                                        }}
                                        className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-3 group ${isDark
                                            ? 'border-slate-700 hover:border-pink-500 hover:bg-pink-900/20'
                                            : 'border-gray-200 hover:border-pink-500 hover:bg-pink-50'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-pink-200/50 ${isDark ? 'bg-slate-700 text-pink-400' : 'bg-pink-100 text-pink-600'}`}>
                                            <CalendarDays size={20} />
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{session.title}</h4>
                                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{session.date}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

interface MobileUserCardProps {
    user: User;
    theme: string;
    onClick: () => void;
    onCheckIn: (e: React.MouseEvent) => void;
    assignedTable?: number | string | null;
    isDark?: boolean;
    isSelected: boolean;
    selectionMode: boolean;
}

const MobileUserCard: React.FC<MobileUserCardProps> = ({ user, theme, onClick, onCheckIn, assignedTable, isDark, isSelected, selectionMode }) => {
    const isBlue = theme === 'blue';

    return (
        <div
            onClick={onClick}
            className={`border-b last:border-0 p-3 transition-all cursor-pointer active:bg-opacity-80 relative ${isSelected ? (isDark ? 'bg-pink-900/20' : 'bg-pink-50') : (isDark ? 'bg-slate-800 border-slate-700 active:bg-slate-700' : 'bg-white border-gray-100 active:bg-gray-50')
                }`}
        >
            <div className="flex items-center gap-3">
                {/* Selection Checkbox (Visible in Selection Mode) */}
                {selectionMode && (
                    <div className="mr-1">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-pink-500 border-pink-500' : 'border-gray-300 bg-white'
                            }`}>
                            {isSelected && <CheckCircle size={14} className="text-white" />}
                        </div>
                    </div>
                )}


                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>
                            {user.age || (user.birthYear ? new Date().getFullYear() - user.birthYear + 1 : '-')}세
                        </span>
                        {/* Table Assignment Badge */}
                        {assignedTable && (
                            <span className="ml-1 bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                Table {assignedTable}
                            </span>
                        )}
                        {/* Invite Sent Badge */}
                        {user.inviteStatus === 'sent' && (
                            <span className={`ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600'}`}>
                                초대장 발송됨
                            </span>
                        )}
                    </div>
                    <div className="flex items-center text-xs text-gray-400 gap-2">
                        <span className="flex items-center gap-1 truncate"><Briefcase size={10} />{user.job}</span>
                        <span className="flex items-center gap-1 truncate"><MapPin size={10} />{user.location}</span>
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    {/* Check-in Button or Completed Status */}
                    {assignedTable ? (
                        <button
                            onClick={onCheckIn}
                            className={`text-[10px] font-bold px-2 py-1 rounded bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors whitespace-nowrap`}
                            title="체크인 취소"
                        >
                            배정완료
                        </button>
                    ) : (
                        <button
                            onClick={onCheckIn}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm active:scale-95 transition-all whitespace-nowrap ${isBlue ? 'bg-blue-500 hover:bg-blue-600' : 'bg-pink-500 hover:bg-pink-600'
                                }`}
                        >
                            체크인
                        </button>
                    )}
                </div>
            </div >
        </div >
    );
};

export default MobileParticipantManagement;
