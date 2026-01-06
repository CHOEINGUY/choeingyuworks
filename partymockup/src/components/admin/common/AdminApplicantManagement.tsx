import React, { useState } from 'react';
import { Calendar, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import RotationApplicantTable from '../rotation/RotationApplicantTable';
import ApplicantProfileDetail from './ApplicantProfileDetail';
import AdminSessionSidebar from './AdminSessionSidebar';
import SessionMoveModal from './SessionMoveModal';
import SessionSettingsModal from './SessionSettingsModal';
import PartyApplicantTable from '../party/dashboard/PartyApplicantTable';
import AdminActionManager from './AdminActionManager';
import DataControlToolbar from './DataControlToolbar';
import { toast } from 'sonner';
import ConfirmDialog from '../../common/ConfirmDialog';

import { useColumnSettings } from '../../../hooks/useColumnSettings';
import { Applicant, Session } from '../../../types';
import { FormField } from '../../../types/form';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase';

// Strict Action Interface matching AdminActionManager expectations
interface ApplicantActions {
    approveApplicant: (id: string) => Promise<boolean>;
    rejectApplicant: (id: string) => Promise<boolean>;
    updateApplicant: (id: string, data: Partial<Applicant>) => Promise<boolean>;
    updateUser: (id: string, data: Partial<Applicant>) => Promise<boolean>;
    deleteApplicant: (id: string) => Promise<boolean>;
    moveApplicantSession: (id: string, targetSessionId: string) => Promise<boolean>;
    // Session Actions needed for SessionSettingsModal
    updateSession?: (id: string, data: any) => Promise<boolean>;
    deleteSession?: (id: string) => Promise<boolean>;
    [key: string]: any; // Allow extensibility for other actions
}

interface AdminApplicantManagementProps {
    selectedSessionId: string;
    onChangeSession: (sessionId: string) => void;
    themeMode?: 'day' | 'night';
    applicants?: Applicant[];
    sessionApplicants?: Applicant[];
    actions: ApplicantActions; // Strict type
    sessions: Record<string, Session>;
    formFields?: FormField[]; // Strict type
    onAddSession?: () => void;
}

const AdminApplicantManagement: React.FC<AdminApplicantManagementProps> = ({ selectedSessionId, onChangeSession, themeMode = 'day', applicants = [], sessionApplicants = [], actions, sessions, formFields = [], onAddSession }) => {
    const isDark = themeMode === 'night';
    const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
    const structuralBorder = isDark ? 'border-slate-600' : 'border-gray-300';

    // Session Type Check
    const currentSession = sessions?.[selectedSessionId];
    const isPartyMode = currentSession?.type === 'PARTY';

    // Fallback if sessionApplicants is not passed (or empty initially)
    const activeApplicants = sessionApplicants.length > 0 ? sessionApplicants : applicants.filter(a => a.appliedSessionId === selectedSessionId);

    // [OPTIMIZATION] Memoize Session Stats Calculation
    const sessionStats = React.useMemo(() => {
        const stats: Record<string, { total: number; pending: number; maleApproved: number; femaleApproved: number }> = {};
        if (!sessions) return stats;

        Object.keys(sessions).forEach(sessionId => {
            // Filter applicants for this session
            const sessionApps = applicants.filter(a => a.appliedSessionId === sessionId);
            const total = sessionApps.length;
            const pending = sessionApps.filter(a => a.status === 'pending').length;
            const maleApproved = sessionApps.filter(a => a.gender === 'M' && a.status === 'approved').length;
            const femaleApproved = sessionApps.filter(a => a.gender === 'F' && a.status === 'approved').length;

            stats[sessionId] = { total, pending, maleApproved, femaleApproved };
        });
        return stats;
    }, [sessions, applicants]); // Recalculate only when sessions or applicants list changes

    const [filterStatus, setFilterStatus] = useState<string>('all'); // all, pending, approved, rejected
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null); // For detail modal
    const [movingApplicant, setMovingApplicant] = useState<Applicant | null>(null); // For session move
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isRejectedExpanded, setIsRejectedExpanded] = useState(false);

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
        'applicant_columns',
        new Set(['name_age', 'contact', 'status', 'ticket'])
    );

    const [dialog, setDialog] = useState<{ isOpen: boolean; title: string; message: string; onConfirm?: () => Promise<void> | void; isDestructive?: boolean; confirmText?: string }>({ isOpen: false, title: '', message: '', onConfirm: undefined, isDestructive: false });


    // Standard Columns Definition
    const STANDARD_COLUMNS = [
        { id: 'name_age', label: '이름 / 나이', required: true },
        { id: 'contact', label: '연락처', required: false },
        { id: 'status', label: '승인상태', required: false }, // Approval/Rejection
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
        // Start with standard columns
        const cols = [...STANDARD_COLUMNS];

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

    const handleColumnOrderChange = (newColumns: { id: string }[]) => {
        setColumnOrder(newColumns.map(c => c.id));
    };

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

    const handleToggleSelectAll = (targetApplicants: Applicant[]) => {
        const allTargetIds = targetApplicants.map(a => a.id);
        const allSelected = allTargetIds.every(id => selectedIds.has(id));

        const newSelected = new Set(selectedIds);
        if (allSelected) {
            allTargetIds.forEach(id => newSelected.delete(id));
        } else {
            allTargetIds.forEach(id => newSelected.add(id));
        }
        setSelectedIds(newSelected);
    };


    // --- Handlers ---

    // Handle Approve
    const handleApprove = async (applicantId: string) => {
        if (!actions?.approveApplicant) return;

        try {
            await actions.approveApplicant(applicantId);
            toast.success("신청자를 승인했습니다.");
            if (selectedApplicant && selectedApplicant.id === applicantId) {
                setSelectedApplicant(prev => prev ? ({ ...prev, status: 'approved' }) : null);
            }
        } catch (error) {
            console.error(error);
            toast.error("승인 처리에 실패했습니다.");
        }
    };

    // Handle Reject
    const handleReject = async (applicantId: string) => {
        if (!actions?.rejectApplicant) return;

        try {
            await actions.rejectApplicant(applicantId);
            toast.success("신청자를 거절했습니다.");
            if (selectedApplicant && selectedApplicant.id === applicantId) {
                setSelectedApplicant(prev => prev ? ({ ...prev, status: 'rejected' }) : null);
            }
        } catch (error) {
            toast.error("거절 처리에 실패했습니다.");
        }
    };

    // Handle Cancel Rejection
    const handleCancelRejection = async (applicantId: string) => {
        if (!actions?.updateApplicant) return;

        try {
            await actions.updateApplicant(applicantId, { status: 'pending' });
            toast.success("거절이 취소되었습니다. (대기 상태로 변경)");
            if (selectedApplicant && selectedApplicant.id === applicantId) {
                setSelectedApplicant(prev => prev ? ({ ...prev, status: 'pending' }) : null);
            }
        } catch (error) {
            console.error(error);
            toast.error("거절 취소 실패");
        }
    };

    // Handle Update Profile
    const handleUpdateProfile = async (arg1: string | Applicant, arg2?: Partial<Applicant>) => {
        if (!actions?.updateUser) return false; // Use updateUser for consistency

        let id: string;
        let updates: Partial<Applicant>;

        if (typeof arg1 === 'object' && arg1.id) {
            id = arg1.id;
            updates = arg1;
        } else {
            id = arg1 as string;
            updates = arg2 as Partial<Applicant>;
        }

        if (!id) { // Ensure ID exists for update
            toast.error("업데이트할 사용자 ID가 없습니다.");
            return false;
        }

        try {
            await actions.updateUser(id, updates);
            toast.success("프로필이 업데이트되었습니다.");
            // Update local selected state if it's the same user
            if (selectedApplicant && selectedApplicant.id === id) {
                setSelectedApplicant(prev => prev ? ({ ...prev, ...updates }) : null);
            }
            return true;
        } catch (error) {
            toast.error("업데이트 실패");
            return false;
        }
    };

    // [NEW] Handle Create Applicant
    const handleCreateApplicant = async (data: Applicant) => {
        try {
            // Remove 'id' if it is 'new_applicant' or let Firestore generate one
            const { id: _, ...newApplicantData } = data;

            // Add metadata
            const payload = {
                ...newApplicantData,
                appliedSessionId: selectedSessionId,
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, 'users'), payload);

            toast.success("새로운 참가자가 추가되었습니다.");
            setSelectedApplicant(null); // Close modal
            return true;
        } catch (error) {
            console.error("Creation failed", error);
            toast.error("참가자 추가 실패");
            return false;
        }
    };

    // Handle Delete (optional, if needed)
    const handleDeleteApplicant = async (id: string) => {
        if (!actions?.deleteApplicant) return;
        if (window.confirm("정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            try {
                await actions.deleteApplicant(id);
                toast.success("신청자가 삭제되었습니다.");
                setSelectedApplicant(null);
            } catch (error) {
                toast.error("삭제 실패");
            }
        }
    };

    // Handle Move Session
    const handleMoveSession = async (targetSessionId: string) => {
        if (!movingApplicant || !actions?.moveApplicantSession) {
            return;
        }

        try {
            await actions.moveApplicantSession(movingApplicant.id, targetSessionId);
            toast.success("신청자가 이동되었습니다.");
            setMovingApplicant(null);
        } catch (error: any) {
            toast.error("세션 이동 실패: " + error.message);
        }
    };

    return (
        <div className="flex h-full overflow-hidden">
            {/* 1. Left Column: Session List */}
            <AdminSessionSidebar
                sessions={sessions}
                selectedSessionId={selectedSessionId}
                onSelectSession={onChangeSession}
                onAddSession={onAddSession || (() => { })} // Safe fallback
                title="세션 선택"
                isDark={isDark}
                statsRenderer={(_session: Session, key: string, isSelected: boolean) => {
                    const stats = sessionStats[key] || { total: 0, pending: 0, maleApproved: 0, femaleApproved: 0 };
                    const { total, pending, maleApproved, femaleApproved } = stats;

                    return (
                        <div className="flex items-center justify-between w-full">
                            <span className={`text-xs ${isSelected ? 'text-white/90' : 'text-gray-400'} flex items-center gap-1.5`}>
                                <span>전체 {total}명</span>
                                <span className="opacity-30">|</span>
                                <span className={`${isSelected ? 'text-blue-200' : 'text-blue-600'}`}>남 {maleApproved}</span>
                                <span className="opacity-30">|</span>
                                <span className={`${isSelected ? 'text-pink-200' : 'text-pink-600'}`}>여 {femaleApproved}</span>
                            </span>
                            {pending > 0 && (
                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-yellow-400 text-yellow-900' : 'bg-yellow-100 text-yellow-700'}`}>
                                    +{pending}
                                </span>
                            )}
                        </div>
                    );
                }}
            />

            {/* 2. Right Column: Main Content */}
            <div className={`flex-1 flex flex-col min-w-0 ${isDark ? 'bg-[#0b1120]' : 'bg-slate-50'} transition-colors duration-300`}>
                {/* Header */}
                <div className={`h-[72px] px-6 border-b ${structuralBorder} flex items-center justify-between shrink-0 gap-4 ${isDark ? 'bg-slate-900' : 'bg-white shadow-sm'}`}>
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div>
                            <h1 className={`text-xl font-bold ${textColor} truncate`}>
                                {sessions && sessions[selectedSessionId]?.title ? sessions[selectedSessionId].title : '세션을 선택해주세요'}
                            </h1>
                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-2`}>
                                <Calendar size={12} />
                                {sessions && sessions[selectedSessionId]?.date ? sessions[selectedSessionId].date : '-'}
                            </div>
                        </div>
                    </div>


                    {/* Filters & Actions (Refactored to DataControlToolbar) */}
                    <DataControlToolbar
                        filterStatus={filterStatus}
                        onFilterChange={setFilterStatus}
                        filterOptions={[
                            { id: 'all', label: '전체' },
                            { id: 'pending', label: '대기' },
                            { id: 'approved', label: '승인' },
                            { id: 'rejected', label: '거절' }
                        ]}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        isDark={isDark}
                        collapseBreakpoint="xl"
                        endContent={
                            <button
                                onClick={() => setIsSettingsModalOpen(true)}
                                className={`p-2 rounded-lg transition-colors border shadow-sm ${isDark ? 'bg-slate-800 border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                title="세션 설정"
                            >
                                <Settings size={20} />
                            </button>
                        }
                    />
                </div>

                {/* Unified Content Body Card */}
                <div className={`flex-1 flex overflow-hidden min-h-0 ${isDark ? 'bg-black/5' : 'bg-transparent'}`}>
                    <div className="flex-1 flex overflow-hidden">
                        <div className={`flex-1 flex overflow-hidden relative pr-[70px] ${isDark ? 'bg-slate-800/50' : 'bg-white'}`}>
                            {selectedSessionId ? (
                                <div className="h-full flex-1 flex gap-0">
                                    {/* Male Column */}
                                    <div className={`flex-1 flex flex-col min-w-0 border-r ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                                        {isPartyMode ? (
                                            <PartyApplicantTable
                                                applicants={activeApplicants.filter(a => a.gender === 'M')}
                                                tableName="남성 신청자"
                                                type="male"
                                                onSelectApplicant={setSelectedApplicant}
                                                selectedIds={selectedIds}
                                                onToggleSelect={handleToggleSelect}
                                                onToggleSelectAll={() => handleToggleSelectAll(activeApplicants.filter(a => a.gender === 'M'))}
                                                isDark={isDark}
                                                columns={tableColumns}
                                            />
                                        ) : (
                                            <div className="flex-1 flex flex-col overflow-hidden bg-transparent p-4">
                                                {/* Male Active */}
                                                <div className="flex-1 overflow-auto scrollbar-thin">
                                                    <RotationApplicantTable
                                                        applicants={activeApplicants.filter(app => {
                                                            if (app.gender !== 'M') return false;
                                                            if (filterStatus !== 'all' && app.status !== filterStatus) return false;
                                                            // Hide rejected in main list if 'all' is selected (because they are in the bottom section)
                                                            // If specific status 'rejected' is selected, show them here.
                                                            if (app.status === 'rejected' && filterStatus === 'all') return false;
                                                            if (searchTerm) {
                                                                const term = searchTerm.toLowerCase();
                                                                return (app.name && app.name.toLowerCase().includes(term)) || (app.phone && app.phone.includes(term));
                                                            }
                                                            return true;
                                                        })}
                                                        tableName={(() => {
                                                            const maleApps = activeApplicants.filter(a => a.gender === 'M');
                                                            const approved = maleApps.filter(a => a.status === 'approved').length;
                                                            const pending = maleApps.filter(a => a.status === 'pending').length;
                                                            const unpaid = maleApps.filter(a => !a.isDeposited).length; // Assuming isDeposited is true/false/undefined

                                                            return (
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span>남성 신청자</span>
                                                                    <div className="flex items-center gap-2 text-xs font-medium opacity-80">
                                                                        <span className="text-blue-500">승인 {approved}</span>
                                                                        <span className="text-gray-300">|</span>
                                                                        <span className="text-yellow-600">대기 {pending}</span>
                                                                        <span className="text-gray-300">|</span>
                                                                        <span className="text-red-500">미입금 {unpaid}</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}
                                                        onSelectApplicant={setSelectedApplicant}
                                                        selectedIds={selectedIds}
                                                        onToggleSelect={handleToggleSelect}
                                                        onToggleSelectAll={() => handleToggleSelectAll(activeApplicants.filter(a => a.gender === 'M'))}
                                                        isDark={isDark}
                                                        columns={tableColumns}
                                                        hideCountHeader={true}
                                                    />

                                                    {/* Male Rejected (Collapsible) ... (unchanged) */}
                                                    {filterStatus === 'all' && activeApplicants.filter(app => app.gender === 'M' && app.status === 'rejected').length > 0 && (
                                                        <div className="mt-8">
                                                            <button
                                                                onClick={() => setIsRejectedExpanded(!isRejectedExpanded)}
                                                                className={`flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                                                            >
                                                                {isRejectedExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                                거절됨 ({activeApplicants.filter(app => app.gender === 'M' && app.status === 'rejected').length})
                                                            </button>
                                                            {isRejectedExpanded && (
                                                                <div className="opacity-60 grayscale-[0.5]">
                                                                    <RotationApplicantTable
                                                                        applicants={activeApplicants.filter(app => app.gender === 'M' && app.status === 'rejected')}
                                                                        tableName=""
                                                                        onSelectApplicant={setSelectedApplicant}
                                                                        selectedIds={selectedIds}
                                                                        onToggleSelect={handleToggleSelect}
                                                                        onToggleSelectAll={() => handleToggleSelectAll(activeApplicants.filter(a => a.gender === 'M' && a.status === 'rejected'))}
                                                                        isDark={isDark}
                                                                        columns={tableColumns}
                                                                        hideCountHeader={true}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Female Column */}
                                    <div className="flex-1 flex flex-col min-w-0">
                                        {isPartyMode ? (
                                            <PartyApplicantTable
                                                applicants={activeApplicants.filter(a => a.gender === 'F')}
                                                tableName="여성 신청자"
                                                type="female"
                                                onSelectApplicant={setSelectedApplicant}
                                                selectedIds={selectedIds}
                                                onToggleSelect={handleToggleSelect}
                                                onToggleSelectAll={() => handleToggleSelectAll(activeApplicants.filter(a => a.gender === 'F'))}
                                                isDark={isDark}
                                                columns={tableColumns}
                                            />
                                        ) : (
                                            <div className="flex-1 flex flex-col overflow-hidden bg-transparent p-4">
                                                {/* Female Active */}
                                                <div className="flex-1 overflow-auto scrollbar-thin">
                                                    <RotationApplicantTable
                                                        applicants={activeApplicants.filter(app => {
                                                            if (app.gender !== 'F') return false;
                                                            if (filterStatus !== 'all' && app.status !== filterStatus) return false;
                                                            if (app.status === 'rejected' && filterStatus === 'all') return false;
                                                            if (searchTerm) {
                                                                const term = searchTerm.toLowerCase();
                                                                return (app.name && app.name.toLowerCase().includes(term)) || (app.phone && app.phone.includes(term));
                                                            }
                                                            return true;
                                                        })}
                                                        tableName={(() => {
                                                            const femaleApps = activeApplicants.filter(a => a.gender === 'F');
                                                            const approved = femaleApps.filter(a => a.status === 'approved').length;
                                                            const pending = femaleApps.filter(a => a.status === 'pending').length;
                                                            const unpaid = femaleApps.filter(a => !a.isDeposited).length;

                                                            return (
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span>여성 신청자</span>
                                                                    <div className="flex items-center gap-2 text-xs font-medium opacity-80">
                                                                        <span className="text-blue-500">승인 {approved}</span>
                                                                        <span className="text-gray-300">|</span>
                                                                        <span className="text-yellow-600">대기 {pending}</span>
                                                                        <span className="text-gray-300">|</span>
                                                                        <span className="text-red-500">미입금 {unpaid}</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}
                                                        onSelectApplicant={setSelectedApplicant}
                                                        selectedIds={selectedIds}
                                                        onToggleSelect={handleToggleSelect}
                                                        onToggleSelectAll={() => handleToggleSelectAll(activeApplicants.filter(a => a.gender === 'F'))}
                                                        isDark={isDark}
                                                        columns={tableColumns}
                                                        hideCountHeader={true}
                                                    />

                                                    {/* Female Rejected (Collapsible) */}
                                                    {filterStatus === 'all' && activeApplicants.filter(app => app.gender === 'F' && app.status === 'rejected').length > 0 && (
                                                        <div className="mt-8">
                                                            <button
                                                                onClick={() => setIsRejectedExpanded(!isRejectedExpanded)}
                                                                className={`flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                                                            >
                                                                {isRejectedExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                                거절됨 ({activeApplicants.filter(app => app.gender === 'F' && app.status === 'rejected').length})
                                                            </button>
                                                            {isRejectedExpanded && (
                                                                <div className="opacity-60 grayscale-[0.5]">
                                                                    <RotationApplicantTable
                                                                        applicants={activeApplicants.filter(app => app.gender === 'F' && app.status === 'rejected')}
                                                                        tableName=""
                                                                        onSelectApplicant={setSelectedApplicant}
                                                                        selectedIds={selectedIds}
                                                                        onToggleSelect={handleToggleSelect}
                                                                        onToggleSelectAll={() => handleToggleSelectAll(activeApplicants.filter(a => a.gender === 'F' && a.status === 'rejected'))}
                                                                        isDark={isDark}
                                                                        columns={tableColumns}
                                                                        hideCountHeader={true}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Integrated Action Dock */}
                                    <AdminActionManager
                                        selectedIds={selectedIds}
                                        data={activeApplicants}
                                        actions={actions}
                                        type="applicant"
                                        isDark={isDark}
                                        session={currentSession}
                                        onSelectionChange={setSelectedIds}
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
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-60">
                                    <Calendar size={48} className="mb-4 text-gray-300" />
                                    <p className="text-lg font-medium">관리할 세션을 선택해주세요</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {selectedApplicant && (
                    <ApplicantProfileDetail
                        user={selectedApplicant}
                        formFields={formFields} // Pass Prop directly
                        onClose={() => setSelectedApplicant(null)}
                        onApprove={() => selectedApplicant && handleApprove(selectedApplicant.id)}
                        onReject={() => selectedApplicant && handleReject(selectedApplicant.id)}
                        onCancelRejection={() => selectedApplicant && handleCancelRejection(selectedApplicant.id)}
                        onDelete={() => selectedApplicant && handleDeleteApplicant(selectedApplicant.id)}
                        onSave={selectedApplicant.id === 'new_applicant' ? handleCreateApplicant : handleUpdateProfile}
                        onSessionMove={() => {
                            setMovingApplicant(selectedApplicant);
                        }}
                        isDark={isDark}
                        initialIsEditing={selectedApplicant.id === 'new_applicant'}
                        session={currentSession} // [NEW] Pass Session Context
                    />
                )}

                {/* Move Session Modal */}
                <SessionMoveModal
                    isOpen={!!movingApplicant}
                    user={movingApplicant || undefined}
                    sessions={sessions}
                    currentSessionId={selectedSessionId}
                    onMove={handleMoveSession}
                    onClose={() => setMovingApplicant(null)}
                />

                {/* Session Settings Modal */}
                <SessionSettingsModal
                    isOpen={isSettingsModalOpen}
                    onClose={() => setIsSettingsModalOpen(false)}
                    session={sessions ? sessions[selectedSessionId] : null}
                    actions={actions}
                />

                {/* Notification Components */}
                <ConfirmDialog
                    isOpen={dialog.isOpen}
                    title={dialog.title}
                    message={dialog.message}
                    confirmText={dialog.confirmText}
                    isDestructive={dialog.isDestructive}
                    onConfirm={() => { dialog.onConfirm && dialog.onConfirm(); }}
                    onCancel={() => setDialog({ ...dialog, isOpen: false })}
                />
            </div>
        </div>
    );
};

export default AdminApplicantManagement;
