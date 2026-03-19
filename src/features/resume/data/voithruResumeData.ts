import { RESUME_DATA_V2 } from "./resumeData";

// Voithru 지원용 이력서 데이터
// 기본은 RESUME_DATA_V2와 동일, Voithru에 맞게 커스터마이징
export const VOITHRU_RESUME_DATA = {
    ...RESUME_DATA_V2,
    ko: {
        ...RESUME_DATA_V2.ko,

        // ===== 기본 인적 사항 (상세) =====
        birthDate: "1998년 07월 07일",
        veteranStatus: "비대상",
        disabilityStatus: "해당 없음",

        // ===== 병역 사항 =====
        military: {
            status: "면제",
            reason: "십자인대 파열 및 재건술"
        },

        // ===== 외국어 능력 =====
        languages: [
            {
                language: "English",
                level: "Basic",
                description: "기술 문서 및 개발 레퍼런스 독해 가능"
            }
        ],

        // ===== About (Voithru 맞춤) =====
        about: "**흐름(Workflow)을 먼저 설계하고, 도구는 가리지 않습니다.**\n\n기능 구현에 앞서, 업무의 시작과 끝이 매끄럽게 연결되는 전체 흐름을 먼저 파악합니다. 실무자와 소통하며 사용자가 놓치기 쉬운 디테일까지 챙겨야 비로소 '진짜 편한' 시스템이 완성되기 때문입니다.\n\n문제가 정의되면 기술에는 제한을 두지 않습니다. 웹, 앱, 클라우드는 물론 최신 AI 오픈소스 도구까지, 그 상황에서 문제를 해결하는 데 가장 빠르고 효율적인 방법을 찾아 유연하게 적용합니다.",

        // ===== 경력 (공백기 + 퇴사사유 추가) =====
        experience: [
            {
                company: "전남대학교 의과대학 예방의학교실",
                position: "연구원 (공공 보건 사업 PM 및 시스템 개발)",
                period: "2022. 08 - 2025. 12 (3년 4개월)",
                leaveReason: "DX(디지털 전환)·자동화 엔지니어로의 직무 전환을 위한 독립",
                description: [
                    "공공 보건 사업(지역사회건강조사, 남원 코호트, 소지역 건강조사 등) 기획 지원 및 현장 운영 실무 전담, 업무 시스템 개발"
                ],
                projects: [
                    {
                        title: "지역사회건강조사 (전남 14개 시·군, 연 1.2만명 규모)",
                        details: [
                            "사업 관리(PM) : 연간 사업 계획 수립, 예산 집행 관리, 조사원 56명 채용 및 직무 교육",
                            "현장 업무 자동화 : [Chrome Extension 및 Android 앱](https://sites.google.com/view/jnupreventautomation/%ED%99%88) 개발 및 배포(전국)로 복잡한 수동 입력 프로세스 제거",
                            "보고서 작성 자동화 : SAS 분석 결과를 Python/VBA로 차트 생성 및 HWPX 자동 입력하는 파이프라인 구축, 14개 통계집 작성 기간 66% 단축 (3개월→1개월)",
                            "품질 관리(QC) : 실시간 데이터 모니터링 및 주기적 이상치 점검, 최종 결과보고서 작성"
                        ]
                    },
                    {
                        title: "남원 코호트 연구 (심뇌혈관질환 R&D)",
                        details: [
                            "현장 운영 : 검진 일정 수립 및 예약 관리(연 200명 규모), 보조 인력 교육",
                            "데이터 관리 : 검진 결과지 스캔·라벨링, 연구 실물 자료 정리 및 보관, Pandas 기반 이상치 점검 및 정제",
                            "시스템 구축 : 실시간 검진 시스템 도입으로 현장 병목 제거 및 회차당 소요 시간 15% 단축"
                        ]
                    },
                    {
                        title: "해남군 계곡면 소지역 건강조사",
                        details: [
                            "디지털 전환 : 수기 설문을 Google Forms 기반 모바일 시스템으로 전환 및 조사원 교육",
                            "공간 분석 : R을 활용한 GIS 시각화 및 사업계획서 작성 지원",
                            "품질 관리 : 실시간 데이터 모니터링 및 조사원 1:1 코칭"
                        ]
                    },
                    {
                        title: "역학조사 솔루션 및 업무 도구 개발",
                        details: [
                            "역학조사 통합 분석 솔루션 개발 및 실무 교육 (광주/전남 보건소 현장 적용)"
                        ]
                    }
                ]
            },
            {
                company: "프리랜서 솔루션 개발",
                position: "1인 개발 및 운영",
                period: "2024. 10 - 2025. 12",
                description: [
                    "제조업 ERP, 이벤트 관리 솔루션 등 고객사 맞춤형 업무 자동화 시스템 설계·개발·운영"
                ]
            },
            {
                company: "공백기 (입시학원 강사 / 임용고시 준비)",
                position: "과학 강사",
                period: "2021. 08 - 2022. 07",
                isGapPeriod: true,
                description: [
                    "강사로 활동하며 학생을 가르치는 업무보다, 컴퓨터를 활용해 학원 내 행정 데이터와 성적 관리 시스템을 구조화하는 업무에서 더 큰 적성과 효율을 발견했습니다. 이를 계기로 개발 및 데이터 직무로의 커리어 전환을 확신하고 연구원 직무를 준비했습니다."
                ]
            }
        ],
    },
    en: {
        ...RESUME_DATA_V2.en,

        // ===== Personal Info (Detailed) =====
        birthDate: "July 7, 1998",
        veteranStatus: "Not Applicable",
        disabilityStatus: "Not Applicable",

        // ===== Military Service =====
        military: {
            status: "Exempted",
            reason: "ACL rupture and reconstruction surgery"
        },

        // ===== Language Skills =====
        languages: [
            {
                language: "English",
                level: "Basic",
                description: "Able to read technical documentation and development references"
            }
        ],

        // ===== Experience (with gap period + leave reason) =====
        experience: [
            {
                company: "JNU Preventive Medicine",
                position: "Research Associate (Public Health PM & System Dev)",
                period: "2022. 08 - 2025. 12 (3y 4m)",
                leaveReason: "Independence for career transition to DX/Automation Engineer",
                description: [
                    "Dedicated to planning support and field operations management for public health projects (Community Health Survey, Namwon Cohort, Small Area Survey, etc.) and developing business systems."
                ],
                projects: [
                    {
                        title: "Community Health Survey (Jeonnam 14 Cities/Counties, 12k participants/yr)",
                        details: [
                            "Project Management (PM): Annual business planning, budget execution management, recruitment and job training of 56 interviewers.",
                            "Field Work Automation: Developed and deployed [Chrome Extension & Android App](https://sites.google.com/view/jnupreventautomation/%ED%99%88) (nationwide) to eliminate complex manual entry processes.",
                            "Report Automation: Built a pipeline to generate charts from SAS analysis results using Python/VBA and automatically input them into HWPX, reducing the preparation period for 14 statistical books by 66% (3 months → 1 month).",
                            "Quality Control (QC): Real-time data monitoring, periodic outlier checks, and final result report preparation."
                        ]
                    },
                    {
                        title: "Namwon Cohort Study (Cardiovascular R&D)",
                        details: [
                            "Field Operations: Examination schedule planning and reservation management (200 people/year), support staff training.",
                            "Data Management: Scanning/labeling examination results, organizing/storing physical study materials, checking outliers and cleaning data based on Pandas.",
                            "System Construction: Eliminated on-site bottlenecks and reduced time per session by 15% by introducing a real-time examination system."
                        ]
                    },
                    {
                        title: "Haenam Gyegok-myeon Small Area Survey",
                        details: [
                            "Digital Transformation: Transitioned manual surveys to Google Forms-based mobile system and trained interviewers.",
                            "Spatial Analysis: Visualized GIS using R and supported business plan writing.",
                            "Quality Control: Real-time data monitoring and 1:1 coaching for interviewers."
                        ]
                    },
                    {
                        title: "Development of Epidemiology Solutions & Business Tools",
                        details: [
                            "Developed integrated epidemiology analysis solution and deployed to public health centers.",
                            "Created common business automation tools and distributed operational manuals."
                        ]
                    }
                ]
            },
            {
                company: "Freelance Solution Development",
                position: "Solo Developer & Operator",
                period: "2024. 10 - 2025. 12",
                description: [
                    "Designed, developed, and operated customized business automation systems for clients, including Manufacturing ERP and Event Management Solutions."
                ]
            },
            {
                company: "Career Gap (Academy Instructor / Teacher Certification Prep)",
                position: "Science Instructor",
                period: "2021. 08 - 2022. 07",
                isGapPeriod: true,
                description: [
                    "While working as an instructor, I discovered a greater aptitude and efficiency in structuring administrative data and grade management systems using computers rather than teaching students. This experience confirmed my career transition to development and data-related roles, and I prepared for a research position."
                ]
            }
        ],
    }
};
