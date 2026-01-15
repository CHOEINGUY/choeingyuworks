"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Database, Layout, ShieldCheck, WifiOff } from "lucide-react";

export function ArchitectureFlow() {
    const t = useTranslations("EasyEpidemiology.Architecture");

    return (
        <section className="py-24 bg-slate-900 text-white overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                
                <div className="text-center mb-20">
                    <span className="text-blue-400 font-bold tracking-wider text-sm uppercase mb-3 block">
                        System Architecture
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        {t('title')}
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg break-keep">
                        {t('description')}
                    </p>
                </div>

                <div className="relative">
                    {/* Connection Line Background */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-500/20 via-blue-500/50 to-blue-500/20 -translate-y-1/2 hidden md:block" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        
                        {/* Node 1: Local Storage */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-800 p-8 rounded-2xl border border-slate-700 relative group hover:border-blue-500/50 transition-colors"
                        >
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 group-hover:scale-110 transition-transform duration-300">
                                <Database className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{t('step1.title')}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4 break-keep">
                                {t('step1.desc')}
                            </p>
                            <div className="flex gap-2 text-xs font-mono text-slate-500">
                                <span className="bg-slate-900 px-2 py-1 rounded">IndexedDB</span>
                                <span className="bg-slate-900 px-2 py-1 rounded">LocalStorage</span>
                            </div>
                        </motion.div>

                        {/* Node 2: Vue Logic */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-slate-800 p-8 rounded-2xl border border-blue-500/30 relative shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                        >

                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 group-hover:scale-110 transition-transform duration-300">
                                <Layout className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{t('step2.title')}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4 break-keep">
                                {t('step2.desc')}
                            </p>
                             <div className="flex gap-2 text-xs font-mono text-slate-500">
                                <span className="bg-slate-900 px-2 py-1 rounded">Pinia</span>
                                <span className="bg-slate-900 px-2 py-1 rounded">WebWorker</span>
                                <span className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded">Zero Server Cost</span>
                            </div>
                        </motion.div>

                        {/* Node 3: Secure Analysis */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="bg-slate-800 p-8 rounded-2xl border border-slate-700 relative group hover:border-emerald-500/50 transition-colors"
                        >
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 group-hover:scale-110 transition-transform duration-300">
                                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{t('step3.title')}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4 break-keep">
                                {t('step3.desc')}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                                    <WifiOff className="w-3 h-3" />
                                    Offline Ready
                                </div>
                                <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                                    <ShieldCheck className="w-3 h-3" />
                                    No Installation
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

            </div>
        </section>
    );
}
