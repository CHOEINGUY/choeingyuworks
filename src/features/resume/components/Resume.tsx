"use client";

import { Link, useRouter, usePathname } from "@/navigation";
import { useRef, useState } from "react";
import { Link as ScrollLink } from "react-scroll";

import { useTranslations, useLocale } from "next-intl";
import { Mail, Github, Linkedin, MapPin, Globe, Infinity as InfinityIcon, Printer, Phone, Download } from "lucide-react";

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
        about: "**\"현장의 불편함을 그냥 지나치지 못합니다.\"**\n저는 어려운 기술을 뽐내기보다 '동료가 편해졌는지', '퇴근 시간이 빨라졌는지'를 먼저 생각하는 엔지니어입니다. 전남대 의대 연구원 시절, 3개월 걸리던 업무를 자동화해 1개월로 줄였을 때의 그 쾌감이 제 원동력입니다. 최근에는 파티 운영의 전 과정을 혼자서 자동화하며 시스템이 주는 실질적인 편리함을 다시 한번 확인했습니다.\n\n**\"빠르게 만들고, 꼼꼼하게 검증합니다.\"**\n문법을 하나하나 외우느라 시간을 쓰는 대신, AI 같은 최신 도구를 영리하게 활용해 남들보다 3배 빠르게 결과물을 만듭니다. 그렇게 아낀 시간은 '이 시스템이 현장에서 오류 없이 잘 돌아가는지', '사용자가 쓰는 데 불편함은 없는지'를 한 번 더 체크하는 데 씁니다. 업무 현장을 누구보다 빠르게 편하게 바꾸겠습니다.",
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
                            "업무 효율화: 현장 '예비가구 추가' 절차 병목 해결을 위한 [Chrome Extension 및 Android 웹앱(Android Studio)](https://sites.google.com/view/jnupreventautomation/%ED%99%88) 자체 개발, 전국 200여 담당자에 배포",
                            "데이터 자동화: SAS 데이터 추출 이후, [Python/VBA(분석·시각화) → Python(HWPX 누름틀 삽입)]으로 이어지는 지역사회건강통계집 작성 전 과정을 자동화 (3개월→1개월 단축) 및 전국 단위 업무 보조 도구(Excel Macro) 배포",
                            "프로세스 시스템화: 1년 단위 계약직 교체로 인한 업무 단절 문제를 해결하기 위해, 연간 업무 타임라인 및 단계별 실행 매뉴얼(Protocol)을 구글 시트로 시스템화하여 업무 연속성 확보",
                            "조사 품질 관리(QC): 조사 시간, 이상치 점검 등 실시간 데이터 모니터링 및 조사원 피드백을 통한 결과보고서 작성 및 데이터 정합성 총괄"
                        ]
                    },
                    {
                        title: "남원 코호트 연구 (심뇌혈관질환 R&D)",
                        details: [
                            "현장 시스템 및 환경 구축: AppSheet 기반 '실시간 검진 운영 시스템' 개발 및 검진 현장 동선/구조 세팅 수립",
                            "운영 및 인력 관리(연 200명): 보조 인력 채용 및 직무 교육, 프로그램 현장 교육 전담, 데이터/스캔 파일(Python) 정합성 관리"
                        ]
                    },
                    {
                        title: "해남군 소지역 건강조사",
                        details: [
                            "DX(디지털 전환): 기존 수기 설문을 Google Forms 기반 모바일 조사 시스템으로 전면 전환 및 교육",
                            "GIS 분석: R을 활용한 공간정보(GIS) 시각화 및 사업계획서 기술 지원",
                            "조사 품질 관리: 실시간 데이터 모니터링 및 조사원 피드백(1:1 코칭)을 통한 조사 정확도 유지 관리"
                        ]
                    },

                    {
                        title: "역학조사 통합 분석 솔루션 (Easy-Epidemiology) 개발 및 운영",
                        details: [
                            "솔루션 개발: 기존 수작업 분석 과정을 웹 기반으로 자동화하여 업무 효율성 증대 (상세 내용은 Projects 참조)",
                            "현장 운영: 보건소 담당자 대상 프로그램 사용법 교육 및 매뉴얼 제작·배포",
                            "품질 관리(QC): 현장 피드백을 반영한 UI/UX 개선 및 3단계 기능 검증(QC)을 거쳐 최종 안정화 버전 배포"
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
                    "문제 상황: 사업 모델별로 다른 신청 양식과 운영 로직을 개별 구축해야 하는 개발 비효율 발생",
                    "해결 방안: JSON 엔진 기반의 동적 신청서 구조를 설계하여 코드 수정 없이 신규 사업 모델 즉시 대응",
                    "의사결정: 서비스 확장 시마다 개발자가 투입되는 병목을 해결하기 위해, 개별 페이지 개발 대신 JSON 스키마 기반의 실시간 렌더링 엔진을 구축하여 기획자의 자율성을 높이고 운영 생산성을 극대화함.",
                    "성 과: 입금 확인부터 알림톡 발송까지 전 과정 자동화로 1인 운영 체제 확립 및 휴먼 에러 최소화",
                    "사용 기술: React, TypeScript, Firebase, Cloudflare R2, Tailwind CSS"
                ]
            },
            {
                name: "역학조사 통합 분석 솔루션 (Easy-Epidemiology)",
                period: "2024. 11 - 2025. 07",
                description: [
                    "문제 상황: 보건소 담당자가 환자 대조군 분석 및 유행곡선 생성을 수작업으로 진행하여 발생하는 시간 병목",
                    "해결 방안: 데이터 입력 즉시 통계 로직이 작동하여 분석 결과와 보고서 양식(한글/PDF)을 자동 생성하는 시스템 구축",
                    "의사결정: 외부 SW 의존도를 낮추기 위해 브라우저 기반 경량 통계 알고리즘을 직접 구현하여 현장 호환성 확보",
                    "성 과: 수 시간이 소요되던 분석 및 보고서 작성을 데이터 입력 즉시 완료되도록 개선",
                    "사용 기술: Vue.js, Tailwind CSS, 통계 분석 로직(Custom)"
                ]
            },
            {
                name: "제조업(루나테크) 경량 ERP 시스템",
                period: "2024. 10",
                description: [
                    "문제 상황: 고가 ERP 도입이 어려운 환경에서 발생하는 견적-발주 업무의 수기 입력 및 중복 행정",
                    "해결 방안: 현장에 익숙한 Google Sheets를 DB로 활용하고, AppSheet 기반 모바일 입력 및 국세청 API 연동",
                    "의사결정: 고성능 서버 구축 대신 비용 0원의 실용적 전산화를 목표로 설정하여 즉각적인 현장 도입 유도",
                    "성 과: 모바일 견적 산출 및 세금계산서 원클릭 발행으로 반복적인 수기 입력 업무 제거",
                    "사용 기술: AppSheet, Google Apps Script, 국세청 홈택스 API"
                ]
            },
            {
                name: "실시간 코호트 검진 현장 관제 시스템",
                period: "2024. 01 - 2025. 12",
                description: [
                    "문제 상황: 대규모 검진 현장의 병목 현상 및 대기 시간 관리 부재로 인한 혼선 발생",
                    "해결 방안: AppSheet-Firebase 실시간 연동 및 Google TTS 기반 자동 음성 호명 시스템 구축",
                    "의사결정: Google Sheets의 5초 지연 문제를 해결하기 위해 Firebase Realtime DB를 도입, 반응 속도를 1초 미만으로 개선",
                    "성 과: 실시간 순서 배정 자동화로 검진 대상자 동선 최적화 및 현장 혼선 제거",
                    "사용 기술: AppSheet, Firebase Realtime DB, Google TTS API"
                ]
            }
        ],

        skills: [
            { 
                category: "웹 서비스 구축 및 운영", 
                items: [
                    "React, TypeScript, Tailwind CSS: 사용자 중심의 반응형 웹 UI 설계 및 컴포넌트 기반 개발",
                    "Firebase, Supabase: 실시간 DB 동기화 및 서버리스 백엔드 인프라 구축·운영"
                ]
            },
            { 
                category: "현장 업무 자동화 (BPA)", 
                items: [
                    "AppSheet, Google Apps Script: 실무 요구사항에 맞춘 커스텀 앱 제작 및 반복 업무 자동화",
                    "Python, R (GIS): 대량의 데이터 전처리, 통계 분석 및 공간 정보 시각화 자동화"
                ]
            },
            { 
                category: "외부 시스템 연동 및 효율화", 
                items: [
                    "API 연동: 국세청(홈택스), 금융 API, 알림톡 등 외부 서비스 통합 및 비즈니스 로직 연결",
                    "AI 협업 프로그래밍: LLM(대형언어모델)을 활용한 코드 최적화로 1인 개발 생산성 극대화"
                ]
            }
        ]
    },
    en: {
        name: "In-gyu Choi",
        role: "Business Solution Engineer",
        location: "Gwangsan-gu, Gwangju, South Korea",
        about: "**\"I cannot overlook inefficiencies in the field.\"**\nRather than showing off complex technologies, I am an engineer who thinks first about 'Are my colleagues comfortable?' and 'Did they go home earlier?' During my time as a researcher at Chonnam National University Medical School, the thrill I felt when I reduced a task that involved 3 months of manual work to just 1 month through automation is my driving force. Recently, I automated the entire process of party operations by myself, confirming once again the practical convenience that systems provide.\n\n**\"I build fast and verify meticulously.\"**\nInstead of spending time memorizing every single syntax, I cleverly utilize the latest tools like AI to produce results 3 times faster than others. I use the time saved to check once more 'Does this system work without errors in the field?' and 'Is there any inconvenience for the user?' I am dedicated to transforming the work field faster and more comfortably than anyone else.",
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
                            "Workflow Efficiency: Developed [Chrome Extension and Android WebApp (Android Studio)](https://sites.google.com/view/jnupreventautomation/%ED%99%88) to solve field bottlenecks, deployed to 200+ users nationwide",
                            "Automation: Built a full pipeline (Python/VBA → HWPX) using SAS-extracted data to auto-generate charts and fill Community Health Statistics Yearbook templates, reducing workload from 3 months to 1 month; Deployed nationwide Excel Macro automation tools",
                            "Process Systemization: Built a comprehensive annual timeline and protocol manual on Google Sheets to prevent knowledge loss from staff turnover, ensuring operational continuity",
                            "Quality Control (QC): Real-time data monitoring (survey duration, outlier checks) and investigator feedback management to ensure data consistency and final report integrity"
                        ]
                    },
                    {
                        title: "Namwon Cohort Study (Cardiovascular R&D)",
                        details: [
                            "Field System & Layout: Built 'Real-time Operation System' (AppSheet) and established physical exam site layout/flow",
                            "Operation & Staff Management (200+/yr): Managed support staff hiring/training, conducted on-site system education, and handled data/Python file automation"
                        ]
                    },
                    {
                        title: "Haenam Small Area Health Survey",
                        details: [
                            "DX: Converted manual paper surveys to Google Forms mobile system & provided training",
                            "GIS Analysis: Spatial visualization using R & technical support for business proposals",
                            "Quality Control: Real-time monitoring of survey data & interviewer feedback (1:1 coaching) to maintain survey accuracy"
                        ]
                    },
                    {
                        title: "Easy-Epidemiology Integration Solution",
                        details: [
                            "Development: Automated manual analysis processes via web-based tools (See 'Projects' for details)",
                            "Operation: Conducted user training sessions and distributed operation manuals to health officials",
                            "Quality Control: Implemented UI/UX improvements based on field feedback and completed 3 rounds of QC for stability"
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
                    "Problem: Inefficiency of building separate application forms and logic for each business model",
                    "Solution: Designed a dynamic form structure based on a JSON Engine to respond immediately to new business models without code changes",
                    "Decision: Built a JSON schema-based real-time rendering engine instead of developing individual pages to resolve developer bottlenecks during service expansion, maximizing planner autonomy and operational productivity",
                    "Result: Established a one-person operation system by automating the entire process from deposit verification to notification sending",
                    "Tech Stack: React, TypeScript, Firebase, Cloudflare R2, Tailwind CSS"
                ]
            },
            {
                name: "Easy-Epidemiology Integration Solution",
                period: "Nov 2024 - Jul 2025",
                description: [
                    "Problem: Time bottlenecks caused by manual Case-Control analysis and Epidemic Curve generation by health officials",
                    "Solution: Built a system where statistical logic runs immediately upon data entry, auto-generating results and reports (HWP/PDF)",
                    "Decision: Implemented browser-based lightweight specific statistical algorithms to reduce dependence on external software",
                    "Result: Improved workflow from hours of manual work to instant completion upon data entry",
                    "Tech Stack: Vue.js, Tailwind CSS, Statistical Logic (Custom)"
                ]
            },

            {
                name: "Manufacturing (Lunatech) ERP & Automation System",
                period: "Oct 2024",
                description: [
                    "Problem: Manual entry and duplicate administration in quotation/ordering due to high cost of professional ERPs",
                    "Solution: Used Google Sheets as DB familiar to the field, and AppSheet for mobile entry & Tax API integration",
                    "Decision: Aimed for practical digitization at $0 cost instead of high-performance server construction",
                    "Result: Eliminated repetitive manual data entry via mobile quotation and one-click tax invoice issuance",
                    "Tech Stack: AppSheet, Google Apps Script, National Tax Service API"
                ]
            },
            {
                name: "Real-time Cohort Dashboard & Operation System",
                period: "Jan 2024 - Dec 2025",
                description: [
                    "Problem: Confusion due to bottlenecks and lack of wait time management at large-scale exam sites",
                    "Solution: Built AppSheet-Firebase real-time sync & Google TTS-based auto-calling system",
                    "Decision: Adopted Firebase Realtime DB to solve Google Sheets' 5s+ latency, improving response time to under 1s",
                    "Result: Optimized examinee flow and eliminated field confusion via automated real-time queue assignment",
                    "Tech Stack: AppSheet, Firebase Realtime DB, Google TTS API"
                ]
            }
        ],

        skills: [
            { 
                category: "Web Development & Architecture", 
                items: [
                    "React, TypeScript, Tailwind CSS: Component-based UI design & Responsive Web Implementation",
                    "Firebase, Supabase: Real-time Data Sync, Auth, Serverless Backend Operation"
                ]
            },
            { 
                category: "Business Process Automation (BPA)", 
                items: [
                    "AppSheet, Google Apps Script: Custom App Development & Workflow Automation based on requirements",
                    "Python, R (GIS): Bulk Data Preprocessing, Automated Statistical Analysis & Spatial Visualization"
                ]
            },
            { 
                category: "Integration & Ecosystem", 
                items: [
                    "API Integration: Integrating external services (Tax, Banking, Notification Talk) & connecting business logic",
                    "AI-Assisted Engineering: Code optimization, Test automation & Rapid Prototyping using LLMs"
                ]
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
    const resumeRef = useRef<HTMLDivElement>(null);
    const handlePrint = () => {
        window.print();
    };

    const toggleLanguage = () => {
        const nextLocale = locale === 'ko' ? 'en' : 'ko';
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-gray-100">
            {/* Custom Resume Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 print:hidden">
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
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-gray-100 text-sm font-medium text-gray-600 transition-colors print:hidden"
                        >
                            <Globe className="w-4 h-4" />
                            <span>{locale === 'ko' ? 'EN' : 'KO'}</span>
                        </button>
                        <button
                            onClick={handlePrint}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors print:hidden"
                            title="Save as PDF"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-10 pb-20 px-8 md:px-12 print:p-0 print:pt-4">
                <div ref={resumeRef} className="max-w-3xl mx-auto space-y-12 bg-white p-4 md:p-8 print:p-0 print:max-w-none print:space-y-8">

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
                        <div className="text-gray-700 leading-relaxed text-sm md:text-base space-y-4">
                            {currentData.about.split('\n\n').map((paragraph: string, index: number) => (
                                <p key={index} className="whitespace-pre-line">
                                    {paragraph.split(/(\*\*.*?\*\*)/).map((part, i) => 
                                        part.startsWith('**') && part.endsWith('**') ? (
                                            <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>
                                        ) : (
                                            part
                                        )
                                    )}
                                </p>
                            ))}
                        </div>
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
                                        <ul className="space-y-2 list-disc list-outside ml-4 text-sm md:text-base text-gray-600 leading-relaxed marker:text-gray-500 mt-4 mb-6 break-keep">
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
                                                    <ul className="space-y-1.5 list-none ml-2 text-sm md:text-base text-gray-600 leading-relaxed break-keep">
                                                        {project.details.map((detail: string, dIndex: number) => (
                                                            <li key={dIndex} className="relative pl-4 before:content-['-'] before:absolute before:left-0 before:text-gray-400">
                                                                {detail.split(/(\[.*?\]\(.*?\))/).map((part, i) => {
                                                                    const match = part.match(/\[(.*?)\]\((.*?)\)/);
                                                                    if (match) {
                                                                        return (
                                                                            <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium inline-flex items-center gap-0.5">
                                                                                {match[1]}
                                                                                <span className="text-[10px]">↗</span>
                                                                            </a>
                                                                        );
                                                                    }
                                                                    return part;
                                                                })}
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
                                    <ul className="space-y-2 list-disc list-outside ml-4 text-sm md:text-base text-gray-600 leading-relaxed marker:text-gray-500 mt-2 break-keep">
                                        {project.description.map((item: string, i: number) => {
                                            const parts = item.split(": ");
                                            const title = parts[0];
                                            const content = parts.slice(1).join(": ");
                                            
                                            return (
                                                <li key={i} className="pl-1">
                                                    {content ? (
                                                        <>
                                                            <span className="font-bold text-gray-900">{title}:</span> {content}
                                                        </>
                                                    ) : (
                                                        item
                                                    )}
                                                </li>
                                            );
                                        })}
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
                                    <div className="text-sm md:text-base text-gray-700 leading-relaxed w-full">
                                        <ul className="list-disc list-outside ml-4 space-y-1 marker:text-gray-400 break-keep">
                                            {skill.items.map((item: string, i: number) => (
                                                <li key={i} className="pl-1">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    
                    {/* Closing Section */}
                    {currentData.closing && (
                         <section className="mt-12 mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-center text-gray-700 font-medium text-lg md:text-xl break-keep leading-relaxed whitespace-pre-line">
                                "{currentData.closing}"
                            </p>
                         </section>
                    )}

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
