"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, CheckCircle2 } from "lucide-react";

export function ProblemSolution() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Problem Side (Before) */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-red-50/50 rounded-3xl p-8 md:p-12 border border-red-100"
                    >
                        <div className="flex items-center gap-3 mb-6">

                            <h3 className="text-xl font-bold text-gray-900">Before: "왜 저기만 줄을 서지?" 비효율적인 대기 시간</h3>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100/50">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-500">
                                                P{i}
                                            </div>
                                        ))}
                                    </div>
                                    <ArrowRight className="text-gray-300 w-4 h-4" />
                                    <div className="px-3 py-1 bg-gray-100 rounded text-sm font-bold text-gray-500">검사 A</div>
                                    <span className="text-red-500 text-xs font-bold animate-pulse">병목 발생</span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    "A검사 끝나면 무조건 B로 가세요." <br/>
                                    융통성 없는 순서 때문에 어떤 방은 텅 비어있고, 
                                    어떤 방은 줄이 길게 늘어섰습니다.
                                </p>
                            </div>
                            
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-gray-700 text-sm">
                                    <Clock className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <span>검사실 간 유휴 시간(Downtime) 증가</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-700 text-sm">
                                    <Users className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <span>보조원들이 빈 검사실과 대기자를 수동으로 매칭하느라 혼선</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Solution Side (After) */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-blue-50/50 rounded-3xl p-8 md:p-12 border border-blue-100 relative overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                        <div className="flex items-center gap-3 mb-6 relative z-10">

                            <h3 className="text-xl font-bold text-gray-900">After: 빈 방으로 바로 안내하는 '스마트 네비게이션'</h3>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100/50 ring-1 ring-blue-100">
                                <div className="flex flex-col gap-3 mb-3">
                                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                                        <span className="text-xs font-bold text-gray-500">대기자 Pool</span>
                                        <ArrowRight className="text-blue-400 w-4 h-4 rotate-90 md:rotate-0" />
                                        <div className="flex gap-2">
                                            <div className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">검사 B (빈곳)</div>
                                            <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">검사 C (빈곳)</div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    "지금 가장 빨리 끝나는 검사는 C입니다." <br/>
                                    시스템이 실시간 상황을 판단해 최적의 경로를 안내합니다. 
                                    덕분에 대기 시간은 줄고 검사 속도는 빨라졌습니다.
                                </p>
                            </div>

                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-gray-700 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                    <span>검사실 가동률(Utilization) 극대화</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-700 text-sm">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                    <span>시스템이 다음 순서를 자동 판단하여 인적 오류 제거</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
