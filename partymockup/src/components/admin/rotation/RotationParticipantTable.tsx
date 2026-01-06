import React, { useState, useMemo } from 'react';
import { CheckSquare, Square, ArrowUp, ArrowDown } from 'lucide-react';
import { User } from '../../../types';
import { getAge } from '../../../utils/ageUtils';

interface Column {
    id: string;
    label: string;
    render?: (user: User) => React.ReactNode;
}

interface RotationParticipantTableProps {
    users?: User[];
    onSelectUser?: (user: User) => void;
    isDark?: boolean;
    selectedIds?: Set<string>;
    onToggleSelect?: (id: string) => void;
    onToggleSelectAll?: () => void;
    tableName?: React.ReactNode;
    columns?: Column[];
    hideCountHeader?: boolean;
    onMoveUser?: (user: User) => void;
}

const RotationParticipantTable: React.FC<RotationParticipantTableProps> = ({
    users = [],
    onSelectUser,
    isDark,
    selectedIds = new Set(),
    onToggleSelect,
    onToggleSelectAll,
    tableName,
    columns = [],
    hideCountHeader = false,
    onMoveUser
}) => {
    // Default columns if none provided
    const displayColumns: Column[] = columns.length > 0 ? columns : [
        { id: 'name_age', label: '이름 / 나이' },
        { id: 'contact', label: '연락처' },
        { id: 'job', label: '직업' },
        { id: 'location', label: '지역' },
        { id: 'status', label: '상태' } // Using 'status' slot for check-in/deposit status badges maybe?
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
            return sortableItems.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }

        return sortableItems.sort((a, b) => {
            const key = sortConfig.key!;
            let valA: any = (a as any)[key] || '';
            let valB: any = (b as any)[key] || '';

            // Handle nested or special fields if needed
            if (key === 'name_age') {
                valA = a.name || '';
                valB = b.name || '';
            }

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [users, sortConfig]);

    // Styling Constants
    const textMain = isDark ? 'text-gray-200' : 'text-gray-900';
    const textSub = isDark ? 'text-gray-500' : 'text-gray-400';

    // Header Style
    const thClasses = `px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'} cursor-pointer select-none whitespace-nowrap`;

    // Row Style
    const trClasses = `border-b transition-colors group ${isDark ? 'border-gray-800 hover:bg-slate-800/40' : 'border-gray-400 hover:bg-gray-50/80'}`;

    const allSelected = users.length > 0 && users.every(u => selectedIds.has(u.id));

    // Cell Renderer
    const renderCell = (col: Column, user: User) => {
        if (col.render) return col.render(user);

        switch (col.id) {
            case 'name_age':
                return (
                    <div className="flex flex-col justify-center h-full">
                        <div className={`text-sm font-bold ${textMain} flex items-center gap-1.5`}>
                            {user.name}
                            {user.mbti && (
                                <span className={`text-[10px] px-1 rounded border opacity-70 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                                    {user.mbti}
                                </span>
                            )}
                        </div>
                        <div className={`text-[12px] ${textSub} mt-0.5`}>
                            {getAge(user.birthDate || '')}세
                        </div>
                    </div>
                );
            case 'contact':
                return (
                    <div className={`text-[13px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user.phone || user.phoneNumber || '-'}
                    </div>
                );
            case 'job':
                return (
                    <div className={`text-[13px] ${textMain} truncate max-w-[120px]`}>
                        {user.job || '-'}
                    </div>
                );
            case 'location':
                return (
                    <div className={`text-[13px] ${textMain} truncate max-w-[100px]`}>
                        {user.location || '-'}
                    </div>
                );
            case 'status':
                return (
                    <div className="flex items-center gap-1">
                        {user.isDeposited && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                                입금
                            </span>
                        )}
                        {user.isSmsSent !== false && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-600'}`}>
                                문자
                            </span>
                        )}
                    </div>
                );
            default:
                let val = (user as any)[col.id];
                if (val === undefined) return <span className="text-gray-300">-</span>;
                return <div className={`text-[13px] ${textMain}`}>{String(val)}</div>;
        }
    };

    const renderSortIcon = (colKey: string) => {
        if (sortConfig.key !== colKey) return null;
        return sortConfig.direction === 'asc'
            ? <ArrowUp size={12} className="ml-1 inline-block opacity-70" />
            : <ArrowDown size={12} className="ml-1 inline-block opacity-70" />;
    };

    return (
        <div className="h-full flex flex-col bg-transparent">
            {/* Header (Optional Title) */}
            {tableName && (
                <div className="flex items-center justify-between mb-3 px-1">
                    <div className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'} flex-1`}>{tableName}</div>
                    {!hideCountHeader && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-500'}`}>
                            {users.length}
                        </span>
                    )}
                </div>
            )}

            <div className="flex-1 overflow-auto scrollbar-thin">
                <table className="min-w-full table-fixed">
                    <thead className={isDark ? 'bg-slate-800' : 'bg-gray-100'}>
                        <tr>
                            <th scope="col" className="px-2 py-2 text-left w-8">
                                <button
                                    onClick={onToggleSelectAll}
                                    className={`transition-colors ${isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-300 hover:text-gray-500'}`}
                                >
                                    {allSelected ?
                                        <CheckSquare size={16} className={isDark ? 'text-gray-200' : 'text-gray-800'} /> :
                                        <Square size={16} />
                                    }
                                </button>
                            </th>
                            {displayColumns.map(col => (
                                <th
                                    key={col.id}
                                    scope="col"
                                    className={thClasses}
                                    onClick={() => handleSort(col.id)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {renderSortIcon(col.id)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.length > 0 ? (
                            sortedUsers.map(user => {
                                const isSelected = selectedIds.has(user.id);
                                return (
                                    <tr
                                        key={user.id}
                                        className={`${trClasses} ${isSelected ? (isDark ? 'bg-blue-900/10' : 'bg-blue-50/40') : ''} cursor-pointer`}
                                        onClick={() => onSelectUser && onSelectUser(user)}
                                    >
                                        <td className="px-3 py-2.5" onClick={(e) => { e.stopPropagation(); }}>
                                            <button
                                                onClick={() => onToggleSelect && onToggleSelect(user.id)}
                                                className={`transition-colors ${isSelected ? 'text-blue-500' : (isDark ? 'text-gray-700 hover:text-gray-500' : 'text-gray-300 hover:text-gray-500')}`}
                                            >
                                                {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                                            </button>
                                        </td>
                                        {displayColumns.map(col => (
                                            <td key={col.id} className="px-3 py-2.5 align-middle">
                                                {renderCell(col, user)}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={displayColumns.length + 1} className={`px-6 py-20 text-center text-xs ${textSub} opacity-50`}>
                                    참가자가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RotationParticipantTable;
