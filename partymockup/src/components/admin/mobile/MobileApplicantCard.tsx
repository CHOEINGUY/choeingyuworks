import React from 'react';
import { getAge } from '../../../utils/ageUtils';
import { Applicant } from '../../../types';

interface MobileApplicantCardProps {
    app: Applicant;
    isExpanded?: boolean;
    onToggle?: () => void;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    onClick: (app: Applicant) => void;
    isDark?: boolean;
}

const MobileApplicantCard: React.FC<MobileApplicantCardProps> = ({ app, onClick, isDark }) => {
    // Helper for Status Badge - Fixed Text, Color Change
    const StatusBadge = ({ isTrue, type, label }: { isTrue: boolean, type: string, label?: string }) => {
        if (type === 'deposit') {
            return (
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${isTrue
                    ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700')
                    : (isDark ? 'bg-slate-700 text-gray-500' : 'bg-gray-100 text-gray-400')
                    }`}>
                    {label || '입금'}
                </div>
            );
        }
        if (type === 'sms') {
            return (
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${isTrue
                    ? (isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700')
                    : (isDark ? 'bg-slate-700 text-gray-500' : 'bg-gray-100 text-gray-400')
                    }`}>
                    {label || '문자'}
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`border-b last:border-0 transition-colors active:bg-opacity-80 ${isDark ? 'bg-slate-800 border-slate-700 active:bg-slate-700' : 'bg-white border-gray-100 active:bg-gray-50'}`}>
            <div className="flex items-center p-4 gap-3">
                {/* 1. Avatar area Removed */}

                {/* 2. Info Area (Clickable) */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1" onClick={() => onClick(app)}>
                    <div className="flex items-center gap-1">
                        <span className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{app.name}</span>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            { // @ts-ignore
                            }
                            ({getAge(app)})
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-xs truncate max-w-[80px] mr-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{app.job}</span>
                        <StatusBadge isTrue={!!app.isDeposited} type="deposit" />
                        <StatusBadge isTrue={!!app.isSmsSent} type="sms" />
                    </div>
                </div>

                {/* 3. Action Buttons (Right Aligned) */}
                {/* 3. Status Badge (Right Aligned) */}
                <div className="flex items-center gap-1.5">
                    {app.status === 'pending' ? (
                        <div className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${isDark ? 'bg-yellow-900/30 text-yellow-500' : 'bg-yellow-100 text-yellow-700'}`}>
                            대기중
                        </div>
                    ) : (
                        <div className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${app.status === 'approved'
                            ? (isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700')
                            : (isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700')
                            }`}>
                            {app.status === 'approved' ? '승인됨' : '거절됨'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileApplicantCard;
