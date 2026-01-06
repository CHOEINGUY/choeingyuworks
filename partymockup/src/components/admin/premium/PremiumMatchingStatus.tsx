import React, { useState } from 'react';
import { Search } from 'lucide-react';
import MatchCard from './status/MatchCard';
import MatchDetailModal from './status/MatchDetailModal';
import { toast } from 'sonner';
import { PremiumMatch, MatchStatus } from '../../../types/premium';
import { usePremiumMatches } from '../../../hooks/usePremiumMatches';

// MOCK DATA REMOVED - using usePremiumMatches hook

import { Applicant } from '../../../types';

interface PremiumMatchingStatusProps {
    isDark?: boolean;
    applicants?: Applicant[];
}

const PremiumMatchingStatus: React.FC<PremiumMatchingStatusProps> = ({ isDark = false, applicants = [] }) => {
    // [NEW] Use Real Data Hook
    const { matches, loading, updateMatchStatus, breakMatch, deleteMatch } = usePremiumMatches();

    // Local UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMatch, setSelectedMatch] = useState<PremiumMatch | null>(null);

    interface Column {
        id: string;
        label: string;
        statuses: MatchStatus[];
        color: string;
    }

    const columns: Column[] = [
        { id: 'step1', label: '매칭 성사/연락', statuses: ['matched', 'notified'], color: 'bg-yellow-500' },
        { id: 'step2', label: '만남 조율', statuses: ['scheduling'], color: 'bg-blue-500' },
        { id: 'step3', label: '만남 확정/결과', statuses: ['scheduled', 'completed', 'failed'], color: 'bg-green-500' },
    ];

    // Filter Logic
    const filteredMatches = matches.filter(m => {
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return m.maleName.includes(term) || m.femaleName.includes(term);
        }
        return true;
    });

    const getMatchesByColumn = (colStatuses: MatchStatus[]) => {
        return filteredMatches.filter(m => colStatuses.includes(m.status));
    };

    // Actions
    const handleUpdateStatus = async (id: string, newStatus: MatchStatus, extraData: any = {}) => {
        await updateMatchStatus(id, newStatus, extraData);

        // If updating from modal, update the selected match too so UI reflects changes immediately
        if (selectedMatch && selectedMatch.id === id) {
            setSelectedMatch(prev => prev ? ({ ...prev, status: newStatus, ...extraData }) : null);
        }

        toast.success("상태가 업데이트되었습니다.");
    };

    const handleBreakMatch = async (id: string, reason: string, refundTicket: boolean, matchData?: PremiumMatch) => {
        await breakMatch(id, reason, refundTicket, matchData);
        setSelectedMatch(null); // Close modal

        toast.error("매칭이 파기되었습니다.", {
            description: refundTicket ? "이용권이 반환되었습니다." : "이용권 반환 없음"
        });
    };

    return (
        <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className={`shrink-0 p-4 border-b flex items-center justify-between ${isDark ? 'border-gray-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <h2 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>매칭 현황</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="이름 검색"
                        className={`pl-10 pr-4 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-indigo-500/50 ${isDark
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                            : 'bg-gray-50 border-gray-200 text-gray-900'
                            }`}
                    />
                </div>
            </div>

            {/* Kanban Board (Flexible Grid) */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    {/* Full Width Table Container */}
                    <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b border-gray-200 bg-white divide-gray-200">
                        {columns.map((col) => {
                            const colMatches = getMatchesByColumn(col.statuses);
                            return (
                                <div key={col.id} className="flex flex-col h-full min-h-[400px]">
                                    {/* Column Header (Rectangular) */}
                                    <div className="p-3 border-b flex items-center justify-between border-gray-100 bg-gray-50 font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 ${col.color}`} />
                                            <span className="text-sm text-gray-600">{col.label}</span>
                                        </div>
                                        <span className="text-xs px-2 py-0.5 bg-white border border-gray-200 text-gray-500">
                                            {colMatches.length}
                                        </span>
                                    </div>

                                    {/* Column Content (List Rows) */}
                                    <div className="flex-1 flex flex-col bg-white">
                                        {colMatches.map(match => (
                                            <MatchCard
                                                key={match.id}
                                                match={match}
                                                male={applicants.find(a => a.id === match.maleId)}
                                                female={applicants.find(a => a.id === match.femaleId)}
                                                isDark={false}
                                                onClick={setSelectedMatch}
                                            />
                                        ))}

                                        {colMatches.length === 0 && (
                                            <div className="flex-1 flex items-center justify-center opacity-30">
                                                <span className="text-xs text-gray-400">-</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedMatch && (
                <MatchDetailModal
                    match={selectedMatch}
                    maleUser={applicants.find(a => a.id === selectedMatch.maleId)}
                    femaleUser={applicants.find(a => a.id === selectedMatch.femaleId)}
                    isDark={isDark}
                    onClose={() => setSelectedMatch(null)}
                    onUpdateStatus={handleUpdateStatus}
                    onBreakMatch={handleBreakMatch}
                    onDeleteMatch={async (id) => {
                        if (confirm('정말로 이 매칭 기록을 삭제하시겠습니까? (복구 불가)\n\n주의: 이용권 환불 등은 자동으로 처리되지 않습니다.')) {
                            await deleteMatch(id);
                            setSelectedMatch(null);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default PremiumMatchingStatus;
