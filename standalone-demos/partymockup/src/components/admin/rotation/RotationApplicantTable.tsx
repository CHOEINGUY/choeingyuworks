import React, { useState, useMemo } from 'react';
import { CheckSquare, Square, ArrowUp, ArrowDown } from 'lucide-react';
import { Applicant } from '../../../types';
import { getAge } from '../../../utils/ageUtils';

interface Column {
    id: string;
    label: string;
    render?: (applicant: Applicant) => React.ReactNode;
}

interface RotationApplicantTableProps {
    applicants?: Applicant[];
    onSelectApplicant?: (applicant: Applicant) => void;
    isDark?: boolean;
    selectedIds?: Set<string>;
    onToggleSelect?: (id: string) => void;
    onToggleSelectAll?: () => void;
    tableName?: React.ReactNode;
    columns?: Column[];
    hideCountHeader?: boolean;
}

const RotationApplicantTable: React.FC<RotationApplicantTableProps> = ({
    applicants = [],
    onSelectApplicant,
    isDark,
    selectedIds = new Set(),
    onToggleSelect,
    onToggleSelectAll,
    tableName,
    columns = [],
    hideCountHeader = false
}) => {
    // Default columns if none provided
    const displayColumns: Column[] = columns.length > 0 ? columns : [
        { id: 'name_age', label: '이름 / 나이' },
        { id: 'contact', label: '연락처' },
        { id: 'status', label: '상태' }
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
    const sortedApplicants = useMemo(() => {
        let sortableItems = [...applicants];

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
    }, [applicants, sortConfig]);

    // Styling Constants
    const textMain = isDark ? 'text-gray-200' : 'text-gray-900';
    const textSub = isDark ? 'text-gray-500' : 'text-gray-400';

    // Header Style
    const thClasses = `px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'} cursor-pointer select-none whitespace-nowrap`;

    // Row Style
    const trClasses = `border-b transition-colors group ${isDark ? 'border-gray-800 hover:bg-slate-800/40' : 'border-gray-400 hover:bg-gray-50/80'}`;

    const allSelected = applicants.length > 0 && applicants.every(u => selectedIds.has(u.id));

    // Cell Renderer
    const renderCell = (col: Column, applicant: Applicant) => {
        if (col.render) return col.render(applicant);

        switch (col.id) {
            case 'name_age':
                return (
                    <div className="flex flex-col justify-center h-full">
                        <div className={`text-sm font-bold ${textMain} flex items-center gap-1.5`}>
                            {applicant.name}
                            {applicant.mbti && (
                                <span className={`text-[10px] px-1 rounded border opacity-70 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                                    {applicant.mbti}
                                </span>
                            )}
                        </div>
                        <div className={`text-[12px] ${textSub} mt-0.5`}>
                            {getAge(applicant.birthDate || '')}세
                        </div>
                    </div>
                );
            case 'contact':
                return (
                    <div className={`text-[13px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {applicant.phone || '-'}
                    </div>
                );
            case 'job':
                return (
                    <div className={`text-[13px] ${textMain} truncate max-w-[120px]`}>
                        {applicant.job || '-'}
                    </div>
                );
            case 'status':
                let statusColor = isDark ? 'text-gray-500' : 'text-gray-500';
                let statusText = '대기';
                // @ts-ignore
                if (applicant.status === 'approved') { statusColor = 'text-blue-600'; statusText = '승인됨'; }
                // @ts-ignore
                else if (applicant.status === 'rejected') { statusColor = 'text-red-500'; statusText = '거절됨'; }

                return (
                    <div className={`text-[13px] font-semibold flex items-center gap-1.5 ${statusColor}`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                        {statusText}
                    </div>
                );
            default:
                let val = (applicant as any)[col.id];
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
                            {applicants.length}
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
                        {sortedApplicants.length > 0 ? (
                            sortedApplicants.map(applicant => {
                                const isSelected = selectedIds.has(applicant.id);
                                return (
                                    <tr
                                        key={applicant.id}
                                        className={`${trClasses} ${isSelected ? (isDark ? 'bg-blue-900/10' : 'bg-blue-50/40') : ''} cursor-pointer`}
                                        onClick={() => onSelectApplicant && onSelectApplicant(applicant)}
                                    >
                                        <td className="px-3 py-2.5" onClick={(e) => { e.stopPropagation(); }}>
                                            <button
                                                onClick={() => onToggleSelect && onToggleSelect(applicant.id)}
                                                className={`transition-colors ${isSelected ? 'text-blue-500' : (isDark ? 'text-gray-700 hover:text-gray-500' : 'text-gray-300 hover:text-gray-500')}`}
                                            >
                                                {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                                            </button>
                                        </td>
                                        {displayColumns.map(col => (
                                            <td key={col.id} className="px-3 py-2.5 align-middle">
                                                {renderCell(col, applicant)}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={displayColumns.length + 1} className={`px-6 py-20 text-center text-xs ${textSub} opacity-50`}>
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

export default RotationApplicantTable;
