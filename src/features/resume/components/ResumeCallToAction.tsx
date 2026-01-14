"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function ResumeCallToAction() {
    const t = useTranslations("ResumeCTA");

    return (
        <section className="w-full bg-white py-32 px-6 border-t border-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                className="max-w-4xl mx-auto"
            >
                <div className="relative bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col md:flex-row items-center gap-10 overflow-hidden">

                    {/* Background Shine Effect */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

                    {/* Left Side: Identity */}
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left z-10 shrink-0">
                        {/* Avatar / Placeholder */}
                        <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
                            <img 
                                src="/profile.jpg" 
                                alt="Choi In-gyu" 
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">최인규 <span className="text-gray-400 font-normal text-lg ml-1">(In-gyu Choi)</span></h3>
                            <p className="text-gray-500 font-medium">Business Solution Architect</p>

                        </div>
                    </div>

                    {/* Divider (Mobile hidden) */}
                    <div className="hidden md:block w-px h-24 bg-gray-100 mx-4" />

                    {/* Right Side: Action */}
                    <div className="flex flex-col items-center md:items-start gap-4 flex-1 z-10 text-center md:text-left">
                        <p className="text-xl text-gray-700 font-semibold leading-relaxed break-keep">
                            {t("text1")}
                            <br className="hidden md:block" />
                            {t("text2")}
                        </p>

                        <Link href="/resume">
                            <Button size="lg" className="rounded-full bg-black text-white hover:bg-gray-800 px-8 h-12 text-base font-bold shadow-lg hover:shadow-xl transition-all group">
                                {t("button")}
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                </div>
            </motion.div>
        </section>
    );
}
