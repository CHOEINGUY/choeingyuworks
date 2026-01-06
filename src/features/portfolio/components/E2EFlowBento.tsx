"use client";

import { motion } from "framer-motion";

import {
    GitMerge,
    Layers,
    LayoutDashboard,
    Settings2,
    ArrowRight,
    CreditCard,
    CheckCircle2,
    Users,
    Send,
    QrCode,
    PartyPopper,
    RefreshCcw,
    HeartHandshake,
    Scale,
    MapPin,
    Timer,
    DollarSign
} from "lucide-react";

export function E2EFlowBento() {

    return (
        <section className="py-24 px-6 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="flex flex-col mb-16 items-center text-center max-w-3xl mx-auto">
                    <motion.span
                        className="text-blue-600 font-bold tracking-wider text-xs uppercase mb-3"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Total Management
                    </motion.span>
                    <motion.h2
                        className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight break-keep"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        신청부터 매칭까지,<br /> 완벽하게 연결된 E2E 솔루션
                    </motion.h2>
                    <motion.p
                        className="text-gray-600 text-lg md:text-xl break-keep leading-relaxed"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        파편화된 툴을 쓰지 마세요. 파티, 로테이션, 1:1 매칭의 모든 데이터를 하나의 흐름으로 통합 관리합니다.
                    </motion.p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(320px,auto)]">

                    {/* Card 1: Unified Pipeline (Hero) */}
                    <motion.div
                        className="md:col-span-4 bg-gray-50 rounded-[2.5rem] p-8 md:p-12 border border-gray-200 relative overflow-hidden group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">신청부터 결과까지, 하나로 연결된 흐름</h3>
                            <p className="text-gray-600 text-lg max-w-2xl break-keep">
                                신청서가 접수되면 입금 확인, 문자 발송, 현장 체크인까지 시스템이 알아서 척척 진행합니다.
                            </p>
                        </div>

                        {/* Visual: Pipeline Animation */}
                        <div className="mt-12 w-full overflow-x-auto scrollbar-hide pb-4">
                            <div className="relative min-w-[700px] md:min-w-full flex justify-between px-2 items-start h-32">

                                {/* The Pipe Line (Positioned relative to icons) */}
                                <div className="absolute top-5 md:top-7 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full overflow-hidden mx-8 md:mx-12">
                                    <motion.div
                                        className="w-1/3 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"
                                        animate={{ x: ["-100%", "400%"] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    />
                                </div>

                                {/* Nodes */}
                                {[
                                    { label: "신청서 접수", icon: Layers },
                                    { label: "입금 자동확인", icon: CreditCard },
                                    { label: "관리자 승인", icon: CheckCircle2 },
                                    { label: "초대장 발송", icon: Send },
                                    { label: "현장 QR 입장", icon: QrCode },
                                    { label: "최종 결과/매칭", icon: GitMerge }
                                ].map((node, i) => (
                                    <div key={i} className="relative z-10 flex flex-col items-center gap-3 min-w-[80px]">
                                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm z-10 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors duration-500">
                                            <node.icon className="w-4 h-4 md:w-6 md:h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 break-keep text-center">{node.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>


                    {/* Card 2: Multi-Model Logic (Medium - Vertical - col-span-2) */}
                    <motion.div
                        className="md:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-200 relative overflow-hidden group hover:shadow-xl transition-all duration-500"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                                <GitMerge className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">복잡한 운영 모델도 즉시 대응</h3>
                            <p className="text-gray-600 leading-relaxed break-keep">
                                프라이빗 파티, 로테이션 소개팅, 1:1 프리미엄 매칭. 어떤 비즈니스 로직이든 스위치 하나로 전환하듯 유연하게 지원합니다.
                            </p>

                            {/* Visual: Switcher UI */}
                            {/* Visual: Static List UI */}
                            <div className="mt-8 flex flex-col gap-3">
                                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-500 shadow-sm border border-gray-100">
                                        <PartyPopper className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900">프라이빗 파티</span>
                                        <span className="text-xs text-gray-500">QR 입장, 입금 자동화</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-500 shadow-sm border border-gray-100">
                                        <RefreshCcw className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900">로테이션 소개팅</span>
                                        <span className="text-xs text-gray-500">실시간 타이머, 매칭 투표</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-500 shadow-sm border border-gray-100">
                                        <HeartHandshake className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900">1:1 프리미엄 매칭</span>
                                        <span className="text-xs text-gray-500">프로필 관리, 회원 풀(Pool)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>


                    {/* Card 3: Centralized Admin (Medium - col-span-1) */}
                    <motion.div
                        className="md:col-span-1 bg-white rounded-[2.5rem] p-8 border border-gray-200 relative overflow-hidden group hover:shadow-xl transition-all duration-500"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">어드민 대시보드</h3>
                                <p className="text-sm text-gray-600 break-keep">
                                    현장 상황부터 통계까지,<br />모든 데이터를 한눈에.
                                </p>
                            </div>
                            {/* Visual: Stats Summary Widget */}
                            <div className="mt-auto pt-6 flex flex-col gap-3">
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Users className="w-4 h-4" />
                                        <span className="text-sm font-medium">실시간 참가자</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900 font-mono">42명 <span className="text-gray-400 text-sm font-normal">/ 50명</span></span>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <DollarSign className="w-4 h-4" />
                                        <span className="text-sm font-medium">예상 매출액</span>
                                    </div>
                                    <span className="text-lg font-bold text-indigo-600 font-mono">₩ 1,250,000</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 4: Custom Logic (Small - col-span-1) */}
                    <motion.div
                        className="md:col-span-1 bg-white rounded-[2.5rem] p-8 border border-gray-200 relative overflow-hidden group hover:shadow-xl transition-all duration-500"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-slate-600">
                                <Settings2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">자유로운 로직</h3>
                                <p className="text-sm text-gray-600 break-keep">
                                    질문, 매칭, 규칙을<br />내 입맛대로 커스텀.
                                </p>
                            </div>
                            {/* Visual: Active Rule Stack */}
                            <div className="mt-auto pt-6 flex flex-col gap-2">
                                <div className="flex items-center gap-3 px-3 py-2 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
                                    <Scale className="w-4 h-4 text-indigo-600" />
                                    <span className="text-xs font-medium text-gray-700">성비 5:5 자동 맞춤</span>
                                </div>
                                <div className="flex items-center gap-3 px-3 py-2 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
                                    <MapPin className="w-4 h-4 text-indigo-600" />
                                    <span className="text-xs font-medium text-gray-700">거주지 우선 매칭</span>
                                </div>
                                <div className="flex items-center gap-3 px-3 py-2 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
                                    <Timer className="w-4 h-4 text-indigo-600" />
                                    <span className="text-xs font-medium text-gray-700">로테이션 15분 간격</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
