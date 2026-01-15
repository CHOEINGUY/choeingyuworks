"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import {
    ArrowRight,
    BarChart3,
    QrCode,
    ShieldCheck,
    CheckCircle2,
    LayoutGrid
} from "lucide-react";
import {
    PartySolutionDemo,
    DeepDiveFeatures,
    E2EFlowBento,
    FeatureComparisonMatrix,
    PremiumCTA
} from "@/features/portfolio/projects/party-event-saas";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/useMobile";
import { useResponsiveScale } from "@/hooks/useResponsiveScale";


const INFRASTRUCTURE = [
    { name: "React & TS", benefit: "빠르고 안정적인 웹 애플리케이션", detail: "대규모 트래픽에도 끊김 없는 반응성" },
    { name: "Firebase Auth", benefit: "국제 표준 인증 보안 시스템", detail: "안전한 사용자 데이터 암호화 및 관리" },
    { name: "Cloudflare R2", benefit: "대용량 미디어 초고속 처리", detail: "현장 사진과 대용량 파일의 즉각적 로딩" },
    { name: "Banking API", benefit: "실시간 금융 데이터 연동", detail: "오차 없는 입금 확인 및 자동 정산 시스템" }
];

export default function PartySaaSPage() {
    const t = useTranslations("PartySaaS");
    const scale = useResponsiveScale();
    const isMobile = useMobile();

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 relative">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            {/* Hero Section */}
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

                                <div className="flex flex-wrap gap-4 mb-4">
                                    <Link href="/request">
                                        <Button size="lg" className="rounded-full bg-black text-white px-8 h-12 text-base font-semibold shadow-lg hover:bg-gray-800 transition-all">
                                            {t('Hero.cta')}
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            className="lg:col-span-7 relative order-2 w-full"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative aspect-square md:aspect-[16/11] w-full max-w-full mx-auto rounded-3xl overflow-hidden bg-[#F6F5FB] ring-1 ring-purple-200/50">
                                <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-50 via-purple-50/50 to-slate-50/80" />
                                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.08),transparent)]" />
                                <div className="absolute inset-0 z-10 p-0 flex items-center justify-center overflow-hidden">
                                    <PartySolutionDemo
                                        isEmbedded
                                        scale={scale * (isMobile ? 0.45 : 0.65)}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* E2E Flow (Stripped Pipeline) - RESTORED */}
            <E2EFlowBento />
            
            {/* DEEP DIVE FEATURES (Visual Showcase - CORE) */}
            <DeepDiveFeatures />
            
            {/* Feature Comparison Matrix (Detailed Specs - NEW) */}
            <FeatureComparisonMatrix />

            {/* Detailed Features / Grid - DELETED as per UX review */}

            {/* Premium CTA Section */}
            <PremiumCTA />

            {/* Footer Global Link (Compact) */}
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
