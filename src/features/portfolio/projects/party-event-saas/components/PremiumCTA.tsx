"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function PremiumCTA() {
    const t = useTranslations("PartySaaS.PremiumCTA");

    return (
        <section className="py-24 md:py-32 px-6 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto text-center">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111827] mb-8 tracking-tight break-keep leading-[1.15]"
                        dangerouslySetInnerHTML={{ __html: t.raw('title') }}
                    />

                    <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed break-keep"
                        dangerouslySetInnerHTML={{ __html: t.raw('description') }}
                    />

                    <div className="flex justify-center">
                        <Link href="/request">
                            <Button size="lg" className="h-16 px-12 rounded-full bg-[#111827] hover:bg-[#1E293B] text-white text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-200">
                                {t('button')}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
