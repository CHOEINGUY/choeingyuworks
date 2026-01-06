import React from 'react';
import { ArrowRight, ArrowLeft, Briefcase, MapPin, Cigarette, Wine } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';
import { Applicant } from '../../../../types';
import { getAge } from '../../../../utils/ageUtils'; // [NEW]

// Assuming Member is similar to Applicant for now, or extending it.
interface PremiumMember extends Applicant {
    answers?: Record<string, any>; // For extra answers
}

interface MemberListItemProps {
    member: PremiumMember;
    isDark?: boolean;
    onClick: (member: PremiumMember) => void;
    onAddToWorkbench: (member: PremiumMember) => void;
    isProfileReady?: boolean; // [NEW] Status check
}

const MemberListItem: React.FC<MemberListItemProps> = ({ member, isDark, onClick, onAddToWorkbench, isProfileReady = true }) => {
    // ... (Keep existing sortable logic)
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: member.id, disabled: !isProfileReady }); // Disable drag if not ready

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : (isProfileReady ? 1 : 0.6), // Dim if not ready
        zIndex: isDragging ? 999 : 1,
    };

    // Safe age calc
    const age = getAge(member); // [FIX] Use robust util
    const isMale = member.gender === 'M';

    // Helper to safety get fields
    const getVal = (key: string) => (member as any)[key] || (member.answers && member.answers[key]);
    const smoking = getVal('smoking');
    const drinking = getVal('drinking');

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`group flex items-stretch border-b transition-colors relative h-12 ${isDark ? 'border-gray-800 bg-slate-900 hover:bg-slate-800' : 'border-gray-200 bg-white hover:bg-gray-50'
                } ${!isProfileReady ? 'opacity-70 grayscale' : ''}`}
        >
            {/* Left Button for Female (Push to Center <--) */}
            {!isMale && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isProfileReady) onAddToWorkbench(member);
                        else toast.error("프로필 작성이 완료되지 않은 회원입니다.");
                    }}
                    disabled={!isProfileReady}
                    className={`w-8 flex items-center justify-center border-r transition-colors ${!isProfileReady
                        ? 'text-gray-400 cursor-not-allowed border-gray-200 dark:border-gray-800'
                        : (isDark ? 'border-gray-800 text-pink-400 hover:bg-pink-900/30' : 'border-gray-200 text-pink-400 hover:bg-pink-100')
                        }`}
                >
                    <ArrowLeft size={14} />
                </button>
            )}

            {/* Main Content (Click for Profile) - Text Only Compact */}
            <div
                onClick={() => onClick(member)}
                className="flex-1 flex items-center gap-3 px-3 cursor-pointer min-w-0"
            >
                {/* Name & Age */}
                <div className="flex items-center gap-1.5 min-w-[30%]">
                    <span className={`text-sm font-bold truncate ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                        {member.name}
                    </span>
                    <span className={`text-xs ${isMale ? (isDark ? 'text-blue-400' : 'text-blue-600') : (isDark ? 'text-pink-400' : 'text-pink-600')}`}>
                        ({age})
                    </span>

                    {/* [NEW] Status Badges */}
                    {!isProfileReady ? (
                        <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-500 font-bold">미완성</span>
                    ) : (
                        <div className="flex items-center gap-1 ml-1">
                            {smoking === 'yes' && <Cigarette size={12} className="text-gray-400" />}
                            {['often', 'sometimes'].includes(drinking) && <Wine size={12} className="text-purple-400" />}
                        </div>
                    )}
                </div>

                {/* Job & Location (Divider separated) */}
                <div className={`flex-1 flex items-center justify-end gap-2 text-[11px] truncate ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    <div className="flex items-center gap-1 truncate max-w-[45%]">
                        <Briefcase size={10} className="opacity-70" />
                        <span className="truncate">{member.job || '-'}</span>
                    </div>
                    <div className="w-px h-3 bg-gray-300 dark:bg-gray-700" />
                    <div className="flex items-center gap-1 truncate max-w-[45%]">
                        <MapPin size={10} className="opacity-70" />
                        <span className="truncate">{member.location || '-'}</span>
                    </div>
                </div>
            </div>

            {/* Right Button for Male (Push to Center -->) */}
            {isMale && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isProfileReady) onAddToWorkbench(member);
                        else toast.error("프로필 작성이 완료되지 않은 회원입니다.");
                    }}
                    disabled={!isProfileReady}
                    className={`w-8 flex items-center justify-center border-l transition-colors ${!isProfileReady
                        ? 'text-gray-400 cursor-not-allowed border-gray-200 dark:border-gray-800'
                        : (isDark ? 'border-gray-800 text-blue-400 hover:bg-blue-900/30' : 'border-gray-200 text-blue-400 hover:bg-blue-100')
                        }`}
                >
                    <ArrowRight size={14} />
                </button>
            )}
        </div>
    );
};

export default MemberListItem;
