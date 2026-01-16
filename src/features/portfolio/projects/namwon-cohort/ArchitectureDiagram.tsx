"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Smartphone,
    FileSpreadsheet,
    Server,
    Zap,
    Monitor
} from "lucide-react";

const PIPELINE_STEPS = [
    {
        id: "appsheet",
        label: "현장 입력 (Tablet)",
        icon: Smartphone,
        title: "태블릿 접수 시스템",
        desc: "복잡한 서류 대신 태블릿으로 터치 몇 번이면 접수 끝. 어르신들도, 연구원들도 편하게 사용할 수 있습니다."
    },
    {
        id: "sheets",
        label: "Google Sheets (DB)",
        icon: FileSpreadsheet,
        title: "우리에게 익숙한 엑셀(Google Sheets)",
        desc: "굳이 어렵고 비싼 DB를 쓰지 않았습니다. 연구원들이 가장 익숙하게 다루는 엑셀을 그대로 활용해 교육 비용을 0으로 만들었습니다."
    },
    {
        id: "appsscript",
        label: "Apps Script (Logic)",
        icon: Server,
        title: "똑똑한 교통정리 (Algorithm)",
        desc: "검사실에서 '검사 완료'를 누르는 즉시, 시스템이 빈 자리를 인식하고 다음 대기자를 호출합니다. 사람이 일일이 소리쳐 찾을 필요가 없어졌습니다."
    },
    {
        id: "sync",
        label: "Real-time Sync",
        icon: Zap,
        title: "초저지연 데이터 동기화",
        desc: "AppSheet에서 입력된 데이터가 Sheets를 거쳐 Apps Script로 계산되고 현황판에 반영되기까지 즉각적으로 처리됩니다. 고가용성 서버 없이도 소규모 검진 현장에 충분한 실시간성을 확보했습니다."
    },
    {
        id: "dashboard",
        label: "Web Dashboard",
        icon: Monitor,
        title: "목소리로 알려주는 안내원",
        desc: "\"김철수님, 김철수님 다음 검사는 심전도입니다.\" 라는 음성 안내가 나오면, 보조원들이 해당 참여자를 인지하고 즉시 다음 검사실로 안내합니다."
    }
];

export function ArchitectureDiagram() {
    const [activeStep, setActiveStep] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % PIPELINE_STEPS.length);
        }, 3500); // 3.5초 간격으로 조금 여유있게

        return () => clearInterval(timer);
    }, [isPaused]);

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
                        데이터 흐름과 시스템 구조
                    </motion.h2>
                    <motion.p
                        className="text-gray-600 text-lg break-keep leading-relaxed"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        현장에 익숙한 도구(Google Sheets)를 DB로 사용하면서도,<br className="hidden md:block"/>
                        실시간성(Real-time)을 확보하기 위해 Apps Script를 미들웨어로 활용한 하이브리드 아키텍처입니다.
                    </motion.p>
                </div>

                {/* Interactive Pipeline Container */}
                <div className="flex flex-col gap-16">
                    
                    {/* Top: Progress Bar & Icons */}
                    <div className="px-0 relative w-full">
                        {/* Container with extra padding to prevent clipping of scaled active items */}
                        <div className="flex items-center w-full min-w-[300px] md:min-w-full overflow-x-auto gap-0 pl-1 pr-1 py-12 md:pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x cursor-grab active:cursor-grabbing">
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
                                                    ${isActive ? "bg-blue-600 shadow-xl shadow-blue-200 scale-110 rotate-3" : 
                                                      isCompleted ? "bg-white border-2 border-blue-600" : "bg-white border-2 border-gray-200 group-hover:border-gray-400"}`}
                                            >
                                                <Icon 
                                                    className={`w-6 h-6 md:w-7 md:h-7 transition-colors duration-500
                                                        ${isActive ? "text-white" : isCompleted ? "text-blue-600" : "text-gray-400"}`} 
                                                    strokeWidth={2}
                                                />
                                            </motion.div>
                                            
                                            <span className={`absolute top-full mt-5 w-32 text-xs md:text-sm font-bold break-keep text-center transition-colors duration-500 ${isActive ? "text-blue-700" : "text-gray-500"}`}>
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
                                className="absolute inset-0 flex flex-col items-center text-center justify-start pt-4 px-4 bg-white rounded-3xl border border-gray-100 shadow-lg p-8"
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
