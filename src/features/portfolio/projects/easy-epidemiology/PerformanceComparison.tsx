"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Zap } from "lucide-react";

export function PerformanceComparison() {
    const t = useTranslations("EasyEpidemiology.Performance");

    return (
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
                    {t('title')}
                </h2>

                <div className="space-y-8">
                    
                    {/* Conventional Workflow */}
                    <div>
                        <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                            <span>{t('manualLabel')}</span>
                            <span>~60 min</span>
                        </div>
                        <div className="h-14 bg-gray-100 rounded-xl overflow-hidden flex relative">
                            <div className="bg-gray-300 h-full w-[50%] flex items-center justify-center text-xs font-bold text-gray-600 border-r border-white/20">
                                Data Cleaning
                            </div>
                            <div className="bg-gray-300 h-full w-[30%] flex items-center justify-center text-xs font-bold text-gray-600 border-r border-white/20">
                                Tool Transfer
                            </div>
                            <div className="bg-gray-300 h-full w-[20%] flex items-center justify-center text-xs font-bold text-gray-600">
                                Analysis
                            </div>
                        </div>
                    </div>

                    {/* New Workflow */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex justify-between text-sm font-medium text-emerald-600 mb-2">
                            <span className="flex items-center gap-2">
                                <Zap className="w-4 h-4" />
                                {t('smartLabel')}
                            </span>
                            <span className="font-bold">~1 min</span>
                        </div>
                        <div className="h-14 bg-emerald-50 rounded-xl overflow-hidden flex relative border border-emerald-100">
                             <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: '5%' }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="bg-emerald-500 h-full flex items-center justify-center text-xs font-bold text-white whitespace-nowrap overflow-hidden px-2"
                             >
                                Auto-Analysis
                             </motion.div>
                             <div className="flex-1 flex items-center pl-4 text-sm text-gray-400 font-mono">
                                 Ready for decision making...
                             </div>
                        </div>
                    </motion.div>

                </div>

                <div className="mt-12 text-center text-gray-500 text-sm leading-relaxed max-w-2xl mx-auto break-keep">
                    {t('disclaimer')}
                </div>
            </div>
        </section>
    );
}
