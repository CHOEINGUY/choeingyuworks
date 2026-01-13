"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import {
    ArrowRight,
    MapPin,
    Users,
    ClipboardList,
    Radio,
    Shield,
    BarChart2,
    CheckCircle2
} from "lucide-react";
// import { FieldManagementDemo } from "@/features/portfolio/projects/field-management";
import { Button } from "@/components/ui/button";

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

// Feature data (Field Management Pillars)
const FEATURES = [
    {
        icon: MapPin,
        title: "Real-time Tracking",
        subtitle: "실시간 위치 관제",
        description: "현장 인력의 위치를 실시간으로 파악하고 최적의 경로를 제안하여 이동 효율을 극대화합니다.",
        color: "bg-blue-50/50",
        iconColor: "text-blue-600",
        metric: "Live GPS"
    },
    {
        icon: ClipboardList,
        title: "Digital Task Management",
        subtitle: "디지털 업무 할당",
        description: "종이 없는 업무 환경. 모바일 앱으로 업무를 지시하고 사진과 함께 결과를 즉시 보고받습니다.",
        color: "bg-amber-50/50",
        iconColor: "text-amber-600",
        metric: "Paperless"
    },
    {
        icon: Users,
        title: "Workforce Scheduling",
        subtitle: "스마트 인력 배치",
        description: "숙련도와 가용 시간을 고려한 자동 스케줄링으로 관리자의 고민 시간을 획기적으로 줄여줍니다.",
        color: "bg-emerald-50/50",
        iconColor: "text-emerald-600",
        metric: "Auto-Schedule"
    },
    {
        icon: Radio,
        title: "Instant Communication",
        subtitle: "현장 긴급 소통",
        description: "현장 이슈 발생 시 즉시 알림을 전송하고, 채팅/화상을 통해 신속하게 문제를 해결합니다.",
        color: "bg-purple-50/50",
        iconColor: "text-purple-600",
        metric: "Real-time"
    },
    {
        icon: Shield,
        title: "Safety Compliance",
        subtitle: "안전 규정 준수",
        description: "작업 전 안전 체크리스트 의무화 및 위험 지역 접근 알림으로 안전 사고를 예방합니다.",
        color: "bg-slate-50/50",
        iconColor: "text-slate-600",
        metric: "Safety First"
    },
    {
        icon: BarChart2,
        title: "Performance Analytics",
        subtitle: "성과 분석 리포트",
        description: "작업 시간, 완료율, 이동 거리 등 데이터를 시각화하여 운영 개선 포인트를 도출합니다.",
        color: "bg-rose-50/50",
        iconColor: "text-rose-600",
        metric: "Data-Driven"
    }
];

const MORE_CAPABILITIES = [
    "오프라인 모드 지원 (통신 음영 지역 작업 가능)",
    "NFC 태그를 이용한 설비 점검 인증",
    "고객 전자 서명 및 만족도 평가"
];

const INFRASTRUCTURE = [
    { name: "React Native", benefit: "크로스 플랫폼 모바일 앱", detail: "iOS/Android 동시 지원 및 네이티브 성능" },
    { name: "WebSocket", benefit: "초저지연 양방향 통신", detail: "현장 상황과 지시 사항의 실시간 동기화" },
    { name: "AWS IoT", benefit: "대규모 디바이스 연결", detail: "수천 명의 현장 인력과 센서 데이터 처리" },
    { name: "PostGIS", benefit: "강력한 공간 데이터 처리", detail: "복잡한 위치 기반 쿼리와 지오펜싱 연산" }
];

export default function FieldManagementPage() {
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
                                    현장과 사무실을 잇는
                                    <br />
                                    <span className="text-blue-600">완벽한 연결고리</span>
                                </h1>

                                <p className="text-base md:text-lg font-normal text-gray-600 leading-relaxed mb-8 break-keep max-w-xl">
                                    실시간 위치 관제부터 업무 할당, 결과 보고까지.
                                    <br className="hidden md:block" />
                                    현장의 불확실성을 제거하고 <strong className="text-gray-900">운영 효율을 극대화</strong>하세요.
                                </p>

                                <div className="flex flex-wrap gap-4 mb-4">
                                    <Link href="/request">
                                        <Button size="lg" className="rounded-full bg-black text-white px-8 h-12 text-base font-semibold shadow-lg hover:bg-gray-800 transition-all">
                                            솔루션 도입 문의
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
                            <div className="relative aspect-[16/12] md:aspect-[16/11] w-full max-w-full mx-auto rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-[#F6F5FB]">
                                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.1),transparent)]" />
                                <div className="absolute inset-0 z-10 p-0 flex items-center justify-center overflow-hidden">
                                    {/* <FieldManagementDemo
                                        isEmbedded
                                        scale={0.62}
                                    /> */}
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">Demo Placeholder</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Expanded Features Section */}
            <section className="py-20 px-6 bg-gray-50/30 relative">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col mb-16 items-center text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            현장에 답이 있습니다. <br className="md:hidden" />
                            시스템으로 증명하세요.
                        </h2>
                        <p className="text-gray-600 text-lg break-keep leading-relaxed max-w-2xl">
                            수기 기록과 전화 보고의 비효율을 끝내세요.
                            데이터 기반의 투명한 관리로 현장의 생산성을 혁신합니다.
                        </p>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
                        variants={stagger}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {FEATURES.map((feature) => (
                            <motion.div
                                key={feature.title}
                                variants={fadeInUp}
                                className={`${feature.color} rounded-3xl p-8 border border-white/50 shadow-sm transition-all hover:bg-white hover:shadow-xl group interaction-ring`}
                            >
                                <div className="flex justify-between items-start mb-10">
                                    <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center ${feature.iconColor} transition-all group-hover:shadow-lg group-hover:scale-110`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100">
                                        <span className={`text-[9px] font-extrabold uppercase tracking-widest ${feature.iconColor}`}>
                                            {feature.metric}
                                        </span>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{feature.title}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {feature.subtitle}
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed break-keep group-hover:text-gray-800 transition-colors">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* More Capabilities List */}
                    <div className="bg-white rounded-[40px] p-8 md:p-12 border border-blue-50/50 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-10 text-center">
                            Field-Proven Capabilities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {MORE_CAPABILITIES.map((item, idx) => (
                                <div key={idx} className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-blue-50/50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500 group-hover:text-white" />
                                    </div>
                                    <span className="text-gray-800 font-bold text-sm leading-snug break-keep flex-1">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Infrastructure Section (Enterprise-Grade) */}
            <section className="py-24 px-6 border-y border-gray-100 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] opacity-20 -mr-48 -mt-48" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            Robust Foundation
                        </h2>
                        <p className="text-gray-500 font-medium">거친 현장 환경에서도 끊김 없는 연결을 보장합니다</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {INFRASTRUCTURE.map((item) => (
                            <div key={item.name} className="flex flex-col items-start text-left p-8 rounded-[32px] bg-white border border-gray-100 hover:border-blue-400 hover:shadow-2xl transition-all group">
                                <div className="w-full flex justify-between items-center mb-6">
                                    <span className="text-2xl font-black text-gray-900 tracking-tighter group-hover:text-blue-600 transition-colors">
                                        {item.name}
                                    </span>
                                    <div className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-sm">
                                        STABLE
                                    </div>
                                </div>
                                <h4 className="text-sm font-extrabold text-gray-900 mb-2 break-keep">
                                    {item.benefit}
                                </h4>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed break-keep">
                                    {item.detail}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-32 px-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-blue-600" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),rgba(0,0,0,0))]" />

                <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-8 tracking-tight break-keep">
                            현장 관리의 새로운 표준을 <br className="md:hidden" />
                            경험해보세요.
                        </h2>
                        <p className="text-lg md:text-xl text-blue-50 mb-12 font-medium opacity-90 max-w-2xl mx-auto break-keep">
                            더 이상 감과 운에 의존하지 마세요.
                            <br className="hidden md:block" />
                            데이터가 보여주는 명확한 길을 따라 비즈니스를 성장시키세요.
                        </p>
                        <Link href="/request">
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-10 h-14 rounded-full text-lg font-bold shadow-2xl transition-all transform hover:scale-105 active:scale-95">
                                무료 상담 신청하기
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer Global Link (Compact) */}
            <div className="py-8 bg-gray-50 border-t border-gray-100 text-center">
                <Link href="/" className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors tracking-widest uppercase">
                    Back to Portfolio
                </Link>
            </div>
        </div>
    );
}
