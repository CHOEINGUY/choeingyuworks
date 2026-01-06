import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar, Check, Clock, History } from 'lucide-react';

interface SessionDropdownProps {
    sessions: Record<string, any>;
    selectedSessionId: string;
    onChangeSession: (id: string) => void;
    isDark?: boolean;
    className?: string;
}

const SessionDropdown: React.FC<SessionDropdownProps> = ({
    sessions,
    selectedSessionId,
    onChangeSession,
    isDark,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!sessions) return null;

    // 1. Group FIRST, then Sort
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD

    const activeList: any[] = [];
    const pastList: any[] = [];

    Object.keys(sessions).forEach(key => {
        const session = sessions[key];
        const dateStr = session.date || "";
        const sessionDate = dateStr.includes(' ') ? dateStr.split(' ')[0] : dateStr;

        if (sessionDate >= todayStr) {
            activeList.push({ id: key, ...session });
        } else {
            pastList.push({ id: key, ...session });
        }
    });

    // 2. Sort Each Group
    // Active: Ascending (Soonest first) -> 12/20, 12/25, 01/01
    const activeSessions = activeList.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateA - dateB;
    });

    // Past: Descending (Most recent first) -> 12/15, 12/10...
    const pastSessions = pastList.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
    });

    // Reverse active sessions to show nearest future first? 
    // Actually, sorting descending puts future dates at top, which is good.
    // But usually "Next Session" is closest to now. 
    // If we sort descending: [2025-01-01, 2024-12-25, 2024-12-20]
    // Valid.

    const currentSession = sessions[selectedSessionId];

    // Style Constants
    const baseBg = isDark ? 'bg-slate-800' : 'bg-white';
    const hoverBg = isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-50';
    const borderColor = isDark ? 'border-slate-600' : 'border-gray-300';
    const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
    const subtleText = isDark ? 'text-gray-400' : 'text-gray-500';

    const handleSelect = (id: string) => {
        onChangeSession(id);
        setIsOpen(false);
    };

    const renderOption = (session: any) => {
        const isSelected = selectedSessionId === session.id;

        let dateDisplay = session.date;
        try {
            const [d, t] = session.date.split(' ');
            const [_, m, day] = d.split('-');
            const h = t.split(':')[0];
            dateDisplay = `${m}.${day} ${h}시`;
        } catch (e) { }

        return (
            <button
                key={session.id}
                onClick={() => handleSelect(session.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors rounded-lg mb-1 ${isSelected
                    ? (isDark ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-50 text-pink-600')
                    : hoverBg + ' ' + textColor
                    }`}
            >
                <div className="flex flex-col items-start gap-0.5 min-w-0">
                    <span className={`font-medium truncate max-w-[180px] ${isSelected ? 'font-bold' : ''}`}>
                        {session.title}
                    </span>
                    <span className={`text-xs ${isSelected ? (isDark ? 'text-pink-300/70' : 'text-pink-400') : subtleText}`}>
                        {dateDisplay}
                    </span>
                </div>
                {isSelected && <Check size={14} className="shrink-0 ml-2" />}
            </button>
        );
    };

    const getTriggerLabel = (session: any) => {
        if (!session) return '세션 선택';
        try {
            const [d, t] = session.date.split(' ');
            const [y, m, day] = d.split('-');
            const h = t.split(':')[0];
            return `${y}.${parseInt(m)}.${parseInt(day)} ${parseInt(h)}시`;
        } catch (e) {
            return session.title;
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${baseBg} ${borderColor} ${hoverBg} ${textColor}`}
            >
                <span className="text-sm font-bold font-mono tracking-tight whitespace-nowrap">
                    {getTriggerLabel(currentSession)}
                </span>
                <ChevronDown size={14} className={`opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className={`absolute top-full right-0 mt-2 w-64 rounded-xl shadow-xl border overflow-hidden z-50 flex flex-col max-h-[400px] ${baseBg} ${borderColor}`}>
                    <div className="overflow-y-auto p-2 scrollbar-thin flex-1">
                        {/* Active Group */}
                        {activeSessions.length > 0 && (
                            <div className="mb-2">
                                <div className={`flex items-center gap-1.5 px-2 py-1.5 text-xs font-bold uppercase tracking-wider ${subtleText}`}>
                                    <Clock size={12} /> 예정 및 진행중
                                </div>
                                {activeSessions.map(renderOption)}
                            </div>
                        )}

                        {/* Divider if both exist */}
                        {activeSessions.length > 0 && pastSessions.length > 0 && (
                            <div className={`h-px my-1 mx-2 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`} />
                        )}

                        {/* Past Group */}
                        {pastSessions.length > 0 && (
                            <div>
                                <div className={`flex items-center gap-1.5 px-2 py-1.5 text-xs font-bold uppercase tracking-wider ${subtleText}`}>
                                    <History size={12} /> 지난 세션
                                </div>
                                {pastSessions.map(renderOption)}
                            </div>
                        )}

                        {activeSessions.length === 0 && pastSessions.length === 0 && (
                            <div className="p-4 text-center text-sm opacity-50">
                                데이터 없음
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionDropdown;
