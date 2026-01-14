"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { ArrowRight, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";
import { ResumeCallToAction } from "@/features/resume/components/ResumeCallToAction";
import { PartySolutionDemo } from "@/features/portfolio/projects/party-event-saas";
import { ExamFlowAnimation } from "@/features/portfolio/projects/namwon-cohort/ExamFlowAnimation";
import { EpidemiologyDemo } from "@/features/portfolio/projects/easy-epidemiology/EpidemiologyDemo";
import { useResponsiveScale } from "@/hooks/useResponsiveScale";

const PROJECTS = [

    {
        id: "easy-epidemiology",
        subtitle: "Browser-based High Performance Analytics",
        title: "웹 브라우저의 한계를 넘는 대용량 역학 분석 도구",
        description: "별도의 통계 프로그램 설치 없이 웹 브라우저에서 대용량 역학 데이터를 즉시 입력하고 분석하는 고성능 도구입니다.\n\n웹 워커와 가상 스크롤 기술을 적용하여 수만 건의 데이터도 지연 없이 처리합니다. 현장에 익숙한 스프레드시트 UX를 제공하며, 유행 곡선 등 핵심 지표 시각화부터 최종 결과보고서 작성까지 원클릭으로 자동화했습니다.",
        tags: ["Vue.js 3", "Web Worker", "Virtual Scroll", "System Architecture"],
        result: <>서버 전송 없이 <strong>브라우저 내에서 모든 연산을 처리</strong>하는 아키텍처로 데이터 보안을 강화하고 인프라 비용을 제로화했습니다.</>,
        imageColor: "bg-emerald-50",
        detailLink: "/portfolio/easy-epidemiology",
        demoUrl: "https://easy-epi.xyz/"
    },
    {
        id: "field",
        subtitle: "Real-time Cohort Management",
        title: "실시간 코호트 검진 시스템",
        description: "검사별 소요 시간 차이로 발생하는 현장의 혼선을 해결하기 위해 개발했습니다. 태블릿과 중앙 상황판을 실시간으로 연동하여, 빈 검사실이 생기면 시스템이 자동으로 다음 대상자를 안내합니다. 복잡한 동선 관리를 자동화하여 연구원들이 오직 검사에만 집중할 수 있도록 도왔습니다.",
        tags: ["AppSheet", "Apps Script", "Firebase"],
        result: <>수기로 관리하던 <strong>동선 안내를 100% 자동화</strong>하여 대기 시간을 줄이고, <strong>검진 효율을 극대화</strong>했습니다.</>,
        imageColor: "bg-slate-50",
        detailLink: "/portfolio/cohort-dashboard"
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

];

export function PortfolioSection() {
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const ratiosRef = useRef<Map<string, number>>(new Map());
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const scale = useResponsiveScale();

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const options = {
            threshold: Array.from({ length: 11 }, (_, i) => i * 0.1),
            rootMargin: "-10% 0px -10% 0px"
        };

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('data-project-id');
                if (id) {
                    if (!entry.isIntersecting && entry.intersectionRatio === 0) {
                        ratiosRef.current.delete(id);
                    } else {
                        ratiosRef.current.set(id, entry.intersectionRatio);
                    }
                }
            });

            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
                let maxId: string | null = null;
                let maxRatio = 0;

                ratiosRef.current.forEach((ratio, id) => {
                    if (ratio > maxRatio && ratio > 0.4) {
                        maxRatio = ratio;
                        maxId = id;
                    }
                });

                if (maxId) setActiveProjectId(maxId);
            }, 100);
        };

        observerRef.current = new IntersectionObserver(handleIntersection, options);

        const elements = document.querySelectorAll('.project-card');
        elements.forEach(el => observerRef.current?.observe(el));

        return () => {
            observerRef.current?.disconnect();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <section className="w-full bg-white pt-0 pb-0">

            {/* Projects List */}
            <div className="flex flex-col">
                {PROJECTS.map((project, idx) => {
                    const isActive = project.id === activeProjectId;
                    return (
                        <div 
                            key={project.id} 
                            data-project-id={project.id}
                            className="project-card w-full border-t border-gray-200 first:border-t-0"
                        >
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
                                    <span className="text-gray-500 font-bold tracking-wider text-xs mb-2 md:mb-3 uppercase">
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
                                    <div className="flex flex-col items-start gap-2">
                                        {(project as any).detailLink && (
                                            <Link
                                                href={(project as any).detailLink}
                                                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                                            >
                                                자세히 보기
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        )}
                                        {(project as any).demoUrl && (
                                            <a
                                                href={(project as any).demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                                            >
                                                시연하기
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Visual (60%) */}
                                <div className={`lg:col-span-7 w-full ${project.id === "solution" ? "aspect-square" : "aspect-[16/12]"} lg:aspect-[16/11] rounded-2xl lg:rounded-3xl ${project.id === "solution" ? "bg-[#F6F5FB]" : project.imageColor} flex items-center justify-center overflow-hidden relative order-1 lg:order-2`}>
                                    {project.id === "solution" ? (
                                        <>
                                            <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-50 via-purple-50/50 to-slate-50/80" />
                                            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.08),transparent)]" />
                                            <div className="absolute inset-0 z-10 overflow-hidden ring-1 ring-purple-200/50 rounded-2xl lg:rounded-3xl flex items-center justify-center">
                                                <PartySolutionDemo
                                                    isEmbedded
                                                    scale={isMobile ? scale * 0.45 : scale * 0.55}
                                                    isActive={isActive}
                                                    isMobile={isMobile}
                                                />
                                            </div>
                                        </>
                                    ) : project.id === "field" ? (
                                        <>
                                            <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-100 via-blue-50/50 to-slate-100/80" />
                                            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent)]" />
                                            <div className="absolute inset-0 z-10 overflow-hidden ring-1 ring-slate-200/50 rounded-2xl lg:rounded-3xl">
                                                <div className="absolute inset-0 w-[125%] h-[125%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                                    <ExamFlowAnimation
                                                        isEmbedded
                                                        scale={scale * 0.8}
                                                        isActive={isActive}
                                                        isMobile={isMobile}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : project.id === "easy-epidemiology" ? (
                                        <>
                                            <div className="absolute inset-0 z-10 overflow-hidden ring-1 ring-emerald-200/50 rounded-2xl lg:rounded-3xl flex items-center justify-center">
                                                <EpidemiologyDemo
                                                    isEmbedded
                                                    scale={scale * 0.95}
                                                    isActive={isActive}
                                                    isMobile={isMobile}
                                                />
                                            </div>
                                        </>
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
                    );
                })}
            </div>


            {/* 2. Resume Call To Action */}
            <ResumeCallToAction />
        </section >
    );
}
