import React from 'react';
import { Calendar } from 'lucide-react';
import { PremiumMatch } from '../../../../types/premium';
import { Applicant } from '../../../../types';
import { getAge } from '../../../../utils/ageUtils'; // Ensure this utility exists or use inline

interface MatchCardProps {
    match: PremiumMatch;
    male?: Applicant;
    female?: Applicant;
    isDark?: boolean;
    onClick: (match: PremiumMatch) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, male, female, onClick }) => {
    // Helper to get status color/label
    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'matched': return { className: 'text-amber-700 bg-amber-50 border-amber-200', label: '연락 대기' };
            case 'notified': return { className: 'text-orange-700 bg-orange-50 border-orange-200', label: '응답 대기' };
            case 'scheduling': return { className: 'text-blue-700 bg-blue-50 border-blue-200', label: '일정 조율' };
            case 'scheduled': return { className: 'text-indigo-700 bg-indigo-50 border-indigo-200', label: '만남 예정' };
            case 'completed': return { className: 'text-emerald-700 bg-emerald-50 border-emerald-200', label: '완료' };
            case 'failed': return { className: 'text-gray-600 bg-gray-50 border-gray-200', label: '파기됨' };
            default: return { className: 'text-gray-600 bg-gray-50 border-gray-200', label: '미정' };
        }
    };

    const statusInfo = getStatusInfo(match.status);

    // Helper to format user info: Name (Age, Job)
    const formatUserInfo = (name: string, user?: Applicant) => {
        if (!user) return name;
        const age = getAge(user);
        return (
            <div className="flex flex-col">
                <span className="font-bold text-sm text-gray-900">{name}</span>
                <span className="text-xs text-gray-500">
                    {age}세 · {user.job || '직업 미입력'}
                </span>
            </div>
        );
    };

    return (
        <div
            onClick={() => onClick(match)}
            className="w-full p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group flex flex-col gap-2 bg-white"
        >
            {/* Top Row: Date & Status */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-mono">
                    {new Date(match.matchedAt).toLocaleDateString()}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold border ${statusInfo.className}`}>
                    {statusInfo.label}
                </span>
            </div>

            {/* Middle Row: Names & Info */}
            <div className="flex items-center justify-between gap-2 mt-1">
                {/* Male */}
                <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-blue-600 font-bold">M</span>
                        <span className="font-bold text-sm truncate text-gray-900">{match.maleName}</span>
                    </div>
                    <div className="text-[11px] truncate text-gray-500">
                        {formatUserInfo('', male)}
                    </div>
                </div>

                {/* Divider */}
                <span className="text-gray-300 text-[10px]">|</span>

                {/* Female */}
                <div className="flex-1 text-right min-w-0">
                    <div className="flex items-center gap-1 justify-end">
                        <span className="font-bold text-sm truncate text-gray-900">{match.femaleName}</span>
                        <span className="text-[10px] text-pink-600 font-bold">F</span>
                    </div>
                    <div className="text-[11px] truncate text-gray-500">
                        {formatUserInfo('', female)}
                    </div>
                </div>
            </div>

            {/* Bottom: Scheduled Info (if any) */}
            {match.status === 'scheduled' && match.meetingDate && (
                <div className="mt-1 pt-2 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={12} />
                    <span>{match.meetingDate} {match.meetingTime}</span>
                </div>
            )}

            {/* Quick Actions (Hover) */}
            <div className="hidden group-hover:flex absolute right-2 top-2 gap-1">
                {/* Can add actions if needed, but keeping simple for now */}
            </div>
        </div>
    );
};

export default MatchCard;
