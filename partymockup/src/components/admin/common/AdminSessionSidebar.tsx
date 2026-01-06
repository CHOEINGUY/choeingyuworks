import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, ChevronDown, ChevronUp, History, Search, RefreshCcw, Users } from 'lucide-react';

import { Session } from '../../../types';

interface AdminSessionSidebarProps {
    sessions: Record<string, Session>;
    selectedSessionId: string;
    onSelectSession: (id: string) => void;
    onAddSession: () => void;
    title?: string;
    statsRenderer?: (session: Session, key: string, isSelected: boolean) => React.ReactNode;
    isDark?: boolean;
}

const AdminSessionSidebar: React.FC<AdminSessionSidebarProps> = ({
    sessions,
    selectedSessionId,
    onSelectSession,
    onAddSession,
    title = "세션 선택",
    statsRenderer,
    isDark
}) => {
    // [RESPONSIVE] Auto-collapse logic
    const prevWidth = React.useRef(typeof window !== 'undefined' ? window.innerWidth : 1200);

    // Persist collapsed state
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('adminSessionSidebarCollapsed');
        return saved === 'true';
    });

    // Handle Resize (Directional Check)
    React.useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            // Only collapse if we are CROSSING the threshold downwards (shrinking)
            if (prevWidth.current >= 1280 && width < 1280 && width > 768) {
                setIsCollapsed(true);
            }

            prevWidth.current = width;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        localStorage.setItem('adminSessionSidebarCollapsed', String(isCollapsed));
    }, [isCollapsed]);

    const [searchTerm, setSearchTerm] = useState('');

    // Style Constants
    const structuralBorder = isDark ? 'border-slate-600' : 'border-gray-300';
    const subtleBorder = isDark ? 'border-gray-700' : 'border-gray-200';
    const bgClass = isDark ? 'bg-slate-900' : 'bg-gray-50';
    const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
    const cardBg = isDark ? 'bg-slate-800' : 'bg-white';

    // Sort sessions
    const sortedKeys = Object.keys(sessions).sort((a, b) => {
        const dateA = sessions[a].date ? new Date(sessions[a].date).getTime() : 0;
        const dateB = sessions[b].date ? new Date(sessions[b].date).getTime() : 0;
        return dateA - dateB;
    });

    // Split into Active and Past
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10); // YYYY-MM-DD

    const activeKeys: string[] = [];
    const pastKeys: string[] = [];

    sortedKeys.forEach(key => {
        const session = sessions[key];
        // Defensive check for date
        const dateStr = session.date || "";
        const sessionDate = dateStr.includes(' ') ? dateStr.split(' ')[0] : dateStr; // Extract YYYY-MM-DD
        const sessionTitle = session.title || "제목 없음";

        // Filter Logic
        const matchesSearch = searchTerm === '' ||
            sessionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dateStr.includes(searchTerm);

        if (matchesSearch) {
            if (sessionDate >= todayStr) {
                activeKeys.push(key);
            } else {
                pastKeys.push(key);
            }
        }
    });

    const [isPastExpanded, setIsPastExpanded] = useState(false);

    const renderSessionItem = (key: string) => {
        const session = sessions[key];
        const isSelected = selectedSessionId === key;
        // Calculate global index for numbering (based on ALL sorted keys)
        const sessionNumber = sortedKeys.indexOf(key) + 1;

        if (isCollapsed) {
            return (
                <button
                    key={key}
                    onClick={() => onSelectSession(key)}
                    className={`w-full flex flex-col items-center justify-center gap-0.5 p-2 rounded-xl transition-all border ${isSelected
                        ? 'bg-pink-600 border-pink-500 text-white shadow-lg'
                        : `${cardBg} border-transparent hover:border-pink-300 hover:shadow-md text-gray-500`
                        }`}
                    title={session.title}
                >
                    {(() => {
                        try {
                            const [d, t] = (session.date || '').split(' ');
                            if (!d || !t) throw new Error('Invalid date');
                            const [_, m, day] = d.split('-'); // 2024-12-09
                            const h = t.split(':')[0]; // 14:00
                            return (
                                <>
                                    <span className="font-bold text-xs leading-none">{parseInt(m)}/{parseInt(day)}</span>
                                    <span className="font-bold text-xs leading-none">{parseInt(h)}시</span>
                                </>
                            );
                        } catch (e) {
                            return <span className="text-xs">{(session.date || '').slice(5, 10)}</span>;
                        }
                    })()}
                </button>
            );
        }

        return (
            <button
                key={key}
                onClick={() => onSelectSession(key)}
                className={`w-full text-left p-2.5 rounded-xl transition-all border relative flex flex-col justify-between gap-1 shadow-sm ${isSelected
                    ? 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-900/20'
                    : `${cardBg} ${subtleBorder} hover:border-pink-300 hover:shadow-md ${textColor}`
                    }`}
            >
                <div className="overflow-hidden">
                    <div className="min-w-[200px]">
                        <div className="text-[10px] opacity-75 leading-none mb-1">
                            {(() => {
                                try {
                                    const [datePart, timePart] = (session.date || '').split(' ');
                                    if (!datePart) return session.date;
                                    const [y, m, d] = datePart.split('-');
                                    const h = timePart ? timePart.split(':')[0] : '00';
                                    return `${y}.${parseInt(m)}.${parseInt(d)} ${parseInt(h)}시`;
                                } catch (e) {
                                    return session.date;
                                }
                            })()}
                        </div>
                        <div className="font-bold text-sm truncate leading-tight pr-6">{session.title}</div>
                    </div>
                </div>

                {/* Session Number Display (Only if selected) */}
                {isSelected && (
                    <div className="absolute top-2 right-2 text-[9px] font-bold text-pink-200 bg-pink-700/50 px-1.5 py-0.5 rounded-full">
                        {sessionNumber}회
                    </div>
                )}

                {/* Custom Stats Rendering */}
                <div className="mt-1 pt-1 border-t border-white/10">
                    {statsRenderer && statsRenderer(session, key, isSelected)}
                </div>
            </button>
        );
    };

    return (
        <div
            className={`shrink-0 border-r ${structuralBorder} flex flex-col transition-all duration-300 ${bgClass} ${isCollapsed ? 'w-20' : 'w-80'}`}
        >
            {/* Header */}
            <div className={`h-[72px] px-4 border-b ${structuralBorder} flex items-center justify-between shrink-0`}>
                {!isCollapsed && (
                    <h2 className={`text-lg font-bold ${textColor} flex items-center gap-2 truncate`}>
                        <Calendar size={20} className="text-pink-500 shrink-0" />
                        {title}
                    </h2>
                )}
                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'} ${isCollapsed ? 'mx-auto' : ''}`}
                    title={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* List */}
            <div
                className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin"
            >
                {/* Active Sessions */}
                {activeKeys.map((key) => renderSessionItem(key))}

                {/* Past Sessions Accordion */}
                {pastKeys.length > 0 && (
                    <div className="pt-2">
                        {!isCollapsed && (
                            <button
                                onClick={() => setIsPastExpanded(!isPastExpanded)}
                                className={`w-full flex items-center justify-between px-2 py-2 text-xs font-bold uppercase tracking-wider mb-2 transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <span className="flex items-center gap-1.5">
                                    <History size={14} />
                                    지난 일정 ({pastKeys.length})
                                </span>
                                {isPastExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                        )}

                        {!isCollapsed && isPastExpanded && (
                            <div className={`space-y-2 ${isCollapsed ? 'pt-2 border-t border-dashed ' + subtleBorder : ''}`}>
                                {pastKeys.map((key) => renderSessionItem(key))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Footer Action */}
            <div className={`p-4 border-t ${structuralBorder} ${cardBg} shrink-0 space-y-3`}>

                {/* Search Bar */}
                <div className={`relative transition-all ${isCollapsed ? 'w-full flex justify-center' : 'w-full'}`}>
                    {isCollapsed ? (
                        <button onClick={() => setIsCollapsed(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                            <Search size={20} />
                        </button>
                    ) : (
                        <div className="relative">
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
                            <input
                                type="text"
                                placeholder="세션명 또는 날짜 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-all ${isDark ? 'bg-slate-900/50 border-slate-700 text-white placeholder-slate-500 focus:border-pink-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-pink-500'}`}
                            />
                        </div>
                    )}
                </div>

                <button
                    onClick={onAddSession}
                    className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-sm active:scale-95 ${isDark ? 'bg-pink-600 text-white hover:bg-pink-500 shadow-pink-900/20' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'}`}
                    title="새 세션 추가"
                >
                    <Plus size={18} />
                    {!isCollapsed && <span>새 세션 추가</span>}
                </button>
            </div>
        </div>
    );
};

export default AdminSessionSidebar;
