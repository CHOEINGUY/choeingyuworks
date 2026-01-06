import React, { useState, useMemo } from 'react';
import { CheckSquare, Square, ArrowUp, ArrowDown } from 'lucide-react';
import { getAge } from '../../../../utils/ageUtils';
import { User } from '../../../../types';

interface Column {
    id: string;
    label: string;
    render?: (user: User) => React.ReactNode;
}

interface PartyGuestTableProps {
    users?: User[];
    onSelectUser?: (user: User) => void;
    onMoveUser?: (user: User) => void;
    isDark?: boolean;
    selectedIds?: Set<string>;
    onToggleSelect?: (id: string) => void;
    onToggleSelectAll?: () => void;
    tableName: string;
    columns?: Column[];
    type?: 'male' | 'female';
    hideHeader?: boolean;
    groupByGender?: boolean;
}

const PartyGuestTable: React.FC<PartyGuestTableProps> = ({
    users = [],
    onSelectUser,

    isDark,
    selectedIds = new Set(),
    onToggleSelect,
    onToggleSelectAll,
    tableName,
    columns = [],
    hideHeader,
    groupByGender
}) => {
    // Default columns if none provided
    const displayColumns = columns.length > 0 ? columns : [
        { id: 'name_age', label: '이름 / 나이' },
        { id: 'contact', label: '연락처' },
        { id: 'entry_status', label: '상태' },
        { id: 'ticket', label: '티켓' }
    ];

    // Sorting State
    const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

    // Handle Sort Click
    const handleSort = (key: string) => {
        setSortConfig((current) => {
            if (current.key === key) {
                if (current.direction === 'asc') return { key, direction: 'desc' };
                if (current.direction === 'desc') return { key: null, direction: 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    // Sort Logic
    const sortedUsers = useMemo(() => {
        let sortableItems = [...users];

        if (!sortConfig.key) {
            // [NEW] Even with default sort, prioritize Gender if groupByGender is on
            return sortableItems.sort((a, b) => {
                if (groupByGender && a.gender !== b.gender) {
                    return a.gender === 'M' ? -1 : 1;
                }
                return (a.name || '').localeCompare(b.name || '');
            });
        }

        return sortableItems.sort((a, b) => {
            const key = sortConfig.key!;

            // [NEW] If groupByGender is enabled, prioritize Gender sorting (M first)
            if (groupByGender && a.gender !== b.gender) {
                return a.gender === 'M' ? -1 : 1;
            }

            let valA: any, valB: any;

            if (key === 'name_age') {
                valA = a.name || '';
                valB = b.name || '';
            } else if (key === 'ticket') {
                valA = a.ticketType || '기본';
                valB = b.ticketType || '기본';
            } else if (key === 'entry_status') {
                const getStatusScore = (u: User) => {
                    if (u.isEntered) return 2;
                    if (u.isDeposited) return 1;
                    return 0;
                };
                valA = getStatusScore(a);
                valB = getStatusScore(b);
            } else {
                valA = (a as any)[key] !== undefined ? (a as any)[key] : (a.answers?.[key] || '');
                valB = (b as any)[key] !== undefined ? (b as any)[key] : (b.answers?.[key] || '');
            }

            if (valA === undefined || valA === null) valA = '';
            if (valB === undefined || valB === null) valB = '';

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [users, sortConfig]);

    // Styling
    const tableHeaderClass = `px-3 py-3 text-left text-[11px] font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider cursor-pointer select-none group hover:bg-gray-100/10 transition-colors`;
    const tableRowClass = `border-b transition-colors ${isDark ? 'border-gray-700 hover:bg-slate-800/50' : 'border-gray-200 hover:bg-gray-50'}`;
    const textMain = isDark ? 'text-gray-200' : 'text-gray-900';
    const textSub = isDark ? 'text-gray-400' : 'text-gray-500';

    const allSelected = users.length > 0 && users.every(u => selectedIds.has(u.id));

    // Cell Renderer
    const renderCell = (col: Column, user: User) => {
        if (col.render) return col.render(user);

        switch (col.id) {
            case 'name_age':
                return (
                    <div className="flex items-center gap-2 group/cell relative">
                        <div className="min-w-0">
                            <div className={`text-xs font-medium ${textMain} flex items-center gap-1`}>
                                {user.name}
                                {/* Move Session Button Removed */}
                            </div>
                            <div className={`text-[10px] ${textSub} -mt-0.5`}>
                                {getAge(user)}세
                            </div>
                        </div>
                    </div>
                );
            case 'contact':
                return (
                    <div className={`flex items-center text-[10px] ${textSub}`}>
                        {user.phone || user.phoneNumber || '-'}
                    </div>
                );
            case 'entry_status':
                return (
                    <span className={`px-1.5 py-0.5 inline-flex text-[10px] leading-3 font-semibold rounded-full ${user.isEntered
                        ? (isDark ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-100 text-purple-800')
                        : (isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500')
                        }`}>
                        {user.isEntered ? '입장' : '미입장'}
                    </span>
                );
            case 'deposit_status':
                return (
                    <span className={`px-1.5 py-0.5 inline-flex text-[10px] leading-3 font-semibold rounded-full ${user.isDeposited
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {user.isDeposited ? '입금' : '미입금'}
                    </span>
                );
            case 'invite_status':
                let statusLabel = '미발송';
                let statusColor = 'bg-gray-100 text-gray-800';

                // Prioritize 'inviteStatus' field (success/failed/sent)
                const inviteStatus = (user as any).inviteStatus;
                if (inviteStatus === 'success' || inviteStatus === 'sent') {
                    statusLabel = '발송완료';
                    statusColor = 'bg-blue-100 text-blue-800';
                } else if (inviteStatus === 'failed') {
                    statusLabel = '실패';
                    statusColor = 'bg-red-100 text-red-800';
                } else if (user.isSmsSent === true) {
                    // Legacy fallback
                    statusLabel = '발송완료';
                    statusColor = 'bg-blue-100 text-blue-800';
                }

                return (
                    <span className={`px-1.5 py-0.5 inline-flex text-[10px] leading-3 font-semibold rounded-full ${statusColor}`}>
                        {statusLabel === '발송완료' ? '발송' : statusLabel}
                    </span>
                );
            case 'ticket':
                return (
                    <div className={`text-xs ${textMain} truncate max-w-[100px]`} title={user.ticketLabel || user.ticketType || '기본'}>
                        {user.ticketLabel || user.ticketType || '기본'}
                    </div>
                );
            // Dynamic Fields Handling
            case 'job':
            case 'location':
            case 'mbti':
            case 'height':
            case 'drinking':
            case 'smoking':
            case 'religion':
                let val = (user as any)[col.id];
                if (val === undefined && user.answers) {
                    val = (user.answers as any)[col.id];
                }
                if (Array.isArray(val)) return <span className={`text-xs ${textMain} truncate max-w-[150px]`}>{val.join(', ')}</span>;
                if (typeof val === 'boolean') return <span className={`text-xs ${textMain} font-mono`}>{val ? 'Yes' : 'No'}</span>;
                return <div className={`text-xs ${textMain} truncate max-w-[150px]`} title={typeof val === 'string' ? val : ''}>{val !== undefined && val !== null ? String(val) : '-'}</div>;

            default:
                // Fallback for any unknown columns
                let fallbackCal = (user as any)[col.id];
                if (fallbackCal === undefined && user.answers) {
                    fallbackCal = (user.answers as any)[col.id];
                }
                if (Array.isArray(fallbackCal)) return <span className={`text-xs ${textMain}`}>{fallbackCal.join(', ')}</span>;
                return <div className={`text-xs ${textMain} truncate max-w-[150px]`}>{fallbackCal !== undefined && fallbackCal !== null ? String(fallbackCal) : '-'}</div>;
        }
    };

    // Sort Icon
    const renderSortIcon = (colKey: string) => {
        if (sortConfig.key !== colKey) return null;
        return sortConfig.direction === 'asc'
            ? <ArrowUp size={14} className="text-purple-500 ml-1 inline-block" />
            : <ArrowDown size={14} className="text-purple-500 ml-1 inline-block" />;
    };

    // Stats Calculation
    const displayStats = useMemo(() => {
        return {
            attended: users.filter(u => u.status === 'approved').length,
            absent: users.filter(u => u.status === 'rejected').length,
            unpaid: users.filter(u => !u.isDeposited).length
        };
    }, [users]);

    const getHeaderBg = () => {
        // [REFACTOR] Unified Neutral Header
        if (isDark) {
            return 'bg-slate-800 border-gray-700';
        }
        return 'bg-gray-50 border-gray-200';
    };

    return (
        <div className={`flex flex-col h-full overflow-hidden ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}>
            {/* Header */}
            {!hideHeader && (
                <div className={`px-4 py-3 border-b flex items-center justify-between ${getHeaderBg()}`}>
                    <div className="flex items-center gap-2">
                        <h3 className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                            {tableName} <span className="text-xs font-normal opacity-70">({users.length})</span>
                        </h3>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Stats Summary */}
                        <div className="flex items-center text-xs text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-500">미입금</span>
                                <span className="font-bold text-red-500">{displayStats.unpaid}</span>
                            </div>
                            <div className="w-px h-3 bg-gray-300 mx-3"></div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-500">참석</span>
                                <span className="font-bold text-green-600">{displayStats.attended}</span>
                            </div>
                            <div className="w-px h-3 bg-gray-300 mx-3"></div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-500">미참석</span>
                                <span className="font-bold text-gray-500">{displayStats.absent}</span>
                            </div>
                        </div>

                        {selectedIds.size > 0 && (
                            <div className="flex items-center gap-2 pl-4 border-l border-gray-300/50">
                                <span className="text-xs font-medium text-pink-500">{selectedIds.size}명 선택됨</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="flex-1 overflow-auto scrollbar-thin">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className={isDark ? 'bg-slate-800' : 'bg-gray-50'}>
                        <tr>
                            <th scope="col" className="px-0 py-3 text-center w-8 sticky left-0 z-10 bg-inherit">
                                <button
                                    onClick={onToggleSelectAll ? onToggleSelectAll : undefined}
                                    className={`flex items-center justify-center w-full ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {allSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                </button>
                            </th>
                            {displayColumns.map(col => (
                                <th
                                    key={col.id}
                                    scope="col"
                                    className={`${tableHeaderClass} ${['ticket'].includes(col.id) ? 'w-[100px] max-w-[100px]' : 'w-[1%] whitespace-nowrap'}`}
                                    onClick={() => handleSort(col.id)}
                                >
                                    <div className="flex items-center">
                                        {col.label}
                                        {renderSortIcon(col.id)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        {sortedUsers.length > 0 ? (
                            sortedUsers.map((user, index) => {
                                const isSelected = selectedIds.has(user.id);

                                // Group Header Logic
                                const isFirstInGroup = groupByGender && (
                                    index === 0 || sortedUsers[index - 1].gender !== user.gender
                                );

                                return (
                                    <React.Fragment key={user.id}>
                                        {isFirstInGroup && (
                                            <tr className={isDark ? 'bg-slate-800' : 'bg-gray-50'}>
                                                <td colSpan={displayColumns.length + 1} className={`px-4 py-1.5 border-y ${isDark ? 'border-slate-700 bg-slate-800/40' : 'border-gray-100 bg-gray-50/50'}`}>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`w-0.5 h-3 rounded-full ${user.gender === 'M' ? 'bg-blue-400' : 'bg-pink-400'}`} />
                                                        <span className={`text-[10px] font-bold ${user.gender === 'M'
                                                            ? (isDark ? 'text-blue-400' : 'text-blue-600')
                                                            : (isDark ? 'text-pink-400' : 'text-pink-600')}`}>
                                                            {user.gender === 'M' ? '남' : '여'}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        <tr
                                            key={user.id}
                                            className={`${tableRowClass} ${isSelected ? (isDark ? 'bg-purple-900/20' : 'bg-purple-50') : ''} cursor-pointer`}
                                            onClick={() => onSelectUser && onSelectUser(user)}
                                        >
                                            <td className="px-0 py-2 sticky left-0 z-10 bg-inherit text-center" onClick={(e) => { e.stopPropagation(); }}>
                                                <button
                                                    onClick={() => onToggleSelect && onToggleSelect(user.id)}
                                                    className={`flex items-center justify-center w-full ${isSelected ? 'text-purple-500' : (isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-300 hover:text-gray-500')}`}
                                                >
                                                    {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                                </button>
                                            </td>
                                            {displayColumns.map(col => (
                                                <td
                                                    key={col.id}
                                                    className={`px-3 py-2 ${['ticket'].includes(col.id) ? '' : 'whitespace-nowrap'}`}
                                                >
                                                    {renderCell(col, user)}
                                                </td>
                                            ))}
                                        </tr>
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={displayColumns.length + 1} className={`px-6 py-10 text-center text-sm ${textSub}`}>
                                    참가자가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default PartyGuestTable;
