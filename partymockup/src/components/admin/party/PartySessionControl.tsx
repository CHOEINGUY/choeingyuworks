import React, { useState, useMemo } from 'react';
import { Check, Calendar, Settings } from 'lucide-react';
import AdminSessionSidebar from '../common/AdminSessionSidebar';
import AdminProfileDetail from '../common/AdminProfileDetail';
import SessionSettingsModal from '../common/SessionSettingsModal';
import PartyGuestTable from './dashboard/PartyGuestTable';
import AdminActionManager from '../common/AdminActionManager';
import DataControlToolbar from '../common/DataControlToolbar';
import { Session, User } from '../../../types'; // Ensure correct import path

interface PartySessionControlProps {
    selectedSessionId: string;
    onChangeSession: (id: string) => void;
    sessions: Record<string, Session>;
    // sessionProps removed if unused
    isDark: boolean;
    actions: any;
    users: Record<string, User>;
    formFields: any[];
    onAddSession: () => void;
}

const PartySessionControl: React.FC<PartySessionControlProps> = ({
    selectedSessionId,
    onChangeSession,
    sessions,
    // sessionProps,
    isDark,
    actions,
    users = {},
    formFields = [],
    onAddSession
}) => {
    // ... existing code ...
    // Note: I will only replace the changed parts in subsequent chunks or rely on the tool to replace the whole file content if I passed the whole file content.
    // However, replace_file_content targets specific chunks. I will target the imports and the specific lines with errors.

    // This replacement chunk is too large/imprecise for replace_file_content if I want to target disjoint areas.
    // I will use multi_replace_file_content for PartySessionControl.tsx
    // -------------------------------------------------------------------------
    // 1. State
    // -------------------------------------------------------------------------
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, entered, not_entered
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    // [NEW] Bulk Action Selection State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // -------------------------------------------------------------------------
    // 2. Data Processing
    // -------------------------------------------------------------------------

    // Filter by Session
    const sessionUsers = useMemo(() => {
        return Object.values(users).filter(u => u.sessionId === selectedSessionId);
    }, [users, selectedSessionId]);

    // Filter Logic
    const filteredUsers = useMemo(() => {
        return sessionUsers.filter(user => {
            // Search
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                (user.name || '').toLowerCase().includes(searchLower) ||
                (user.phone || '').includes(searchTerm);
            if (!matchesSearch) return false;

            // Status Filter
            if (filterStatus === 'entered' && !user.isEntered) return false;
            if (filterStatus === 'not_entered' && user.isEntered) return false;

            return true;
        });
    }, [sessionUsers, searchTerm, filterStatus]);

    // Split by Gender
    const males = useMemo(() => filteredUsers.filter(u => u.gender === 'M'), [filteredUsers]);
    const females = useMemo(() => filteredUsers.filter(u => u.gender === 'F'), [filteredUsers]);

    // Stats
    const stats = useMemo(() => {
        const total = sessionUsers.length;
        const maleTotal = sessionUsers.filter(u => u.gender === 'M').length;
        const femaleTotal = sessionUsers.filter(u => u.gender === 'F').length;
        const entered = sessionUsers.filter(u => u.isEntered).length;
        const maleEntered = sessionUsers.filter(u => u.gender === 'M' && u.isEntered).length;
        const femaleEntered = sessionUsers.filter(u => u.gender === 'F' && u.isEntered).length;
        const paid = sessionUsers.filter(u => u.ticketStatus === 'paid' || u.isDeposited).length;
        return { total, maleTotal, femaleTotal, entered, maleEntered, femaleEntered, paid };
    }, [sessionUsers]);

    // -------------------------------------------------------------------------
    // 3. Handlers
    // -------------------------------------------------------------------------

    const handleUpdateUser = async (userId: string, data: Partial<User>) => {
        if (actions?.updateUser) {
            await actions.updateUser(userId, data);
        }
    };

    const handleToggleEntry = async (user: User) => {
        await handleUpdateUser(user.id, {
            isEntered: !user.isEntered,
            enteredAt: !user.isEntered ? new Date().toISOString() : null
        });
    };

    const handleSaveProfile = async (updatedData: User) => {
        if (actions?.updateUser) {
            await actions.updateUser(updatedData.id, updatedData);
            return true;
        }
        return false;
    };

    const handleCancelParticipation = async () => {
        if (selectedUser && actions?.cancelUserParticipation) {
            const success = await actions.cancelUserParticipation(selectedUser.id, selectedUser.name);
            if (success) {
                setSelectedUser(null);
            }
        }
    };

    // Selection Handlers
    const handleToggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedIds(newSelected);
    };

    const handleToggleSelectAll = (targetUsers: User[]) => {
        const targetIds = targetUsers.map(u => u.id);
        const allSelected = targetIds.every(id => selectedIds.has(id));
        const newSelected = new Set(selectedIds);

        targetIds.forEach(id => {
            if (allSelected) newSelected.delete(id);
            else newSelected.add(id);
        });
        setSelectedIds(newSelected);
    };



    // -------------------------------------------------------------------------
    // 4. Custom Column Definition
    // -------------------------------------------------------------------------
    const columns = [
        { id: 'name_age', label: '이름 / 나이' },
        { id: 'contact', label: '연락처' },
        { id: 'invite_status', label: '초대장' }, // [NEW] Added to show message status
        {
            id: 'ticket',
            label: '티켓',
            render: (user: User) => {
                let statusText = '미입금';
                let statusColor = 'text-red-500';

                if (user.isDeposited) {
                    statusText = '입금완료';
                    statusColor = 'text-green-500';
                } else if (user.paymentStatus === 'pending') {
                    statusText = '확인필요';
                    statusColor = 'text-orange-500';
                }

                return (
                    <div className="flex flex-col">
                        <span
                            className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} line-clamp-2 overflow-hidden text-ellipsis`}
                            title={user.ticketLabel || user.ticketType || '기본'}
                        >
                            {user.ticketLabel || user.ticketType || '기본'}
                        </span>
                        <span className={`text-[10px] ${statusColor}`}>
                            {statusText}
                        </span>
                    </div>
                );
            }
        },
        {
            id: 'entry_status',
            label: '입장 체크',
            render: (user: User) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggleEntry(user);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all border text-xs font-bold ${user.isEntered
                        ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                        : (isDark ? 'bg-slate-800 border-slate-600 text-gray-400 hover:border-purple-500' : 'bg-white border-gray-300 text-gray-500 hover:border-purple-500 hover:text-purple-600')
                        }`}
                >
                    {user.isEntered && <Check size={10} strokeWidth={4} />}
                    {user.isEntered ? '완료' : '입장'}
                </button>
            )
        }
    ];

    // Theme Classes
    const bgColor = isDark ? 'bg-slate-900' : 'bg-gray-50';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const structuralBorder = isDark ? 'border-slate-600' : 'border-gray-300';
    // const borderColor = isDark ? 'border-slate-700' : 'border-gray-200'; // Unused in main div style class construction (using literals) but used in sub-components? Sub-components use their own props usually or internal logic.
    // Checked usage: borderColor var was unused in return block, so I commented out.
    // Actually, toolbar uses it but hardcodes conditional logic inline or uses it?
    // Toolbar lines: className={`p-4 rounded-xl border mb-4 flex flex-wrap items-center justify-between gap-4 shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
    // So 'borderColor' const itself is unused.

    return (
        <div className="flex h-full overflow-hidden font-sans">
            {/* Sidebar */}
            <AdminSessionSidebar
                sessions={sessions}
                selectedSessionId={selectedSessionId}
                onSelectSession={onChangeSession}
                onAddSession={onAddSession}
                title="파티 세션 선택"
                isDark={isDark}
                statsRenderer={(_session: any, key: string, isSelected: boolean) => {
                    const sUsers = Object.values(users).filter(u => u.sessionId === key);
                    const total = sUsers.length;
                    const mCount = sUsers.filter(u => u.gender === 'M').length;
                    const fCount = sUsers.filter(u => u.gender === 'F').length;

                    return (
                        <div key={key} className="flex items-center justify-between w-full">
                            <span className={`text-xs ${isSelected ? 'text-white/90' : 'text-gray-400'} flex items-center gap-1.5`}>
                                <span>전체 {total}명</span>
                                <span className="opacity-30">|</span>
                                <span className={`${isSelected ? 'text-blue-200' : 'text-blue-600'}`}>남 {mCount}</span>
                                <span className="opacity-30">|</span>
                                <span className={`${isSelected ? 'text-pink-200' : 'text-pink-600'}`}>여 {fCount}</span>
                            </span>
                        </div>
                    );
                }}
            />

            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${bgColor} ${textColor}`}>

                {/* Header: Unified single-row bar */}
                <div className={`h-[72px] px-6 border-b ${structuralBorder} flex items-center justify-between shrink-0 gap-4 ${isDark ? 'bg-slate-900' : 'bg-white shadow-sm'}`}>
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div>
                            <h1 className={`text-xl font-bold ${textColor} truncate`}>
                                {sessions[selectedSessionId]?.title}
                            </h1>
                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-2`}>
                                <Calendar size={12} />
                                {sessions[selectedSessionId]?.date}
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="flex items-center gap-4 px-4 h-10 rounded-xl bg-transparent hidden md:flex">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-40">전체 게스트</span>
                            <span className="text-lg font-bold">{stats.total}</span>
                            <span className="text-xs opacity-60 font-medium">(
                                <span className={`${isDark ? 'text-gray-300' : 'text-gray-900'}`}>남 {stats.maleTotal}</span>
                                <span className="mx-1">/</span>
                                <span className={`${isDark ? 'text-gray-300' : 'text-gray-900'}`}>여 {stats.femaleTotal}</span>
                                )</span>
                        </div>
                        <div className={`w-px h-4 ${isDark ? 'bg-slate-700' : 'bg-gray-100'} opacity-50`}></div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-40">체크인</span>
                            <span className="text-lg font-bold text-purple-600">{stats.entered}</span>
                            <span className="text-xs opacity-60 font-medium">(
                                <span className={`${isDark ? 'text-gray-300' : 'text-gray-900'}`}>남 {stats.maleEntered}</span>
                                <span className="mx-1">/</span>
                                <span className={`${isDark ? 'text-gray-300' : 'text-gray-900'}`}>여 {stats.femaleEntered}</span>
                                )</span>
                        </div>
                    </div>

                    <DataControlToolbar
                        filterStatus={filterStatus}
                        onFilterChange={setFilterStatus}
                        filterOptions={[
                            { id: 'all', label: '전체' },
                            { id: 'entered', label: '입장완료' },
                            { id: 'not_entered', label: '미입장' }
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
                            </div>
                        }
                    />
                </div>

                {/* Main Content Area: Unified Card */}
                <div className={`flex-1 flex overflow-hidden min-h-0 ${isDark ? 'bg-black/5' : 'bg-transparent'}`}>
                    <div className="flex-1 flex overflow-hidden">
                        <div className={`flex-1 flex overflow-hidden relative pr-[70px] ${isDark ? 'bg-slate-800/50' : 'bg-white'}`}>

                            {/* Left: Inputs & Tables */}
                            <div className="flex-1 flex flex-col min-w-0">
                                {/* Tables Split View */}
                                <div className="flex-1 flex min-h-0 bg-transparent">
                                    {/* Male Column */}
                                    <div className={`flex-1 flex flex-col overflow-hidden border-r ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                                        <PartyGuestTable
                                            users={males}
                                            tableName="남성 게스트"
                                            onSelectUser={setSelectedUser}
                                            selectedIds={selectedIds}
                                            onToggleSelect={handleToggleSelect}
                                            onToggleSelectAll={() => handleToggleSelectAll(males)}
                                            isDark={isDark}
                                            columns={columns}
                                        />
                                    </div>

                                    {/* Female Column */}
                                    <div className="flex-1 flex flex-col overflow-hidden">
                                        <PartyGuestTable
                                            users={females}
                                            tableName="여성 게스트"
                                            onSelectUser={setSelectedUser}
                                            selectedIds={selectedIds}
                                            onToggleSelect={handleToggleSelect}
                                            onToggleSelectAll={() => handleToggleSelectAll(females)}
                                            isDark={isDark}
                                            columns={columns}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Smart Dock (Integrated) */}
                            <AdminActionManager
                                selectedIds={selectedIds}
                                data={sessionUsers}
                                actions={actions}
                                type="guest"
                                isDark={isDark}
                                session={sessions[selectedSessionId]}
                                onSelectionChange={setSelectedIds}
                                hiddenActions={[]}
                                formFields={formFields}
                            />
                        </div>
                    </div>

                    {/* Profile Detail Modal */}
                    {selectedUser && (
                        <AdminProfileDetail
                            user={selectedUser}
                            formFields={formFields}
                            onClose={() => setSelectedUser(null)}
                            isApplicant={false}
                            isDark={isDark}
                            onSave={handleSaveProfile}
                            onCancelParticipation={handleCancelParticipation}
                        />
                    )}




                    {/* Session Settings Modal */}
                    <SessionSettingsModal
                        isOpen={isSettingsModalOpen}
                        onClose={() => setIsSettingsModalOpen(false)}
                        session={sessions[selectedSessionId]}
                        actions={actions}
                    />
                </div>
            </div>
        </div>
    );
};

// Helper Sub-component

export default PartySessionControl;
