"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { LogicFlowAnimation } from "./LogicFlowAnimation";
import { useTranslations } from "next-intl";

export function LogicPipeline() {
    const t = useTranslations("CohortDashboard");
    const [step, setStep] = useState(1);
    const [scenarioIdx, setScenarioIdx] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // 시나리오 데이터 (ExamFlowAnimation과 동기화)
    const SCENARIOS = [
        {
            room: t('Bottleneck.exams.body'),
            winner: "한상철",
            candidates: [
                { id: 1, name: "최민호", status: "Active", prereq: true, time: "09:00", reason: t('Logic.status.active') },
                { id: 2, name: "박정희", status: "Active", prereq: true, time: "08:15", reason: t('Logic.status.active') },
                { id: 3, name: "정영희", status: "Waiting", prereq: true, time: "09:10", reason: t('Logic.status.waiting') },
                { id: 4, name: "한상철", status: "Waiting", prereq: true, time: "09:05", reason: t('Logic.status.selected') },
            ]
        },
        {
            room: t('Bottleneck.exams.ecg'),
            winner: "최민호",
            candidates: [
                { id: 1, name: "정영희", status: "Active", prereq: true, time: "09:10", reason: t('Logic.status.active') },
                { id: 2, name: "김순자", status: "Active", prereq: true, time: "08:45", reason: t('Logic.status.active') },
                { id: 3, name: "이영수", status: "Waiting", prereq: false, time: "09:20", reason: t('Logic.status.prereq') },
                { id: 4, name: "최민호", status: "Waiting", prereq: true, time: "09:15", reason: t('Logic.status.selected') },
            ]
        },
        {
            room: t('Bottleneck.exams.dementia'), // SNSB-C mapped to Dementia for simplicity or keep raw if specific
            winner: "정영희",
            candidates: [
                { id: 1, name: "박정희", status: "Active", prereq: true, time: "08:15", reason: t('Logic.status.active') },
                { id: 2, name: "최민호", status: "Active", prereq: true, time: "09:00", reason: t('Logic.status.active') },
                { id: 3, name: "이영수", status: "Waiting", prereq: false, time: "09:20", reason: t('Logic.status.prereq') },
                { id: 4, name: "정영희", status: "Waiting", prereq: true, time: "09:10", reason: t('Logic.status.selected') },
            ]
        },
        {
            room: t('Bottleneck.exams.blood'),
            winner: "김순자",
            candidates: [
                { id: 1, name: "한상철", status: "Active", prereq: true, time: "09:05", reason: t('Logic.status.active') },
                { id: 2, name: "정영희", status: "Active", prereq: true, time: "09:10", reason: t('Logic.status.active') },
                { id: 3, name: "최민호", status: "Waiting", prereq: false, time: "09:00", reason: t('Logic.status.prereq') },
                { id: 4, name: "김순자", status: "Waiting", prereq: true, time: "08:45", reason: t('Logic.status.selected') },
            ]
        }
    ];

    // Simulation Loop
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setStep(prev => {
                if (prev === 4) {
                    setScenarioIdx(s => (s + 1) % SCENARIOS.length);
                    return 1;
                }
                return prev + 1;
            });
        }, 4000); 
        return () => clearInterval(timer);
    }, [isPaused, SCENARIOS.length]);


    const steps = [
        { title: t('Logic.steps.1.title'), desc: t('Logic.steps.1.desc') },
        { title: t('Logic.steps.2.title'), desc: t('Logic.steps.2.desc') },
        { title: t('Logic.steps.3.title'), desc: t('Logic.steps.3.desc') },
        { title: t('Logic.steps.4.title'), desc: t('Logic.steps.4.desc') }
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Left: Logic Steps */}
                <div>
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6"
                            dangerouslySetInnerHTML={{ __html: t.raw('Logic.title') }}
                        />
                        <p className="text-gray-600 leading-relaxed"
                           dangerouslySetInnerHTML={{ __html: t.raw('Logic.description') }}
                        />
                    </div>
                    
                    <div className="space-y-4">
                        {steps.map((item, i) => (
                            <button 
                                key={i}
                                onClick={() => {
                                    setStep(i + 1);
                                    setIsPaused(true);
                                }}
                                className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 relative group
                                    ${step === i + 1 
                                        ? "bg-blue-50 border-blue-500 shadow-md transform scale-[1.02]" 
                                        : "bg-white border-gray-100 hover:border-blue-200"}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                                        ${step === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-base mb-1 ${step === i + 1 ? "text-blue-900" : "text-gray-900"}`}>
                                            {item.title.split('. ')[1] || item.title}
                                        </h3>
                                        <p className={`text-sm leading-relaxed ${step === i + 1 ? "text-blue-700/70" : "text-gray-500"}`}>
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                                {step === i + 1 && (
                                    <motion.div 
                                        layoutId="active-indicator"
                                        className="absolute right-6 top-1/2 -translate-y-1/2"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                                    </motion.div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Decision Engine Dashboard (Extracted) */}
                <LogicFlowAnimation 
                    step={step} 
                    isPaused={isPaused} 
                    onResume={() => setIsPaused(false)} 
                    candidates={SCENARIOS[scenarioIdx].candidates}
                    room={SCENARIOS[scenarioIdx].room}
                />
            </div>
        </section>
    );
}
