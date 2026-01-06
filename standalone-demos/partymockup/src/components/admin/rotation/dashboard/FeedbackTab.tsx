import React from 'react';
import { Trash2 } from 'lucide-react';

interface FeedbackTabProps {
    sessionFeedbacks?: any[];
    users: Record<string, any>; // id -> user object
    isDark?: boolean;
    titleTextClass?: string;
    subTextClass?: string;
    handleDeleteFeedback: (id: string) => void;
}

const FeedbackTab: React.FC<FeedbackTabProps> = ({
    sessionFeedbacks = [], // Add default value
    users,
    isDark,
    titleTextClass,
    subTextClass,
    handleDeleteFeedback
}) => {
    const getUserName = (id: string) => users[id]?.name || id;

    return (
        <table className="w-full text-left border-collapse">
            <thead className={`${isDark ? 'bg-slate-800' : 'bg-gray-50'} sticky top-0`}>
                <tr>
                    {['Time', 'From', 'To', 'Rating', 'Note', 'Action'].map(h => (
                        <th key={h} className={`p-3 text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sessionFeedbacks.map(fb => (
                    <tr key={fb.id} className={`border-b last:border-0 hover:${isDark ? 'bg-slate-800/50' : 'bg-gray-50'} ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                        <td className="p-3 text-xs text-gray-400">{fb.timestamp ? new Date(fb.timestamp.seconds * 1000).toLocaleTimeString() : '-'}</td>
                        <td className={`p-3 text-sm font-medium ${titleTextClass}`}>{getUserName(fb.fromUserId)}</td>
                        <td className={`p-3 text-sm ${subTextClass}`}>{getUserName(fb.toUserId)}</td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${fb.rating >= 4 ? 'bg-pink-100 text-pink-700' : (isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600')}`}>{fb.rating} / 5</span></td>
                        <td className={`p-3 text-sm ${subTextClass} max-w-xs truncate`}>{fb.note}</td>
                        <td className="p-3">
                            <button onClick={() => handleDeleteFeedback(fb.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                        </td>
                    </tr>
                ))}
                {sessionFeedbacks.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No feedbacks yet</td></tr>}
            </tbody>
        </table>
    );
};

export default FeedbackTab;
