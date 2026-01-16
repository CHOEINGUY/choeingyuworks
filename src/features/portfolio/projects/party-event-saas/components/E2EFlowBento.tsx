"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    GitMerge,
    Layers,
    CreditCard,
    CheckCircle2,
    Send,
    QrCode,
} from "lucide-react";
import { useTranslations } from "next-intl";

const STEP_CONFIG = [
    { id: "form", icon: Layers },
    { id: "banking", icon: CreditCard },
    { id: "admin", icon: CheckCircle2 },
    { id: "invite", icon: Send },
    { id: "event", icon: QrCode },
    { id: "result", icon: GitMerge }
];

export function E2EFlowBento() {
    const t = useTranslations("PartySaaS.Pipeline");
    const [activeStep, setActiveStep] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const steps = STEP_CONFIG.map(config => ({
        ...config,
        label: t(`steps.${config.id}.label`),
        title: t(`steps.${config.id}.title`),
        desc: t(`steps.${config.id}.desc`)
    }));

    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [isPaused, steps.length]);

    const handleStepClick = (index: number) => {
        setActiveStep(index);
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), 8000);
    };

    return (
        <section className="py-24 px-6 bg-white border-b border-gray-100">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col mb-16 items-center text-center max-w-3xl mx-auto">
                    <motion.h2
                        className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight break-keep"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        dangerouslySetInnerHTML={{ __html: t.raw('title') }}
                    />
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
                    {/* Top: Progress Bar & Icons */}
                    <div className="px-0 relative w-full">
                        
                        {/* MOBILE LAYOUT: Single Focused Step (Carousel) */}
                        <div className="md:hidden w-full flex flex-col items-center gap-6 mb-8 min-h-[160px] justify-center">
                            {/* Active Icon Body */}
                            <div className="flex flex-col items-center gap-3">
                                <motion.div 
                                    key={activeStep}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="relative w-20 h-20 rounded-full bg-neutral-900 flex items-center justify-center shadow-xl shadow-neutral-200 z-10"
                                >
                                    {/* Render Active Icon */}
                                    {(() => {
                                        const ActiveIcon = steps[activeStep].icon;
                                        return <ActiveIcon className="w-9 h-9 text-white" strokeWidth={2} />;
                                    })()}
                                </motion.div>
                                <span className="text-sm font-bold text-neutral-900">
                                    {steps[activeStep].label}
                                </span>
                            </div>

                            {/* Dots Indicator */}
                            <div className="flex gap-2">
                                {steps.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleStepClick(idx)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 
                                            ${idx === activeStep ? "bg-neutral-900 w-6" : "bg-gray-300"}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* DESKTOP LAYOUT: Horizontal Linear Flow (Hidden on Mobile) */}
                        <div className="hidden md:flex items-center w-full justify-between gap-0 pl-1 pr-1 py-12">
                            {steps.map((step, index) => {
                                const isActive = index === activeStep;
                                const isCompleted = index < activeStep;
                                const Icon = step.icon;
                                const isLast = index === steps.length - 1;

                                return (
                                    <div key={step.id} className="contents">
                                        {/* Step Node */}
                                        <div 
                                            className="flex flex-col items-center gap-6 cursor-pointer group relative z-10 shrink-0"
                                            onClick={() => handleStepClick(index)}
                                            style={{ width: '80px' }}
                                        >
                                            <motion.div 
                                                className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 ease-out z-20
                                                    ${isActive ? "bg-neutral-900 border-[3px] border-white shadow-xl shadow-neutral-400/50 scale-125" : 
                                                      isCompleted ? "bg-white border-2 border-gray-900" : "bg-white border-2 border-gray-300 group-hover:border-gray-400"}`}
                                            >
                                                <Icon 
                                                    className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-500
                                                        ${isActive ? "text-white" : isCompleted ? "text-gray-900" : "text-gray-400"}`} 
                                                    strokeWidth={2}
                                                />
                                            </motion.div>
                                            
                                            <span className={`absolute top-full mt-5 w-32 text-[11px] md:text-sm font-semibold break-keep text-center transition-colors duration-500 ${isActive ? "text-neutral-900" : "text-gray-400"}`}>
                                                {step.label}
                                            </span>
                                        </div>

                                        {/* Connecting Line */}
                                        {!isLast && (
                                            <div className="flex-1 h-[2px] bg-gray-200 mx-2 relative overflow-hidden shrink-0 min-w-[40px] rounded-full">
                                                {/* Fill line */}
                                                <motion.div 
                                                    className="absolute inset-y-0 left-0 bg-black"
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
                    <div className="relative h-[180px] w-full max-w-2xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                className="absolute inset-0 flex flex-col items-center text-center justify-start pt-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 break-keep tracking-tight">
                                    {steps[activeStep].title}
                                </h3>
                                
                                <p className="text-gray-500 text-base md:text-lg leading-relaxed break-keep max-w-xl">
                                    {steps[activeStep].desc}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
