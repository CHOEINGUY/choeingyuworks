"use client";

import { motion } from "framer-motion";
import {
    LayoutTemplate,
    ShieldCheck,
    RefreshCw,
    Database,
    ArrowRight,
    ArrowDown
} from "lucide-react";

const PIPELINE_STEPS = [
    {
        id: "app",
        icon: LayoutTemplate,
        label: "Fast Entry",
        sub: "React Engine",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100"
    },
    {
        id: "auth",
        icon: ShieldCheck,
        label: "Security",
        sub: "Intl. Standard Auth",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-100"
    },
    {
        id: "audit",
        icon: RefreshCw,
        label: "Verification",
        sub: "Real-time Banking API",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100"
    },
    {
        id: "archive",
        icon: Database,
        label: "Safety",
        sub: "Zero-Loss Storage",
        color: "text-slate-600",
        bg: "bg-slate-50",
        border: "border-slate-100"
    }
];

export function SystemArchitecture() {
    return (
        <section className="py-24 px-6 border-y border-gray-100 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] opacity-40 -mr-48 -mt-48 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                    {/* Left Column: Context (35%) */}
                    <div className="lg:col-span-4 flex flex-col text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-3xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                                완벽하게 연결된<br />
                                <span className="text-blue-600">워크플로우</span>
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed break-keep">
                                불안한 수기 작업 없이, 신청부터 정산까지 데이터가 끊김 없이 흐릅니다.
                                강력한 보안 인프라 위에서 비즈니스는 안전하게 보호됩니다.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Column: Pipeline Diagram (65%) */}
                    <div className="lg:col-span-8 w-full">
                        <motion.div
                            className="bg-white/50 backdrop-blur-sm rounded-[2rem] border border-gray-100 p-8 md:p-12 shadow-sm relative"
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Diagram Container */}
                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">

                                {/* Connecting Line (Desktop) */}
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 hidden md:block z-0 mx-12 border-t-2 border-dashed border-gray-200" />

                                {PIPELINE_STEPS.map((step, idx) => (
                                    <div key={step.id} className="relative z-10 flex flex-col items-center group w-full md:w-auto">

                                        {/* Connector Line (Mobile) */}
                                        {idx !== PIPELINE_STEPS.length - 1 && (
                                            <div className="absolute h-12 w-0.5 border-l-2 border-dashed border-gray-200 -bottom-10 left-1/2 -translate-x-1/2 md:hidden" />
                                        )}

                                        {/* Activity Pulse on Line (Desktop) */}
                                        {idx !== 0 && (
                                            <motion.div
                                                className="absolute top-1/2 -left-1/2 w-2 h-2 rounded-full bg-blue-400 hidden md:block z-20"
                                                animate={{
                                                    x: ["0%", "400%"],
                                                    opacity: [0, 1, 0]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    repeatDelay: idx * 0.5,
                                                    ease: "linear"
                                                }}
                                                style={{ left: '-50%' }} // Starting position related to the gap
                                            />
                                        )}

                                        {/* Node Circle */}
                                        <div className={`w-20 h-20 rounded-2xl ${step.bg} ${step.border} border flex items-center justify-center shadow-sm mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md relative bg-white`}>
                                            <step.icon className={`w-8 h-8 ${step.color}`} strokeWidth={1.5} />
                                            {/* Pulse Ring */}
                                            <div className="absolute inset-0 rounded-2xl bg-current opacity-0 group-hover:animate-ping text-gray-400/20" />
                                        </div>

                                        {/* Text Info */}
                                        <div className="text-center bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-transparent group-hover:border-gray-100 transition-all">
                                            <h4 className="text-sm font-bold text-gray-900 mb-0.5">{step.label}</h4>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{step.sub}</span>
                                        </div>

                                        {/* Arrow for Desktop Flow (Optional visual cue) */}
                                        {idx !== PIPELINE_STEPS.length - 1 && (
                                            <div className="hidden md:block absolute top-1/2 -right-6 -translate-y-1/2 z-0 text-gray-300">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        )}
                                        {/* Arrow for Mobile Flow */}
                                        {idx !== PIPELINE_STEPS.length - 1 && (
                                            <div className="md:hidden absolute -bottom-8 left-1/2 -translate-x-1/2 z-20 text-gray-300 bg-white p-1 rounded-full">
                                                <ArrowDown className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Verification Badge */}
                            <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center md:justify-end items-center gap-2">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">System Operational</span>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
