import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    CheckCircle2,
    Calendar,
    UserPlus,
    MessageCircle,
    ArrowRightLeft,
    Send,
    Search,
    Square,
    CheckSquare
} from "lucide-react";

// Helper Component for Table Rows
function MockGuestTable({ type }: { type: 'M' | 'F' }) {
    const names = type === 'M'
        ? ['김철수', '이민호', '박준형', '최현우', '정우성', '강동원', '조인성', '공유']
        : ['이영희', '김민지', '박지수', '최서연', '한가인', '김태희', '송혜교', '전지현'];

    return (
        <div className="w-full overflow-x-auto scrollbar-thin pb-10">
            <table className="min-w-full divide-y divide-slate-100 table-fixed">
                <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                        <th className="w-8 py-2.5 text-center text-slate-400">
                            <div className="flex items-center justify-center cursor-pointer hover:text-slate-600">
                                <Square size={14} />
                            </div>
                        </th>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase w-[90px]">이름 / 나이</th>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase w-[100px]">연락처</th>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase w-[60px]">초대장</th>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase w-[70px]">티켓</th>
                        <th className="px-2 py-2 text-right text-[10px] font-semibold text-slate-500 uppercase w-[60px]">체크인</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {names.map((name, i) => {
                        const isSelected = i === 1;
                        return (
                            <tr key={i} className={`transition-all group cursor-pointer ${isSelected ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}`}>
                                <td className="py-1.5 text-center text-slate-300">
                                    <div className={`flex items-center justify-center ${isSelected ? 'text-indigo-600' : 'group-hover:text-slate-400'}`}>
                                        {isSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                                    </div>
                                </td>
                                <td className="px-2 py-1.5">
                                    <div className="flex flex-col">
                                        <span className={`text-[11px] font-medium truncate ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{name}</span>
                                        <span className="text-[9px] text-slate-400">{25 + i}세</span>
                                    </div>
                                </td>
                                <td className="px-2 py-1.5">
                                    <span className="text-[10px] text-slate-400 font-mono tracking-tight">010-1234-{1000 + i}</span>
                                </td>
                                <td className="px-2 py-1.5">
                                    <span className={`text-[9px] ${i % 3 === 0 ? 'text-slate-600' : 'text-slate-300'}`}>
                                        {i % 3 === 0 ? '발송됨' : '-'}
                                    </span>
                                </td>
                                <td className="px-2 py-1.5">
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] ${i === 2 ? 'text-amber-600 font-medium' : 'text-slate-500'}`}>
                                            {i === 2 ? '확인필요' : '입금완료'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-2 py-1.5 text-right">
                                    {i < 6 ? (
                                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600">
                                            <CheckCircle2 size={12} />
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-slate-200 text-slate-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    {/* Simulated New Row */}
                    {type === 'M' && (
                        <motion.tr
                            initial={{ opacity: 0, backgroundColor: "#F3E8FF" }}
                            animate={{ opacity: [0, 1, 1, 0], backgroundColor: ["#EEF2FF", "#EEF2FF", "#ffffff"] }}
                            transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <td className="py-1.5 text-center"><div className="w-3 h-3 border border-slate-200 rounded mx-auto" /></td>
                            <td className="px-2 py-1.5">
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-indigo-600">신규 신청자</span>
                                    <span className="text-[9px] text-indigo-400">NEW</span>
                                </div>
                            </td>
                            <td className="px-2 py-1.5" colSpan={3}>
                                <span className="text-[10px] text-slate-400">입금 확인 중...</span>
                            </td>
                            <td className="px-2 py-1.5 text-right">
                                <span className="text-[9px] text-slate-300">대기</span>
                            </td>
                        </motion.tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export function AdminDashboardMockup() {
    return (
        <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            {/* Browser Window (Main Frame) */}
            <div className="w-full aspect-[16/10] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative z-10 ring-1 ring-black/5 font-sans">

                {/* Browser Chrome */}
                <div className="h-9 bg-[#F8FAFC] border-b border-slate-200 flex items-center px-4 justify-between shrink-0">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    </div>
                </div>

                {/* Header Actions */}
                <div className="h-14 px-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-20">
                    <div className="flex items-center gap-4">
                        <h1 className="text-sm font-bold text-slate-800">
                            12/24 솔로 크리스마스
                            <span className="ml-2 text-xs font-normal text-slate-400">2024.12.24</span>
                        </h1>
                        <div className="h-3 w-px bg-slate-200" />
                        <div className="flex gap-3 text-[11px]">
                            <span className="text-slate-500">전체 <strong className="text-slate-800">42</strong></span>
                            <span className="text-slate-500">체크인 <strong className="text-indigo-600">38</strong></span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Compact Search */}
                        <div className="relative group">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                            <input
                                type="text"
                                placeholder="검색"
                                className="w-32 focus:w-48 pl-7 pr-2 py-1 text-[11px] bg-slate-50 border-none rounded-md outline-none focus:ring-1 focus:ring-indigo-100 transition-all placeholder-slate-400 text-slate-600"
                            />
                        </div>
                        <div className="flex bg-slate-100/80 p-0.5 rounded-md">
                            <button className="px-2.5 py-1 text-[10px] font-bold bg-white shadow-sm rounded-sm text-slate-700">전체</button>
                            <button className="px-2.5 py-1 text-[10px] font-medium text-slate-400 hover:text-slate-600">입장</button>
                            <button className="px-2.5 py-1 text-[10px] font-medium text-slate-400 hover:text-slate-600">미입장</button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex overflow-hidden bg-white">
                    <div className="flex-1 flex overflow-hidden relative pr-[50px]">

                        {/* Split View */}
                        <div className="flex-1 flex min-h-0 divide-x divide-slate-100">
                            {/* Male Column */}
                            <div className="flex-1 flex flex-col bg-white">
                                <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                    <h3 className="font-bold text-slate-700 text-[11px]">남성 게스트 <span className="text-[10px] font-normal text-slate-400">(21)</span></h3>
                                </div>
                                <div className="flex-1 overflow-y-auto p-0 scrollbar-thin">
                                    <MockGuestTable type="M" />
                                </div>
                            </div>

                            {/* Female Column */}
                            <div className="flex-1 flex flex-col bg-white hidden lg:flex">
                                <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                    <h3 className="font-bold text-slate-700 text-[11px]">여성 게스트 <span className="text-[10px] font-normal text-slate-400">(21)</span></h3>
                                </div>
                                <div className="flex-1 overflow-y-auto p-0 scrollbar-thin">
                                    <MockGuestTable type="F" />
                                </div>
                            </div>
                        </div>

                        {/* Minimal Smart Dock */}
                        <div className="absolute right-0 top-0 bottom-0 w-[50px] border-l border-slate-100 bg-white flex flex-col items-center py-3 gap-3 z-30">
                            <div className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer">
                                <UserPlus size={16} />
                            </div>
                            <div className="w-6 h-px bg-slate-100" />

                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm cursor-pointer relative">
                                <MessageCircle size={16} />
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
                            </div>
                            <div className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer">
                                <ArrowRightLeft size={16} />
                            </div>
                            <div className="mt-auto w-8 h-8 rounded-lg text-slate-300 hover:text-slate-500 flex items-center justify-center cursor-pointer">
                                <Settings size={16} />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </motion.div>
    );
}
