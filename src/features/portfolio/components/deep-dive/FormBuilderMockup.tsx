import { motion } from "framer-motion";
import {
    Plus,
    Type,
    Calendar,
    CheckSquare,
    Phone,
    GripVertical,
    FileVideo,
    ChevronRight,
    Users
} from "lucide-react";

export function FormBuilderMockup() {
    return (
        <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            {/* Browser Window (Main Frame) */}
            <div className="w-full aspect-[16/10] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative z-10 ring-1 ring-black/5">

                {/* Browser Chrome (Header) */}
                <div className="h-10 bg-[#F1F5F9] border-b border-slate-200 flex items-center px-4 justify-between shrink-0">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#EF4444] border border-[#DC2626]/20" />
                        <div className="w-3 h-3 rounded-full bg-[#F59E0B] border border-[#D97706]/20" />
                        <div className="w-3 h-3 rounded-full bg-[#10B981] border border-[#059669]/20" />
                    </div>
                    <div className="flex-1 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-md border border-slate-200 text-[10px] text-slate-500 shadow-sm opacity-80">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            admin.partysaas.com/form-builder
                        </div>
                    </div>
                    <div className="w-16" /> {/* Spacer */}
                </div>

                {/* Actual App Header (Party Manager) */}
                <div className="h-14 bg-white border-b border-slate-100 flex items-center px-6 justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-sm">P</div>
                        <div className="h-4 w-px bg-slate-200 mx-1" />
                        <span className="text-sm font-semibold text-slate-700">신청서 관리</span>
                        <ChevronRight size={14} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">12/24 크리스마스 파티</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer">미리보기</div>
                        <div className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition-all cursor-pointer">저장하기</div>
                    </div>
                </div>

                {/* Main Layout (Canvas vs Toolbar) */}
                <div className="flex flex-1 overflow-hidden relative">

                    {/* MOUSE CURSOR (Overlay) */}
                    <motion.div
                        className="absolute z-[100] pointer-events-none drop-shadow-xl"
                        initial={{ x: "60%", y: "60%", opacity: 0 }}
                        animate={{
                            opacity: 1,
                            x: ["60%", "48%", "48%", "48%", "75%", "75%", "75%", "90%"],
                            y: ["60%", "35%", "35%", "35%", "55%", "55%", "25%", "80%"],
                        }}
                        transition={{
                            duration: 8,
                            times: [0, 0.2, 0.35, 0.45, 0.55, 0.6, 0.8, 1],
                            repeat: Infinity,
                            repeatDelay: 1,
                            ease: "easeInOut"
                        }}
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900 fill-white"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /></svg>
                    </motion.div>

                    {/* Left: Canvas Area */}
                    <div className="flex-1 bg-slate-50 overflow-y-auto scrollbar-hide p-8 flex justify-center">
                        <div className="w-full max-w-2xl flex flex-col gap-4 pb-20">

                            {/* Form Cover */}
                            <div className="bg-white p-8 rounded-t-2xl border-t-8 border-t-indigo-500 shadow-sm border-x border-b border-slate-200/60 group hover:border-slate-300 transition-colors">
                                <div className="h-8 w-2/3 bg-slate-100 rounded mb-4" />
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-slate-50/80 rounded" />
                                    <div className="h-3 w-4/5 bg-slate-50/80 rounded" />
                                </div>
                            </div>

                            {/* Questions List */}
                            <div className="flex flex-col gap-3 relative">

                                {/* Q1: Active Question (Simulating Typing) */}
                                <motion.div
                                    className="bg-white rounded-xl border border-indigo-500 ring-1 ring-indigo-500 shadow-lg scale-[1.005] p-6 relative overflow-hidden"
                                    animate={{
                                        y: [0, 0, 0, 140, 140, 0, 0] // Moves down
                                    }}
                                    transition={{ duration: 8, repeat: Infinity, repeatDelay: 1, times: [0, 0.6, 0.65, 0.75, 0.8, 0.85, 1] }}
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                                    <div className="flex items-center justify-between mb-4">
                                        {/* Typed Input */}
                                        <div className="flex-1 h-10 bg-slate-50 border border-indigo-200 rounded px-3 flex items-center text-slate-800 font-medium text-sm">
                                            <motion.span
                                                initial={{ opacity: 1 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <motion.span
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "auto" }}
                                                    style={{ display: "inline-block", overflow: "hidden", whiteSpace: "nowrap", verticalAlign: "middle" }}
                                                    // Type "이상형을 선택해주세요" in Korean
                                                    transition={{ duration: 1.5, delay: 1.5, ease: "linear" }}
                                                >
                                                    이상형을 선택해주세요
                                                </motion.span>
                                                <motion.span
                                                    animate={{ opacity: [1, 0] }}
                                                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                                    className="inline-block w-[1.5px] h-4 bg-indigo-500 ml-0.5 align-middle"
                                                />
                                            </motion.span>
                                        </div>
                                        <div className="ml-3 px-3 h-10 border border-slate-200 rounded bg-white flex items-center gap-2 min-w-[100px]">
                                            <CheckSquare size={14} className="text-slate-400" />
                                            <span className="text-xs text-slate-600">체크박스</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 pl-1">
                                        {['대화가 잘 통하는 사람', '취미가 비슷한 사람', '유머 코드가 맞는 사람'].map((opt, i) => (
                                            <div key={i} className="flex items-center gap-3 group/opt cursor-pointer">
                                                <div className="w-4 h-4 rounded border border-slate-300 bg-white group-hover/opt:border-indigo-400 transition-colors" />
                                                <div className="text-sm text-slate-600 border-b border-transparent hover:border-slate-200 hover:text-slate-800 transition-colors">{opt}</div>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-3 mt-1 opacity-60">
                                            <div className="w-4 h-4 rounded border border-slate-300 border-dashed" />
                                            <span className="text-xs text-slate-400">옵션 추가</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Q2: Floating Draggable Item (Exact Style Style) */}
                                <motion.div
                                    className="bg-white rounded-xl border border-slate-300 p-0 relative group z-20"
                                    animate={{
                                        scale: [1, 1, 1, 1.02, 1.02, 1, 1],
                                        y: [0, 0, 0, -210, -210, 0, 0], // Drag way UP
                                        zIndex: [10, 10, 10, 50, 50, 10, 10],
                                        boxShadow: [
                                            "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                            "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                            "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // Lift shadow
                                            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                            "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                            "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                                        ],
                                        rotate: [0, 0, 0, -1, -1, 0, 0]
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        repeatDelay: 1,
                                        times: [0, 0.6, 0.65, 0.7, 0.8, 0.85, 1]
                                    }}
                                >
                                    {/* Collapsed Header View */}
                                    <div className="flex items-center p-4 gap-4">
                                        <div className="p-1.5 text-slate-300 cursor-grab hover:bg-slate-50 rounded bg-transparent">
                                            <GripVertical size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-slate-700">나의 성격 유형 (MBTI)</div>
                                            <div className="text-[10px] text-red-500 font-medium mt-0.5">* 필수 응답</div>
                                        </div>
                                        <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                            단답형
                                        </div>
                                    </div>
                                </motion.div>

                            </div>
                        </div>
                    </div>

                    {/* Right: Exact Toolbar Replica */}
                    <div className="w-[300px] bg-white border-l border-slate-200 flex flex-col z-20 hidden lg:flex">

                        {/* Sticky Header */}
                        <div className="p-4 border-b border-slate-100 bg-white">
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                아래 도구 박스에서 항목을 선택하여<br />
                                신청서를 구성해보세요.
                            </p>
                        </div>

                        <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar">

                            {/* Section 1 */}
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">기본 정보 (시스템)</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { icon: <Users size={16} />, label: '이름/성함' },
                                        { icon: <Phone size={16} />, label: '연락처' },
                                        { icon: <Users size={16} />, label: '성별' },
                                        { icon: <Calendar size={16} />, label: '생년월일' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-indigo-100/50 hover:shadow-sm transition-all cursor-pointer group">
                                            <div className="text-slate-400 group-hover:text-indigo-500 mb-1.5 transition-colors">{item.icon}</div>
                                            <span className="text-xs text-slate-600 group-hover:text-indigo-700 font-medium">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 2 */}
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1">
                                    필수 추천 <span className="text-indigo-500 text-[9px] bg-indigo-50 px-1 rounded border border-indigo-100">Core</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 p-3 rounded-lg border border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer group">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-indigo-100 flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-105 transition-transform">
                                            <FileVideo size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-slate-700">신청 동기 / 자기소개</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">서술형 문항 자동 생성</div>
                                        </div>
                                        <Plus size={14} className="text-indigo-400" />
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-600 shadow-sm">
                                            <Type size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold text-slate-700">약관 동의 (개인정보)</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">필수 체크박스</div>
                                        </div>
                                        <Plus size={14} className="text-slate-300" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </motion.div >
    );
}
