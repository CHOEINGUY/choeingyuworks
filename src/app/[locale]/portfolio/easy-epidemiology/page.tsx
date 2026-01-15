"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { LayoutGrid, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

import { CoreDescription } from "@/features/portfolio/projects/easy-epidemiology/CoreDescription";
import { VirtualScrollDemo } from "@/features/portfolio/projects/easy-epidemiology/VirtualScrollDemo";
import { ArchitectureFlow } from "@/features/portfolio/projects/easy-epidemiology/ArchitectureFlow";

import { FeatureTimeline } from "@/features/portfolio/projects/easy-epidemiology/FeatureTimeline";

// Re-using the animation component from Party SaaS or similar if available, 
// or just using a placeholder visual for the Hero. 
import { EpidemiologyDemo } from "@/features/portfolio/projects/easy-epidemiology/EpidemiologyDemo"; 
import { useResponsiveScale } from "@/hooks/useResponsiveScale"; 

export default function EasyEpidemiologyPage() {
    const t = useTranslations("EasyEpidemiology");
    const scale = useResponsiveScale();

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-emerald-100 relative">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            {/* Hero Section */}
            <section className="relative pt-24 pb-12 md:pt-40 md:pb-20 px-4 md:px-6 overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent z-10" />

                <div className="w-full md:w-[93%] max-w-[77rem] mx-auto relative z-20">
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
                        
                        {/* Left Content */}
                        <div className="lg:col-span-5 flex flex-col items-start text-left order-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="text-emerald-600 font-bold tracking-wider text-sm uppercase mb-4 block">
                                    Web-based Epidemic Investigation Tool
                                </span>
                                <h1 className="text-shimmer text-3xl md:text-5xl lg:text-5xl font-extrabold leading-tight md:leading-[1.1] mb-6 break-keep tracking-tight text-gray-900"
                                    dangerouslySetInnerHTML={{ __html: t.raw('Hero.title') }}
                                />

                                <p className="text-base md:text-lg font-normal text-gray-600 leading-relaxed mb-8 break-keep max-w-xl"
                                    dangerouslySetInnerHTML={{ __html: t.raw('Hero.description') }}
                                />
                                
                                <div className="flex items-center gap-4">
                                    <a 
                                        href="https://easy-epi.xyz/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                                    >
                                        시연하기
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Content (Visual) */}
                        <motion.div
                            className="lg:col-span-7 relative order-2 w-full"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative aspect-[4/3] md:aspect-[16/11] w-full max-w-full mx-auto rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50/50 to-slate-100/80 ring-1 ring-emerald-200/50">
                                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent)]" />
                                {/* Using the EpidemiologyDemo component for the hero */}
                                <div className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center">
                                    <EpidemiologyDemo scale={scale * 0.95} isActive={true} />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <CoreDescription />
            
            <VirtualScrollDemo />
            
            <ArchitectureFlow />
            

            
            <FeatureTimeline />

            {/* Footer */}
            <div className="py-24 bg-gray-50 border-t border-gray-100 text-center">
                 <Link href="/?tab=portfolio">
                    <Button variant="outline" className="h-14 px-8 rounded-full border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 hover:bg-white hover:shadow-sm transition-all duration-300 group text-base font-medium">
                        <LayoutGrid className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform text-gray-400 group-hover:text-gray-900" />
                        {t('backToPortfolio')}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
