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
        role: "Business Solution Engineer",
        location: "광주광역시 광산구",
        about: "현장의 비효율을 참지 못하는, 실용주의 엔지니어입니다.\n복잡한 기술 과시보다는 '사용자가 편한가?', '업무가 빨라졌는가?'를 최우선으로 고민합니다. 전남대학교 의과대학 연구원 재직 시 3개월이 소요되던 업무를 자동화하여 1개월로 단축시켰고, 최근에는 1인 개발로 파티 운영의 전 과정을 자동화한 시스템을 구축했습니다.\n\n[업무 스타일: 현장 중심의 빠른 구현]\n새로운 언어 문법을 익히느라 시간을 쏟기보다, 이미 검증된 도구와 AI를 활용해 '지금 당장 작동하는 결과물'을 만드는 데 집중합니다. 개발 그 자체보다는 비즈니스 로직의 빈틈을 메우고, 사용자가 겪을 시행착오를 줄이는 시스템 설계에 핵심 역량을 투입합니다.",
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
                company: "전남대학교 의과대학 예방의학교실",
                position: "연구원 (공공 보건 사업 PM 및 시스템 개발)",
                period: "2022. 08 - 2025. 12 (3년 4개월)",
                description: [
                    "담당 직무: 공공 보건 사업(지역사회건강조사 등) 기획 지원 및 현장 운영 실무 전담, 업무 시스템 개발"
                ],
                projects: [
                    {
                        title: "지역사회건강조사 (전남 14개 시·군, 연 1.2만명 규모)",
                        details: [
                            "사업 관리(PM): 연간 사업계획 수립 지원 및 예산 집행 관리, 조사원 56명 채용/교육/인력 운영 전담",
                            "업무 효율화: 현장 '예비가구 추가' 절차 병목 해결을 위한 Chrome Extension 자체 개발 및 전국 200여 담당자에 배포",
                            "데이터 자동화: Python/VBA/SAS 활용 통계 분석 자동화(3개월→1개월 단축) 및 전국 단위 업무 보조 도구(VBA) 배포"
                        ]
                    },
                    {
                        title: "남원 코호트 연구 (심뇌혈관질환 R&D)",
                        details: [
                            "현장 시스템 구축: AppSheet/Firebase 기반 '실시간 검진 운영 시스템' 기획 및 개발 (대기시간 단축 및 동선 최적화)",
                            "운영 관리: 검진 대상자 예약 관리 및 검진 데이터 정합성 검증 프로세스 정립"
                        ]
                    },
                    {
                        title: "해남군 소지역 건강조사",
                        details: [
                            "DX(디지털 전환): 기존 수기 설문을 Google Forms 기반 모바일 조사 시스템으로 전면 전환 및 교육",
                            "GIS 분석: R을 활용한 공간정보(GIS) 시각화 및 사업계획서 기술 지원"
                        ]
                    }
                ]
            },
            {
                company: "개인 프로젝트 및 솔루션 컨설팅",
                position: "솔루션 빌더 (1인 개발 및 운영)",
                period: "2025. 10 - 현재",
                description: [
                    "기업 및 소상공인의 운영 비효율을 해결하는 맞춤형 DX(Digital Transformation) 솔루션 공급",
                    "주요 성과: 복합 이벤트 운영사 통합 관리 시스템 납품, 제조 기업(LunaTech) 경량형 ERP 구축"
                ]
            }
        ],
        projects: [
            {
                name: "3가지 사업 모델(파티/소개팅/1:1) 통합 이벤트 관리 솔루션",
                period: "2026. 01",
                description: [
                    "문제 해결: 단일 아이템만 지원하던 기존 솔루션을 개선하여, 3가지 비즈니스(파티, 단체 미팅, 1:1)를 하나의 시스템에서 통합 운영",
                    "신청서 시스템 설계: 3가지 사업 모델을 모두 수용할 수 있도록 유연한 신청서 관리 구조 도입(JSON 엔진 활용)",
                    "운영 업무 자동화: 입금 확인부터 안내 문자 발송까지, 휴먼 에러를 제거하는 자동화 프로세스 구축",
                    "현장 동선 최적화: 현장 병목을 제거하는 QR 체크인 및 웹앱 자동 연동 프로세스 설계",
                    "보안 및 권한 설계: 운영자가 실수로 데이터를 망가뜨리지 않도록 사용자별 권한 관리(Master/Staff) 및 안전장치 마련",
                    "Tech Stack: React, TypeScript, Firebase, Cloudflare R2, Tailwind CSS"
                ]
            },
            {
                name: "집단발생 및 역학조사 통합 분석 솔루션 Easy-Epidemiology",
                period: "2024. 11 - 2025. 07",
                description: [
                    "개요: 광주·전남 지역 보건소 담당자를 위한 웹 기반 감염병 대응 및 보고서 자동화 시스템",
                    "주요 기능: 감염원 추정을 위한 환자-대조군 연구(OR 계산) 및 유행곡선(Epidemic Curve) 자동 생성, 보고서 양식(한글/PDF) 제안",
                    "기술 스택: Vue.js, React, Tailwind CSS, 통계 분석 로직",
                    "성과: 수작업으로 수 시간이 소요되던 역학 분석 및 보고서 작성을 데이터 입력 즉시 완료되도록 개선"
                ]
            },
            {
                name: "제조업(루나테크) ERP 및 업무 자동화 시스템",
                period: "2024. 10",
                description: [
                    "문제 해결: 전문적인 ERP 도입은 비용 부담이 컸던 현장 상황을 고려하여, 익숙한 Google Sheets를 DB로 쓰되 AppSheet를 인터페이스로 활용",
                    "현실적 타협: 데이터 처리 속도의 한계는 존재하나, AppSheet-Google Apps Script 연동 최적화로 타협하여 0원의 비용으로 사무 행정 시간 70% 단축이라는 실리를 챙김",
                    "Key Tech: AppSheet, Google Apps Script, 국세청 홈택스 API 연동"
                ]
            },
            {
                name: "실시간 코호트 검진 현장 대시보드 및 운영 관리 시스템",
                period: "2024. 01 - 2025. 12",
                description: [
                    "개요: 한정된 시간 내 다수 검사가 이루어지는 코호트 검진 현장의 병목 현상을 해결하기 위한 실시간 통합 관제 시스템",
                    "핵심 기능: AppSheet와 Firebase 연동을 통한 실시간 현황 현장 중계, Google TTS 기반 음성 호명 및 지능형 순서 배정 자동화",
                    "기술적 의사결정: 초기에는 관리 편의성을 위해 Google Sheets만 썼으나, 대기 현황 업데이트가 5초 이상 지연되는 병목 발생. 현장 반응 속도를 위해 데이터 싱크 복잡도를 감수하고 Firebase Realtime DB를 도입하여 지연 시간을 1초 미만으로 단축.",
                    "철학: 기술적 완성도를 넘어 사용자의 행동 패턴을 고려한 운영 프로세스 정립 및 사용자 교육을 통한 현장 문제 해결"
                ]
            }
        ],
        skills: [
            { 
                category: "웹 서비스 구축 및 운영", 
                items: "React, TypeScript, Tailwind CSS: 컴포넌트 기반의 UI 설계 및 사용자 중심의 반응형 웹 구현\nFirebase, Supabase: 실시간 데이터 동기화, 사용자 인증, 서버리스 환경의 백엔드 구축" 
            },
            { 
                category: "현장 업무 자동화 (BPA)", 
                items: "AppSheet, Google Apps Script: 요구사항에 맞춘 커스텀 앱 개발 및 반복 업무 워크플로우 자동화\nPython, R (GIS): 대량의 데이터 전처리, 통계 분석 자동화 및 공간 정보 시각화" 
            },
            { 
                category: "외부 시스템 연동 및 효율화", 
                items: "API 연동: 국세청(홈택스), 금융 API, 알림톡 등 외부 서비스 통합 및 비즈니스 로직 연결\nAI 협업 프로그래밍: LLM을 활용한 코드 최적화 및 테스트 자동화로 1인 개발 생산성 극대화" 
            }
        ]
    },
    en: {
        name: "In-gyu Choi",
        role: "Business Solution Engineer",
        location: "Gwangsan-gu, Gwangju, South Korea",
        about: "I am a pragmatic engineer who cannot stand field inefficiencies.\nRather than boasting about complex technologies, I prioritize two questions: 'Is it easy for the user?' and 'Has the work become faster?' During my time as a researcher at Chonnam National University Medical School, I reduced a 3-month workload to 1 month through automation. Most recently, I developed a solo-built automated system for entire party operations.\n\n[Work Style: Field-Centric Rapid Implementation]\nInstead of spending time memorizing new syntax, I focus on creating 'working results right now' using proven tools and AI. I concentrate my core competencies on filling gaps in business logic and designing systems that reduce user trial-and-error, rather than development itself.",
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
                company: "Dept. of Preventive Medicine, Chonnam National Univ.",
                position: "Researcher (Public Health Project PM & System Developer)",
                period: "Aug 2022 - Dec 2025 (3 yrs 4 mos)",
                description: [
                    "Role: Planning support & field operation management for public health projects, Business system development"
                ],
                projects: [
                    {
                        title: "Community Health Survey (14 cities/counties in Jeonnam, 12k people/year)",
                        details: [
                            "PM: Annual plan support, budget management, hiring/training/managing 56 surveyors",
                            "Workflow Efficiency: Developed Chrome Extension to solve field bottlenecks, deployed to 200+ users nationwide",
                            "Automation: Reduced analysis time (3 months → 1 month) via Python/VBA/SAS; Deployed nationwide VBA automation tools"
                        ]
                    },
                    {
                        title: "Namwon Cohort Study (Cardiovascular R&D)",
                        details: [
                            "Field System: Built 'Real-time Exam Operation System' (AppSheet/Firebase) - Reduced waiting time & optimized flow",
                            "Operation: Established reservation management & data integrity verification processes"
                        ]
                    },
                    {
                        title: "Haenam Small Area Health Survey",
                        details: [
                            "DX: Converted manual paper surveys to Google Forms mobile system & provided training",
                            "GIS Analysis: Spatial visualization using R & technical support for business proposals"
                        ]
                    }
                ]
            },
            {
                company: "Personal Projects & Solution Consulting",
                position: "Solution Builder (Solo Dev & Ops)",
                period: "Oct 2025 - Present",
                description: [
                    "Providing custom DX (Digital Transformation) solutions to resolve operational inefficiencies for businesses.",
                    "Key Deliverables: Integrated Management System for Event Operators, Lightweight ERP for Manufacturing (LunaTech)."
                ]
            }
        ],
        projects: [
            {
                name: "All-in-One Event SaaS Platform (Party/Speed Dating/1:1)",
                period: "Jan 2026",
                description: [
                    "Problem Solving: Resolved single-item solution limitations by integrating 3 business models (Party, Group Meeting, 1:1) into one system",
                    "Form Engine Architecture: Adopted flexible form structure (JSON Engine) to handle 3 distinct business models",
                    "Operation Automation: Established automated workflow from deposit verification to SMS notification, eliminating human error",
                    "Field Flow Optimization: QR check-in & web app auto-sync design to remove field bottlenecks",
                    "Security & Permission: Implemented user permission management (Master/Staff) to prevent accidental data modification by operators",
                    "Tech Stack: React, TypeScript, Firebase, Cloudflare R2, Tailwind CSS"
                ]
            },
            {
                name: "Easy-Epidemiology Integration Solution",
                period: "Nov 2024 - Jul 2025",
                description: [
                    "Overview: Web-based infection response & automated reporting system for local health departments",
                    "Key Features: Automated Case-Control studies (OR calculation), Epidemic Curve generation, Report format mirroring",
                    "Tech Stack: Vue.js, React, Tailwind CSS, Statistical Logic",
                    "Impact: Improved workflow from hours of manual work to instant completion upon data entry"
                ]
            },
            {
                name: "Manufacturing (Lunatech) ERP & Automation System",
                period: "Oct 2024",
                description: [
                    "Problem Solving: Addressed cost burden of professional ERPs by using Google Sheets as DB and AppSheet as Interface",
                    "Pragmatic Trade-off: Accepted speed limitations but secured 70% admin time reduction at $0 cost via AppSheet-GAS optimization",
                    "Key Tech: AppSheet, Google Apps Script, National Tax Service API"
                ]
            },
            {
                name: "Real-time Cohort Dashboard & Operation System",
                period: "Jan 2024 - Dec 2025",
                description: [
                    "Overview: Real-time control system to resolve bottlenecks in time-critical cohort exam sites",
                    "Key Features: Real-time field relay via AppSheet-Firebase, Google TTS auto-calling, Intelligent queue assignment",
                    "Technical Decision: Initially used Google Sheets but hit 5s+ latency bottlenecks. Migrated to Firebase Realtime DB despite complexity to achieve sub-1s latency for field responsiveness.",
                    "Philosophy: Solved field problems via process design based on user behavior patterns beyond just code"
                ]
            }
        ],
        skills: [
            { 
                category: "Web Development & Architecture", 
                items: "React, TypeScript, Tailwind CSS: Component-based UI design & Responsive Web Implementation\nFirebase, Supabase: Real-time Data Sync, Auth, Serverless Backend Operation" 
            },
            { 
                category: "Business Process Automation (BPA)", 
                items: "AppSheet, Google Apps Script: Custom App Development & Workflow Automation based on requirements\nPython, R (GIS): Bulk Data Preprocessing, Automated Statistical Analysis & Spatial Visualization" 
            },
            { 
                category: "Integration & Ecosystem", 
                items: "API Integration: Integrating external services (Tax, Banking, Notification Talk) & connecting business logic\nAI-Assisted Engineering: Code optimization, Test automation & Rapid Prototyping using LLMs" 
            }
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
                                <span className="font-bold text-2xl tracking-tighter text-[#333]">Choeingyu</span>
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
                            {currentData.experience.map((exp: any, index: number) => (
                                <div key={index} className="group">
                                    <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2 gap-1 md:gap-0">
                                        <div className="flex flex-col md:flex-row md:items-baseline gap-0 md:gap-2 flex-wrap">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900">{exp.company}</h3>
                                            <span className="hidden md:inline text-gray-400">|</span>
                                            <span className="text-sm md:text-base font-medium text-gray-500">{exp.position}</span>
                                        </div>
                                        <span className="text-xs md:text-sm text-gray-500 md:text-gray-400 font-mono whitespace-nowrap">{exp.period}</span>
                                    </div>

                                    {/* Main Description */}
                                    {exp.description && exp.description.length > 0 && (
                                        <ul className="space-y-2 list-disc list-outside ml-4 text-sm md:text-base text-gray-600 leading-relaxed marker:text-gray-500 mt-4 mb-6">
                                            {exp.description.map((item: string, i: number) => (
                                                <li key={i} className="pl-1">{item}</li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Sub Projects (Job Areas) */}
                                    {exp.projects && (
                                        <div className="space-y-6 mt-4 pl-1 md:pl-4 border-l-2 border-gray-100">
                                            {exp.projects.map((project: any, pIndex: number) => (
                                                <div key={pIndex}>
                                                    <h4 className="font-bold text-gray-800 text-sm md:text-base mb-2 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                        {project.title}
                                                    </h4>
                                                    <ul className="space-y-1.5 list-none ml-2 text-sm md:text-base text-gray-600 leading-relaxed">
                                                        {project.details.map((detail: string, dIndex: number) => (
                                                            <li key={dIndex} className="relative pl-4 before:content-['-'] before:absolute before:left-0 before:text-gray-400">
                                                                {detail}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                                    <div className="font-bold text-gray-900 text-sm md:text-base md:w-32 md:shrink-0 break-keep">{skill.category}</div>
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
