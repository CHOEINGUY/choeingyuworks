"use client";

import { Link, useRouter, usePathname } from "@/navigation";
import { useRef, useState, useEffect } from "react";
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
        birthYear: "1998년생",
        role: "Business Solution Engineer",
        location: "광주광역시 광산구",
        about: "**비즈니스 흐름을 읽고, 기술로 실질적인 답을 찾습니다.**\n저는 단순히 코드를 짜는 개발자를 넘어, 현장과 소통하고 복잡하게 얽힌 업무 프로세스를 분석하여 최적의 자동화 흐름을 설계하는 '솔루션 빌더'입니다. 어려운 기술을 뽐내기보다 '현장의 병목 현상 해결', '실질적인 운영 비용과 시간 절감'을 최우선으로 고민합니다. 전남대학교 의과대학 연구원 재직 시 3개월이 소요되던 업무를 자동화하여 1개월로 단축했던 성취감은, 사용자의 실제 목소리에 집중하여 현장을 정확히 진단했기에 가능했던 결과였습니다.\n\n**빠르게 구현하고, 꼼꼼하게 검증합니다.**\n특정 언어의 문법에 매몰되기보다 AI와 최신 도구를 영리하게 활용해 구현 속도를 비약적으로 높입니다. 그렇게 확보한 시간은 오로지 '이 시스템이 현장에서 오류 없이 잘 돌아가는지', '사용자가 쓰는 데 불편함은 없는지'를 한 번 더 체크하는 데 투자합니다. 1인 개발로 기획부터 배포까지 전 과정을 책임져 본 경험을 바탕으로, 어느 곳에서든 실질적인 변화를 만들어내는 든든한 일잘러가 되겠습니다.",
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
                    "담당 직무 : 공공 보건 사업(지역사회건강조사 등) 기획 지원 및 현장 운영 실무 전담, 업무 시스템 개발"
                ],
                projects: [
                    {
                        title: "지역사회건강조사 (전남 14개 시·군, 연 1.2만명 규모)",
                        details: [
                            "사업 관리(PM) 및 운영 : 연간 사업 계획 수립 및 예산 집행 관리, 조사원 56명 채용·직무 교육 및 인력 운영 전담",
                            "업무 효율화 : 현장 '예비가구 추가' 절차 병목 해결을 위한 [Chrome Extension 및 Android 기반 전용 웹앱](https://sites.google.com/view/jnupreventautomation/%ED%99%88) 자체 개발, 전국 200여 담당자에 배포",
                            "데이터 분석 자동화 : SAS/Python/VBA를 활용한 통계 분석 및 HWPX 보고서 작성 자동화로 업무 기간 단축 (3개월 → 1개월) 및 전국 단위 배포",
                            "프로세스 시스템화 : 인력 교체 시 업무 단절 방지를 위한 단계별 실행 매뉴얼(Protocol) 구축 및 구글 시트 기반 업무 시스템화",
                            "조사 품질 관리(QC) : 실시간 데이터 모니터링 및 조사원 피드백을 통한 데이터 정합성 검증 및 최종 결과보고서 작성 총괄"
                        ]
                    },
                    {
                        title: "남원 코호트 연구 (심뇌혈관질환 R&D)",
                        details: [
                            "현장 검진 프로세스 효율화 : 수기 기반의 운영 체계를 디지털로 전환하여 실시간 현황 관제 및 자동 호명 시스템 구축, 고질적인 현장 병목 현상을 해결하고 운영 생산성 강화",
                            "검진 현장 최적화 설계 : 한정된 공간 내 다수 검사가 원활히 진행되도록 동선을 재설계하고, 시스템 기반의 순서 배정으로 검진 회차당 소요 시간을 약 15% 이상 단축하여 연구 운영 리소스 확보 및 대상자 만족도 제고",
                            "연구 데이터 품질 관리 : 연간 200명 규모의 보조 인력 직무 교육 전담 및 Python 기반의 데이터 정합성 검증 자동화로 장기 추적 관찰 연구의 핵심인 데이터 신뢰도 확보"
                        ]
                    },
                    {
                        title: "해남군 계곡면 소지역 건강조사",
                        details: [
                            "DX(디지털 전환) : 기존 수기 설문을 Google Forms 기반 모바일 조사 시스템으로 전면 전환 및 교육",
                            "GIS 분석 : R을 활용한 공간정보(GIS) 시각화 및 사업계획서 기술 지원",
                            "조사 품질 관리 : 실시간 데이터 모니터링 및 조사원 피드백(1:1 코칭)을 통한 조사 정확도 유지 관리"
                        ]
                    },

                    {
                        title: "역학조사 통합 분석 솔루션 (Easy-Epidemiology) 개발 및 운영",
                        details: [
                            "개발 : 웹 기반 도구를 통한 수작업 분석 과정 자동화 (상세 내용은 '주요 프로젝트' 참고)",
                            "운영 : 보건소 담당자 대상 사용자 교육 실시 및 운영 매뉴얼 배포",
                            "품질 관리 : 현장 피드백 기반 UI/UX 개선 및 안정성 확보를 위한 3차 QC 완료"
                        ]
                    }
                ]
            },
            {
                company: "개인 프로젝트 및 솔루션 컨설팅",
                position: "솔루션 빌더 (1인 개발 및 운영)",
                period: "2025. 10 - 현재",
                description: [
                    "업무 프로세스 진단 및 컨설팅 : 고객사 인터뷰를 통해 수기 업무의 병목 구간을 파악하고, 이를 디지털로 전환(DX)하기 위한 단계별 자동화 로드맵 제안",
                    "비즈니스 로직 최적화 : 파티/소개팅 등 복잡한 운영 로직을 가진 고객사를 대상으로, 데이터 흐름을 시각화하고 1인 운영이 가능한 형태의 관리 시스템 설계 및 납품",
                    "성    과 : 제조 기업(LunaTech)의 수기 견적 체계를 전자세금계산서 API와 연동된 ERP로 전환하는 등, 기술적 구현을 넘어 실질적인 경영 효율 극대화"
                ]
            }
        ],
        projects: [
            {
                name: "[3가지 사업 모델 (파티/소개팅/1:1) 통합 이벤트 관리 솔루션](/portfolio/party-saas)",
                period: "2026. 01",
                description: [
                    "문제 상황 : 사업 모델별로 다른 신청 양식과 운영 로직을 개별 구축해야 하는 개발 비효율 발생",
                    "해결 방안 : JSON 엔진 기반의 동적 신청서 구조를 설계하여 코드 수정 없이 신규 사업 모델 즉시 대응",
                    "의사결정 : 사업 모델이 추가될 때마다 코딩을 새로 하는 번거로움을 없애기 위해, 기획자가 직접 신청 항목을 설정할 수 있는 유연한 구조를 설계하여 운영 효율 극대화",
                    "성    과 : 입금 확인부터 알림톡 발송까지 전 과정 자동화로 1인 운영 체제 확립 및 휴먼 에러 최소화",
                    "사용 기술 : React, TypeScript, Firebase, Cloudflare R2, Tailwind CSS"
                ]
            },
            {
                name: "[역학조사 통합 분석 솔루션 (Easy-Epidemiology)](/portfolio/easy-epidemiology)",
                period: "2024. 11 - 2025. 07",
                description: [
                    "문제 상황 : 보건소 담당자가 환자 대조군 분석 및 유행곡선 생성을 수작업으로 진행하여 발생하는 시간 병목",
                    "해결 방안 : 데이터 입력 즉시 통계 로직이 작동하여 분석 결과와 보고서 양식(한글/PDF)을 자동 생성하는 시스템 구축",
                    "의사결정 : 외부 SW 의존도를 낮추기 위해 브라우저 기반 경량 통계 알고리즘을 직접 구현하여 현장 호환성 확보",
                    "성    과 : 수 시간이 소요되던 분석 및 보고서 작성을 데이터 입력 즉시 완료되도록 개선",
                    "사용 기술 : Vue.js, Tailwind CSS, ECharts, 통계 분석 로직(Custom)"
                ]
            },
            {
                name: "[실시간 코호트 검진 현장 관제 시스템](/portfolio/cohort-dashboard)",
                period: "2024. 01 - 2025. 12",
                description: [
                    "문제 상황 : 검진 현장의 병목 현상 및 대기 시간 관리 부재로 인한 혼선 발생",
                    "해결 방안 : AppSheet-Firebase 실시간 연동 및 Google TTS 기반 자동 음성 호명 시스템 구축",
                    "의사결정 : Google Sheets의 5초 지연 문제를 해결하기 위해 Firebase Realtime DB를 도입, 반응 속도를 1초 미만으로 개선",
                    "성    과 : 실시간 순서 배정 자동화로 검진 대상자 동선 최적화 및 현장 혼선 제거",
                    "사용 기술 : AppSheet, Google Apps Script, Firebase Realtime DB, Google TTS API"
                ]
            },
            {
                name: "제조업(루나테크) 경량 ERP 및 업무 자동화 시스템",
                period: "2024. 10 - 현재",
                description: [
                    "문제 상황 : 견적-발주-세금계산서 업무의 수기 관리 및 데이터 파편화로 인한 중복 행정 발생",
                    "해결 방안 : 세금계산서 자동 발행(Flask/Cloud Run)과 고품질 PDF 견적 엔진(Next.js)을 결합한 통합 업무 자동화 환경 구축",
                    "의사결정 : 사용자가 이미 익숙한 Google Sheets 환경은 유지하면서, 세금계산서 및 PDF 발행 등 기술적 구현이 필요한 구간만 클라우드 기술로 정밀하게 연결하여 현장 도입 장벽 최소화",
                    "성    과 : 파편화되어 있던 견적 산출, PDF 발행, 세금계산서 전송 과정을 '원클릭'으로 통합하여 수기 행정 업무 및 데이터 중복 입력 원천 제거",
                    "사용 기술 : Next.js, Python(Flask), Google Cloud Run, AppSheet, 전자세금계산서 API"
                ]
            }
        ],

        skills: [
            { 
                category: "웹 서비스 및 프론트엔드", 
                items: [
                    "Next.js, React, Vue.js, TypeScript : 비즈니스 목적에 최적화된 프레임워크 선택 및 사용자 중심 UI/UX 구현",
                    "Firebase, Supabase : 실시간 데이터 연동 및 서버리스 인프라를 활용한 빠른 서비스 배포·운영"
                ]
            },
            { 
                category: "비즈니스 업무 자동화 (BPA)", 
                items: [
                    "AppSheet, Google Apps Script : 현장 수기 업무를 진단하고 앱 기반 시스템으로 디지털 전환(DX) 설계",
                    "Python(Flask), Google Cloud Run : 복잡한 비즈니스 로직 처리를 위한 커스텀 서버 구축 및 백엔드 통합"
                ]
            },
            { 
                category: "시스템 통합 및 데이터 분석", 
                items: [
                    "API 연동 : 전자세금계산서, 결제, 알림 서비스 등 외부 API를 비즈니스 흐름에 맞게 유연하게 통합",
                    "SAS, Python, R : 데이터 전처리, 통계 분석 및 업무용 보고서 생성 프로세스 자동화"
                ]
            }
        ]
    },
    en: {
        name: "In-gyu Choi",
        role: "Business Solution Engineer",
        location: "Gwangsan-gu, Gwangju, South Korea",
        about: "**Reading business flows and providing practical technological solutions.**\nI am more than just a developer who writes code; I am a 'Solution Builder' who communicates with the field and analyzes complex work processes to design optimal automation flows. My priority is not showcasing difficult technologies, but rather 'solving field bottlenecks' and 'achieving tangible reductions in costs and time.' The sense of accomplishment I felt when I reduced a 3-month task to just 1 month at Chonnam National University Medical School was a result of focusing on the actual voices of users and accurately diagnosing the field.\n\n**Fast implementation, meticulous verification.**\nInstead of getting bogged down in the syntax of a specific language, I leverage AI and modern tools to significantly accelerate implementation. I invest the time saved into ensuring the system runs flawlessly in the field and that users have no discomfort in using it. Based on my experience handling the entire process from planning to deployment as a solo developer, I will be a dependable professional who creates substantial change in any environment.",
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
                    "Role : Planning support & field operation management for public health projects, Business system development"
                ],
                projects: [
                    {
                        title: "Community Health Survey (14 cities/counties in Jeonnam, 12k people/year)",
                        details: [
                            "PM & Operation : Supported annual planning and budget management, handled hiring/training/managing 56 survey personnel",
                            "Workflow Efficiency : Self-developed [Chrome Extension and Android-based Dedicated WebApp](https://sites.google.com/view/jnupreventautomation/%ED%99%88) to solve field bottlenecks, deployed to 200+ users nationwide",
                            "Data Analysis Automation : Automated statistical analysis and HWPX report generation using SAS/Python/VBA, reducing task duration from 3 months to 1 month, deployed nationwide",
                            "Process Systematization : Established step-by-step manuals (Protocol) and Google Sheets-based systems to prevent work discontinuity during personnel turnover",
                            "Quality Control (QC) : Oversaw data consistency and final report generation via real-time data monitoring and surveyor feedback"
                        ]
                    },
                    {
                        title: "Namwon Cohort Study (Cardiovascular R&D)",
                        details: [
                            "Field Exam Process Efficiency : Converted manual operating systems to digital to establish real-time status monitoring and automated calling systems, resolving chronic field bottlenecks and enhancing operational productivity",
                            "Exam Site Optimization Design : Redesigned flows for smooth multi-exam progress within limited space and reduced time per exam session by over 15% through system-based queue assignment, securing research resources and enhancing participant satisfaction",
                            "Research Data Quality Control : Managed job training for 200+ annual support staff and ensured data reliability—crucial for longitudinal studies—via Python-based automated data consistency verification"
                        ]
                    },
                    {
                        title: "Haenam Gyegok-myeon Small Area Health Survey",
                        details: [
                            "DX : Converted manual paper surveys to Google Forms mobile system & provided training",
                            "GIS Analysis : Spatial visualization using R & technical support for business proposals",
                            "Quality Control : Real-time monitoring of survey data & interviewer feedback (1:1 coaching) to maintain survey accuracy"
                        ]
                    },
                    {
                        title: "Easy-Epidemiology Integration Solution",
                        details: [
                            "Development : Automated manual analysis processes via web-based tools (See 'Projects' for details)",
                            "Operation : Conducted user training sessions and distributed operation manuals to health officials",
                            "Quality Control : Implemented UI/UX improvements based on field feedback and completed 3 rounds of QC for stability"
                        ]
                    }
                ]
            },
            {
                company: "Personal Projects & Solution Consulting",
                position: "Solution Builder (Solo Dev & Ops)",
                period: "Oct 2025 - Present",
                description: [
                    "Work Process Diagnosis & Consulting : Identifying manual task bottlenecks through client interviews and suggesting step-by-step automation roadmaps for Digital Transformation (DX)",
                    "Business Logic Optimization : Visualizing data flows for clients with complex logic (parties/speed dating) and designing/delivering management systems for one-person operation",
                    "Result : Maximized management efficiency beyond technical implementation, such as converting LunaTech's manual quotation system into an ERP integrated with Electronic Invoicing APIs"
                ]
            }
        ],
        projects: [
            {
                name: "[All-in-One Event SaaS Platform (Party/Speed Dating/1:1)](/portfolio/party-saas)",
                period: "Jan 2026",
                description: [
                    "Problem : Inefficiency of building separate application forms and logic for each business model",
                    "Solution : Designed a dynamic form structure based on a JSON Engine to respond immediately to new business models without code changes",
                    "Decision : To eliminate the hassle of new coding every time a business model is added, I designed a flexible structure where planners can configure application fields directly, maximizing operational efficiency",
                    "Result : Established a one-person operation system by automating the entire process from deposit verification to notification sending",
                    "Tech Stack : React, TypeScript, Firebase, Cloudflare R2, Tailwind CSS"
                ]
            },
            {
                name: "[Easy-Epidemiology Integration Solution](/portfolio/easy-epidemiology)",
                period: "Nov 2024 - Jul 2025",
                description: [
                    "Problem : Time bottlenecks caused by manual Case-Control analysis and Epidemic Curve generation by health officials",
                    "Solution : Built a system where statistical logic runs immediately upon data entry, auto-generating results and reports (HWP/PDF)",
                    "Decision : Implemented browser-based lightweight specific statistical algorithms to reduce dependence on external software",
                    "Result : Improved workflow from hours of manual work to instant completion upon data entry",
                    "Tech Stack : Vue.js, Tailwind CSS, ECharts, Statistical Logic (Custom)"
                ]
            },
            {
                name: "[Real-time Cohort Dashboard & Operation System](/portfolio/cohort-dashboard)",
                period: "Jan 2024 - Dec 2025",
                description: [
                    "Problem : Confusion due to bottlenecks and lack of wait time management at exam sites",
                    "Solution : Built AppSheet-Firebase real-time sync & Google TTS-based auto-calling system",
                    "Decision : Adopted Firebase Realtime DB to solve Google Sheets' 5s+ latency, improving response time to under 1s",
                    "Result : Optimized examinee flow and eliminated field confusion via automated real-time queue assignment",
                    "Tech Stack : AppSheet, Google Apps Script, Firebase Realtime DB, Google TTS API"
                ]
            },
            {
                name: "Manufacturing (Lunatech) ERP & Automation System",
                period: "Oct 2024 - Present",
                description: [
                    "Problem : Administrative overhead and data fragmentation due to manual quotation, ordering, and invoicing processes",
                    "Solution : Developed a unified automation pipeline integrating automated tax invoicing (Flask/Cloud Run) and a custom PDF quotation engine (Next.js)",
                    "Decision : Minimized adoption barriers by maintaining the client's familiar Google Sheets environment while precisely integrating cloud technology only where technical implementation was needed (Invoicing, PDF)",
                    "Result : Eliminated manual administrative work and redundant data entry by integrating fragmented quoting, PDF issuance, and invoicing processes into a 'one-click' workflow",
                    "Tech Stack : Next.js, Python(Flask), Google Cloud Run, AppSheet, Electronic Invoicing API"
                ]
            }
        ],

        skills: [
            {
                category: "Web & Frontend Engineering",
                items: [
                    "Next.js, React, Vue.js, TypeScript : Building high-performance services and implementing user-centric interactive UI/UX",
                    "Firebase, Supabase : Rapid service deployment and operation based on real-time data and serverless infra"
                ]
            },
            {
                category: "Business Process Automation (BPA)",
                items: [
                    "AppSheet, Google Apps Script : Diagnosing manual workflows and designing DX via app-based systems",
                    "Python(Flask), Google Cloud Run : Building custom backend servers and system integration for business logic"
                ]
            },
            {
                category: "Integration & Data Analysis",
                items: [
                    "API Integration : Flexible integration of external services (Invoicing, Payments, Notifications) into business flows",
                    "SAS, Python, R : Automating data preprocessing, statistical analysis, and business report generation"
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
    const [today, setToday] = useState("");

    useEffect(() => {
        const date = new Date();
        setToday(`${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const toggleLanguage = () => {
        const nextLocale = locale === 'ko' ? 'en' : 'ko';
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <div className="min-h-screen bg-white print:bg-white font-sans text-gray-900 selection:bg-gray-100">
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
                <div ref={resumeRef} className="max-w-4xl mx-auto space-y-12 bg-white p-4 md:p-12 print:p-0 print:max-w-none print:space-y-8">

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
                                {(currentData as any).birthYear && (
                                    <>
                                        <span className="hidden md:inline text-gray-400">|</span>
                                        <span>{(currentData as any).birthYear}</span>
                                    </>
                                )}
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
                                        <ul className="space-y-2 list-disc list-outside ml-4 text-sm md:text-base text-gray-600 leading-relaxed marker:text-gray-400 mt-4 mb-6 break-keep">
                                            {exp.description.map((item: string, i: number) => {
                                                const parts = item.split(" : ");
                                                const title = parts[0];
                                                const content = parts.slice(1).join(" : ");
                                                
                                                return (
                                                    <li key={i} className="pl-1">
                                                        {content ? (
                                                            <>
                                                                <span className="text-gray-900">{title} :</span> {content}
                                                            </>
                                                        ) : (
                                                            item
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}

                                    {/* Sub Projects (Job Areas) */}
                                    {exp.projects && (
                                        <div className="space-y-6 mt-4 pl-1 md:pl-4 border-l-2 border-gray-100">
                                            {exp.projects.map((project: any, pIndex: number) => (
                                                    <div key={pIndex}>
                                                    <div className="flex items-baseline justify-between gap-2 mb-2">
                                                        <h4 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
                                                            <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                                            {project.title}
                                                        </h4>
                                                        {project.period && (
                                                            <span className="text-xs md:text-sm text-gray-400 font-mono whitespace-nowrap">{project.period}</span>
                                                        )}
                                                    </div>
                                                    <ul className="space-y-1.5 list-none ml-2 text-sm md:text-base text-gray-600 leading-relaxed break-keep">
                                                        {project.details.map((detail: string, dIndex: number) => {
                                                            const parts = detail.split(" : ");
                                                            const title = parts[0];
                                                            const content = parts.slice(1).join(" : ");

                                                            const renderDetail = (text: string) => {
                                                                return text.split(/(\[[^\]]+\]\([^)]+\))/).map((part, i) => {
                                                                    const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
                                                                    if (match) {
                                                                        const isInternal = match[2].startsWith('/');
                                                                        if (isInternal) {
                                                                            return (
                                                                                <Link key={i} href={match[2] as any} className="text-gray-700 hover:text-blue-600 transition-colors font-medium inline">
                                                                                    {match[1]}
                                                                                    <span className="text-[10px] relative -top-[1.5px] opacity-70 whitespace-nowrap">{"\u00A0"}↗</span>
                                                                                </Link>
                                                                            );
                                                                        }
                                                                        return (
                                                                            <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors font-medium inline">
                                                                                {match[1]}
                                                                                <span className="text-[10px] relative -top-[1.5px] opacity-70 whitespace-nowrap">{"\u00A0"}↗</span>
                                                                            </a>
                                                                        );
                                                                    }
                                                                    return part;
                                                                });
                                                            };

                                                            return (
                                                                <li key={dIndex} className="relative pl-4 before:content-['-'] before:absolute before:left-0 before:text-gray-400">
                                                                    {content ? (
                                                                        <>
                                                                            <span className="text-gray-900">{title} :</span> {renderDetail(content)}
                                                                        </>
                                                                    ) : (
                                                                        renderDetail(detail)
                                                                    )}
                                                                </li>
                                                            );
                                                        })}
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
                                        <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                            {project.name.split(/(\[.+?\]\(\/portfolio\/.+?\))/).map((part: string, i: number) => {
                                                const match = part.match(/\[(.+?)\]\((.+?)\)/);
                                                if (match) {
                                                    const isInternal = match[2].startsWith('/');
                                                    if (isInternal) {
                                                        return (
                                                                <Link key={i} href={match[2] as any} className="text-gray-900 hover:text-blue-600 transition-colors inline">
                                                                    {match[1].split(/(\(.+?\))/).map((subPart, j) => 
                                                                        subPart.startsWith('(') && subPart.endsWith(')') ? (
                                                                            <span key={j} className="relative -top-[0.5px]">{subPart}</span>
                                                                        ) : subPart
                                                                    )}
                                                                    <span className="text-xs relative -top-[2px] opacity-70 whitespace-nowrap">{"\u00A0"}↗</span>
                                                                </Link>
                                                        );
                                                    }
                                                    return (
                                                        <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-blue-600 transition-colors inline">
                                                            {match[1].split(/(\(.+?\))/).map((subPart, j) => 
                                                                subPart.startsWith('(') && subPart.endsWith(')') ? (
                                                                    <span key={j} className="relative -top-[0.5px]">{subPart}</span>
                                                                ) : subPart
                                                            )}
                                                            <span className="text-xs relative -top-[2px] opacity-70 whitespace-nowrap">{"\u00A0"}↗</span>
                                                        </a>
                                                    );
                                                }
                                                return part;
                                            })}
                                        </h3>
                                        <span className="text-xs md:text-sm text-gray-500 md:text-gray-400 font-mono whitespace-nowrap">{project.period}</span>
                                    </div>
                                    <ul className="space-y-2 list-disc list-outside ml-4 text-sm md:text-base text-gray-600 leading-relaxed marker:text-gray-400 mt-2 break-keep">
                                        {project.description.map((item: string, i: number) => {
                                            const parts = item.split(" : ");
                                            const title = parts[0];
                                            const content = parts.slice(1).join(" : ");
                                            
                                            return (
                                                <li key={i} className="pl-1">
                                                    {content ? (
                                                        <>
                                                            <span className="text-gray-900">{title} :</span> {content}
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
                
                {/* Print Only Date (Last Page) */}
                <div className="hidden print:flex w-full justify-center mt-12 mb-8 text-sm text-black font-medium">
                    <span>{today}</span>
                </div>
            </div>
        </div>
    );
}
