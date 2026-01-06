import React from 'react';
import { CheckCircle } from 'lucide-react';
import { User } from '../../../types';

interface SelectionTabProps {
    sessionSelections?: any; // Matches usage in AdminSessionControl (sessionSelections passed)
    // OR: "finalSelections" as in user code. 
    // In AdminSessionControl: <SelectionTab sessionSelections={sessionSelections} ... />
    // In User Code: "finalSelections = {}"
    // I will support both or map it. 
    // Let's check AdminSessionControl again. It passes `sessionSelections={sessionSelections}`.
    // User code expects `finalSelections`. I will alias it.

    sessionSelections?: any;
    finalSelections?: any; // Alias for user code compatibility
    users: Record<string, User>; // Changed from User[] to Record to match usage users[id]
    isDark?: boolean;
    itemBgClass?: string;
    titleTextClass?: string;
}

const SelectionTab: React.FC<SelectionTabProps> = ({
    sessionSelections,
    finalSelections,
    users,
    isDark,
    itemBgClass,
    titleTextClass
}) => {
    // Unified Selection Data Handling
    const selections = sessionSelections || finalSelections || {};

    const getUserName = (id: string) => users[id]?.name || id;

    const getMatches = () => {
        const matches: [string, string][] = [];
        let selectionMap: Record<string, string[]> = {};

        // 1. Normalize Header Data to Map
        if (Array.isArray(selections)) {
            // Convert Array format to Map format
            selections.forEach((s: any) => {
                if (s && s.userId) {
                    selectionMap[s.userId] = Array.isArray(s.selectedPartnerIds) ? s.selectedPartnerIds : [];
                }
            });
        } else if (typeof selections === 'object' && selections !== null) {
            // Already a Map
            selectionMap = selections;
        }

        // 2. Compute Mutual Matches
        Object.keys(selectionMap).forEach(userId => {
            const myChoices = Array.isArray(selectionMap[userId]) ? selectionMap[userId] : [];
            myChoices.forEach(partnerId => {
                const partnerChoices = selectionMap[partnerId];
                // Check if partner also chose me (mutual)
                if (Array.isArray(partnerChoices) && partnerChoices.includes(userId)) {
                    // Unique Pair Check (canonical order)
                    if (userId < partnerId) {
                        matches.push([userId, partnerId]);
                    }
                }
            });
        });
        return matches;
    };

    const matches = getMatches();

    return (
        <div className="p-6">
            {/* Mutual Matches Section */}
            <div className="mb-10 animate-in slide-in-from-bottom-2 duration-500">
                <h3 className="text-xl font-bold mb-6 text-pink-600 flex items-center gap-2">
                    <div className="p-2 bg-pink-100 rounded-lg">
                        <CheckCircle size={24} />
                    </div>
                    축하합니다! 최종 매칭 성공
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matches.map(([u1, u2], i) => (
                        <div key={i} className={`${itemBgClass} rounded-2xl p-6 shadow-lg border-2 ${isDark ? 'border-pink-900/50' : 'border-pink-100'} flex items-center justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-purple-400"></div>

                            {/* User 1 */}
                            <div className="flex flex-col items-center z-10">
                                <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-pink-200 to-purple-200 mb-2">
                                    <img src={users[u1]?.avatar} className="w-full h-full rounded-full bg-white object-cover" alt={getUserName(u1)} />
                                </div>
                                <span className={`font-bold ${titleTextClass}`}>{getUserName(u1)}</span>
                            </div>

                            {/* Heart Icon */}
                            <div className="flex flex-col items-center z-10 animate-pulse">
                                <div className="text-4xl filter drop-shadow-md">❤️</div>
                                <span className="text-xs text-pink-500 font-bold mt-1">MATCH!</span>
                            </div>

                            {/* User 2 */}
                            <div className="flex flex-col items-center z-10">
                                <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-pink-200 to-purple-200 mb-2">
                                    <img src={users[u2]?.avatar} className="w-full h-full rounded-full bg-white object-cover" alt={getUserName(u2)} />
                                </div>
                                <span className={`font-bold ${titleTextClass}`}>{getUserName(u2)}</span>
                            </div>
                        </div>
                    ))}
                    {matches.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p>매칭 결과가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SelectionTab;
