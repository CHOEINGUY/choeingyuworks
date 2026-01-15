"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  FileSpreadsheet,
  Server,
  Zap,
  Monitor,
  Database,
} from "lucide-react";

import { useTranslations } from "next-intl";

export function TechStackFlow() {
  const t = useTranslations("CohortDashboard.TechStack");
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const PIPELINE_STEPS = [
    {
      id: "appsheet",
      label: t("steps.appsheet.label"),
      icon: Smartphone,
      title: t("steps.appsheet.title"),
      desc: t("steps.appsheet.desc"),
    },
    {
      id: "sheets",
      label: t("steps.sheets.label"),
      icon: FileSpreadsheet,
      title: t("steps.sheets.title"),
      desc: t("steps.sheets.desc"),
    },
    {
      id: "appsscript",
      label: t("steps.appsscript.label"),
      icon: Server,
      title: t("steps.appsscript.title"),
      desc: t("steps.appsscript.desc"),
    },
    {
      id: "firebase",
      label: t("steps.firebase.label"),
      icon: Database,
      title: t("steps.firebase.title"),
      desc: t("steps.firebase.desc"),
    },
    {
      id: "dashboard",
      label: t("steps.dashboard.label"),
      icon: Monitor,
      title: t("steps.dashboard.title"),
      desc: t("steps.dashboard.desc"),
    },
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
    <section className="py-12 md:py-24 px-6 bg-gray-50 border-y border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col mb-8 md:mb-16 items-center text-center max-w-3xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight break-keep"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {t("title")}
          </motion.h2>
          <motion.p
            className="text-gray-600 text-lg break-keep leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            dangerouslySetInnerHTML={{ __html: t.raw("description") }}
          />
        </div>

        {/* Interactive Pipeline Container */}
        <div className="flex flex-col gap-8 md:gap-16">
          {/* Top: Progress Bar & Icons */}
          <div className="px-0 relative w-full">
            {/* Container with extra padding to prevent clipping of scaled active items and text labels */}
            {/* MOBILE LAYOUT: Single Focused Step (Carousel) */}
            <div className="md:hidden w-full flex flex-col items-center gap-4 mb-4 min-h-[160px] justify-center">
              {/* Active Icon Body */}
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  key={activeStep}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-200 z-10"
                >
                  {/* Render Active Icon */}
                  {(() => {
                    const ActiveIcon = PIPELINE_STEPS[activeStep].icon;
                    return (
                      <ActiveIcon
                        className="w-9 h-9 text-white"
                        strokeWidth={2}
                      />
                    );
                  })()}
                </motion.div>
                <span className="text-sm font-bold text-blue-700">
                  {PIPELINE_STEPS[activeStep].label}
                </span>
              </div>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {PIPELINE_STEPS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStepClick(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 
                                            ${
                                              idx === activeStep
                                                ? "bg-blue-600 w-6"
                                                : "bg-gray-300"
                                            }`}
                  />
                ))}
              </div>
            </div>

            {/* DESKTOP LAYOUT: Horizontal Linear Flow (Hidden on Mobile) */}
            <div className="hidden md:flex flex-row items-center justify-between w-full pt-12 pb-20 relative gap-0">
              {PIPELINE_STEPS.map((step, index) => {
                const isActive = index === activeStep;
                const isCompleted = index < activeStep;
                const Icon = step.icon;
                const isLast = index === PIPELINE_STEPS.length - 1;

                return (
                  <div key={step.id} className="contents">
                    {/* Step Node */}
                    <div
                      className="flex flex-col items-center gap-6 cursor-pointer group relative z-10 p-0"
                      onClick={() => handleStepClick(index)}
                    >
                      <motion.div
                        className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ease-out z-20 shrink-0
                                                    ${
                                                      isActive
                                                        ? "bg-blue-600 shadow-xl shadow-blue-200 scale-110"
                                                        : isCompleted
                                                        ? "bg-white border-2 border-blue-600"
                                                        : "bg-white border-2 border-gray-200 group-hover:border-gray-400"
                                                    }`}
                      >
                        <Icon
                          className={`w-7 h-7 transition-colors duration-500
                                                        ${
                                                          isActive
                                                            ? "text-white"
                                                            : isCompleted
                                                            ? "text-blue-600"
                                                            : "text-gray-400"
                                                        }`}
                          strokeWidth={2}
                        />
                      </motion.div>

                      <span
                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-5 w-48 text-center text-sm font-bold transition-colors duration-500
                                                ${
                                                  isActive
                                                    ? "text-blue-700"
                                                    : "text-gray-500"
                                                }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {/* Connecting Line */}
                    {!isLast && (
                      <div className="flex-1 h-[2px] bg-gray-200 mx-4 relative overflow-hidden shrink-0 min-w-[40px] rounded-full">
                        <motion.div
                          className="absolute inset-0 bg-blue-500"
                          initial={{ width: "0%" }}
                          animate={{
                            width: index < activeStep ? "100%" : "0%",
                          }}
                          transition={{ duration: 0.4 }}
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
