import React from 'react';
import { X, Users } from 'lucide-react';
import { MatchStatus } from '../../../../../types/premium';

interface MatchDetailHeaderProps {
    status: MatchStatus;
    isDark?: boolean;
    onClose: () => void;
    matchStatusMap: Record<MatchStatus, string>;
}

const MatchDetailHeader: React.FC<MatchDetailHeaderProps> = ({ status, isDark, onClose, matchStatusMap }) => {
    return (
        <div className={`p-4 border-b flex-none flex items-center justify-between ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                    <Users size={18} className="text-indigo-500" />
                </div>
                <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        매칭 상세 및 관리
                        <span className={`text-xs px-2 py-0.5 rounded-full ${status === 'matched' ? 'bg-indigo-100 text-indigo-700' :
                            status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                                status === 'completed' ? 'bg-green-100 text-green-700' :
                                    status === 'partner_rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-gray-100 text-gray-600'
                            }`}>
                            {matchStatusMap[status] || status}
                        </span>
                    </h2>
                </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <X size={20} />
            </button>
        </div>
    );
};

export default MatchDetailHeader;
