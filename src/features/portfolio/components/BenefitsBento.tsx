"use client";

import { motion } from "framer-motion";
import {
    CheckCircle,
    Clock,
    FileCheck,
    Settings,
    ArrowRight,
    MousePointerClick,
    XCircle,
    Check
} from "lucide-react";

export function BenefitsBento() {
    return (
        <section className="py-24 px-6 bg-[#F9FAFB]">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="flex flex-col mb-16 items-center text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            더 중요한 일에 집중하세요
                        </h2>
                        <p className="text-gray-600 text-lg md:text-xl break-keep leading-relaxed font-medium">
                            복잡한 엑셀, 반복되는 연락, 누락된 명단...<br />
                            이제 시스템에 맡기세요.
                        </p>
                    </motion.div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">

                    {/* Card 1: Automation (Large - col-span-2) */}
                    <motion.div
                        className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="mb-6">
                                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                                    <MousePointerClick className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">수기 작업 0%</h3>
                                <p className="text-gray-600 leading-relaxed max-w-md break-keep">
                                    신청서 확인부터 입금 대조, 안내 문자 발송까지. 사람이 개입할 틈 없이 모든 과정이 물 흐르듯 자동화됩니다.
                                </p>
                            </div>

                            {/* Visual: Abstract Workflow */}
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-3 w-full md:w-fit">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                        <span className="text-[10px] font-bold text-gray-400">Input</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300" />
                                    <div className="w-8 h-8 rounded-lg bg-blue-500 border border-blue-600 flex items-center justify-center shadow-md animate-pulse">
                                        <Settings className="w-4 h-4 text-white animate-spin [animation-duration:3s]" />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300" />
                                    <div className="w-8 h-8 rounded-lg bg-green-500 border border-green-600 flex items-center justify-center shadow-md">
                                        <Check className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-green-600 ml-2">Complete</span>
                            </div>
                        </div>
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50/50 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
                    </motion.div>

                    {/* Card 2: Accuracy (Medium - col-span-1) */}
                    <motion.div
                        className="md:col-span-1 bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-6 text-red-500">
                                <FileCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">휴먼 에러 원천 차단</h3>
                            <p className="text-gray-600 leading-relaxed mb-8 break-keep text-sm">
                                엑셀 복사/붙여넣기 실수는 이제 없습니다. 데이터 무결성은 시스템이 책임집니다.
                            </p>

                            {/* Visual: Comparison */}
                            <div className="mt-auto space-y-2">
                                <div className="flex items-center justify-between p-2 rounded-lg bg-red-50/50 border border-red-100 opacity-60">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="w-4 h-4 text-red-400" />
                                        <div className="w-20 h-2 bg-red-200 rounded-full" />
                                    </div>
                                    <span className="text-[10px] text-red-400 font-bold">Error</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 border border-blue-100 shadow-sm transform scale-105">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-blue-500" />
                                        <div className="w-20 h-2 bg-blue-200 rounded-full" />
                                    </div>
                                    <span className="text-[10px] text-blue-500 font-bold">Perfect</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 3: Speed (Small - col-span-1) */}
                    <motion.div
                        className="md:col-span-1 bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-500">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">3시간 → 3초</h3>
                            <p className="text-gray-600 leading-relaxed break-keep text-sm">
                                행사 마감 후 정산까지 걸리는 시간. 커피 한 잔 내리기 전에 끝납니다.
                            </p>
                            <div className="mt-auto pt-8 flex items-end gap-1">
                                <span className="text-4xl font-black text-amber-500 tracking-tighter">0.5</span>
                                <span className="text-lg font-bold text-gray-400 mb-1">sec</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 4: Custom Fit (Medium - col-span-2) */}
                    <motion.div
                        className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 h-full">
                            <div className="flex-1 text-left">
                                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                                    <Settings className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">내 비즈니스 맞춤 로직</h3>
                                <p className="text-gray-600 leading-relaxed break-keep">
                                    시중의 뻔한 툴로 억지로 맞추지 마세요.<br />
                                    당신의 워크플로우 그대로, 딱 맞는 옷처럼 설계해 드립니다.
                                </p>
                            </div>

                            {/* Visual: Toggle UI */}
                            <div className="w-full md:w-2/5 bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-500">Auto-Approval</span>
                                    <div className="w-10 h-6 bg-purple-500 rounded-full p-1 relative shadow-inner">
                                        <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-500">Waitlist Mode</span>
                                    <div className="w-10 h-6 bg-gray-200 rounded-full p-1 relative shadow-inner">
                                        <div className="w-4 h-4 bg-white rounded-full absolute left-1 shadow-sm" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-500">SMS Notification</span>
                                    <div className="w-10 h-6 bg-purple-500 rounded-full p-1 relative shadow-inner">
                                        <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative Background */}
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50/50 rounded-full blur-[80px] -ml-16 -mb-16 pointer-events-none" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
