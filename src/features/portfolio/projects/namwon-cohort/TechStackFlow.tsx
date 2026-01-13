"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Smartphone,
    FileSpreadsheet,
    Server,
    Zap,
    Monitor,
    Database
} from "lucide-react";


import { useTranslations } from "next-intl";

export function TechStackFlow() {
    const t = useTranslations("CohortDashboard.TechStack");
    const [activeStep, setActiveStep] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const PIPELINE_STEPS = [
        {
            id: "appsheet",
            label: t('steps.appsheet.label'),
            icon: Smartphone,
            title: t('steps.appsheet.title'),
            desc: t('steps.appsheet.desc')
        },
        {
            id: "sheets",
            label: t('steps.sheets.label'),
            icon: FileSpreadsheet,
            title: t('steps.sheets.title'),
            desc: t('steps.sheets.desc')
        },
        {
            id: "appsscript",
            label: t('steps.appsscript.label'),
            icon: Server,
            title: t('steps.appsscript.title'),
            desc: t('steps.appsscript.desc')
        },
        {
            id: "firebase",
            label: t('steps.firebase.label'),
            icon: Database,
            title: t('steps.firebase.title'),
            desc: t('steps.firebase.desc')
        },
        {
            id: "dashboard",
            label: t('steps.dashboard.label'),
            icon: Monitor,
            title: t('steps.dashboard.title'),
            desc: t('steps.dashboard.desc')
        }
    ];

    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % PIPELINE_STEPS.length);
        }, 3500); // 3.5초 간격으로 조금 여유있게

        return () => clearInterval(timer);
    }, [isPaused, PIPELINE_STEPS.length]);

    const handleStepClick = (index: number) => {
        setActiveStep(index);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 10000); // 클릭 시 10초간 일시정지 (텍스트 읽을 시간 확보)
    };

    return (
        <section className="py-24 px-6 bg-gray-50 border-y border-gray-100">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col mb-16 items-center text-center max-w-3xl mx-auto">
                    <motion.h2
                        className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight break-keep"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {t('title')}
                    </motion.h2>
                    <motion.p
                        className="text-gray-600 text-lg break-keep leading-relaxed"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        dangerouslySetInnerHTML={{ __html: t.raw('description') }}
                    />
                </div>

                {/* Interactive Pipeline Container */}
                <div className="flex flex-col gap-16">
                    
                    {/* Top: Progress Bar & Icons */}
                    <div className="px-0 relative w-full">
                        {/* Container with extra padding to prevent clipping of scaled active items and text labels */}
                        <div className="flex items-center w-full min-w-[300px] md:min-w-full overflow-x-auto gap-0 pl-1 pr-1 pt-12 pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x cursor-grab active:cursor-grabbing">
                            {PIPELINE_STEPS.map((step, index) => {
                                const isActive = index === activeStep;
                                const isCompleted = index < activeStep;
                                const Icon = step.icon;
                                const isLast = index === PIPELINE_STEPS.length - 1;

                                return (
                                    <div key={step.id} className="contents">
                                        {/* Step Node */}
                                        <div 
                                            className="flex flex-col items-center gap-6 cursor-pointer group relative z-10 shrink-0"
                                            onClick={() => handleStepClick(index)}
                                            style={{ width: '100px' }} // 아이콘 간격 조금 더 확보
                                        >
                                            <motion.div 
                                                className={`relative w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ease-out z-20
                                                    ${isActive ? "bg-blue-600 shadow-xl shadow-blue-200 scale-110" : 
                                                      isCompleted ? "bg-white border-2 border-blue-600" : "bg-white border-2 border-gray-200 group-hover:border-gray-400"}`}
                                            >
                                                <Icon 
                                                    className={`w-6 h-6 md:w-7 md:h-7 transition-colors duration-500
                                                        ${isActive ? "text-white" : isCompleted ? "text-blue-600" : "text-gray-400"}`} 
                                                    strokeWidth={2}
                                                />
                                            </motion.div>
                                            
                                            <span className={`absolute top-full left-1/2 -translate-x-1/2 mt-5 w-48 text-xs md:text-sm font-bold break-keep text-center transition-colors duration-500 ${isActive ? "text-blue-700" : "text-gray-500"}`}>
                                                {step.label}
                                            </span>
                                        </div>

                                        {/* Connecting Line */}
                                        {!isLast && (
                                            <div className="flex-1 h-[2px] bg-gray-200 mx-2 relative overflow-hidden shrink-0 min-w-[40px] rounded-full">
                                                {/* Fill line */}
                                                <motion.div 
                                                    className="absolute inset-y-0 left-0 bg-blue-500"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: index < activeStep ? "100%" : "0%" }}
                                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom: Dynamic Detail Card */}
                    <div className="relative h-[200px] w-full max-w-3xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                className="absolute inset-0 flex flex-col items-center text-center justify-start pt-4 px-4"
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide">
                                    Step {activeStep + 1}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 break-keep tracking-tight">
                                    {PIPELINE_STEPS[activeStep].title}
                                </h3>
                                
                                <p className="text-gray-600 text-base md:text-lg leading-relaxed break-keep max-w-2xl">
                                    {PIPELINE_STEPS[activeStep].desc}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
