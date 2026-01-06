import React from 'react';
import { X, Briefcase, MapPin, Calendar } from 'lucide-react';
import { getAge } from '../../../../utils/ageUtils'; // [NEW]
import { PremiumMember } from '../../../../types/premium';

interface DetailedWorkbenchCardProps {
    member: PremiumMember;
    isDark?: boolean;
    onRemove: (id: string) => void;
    onClick: (member: PremiumMember) => void;
}

const DetailedWorkbenchCard: React.FC<DetailedWorkbenchCardProps> = ({ member, isDark, onRemove, onClick }) => {
    // Safe age calc
    const age = getAge(member); // [FIX] Use robust util
    const isMale = member.gender === 'M';

    return (
        <div className={`relative w-full overflow-hidden rounded-xl border-2 transition-all animate-in zoom-in-95 duration-200 group ${isMale
            ? (isDark ? 'bg-blue-900/10 border-blue-500/50' : 'bg-blue-50 border-blue-200')
            : (isDark ? 'bg-pink-900/10 border-pink-500/50' : 'bg-pink-50 border-pink-200')
            }`}>

            {/* Remove Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(member.id);
                }}
                className={`absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/20 transition-colors z-10 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}
            >
                <X size={14} />
            </button>

            {/* Content Container - Clickable */}
            <div onClick={() => onClick(member)} className="flex flex-col p-4 cursor-pointer">
                {/* Header: Avatar + Name */}
                <div className="flex items-center gap-3 mb-3">

                    <div>
                        <div className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            {member.name}
                            <span className={`text-xs font-normal px-1.5 py-0.5 rounded ${isMale ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                {age}세
                            </span>
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {isMale ? '남성' : '여성'} 회원
                        </div>
                    </div>
                </div>

                {/* Info List */}
                <div className={`flex flex-col gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center gap-2.5">
                        <Briefcase size={14} className="opacity-70" />
                        <span className="truncate">{member.job || '직업 정보 없음'}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <MapPin size={14} className="opacity-70" />
                        <span className="truncate">{member.location || '지역 정보 없음'}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Calendar size={14} className="opacity-70" />
                        <span className="truncate">{member.birthDate}</span>
                    </div>
                    {/* [NEW] Ticket Prediction */}
                    <div className="flex items-center gap-2.5 mt-1 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                        <div className="text-xs font-bold text-indigo-500">이용권</div>
                        <div className="flex items-center gap-1 text-xs">
                            <span className={member.ticketCount && member.ticketCount > 0 ? "font-bold" : "text-gray-400"}>
                                {member.ticketCount ?? 0}매
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="text-red-500 font-bold">
                                {Math.max(0, (member.ticketCount ?? 0) - 1)}매 (예상)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailedWorkbenchCard;
