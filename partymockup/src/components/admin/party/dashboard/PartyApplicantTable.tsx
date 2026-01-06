import React, { useState, useMemo } from 'react';
import { CheckSquare, Square, ArrowUp, ArrowDown, ChevronDown, ChevronRight } from 'lucide-react';
import { getAge } from '../../../../utils/ageUtils';
import { Applicant } from '../../../../types';

interface Column {
    id: string;
    label: string;
    render?: (app: Applicant) => React.ReactNode;
    className?: string; // [NEW] Allow custom width/classes
}

interface PartyApplicantTableProps {
    applicants?: Applicant[];
    onSelectApplicant?: (app: Applicant) => void;
    isDark?: boolean;
    selectedIds?: Set<string>;
    onToggleSelect?: (id: string) => void;
    onToggleSelectAll?: () => void;
    tableName: string;
    type?: 'male' | 'female' | 'all';
    columns?: Column[];
    hideHeader?: boolean;
    onApprove?: (app: Applicant) => void;
    onReject?: (app: Applicant) => void;
    groupByGender?: boolean;
}

const PartyApplicantTable: React.FC<PartyApplicantTableProps> = ({
    applicants = [],
    onSelectApplicant,
    isDark,
    selectedIds = new Set(),
    onToggleSelect,
    onToggleSelectAll,
    tableName,
    columns = [],
    hideHeader,
    groupByGender
}) => {
    const [isRejectedOpen, setIsRejectedOpen] = useState(false);

    // Default columns if none provided
    const displayColumns = columns.length > 0 ? columns : [
        { id: 'name_age', label: '이름 / 나이' },
        { id: 'contact', label: '연락처' },
        { id: 'status', label: '상태' },
        { id: 'ticket', label: '티켓' }
    ];

    // Sorting State
    // keys: null (default), 'asc', 'desc'
    const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

    // Handle Sort Click
    const handleSort = (key: string) => {
        setSortConfig((current) => {
            if (current.key === key) {
                if (current.direction === 'asc') return { key, direction: 'desc' };
                if (current.direction === 'desc') return { key: null, direction: 'asc' }; // Reset to default
            }
            return { key, direction: 'asc' };
        });
    };

    // Helper to get time safely
    const getTime = (item: any) => {
        const val = item.createdAt || item.appliedAt || item.timestamp;
        // Handle Firestore Timestamp or Date object or string
        if (val?.seconds) return val.seconds;
        if (val instanceof Date) return val.getTime();
        if (typeof val === 'string') return new Date(val).getTime();
        return 0;
    };

    // Sorted & Filtered Applicants (Split into Active and Rejected)
    const { activeApplicants, rejectedApplicants } = useMemo(() => {
        // 1. Split active and rejected first to sort them independently
        const active: Applicant[] = [];
        const rejected: Applicant[] = [];

        applicants.forEach(app => {
            if (app.status === 'rejected') rejected.push(app);
            else active.push(app);
        });

        // 2. Sort Helper Function
        const sortList = (list: Applicant[]) => {
            let sortableItems = [...list];

            // Default Sort (Applied when no specific column sort is active)
            if (!sortConfig.key) {
                const statusPriority: Record<string, number> = { 'pending': 0, 'approved': 1, 'rejected': 2 };
                return sortableItems.sort((a, b) => {
                    // [NEW] Prioritize Gender if groupByGender is on
                    if (groupByGender && a.gender !== b.gender) {
                        return a.gender === 'M' ? -1 : 1;
                    }
                    const statusA = statusPriority[a.status || 'pending'] ?? 0;
                    const statusB = statusPriority[b.status || 'pending'] ?? 0;
                    if (statusA !== statusB) return statusA - statusB;
                    return getTime(a) - getTime(b);
                });
            }

            // Interactive Column Sort
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
                } else if (key === 'status') {
                    valA = a.status || '';
                    valB = b.status || '';
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
        };

        return {
            activeApplicants: sortList(active),
            rejectedApplicants: sortList(rejected)
        };

    }, [applicants, sortConfig]);


    // Styling constants
    // Styling constants
    const tableHeaderClass = `px-2 py-3 text-left text-[11px] font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider cursor-pointer select-none group hover:bg-gray-100/10 transition-colors`;
    const tableRowClass = `border-b transition-colors ${isDark ? 'border-gray-700 hover:bg-slate-800/50' : 'border-gray-200 hover:bg-gray-50'}`;
    const textMain = isDark ? 'text-gray-200' : 'text-gray-900';
    const textSub = isDark ? 'text-gray-400' : 'text-gray-500';

    // Select All assumes targeting ACTIVE applicants
    const allSelected = activeApplicants.length > 0 && activeApplicants.every(a => selectedIds.has(a.id));

    // Status Badge Helper
    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'approved': return <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full text-[10px] font-bold">승인</span>;
            case 'rejected': return <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full text-[10px] font-bold">거절</span>;
            case 'pending': default: return <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full text-[10px] font-bold">대기</span>;
        }
    };

    // Helper to get cell content
    const renderCell = (col: Column, app: Applicant) => {
        if (col.render) return col.render(app);

        switch (col.id) {
            case 'name_age':
                return (
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${app.status === 'approved' ? 'bg-green-500' :
                            app.status === 'rejected' ? 'bg-red-500' : 'bg-amber-400'
                            }`} />
                        <div>
                            <div className={`text-xs font-medium ${textMain}`}>
                                {app.name}
                            </div>
                            <div className={`text-[10px] ${textSub} -mt-0.5`}>
                                {getAge(app)}세
                            </div>
                        </div>
                    </div>
                );
            case 'contact':
                return (
                    <div className={`flex items-center text-[10px] ${textSub}`}>
                        {app.phone || app.phoneNumber || '-'}
                    </div>
                );
            case 'status':
                return getStatusBadge(app.status);
            case 'deposit_status':
                if (app.paymentStatus === 'check_required') {
                    return (
                        <span className="px-1.5 py-0.5 inline-flex text-[10px] leading-3 font-semibold rounded-full bg-gray-100 text-gray-600">
                            확인필요
                        </span>
                    );
                }
                return (
                    <span className={`px-1.5 py-0.5 inline-flex text-[10px] leading-3 font-semibold rounded-full ${app.isDeposited ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {app.isDeposited ? '입금' : '미입금'}
                    </span>
                );
            case 'invite_status':
                const isSent = app.inviteStatus === 'sent' || app.inviteSent;
                return (
                    <span className={`px-1.5 py-0.5 inline-flex text-[10px] leading-3 font-semibold rounded-full ${isSent ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {isSent ? '발송' : '미발송'}
                    </span>
                );
            case 'ticket':
                return (
                    <div className={`text-xs ${textMain} truncate max-w-[100px]`} title={app.ticketLabel || app.ticketType || '기본'}>
                        {app.ticketLabel || app.ticketType || '기본'}
                    </div>
                );
            default:
                let val = (app as any)[col.id];
                if (val === undefined && app.answers) {
                    val = (app.answers as any)[col.id];
                }
                if (Array.isArray(val)) return <span className={`text-xs ${textMain}`}>{val.join(', ')}</span>;
                if (typeof val === 'boolean') return <span className={`text-xs ${textMain} font-mono`}>{val ? 'Yes' : 'No'}</span>;
                return <div className={`text-xs ${textMain} truncate max-w-[150px]`} title={typeof val === 'string' ? val : ''}>{val !== undefined && val !== null ? String(val) : '-'}</div>;
        }
    };

    // Render Sort Icon
    const renderSortIcon = (colKey: string) => {
        if (sortConfig.key !== colKey) {
            return null;
        }
        return sortConfig.direction === 'asc'
            ? <ArrowUp size={14} className="text-indigo-500 ml-1 inline-block" />
            : <ArrowDown size={14} className="text-indigo-500 ml-1 inline-block" />;
    };

    // Stats Calculation
    const stats = useMemo(() => {
        return {
            approved: applicants.filter(u => u.status === 'approved').length,
            waiting: applicants.filter(u => u.status === 'pending').length,
            unpaid: applicants.filter(u => !u.isDeposited).length
        };
    }, [applicants]);

    const getHeaderBg = () => {
        if (isDark) {
            return 'bg-slate-800 border-gray-700';
        }
        return 'bg-gray-50 border-gray-200';
    };

    return (
        <div className={`flex flex-col h-full overflow-hidden ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}>
            {/* Table Header */}
            {!hideHeader && (
                <div className={`px-4 py-3 border-b flex items-center justify-between ${getHeaderBg()}`}>
                    <div className="flex items-center gap-2">
                        <h3 className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                            {tableName} <span className="text-xs font-normal opacity-70">({applicants.length})</span>
                        </h3>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Stats Summary */}
                        <div className="flex items-center text-xs text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-500">승인</span>
                                <span className="font-bold text-green-600">{stats.approved}</span>
                            </div>
                            <div className="w-px h-3 bg-gray-300 mx-3"></div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-500">대기</span>
                                <span className="font-bold text-yellow-600">{stats.waiting}</span>
                            </div>
                            <div className="w-px h-3 bg-gray-300 mx-3"></div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-500">미입금</span>
                                <span className="font-bold text-red-500">{stats.unpaid}</span>
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

            {/* Table Area */}
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
                            {displayColumns.map(col => {
                                // Determine Width Class
                                let widthClass = col.className;
                                if (!widthClass) {
                                    // Default: Allow content to dictate width (auto) with standard padding and no wrapping
                                    widthClass = 'whitespace-nowrap px-2';
                                }

                                return (
                                    <th
                                        key={col.id}
                                        scope="col"
                                        className={`${tableHeaderClass} ${widthClass}`}
                                        onClick={() => handleSort(col.id)}
                                    >
                                        <div className="flex items-center">
                                            {col.label}
                                            {renderSortIcon(col.id)}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        {/* Active Applicants */}
                        {activeApplicants.map((app, index) => {
                            const isSelected = selectedIds.has(app.id);

                            // Group Header Logic
                            const isFirstInGroup = groupByGender && (
                                index === 0 || activeApplicants[index - 1].gender !== app.gender
                            );

                            return (
                                <React.Fragment key={app.id}>
                                    {isFirstInGroup && (
                                        <tr className={isDark ? 'bg-slate-800' : 'bg-gray-50'}>
                                            <td colSpan={displayColumns.length + 1} className={`px-4 py-1.5 border-y ${isDark ? 'border-slate-700 bg-slate-800/40' : 'border-gray-100 bg-gray-50/50'}`}>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-0.5 h-3 rounded-full ${app.gender === 'M' ? 'bg-blue-400' : 'bg-pink-400'}`} />
                                                    <span className={`text-[10px] font-bold ${app.gender === 'M'
                                                        ? (isDark ? 'text-blue-400' : 'text-blue-600')
                                                        : (isDark ? 'text-pink-400' : 'text-pink-600')}`}>
                                                        {app.gender === 'M' ? '남' : '여'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    <tr
                                        key={app.id}
                                        className={`${tableRowClass} ${isSelected ? (isDark ? 'bg-pink-900/10' : 'bg-pink-50') : ''} cursor-pointer`}
                                        onClick={() => onSelectApplicant && onSelectApplicant(app)}
                                    >
                                        <td className="px-0 py-2 sticky left-0 z-10 bg-inherit text-center" onClick={(e) => { e.stopPropagation(); }}>
                                            <button
                                                onClick={() => onToggleSelect && onToggleSelect(app.id)}
                                                className={`flex items-center justify-center w-full ${isSelected ? 'text-pink-500' : (isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-300 hover:text-gray-500')}`}
                                            >
                                                {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                            </button>
                                        </td>
                                        {displayColumns.map(col => (
                                            <td
                                                key={col.id}
                                                className={`px-2 py-2 ${['ticket'].includes(col.id) ? '' : 'whitespace-nowrap'}`}
                                            >
                                                {renderCell(col, app)}
                                            </td>
                                        ))}
                                    </tr>
                                </React.Fragment>
                            );
                        })}

                        {/* Rejected Section Toggle */}
                        {rejectedApplicants.length > 0 && (
                            <tr>
                                <td colSpan={displayColumns.length + 1} className="p-0 border-t border-gray-200/50">
                                    <button
                                        onClick={() => setIsRejectedOpen(!isRejectedOpen)}
                                        className={`w-full flex items-center justify-center gap-2 py-3 text-xs font-bold transition-colors ${isDark ? 'bg-slate-800/80 text-gray-500 hover:bg-slate-800 hover:text-gray-300' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                                    >
                                        {isRejectedOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                        거절된 신청자 ({rejectedApplicants.length}명)
                                    </button>
                                </td>
                            </tr>
                        )}

                        {/* Rejected Applicants (if open) */}
                        {isRejectedOpen && rejectedApplicants.map((app) => {
                            const isSelected = selectedIds.has(app.id);
                            return (
                                <tr
                                    key={app.id}
                                    className={`${tableRowClass} ${isSelected ? (isDark ? 'bg-pink-900/10' : 'bg-pink-50') : ''} cursor-pointer`}
                                    onClick={() => onSelectApplicant && onSelectApplicant(app)}
                                >
                                    <td className="px-3 py-2 sticky left-0 z-10 bg-inherit" onClick={(e) => { e.stopPropagation(); }}>
                                        <button
                                            onClick={() => onToggleSelect && onToggleSelect(app.id)}
                                            className={`${isSelected ? 'text-pink-500' : (isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-300 hover:text-gray-500')}`}
                                        >
                                            {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                        </button>
                                    </td>
                                    {displayColumns.map(col => (
                                        <td
                                            key={col.id}
                                            className={`px-1 py-1 ${['ticket'].includes(col.id) ? '' : 'whitespace-nowrap'}`}
                                        >
                                            {renderCell(col, app)}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}

                        {applicants.length === 0 && (
                            <tr>
                                <td colSpan={displayColumns.length + 1} className={`px-6 py-10 text-center text-sm ${textSub}`}>
                                    신청자가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PartyApplicantTable;
