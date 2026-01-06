"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { ArrowRight, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";
import { ResumeCallToAction } from "@/features/resume/components/ResumeCallToAction";
import { PartySolutionDemo } from "@/features/portfolio/components/party-demo";

const PROJECTS = [
    {
        id: "automation",
        subtitle: "Architecture Automation",
        title: "업무 프로세스 혁신",
        description: "3개월이 걸리던 복잡한 정산 업무를 자동화 로직을 통해 1개월로 단축했습니다. 단순 반복 작업에서 해방되어 팀원들이 본질적인 기획과 전략에 집중할 수 있는 환경을 만들었습니다.",
        tags: ["Python", "RPA", "System Architecture"],
        result: <>수작업 대비 <strong>업무 시간을 90% 단축</strong>하고, <strong>휴먼 에러 0%</strong>의 완전 무결성을 검증했습니다.</>,
        imageColor: "bg-blue-50"
    },
    {
        id: "field",
        subtitle: "Field Management System",
        title: "현장 운영 시스템",
        description: "현장의 병목 현상을 해결하기 위해 실시간 데이터 파이프라인을 구축했습니다. 수기 관리되던 자재 현황을 디지털화하여 관리 사각지대를 완전히 없앴습니다.",
        tags: ["Next.js", "Real-time Dashboard", "IoT"],
        result: <>실시간 데이터 시각화를 통해 <strong>현장 대기 시간을 50% 단축</strong>하고, <strong>자재 손실률을 0%</strong>로 만들었습니다.</>,
        imageColor: "bg-emerald-50"
    },
    {
        id: "solution",
        subtitle: "All-in-One Event SaaS Platform",
        title: "3가지 이벤트 비즈니스를 하나로, 올인원 운영 솔루션",
        description: "프라이빗 파티, 로테이션 소개팅, 1:1 매칭 등 서로 다른 3가지 사업 형태를 하나의 관리자 페이지에서 통합 운영할 수 있습니다.\n\n구글 폼의 한계를 넘는 '자체 신청서 빌더'를 내장하여 양식을 자유롭게 수정할 수 있으며, 신청부터 결제, QR 입장, 웹앱 연결까지의 전 과정을 완전 자동화하여 운영 리소스를 획기적으로 절감했습니다.",
        tags: ["Firebase", "Cloudflare R2", "Banking API"],
        result: <>수작업 입금 확인 <strong>90% 자동화</strong>, 현장 운영 인력 <strong>80% 절감</strong>. 1인 운영자도 수백 명 규모의 이벤트를 무리 없이 관리할 수 있는 시스템을 구축했습니다.</>,
        imageColor: "bg-purple-50",
        detailLink: "/portfolio/party-saas"
    },
    {
        id: "analytics",
        subtitle: "Data Analytics",
        title: "데이터 분석 및 인사이트",
        description: "축적된 데이터를 분석하여 숨겨진 비용 누수 구간을 찾아냅니다. 감이 아닌 확실한 숫자에 기반한 경영 전략을 수립할 수 있도록 지원합니다.",
        tags: ["Data Mining", "Visualization", "Business Intelligence"],
        result: <>데이터 기반의 의사결정으로 <strong>연간 운영 비용 15%를 절감</strong>하고, <strong>새로운 매출 기회</strong>를 발굴했습니다.</>,
        imageColor: "bg-orange-50"
    }
];

export function PortfolioSection() {
    return (
        <section className="w-full bg-white pt-0 pb-0">

            {/* Projects List */}
            <div className="flex flex-col">
                {PROJECTS.map((project, idx) => (
                    <div key={project.id} className="w-full border-t border-gray-200 first:border-t-0">
                        {/* 1. Feature Detail (Centered Content) */}
                        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
                            <motion.div
                                initial={idx === 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                                whileInView={idx === 0 ? undefined : { opacity: 1, y: 0 }}
                                viewport={idx === 0 ? undefined : { once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start"
                            >
                                {/* Left Column: Text (40%) */}
                                <div className="lg:col-span-5 flex flex-col pt-4 order-2 lg:order-1">
                                    <span className="text-blue-600 font-bold tracking-wider text-xs mb-2 md:mb-3 uppercase">
                                        {project.subtitle}
                                    </span>
                                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-5 leading-tight break-keep">
                                        {project.title}
                                    </h2>
                                    <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-5 md:mb-6 break-keep">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-5">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="bg-gray-100 text-gray-600 px-2.5 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    {(project as any).detailLink && (
                                        <Link
                                            href={(project as any).detailLink}
                                            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                                        >
                                            자세히 보기
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    )}
                                </div>

                                {/* Right Column: Visual (60%) */}
                                <div className={`lg:col-span-7 w-full aspect-[16/12] lg:aspect-[16/11] rounded-2xl lg:rounded-3xl ${project.id === "solution" ? "bg-[#F6F5FB]" : project.imageColor} flex items-center justify-center overflow-hidden relative order-1 lg:order-2`}>
                                    {project.id === "solution" ? (
                                        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
                                            <PartySolutionDemo
                                                isEmbedded
                                                scale={0.5}
                                            />
                                        </div>
                                    ) : (
                                        /* Placeholder for other visuals */
                                        <div className="text-center p-8">
                                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm mx-auto mb-4 flex items-center justify-center">
                                                <span className="text-2xl font-bold text-gray-300">{idx + 1}</span>
                                            </div>
                                            <p className="text-gray-500 font-medium">Project Visual Area</p>
                                            <p className="text-sm text-gray-400 mt-2">({project.subtitle})</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* 2. Result Summary (Full-width light background with borders) */}
                        <div className="w-full border-y border-gray-200">
                            <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 min-h-[100px] md:min-h-[110px] flex items-center">
                                <p className="text-lg md:text-xl text-[#333] subpixel-antialiased font-normal leading-relaxed break-keep">
                                    {project.result}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {/* 2. Resume Call To Action */}
            <ResumeCallToAction />
        </section >
    );
}
