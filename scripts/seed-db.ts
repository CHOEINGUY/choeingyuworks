import * as fs from 'fs';
import * as path from 'path';

// Manually load .env.local to avoid import hoisting issues
try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envData = fs.readFileSync(envPath, 'utf8');
        envData.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                let value = match[2].trim();
                if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                if (!process.env[match[1].trim()]) {
                    process.env[match[1].trim()] = value;
                }
            }
        });
        console.log('✅ .env.local loaded manually');
    }
} catch (e) {
    console.warn('Failed to load .env.local manually', e);
}

import { RESUME_DATA } from '../src/features/resume/data/resumeData';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';

// Usage: npx tsx scripts/seed-db.ts

const SEED_DATA = RESUME_DATA;

// Define project directories to scan
const PROJECT_DIRS = [
    'src/features/portfolio/projects/namwon-cohort',
    'src/features/portfolio/projects/easy-epidemiology',
    'src/features/portfolio/projects/party-event-saas'
];

async function seed() {
    try {
        console.log('🌱 Starting database seeding...');

        // 1. Env Check
        if (!process.env.PINECONE_API_KEY) throw new Error('PINECONE_API_KEY missing');
        if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY missing');
        console.log('✅ Env vars present');

        // 2. Data Check
        if (!SEED_DATA) throw new Error('Resume data not loaded');

        // 3. Connect to Pinecone
        const indexName = process.env.PINECONE_INDEX_NAME || 'resume-chatbot';
        const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const index = pinecone.Index(indexName);

        // 4. Delete all existing vectors (prevent accumulation on re-seed)
        console.log('🗑️ Deleting all existing vectors...');
        try {
            await index.deleteAll();
            console.log('✅ Existing vectors deleted');
        } catch (deleteError) {
            console.warn('⚠️ Could not delete existing vectors (index might be empty):', deleteError);
        }

        const chunks: Array<{ id: string; doc: Document }> = [];

        // --- A. Resume Data Indexing ---
        console.log('📄 Processing Resume Data...');

        // Only ko has actual data; en is empty
        const koData = SEED_DATA.ko;

        // A.1 Profile
        chunks.push({
            id: 'profile-ko',
            doc: new Document({
                pageContent: `[프로필] 이름: ${koData.name}, 역할: ${koData.role}\n연락처: ${SEED_DATA.common.email} / ${SEED_DATA.common.phone}\nGitHub: ${SEED_DATA.common.github}\n홈페이지: ${SEED_DATA.common.homepage}\n크몽(프리랜서): ${SEED_DATA.common.kmong}`,
                metadata: { type: 'profile', lang: 'ko', source: 'resume' }
            })
        });

        chunks.push({
            id: 'profile-en',
            doc: new Document({
                pageContent: `[Profile] Name: Ingyu Choe (최인규), Role: ${koData.role}\nContact: ${SEED_DATA.common.email} / ${SEED_DATA.common.phone}\nGitHub: ${SEED_DATA.common.github}\nHomepage: ${SEED_DATA.common.homepage}`,
                metadata: { type: 'profile', lang: 'en', source: 'resume' }
            })
        });

        // A.2 Career Descriptions (경력기술서) - most important for RAG
        console.log('📋 Processing careerDesc items...');
        koData.careerDesc.forEach((item, idx) => {
            const contentText = item.content.replace(/\\n/g, '\n');
            chunks.push({
                id: `career-desc-${idx}-ko`,
                doc: new Document({
                    pageContent: `[경력기술서] ${item.title} (${item.period})\n${contentText}`,
                    metadata: { type: 'career-desc', title: item.title, period: item.period, lang: 'ko', source: 'resume' }
                })
            });
        });

        // A.3 Cover Letter - split by sections
        console.log('📝 Processing coverLetter sections...');
        if (koData.coverLetter) {
            // Split by bold section headers (**...**)
            const coverLines = koData.coverLetter.split('\n');
            let currentSection = '';
            let currentTitle = '커버레터 도입';
            let sectionIdx = 0;

            for (const line of coverLines) {
                const boldMatch = line.match(/^\*\*(.+)\*\*$/);
                if (boldMatch) {
                    // Save previous section if non-empty
                    if (currentSection.trim()) {
                        chunks.push({
                            id: `cover-letter-${sectionIdx}-ko`,
                            doc: new Document({
                                pageContent: `[커버레터: ${currentTitle}]\n${currentSection.trim()}`,
                                metadata: { type: 'cover-letter', title: currentTitle, lang: 'ko', source: 'resume' }
                            })
                        });
                        sectionIdx++;
                    }
                    currentTitle = boldMatch[1];
                    currentSection = '';
                } else {
                    currentSection += line + '\n';
                }
            }
            // Save last section
            if (currentSection.trim()) {
                chunks.push({
                    id: `cover-letter-${sectionIdx}-ko`,
                    doc: new Document({
                        pageContent: `[커버레터: ${currentTitle}]\n${currentSection.trim()}`,
                        metadata: { type: 'cover-letter', title: currentTitle, lang: 'ko', source: 'resume' }
                    })
                });
            }
        }

        // A.4 Experience
        koData.experience.forEach((exp, expIdx) => {
            const content = `[경력] ${exp.company} (${exp.position})\n기간: ${exp.period}\n${exp.description.join('\n')}`;
            chunks.push({
                id: `experience-${expIdx}-ko`,
                doc: new Document({
                    pageContent: content,
                    metadata: { type: 'experience', company: exp.company, lang: 'ko', source: 'resume' }
                })
            });
            if (exp.projects) {
                exp.projects.forEach((p, pIdx) => {
                    const pContent = `[경력 세부사항] ${exp.company} - ${p.title} (${p.period})\n내용: ${p.details.join('\n')}`;
                    chunks.push({
                        id: `experience-${expIdx}-project-${pIdx}-ko`,
                        doc: new Document({
                            pageContent: pContent,
                            metadata: { type: 'experience-project', company: exp.company, title: p.title, lang: 'ko', source: 'resume' }
                        })
                    });
                });
            }
        });

        // --- B. Ghost Data: AI Chatbot Self-Reflection ---
        const ghostAI = {
            ko: `[프로젝트] 포트폴리오 AI 어시스턴트 (Self-Reflection)\n현재 이 대화를 진행 중인 AI 챗봇입니다. RAG(Retrieval-Augmented Generation) 기술로 이력서와 코드베이스를 학습했습니다.\nArchitecture: OpenAI Embeddings + Pinecone (Serverless Vector DB) + Cohere Rerank + GPT-4o/Claude 스트리밍\nCore Tech: Smart Chunking으로 코드 함수/컴포넌트 단위 문맥 보존\nStack: Next.js, Pinecone, Vercel, Tailwind CSS, Firebase (채팅 로그)\nRole: 방문자의 질문에 실시간으로 응답하며 포트폴리오 가이드 역할 수행`,
            en: `[Project] Portfolio AI Assistant (Self-Reflection)\nThis is the AI chatbot you are currently talking to, built with RAG technology.\nArchitecture: OpenAI Embeddings + Pinecone (Serverless) + Cohere Rerank + GPT-4o/Claude streaming\nCore Tech: Smart Chunking preserves code context at function/component level\nStack: Next.js, Pinecone, Vercel, Tailwind CSS, Firebase (chat logs)\nRole: Real-time portfolio guide answering visitor queries`
        };

        chunks.push({ id: 'ghost-ai-ko', doc: new Document({ pageContent: ghostAI.ko, metadata: { type: 'project', lang: 'ko', source: 'ghost-data' } }) });
        chunks.push({ id: 'ghost-ai-en', doc: new Document({ pageContent: ghostAI.en, metadata: { type: 'project', lang: 'en', source: 'ghost-data' } }) });

        // --- C. Ghost Data: Project Insights (Philosophy & Problem Solving) ---
        const insights = [
            {
                id: 'insight-namwon-philosophy',
                title: "더 나은 시스템을 위한 고민의 기록 (남원 코호트)",
                description: [
                    "주제: 개발 철학 (Engineering Philosophy)",
                    "1. 현장의 속도를 무시한 기술은 정답이 아니었습니다: 논리적으로 완벽해도 현장에서 번거로우면 실패합니다. '완료' 버튼 누락 문제를 통해 기술적 정답보다 현장의 해답이 중요함을 깨달았습니다.",
                    "2. 기능 구현보다 중요한 것은 사용자의 공감을 얻는 것이었습니다: 개발 전 현장을 방문해 '왜 필요한지'를 공유하고 사용자를 동료로 만들었을 때 비로소 협조를 얻을 수 있었습니다.",
                    "3. 사용자의 신뢰가 있을 때 기술은 비로소 완성됩니다: 신뢰가 쌓이자 데이터 입력이 정확해지고 알고리즘이 동작했습니다. 시스템 효율은 알고리즘 성능보다 사용자 신뢰도에 비례합니다."
                ]
            },
            {
                id: 'insight-epidemiology-system',
                title: "데이터 입력이 곧 분석이 되는 원스톱 시스템 (역학조사 분석)",
                description: [
                    "주제: 문제 해결 (Problem Solving)",
                    "1. 파편화된 워크플로우 통합: 엑셀 취합 → 통계 툴 이동 → 그래프 작성의 반복 비효율과 데이터 유실 위험을 웹 기반 원스톱 시스템으로 해결했습니다.",
                    "2. 골든타임 확보: 복잡한 감염병 분석 과정을 데이터 입력 즉시 완료되도록 자동화하여 초기 의사결정 속도를 획기적으로 높였습니다.",
                    "3. Zero Infrastructure: '내 PC가 곧 서버'라는 개념으로 브라우저 자원만 활용하여 별도 서버 구축 비용 없이 전문 시스템을 배포했습니다.",
                    "4. 전국 배포 경험: 바이브 코딩으로 개발 시작했으나 코드 누더기가 되어 전면 리셋 후 재개발. 실패를 통해 구조적 사고의 중요성을 체득. 2025년 7월 광주/전남 보건소 담당자 대상 발표 및 배포."
                ]
            },
            {
                id: 'insight-statistics-automation',
                title: "통계집 자동화: 첫 번째 자동화 성공 경험",
                description: [
                    "주제: 자동화 입문 (Automation Journey)",
                    "배경: 보건 연구원으로 일하며 전남 14개 시군 통계집 작성의 반복작업(엑셀+한글 수작업)에 시달림.",
                    "시도: Python과 Excel VBA를 독학. 차트 자동 생성, 통계집 자동 입력 구현.",
                    "진전 방식: 코드 짜고 실행하고 실패하는 과정에서 조금씩 개선. 회사에서도 집에서도 몰두.",
                    "성과: 2022년 3명×2개월 이상 → 2025년 혼자 3주 완료 (약 90% 시간 절감). 휴먼 에러(수치 오류, 오타, 그래프 오기입) 제거.",
                    "의미: 이 경험이 자동화에 빠지게 된 첫 번째 계기. 문제 해결의 성취감이 개발자로의 전환을 이끌었다."
                ]
            },
            {
                id: 'insight-reserve-household',
                title: "예비가구 배정 자동화: 전국 배포 앱 개발 경험",
                description: [
                    "주제: 사용자 중심 문제 해결 (User-Centric Automation)",
                    "배경: 지역사회건강조사를 담당하는 전국 연구원들이 모바일 미지원 PC 웹을 폰으로 확대해가며 예비가구를 배정하던 불편함.",
                    "해결: 원클릭으로 예비가구 배정이 가능한 앱 개발. 크롬 익스텐션과 안드로이드 앱 두 가지 플랫폼으로 구현.",
                    "과정: 자발적으로 개발 시작. 질병청(질병관리청) 승인 후 전국 배포.",
                    "기간: 2025년 5월 개발 완료.",
                    "의미: 요청받지 않고 스스로 문제를 발견하고 해결한 사례. 크롬 익스텐션 + 안드로이드 앱 동시 개발 경험."
                ]
            },
            {
                id: 'insight-field-inspection',
                title: "현장 직원 안전점검 시스템: 외주 개발 사례",
                description: [
                    "주제: 클라이언트 업무 시스템화 (Business Automation)",
                    "배경: 수백 명 현장 직원의 일일 안전점검을 수작업으로 수집·확인하던 업체의 자동화 의뢰 (2026년 2월).",
                    "설계: 모바일 웹(직원 제출) + 앱시트(관리자) + 구글 시트(DB) + 앱스 스크립트(자동화 로직) 연결.",
                    "기능: 근무계획과 제출 현황 자동 매칭, 미제출자 자동 식별 및 문자 발송.",
                    "결과: 관리자가 지점별·월별 점검 현황을 실시간 조회 가능한 운영 환경 구축.",
                    "의미: 고객 업무 흐름을 분석하여 적합한 도구를 선정하고 연결하는 시스템 설계 역량의 사례."
                ]
            },
            {
                id: 'insight-lecture-management',
                title: "출강 업체 강의 관리 시스템: 전 과정 시스템화",
                description: [
                    "주제: 워크플로우 전 과정 자동화 (End-to-End Automation)",
                    "배경: CPR 출강 업체가 구글 시트만으로 강의·강사·현장을 수작업 관리하던 상황. 전 과정 시스템화 의뢰 (2026년 1~2월).",
                    "설계: 강의 모집부터 정산까지 각 단계 자동화. 강사·관리자·소통 채널을 역할별로 분리.",
                    "차별점: AI 기반 보고서·블로그 글 자동 생성 연동.",
                    "결과: 강의 공고부터 현장 결과보고까지 관리자 개입 없이 자동 처리. 운영 리소스 절감.",
                    "의미: 단일 기능 자동화가 아닌 업무 전체 흐름을 구조화하고 AI와 연동한 복합 시스템 설계 사례."
                ]
            },
            {
                id: 'insight-field-communication',
                title: "현장 중심 문제 해결 역량",
                description: [
                    "주제: 현장 문제 해결 (Pain Point Discovery)",
                    "키워드: 현장 변수 대응, 유연한 시스템 설계, 사용자 교육, 목적 공유, 기술적 강제 지양",
                    "사례: 남원 코호트 프로젝트에서 '완벽한 통제'보다 '적절한 유연함'이 현장의 정답임을 깨달았습니다.",
                    "문제: 실시간 대기 관리 시스템 도입 후 현장 담당자들이 '완료 버튼'을 누르는 타이밍이 제각각이라 자동화 로직이 꼬이는 문제 발생.",
                    "해결: 기술적 제약 대신 '정확한 사용 가이드 교육'으로 접근. 시스템 목표가 단순 기록이 아닌 '실시간 동료 간 상황 공유'임을 설명. 정확한 버튼 타이밍을 합의하고 교육.",
                    "결과: 사용자들이 시스템의 의도를 이해하자 자발적으로 정확한 데이터 입력 시작. 입력 누락률 0%에 가깝게 감소.",
                    "인사이트: 기술은 사용자를 통제하는 것이 아니라, 사용자가 잘 쓸 수 있도록 유연해야 한다."
                ]
            },
            {
                id: 'insight-user-education',
                title: "비개발자 소통 및 사용자 교육 역량",
                description: [
                    "주제: 소통 & 확산 (Culture & Communication)",
                    "키워드: 비개발자 소통, 사용자 교육, 매뉴얼 작성, 현장 설득, 1:1 교육, 신뢰 구축",
                    "철학: 기술의 완성은 코드가 아니라 '사용자의 신뢰'에서 온다는 것을 현장 교육을 통해 배웠습니다.",
                    "전략 1 - 발로 뛰는 소통: 전체 공지가 아니라 검사실을 한 곳 한 곳 찾아가 담당자분들과 1:1로 대면했습니다.",
                    "전략 2 - Why의 공유: '이거 쓰세요'가 아니라 '이 버튼을 제때 눌러주시면 선생님 방 앞에 줄 서 있는 어르신들이 줄어듭니다'라며 업무 고충이 어떻게 해결되는지 설명했습니다.",
                    "전략 3 - 맞춤형 자료: IT 용어를 배제한 현장 맞춤형 서류 매뉴얼을 직접 제작해 배포했습니다.",
                    "인사이트: '시스템의 성능은 알고리즘이 아니라 사용자의 애착에 비례한다'"
                ]
            },
            {
                id: 'insight-book-antifragile',
                title: "삶의 모토: 안티프래질 - 나심 탈레브",
                description: [
                    "주제: 삶의 철학 (Life Philosophy)",
                    "깨질수록 강해진다는 말이 있다. 탈레브가 정의한 안티프래질이다. 처음 이 개념을 접했을 때, 내가 이미 그렇게 살고 싶었다는 걸 깨달았다.",
                    "나는 실패를 패배라고 생각하지 않는다. 실패는 학습이고, 경험이고, 교훈이다. 심적으로 힘들 때마다 이 사실을 되새긴다. 편안한 환경은 나를 나태하게 만든다는 것도 안다. 그래서 전 직장을 떠났다. 더 이상 편안하지 않기 위해, 시도하기 위해.",
                    "퇴사 후 월급이 사라지자 하나하나의 프리랜서 기회가 달리 보였다. 그 기회 하나하나가 소중했다.",
                    "키워드: 안티프래질, 실패는 학습, 편안함 거부, 퇴사 이유, 프리랜서 전환"
                ]
            },
            {
                id: 'insight-book-skin-in-the-game',
                title: "삶의 모토: 스킨 인 더 게임 - 나심 탈레브",
                description: [
                    "주제: 삶의 철학 (Life Philosophy)",
                    "게임에 참여하려면 스스로 판돈을 걸어야 한다. 탈레브의 핵심 메시지다. 책임 없이 조언하는 사람, 결과를 짊어지지 않는 사람은 믿지 말라는 것이기도 하다.",
                    "나는 이걸 내 삶에 그대로 적용하려 한다. 내 말과 행동으로 누군가에게 피해가 생겼다면, 감정적으로 흔들릴 게 아니라 그에 맞는 책임을 지면 된다. 과하게 자책하거나 슬퍼할 필요도 없다. 딱 그만큼 갚으면 된다.",
                    "말에도, 행동에도, 일에도. 책임있는 삶을 살자.",
                    "키워드: 책임, 스킨인더게임, 행동에 책임지기, 감정 분리, 피해 보상"
                ]
            },
            {
                id: 'insight-book-same-as-ever',
                title: "삶의 모토: 불변의 법칙 - 모건 하우절",
                description: [
                    "주제: 삶의 철학 (Life Philosophy)",
                    "세상은 빠르게 변하는 것처럼 보인다. 하지만 그 안에는 변하지 않는 것들이 있다. 하우절은 그것을 찾아야 한다고 말한다.",
                    "나는 이걸 길게 보는 시각으로 받아들였다. 단기적인 변화에 흔들리지 않고, 변하지 않는 가치에 집중하는 것. 빠르게 변하는 세상 속에서도 방향을 잃지 않는 방법이라고 생각한다.",
                    "키워드: 불변의 법칙, 장기적 시각, 합리적 낙관주의, 변하지 않는 가치"
                ]
            },
            {
                id: 'insight-developer-identity',
                title: "최인규는 개발자인가? - 정체성 전환 스토리",
                description: [
                    "주제: 개발자 정체성 (Developer Identity)",
                    "2024년까지: 코딩을 하지 않고 AI와 대화로만 자동화를 개발했기 때문에 스스로 개발자가 아니라고 생각했습니다.",
                    "전환점: 역학조사 분석 시스템 개발 과정. 바이브 코딩으로 웹 개발 시도했으나 한 파일에 코드 3000줄이 넘어 코드 누더기가 됨. 전면 리셋 후 재개발.",
                    "깨달음: 실패의 반복 속에서 조금씩 진전되는 결과물을 보며, AI라는 도구를 '잘' 사용하여 자동화하는 것이 자신의 직무라는 확신이 생겼습니다.",
                    "결정: 2025년 연구실 퇴사. DX/AX 직무 전환 위해 자동화 전문 개발자로 활동 중.",
                    "철학: AI는 대체가 아니라 도구. 도구를 잘 쓰는 사람이 진짜 개발자."
                ]
            }
        ];

        insights.forEach(insight => {
            chunks.push({
                id: `insight-${insight.id}-ko`,
                doc: new Document({
                    pageContent: `[프로젝트 인사이트] ${insight.title}\n내용: ${insight.description.join('\n')}`,
                    metadata: { type: 'insight', title: insight.title, lang: 'ko', source: 'ghost-data' }
                })
            });
        });

        // --- D. Codebase Indexing ---
        console.log('💻 Processing Project Codebase...');

        let codeChunkIdx = 0;
        for (const relativeDir of PROJECT_DIRS) {
            const fullPath = path.join(process.cwd(), relativeDir);
            if (!fs.existsSync(fullPath)) {
                console.warn(`⚠️ Directory not found: ${fullPath}`);
                continue;
            }

            const files = getAllFiles(fullPath);

            for (const file of files) {
                if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue;

                const content = fs.readFileSync(file, 'utf-8');
                const relativePath = path.relative(process.cwd(), file);
                const fileName = path.basename(file);

                const smartChunks = splitCodeIntoChunks(content, fileName);

                smartChunks.forEach(chunk => {
                    chunks.push({
                        id: `code-${codeChunkIdx++}`,
                        doc: new Document({
                            pageContent: chunk.text,
                            metadata: {
                                type: 'code',
                                title: fileName,
                                path: relativePath,
                                source: 'codebase',
                                subType: chunk.subType
                            }
                        })
                    });
                });
            }
        }

        console.log(`📦 Prepared ${chunks.length} chunks. Generating embeddings...`);

        // 5. Embeddings
        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: 'text-embedding-3-small',
        });

        // 6. Batch Upsert with descriptive IDs
        const batchSize = 10;
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);
            console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}...`);

            const batchVectors = [];
            for (const { id, doc } of batch) {
                try {
                    const vector = await embeddings.embedQuery(doc.pageContent);
                    let text = doc.pageContent;
                    if (text.length > 30000) {
                        text = text.substring(0, 30000) + '...(truncated)';
                    }
                    batchVectors.push({
                        id,
                        values: vector,
                        metadata: { ...doc.metadata, text }
                    });
                } catch (embedError) {
                    console.error(`⚠️ Embedding failed for chunk "${id}":`, embedError);
                }
            }

            if (batchVectors.length > 0) {
                await index.upsert(batchVectors);
            }
        }

        console.log('✅ Seeding complete!');
        console.log(`📊 Summary: ${chunks.length} chunks indexed`);
        console.log(`  - Profile: ${chunks.filter(c => c.doc.metadata.type === 'profile').length}`);
        console.log(`  - Career Desc: ${chunks.filter(c => c.doc.metadata.type === 'career-desc').length}`);
        console.log(`  - Cover Letter: ${chunks.filter(c => c.doc.metadata.type === 'cover-letter').length}`);
        console.log(`  - Experience: ${chunks.filter(c => c.doc.metadata.type?.toString().startsWith('experience')).length}`);
        console.log(`  - Insights: ${chunks.filter(c => c.doc.metadata.type === 'insight').length}`);
        console.log(`  - Code: ${chunks.filter(c => c.doc.metadata.type === 'code').length}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error(err);
        process.exit(1);
    }
}

// Helper to get all files recursively
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

// Smart Chunking: splits code into meaningful blocks
function splitCodeIntoChunks(content: string, fileName: string): { text: string; subType: string }[] {
    const chunks: { text: string; subType: string }[] = [];

    const imports = content.match(/import\s+.*?\n/g)?.join('') || '';

    const blockRegex = /(export\s+(const|function|interface|class|type)\s+([a-zA-Z0-9_]+)[\s\S]*?(?=\nexport|$))/g;

    let match;
    let foundBlocks = false;

    while ((match = blockRegex.exec(content)) !== null) {
        foundBlocks = true;
        const [fullMatch, , type, name] = match;

        const blockContent = fullMatch.length > 3000 ? fullMatch.substring(0, 3000) + "\n...(truncated)" : fullMatch;

        const smartChunk = `[파일 Context]\n${fileName}\n\n[Imports]\n${imports}\n\n[Code Block: ${name}]\n${blockContent}`;

        chunks.push({ text: smartChunk, subType: type });
    }

    if (!foundBlocks) {
        chunks.push({
            text: `[전체 파일: ${fileName}]\n${content.substring(0, 4000)}`,
            subType: 'file'
        });
    }

    return chunks;
}

seed();
