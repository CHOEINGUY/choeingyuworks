
"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { LayoutGrid } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { BottleneckSimulation } from "@/features/portfolio/projects/namwon-cohort/BottleneckSimulation";
import { TechStackFlow } from "@/features/portfolio/projects/namwon-cohort/TechStackFlow";
import { LogicPipeline } from "@/features/portfolio/projects/namwon-cohort/LogicPipeline";
import { InsightTimeline } from "@/features/portfolio/projects/namwon-cohort/InsightTimeline";

import { BusinessContext } from "@/features/portfolio/projects/namwon-cohort/BusinessContext";
import { ExamFlowAnimation } from "@/features/portfolio/projects/namwon-cohort/ExamFlowAnimation";
import { useResponsiveScale } from "@/hooks/useResponsiveScale";

export default function CohortDashboardPage() {
    const t = useTranslations("CohortDashboard");
    const scale = useResponsiveScale();

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 relative">
            {/* Background Grid Pattern (Same as Party SaaS) */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            {/* Hero Section (Matching Layout) */}
            <section className="relative pt-24 pb-12 md:pt-40 md:pb-20 px-4 md:px-6 overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent z-10" />

                <div className="w-full md:w-[93%] max-w-[77rem] mx-auto relative z-20">
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
                        
                        {/* Left Content (Text) */}
                        <div className="lg:col-span-5 flex flex-col items-start text-left order-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >

                                <h1 className="text-shimmer text-3xl md:text-5xl lg:text-5xl font-extrabold leading-tight md:leading-[1.1] mb-6 break-keep tracking-tight text-gray-900"
                                    dangerouslySetInnerHTML={{ __html: t.raw('Hero.title') }}
                                />

                                <p className="text-base md:text-lg font-normal text-gray-600 leading-relaxed mb-8 break-keep max-w-xl"
                                    dangerouslySetInnerHTML={{ __html: t.raw('Hero.description') }}
                                />
                            </motion.div>
                        </div>

                        {/* Right Content (Visual - FieldManagementDemo) */}
                        <motion.div
                            className="lg:col-span-7 relative order-2 w-full"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative aspect-[4/3] md:aspect-[16/11] w-full max-w-full mx-auto rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50/50 to-slate-100/80 ring-1 ring-slate-200/50">
                                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent)]" />
                                <div className="absolute inset-0 z-10 overflow-hidden">
                                    <div className="absolute inset-0 w-[125%] h-[125%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <ExamFlowAnimation
                                            isEmbedded
                                            scale={scale * 0.8}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Business Context (Background) */}
            <BusinessContext />

            {/* Problem & Solution (Animated Simulation) */}
            <BottleneckSimulation />

            {/* Architecture (Interactive Flow) */}
            <TechStackFlow />

            {/* Logic Pipeline (Algorithm Visualization) */}
            <LogicPipeline />

            {/* Insight Timeline (Lessons Learned) */}
            <InsightTimeline />
        


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
