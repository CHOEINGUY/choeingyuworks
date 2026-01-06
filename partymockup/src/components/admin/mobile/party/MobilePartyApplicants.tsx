import React, { useState } from 'react';
import { Search } from 'lucide-react';
import MobileTableWrapper from '../common/MobileTableWrapper';
import PartyApplicantTable from '../../party/dashboard/PartyApplicantTable';
import AdminActionManager from '../../common/AdminActionManager';
import { User } from '../../../../types';
import { useColumnSettings } from '../../../../hooks/useColumnSettings';

interface MobilePartyApplicantsProps {
    applicants: User[];
    isDark?: boolean;
    onSelectApplicant: (user: User) => void;
    onApprove?: (user: User) => void;
    onReject?: (user: User) => void;
    actions: any;
    session?: any;
}

const MobilePartyApplicants: React.FC<MobilePartyApplicantsProps> = ({ applicants, isDark, onSelectApplicant, onApprove, onReject, actions, session }) => {
    // [NEW] Filter State
    const [filterType, setFilterType] = useState<'all' | 'male' | 'female'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // [NEW] Selection State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Counts Calculation
    const totalCount = applicants.length;
    const maleCount = applicants.filter(u => u.gender === 'M').length;
    const femaleCount = applicants.filter(u => u.gender === 'F').length;
    const pendingCount = applicants.filter(u => u.status === 'pending').length;
    const approvedCount = applicants.filter(u => u.status === 'approved').length;

    // [NEW] Search Visibility State
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    // Filter Logic
    const filteredApplicants = applicants.filter(user => {
        // Search
        if (searchTerm && isSearchVisible) {
            const lower = searchTerm.toLowerCase();
            if (!user.name?.toLowerCase().includes(lower) && !user.phone?.includes(lower)) return false;
        }

        if (filterType === 'all') return true;
        if (filterType === 'male') return user.gender === 'M';
        if (filterType === 'female') return user.gender === 'F';
        return true;
    });

    // Selection Handlers
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

    // Stats for Header
    const stats = [
        { label: '총원', value: totalCount },
        { label: '대기', value: pendingCount, color: 'text-amber-500' },
        { label: '승인', value: approvedCount, color: 'text-green-500' },
    ];

    // [NEW] Column Settings Integration
    const { visibleColumnIds, columnOrder } = useColumnSettings(
        'applicant_columns',
        new Set(['name_age', 'contact', 'status', 'ticket'])
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

    const tableColumns = React.useMemo(() => {
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

    // Dynamic Tab Labels
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
    };



    return (
        <>
            <MobileTableWrapper
                title="파티 신청자 관리"
                stats={stats}
                isDark={isDark}
                tabs={tabLabels}
                activeTab={activeTabLabel}
                onTabChange={handleTabChange}
            >
                {/* Search Bar Removed from top */}

                <PartyApplicantTable
                    applicants={filteredApplicants}
                    tableName=""
                    isDark={isDark}
                    onSelectApplicant={onSelectApplicant}
                    onApprove={onApprove}
                    onReject={onReject}
                    selectedIds={selectedIds}
                    onToggleSelect={handleToggleSelect}
                    onToggleSelectAll={handleToggleSelectAll}
                    columns={tableColumns}
                    hideHeader={true}
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
                        {/* [NEW] Close Button */}
                        <button
                            onClick={() => {
                                setIsSearchVisible(false);
                                setSearchTerm(''); // Optional: clear search on close? User might want to keep it. Let's keep it based on "filter" logic, but usually close means "I'm done". Let's NOT clear for now to act as toggle. Or maybe clear? The user said "stop searching". Let's just close.
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
                data={applicants}
                actions={{
                    ...actions,
                    // Intercepting 'search_toggle' by pretending it's an action, 
                    // BUT AdminActionManager doesn't call `actions.search_toggle()`. It handles string keys.
                    // We need to modify AdminActionManager to bubble unknown events or add a prop.
                    // Let's assume we will modify AdminActionManager to accept `onDockAction`.
                }}
                // Passing callback via a prop we will add to AdminActionManager
                // @ts-ignore
                onDockAction={(action) => {
                    if (action === 'search_toggle') setIsSearchVisible(prev => !prev);
                }}
                session={session}
                isDark={!!isDark}
                onSelectionChange={setSelectedIds}
                layout="bottom"
                activeActions={isSearchVisible ? ['search_toggle'] : []}
            />
        </>
    );
};

export default MobilePartyApplicants;
