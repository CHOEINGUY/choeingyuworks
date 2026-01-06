import React from 'react';
import { QrCode, UserCheck, Users } from 'lucide-react';

interface MobilePartyDashboardProps {
    session: any;
    stats: {
        total: number;
        checkedIn: number;
        male: number;
        female: number;
        maleCheckedIn: number;
        femaleCheckedIn: number;
    };
    onScanQr: () => void;
    onManualCheckIn: () => void;
    isDark?: boolean;
}

const MobilePartyDashboard: React.FC<MobilePartyDashboardProps> = ({ session, stats, onScanQr, onManualCheckIn, isDark }) => {
    // Calculate Percentages
    const checkInRate = stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0;

    return (
        <div className={`flex flex-col gap-4 p-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm ${isDark ? 'bg-slate-800' : 'bg-white border border-gray-100'}`}>
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>총 신청자</span>
                    <span className="text-3xl font-bold">{stats.total}</span>
                    <span className="text-xs text-green-500">+{stats.total}명</span>
                </div>
                <div className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm ${isDark ? 'bg-slate-800' : 'bg-white border border-gray-100'}`}>
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>현재 입장</span>
                    <span className="text-3xl font-bold text-pink-500">{stats.checkedIn}</span>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{checkInRate}% 입장율</span>
                </div>
            </div>

            {/* Main Action Buttons */}
            <div className="grid grid-cols-1 gap-3">
                <button
                    onClick={onScanQr}
                    className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl shadow-lg shadow-pink-500/30 active:scale-95 transition-transform"
                >
                    <QrCode size={24} />
                    <span className="text-lg font-bold">QR 체크인 스캔</span>
                </button>
            </div>

            {/* Expanded Gender & Attendance Stats */}
            <div className={`p-4 rounded-2xl shadow-sm ${isDark ? 'bg-slate-800' : 'bg-white border border-gray-100'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        실시간 입장 및 성비
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Male Stat */}
                    <div className={`p-3 rounded-xl flex flex-col items-center justify-center ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                        <span className="text-xs font-bold text-blue-500 mb-1">남성</span>
                        <div className="flex items-end gap-1 mb-1">
                            <span className="text-2xl font-bold text-blue-600">{stats.maleCheckedIn}</span>
                            <span className="text-xs text-gray-400 mb-1">/ {stats.male}</span>
                        </div>
                        <div className="text-[10px] text-blue-400 font-medium">
                            {stats.male > 0 ? Math.round((stats.maleCheckedIn / stats.male) * 100) : 0}% 입장
                        </div>
                    </div>

                    {/* Female Stat */}
                    <div className={`p-3 rounded-xl flex flex-col items-center justify-center ${isDark ? 'bg-pink-900/20' : 'bg-pink-50'}`}>
                        <span className="text-xs font-bold text-pink-500 mb-1">여성</span>
                        <div className="flex items-end gap-1 mb-1">
                            <span className="text-2xl font-bold text-pink-600">{stats.femaleCheckedIn}</span>
                            <span className="text-xs text-gray-400 mb-1">/ {stats.female}</span>
                        </div>
                        <div className="text-[10px] text-pink-400 font-medium">
                            {stats.female > 0 ? Math.round((stats.femaleCheckedIn / stats.female) * 100) : 0}% 입장
                        </div>
                    </div>
                </div>

                {/* Gender Balance Bar */}
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-medium text-gray-400 px-1">
                        <span>남녀 성비 Balance</span>
                        <span>{stats.checkedIn > 0 ? `${Math.round((stats.maleCheckedIn / stats.checkedIn) * 100)} : ${Math.round((stats.femaleCheckedIn / stats.checkedIn) * 100)}` : '0 : 0'}</span>
                    </div>
                    <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex relative">
                        {stats.checkedIn > 0 ? (
                            <>
                                <div
                                    style={{ width: `${(stats.maleCheckedIn / stats.checkedIn) * 100}%` }}
                                    className="h-full bg-blue-500 transition-all duration-500"
                                />
                                <div
                                    style={{ width: `${(stats.femaleCheckedIn / stats.checkedIn) * 100}%` }}
                                    className="h-full bg-pink-500 transition-all duration-500"
                                />
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                                -
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Example: Ticket Types or Other Info */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium opacity-70">티켓 현황</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${isDark ? 'border-gray-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                        얼리버드 12명
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${isDark ? 'border-gray-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                        일반 45명
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${isDark ? 'border-gray-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                        현장구매 3명
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MobilePartyDashboard;
