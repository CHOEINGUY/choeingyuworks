"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import {
    ArrowRight,
    FileEdit,
    Zap,
    Layers,
    BarChart3,
    QrCode,
    ShieldCheck,
    CheckCircle2
} from "lucide-react";
import { PartySolutionDemo } from "@/features/portfolio/components/party-demo";
import { DeepDiveFeatures } from "@/features/portfolio/components/DeepDiveFeatures";
import { E2EFlowBento } from "@/features/portfolio/components/E2EFlowBento";
import { DetailedFeatures } from "@/features/portfolio/components/DetailedFeatures";
import { PremiumCTA } from "@/features/portfolio/components/PremiumCTA";
import { Button } from "@/components/ui/button";


const INFRASTRUCTURE = [
    { name: "React & TS", benefit: "빠르고 안정적인 웹 애플리케이션", detail: "대규모 트래픽에도 끊김 없는 반응성" },
    { name: "Firebase Auth", benefit: "국제 표준 인증 보안 시스템", detail: "안전한 사용자 데이터 암호화 및 관리" },
    { name: "Cloudflare R2", benefit: "대용량 미디어 초고속 처리", detail: "현장 사진과 대용량 파일의 즉각적 로딩" },
    { name: "Banking API", benefit: "실시간 금융 데이터 연동", detail: "오차 없는 입금 확인 및 자동 정산 시스템" }
];

export default function PartySaaSPage() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 relative">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            {/* Hero Section */}
            <section className="relative pt-24 pb-12 md:pt-40 md:pb-20 px-6 overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent z-10" />

                <div className="max-w-7xl mx-auto relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">

                        {/* Left Content (Text) */}
                        <div className="lg:col-span-5 flex flex-col items-start text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h1 className="text-shimmer text-3xl md:text-5xl lg:text-5xl font-extrabold leading-tight md:leading-[1.1] mb-6 break-keep tracking-tight text-gray-900">
                                    이벤트 비즈니스의 모든 것,
                                    <br />
                                    <span className="text-blue-600">단 하나의 솔루션</span>으로.
                                </h1>

                                <p className="text-base md:text-lg font-normal text-gray-600 leading-relaxed mb-8 break-keep max-w-xl">
                                    신청부터 결제, QR 입장, 웹앱 연결까지.
                                    <br className="hidden md:block" />
                                    여러 도구에 흩어져있던 업무를 <strong className="text-gray-900">하나로 통합하고 운영 리소스를 90% 절감</strong>하세요.
                                </p>

                                <div className="flex flex-wrap gap-4 mb-4">
                                    <Link href="/request">
                                        <Button size="lg" className="rounded-full bg-black text-white px-8 h-12 text-base font-semibold shadow-lg hover:bg-gray-800 transition-all">
                                            서비스 의뢰하기
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Content (Visual) */}
                        <motion.div
                            className="lg:col-span-7 relative"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative aspect-[16/12] md:aspect-[16/11] w-full max-w-full mx-auto rounded-3xl overflow-hidden bg-[#F6F5FB]">
                                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.1),transparent)]" />
                                <div className="absolute inset-0 z-10 p-0 flex items-center justify-center overflow-hidden">
                                    <PartySolutionDemo
                                        isEmbedded
                                        scale={0.6}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* E2E Flow Grid (Unified Pipeline) - Restored at Top */}
            <E2EFlowBento />

            {/* DEEP DIVE FEATURES (Replaces Bento Grid) */}
            <DeepDiveFeatures />

            {/* Detailed Features (Tools) */}
            <DetailedFeatures />

            {/* Premium CTA Section */}
            <PremiumCTA />

            {/* Footer Global Link (Compact) */}
            <div className="py-8 bg-gray-50 border-t border-gray-100 text-center">
                <Link href="/" className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors tracking-widest uppercase">
                    Back to Portfolio
                </Link>
            </div>
        </div>
    );
}
