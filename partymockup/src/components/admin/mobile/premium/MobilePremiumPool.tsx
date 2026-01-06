import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Sparkles } from 'lucide-react';
import { Applicant } from '../../../../types';
import AdminProfileDetail from '../../common/AdminProfileDetail';

interface MobilePremiumPoolProps {
    isDark?: boolean;
    applicants: Applicant[];
    actions?: any;
}

const MobilePremiumPool: React.FC<MobilePremiumPoolProps> = ({ isDark, applicants = [], actions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeGender, setActiveGender] = useState<'all' | 'male' | 'female'>('all');
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

    // --- Data Filtering ---
    const filteredApplicants = useMemo(() => {
        let filtered = applicants.filter(app => (app as any).status === 'approved');

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

        // Sort: Newest First
        filtered.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.appliedAt?.toDate ? a.appliedAt.toDate() : new Date(0));
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.appliedAt?.toDate ? b.appliedAt.toDate() : new Date(0));
            return dateA.getTime() - dateB.getTime(); // Oldest first
        });

        return filtered;
    }, [applicants, searchTerm, activeGender]);

    // Handlers
    const handleSave = async (id: string, data: any) => {
        if (actions?.updateApplicant) {
            await actions.updateApplicant(id, data);
            return true;
        }
        return false;
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
                        placeholder="회원 이름 검색..."
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
                <div className="w-[25%] text-right pr-2">티켓</div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto">
                {filteredApplicants.length > 0 ? (
                    <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                        {filteredApplicants.map(member => (
                            <MemberRow
                                key={member.id}
                                member={member}
                                isDark={isDark}
                                onClick={() => setSelectedApplicant(member)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-gray-400 text-sm">
                        회원이 없습니다.
                    </div>
                )}
                <div className="h-20" /> {/* Bottom Spacer */}
            </div>

            {/* Detail Modal */}
            {selectedApplicant && (
                <AdminProfileDetail
                    user={selectedApplicant}
                    isDark={isDark}
                    isApplicant={false} // It's a member now
                    onClose={() => setSelectedApplicant(null)}
                    onSave={(data) => handleSave(selectedApplicant.id, data)}
                />
            )}
        </div>
    );
};

// --- Sub Components ---

const FilterPill = ({ label, active, onClick, isDark, color = 'gray' }: any) => {
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

const MemberRow = ({ member, isDark, onClick }: { member: Applicant, isDark?: boolean, onClick: () => void }) => {
    const ticketCount = (member as any).ticketCount ?? 0;

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
                        {member.name}
                    </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                    <span className={`text-[10px] px-1 rounded-sm border ${member.gender === 'male' || member.gender === 'M'
                            ? (isDark ? 'text-blue-400 border-blue-900' : 'text-blue-600 border-blue-100 bg-blue-50')
                            : (isDark ? 'text-pink-400 border-pink-900' : 'text-pink-600 border-pink-100 bg-pink-50')
                        }`}>
                        {member.age}세
                    </span>
                </div>
            </div>

            {/* Column 2: Info (Job, Location) */}
            <div className="w-[50%] px-1 min-w-0 flex flex-col justify-center">
                <div className={`text-xs truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {member.job}
                </div>
                <div className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {member.location} {member.height ? `· ${member.height}cm` : ''}
                </div>
            </div>

            {/* Column 3: Tickets & Action */}
            <div className="w-[25%] flex items-center justify-end gap-2 pl-2">
                <div className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${ticketCount > 0
                    ? (isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600')
                    : (isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400')
                    }`}>
                    <Sparkles size={10} />
                    {ticketCount}
                </div>
                <ChevronRight size={14} className={isDark ? 'text-gray-600' : 'text-gray-300'} />
            </div>
        </div>
    );
};

export default MobilePremiumPool;
