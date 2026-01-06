import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import PremiumApplicantTable from './PremiumApplicantTable';
import ApplicantProfileDetail from '../common/ApplicantProfileDetail';
import SmartActionDock from '../common/SmartActionDock';
import { Applicant } from '../../../types';
import { useAdminMessageActions } from '../../../hooks/useAdminMessageActions';
import { toast } from 'sonner';

interface PremiumInboxProps {
    isDark?: boolean;
    applicants?: Applicant[];
    actions?: {
        approveApplicant: (id: string) => Promise<void>;
        rejectApplicant: (id: string) => Promise<void>;
        updateApplicant: (id: string, data: any) => Promise<void>;
        deleteApplicant: (id: string) => Promise<void>;
        submitApplication?: (data: any) => Promise<void>;
        [key: string]: any;
    };
}

interface FilterState {
    status: string;
    minAge: string;
    maxAge: string;
    location: string;
    job: string;
}

const PremiumInbox: React.FC<PremiumInboxProps> = ({ isDark, applicants = [], actions }) => {
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    // Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        status: 'all', // all, pending, approved, rejected
        minAge: '',
        maxAge: '',
        location: '',
        job: ''
    });

    // Helper: Calculate Age
    const getAge = (birthDate?: string | number) => {
        if (!birthDate) return 0;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // --- Data Split & Filtering ---
    const {
        maleApplicants, femaleApplicants,
        rejectedMaleApplicants, rejectedFemaleApplicants,
        maleCount, femaleCount,
        rejectedCount
    } = useMemo(() => {
        let filtered = applicants;

        // 1. Search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(app =>
                (app.name && app.name.toLowerCase().includes(term)) ||
                (app.phone && app.phone.includes(term))
            );
        }

        // 2. Advanced Filters (Status, Location, Job, Age)
        if (filters.status !== 'all') {
            filtered = filtered.filter(app => (app as any).status === filters.status);
        }
        if (filters.location) {
            filtered = filtered.filter(app => app.location && app.location.includes(filters.location));
        }
        if (filters.job) {
            filtered = filtered.filter(app => app.job && app.job.includes(filters.job));
        }
        if (filters.minAge || filters.maxAge) {
            filtered = filtered.filter(app => {
                const age = getAge(app.birthDate);
                if (filters.minAge && age < parseInt(filters.minAge)) return false;
                if (filters.maxAge && age > parseInt(filters.maxAge)) return false;
                return true;
            });
        }

        // 3. Status-based Separation (Only if searching 'all' or no specific status filter)
        // We want to exclude rejected from the main list by default
        const activeList = filters.status === 'all'
            ? filtered.filter(app => (app as any).status !== 'rejected')
            : filtered;

        const rejectedList = filters.status === 'all'
            ? filtered.filter(app => (app as any).status === 'rejected')
            : [];

        // 4. Split by Gender
        const male = activeList.filter(app => app.gender === 'M');
        const female = activeList.filter(app => app.gender === 'F');
        const rejMale = rejectedList.filter(app => app.gender === 'M');
        const rejFemale = rejectedList.filter(app => app.gender === 'F');

        return {
            maleApplicants: male,
            femaleApplicants: female,
            rejectedMaleApplicants: rejMale,
            rejectedFemaleApplicants: rejFemale,
            maleCount: male.length,
            femaleCount: female.length
        };
    }, [applicants, searchTerm, filters]);

    const [isRejectedExpanded, setIsRejectedExpanded] = useState(false);

    // --- Selection Handlers ---
    const handleToggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
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

    // --- Message Hooks ---
    const { executeMessageAction } = useAdminMessageActions(
        (msg, type) => type === 'error' ? toast.error(msg) : toast.success(msg)
    );

    // --- Action Handlers ---
    const handleAction = async (actionFn: any, id: string, updates?: any) => {
        if (!actionFn) return;
        await actionFn(id, updates);

        // Update local selected state if viewing detail
        if (selectedApplicant?.id === id) {
            if (updates) setSelectedApplicant(prev => prev ? ({ ...prev, ...updates }) : null);
        }
    };

    const handleApprove = async (id: string) => {
        // [MODIFIED] Removed window.confirm for faster workflow
        // 1. Approve Logic
        await handleAction(actions?.approveApplicant, id);
        // [NEW] Grant Initial Ticket
        if (actions?.updatePremiumApplicant) {
            await actions.updatePremiumApplicant(id, { ticketCount: 1 });
        }
        toast.success("승인되었습니다", { description: "프로필 요청 메시지가 발송됩니다." });

        // 2. Message Logic
        const target = applicants.find(a => a.id === id); // Find from full list
        if (target) {
            await executeMessageAction('request_profile', target, { serviceType: 'PREMIUM' });
        }
    };

    // const handleApprove = (id: string) => handleAction(actions?.approveApplicant, id); // OLD
    const handleReject = async (id: string) => {
        await handleAction(actions?.rejectApplicant, id);
        toast.info("반려되었습니다");
    };
    const handleCancelRejection = async (id: string) => {
        await handleAction(actions?.updateApplicant, id, { status: 'pending' });
        toast.success("반려 취소되었습니다");
    };
    const handleSaveProfile = async (id: string, data: any) => {
        await handleAction(actions?.updateApplicant, id, data);
        return true;
    };
    const handleDelete = async (id: string) => {
        if (actions?.deleteApplicant && window.confirm("정말 삭제하시겠습니까? (복구 불가)")) {
            await actions.deleteApplicant(id);
            setSelectedApplicant(null);
            toast.error("삭제되었습니다");
        }
    };

    // --- Dock Action Handler ---
    const handleDockAction = async (actionType: string) => {
        if (selectedIds.size === 0) return;

        const ids = Array.from(selectedIds);

        if (actionType === 'approve') {
            if (window.confirm(`${ids.length}명을 승인 및 프로필 요청하시겠습니까?`)) {
                for (const id of ids) {
                    await actions?.approveApplicant(id);
                    // Send Message
                    const target = applicants.find(a => a.id === id);
                    if (target) {
                        await executeMessageAction('request_profile', target, { serviceType: 'PREMIUM' });
                    }
                }
                setSelectedIds(new Set()); // Clear selection
            }
        } else if (actionType === 'reject') {
            if (window.confirm(`${ids.length}명을 거절하시겠습니까?`)) {
                for (const id of ids) {
                    await actions?.rejectApplicant(id);
                }
                setSelectedIds(new Set());
            }
        }
    };



    // Columns
    const inboxColumns = [
        { id: 'name_age', label: '이름/나이' },
        { id: 'job', label: '직업' },
        { id: 'location', label: '지역' },
        { id: 'status', label: '상태' },
    ];

    return (
        <div className={`h-full flex flex-col relative pr-[70px] ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            {/* 1. Top Bar: Minimalist Toolbar */}
            <div className={`shrink-0 px-6 py-4 flex items-center justify-between border-b ${isDark ? 'bg-slate-800/50 border-gray-800' : 'bg-gray-100 border-gray-400'}`}>
                {/* Left: Search & Filters */}
                <div className="flex items-center gap-6">
                    <h2 className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>신청 접수</h2>

                    {/* Divider */}
                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />

                    {/* Search Field (Clean & Wide) */}
                    <div className="relative group">
                        <Search className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-gray-500 group-focus-within:text-gray-300' : 'text-gray-400 group-focus-within:text-gray-600'}`} size={16} />
                        <input
                            type="text"
                            placeholder="이름, 연락처 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-7 py-2 w-64 bg-transparent border-b outline-none text-sm transition-all focus:w-80 ${isDark
                                ? 'border-gray-700 text-gray-200 placeholder-gray-600 focus:border-gray-500'
                                : 'border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400'
                                }`}
                        />
                    </div>

                    {/* Quick Stats (Text Only) */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span>전체</span>
                            <strong className={isDark ? 'text-gray-200' : 'text-gray-900'}>{applicants.length}</strong>
                        </div>
                        <div className={`flex items-center gap-1.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                            <span className="opacity-70">남</span>
                            <strong>{maleCount}</strong>
                        </div>
                        <div className={`flex items-center gap-1.5 ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>
                            <span className="opacity-70">여</span>
                            <strong>{femaleCount}</strong>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Filter Toggle (Text Button) */}
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isFilterOpen
                            ? (isDark ? 'text-gray-100 bg-gray-800' : 'text-gray-900 bg-gray-100')
                            : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800')
                            }`}>
                        <Filter size={14} />
                        <span>필터</span>
                    </button>

                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1" />


                </div>
            </div>

            {/* Collapsible Filter Panel (Minimal) */}
            {isFilterOpen && (
                <div className={`px-6 py-4 border-b grid grid-cols-4 gap-8 animate-in slide-in-from-top-2 duration-200 ${isDark ? 'border-gray-800 bg-slate-900' : 'border-gray-400 bg-white'}`}>
                    {[
                        { label: '상태', value: filters.status, onChange: (v: string) => setFilters(prev => ({ ...prev, status: v })), type: 'select', opts: [{ k: 'all', v: '전체' }, { k: 'pending', v: '대기중' }, { k: 'approved', v: '승인됨' }] },
                        { label: '지역', value: filters.location, onChange: (v: string) => setFilters(prev => ({ ...prev, location: v })), type: 'text', placeholder: '지역 검색' },
                        { label: '직업', value: filters.job, onChange: (v: string) => setFilters(prev => ({ ...prev, job: v })), type: 'text', placeholder: '직업 검색' },
                    ].map((f, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{f.label}</label>
                            {f.type === 'select' ? (
                                <select
                                    className={`w-full bg-transparent border-b py-1 text-sm outline-none ${isDark ? 'border-gray-700 text-gray-200 focus:border-gray-500' : 'border-gray-200 text-gray-900 focus:border-gray-400'}`}
                                    value={f.value}
                                    onChange={(e) => f.onChange(e.target.value)}
                                >
                                    {(f.opts || []).map(o => <option key={o.k} value={o.k}>{o.v}</option>)}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    className={`w-full bg-transparent border-b py-1 text-sm outline-none ${isDark ? 'border-gray-700 text-gray-200 focus:border-gray-500' : 'border-gray-200 text-gray-900 focus:border-gray-400'}`}
                                    placeholder={f.placeholder}
                                    value={f.value}
                                    onChange={(e) => f.onChange(e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                    <div className="flex flex-col gap-2">
                        <label className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>나이</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className={`w-full bg-transparent border-b py-1 text-sm outline-none text-center ${isDark ? 'border-gray-700 text-gray-200' : 'border-gray-200 text-gray-900'}`}
                                value={filters.minAge}
                                onChange={(e) => setFilters(prev => ({ ...prev, minAge: e.target.value }))}
                            />
                            <span className="text-gray-300">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                className={`w-full bg-transparent border-b py-1 text-sm outline-none text-center ${isDark ? 'border-gray-700 text-gray-200' : 'border-gray-200 text-gray-900'}`}
                                value={filters.maxAge}
                                onChange={(e) => setFilters(prev => ({ ...prev, maxAge: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Main Content: Clean Split View */}
            <div className="flex-1 overflow-hidden flex gap-0">
                {/* Male Column */}
                <div className={`flex-1 flex flex-col min-w-0 border-r ${isDark ? 'border-gray-800' : 'border-gray-400'}`}>
                    {/* Subtle Header Accent */}
                    <div className="h-0.5 w-full bg-blue-500/50" />

                    <div className="flex-1 overflow-y-auto hover:bg-gray-50/30 transition-colors scrollbar-thin">
                        <div className="p-6">
                            <PremiumApplicantTable
                                applicants={maleApplicants}
                                tableName="남성 신청자"
                                columns={inboxColumns}
                                selectedIds={selectedIds}
                                onToggleSelect={handleToggleSelect}
                                onToggleSelectAll={() => handleToggleSelectAll(maleApplicants)}
                                onSelectApplicant={setSelectedApplicant}
                                isDark={isDark}
                            />

                            {/* [NEW] Rejected Section at Bottom */}
                            {filters.status === 'all' && rejectedMaleApplicants.length > 0 && (
                                <div className="mt-8">
                                    <button
                                        onClick={() => setIsRejectedExpanded(!isRejectedExpanded)}
                                        className={`flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {isRejectedExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        거절/반려됨 ({rejectedMaleApplicants.length})
                                    </button>

                                    {isRejectedExpanded && (
                                        <div className="opacity-60 grayscale-[0.5]">
                                            <PremiumApplicantTable
                                                applicants={rejectedMaleApplicants}
                                                tableName=""
                                                columns={inboxColumns}
                                                selectedIds={selectedIds}
                                                onToggleSelect={handleToggleSelect}
                                                onToggleSelectAll={() => handleToggleSelectAll(rejectedMaleApplicants)}
                                                onSelectApplicant={setSelectedApplicant}
                                                isDark={isDark}
                                                hideCountHeader={true}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Female Column */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Subtle Header Accent */}
                    <div className="h-0.5 w-full bg-pink-500/50" />

                    <div className="flex-1 overflow-y-auto hover:bg-gray-50/30 transition-colors scrollbar-thin">
                        <div className="p-6">
                            <PremiumApplicantTable
                                applicants={femaleApplicants}
                                tableName="여성 신청자"
                                columns={inboxColumns}
                                selectedIds={selectedIds}
                                onToggleSelect={handleToggleSelect}
                                onToggleSelectAll={() => handleToggleSelectAll(femaleApplicants)}
                                onSelectApplicant={setSelectedApplicant}
                                isDark={isDark}
                            />

                            {/* [NEW] Rejected Section at Bottom */}
                            {filters.status === 'all' && rejectedFemaleApplicants.length > 0 && (
                                <div className="mt-8">
                                    <button
                                        onClick={() => setIsRejectedExpanded(!isRejectedExpanded)}
                                        className={`flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {isRejectedExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        거절/반려됨 ({rejectedFemaleApplicants.length})
                                    </button>

                                    {isRejectedExpanded && (
                                        <div className="opacity-60 grayscale-[0.5]">
                                            <PremiumApplicantTable
                                                applicants={rejectedFemaleApplicants}
                                                tableName=""
                                                columns={inboxColumns}
                                                selectedIds={selectedIds}
                                                onToggleSelect={handleToggleSelect}
                                                onToggleSelectAll={() => handleToggleSelectAll(rejectedFemaleApplicants)}
                                                onSelectApplicant={setSelectedApplicant}
                                                isDark={isDark}
                                                hideCountHeader={true}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Smart Action Dock (Kept on right) */}
                <SmartActionDock
                    selectedCount={selectedIds.size}
                    onAction={handleDockAction}
                    type="applicant"
                    isDark={isDark}
                />
            </div>

            {/* Detail Modal */}
            {selectedApplicant && (
                <ApplicantProfileDetail
                    user={selectedApplicant}
                    isDark={isDark}
                    isPremiumContext={true}
                    onClose={() => setSelectedApplicant(null)}
                    onApprove={() => handleApprove(selectedApplicant.id)}
                    onReject={() => handleReject(selectedApplicant.id)}
                    onCancelRejection={() => handleCancelRejection(selectedApplicant.id)}
                    onDelete={() => handleDelete(selectedApplicant.id)}
                    onSave={(data) => handleSaveProfile(selectedApplicant.id, data)}
                />
            )}
        </div>
    );
};

export default PremiumInbox;
