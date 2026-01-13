"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { XCircle, ArrowRight, ShieldAlert, Clock } from "lucide-react";

export function CoreDescription() {
    const t = useTranslations("EasyEpidemiology.CoreDescription");

    const problems = [
        {
            icon: <XCircle className="w-6 h-6 text-red-500" />,
            title: "brokenWorkflow",
            desc: "brokenWorkflowDesc"
        },
        {
            icon: <ShieldAlert className="w-6 h-6 text-orange-500" />,
            title: "securityRisk",
            desc: "securityRiskDesc"
        },
        {
            icon: <Clock className="w-6 h-6 text-amber-500" />,
            title: "slowProcess",
            desc: "slowProcessDesc"
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    
                    {/* Left: Headline */}
                    <div>
                        <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-4 block">
                            The Problem
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight break-keep"
                            dangerouslySetInnerHTML={{ __html: t.raw('title') }}
                        />
                        <p className="text-lg text-gray-600 leading-relaxed break-keep">
                            {t('description')}
                        </p>
                    </div>

                    {/* Right: Problem List (Cards) */}
                    <div className="flex flex-col gap-4">
                        {problems.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                            >
                                <div className="mt-1 flex-shrink-0 bg-gray-50 p-2 rounded-lg">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        {t(`problems.${item.title}`)}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed break-keep">
                                        {t(`problems.${item.desc}`)}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
