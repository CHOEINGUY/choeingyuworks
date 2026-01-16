"use client";

import { motion } from "framer-motion";
import { AlertCircle, Zap } from "lucide-react";

import { useTranslations } from "next-intl";

export function BusinessContext() {
    const t = useTranslations("CohortDashboard.BusinessContext");

    return (
        <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-100">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                        {t('title')}
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed break-keep"
                        dangerouslySetInnerHTML={{ __html: t.raw('description') }}
                    />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Problem Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-red-50/70 rounded-2xl p-6 border border-red-100"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="font-bold text-gray-900">{t('problemTitle')}</h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed break-keep"
                            dangerouslySetInnerHTML={{ __html: t.raw('problemDesc') }}
                        />
                    </motion.div>

                    {/* Solution Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-emerald-50/70 rounded-2xl p-6 border border-emerald-100"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="font-bold text-gray-900">{t('solutionTitle')}</h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed break-keep"
                            dangerouslySetInnerHTML={{ __html: t.raw('solutionDesc') }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
