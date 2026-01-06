import React from 'react';
import { User } from '../../../types';

interface OverviewTabProps {
    currentRound: number;
    status: string;
    dynamicRotations: any;
    users: Record<string, User>;
    sessionFeedbacks: any[];
    titleTextClass?: string;
    itemBgClass?: string;
    isDark?: boolean;
    orderedMaleIds?: string[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({
    currentRound,
    status,
    dynamicRotations,
    users,
    sessionFeedbacks,
    titleTextClass,
    itemBgClass,
    isDark,
    orderedMaleIds = []
}) => {
    return (
        <div className="p-6 space-y-8">
            {/* 1. Current Round Seating Chart */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl font-bold flex items-center gap-2 ${titleTextClass}`}>
                        <div className="w-2 h-6 bg-pink-500 rounded-full"></div>
                        현재 배치 (라운드 {currentRound})
                    </h3>
                    <div className="text-sm text-gray-500">
                        {status === 'LIVE' ? '🟢 진행 중' : status === 'BREAK' ? '🟡 휴식/이동' : '⚪ 대기 중'}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {(() => {
                        // FIXED TABLE LAYOUT
                        const males = Object.values(users).filter(u => u.gender === 'M' && (u.tableNumber || (u as any).isCheckedIn));
                        const females = Object.values(users).filter(u => u.gender === 'F' && (u.tableNumber || (u as any).isCheckedIn));

                        const count = Math.max(males.length, females.length) || 0;

                        return Array.from({ length: count }, (_, i) => i + 1).map(tableNum => {
                            // Male at Table T (Round R) = Male at Original Table (T - (R-1))
                            // Added (count * 10) to ensure positive result before modulo
                            const originalMaleTable = (tableNum - 1 - (currentRound - 1) + (count * 10)) % count + 1;

                            const male = males.find(u => u.tableNumber === originalMaleTable);
                            const female = females.find(u => u.tableNumber === tableNum);

                            const maleName = (male && (male as any).isCheckedIn !== false) ? male.name : "대기 중...";
                            const femaleName = female
                                ? ((female as any).isCheckedIn !== false ? female.name : "대기 중...")
                                : "빈 자리";

                            return (
                                <div key={tableNum} className={`${itemBgClass} rounded-lg p-3 shadow-sm flex flex-col items-center relative overflow-hidden transition-colors border`}>
                                    <div className={`absolute top-0 left-0 w-full h-1 ${isDark ? 'bg-slate-600' : 'bg-gray-100'}`}></div>
                                    <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">테이블 {tableNum}</div>
                                    <div className="flex items-center justify-between w-full px-2 gap-2">
                                        <span className={`font-bold text-center flex-1 break-keep ${maleName === "대기 중..." ? "text-gray-400 font-normal" : titleTextClass}`}>{maleName}</span>
                                        <span className="text-xs text-gray-400 shrink-0">vs</span>
                                        <span className={`font-bold text-center flex-1 break-keep ${femaleName === "대기 중..." || femaleName === "빈 자리" ? "text-gray-400 font-normal" : titleTextClass}`}>{femaleName}</span>
                                    </div>
                                </div>
                            );
                        });
                    })()}
                </div>
            </div>

            {/* 2. Round History (Only show past rounds) */}
            <div>
                <h3 className={`text-xl font-bold flex items-center gap-2 mb-6 ${titleTextClass}`}>
                    <div className="w-2 h-6 bg-gray-400 rounded-full"></div>
                    지난 라운드 기록
                </h3>

                <div className="space-y-6">
                    {Array.from({ length: currentRound - 1 }, (_, i) => currentRound - 1 - i).map(r => (
                        <div key={r} className={`${itemBgClass} rounded-xl border overflow-hidden`}>
                            <div className={`${isDark ? 'bg-slate-800/50' : 'bg-gray-100/50'} px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'} flex justify-between items-center`}>
                                <h4 className={`font-bold ${titleTextClass}`}>라운드 {r}</h4>
                                <span className={`text-xs font-medium px-2 py-1 rounded border ${isDark ? 'bg-slate-700 border-slate-600 text-gray-300' : 'bg-white border-gray-200 text-gray-500'}`}>종료됨</span>
                            </div>

                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(() => {
                                    const roundPairs = dynamicRotations[r] || {};
                                    const renderedPairs = new Set();
                                    const pairs: any[] = [];

                                    Object.entries(roundPairs).forEach(([id1, id2]) => {
                                        const key = [id1, id2].sort().join('-');
                                        if (!renderedPairs.has(key)) {
                                            renderedPairs.add(key);
                                            const u1 = users[id1];
                                            const u2 = users[id2 as string];
                                            if (u1 && u2) {
                                                const male = u1.gender === 'M' ? u1 : u2;
                                                const female = u1.gender === 'F' ? u1 : u2;

                                                // Get Ratings
                                                const rateMtoF = sessionFeedbacks.find(f => f.fromUserId === male.id && f.toUserId === female.id)?.rating;
                                                const rateFtoM = sessionFeedbacks.find(f => f.fromUserId === female.id && f.toUserId === male.id)?.rating;

                                                pairs.push({ male, female, rateMtoF, rateFtoM });
                                            }
                                        }
                                    });

                                    pairs.sort((a, b) => (a.male.name || '').localeCompare(b.male.name || ''));

                                    return pairs.map((pair, idx) => (
                                        <div key={idx} className={`${isDark ? 'bg-slate-700/50 border-slate-600 hover:border-blue-500/50' : 'bg-white border-gray-100 hover:border-blue-200'} border rounded-lg p-3 flex items-center justify-between transition-colors`}>
                                            <div className="text-xs font-bold text-gray-400 w-12">테이블 {idx + 1}</div>
                                            <div className="flex items-center gap-2 flex-1">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${pair.rateMtoF >= 4 ? 'bg-green-500' : pair.rateMtoF ? 'bg-blue-400' : 'bg-gray-300'}`}>{pair.rateMtoF || '-'}</div>
                                                <span className={`font-medium text-sm truncate ${titleTextClass}`}>{pair.male.name}</span>
                                            </div>
                                            <div className="px-2 text-gray-300">⇄</div>
                                            <div className="flex items-center gap-2 flex-1 justify-end">
                                                <span className={`font-medium text-sm truncate ${titleTextClass}`}>{pair.female.name}</span>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${pair.rateFtoM >= 4 ? 'bg-pink-500' : pair.rateFtoM ? 'bg-purple-400' : 'bg-gray-300'}`}>{pair.rateFtoM || '-'}</div>
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    ))}
                    {currentRound === 1 && <div className="text-center py-8 text-gray-400 italic">아직 기록이 없습니다. (1라운드 진행 중)</div>}
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
