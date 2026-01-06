import React, { useState, useMemo } from 'react';
import { Search, Check } from 'lucide-react';
import { User } from '../../../../types';

interface PartyGuestListProps {
    users: User[];
    onUpdateUser?: (userId: string, data: Partial<User>) => Promise<void>;
    isDark?: boolean;
    onRowClick?: (user: User) => void;
}

const PartyGuestList: React.FC<PartyGuestListProps> = ({
    users, // Array of user objects
    onUpdateUser, // Function to update user data
    isDark,
    onRowClick // Handler for row click
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'entered' | 'not_entered'>('all');

    // Filter Logic
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            // Search Text
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                (user.name || '').toLowerCase().includes(searchLower) ||
                (user.phone || '').includes(searchTerm);

            if (!matchesSearch) return false;

            // Status Filter
            if (filterStatus === 'entered') return user.isEntered;
            if (filterStatus === 'not_entered') return !user.isEntered;

            return true;
        });
    }, [users, searchTerm, filterStatus]);

    // Handler: Toggle Entry
    const handleToggleEntry = async (userId: string, currentStatus: boolean) => {
        if (onUpdateUser) {
            await onUpdateUser(userId, {
                isEntered: !currentStatus,
                enteredAt: !currentStatus ? new Date().toISOString() : null
            });
        }
    };

    const thClass = `px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
    const tdClass = `px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`;
    const rowClass = `transition-colors border-b cursor-pointer ${isDark ? 'border-gray-800 hover:bg-slate-800/50' : 'border-gray-100 hover:bg-gray-50'}`;

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Toolbar */}
            <div className={`p-4 flex flex-wrap gap-3 items-center justify-between rounded-t-xl border-b ${isDark ? 'bg-slate-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                            type="text"
                            placeholder="이름 또는 전화번호 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-9 pr-4 py-2 rounded-lg text-sm border outline-none ${isDark
                                ? 'bg-slate-900 border-gray-700 text-white focus:border-purple-500'
                                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-500'}`}
                        />
                    </div>
                    <div className="flex bg-transparent rounded-lg p-1 border gap-1">
                        {[
                            { id: 'all', label: '전체' },
                            { id: 'entered', label: '입장완료' },
                            { id: 'not_entered', label: '미입장' }
                        ].map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => setFilterStatus(opt.id as any)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${filterStatus === opt.id
                                    ? (isDark ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700')
                                    : (isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={`text-sm font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    총 {filteredUsers.length}명
                </div>
            </div>

            {/* Table */}
            <div className={`flex-1 overflow-auto rounded-b-xl border border-t-0 shadow-sm ${isDark ? 'bg-slate-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                <table className="min-w-full">
                    <thead className={`sticky top-0 z-10 ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                        <tr>
                            <th className={thClass}>이름 / 연락처</th>
                            <th className={thClass}>성별</th>
                            <th className={thClass}>티켓 상태</th>
                            <th className={thClass}>비고</th>
                            <th className={thClass}>입장 체크</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-100'}`}>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user.id} className={rowClass} onClick={() => onRowClick && onRowClick(user)}>
                                    <td className={tdClass}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${user.gender === 'M'
                                                ? 'bg-blue-100 text-blue-600'
                                                : 'bg-pink-100 text-pink-600'
                                                }`}>
                                                {user.name?.[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.name}</div>
                                                <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{user.phone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={tdClass}>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${user.gender === 'M'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'bg-pink-50 text-pink-600'
                                            }`}>
                                            {user.gender === 'M' ? '남성' : '여성'}
                                        </span>
                                    </td>
                                    <td className={tdClass}>
                                        {/* Simplified Ticket Status Logic */}
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${user.ticketStatus === 'paid' || user.isDeposited // Assuming isDeposited is the flag for now
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {user.isDeposited ? '입금완료' : '미입금'}
                                        </span>
                                    </td>
                                    <td className={tdClass}>
                                        <span className="text-xs opacity-50">-</span>
                                    </td>
                                    <td className={tdClass}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleEntry(user.id, !!user.isEntered);
                                            }}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border ${user.isEntered
                                                ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-900/20'
                                                : (isDark ? 'bg-slate-800 border-slate-600 text-gray-400 hover:border-purple-500 hover:text-purple-400' : 'bg-white border-gray-300 text-gray-500 hover:border-purple-500 hover:text-purple-600')
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${user.isEntered ? 'border-white bg-white/20' : 'border-current'}`}>
                                                {user.isEntered && <Check size={10} strokeWidth={4} />}
                                            </div>
                                            <span className="text-xs font-bold">{user.isEntered ? '입장완료' : '입장하기'}</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    검색 결과가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PartyGuestList;
