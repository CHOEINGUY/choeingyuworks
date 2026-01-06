"use client";

import { Link, useRouter, usePathname } from "@/navigation";

import { useTranslations, useLocale } from "next-intl";
import { Mail, Github, Linkedin, MapPin, Globe, Infinity as InfinityIcon, Printer, Phone } from "lucide-react";

const RESUME_DATA = {
    common: {
        github: "https://github.com/CHOEINGUY",
        email: "chldlsrb07@gmail.com",
        phone: "010-3323-7008",
    },
    ko: {
        name: "최인규",
        role: "Problem Solver & Software Engineer",
        location: "광주광역시 광산구",
        about: "현장의 비효율을 참지 못하는, 실용주의 엔지니어입니다.\n복잡한 기술 과시보다는 '사용자가 편한가?', '업무가 빨라졌는가?'를 최우선으로 고민합니다. 전남대학교 의과대학 연구원 재직 시 3개월이 소요되던 업무를 자동화하여 1개월로 단축시켰고, 최근에는 1인 개발로 파티 운영의 전 과정을 자동화한 시스템을 구축했습니다. 기획부터 개발, 운영까지 전체 프로세스(E2E)를 책임지며, 개발자가 없는 조직에서도 안정적으로 돌아가는 단단한 자동화 시스템을 만듭니다.",
        education: [
            {
                school: "한국방송통신대학교",
                major: "컴퓨터과학과 (재학중)",
                period: "2024. 03 - 현재",
            },
            {
                school: "전남대학교",
                major: "사범대학 생물교육과 (졸업)",
                period: "2017. 03 - 2021. 08",
            }
        ],
        experience: [
            {
                company: "Lindy Works (린디 웍스)",
                position: "Freelance Developer",
                period: "2025. 10 - 현재",
                description: [
                    "비즈니스 프로세스 자동화 전문 프리랜서. 다양한 클라이언트의 운영 비효율을 해결하는 맞춤형 솔루션을 개발합니다."
                ]
            },
            {
                company: "전남대학교 의과대학 예방의학교실",
                position: "연구원 / 개발 담당",
                period: "2022. 08 - 2025. 12",
                description: [
                    "주요 성과: 코호트 검진 현장 자동화 시스템 구축을 통해 검진 프로세스 최적화 및 연구원 업무 부하 50% 경감",
                    "기술 기여: Python/VBA 기반 통계 업무 자동화로 발간 기간 단축(3개월 -> 1개월)"
                ]
            }
        ],
        projects: [
            {
                name: "3가지 매칭 비즈니스 모델을 지원하는 올인원 이벤트 SaaS 플랫폼 (Form Engine 내장)",
                period: "2026. 01",
                description: [
                    "개요: 프라이빗 파티, 로테이션 소개팅, 1:1 소개팅 등 3가지 핵심 사업 아이템을 하나의 어드민에서 통합 관리할 수 있는 범용 솔루션",
                    "Form Engine: React 기반의 자체 폼 엔진을 탑재하여 Google Forms 없이 신청서와 프로필 양식을 자유롭게 커스텀 (Drag & Drop UX, 동적 렌더링)",
                    "Multi-Business Architecture: 단일 시스템에서 파티/단체/1:1 매칭 등 비즈니스 타입에 따라 로직이 분기되는 유연한 설계",
                    "Seamless UX: QR 체크인 즉시 출석 처리와 동시에 참여자 전용 '파티 프로그램 웹앱'으로 자동 리다이렉션 구현",
                    "RBAC Security: Firebase Auth를 활용한 마스터/매니저/스태프 등 세분화된 권한 관리 시스템",
                    "Smart Automation: 문자 자동 발송 및 뱅킹 API를 통한 입금 확인 100% 자동화",
                    "Tech Stack: React, TypeScript, Firebase (Auth/DB), Cloudflare R2, Tailwind CSS, Banking API"
                ]
            },
            {
                name: "집단발생 및 역학조사 통합 분석 솔루션 Easy-Epidemiology",
                period: "2024. 11 - 2025. 07",
                description: [
                    "개요: 광주·전남 지역 보건소 담당자를 위한 웹 기반 감염병 대응 및 보고서 자동화 시스템",
                    "주요 기능: 감염원 추정을 위한 환자-대조군 연구(OR 계산) 및 유행곡선(Epidemic Curve) 자동 생성, 보고서 양식(한글/PDF) 제안",
                    "기술 스택: Vue.js, React, Tailwind CSS, 전문 통계 분석 로직",
                    "성과: 수작업으로 수 시간이 소요되던 역학 분석 및 보고서 작성을 데이터 입력 즉시 완료되도록 혁신"
                ]
            },
            {
                name: "제조업(루나테크) ERP 및 업무 자동화 시스템",
                period: "2024. 10",
                description: [
                    "견적-발주-세금계산서 업무의 디지털 전환 및 전산화",
                    "Key Tech: AppSheet, Google Apps Script, 국세청 홈택스 API 연동",
                    "Impact: 모바일 견적 산출 후 세금계산서 원클릭 발행 시스템 구현으로 사무 행정 시간 70% 단축"
                ]
            },
            {
                name: "실시간 코호트 검진 현장 대시보드 및 운영 관리 시스템",
                period: "2024. 01 - 2025. 12",
                description: [
                    "개요: 한정된 시간 내 다수 검사가 이루어지는 코호트 검진 현장의 병목 현상을 해결하기 위한 실시간 통합 관제 시스템",
                    "핵심 기능: AppSheet와 Firebase 연동을 통한 실시간 현황 현장 중계, Google TTS 기반 음성 호명 및 지능형 순서 배정 자동화",
                    "기술적 고도화: 초기 Google Sheets 기반 API 호출 방식을 Firebase 리얼타임 통신으로 개선하여 시스템 신뢰도 및 반응 속도 혁신",
                    "철학: 기술적 완성도를 넘어 사용자의 행동 패턴을 고려한 운영 프로세스 정립 및 사용자 교육을 통한 현장 문제 해결"
                ]
            }
        ],
        skills: [
            { category: "전문 분야", items: "비즈니스 프로세스 자동화(BPA), 실시간 데이터 시스템, E2E 솔루션 설계" },
            { category: "프론트엔드", items: "React, Vue 3, Next.js, Tailwind CSS, TypeScript" },
            { category: "백엔드 & DB", items: "Supabase (Real-time), Firebase, PostgreSQL" },
            { category: "자동화 & 도구", items: "AppSheet, Google Apps Script (GAS), Python (Pandas/Automation)" },
            { category: "핵심 경험", items: "금융 API 연동, 국세청 홈택스 자동화, QR 기반 체크인 시스템" }
        ]
    },
    en: {
        name: "In-gyu Choi",
        role: "Problem Solver & Software Engineer",
        location: "Gwangsan-gu, Gwangju, South Korea",
        about: "I am a pragmatic engineer who cannot stand field inefficiencies.\nRather than boasting about complex technologies, I prioritize two questions: 'Is it easy for the user?' and 'Has the work become faster?' During my time as a researcher at Chonnam National University Medical School, I reduced a 3-month workload to 1 month through automation. Most recently, I developed a solo-built automated system for entire party operations. Taking responsibility for the full E2E process—from planning to development and operations—I build robust automation systems that run reliably even in organizations without dedicated developers.",
        education: [
            {
                school: "Korea National Open University",
                major: "Computer Science (Enrolled)",
                period: "Mar 2024 - Present",
            },
            {
                school: "Chonnam National University",
                major: "Dept. of Biology Education (B.S.)",
                period: "Mar 2017 - Aug 2021",
            }
        ],
        experience: [
            {
                company: "Lindy Works",
                position: "Freelance Developer",
                period: "Oct 2025 - Present",
                description: [
                    "Freelance Developer specializing in business process automation. Developing custom solutions to solve operational inefficiencies for various clients."
                ]
            },
            {
                company: "Dept. of Preventive Medicine, Chonnam National Univ.",
                position: "Researcher & Developer",
                period: "Aug 2022 - Dec 2025",
                description: [
                    "Key Achievement: Optimized examination processes and reduced research workload by 50% through cohort field automation systems.",
                    "Technical Contribution: Shortened reporting period (3 months to 1 month) by automating statistics using Python/VBA."
                ]
            }
        ],
        projects: [
            {
                name: "All-in-One Event SaaS Platform with Custom Form Engine (Supporting 3 Matching Business Models)",
                period: "Jan 2026",
                description: [
                    "Overview: A general-purpose solution for managing Private Parties, Speed Dating, and 1:1 Blind Dates within a single admin interface",
                    "Form Engine: Custom React-based form engine enabling flexible application and profile form customization without Google Forms (Drag & Drop UX, Dynamic Rendering)",
                    "Multi-Business Architecture: Flexible design where logic branches based on business type (Party/Group/1:1 Matching) within a single system",
                    "Seamless UX: Automatic redirection to dedicated Party Program Web App upon QR check-in with instant attendance processing",
                    "RBAC Security: Granular admin permission system (Master/Manager/Staff) using Firebase Authentication",
                    "Smart Automation: 100% automation of deposit verification via Banking API and automated SMS notifications",
                    "Tech Stack: React, TypeScript, Firebase (Auth/DB), Cloudflare R2, Tailwind CSS, Banking API"
                ]
            },
            {
                name: "Epidemiological Survey Integration Solution Easy-Epidemiology",
                period: "Nov 2024 - Jul 2025",
                description: [
                    "Overview: Web-based infection response and automated reporting system for health departments in the Gwangju/Chonnam region.",
                    "Key Features: Automated Case-Control studies (OR calculation), Epidemic Curve generation, and auto-formatting for official reports.",
                    "Tech Stack: Vue.js, React, Tailwind CSS, specialized statistical analysis logic.",
                    "Impact: Innovated the workflow—reducing hours of manual analysis to instant automation upon data entry."
                ]
            },
            {
                name: "Manufacturing (LunaTech) ERP & Automation System",
                period: "Oct 2024",
                description: [
                    "Digital transformation of Quoting-Ordering-Tax Invoice workflows",
                    "Key Tech: AppSheet, Google Apps Script, National Tax Service API Integration",
                    "Impact: Reduced administrative time by 70% with mobile quoting and one-click tax invoice issuance"
                ]
            },
            {
                name: "Real-time Cohort Monitoring & Operations Management System",
                period: "2024. 01 - 2025. 12",
                description: [
                    "Overview: Integrated real-time control system to resolve bottlenecks in high-volume, time-sensitive cohort examination sites.",
                    "Key Features: Real-time field status board via AppSheet-Firebase sync, auto-call for subjects using Google TTS, and intelligent queue matching.",
                    "Technical Evolution: Innovative improvement in reliability and response speed by shifting from Google Sheets-based API to Firebase Realtime communication.",
                    "Philosophy: Solved field problems by establishing operational processes based on user behavior patterns and providing training."
                ]
            }
        ],
        skills: [
            { category: "Specialized", items: "Business Process Automation (BPA), Real-time Systems, E2E Solution Design" },
            { category: "Frontend", items: "React, Vue 3, Next.js, Tailwind CSS, TypeScript" },
            { category: "Backend & DB", items: "Supabase (Real-time), Firebase, PostgreSQL" },
            { category: "Automation", items: "AppSheet, Google Apps Script (GAS), Python (Pandas/Automation)" },
            { category: "Key Experience", items: "Banking API Integration, Tax Invoice Automation, QR Check-in Systems" }
        ]
    }
};

export function Resume() {
    const t = useTranslations("Resume");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const currentData = RESUME_DATA[locale as 'ko' | 'en'] || RESUME_DATA.en;
    const commonData = RESUME_DATA.common;

    const toggleLanguage = () => {
        const nextLocale = locale === 'ko' ? 'en' : 'ko';
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-gray-100">
            {/* Custom Resume Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="w-full px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex items-center gap-2">
                            <InfinityIcon className="w-8 h-8 text-[#333] stroke-[3px]" />
                            <div className="flex items-center">
                                <span className="font-bold text-2xl tracking-tighter text-[#333]">Lindy</span>
                                <span className="w-0 opacity-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-2xl tracking-tighter text-[#333]">
                                    &nbsp;Works
                                </span>
                            </div>
                        </div>
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-gray-100 text-sm font-medium text-gray-600 transition-colors"
                        >
                            <Globe className="w-4 h-4" />
                            <span>{locale === 'ko' ? 'EN' : 'KO'}</span>
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
                        >
                            <Printer className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-10 pb-20 px-8 md:px-12">
                <div className="max-w-3xl mx-auto space-y-12">

                    {/* Personal Info Header Section */}
                    <header className="flex flex-row items-start gap-4 md:gap-8">
                        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            {/* Placeholder for Avatar - Replace 'src' with actual image path or Next.js Image component */}
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center text-gray-400">
                                <span className="text-xs">Avatar</span>
                            </div>
                        </div>

                        <div className="flex-1 text-left flex flex-col justify-center space-y-0.5">
                            <h1 className="text-xl md:text-[2em] font-bold leading-tight md:leading-[1.25em] tracking-tight text-gray-900 mb-0.5">
                                {currentData.name}
                            </h1>
                            <p className="text-sm md:text-[1.25em] leading-snug md:leading-[1.5em] text-gray-600 font-medium">
                                {currentData.role}
                            </p>
                            <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2 text-xs md:text-base text-gray-500 mt-1">
                                <span>{currentData.location}</span>
                                <span className="hidden md:inline text-gray-400">|</span>
                                <a href={`mailto:${commonData.email}`} className="hover:text-black transition-colors">
                                    {commonData.email}
                                </a>
                            </div>
                        </div>
                    </header>

                    {/* About Section */}
                    <section className="space-y-3">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">{t('about')}</h2>
                        <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line">
                            {currentData.about}
                        </p>
                    </section>



                    {/* Education Section */}
                    <section className="space-y-3">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">{t('education')}</h2>
                        <div className="space-y-8">
                            {currentData.education.map((edu, index) => (
                                <div key={index} className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 md:gap-0">
                                    <div>
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900">{edu.school}</h3>
                                        <p className="text-sm md:text-base text-gray-700 font-medium">{edu.major}</p>
                                    </div>
                                    <span className="text-xs md:text-sm text-gray-500 md:text-gray-400 font-mono">{edu.period}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Experience Section */}
                    <section className="space-y-3">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">{t('experience')}</h2>

                        <div className="space-y-12">
                            {currentData.experience.map((exp, index) => (
                                <div key={index} className="group">
                                    <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2 gap-1 md:gap-0">
                                        <div className="flex flex-col md:flex-row md:items-baseline gap-0 md:gap-2 flex-wrap">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900">{exp.company}</h3>
                                            <span className="hidden md:inline text-gray-400">|</span>
                                            <span className="text-sm md:text-base font-medium text-gray-500">{exp.position}</span>
                                        </div>
                                        <span className="text-xs md:text-sm text-gray-500 md:text-gray-400 font-mono whitespace-nowrap">{exp.period}</span>
                                    </div>

                                    <ul className="space-y-2 list-disc list-outside ml-4 text-sm md:text-base text-gray-600 leading-relaxed marker:text-gray-500 mt-4">
                                        {exp.description.map((item, i) => (
                                            <li key={i} className="pl-1">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>



                    {/* Projects Section */}
                    <section className="space-y-3">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">{t('projects')}</h2>
                        <div className="space-y-8">
                            {currentData.projects?.map((project: any, index: number) => (
                                <div key={index} className="group">
                                    <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2 gap-1 md:gap-0">
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900">{project.name}</h3>
                                        <span className="text-xs md:text-sm text-gray-500 md:text-gray-400 font-mono whitespace-nowrap">{project.period}</span>
                                    </div>
                                    <ul className="space-y-2 list-disc list-outside ml-4 text-sm md:text-base text-gray-600 leading-relaxed marker:text-gray-500 mt-2">
                                        {project.description.map((item: string, i: number) => (
                                            <li key={i} className="pl-1">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skills Section */}
                    {/* Skills Section */}
                    <section className="space-y-3">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">{t('skills')}</h2>
                        <div className="space-y-4">
                            {currentData.skills.map((skill: any, index: number) => (
                                <div key={index} className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4">
                                    <div className="font-bold text-gray-900 text-sm md:text-base md:w-32 md:shrink-0">{skill.category}</div>
                                    <div className="text-sm md:text-base text-gray-700 leading-relaxed">
                                        {skill.items}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section className="space-y-3">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">Contact</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">Email</h3>
                                <a href={`mailto:${commonData.email}`} className="text-gray-600 hover:text-black transition-colors flex items-center gap-1">
                                    • {commonData.email} <span className="text-xs">↗</span>
                                </a>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">GitHub</h3>
                                <a href={commonData.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors flex items-center gap-1">
                                    • {commonData.github} <span className="text-xs">↗</span>
                                </a>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">Phone</h3>
                                <p className="text-gray-600">
                                    • {commonData.phone}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Footer / Contact Note */}


                </div>
            </div>
        </div>
    );
}
