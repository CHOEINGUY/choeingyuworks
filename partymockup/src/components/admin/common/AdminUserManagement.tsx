import React, { useState } from 'react';
import { Settings, Calendar } from 'lucide-react';
import AdminProfileDetail from './AdminProfileDetail';
import AdminSessionSidebar from './AdminSessionSidebar';
import SessionMoveModal from './SessionMoveModal';
import SessionSettingsModal from './SessionSettingsModal';
import PartyGuestTable from '../party/dashboard/PartyGuestTable';
import RotationParticipantTable from '../rotation/RotationParticipantTable';
import AdminActionManager from './AdminActionManager';
import DataControlToolbar from './DataControlToolbar';
import { toast } from 'sonner';
import { useColumnSettings } from '../../../hooks/useColumnSettings';


import { User, Session } from '../../../types';

interface AdminUserManagementActions {
    approveApplicant?: (id: string) => Promise<boolean>;
    rejectApplicant?: (id: string) => Promise<boolean>;
    deleteApplicant?: (id: string) => Promise<boolean>;
    updateUser?: (id: string, updates: Partial<User>) => Promise<boolean>;
    cancelUserParticipation?: (id: string) => Promise<boolean>;
    moveUserSession: (userId: string, targetSessionId: string, userName?: string) => Promise<boolean>;
    updateSession?: (id: string, data: any) => Promise<boolean>;
    deleteSession?: (id: string) => Promise<boolean>;
    [key: string]: any;
}

interface AdminUserManagementProps {
    users: Record<string, User>;
    sessionUsers?: User[];
    selectedSessionId: string;
    onChangeSession: (sessionId: string) => void;
    themeMode?: 'day' | 'night';
    actions: AdminUserManagementActions;
    sessions: Record<string, Session>;
    onAddSession?: () => void;
}



const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ users, sessionUsers = [], selectedSessionId, onChangeSession, themeMode = 'day', actions, sessions, onAddSession }) => {
    const isDark = themeMode === 'night';
    const textColor = isDark ? 'text-gray-100' : 'text-gray-800';

    // Session Type Check
    const currentSession = sessions?.[selectedSessionId];
    const isPartyMode = currentSession?.type === 'PARTY';

    const [movingUser, setMovingUser] = useState<User | null>(null);

    const [selectedUser, setSelectedUser] = useState<User | null>(null); // For detail modal
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    // [Fix] Add missing filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');


    // [NEW] Bulk Action Selection State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // [NEW] Column Management with Firebase Persistence
    // Use custom hook for persistence
    const {
        visibleColumnIds,
        columnOrder,
        setVisibleColumns: setVisibleColumnIds,
        setColumnOrder
    } = useColumnSettings(
        'participant_columns',
        new Set(['name_age', 'contact', 'entry_status', 'ticket'])
    );

    // Extract Form Fields from Session
    const formFields = sessions?.[selectedSessionId]?.formSettings?.fields || [];

    // Standard Columns Definition
    const STANDARD_COLUMNS = [
        { id: 'name_age', label: '이름 / 나이', required: true },
        { id: 'contact', label: '연락처', required: false },
        { id: 'entry_status', label: '체크인', required: false },
        { id: 'deposit_status', label: '입금상태', required: false },
        { id: 'invite_status', label: '초대장발송', required: false },
        { id: 'ticket', label: '티켓 정보', required: false },
        { id: 'job', label: '직업', required: false },
        { id: 'location', label: '지역', required: false },
        { id: 'mbti', label: 'MBTI', required: false },
        { id: 'height', label: '키', required: false },
        { id: 'drinking', label: '음주', required: false },
        { id: 'smoking', label: '흡연', required: false },
        { id: 'religion', label: '종교', required: false },
    ];

    // Compute Available Columns (Strict Whitelist)
    const availableColumns = React.useMemo(() => {
        const cols = [...STANDARD_COLUMNS];

        // Dynamic fields processing removed per user request for strict whitelist.

        // Reorder if custom order exists
        if (columnOrder.length > 0) {
            const ordered: typeof STANDARD_COLUMNS = [];

            // 1. Add columns in custom order
            columnOrder.forEach(id => {
                const found = cols.find(c => c.id === id);
                if (found) ordered.push(found);
            });

            // 2. Add remaining columns (newly added or not yet ordered)
            cols.forEach(col => {
                if (!ordered.find(o => o.id === col.id)) {
                    ordered.push(col);
                }
            });
            return ordered;
        }

        return cols;
    }, [columnOrder]);

    // Compute Selected Columns for Table
    const tableColumns = React.useMemo(() => {
        // availableColumns is already ordered
        return availableColumns.filter(col => visibleColumnIds.has(col.id));
    }, [availableColumns, visibleColumnIds]);

    // Filter Users for this Session
    const activeSessionUsers = sessionUsers.length > 0 ? sessionUsers : Object.values(users).filter(u => u.sessionId === selectedSessionId);

    const handleColumnOrderChange = (newColumns: { id: string }[]) => {
        setColumnOrder(newColumns.map(c => c.id));
    };

    // Split by Gender
    const males = activeSessionUsers.filter(u => u.gender === 'M');
    const females = activeSessionUsers.filter(u => u.gender === 'F');

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
    }, [sessions, users]); // Recalculate only when users list changes

    const handleApprove = async (id: string) => {
        if (!actions?.approveApplicant) return;
        try {
            await actions.approveApplicant(id);
            toast.success("승인 처리되었습니다.");
            if (selectedUser && selectedUser.id === id) {
                setSelectedUser(prev => prev ? ({ ...prev, status: 'approved' }) : null);
            }
        } catch (error) {
            toast.error("승인 실패");
        }
    };

    const handleReject = async (id: string) => {
        if (!actions?.rejectApplicant) return;
        try {
            await actions.rejectApplicant(id);
            toast.success("거절 처리되었습니다.");
            if (selectedUser && selectedUser.id === id) {
                setSelectedUser(prev => prev ? ({ ...prev, status: 'rejected' }) : null);
            }
        } catch (error) {
            toast.error("거절 실패");
        }
    };

    const handleCancelRejection = async (id: string) => {
        if (!actions?.updateUser) return;
        try {
            await actions.updateUser(id, { status: 'approved' });
            toast.success("거절이 취소되었습니다.");
            if (selectedUser && selectedUser.id === id) {
                setSelectedUser(prev => prev ? ({ ...prev, status: 'approved' }) : null);
            }
        } catch (error) {
            toast.error("거절 취소 실패");
        }
    };

    const handleMoveSession = async (targetSessionId: string) => {
        if (!movingUser || !actions) return;

        const success = await actions.moveUserSession(movingUser.id, targetSessionId, movingUser.name);
        if (success) {
            toast.success(`${movingUser.name}님이 이동되었습니다.`);
            setMovingUser(null);
        } else {
            toast.error('이동에 실패했습니다.');
        }
    };

    // Layout Constants
    const structuralBorder = isDark ? 'border-slate-600' : 'border-gray-300';

    // [NEW] Selection Handlers
    const handleToggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleToggleSelectAll = (targetUsers: User[]) => {
        // If all targetUsers are selected, deselect them. Otherwise, select them all.
        const allTargetIds = targetUsers.map(u => u.id);
        const allSelected = allTargetIds.every(id => selectedIds.has(id));

        const newSelected = new Set(selectedIds);
        if (allSelected) {
            allTargetIds.forEach(id => newSelected.delete(id));
        } else {
            allTargetIds.forEach(id => newSelected.add(id));
        }
        setSelectedIds(newSelected);
    };



    const handleUpdateUser = async (updatedData: Partial<User>) => {
        if (!actions?.updateUser) return false;
        try {
            // Only send specific fields we allow updating? Or the whole object?
            // Usually best to send only what changed, but receiving the whole object from modal is simpler.
            // AdminProfileDetail sends the whole formData.
            // We should strip dynamic fields if necessary, but updateProfile('users', ...) handles it.
            // Important: 'answers' field in formData might be merged by useAdminActions if needed,
            // but updateProfile just does updateDoc.
            // Let's pass the whole object for now, or maybe just specific fields if we want to be safe.
            // For now, allow full update.
            if (!updatedData.id) throw new Error("User ID is missing");
            await actions.updateUser(updatedData.id, updatedData);
            return true;
        } catch (error) {
            console.error("Update User Failed:", error);
            return false;
        }
    };

    return (
        <div className="flex h-full overflow-hidden">
            {/* ... (Sidebar is same) ... */}
            <AdminSessionSidebar
                sessions={sessions}
                selectedSessionId={selectedSessionId}
                onSelectSession={onChangeSession}
                onAddSession={onAddSession || (() => { })}
                title="세션 선택"
                isDark={isDark}
                statsRenderer={(_session: Session, key: string, isSelected: boolean) => {
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

            {/* 2. Right Content Area */}
            <div className={`flex-1 flex flex-col min-w-0 ${isDark ? 'bg-[#0b1120]' : 'bg-slate-50'} transition-colors duration-300`}>
                {/* Header: Unified single-row bar */}
                <div className={`h-[72px] px-6 border-b ${structuralBorder} flex items-center justify-between shrink-0 gap-4 ${isDark ? 'bg-slate-900' : 'bg-white shadow-sm'}`}>
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div>
                            <h1 className={`text-xl font-bold ${textColor} truncate`}>
                                {sessions?.[selectedSessionId]?.title || '세션 선택'}
                            </h1>
                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-2`}>
                                <Calendar size={12} />
                                {sessions?.[selectedSessionId]?.date || '-'}
                            </div>
                        </div>
                    </div>

                    <DataControlToolbar
                        filterStatus={filterStatus}
                        onFilterChange={setFilterStatus}
                        filterOptions={[
                            { id: 'all', label: '전체' },
                            { id: 'paid', label: '완료/입금' },
                            { id: 'unpaid', label: '미입금' }
                        ]}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        isDark={isDark}
                        collapseBreakpoint="xl"
                        endContent={
                            <div className="flex items-center gap-2">

                                <button
                                    onClick={() => setIsSettingsModalOpen(true)}
                                    className={`p-2 rounded-lg transition-colors border shadow-sm ${isDark ? 'bg-slate-800 border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                    title="세션 설정"
                                >
                                    <Settings size={20} />
                                </button>
                                <button
                                    onClick={() => window.open(`/print/profiles?session=${selectedSessionId}`, '_blank')}
                                    className={`p-2 rounded-lg transition-colors border shadow-sm ${isDark ? 'bg-slate-800 border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                    title="프로필 카드 인쇄"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                </button>
                            </div>
                        }
                    />
                </div>

                {/* Unified Content Body Card */}
                <div className={`flex-1 flex overflow-hidden min-h-0 ${isDark ? 'bg-black/5' : 'bg-transparent'}`}>
                    <div className="flex-1 flex overflow-hidden">
                        <div className={`flex-1 flex overflow-hidden relative pr-[70px] ${isDark ? 'bg-slate-800/50' : 'bg-white'}`}>

                            {/* Main Content: Tables Split */}
                            <div className="flex-1 flex flex-col md:flex-row min-w-0">
                                {/* Male Column */}
                                <div className={`flex-1 flex flex-col overflow-hidden border-r ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                                    {isPartyMode ? (
                                        <PartyGuestTable
                                            users={males}
                                            tableName="남성 게스트"
                                            onSelectUser={(user) => setSelectedUser(user)}
                                            // @ts-ignore
                                            onMoveUser={(user) => setMovingUser(user)}
                                            selectedIds={selectedIds}
                                            onToggleSelect={handleToggleSelect}
                                            onToggleSelectAll={() => handleToggleSelectAll(males)}
                                            isDark={isDark}
                                            type="male"
                                            columns={tableColumns}
                                        />
                                    ) : (
                                        <div className="flex flex-col h-full overflow-hidden p-4">
                                            <RotationParticipantTable
                                                users={males}
                                                tableName={(() => {
                                                    const total = males.length;
                                                    const attending = males.filter(u => u.entry_status === 'checked_in').length;
                                                    const absent = total - attending;

                                                    return (
                                                        <div className="flex items-center justify-between w-full">
                                                            <span>남성 참가자</span>
                                                            <div className="flex items-center gap-2 text-xs font-medium opacity-80">
                                                                <span className="text-gray-400">전체 {total}</span>
                                                                <span className="text-gray-300">|</span>
                                                                <span className="text-blue-500">참가 {attending}</span>
                                                                <span className="text-gray-300">|</span>
                                                                <span className="text-red-400">미참가 {absent}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                                onSelectUser={(user) => setSelectedUser(user)}
                                                onMoveUser={(user) => setMovingUser(user)}
                                                selectedIds={selectedIds}
                                                onToggleSelect={handleToggleSelect}
                                                onToggleSelectAll={() => handleToggleSelectAll(males)}
                                                isDark={isDark}
                                                columns={tableColumns}
                                                hideCountHeader={true}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Female Column */}
                                <div className="flex-1 flex flex-col overflow-hidden">
                                    {isPartyMode ? (
                                        <PartyGuestTable
                                            users={females}
                                            tableName="여성 게스트"
                                            onSelectUser={(user) => setSelectedUser(user)}
                                            // @ts-ignore
                                            onMoveUser={(user) => setMovingUser(user)}
                                            selectedIds={selectedIds}
                                            onToggleSelect={handleToggleSelect}
                                            onToggleSelectAll={() => handleToggleSelectAll(females)}
                                            isDark={isDark}
                                            type="female"
                                            columns={tableColumns}
                                        />
                                    ) : (
                                        <div className="flex flex-col h-full overflow-hidden p-4">
                                            <RotationParticipantTable
                                                users={females}
                                                tableName={(() => {
                                                    const total = females.length;
                                                    const attending = females.filter(u => u.entry_status === 'checked_in').length;
                                                    const absent = total - attending;

                                                    return (
                                                        <div className="flex items-center justify-between w-full">
                                                            <span>여성 참가자</span>
                                                            <div className="flex items-center gap-2 text-xs font-medium opacity-80">
                                                                <span className="text-gray-400">전체 {total}</span>
                                                                <span className="text-gray-300">|</span>
                                                                <span className="text-pink-500">참가 {attending}</span>
                                                                <span className="text-gray-300">|</span>
                                                                <span className="text-red-400">미참가 {absent}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                                onSelectUser={(user) => setSelectedUser(user)}
                                                onMoveUser={(user) => setMovingUser(user)}
                                                selectedIds={selectedIds}
                                                onToggleSelect={handleToggleSelect}
                                                onToggleSelectAll={() => handleToggleSelectAll(females)}
                                                isDark={isDark}
                                                columns={tableColumns}
                                                hideCountHeader={true}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* [NEW] Smart Action Dock Integrated */}
                            {selectedSessionId && (
                                <AdminActionManager
                                    selectedIds={selectedIds}
                                    data={activeSessionUsers}
                                    actions={actions}
                                    type="guest"
                                    isDark={isDark}
                                    session={currentSession}
                                    onSelectionChange={setSelectedIds}
                                    hiddenActions={isPartyMode ? [] : ['check_in']}
                                    // @ts-ignore
                                    columnSettings={{
                                        allColumns: availableColumns,
                                        selectedColumnIds: visibleColumnIds,
                                        onOrderChange: handleColumnOrderChange,
                                        onSelectionChange: setVisibleColumnIds
                                    }}
                                    formFields={formFields}
                                    isVisible={true}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Move Session Modal */}
            <SessionMoveModal
                isOpen={!!movingUser}
                user={movingUser || undefined}
                sessions={sessions}
                currentSessionId={selectedSessionId}
                onMove={handleMoveSession}
                onClose={() => setMovingUser(null)}
            />

            {/* Detail Modal with Delete/Cancel Capability */}
            {
                selectedUser && (
                    <AdminProfileDetail
                        user={selectedUser}
                        formFields={formFields}
                        onClose={() => setSelectedUser(null)}
                        // @ts-ignore
                        isApplicant={false}
                        isDark={isDark}
                        onSave={handleUpdateUser}
                        onApprove={() => handleApprove(selectedUser.id)}
                        onReject={() => handleReject(selectedUser.id)}
                        onCancelRejection={() => handleCancelRejection(selectedUser.id)}
                        onSessionMove={() => {
                            setMovingUser(selectedUser);
                        }}
                        onCancelParticipation={async () => {
                            if (actions && actions.cancelUserParticipation) {
                                if (!window.confirm(`${selectedUser.name}님의 참가를 취소하시겠습니까?\n(사용자 목록에서 삭제되며, 신청 상태가 '거절'로 변경됩니다)`)) return;
                                const success = await actions.cancelUserParticipation(selectedUser.id);
                                if (success) {
                                    toast.success("참가가 취소되었습니다.");
                                    setSelectedUser(null);
                                } else {
                                    toast.error("취소 처리 실패");
                                }
                            }
                        }}
                        session={currentSession} // [NEW] Pass Session Context
                    />
                )
            }


            {/* Session Settings Modal */}
            <SessionSettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                session={sessions ? sessions[selectedSessionId] : null}
                actions={actions}
            />



            {/* Removed legacy Toast */}
        </div>
    );
};

export default AdminUserManagement;
