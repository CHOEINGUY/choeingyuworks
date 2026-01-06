import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Applicant } from '../../../../types';
import AdminProfileDetail from '../../common/AdminProfileDetail';
import { toast } from 'sonner';
import { useAdminMessageActions } from '../../../../hooks/useAdminMessageActions';

interface MobilePremiumInboxProps {
    isDark?: boolean;
    applicants: Applicant[];
    actions?: any;
}

const MobilePremiumInbox: React.FC<MobilePremiumInboxProps> = ({ isDark, applicants = [], actions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeGender, setActiveGender] = useState<'all' | 'male' | 'female'>('all');
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

    // --- Data Split & Filtering ---
    const { filteredApplicants } = useMemo(() => {
        let filtered = applicants;

        // 1. Search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(app =>
                (app.name && app.name.toLowerCase().includes(term)) ||
                (app.phone && app.phone.includes(term))
            );
        }

        // 2. Gender Filter
        if (activeGender === 'male') {
            filtered = filtered.filter(app => app.gender === 'male' || app.gender === 'M');
        } else if (activeGender === 'female') {
            filtered = filtered.filter(app => app.gender === 'female' || app.gender === 'F');
        }

        // Sort: Oldest First (FIFO) - Business Logic
        filtered.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.appliedAt?.toDate ? a.appliedAt.toDate() : new Date(0));
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.appliedAt?.toDate ? b.appliedAt.toDate() : new Date(0));
            return dateA.getTime() - dateB.getTime();
        });

        // Separate logic for tabs if needed, but here just showing list
        // We can visually distinguish status in the row
        return {
            filteredApplicants: filtered
        };
    }, [applicants, searchTerm, activeGender]);

    // --- Message Actions ---
    const { executeMessageAction } = useAdminMessageActions();

    // --- Handlers ---
    const handleAction = async (actionFn: any, id: string, updates?: any) => {
        if (!actionFn) return;
        await actionFn(id, updates);
        if (selectedApplicant?.id === id) {
            if (updates) setSelectedApplicant(prev => prev ? ({ ...prev, ...updates }) : null);
        }
    };

    const handleApprove = async (id: string) => {
        await handleAction(actions?.approveApplicant, id);
        if (actions?.updatePremiumApplicant) {
            await actions.updatePremiumApplicant(id, { ticketCount: 1 });
        }
        toast.success("승인되었습니다");

        // Auto-send Profile Request
        const target = applicants.find(a => a.id === id);
        if (target) {
            await executeMessageAction('request_profile', target, { serviceType: 'PREMIUM' });
        }
    };

    const handleReject = async (id: string) => {
        await handleAction(actions?.rejectApplicant, id);
        toast.info("반려되었습니다");
    };

    const handleCancelRejection = async (id: string) => {
        await handleAction(actions?.updateApplicant, id, { status: 'pending' });
        toast.success("반려 취소되었습니다");
    };

    const handleSave = async (id: string, data: any) => {
        await handleAction(actions?.updateApplicant, id, data);
        return true;
    }

    return (
        <div className={`flex flex-col h-full ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            {/* Toolbar Area */}
            <div className={`shrink-0 px-4 py-3 space-y-3 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                {/* Search Bar */}
                <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
                    <input
                        type="text"
                        placeholder="이름, 연락처 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none transition-all ${isDark
                            ? 'bg-slate-800 text-white placeholder-gray-500 border border-slate-700'
                            : 'bg-gray-100 text-gray-900 placeholder-gray-400 border border-transparent focus:bg-white focus:border-gray-300'
                            }`}
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                    <FilterPill label="전체" active={activeGender === 'all'} onClick={() => setActiveGender('all')} isDark={isDark} />
                    <FilterPill label="남성" active={activeGender === 'male'} onClick={() => setActiveGender('male')} isDark={isDark} color="blue" />
                    <FilterPill label="여성" active={activeGender === 'female'} onClick={() => setActiveGender('female')} isDark={isDark} color="pink" />
                </div>
            </div>

            {/* Table Header */}
            <div className={`shrink-0 flex items-center px-4 py-2 text-xs font-semibold border-y ${isDark ? 'bg-slate-800 text-gray-400 border-slate-700' : 'bg-gray-50 text-gray-500 border-gray-100'
                }`}>
                <div className="w-[25%]">이름 / 나이</div>
                <div className="w-[50%]">정보 / 거주지</div>
                <div className="w-[25%] text-right pr-2">상태</div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto">
                {filteredApplicants.length > 0 ? (
                    <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                        {filteredApplicants.map(applicant => (
                            <CompactRow
                                key={applicant.id}
                                applicant={applicant}
                                isDark={isDark}
                                onClick={() => setSelectedApplicant(applicant)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-gray-400 text-sm">
                        데이터가 없습니다.
                    </div>
                )}
                <div className="h-20" /> {/* Bottom Spacer */}
            </div>

            {/* Detail Modal */}
            {selectedApplicant && (
                <AdminProfileDetail
                    user={selectedApplicant}
                    isDark={isDark}
                    isApplicant={true}
                    onClose={() => setSelectedApplicant(null)}
                    onApprove={() => handleApprove(selectedApplicant.id)}
                    onReject={() => handleReject(selectedApplicant.id)}
                    onCancelRejection={() => handleCancelRejection(selectedApplicant.id)}
                    onSave={(data) => handleSave(selectedApplicant.id, data)}
                />
            )}
        </div>
    );
};

// --- Sub Components ---

const FilterPill = ({ label, active, onClick, isDark, color = 'gray' }: any) => {
    // Dynamic Active Colors
    let activeClass = '';
    let textClass = '';

    if (active) {
        if (color === 'blue') {
            activeClass = isDark ? 'bg-blue-900/40 border-blue-800 text-blue-400' : 'bg-blue-100 border-blue-200 text-blue-700';
        } else if (color === 'pink') {
            activeClass = isDark ? 'bg-pink-900/40 border-pink-800 text-pink-400' : 'bg-pink-100 border-pink-200 text-pink-700';
        } else {
            activeClass = isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-800 text-white border-gray-800';
        }
    } else {
        textClass = isDark ? 'text-gray-400 border-transparent hover:bg-slate-800' : 'text-gray-500 border-transparent bg-gray-50 hover:bg-gray-100';
    }

    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${active ? activeClass : textClass}`}
        >
            {label}
        </button>
    );
};

const CompactRow = ({ applicant, isDark, onClick }: { applicant: Applicant, isDark?: boolean, onClick: () => void }) => {
    const isApproved = (applicant as any).status === 'approved';
    const isRejected = (applicant as any).status === 'rejected';

    const getStatusIcon = () => {
        if (isApproved) return <span className="text-green-500 text-xs font-bold bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">승인됨</span>;
        if (isRejected) return <span className="text-gray-400 text-xs bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded line-through">거절됨</span>;
        return <span className="text-amber-500 text-xs font-bold bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded">대기중</span>;
    };

    return (
        <div
            onClick={onClick}
            className={`
                flex items-center px-4 py-3 cursor-pointer active:bg-gray-50 transition-colors
                ${isDark ? 'hover:bg-slate-800/50 active:bg-slate-800' : 'hover:bg-gray-50'}
            `}
        >
            {/* Column 1: Name & Basic Meta */}
            <div className="w-[25%] pr-2 min-w-0">
                <div className="flex items-center gap-1.5">
                    <span className={`font-semibold text-sm truncate ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                        {applicant.name}
                    </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                    <span className={`text-[10px] px-1 rounded-sm border ${applicant.gender === 'male' || applicant.gender === 'M'
                        ? (isDark ? 'text-blue-400 border-blue-900' : 'text-blue-600 border-blue-100 bg-blue-50')
                        : (isDark ? 'text-pink-400 border-pink-900' : 'text-pink-600 border-pink-100 bg-pink-50')
                        }`}>
                        {applicant.age}세
                    </span>
                </div>
            </div>

            {/* Column 2: Info (Job, Location) */}
            <div className="w-[50%] px-1 min-w-0 flex flex-col justify-center">
                <div className={`text-xs truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {applicant.job}
                </div>
                <div className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {applicant.location} {applicant.height ? `· ${applicant.height}cm` : ''}
                </div>
            </div>

            {/* Column 3: Status & Action */}
            <div className="w-[25%] flex items-center justify-end gap-2 pl-2">
                {getStatusIcon()}
                <ChevronRight size={14} className={isDark ? 'text-gray-600' : 'text-gray-300'} />
            </div>
        </div>
    );
};

export default MobilePremiumInbox;
