import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { Applicant } from '../../../../../types';
import { PremiumMatch } from '../../../../../types/premium';
import { toast } from 'sonner';

interface MatchDetailProfileCardsProps {
    match: PremiumMatch;
    maleUser?: Applicant;
    femaleUser?: Applicant;
    maleLastSent: string | null;
    femaleLastSent: string | null;
    isDark?: boolean;
    onViewProfile: (user: Applicant) => void;
    onViewLogs: (userId: string, userName: string) => void;
    onExecuteAction: (action: string, user: Applicant, options?: any) => Promise<void>;
    onUpdateStatus: (id: string, status: any) => void;
    setLastSent: (gender: 'M' | 'F', time: string) => void;
}

const MatchDetailProfileCards: React.FC<MatchDetailProfileCardsProps> = ({
    match, maleUser, femaleUser, maleLastSent, femaleLastSent, isDark, onViewProfile, onViewLogs, onExecuteAction, onUpdateStatus, setLastSent
}) => {
    const handleNotify = async (user: Applicant, gender: 'M' | 'F') => {
        if (!confirm(`${user.name}님에게 매칭 알림을 보내시겠습니까?`)) return;
        await onExecuteAction('match_found', user, { serviceType: 'PREMIUM' });
        onUpdateStatus(match.id, 'notified');
        toast.success(`${user.name}님에게 알림 전송 완료`);
        setLastSent(gender, new Date().toLocaleString());
    };

    const renderCard = (user: Applicant | undefined, name: string, gender: 'M' | 'F', lastSent: string | null) => (
        <div
            onClick={() => user && onViewProfile(user)}
            className={`flex-1 p-4 rounded-xl border flex flex-col gap-3 transition-all cursor-pointer hover:shadow-md relative group ${isDark
                ? (gender === 'M' ? 'bg-slate-800/50 border-blue-900/30 hover:bg-slate-800' : 'bg-slate-800/50 border-pink-900/30 hover:bg-slate-800')
                : (gender === 'M' ? 'bg-blue-50/50 border-blue-100 hover:bg-blue-100/50' : 'bg-pink-50/50 border-pink-100 hover:bg-pink-100/50')
                }`}
        >
            <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-full overflow-hidden shrink-0 ${gender === 'M' ? 'bg-blue-100 text-blue-500' : 'bg-pink-100 text-pink-500'} flex items-center justify-center font-bold`}>
                    {user?.images?.[0] ? (
                        <img src={user.images[0]} alt={gender} className="w-full h-full object-cover" />
                    ) : (
                        gender
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className={`font-bold text-lg ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${isDark ? (gender === 'M' ? 'bg-blue-900/50 text-blue-300' : 'bg-pink-900/50 text-pink-300') : (gender === 'M' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600')}`}>
                            {gender === 'M' ? '남성' : '여성'}
                        </span>
                    </div>
                    <div className={`text-xs mt-1 truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {user ? `${user.birthDate ? (new Date().getFullYear() - parseInt(String(user.birthDate).substring(0, 4))) : '??'}세` : '정보 없음'} · {user?.job || '직업 미입력'}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                        {lastSent ? `최근 알림: ${lastSent}` : '알림 미발송'}
                        {user && <button onClick={(e) => { e.stopPropagation(); onViewLogs(user.id, user.name || 'Unknown'); }} className={`hover:${gender === 'M' ? 'text-blue-500' : 'text-pink-500'}`}><MessageCircle size={10} /></button>}
                    </div>
                </div>
            </div>
            <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Phone size={14} />
                    <span className="font-mono text-xs">{user?.phoneNumber || '-'}</span>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); user && handleNotify(user, gender); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors z-10 ${isDark
                        ? (gender === 'M' ? 'bg-blue-900/40 text-blue-400 hover:bg-blue-900/60' : 'bg-pink-900/40 text-pink-400 hover:bg-pink-900/60')
                        : 'bg-white border text-blue-600 hover:bg-blue-50 shadow-sm ' + (gender === 'M' ? 'border-blue-200 text-blue-600' : 'border-pink-200 text-pink-600')
                        }`}
                >
                    알림 전송
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                {renderCard(maleUser, match.maleName, 'M', maleLastSent)}
                <div className="flex flex-col justify-center items-center px-2">
                    <div className={`h-full w-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                </div>
                {renderCard(femaleUser, match.femaleName, 'F', femaleLastSent)}
            </div>
            <div className="flex justify-end">
                <button
                    onClick={async () => {
                        if (!confirm('남녀 모두에게 매칭 알림을 발송하시겠습니까?')) return;
                        if (maleUser) await onExecuteAction('match_found', maleUser, { serviceType: 'PREMIUM' });
                        if (femaleUser) await onExecuteAction('match_found', femaleUser, { serviceType: 'PREMIUM' });
                        onUpdateStatus(match.id, 'notified');
                        toast.success('남녀 모두에게 알림 전송 완료');
                        setLastSent('M', new Date().toLocaleString());
                        setLastSent('F', new Date().toLocaleString());
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2 ${isDark ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                >
                    <MessageCircle size={14} />
                    모두에게 알림 보내기
                </button>
            </div>
        </div>
    );
};

export default MatchDetailProfileCards;
