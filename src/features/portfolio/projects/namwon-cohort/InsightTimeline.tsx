"use client";

import { motion } from "framer-motion";
import { MessageSquare, TrendingUp, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function InsightTimeline() {
    const t = useTranslations("CohortDashboard.Insight");

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                        {t('title')}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl break-keep"
                       dangerouslySetInnerHTML={{ __html: t.raw('description') }}
                    />
                </div>

                <div className="space-y-16 relative">
                    <ReflectionCard 
                        icon={AlertCircle}
                        title={t('cards.speed.title')}
                        content={t('cards.speed.content')}
                        color="text-red-500"
                        bgColor="bg-red-50"
                    />

                    <ReflectionCard 
                        icon={MessageSquare}
                        title={t('cards.empathy.title')}
                        content={t('cards.empathy.content')}
                        color="text-amber-500"
                        bgColor="bg-amber-50"
                    />

                    <ReflectionCard 
                        icon={TrendingUp}
                        title={t('cards.trust.title')}
                        content={t('cards.trust.content')}
                        color="text-emerald-500"
                        bgColor="bg-emerald-50"
                    />
                </div>
            </div>
        </section>
    );
}

function ReflectionCard({ icon: Icon, title, content, color, bgColor }: any) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex gap-6 md:gap-8 items-start relative p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm"
        >
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${bgColor} flex items-center justify-center shrink-0 shadow-sm border border-white/50`}>
                <Icon className={`w-6 md:w-7 h-6 md:h-7 ${color}`} />
            </div>

            <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-4 break-keep">
                    {title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed text-base break-keep">
                    {content}
                </p>
            </div>
        </motion.div>
    );
}
