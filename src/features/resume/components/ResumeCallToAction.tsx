"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";

export function ResumeCallToAction() {
    const t = useTranslations("ResumeCTA");
    const locale = useLocale();
    const isEnglish = locale === "en";

    return (
        <section className="w-full bg-white py-32 px-6 border-t border-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                className="max-w-2xl mx-auto"
            >
                <div className="relative bg-white rounded-3xl p-10 md:p-14 border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col items-center text-center overflow-hidden">

                    {/* Background Shine Effect */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-gradient-to-tr from-purple-50 to-blue-50 rounded-full blur-3xl opacity-40 pointer-events-none" />

                    {/* Profile Photo (Larger) */}
                    <div className="w-28 h-28 md:w-32 md:h-32 aspect-square shrink-0 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden mb-6 z-10">
                        <img 
                            src="/profile.jpg" 
                            alt="Choe In-gyu" 
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Name & Title */}
                    <div className="mb-6 z-10">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-1">
                            {isEnglish ? "In-gyu Choe" : <>최인규 <span className="text-gray-400 font-normal text-lg md:text-xl">(In-gyu Choe)</span></>}
                        </h3>
                        <p className="text-gray-500 font-medium text-base md:text-lg">Business Solution Architect</p>
                    </div>

                    {/* Message */}
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 z-10 break-keep max-w-md">
                        {t("text1")}
                        {t("text2")}
                    </p>

                    {/* CTA Button */}
                    <Link href="/resume" className="z-10">
                        <Button size="lg" className="rounded-full bg-black text-white hover:bg-gray-800 px-10 h-14 text-base font-bold shadow-lg hover:shadow-xl transition-all group">
                            {t("button")}
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>

                </div>
            </motion.div>
        </section>
    );
}
