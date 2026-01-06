import React, { useState } from 'react';
import { Users, X } from 'lucide-react';
import { toast } from 'sonner';
import { User, RotationMap } from '../../../../types';
import { getAge } from '../../../../utils/ageUtils';
import AdminCheckInModal from '../../mobile/AdminCheckInModal';

interface MatchingListActions {
    confirmCheckIn: (userId: string, sessionId?: string, gender?: string) => Promise<boolean>;
    cancelCheckIn: (userId: string) => Promise<boolean>;
    [key: string]: any;
}

interface MatchingListProps {
    currentRound: number;
    dynamicRotations: RotationMap;
    users: User[]; // Keep for compatibility if needed, but unused
    sessionUsersMap: Record<string, User>;
    isDark?: boolean;
    cardBgClass?: string;
    className?: string; // ClassName

    actions: MatchingListActions;
    isMobile?: boolean;
    onSwapUsers?: (u1: string, u2: string, t1: number, t2: number) => void;
    orderedMaleIds?: string[];
}

const MatchingList: React.FC<MatchingListProps> = ({
    currentRound,
    dynamicRotations = {},
    sessionUsersMap,
    isDark,
    className = "",
    actions,
    isMobile = false,
    onSwapUsers,
}) => {
    // Use sessionUsersMap if available
    const effectiveUsers = sessionUsersMap;

    // Modal State
    const [selectedCheckInUser, setSelectedCheckInUser] = useState<User | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckInConfirm = async (userId: string, shouldCheckIn: boolean) => {
        if (!actions) return;
        setIsProcessing(true);
        try {
            if (shouldCheckIn) {
                // Check In
                const user = effectiveUsers[userId] || (selectedCheckInUser?.id === userId ? selectedCheckInUser : null);

                let success = false;
                if (actions.confirmCheckIn) {
                    success = await actions.confirmCheckIn(userId, user?.sessionId, user?.gender);
                }

                if (!success) {
                    toast.error("체크인 실패! (관리자에게 문의하세요)");
                }
            } else {
                // Cancel Check In
                if (actions.cancelCheckIn) await actions.cancelCheckIn(userId);
                else toast.warning("Cancel functionality not connected");
            }
            setSelectedCheckInUser(null);
        } catch (error) {
            console.error("Action failed", error);
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Drag & Drop Handlers ---
    const handleDragStart = (e: React.DragEvent, user: User, tableNumber: number) => {
        if (!onSwapUsers) return;
        // Attach Visual Table Number logic
        e.dataTransfer.setData("application/json", JSON.stringify({
            id: user.id,
            gender: user.gender,
            fromTable: tableNumber
        }));
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Create drop zone
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, targetUser: User | null, targetTable: number) => {
        e.preventDefault();
        if (!onSwapUsers) return;
        try {
            const data = JSON.parse(e.dataTransfer.getData("application/json"));
            const draggedId = data.id;
            const fromTable = data.fromTable;

            if (draggedId === targetUser?.id && fromTable === targetTable) return; // Drop on self
            if (targetUser && data.gender !== targetUser.gender) return; // Prevent mixing genders

            // Swap with Explicit Table Numbers (Visual Swap)
            // Use visual "targetTable" for dragged user, and "fromTable" for target user
            onSwapUsers(draggedId, targetUser?.id || '', targetTable, fromTable);

        } catch (err) {
            console.error("Drop failed", err);
        }
    };

    return (
        <div className={`rounded-xl shadow-lg p-4 overflow-y-auto flex flex-col transition-colors duration-300 border scrollbar-thin ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} ${className}`}>
            <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                <Users size={18} /> 라운드 {currentRound} 매칭
            </h3>

            <div className="space-y-3 flex-1 overflow-y-auto min-h-0 scrollbar-thin">
                {(() => {
                    // 1. Prepare Data
                    const roundPairs = dynamicRotations?.[currentRound] || {};
                    let activePairs: any[] = [];
                    // const processedMales = new Set(); // unused

                    // Helper to get sorting key (Table Number > CheckIn Time > Name)
                    const getSortKey = (u: User | undefined) => {
                        if (u?.tableNumber) return u.tableNumber;
                        // if (u?.checkInAt) return 1000 + u.checkInAt.seconds; // Float to bottom
                        return 9999;
                    };

                    // Collect all potential pairs from dynamicRotations
                    const potentialPairs: { male: User, female: User | undefined }[] = [];
                    Object.entries(roundPairs).forEach(([id1, id2]) => {
                        const u1 = effectiveUsers[id1];
                        if (u1 && u1.gender === 'M') {
                            const u2 = id2 ? effectiveUsers[id2 as string] : undefined;
                            potentialPairs.push({ male: u1, female: u2 });
                            // processedMales.add(id1);
                        }
                    });

                    // Filter and Sort Pairs
                    potentialPairs.forEach(({ male, female }) => {
                        const isMaleArrived = !!(male.isCheckedIn !== false);
                        const isFemaleArrived = !!(female && female.isCheckedIn !== false);

                        if (isMaleArrived || (female && isFemaleArrived)) { // Show if Male is here OR Female is here (to show placeholder)
                            // Determine Sort Key based on Male's table number
                            const sortNum = getSortKey(male);
                            activePairs.push({
                                male, female,
                                isMaleArrived, isFemaleArrived,
                                sortNum
                            });
                        }
                    });


                    // Sort activePairs
                    activePairs.sort((a, b) => a.sortNum - b.sortNum);

                    // 3. Identify Not Arrived Users
                    // Check logic in user code: `const notArrivedList = Object.values(effectiveUsers).filter(u => !u.isCheckedIn);`
                    // Let's emulate that.

                    const notArrivedListStrict = Object.values(effectiveUsers).filter(u => !(u as any).isCheckedIn);
                    notArrivedListStrict.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

                    return (
                        <>
                            {(() => {
                                const males = Object.values(effectiveUsers).filter(u => u.gender === 'M' && (u.tableNumber || u.isCheckedIn));
                                const females = Object.values(effectiveUsers).filter(u => u.gender === 'F' && (u.tableNumber || u.isCheckedIn));
                                const count = Math.max(males.length, females.length) || 0;

                                return Array.from({ length: count }, (_, i) => i + 1).map(tableNum => {
                                    const originalMaleTable = (tableNum - 1 - (currentRound - 1) + (count * 10)) % count + 1;
                                    const male = males.find(u => u.tableNumber === originalMaleTable);
                                    const female = females.find(u => u.tableNumber === tableNum);

                                    const isMaleArrived = !!(male && male.isCheckedIn);
                                    const isFemaleArrived = !!(female && female.isCheckedIn);

                                    return (
                                        <div key={tableNum} className="flex items-center gap-2 mb-2">
                                            {/* Male Card */}
                                            {male && isMaleArrived ? (
                                                <div
                                                    draggable={!!onSwapUsers}
                                                    onDragStart={(e) => handleDragStart(e, male, tableNum)}
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e) => handleDrop(e, male, tableNum)}
                                                    className={`flex-1 flex items-center gap-3 p-3 rounded-xl border shadow-sm transition-all text-left relative cursor-grab active:cursor-grabbing ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} hover:shadow-md`}
                                                >
                                                    <div className="relative shrink-0">
                                                        {male.avatar ? (
                                                            <img
                                                                src={male.avatar}
                                                                alt={male.name}
                                                                className="w-10 h-10 rounded-full object-cover bg-white ring-2 ring-blue-100"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-blue-100">
                                                                <Users size={20} className="text-blue-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0 flex-1 justify-center">
                                                        <div className={`font-bold text-sm truncate leading-tight mb-0.5 ${isDark ? 'text-blue-100' : 'text-gray-900'}`}>{male.name}</div>
                                                        <div className="text-xs text-blue-600 font-medium truncate leading-tight">{getAge(male)}세</div>
                                                        <div className="text-xs text-gray-500 font-medium truncate leading-tight">{male.job}</div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm(`${male.name}님의 체크인을 취소하시겠습니까?`)) {
                                                                handleCheckInConfirm(male.id, false);
                                                            }
                                                        }}
                                                        className="absolute top-1 right-1 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e) => handleDrop(e, null, tableNum)}
                                                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed text-center opacity-70 ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50/50'}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-700 text-slate-500' : 'bg-gray-200 text-gray-400'}`}>
                                                        <Users size={14} />
                                                    </div>
                                                    <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{male ? '대기 중...' : '빈 자리'}</span>
                                                </div>
                                            )}

                                            {/* Table Number */}
                                            <div className="flex flex-col items-center justify-center shrink-0 w-5">
                                                <span className="text-xs font-bold text-gray-400">{tableNum}</span>
                                            </div>

                                            {/* Female Card */}
                                            {female && isFemaleArrived ? (
                                                <div
                                                    draggable={!!onSwapUsers}
                                                    onDragStart={(e) => handleDragStart(e, female, tableNum)}
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e) => handleDrop(e, female, tableNum)}
                                                    className={`flex-1 flex items-center justify-end gap-3 p-3 rounded-xl border shadow-sm transition-all text-right relative cursor-grab active:cursor-grabbing ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} hover:shadow-md`}
                                                >
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (window.confirm(`${female.name}님의 체크인을 취소하시겠습니까?`)) {
                                                                handleCheckInConfirm(female.id, false);
                                                            }
                                                        }}
                                                        className="absolute top-1 left-1 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    >
                                                        <X size={12} />
                                                    </button>

                                                    <div className="flex flex-col items-end min-w-0 flex-1 justify-center">
                                                        <div className={`font-bold text-sm truncate leading-tight mb-0.5 ${isDark ? 'text-pink-100' : 'text-gray-900'}`}>{female.name}</div>
                                                        <div className="text-xs text-pink-600 font-medium truncate leading-tight">{getAge(female)}세</div>
                                                        <div className="text-xs text-gray-500 font-medium truncate leading-tight">{female.job}</div>
                                                    </div>
                                                    <div className="relative shrink-0">
                                                        {female.avatar ? (
                                                            <img
                                                                src={female.avatar}
                                                                alt={female.name}
                                                                className="w-10 h-10 rounded-full object-cover bg-white ring-2 ring-pink-100"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center ring-2 ring-pink-100">
                                                                <Users size={20} className="text-pink-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    onDragOver={handleDragOver}
                                                    onDrop={(e) => female ? handleDrop(e, female, tableNum) : undefined}
                                                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed text-center opacity-70 ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50/50'}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-700 text-slate-500' : 'bg-gray-200 text-gray-400'}`}>
                                                        <Users size={14} />
                                                    </div>
                                                    <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{female ? '대기 중...' : '빈 자리'}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            })()}

                            {/* Not Arrived Section */}
                            {notArrivedListStrict.length > 0 && (
                                <div className={`mt-6 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <h4 className={`text-xs font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        ⏳ 미도착 참가자 ({notArrivedListStrict.length})
                                    </h4>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className={`text-[10px] font-bold mb-1 text-center ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                                남성 ({notArrivedListStrict.filter(u => u.gender === 'M').length})
                                            </div>
                                            {notArrivedListStrict.filter(u => u.gender === 'M').map(user => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => setSelectedCheckInUser(user)}
                                                    className={`p-2 rounded-lg flex items-center justify-between group cursor-pointer transition-colors ${isDark
                                                        ? 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800'
                                                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="min-w-0 flex-1 mr-2">
                                                        <div className="flex items-center gap-1.5 mb-0.5">
                                                            <span className={`text-sm font-bold truncate ${isDark ? 'text-blue-100' : 'text-gray-900'}`}>
                                                                {user.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (isMobile) {
                                                                setSelectedCheckInUser(user);
                                                            } else {
                                                                handleCheckInConfirm(user.id, true);
                                                            }
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isDark
                                                            ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                                                            : 'bg-white border border-green-200 text-green-600 hover:bg-green-50'
                                                            }`}
                                                        title="체크인"
                                                    >
                                                        체크인
                                                    </button>
                                                </div>
                                            ))}
                                            {notArrivedListStrict.filter(u => u.gender === 'M').length === 0 && (
                                                <div className={`text-xs text-center py-2 opacity-50 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    미도착 인원 없음
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <div className={`text-[10px] font-bold mb-1 text-center ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>
                                                여성 ({notArrivedListStrict.filter(u => u.gender === 'F').length})
                                            </div>
                                            {notArrivedListStrict.filter(u => u.gender === 'F').map(user => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => setSelectedCheckInUser(user)}
                                                    className={`p-2 rounded-lg flex items-center justify-between group cursor-pointer transition-colors ${isDark
                                                        ? 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800'
                                                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="min-w-0 flex-1 mr-2">
                                                        <div className="flex items-center gap-1.5 mb-0.5">
                                                            <span className={`text-sm font-bold truncate ${isDark ? 'text-pink-100' : 'text-gray-900'}`}>
                                                                {user.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (isMobile) {
                                                                setSelectedCheckInUser(user);
                                                            } else {
                                                                handleCheckInConfirm(user.id, true);
                                                            }
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isDark
                                                            ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                                                            : 'bg-white border border-green-200 text-green-600 hover:bg-green-50'
                                                            }`}
                                                        title="체크인"
                                                    >
                                                        체크인
                                                    </button>
                                                </div>
                                            ))}
                                            {notArrivedListStrict.filter(u => u.gender === 'F').length === 0 && (
                                                <div className={`text-xs text-center py-2 opacity-50 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    미도착 인원 없음
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    );
                })()}
            </div>

            <AdminCheckInModal
                isOpen={!!selectedCheckInUser}
                user={selectedCheckInUser}
                onClose={() => setSelectedCheckInUser(null)}
                onConfirm={async (userId) => {
                    await handleCheckInConfirm(userId, true);
                }}
                isCheckingIn={isProcessing}
            />
        </div>
    );
};


export default MatchingList;
