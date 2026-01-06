import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { Applicant } from '../../../types';
import MobileTableWrapper from './common/MobileTableWrapper';
import PartyApplicantTable from '../party/dashboard/PartyApplicantTable'; // Reusing this as it is generic enough
import AdminActionManager from '../common/AdminActionManager';
import ApplicantProfileDetail from '../common/ApplicantProfileDetail';
import SessionMoveModal from '../common/SessionMoveModal';
import { useColumnSettings } from '../../../hooks/useColumnSettings';

interface MobileApplicantManagementProps {
    isDark?: boolean;
    applicants?: Applicant[];
    sessionApplicants?: Applicant[];
    actions?: any;
    selectedSessionId: string;
    formFields?: any;
    sessions?: any;
}

const MobileApplicantManagement: React.FC<MobileApplicantManagementProps> = ({
    isDark,
    applicants = [],
    sessionApplicants = [],
    actions,
    selectedSessionId,
    formFields,
    sessions
}) => {
    // 1. Data Preparation
    // Sort logic: Pending first, then by Date Ascending (Oldest first)
    const sortedApplicants = useMemo(() => {
        const source = sessionApplicants.length > 0 ? sessionApplicants : applicants.filter(app => app.appliedSessionId === selectedSessionId);
        return [...source].sort((a, b) => {
            // 1. Status Priority: Pending first
            const isPendingA = a.status === 'pending';
            const isPendingB = b.status === 'pending';

            if (isPendingA && !isPendingB) return -1;
            if (!isPendingA && isPendingB) return 1;

            // 2. Date Order: Ascending (Oldest first)
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

            return dateA - dateB;
        });
    }, [applicants, sessionApplicants, selectedSessionId]);

    // 2. State
    const [filterType, setFilterType] = useState<'all' | 'male' | 'female'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Modal State
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [movingApplicant, setMovingApplicant] = useState<Applicant | null>(null);

    // 3. Filtering
    const filteredApplicants = useMemo(() => {
        return sortedApplicants.filter(user => {
            // Search
            if (searchTerm && isSearchVisible) {
                const lower = searchTerm.toLowerCase();
                const nameMatch = user.name?.toLowerCase().includes(lower);
                const phoneMatch = user.phone?.includes(lower) || user.phoneNumber?.includes(lower);
                if (!nameMatch && !phoneMatch) return false;
            }

            if (filterType === 'all') return true;
            if (filterType === 'male') return user.gender === 'M';
            if (filterType === 'female') return user.gender === 'F';
            return true;
        });
    }, [sortedApplicants, filterType, searchTerm, isSearchVisible]);

    // 4. Statistics
    const totalCount = sortedApplicants.length;
    const maleCount = sortedApplicants.filter(u => u.gender === 'M').length;
    const femaleCount = sortedApplicants.filter(u => u.gender === 'F').length;
    const pendingCount = sortedApplicants.filter(u => u.status === 'pending').length;
    const approvedCount = sortedApplicants.filter(u => u.status === 'approved').length;
    const unpaidCount = sortedApplicants.filter(u => !u.isDeposited).length;

    const stats = [
        { label: '전체', value: totalCount },
        { label: '대기', value: pendingCount, color: 'text-amber-500' },
        { label: '승인', value: approvedCount, color: 'text-green-500' },
        { label: '미입금', value: unpaidCount, color: 'text-red-500' },
    ];

    // 5. Tabs
    const tabLabels = [
        `전체 (${totalCount})`,
        `남성 (${maleCount})`,
        `여성 (${femaleCount})`
    ];

    const activeTabLabel = filterType === 'all' ? tabLabels[0] : (filterType === 'male' ? tabLabels[1] : tabLabels[2]);

    const handleTabChange = (label: string) => {
        if (label.includes('전체')) setFilterType('all');
        else if (label.includes('남성')) setFilterType('male');
        else if (label.includes('여성')) setFilterType('female');
        // Handle clicking current tab (maybe refresh?) but standard behavior is fine
        // If they click '전체' while on 'male', it sets to 'all'.
    };

    // 6. Formatting & Columns
    // [NEW] Column Settings Integration
    const { visibleColumnIds, columnOrder } = useColumnSettings(
        'applicant_columns',
        new Set(['name_age', 'contact', 'status', 'deposit_status', 'job'])
    );

    const STANDARD_COLUMNS = [
        { id: 'name_age', label: '이름 / 나이', required: true },
        { id: 'contact', label: '연락처', required: false },
        { id: 'status', label: '승인', required: false },
        { id: 'deposit_status', label: '입금', required: false },
        { id: 'invite_status', label: '초대', required: false },
        { id: 'ticket', label: '티켓', required: false },
        { id: 'job', label: '직업', required: false },
        { id: 'location', label: '지역', required: false },
        { id: 'mbti', label: 'MBTI', required: false },
        { id: 'height', label: '키', required: false },
        { id: 'drinking', label: '음주', required: false },
        { id: 'smoking', label: '흡연', required: false },
        { id: 'religion', label: '종교', required: false },
    ];

    const tableColumns = useMemo(() => {
        const cols = [...STANDARD_COLUMNS];
        let ordered = cols;

        if (columnOrder.length > 0) {
            ordered = [];
            columnOrder.forEach(id => {
                const found = cols.find(c => c.id === id);
                if (found) ordered.push(found);
            });
            cols.forEach(col => {
                if (!ordered.find(o => o.id === col.id)) ordered.push(col);
            });
        }
        return ordered.filter(col => visibleColumnIds.has(col.id));
    }, [columnOrder, visibleColumnIds]);


    // 7. Handlers
    const handleToggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleToggleSelectAll = () => {
        if (filteredApplicants.every(u => selectedIds.has(u.id))) {
            setSelectedIds(new Set());
        } else {
            const newSet = new Set(selectedIds);
            filteredApplicants.forEach(u => newSet.add(u.id));
            setSelectedIds(newSet);
        }
    };

    const handleApprove = async (id: string) => {
        if (!actions?.approveApplicant) return;
        await actions.approveApplicant(id);
        toast.success("승인 처리되었습니다.");
        setSelectedApplicant(null);
    };

    const handleReject = async (id: string) => {
        if (!actions?.rejectApplicant) return;
        await actions.rejectApplicant(id);
        toast.success("거절 처리되었습니다.");
        setSelectedApplicant(null);
    };

    const handleDelete = async (id: string) => {
        if (!actions?.deleteApplicant) return;
        await actions.deleteApplicant(id);
        toast.success("삭제되었습니다.");
        setSelectedApplicant(null);
    };

    const handleSave = async (updatedData: any) => {
        if (!actions?.updateApplicant) return false;
        return await actions.updateApplicant(updatedData.id, updatedData);
    };

    const handleMoveSession = async (targetSessionId: string) => {
        if (!movingApplicant || !actions?.moveApplicantSession) {
            toast.error("이동 기능 오류");
            setMovingApplicant(null);
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
        <>
            <MobileTableWrapper
                title="로테이션 신청자 관리"
                stats={stats}
                isDark={isDark}
                tabs={tabLabels}
                activeTab={activeTabLabel}
                onTabChange={handleTabChange}
            >
                <PartyApplicantTable
                    applicants={filteredApplicants}
                    tableName=""
                    isDark={isDark}
                    onSelectApplicant={setSelectedApplicant}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onToggleSelectAll={handleToggleSelectAll}
                    columns={tableColumns}
                    hideHeader={true}
                    onApprove={(app) => handleApprove(app.id)}
                    onReject={(app) => handleReject(app.id)}
                    groupByGender={filterType === 'all'}
                />
            </MobileTableWrapper>

            {/* Search Input Overlay (Bottom) */}
            {isSearchVisible && (
                <div className={`fixed bottom-[70px] left-0 right-0 p-4 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300 pointer-events-none`}>
                    <div className={`flex gap-2 items-center pointer-events-auto`}>
                        <div className={`relative flex-1 shadow-2xl rounded-2xl overflow-hidden border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="이름/전화번호 검색"
                                value={searchTerm}
                                autoFocus
                                onChange={e => setSearchTerm(e.target.value)}
                                className={`w-full pl-11 pr-10 py-3 text-base outline-none bg-transparent ${isDark ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-3 p-1 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                setIsSearchVisible(false);
                            }}
                            className={`px-4 py-3 rounded-xl font-bold text-sm shadow-lg whitespace-nowrap active:scale-95 transition-all ${isDark ? 'bg-slate-700 text-white' : 'bg-white text-gray-900 border border-gray-200'}`}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}

            <AdminActionManager
                type="applicant"
                selectedIds={selectedIds}
                data={sortedApplicants}
                actions={{
                    ...actions,
                }}
                // @ts-ignore
                onDockAction={(action) => {
                    if (action === 'search_toggle') setIsSearchVisible(prev => !prev);
                }}
                session={sessions ? sessions[selectedSessionId] : undefined}
                isDark={!!isDark}
                onSelectionChange={setSelectedIds}
                layout="bottom"
                activeActions={isSearchVisible ? ['search_toggle'] : []}
            />

            {/* Detail Modal */}
            {selectedApplicant && (
                <ApplicantProfileDetail
                    user={selectedApplicant as any}
                    onClose={() => setSelectedApplicant(null)}
                    onApprove={() => handleApprove(selectedApplicant.id)}
                    onReject={() => handleReject(selectedApplicant.id)}
                    onDelete={() => handleDelete(selectedApplicant.id)}
                    onSave={handleSave}
                    isDark={isDark}
                    formFields={formFields}
                    onSessionMove={() => {
                        setMovingApplicant(selectedApplicant);
                        setSelectedApplicant(null);
                    }}
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
        </>
    );
};

export default MobileApplicantManagement;
