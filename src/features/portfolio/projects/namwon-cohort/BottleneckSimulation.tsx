"use client";

import { AlertTriangle, CheckCircle2, Users, Zap, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function BottleneckSimulation() {
    const t = useTranslations("CohortDashboard.Bottleneck");

    return (
        <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        {t('title')}
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto"
                       dangerouslySetInnerHTML={{ __html: t.raw('description') }}
                    />
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    
                    {/* LEFT: Before (Problem) */}
                    <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 flex flex-col">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{t('before.title')}</h3>
                                <p className="text-xs text-red-600">{t('before.subtitle')}</p>
                            </div>
                        </div>

                        {/* Flow Diagram Container */}
                        <div className="bg-white rounded-xl p-4 mb-5 border border-red-100 flex flex-col justify-center min-h-[240px]">
                            
                            {/* MOBILE LAYOUT: 2x2 Grid with Bent Connector */}
                            <div className="md:hidden relative grid grid-cols-2 gap-x-6 gap-y-10 px-2 py-6">
                                {/* SVG Connector Layer for 2->3 Step */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100">
                                     <defs>
                                        <marker id="arrowhead-mobile" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                            <polyline points="1 1 5 3 1 5" fill="none" stroke="#D1D5DB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </marker>
                                    </defs>
                                    {/* Path: Bottom of Box 2 (75, 40) -> Down -> Left -> Top of Box 3 (25, 60) */}
                                    <path d="M 75 40 V 50 H 25 V 60" stroke="#D1D5DB" strokeWidth="1" fill="none" markerEnd="url(#arrowhead-mobile)" vectorEffect="non-scaling-stroke" />
                                </svg>

                                {/* 1. Blood */}
                                <div className="relative z-10">
                                    <ExamBox label={t('exams.blood')} time="10m" />
                                    <ArrowRight className="absolute top-1/2 -right-5 -translate-y-1/2 w-3 h-3 text-gray-300" />
                                </div>
                                
                                {/* 2. Body */}
                                <div className="relative z-10">
                                    <ExamBox label={t('exams.body')} time="20m" />
                                </div>
                                
                                {/* 3. ECG */}
                                <div className="relative z-10">
                                    <ExamBox label={t('exams.ecg')} time="15m" />
                                    <ArrowRight className="absolute top-1/2 -right-5 -translate-y-1/2 w-3 h-3 text-gray-300" />
                                </div>
                                
                                {/* 4. Dementia */}
                                <div className="relative z-10">
                                    <div className="relative">
                                        <ExamBox label={t('exams.dementia')} time="60m" isBottleneck />
                                        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
                                             <div className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm border border-red-200">
                                                ⚠️ Bottleneck
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DESKTOP LAYOUT: Linear (Hidden on Mobile) */}
                            <div className="hidden md:flex items-center justify-center gap-1.5">
                                <ExamBox label={t('exams.blood')} time="10m" />
                                <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />
                                <ExamBox label={t('exams.body')} time="20m" />
                                <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />
                                <ExamBox label={t('exams.ecg')} time="15m" />
                                <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />
                                <div className="relative">
                                    <ExamBox label={t('exams.dementia')} time="60m" isBottleneck />
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                                        <div className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">
                                            ⚠️ Bottleneck
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Problem Description */}
                        <div className="space-y-2 mt-auto min-h-[80px]">
                            <ProblemItem text={t('before.problems.0')} />
                            <ProblemItem text={t('before.problems.1')} />
                            <ProblemItem text={t('before.problems.2')} />
                        </div>
                    </div>

                    {/* RIGHT: After (Solution) - The Height Reference */}
                    <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 flex flex-col">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{t('after.title')}</h3>
                                <p className="text-xs text-emerald-600">{t('after.subtitle')}</p>
                            </div>
                        </div>

                        {/* Hub Flow Diagram - X Shape */}
                        <div className="bg-white rounded-xl p-0 mb-5 border border-emerald-100 relative h-[300px] overflow-hidden">
                            {/* SVG Connecting Lines - Dual Unidirectional Arrows */}
                            {/* SVG Connecting Lines - Short Dual Arrows preventing overlap */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                <defs>
                                    <symbol id="double-arrow" viewBox="0 0 24 24">
                                        <path d="M4 8.5H15V6L20 9L15 12V9.5H4V8.5Z" fill="#34D399" fillOpacity="0.4" />
                                        <path d="M20 15.5H9V18L4 15L9 12V14.5H20V15.5Z" fill="#34D399" fillOpacity="0.4" />
                                    </symbol>
                                </defs>

                                {/* Top Left (TL) Connection */}
                                <svg x="32%" y="30%" width="1" height="1" overflow="visible">
                                    <g transform="rotate(45)">
                                        <use href="#double-arrow" width="40" height="40" x="-20" y="-20" />
                                    </g>
                                </svg>

                                {/* Top Right (TR) Connection */}
                                <svg x="68%" y="30%" width="1" height="1" overflow="visible">
                                    <g transform="rotate(135)">
                                        <use href="#double-arrow" width="40" height="40" x="-20" y="-20" />
                                    </g>
                                </svg>

                                {/* Bottom Left (BL) Connection */}
                                <svg x="32%" y="70%" width="1" height="1" overflow="visible">
                                    <g transform="rotate(-45)">
                                        <use href="#double-arrow" width="40" height="40" x="-20" y="-20" />
                                    </g>
                                </svg>

                                {/* Bottom Right (BR) Connection */}
                                <svg x="68%" y="70%" width="1" height="1" overflow="visible">
                                    <g transform="rotate(-135)">
                                        <use href="#double-arrow" width="40" height="40" x="-20" y="-20" />
                                    </g>
                                </svg>
                            </svg>

                            {/* Center: Hub */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 shadow-xl rounded-2xl">
                                <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl text-sm font-bold flex flex-col items-center gap-1 shadow-lg shadow-emerald-200 border-2 border-white ring-4 ring-emerald-50">
                                    <Users className="w-5 h-5 mb-0.5" />
                                    <span>{t('after.engine')}</span>
                                </div>
                            </div>

                            {/* Top Left: Exam 1 */}
                            <div className="absolute top-6 left-4 z-10 w-[105px]">
                                <ExamBox label={t('exams.blood')} time="10m" isActive />
                            </div>

                            {/* Top Right: Exam 2 */}
                            <div className="absolute top-6 right-4 z-10 w-[105px]">
                                <ExamBox label={t('exams.body')} time="20m" isActive />
                            </div>

                            {/* Bottom Left: Exam 3 */}
                            <div className="absolute bottom-6 left-4 z-10 w-[105px]">
                                <ExamBox label={t('exams.ecg')} time="15m" isActive />
                            </div>

                            {/* Bottom Right: Exam 4 */}
                            <div className="absolute bottom-6 right-4 z-10 w-[105px]">
                                <ExamBox label={t('exams.dementia')} time="60m" isActive />
                            </div>
                        </div>

                        {/* Solution Description */}
                        <div className="space-y-2 mt-auto">
                            <SolutionItem text={t('after.solutions.0')} />
                            <SolutionItem text={t('after.solutions.1')} />
                            <SolutionItem text={t('after.solutions.2')} />
                            <SolutionItem text={t('after.solutions.3')} />
                        </div>
                    </div>

                </div>

                {/* Bottom Summary */}
                <div className="mt-8 bg-slate-50 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-center gap-4 md:gap-8 text-sm shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-gray-700 font-medium"
                              dangerouslySetInnerHTML={{ __html: t.raw('results.time') }}
                        />
                    </div>
                    <div className="hidden md:block w-px h-4 bg-slate-300" />
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-gray-700 font-medium"
                              dangerouslySetInnerHTML={{ __html: t.raw('results.satisfaction') }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Sub Components ---

function ExamBox({ label, time, isBottleneck, isActive }: { 
    label: string; 
    time: string; 
    isBottleneck?: boolean;
    isActive?: boolean;
}) {
    let bgColor = "bg-white border-gray-200";
    let textColor = "text-gray-700";

    if (isBottleneck) {
        bgColor = "bg-red-50 border-red-300";
        textColor = "text-red-700";
    } else if (isActive) {
        bgColor = "bg-emerald-50 border-emerald-300";
        textColor = "text-emerald-700";
    }

    // Fixed width for uniformity
    return (
        <div className={`w-full min-w-[70px] px-2 py-3 rounded-lg border flex flex-col items-center justify-center ${bgColor} shadow-sm`}>
            <span className={`font-bold text-[11px] mb-0.5 ${textColor} whitespace-nowrap`}>{label}</span>
            <span className="text-[9px] text-gray-400 font-medium">{time}</span>
        </div>
    );
}

function ProblemItem({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
            <span className="text-xs text-gray-600 leading-tight">{text}</span>
        </div>
    );
}

function SolutionItem({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
            <span className="text-xs text-gray-600 leading-tight">{text}</span>
        </div>
    );
}
