import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import * as fs from 'fs';
import * as path from 'path';

import { RESUME_DATA_V2 } from '../src/features/resume/data/resumeData';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from '@langchain/core/documents';

// Usage: npx tsx scripts/seed-db.ts

const SEED_DATA = RESUME_DATA_V2;

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
    if (!RESUME_DATA_V2) throw new Error('Resume data not loaded');

    const chunks: Document[] = [];

    // --- A. Resume Data Indexing (Existing) ---
    console.log('📄 Processing Resume Data...');
    
    // Process both Korean and English data
    const supportedLangs = ['ko', 'en'] as const;

    for (const lang of supportedLangs) {
        const data = SEED_DATA[lang];
        console.log(`Sub-processing Language: ${lang}`);

        // 2.1 Profile
        chunks.push(new Document({
        pageContent: `[이력서 프로필] 이름: ${data.name}, 역할: ${data.role}, 위치: ${data.location}\n연락처: ${SEED_DATA.common.email}, ${SEED_DATA.common.phone}, ${SEED_DATA.common.github}\n자기소개: ${data.about}`,
        metadata: { type: 'profile', lang: lang, source: 'resume' }
        }));

        // 2.1.5 Add Education
        if (data.education) {
            data.education.forEach((edu) => {
                const content = `[학력] ${edu.school}\n전공: ${edu.major}\n기간: ${edu.period}`;
                chunks.push(new Document({
                    pageContent: content,
                    metadata: { type: 'education', school: edu.school, lang: lang, source: 'resume' }
                }));
            });
        }

        // 2.2 Add Projects Summary
        if (data.projects) {
        data.projects.forEach((qs) => {
            const content = `[이력서 프로젝트 요약] ${qs.name}\n기간: ${qs.period}\n설명: ${qs.description.join('\n')}`;
            chunks.push(new Document({
                pageContent: content,
                metadata: { type: 'project', title: qs.name, lang: lang, source: 'resume' }
            }));
        });
        }

        // 2.3 Add Experience
        if (data.experience) {
        data.experience.forEach((exp) => {
            const content = `[경력] ${exp.company} (${exp.position})\n설명: ${exp.description.join('\n')}`;
            chunks.push(new Document({
                pageContent: content,
                metadata: { type: 'experience', company: exp.company, lang: lang, source: 'resume' }
            }));
            if (exp.projects) {
                exp.projects.forEach(p => {
                    const pContent = `[경력 세부사항] ${exp.company} - ${p.title}\n내용: ${p.details.join('\n')}`;
                    chunks.push(new Document({
                        pageContent: pContent,
                        metadata: { type: 'experience-project', company: exp.company, lang: lang, source: 'resume' }
                    }));
                });
            }
        });
        }
    // 2.4 Add Skills
    if (data.skills) {
        data.skills.forEach(skill => {
            const content = `스택: ${skill.category}\n항목: ${skill.items.join(', ')}`;
            chunks.push(new Document({
                pageContent: content,
                metadata: { type: 'skill', category: skill.category, lang: lang, source: 'resume' }
            }));
        });
    }

    // --- Ghost Data: AI Chatbot Self-Reflection (Not in Resume UI) ---
    const ghostProject = lang === 'ko' ? {
        name: "포트폴리오 AI 어시스턴트 (Self-Reflection)",
        description: [
            "현재 이 대화를 진행 중인 AI 챗봇입니다. RAG(Retrieval-Augmented Generation) 기술을 사용하여 이력서와 코드베이스를 학습했습니다.",
            "Architecture: Hybrid RAG (OpenAI Embeddings + Google Gemini Generation)",
            "Core Tech: 'Smart Chunking'을 통해 코드의 함수/컴포넌트 단위 문맥을 보존하며 학습",
            "Stack: Next.js, Pinecone (Serverless Vector DB), Vercel, Tailwind CSS",
            "Role: 방문자의 질문에 실시간으로 응답하며 포트폴리오 가이드 역할 수행"
        ]
    } : {
        name: "Portfolio AI Assistant (Self-Reflection)",
        description: [
            "This is the AI chatbot you are currently talking to. Built with RAG technology.",
            "Architecture: Hybrid RAG (OpenAI Embeddings + Google Gemini Generation)",
            "Core Tech: Uses 'Smart Chunking' to preserve code context during indexing",
            "Stack: Next.js, Pinecone, Vercel, Tailwind CSS",
            "Role: Functions as a real-time portfolio guide answering visitor queries"
        ]
    };

    chunks.push(new Document({
        pageContent: `[프로젝트] ${ghostProject.name}\n설명: ${ghostProject.description.join('\n')}`,
        metadata: { type: 'project', title: ghostProject.name, lang: lang, source: 'ghost-data' }
    }));

    // --- Ghost Data: Project Insights (Philosophy & Problem Solving) ---
    // Only for Korean for now
    if (lang === 'ko') {
        const insights = [
            {
                title: "더 나은 시스템을 위한 고민의 기록 (Namwon Cohort)",
                description: [
                    "주제: 개발 철학 (Engineering Philosophy)",
                    "1. 현장의 속도를 무시한 기술은 정답이 아니었습니다: 논리적으로 완벽해도 현장에서 번거로우면 실패합니다. '완료' 버튼 누락 문제를 통해 기술적 정답보다 현장의 해답이 중요함을 깨달았습니다.",
                    "2. 기능 구현보다 중요한 것은 사용자의 공감을 얻는 것이었습니다: 개발 전 현장을 방문해 '왜 필요한지'를 공유하고 사용자를 동료로 만들었을 때 비로소 협조를 얻을 수 있었습니다.",
                    "3. 사용자의 신뢰가 있을 때 기술은 비로소 완성됩니다: 신뢰가 쌓이자 데이터 입력이 정확해지고 알고리즘이 동작했습니다. 시스템 효율은 알고리즘 성능보다 사용자 신뢰도에 비례합니다."
                ]
            },
            {
                title: "데이터 입력이 곧 분석이 되는 원스톱 시스템 (Easy Epidemiology)",
                description: [
                    "주제: 문제 해결 (Problem Solving)",
                    "1. 파편화된 워크플로우 통합: 엑셀 취합 → 통계 툴 이동 → 그래프 작성의 반복 비효율과 데이터 유실 위험을 웹 기반 원스톱 시스템으로 해결했습니다.",
                    "2. 골든타임 확보: 복잡한 감염병 분석 과정을 데이터 입력 즉시 완료되도록 자동화하여 초기 의사결정 속도를 획기적으로 높였습니다.",
                    "3. Zero Infrastructure: '내 PC가 곧 서버'라는 개념으로 브라우저 자원만 활용하여 별도 서버 구축 비용 없이 전문 시스템을 배포했습니다."
                ]
            },
            {
                title: "이벤트 운영의 시스템화 (Party SaaS)",
                description: [
                    "주제: 효율성 혁신 (Efficiency)",
                    "1. 휴먼 에러 원천 차단: 엑셀 복사/붙여넣기 실수와 수기 입금 확인의 부정확성을 시스템화하여 데이터 무결성을 보장했습니다.",
                    "2. 압도적 효율 개선: 행사 마감 후 정산까지 3시간 소요되던 업무를 실시간 데이터 연동을 통해 3초로 단축했습니다.",
                    "3. 비즈니스 로직의 유연성: 노코드 폼 빌더를 직접 구현하여 파티, 소개팅, 매칭 등 다양한 비즈니스 모델 변화에 코드 수정 없이 즉시 대응할 수 있게 만들었습니다."
                ]
            }
        ];

        insights.forEach(insight => {
             chunks.push(new Document({
                pageContent: `[프로젝트 인사이트] ${insight.title}\n내용: ${insight.description.join('\n')}`,
                metadata: { type: 'insight', title: insight.title, lang: lang, source: 'ghost-data' }
            }));
        });
    }
    }

    // --- B. Codebase Indexing (New) ---
    console.log('💻 Processing Project Codebase...');
    
    for (const relativeDir of PROJECT_DIRS) {
        const fullPath = path.join(process.cwd(), relativeDir);
        if (!fs.existsSync(fullPath)) {
            console.warn(`⚠️ Directory not found: ${fullPath}`);
            continue;
        }

        const files = getAllFiles(fullPath); // Helper function below
        
        for (const file of files) {
            // Skip non-code files or index files if needed
            if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue;
            
            const content = fs.readFileSync(file, 'utf-8');
            const relativePath = path.relative(process.cwd(), file);
            const fileName = path.basename(file);
            
            // --- SMART CHUNKING ---
            const smartChunks = splitCodeIntoChunks(content, fileName);
            
            smartChunks.forEach(chunk => {
                chunks.push(new Document({
                    pageContent: chunk.text,
                    metadata: { 
                        type: 'code', 
                        title: fileName, 
                        path: relativePath,
                        source: 'codebase',
                        subType: chunk.subType // e.g. 'function' or 'component'
                    }
                }));
            });
        }
    }


    console.log(`📦 Prepared ${chunks.length} chunks. Generating embeddings...`);

    // 3. Embeddings
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY, // Explicitly pass key
        modelName: 'text-embedding-3-small',
    });

    const indexName = process.env.PINECONE_INDEX_NAME || 'resume-chatbot';
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const index = pinecone.Index(indexName);

    // Batch Upsert
    const batchSize = 10;
    for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        console.log(`Processing batch ${i / batchSize + 1}/${Math.ceil(chunks.length / batchSize)}...`);
        
        const batchVectors = [];
        for (let j = 0; j < batch.length; j++) {
            const chunk = batch[j];
            try {
                const vector = await embeddings.embedQuery(chunk.pageContent);
                batchVectors.push({
                    id: `chunk-${i + j}`,
                    values: vector,
                    metadata: { ...chunk.metadata, text: chunk.pageContent } // Pinecone metadata limit is 40kb, code might exceed.
                    // Important: For code, we might NOT want to store full text in metadata if it's huge.
                    // But for RAG retrieval, we need it. Let's truncate metadata text if too long.
                });
            } catch (embedError) {
                console.error(`⚠️ Embedding failed for chunk ${j}:`, embedError);
                // Continue to next chunk instead of crashing hard
            }
        }
        
        if (batchVectors.length > 0) {
            // Safety: Truncate metadata text to 30KB to avoid Pinecone 40KB limit
            batchVectors.forEach(v => {
                if (v.metadata.text && (v.metadata.text as string).length > 30000) {
                     v.metadata.text = (v.metadata.text as string).substring(0, 30000) + "...(truncated)";
                }
            });
            await index.upsert(batchVectors);
        }
    }

    console.log('✅ Seeding complete!');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    process.exit(1);
  }
}

// Helper to get all files recursively
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

// LEVEL 2: Smart Chunking Logic
// Splits code into meaningful blocks (Component, Interface, Function) instead of raw text
function splitCodeIntoChunks(content: string, fileName: string): { text: string; subType: string }[] {
    const chunks: { text: string; subType: string }[] = [];
    
    // 1. Extract Imports (Context) - Keep imports with every chunk for context
    const imports = content.match(/import\s+.*?\n/g)?.join('') || '';

    // 2. Identify Blocks (Exported Functions/Classes/Interfaces)
    // Regex explanation: Matches "export [const|function|interface|class] Name ..."
    const blockRegex = /(export\s+(const|function|interface|class|type)\s+([a-zA-Z0-9_]+)[\s\S]*?(?=\nexport|$))/g;
    
    let match;
    let foundBlocks = false;

    while ((match = blockRegex.exec(content)) !== null) {
        foundBlocks = true;
        const [fullMatch, , type, name] = match;
        
        // Clean up the match (limit length if too huge)
        const blockContent = fullMatch.length > 3000 ? fullMatch.substring(0, 3000) + "\n...(truncated)" : fullMatch;
        
        // Add Import Context + Block
        const smartChunk = `[파일 Context]\n${fileName}\n\n[Imports]\n${imports}\n\n[Code Block: ${name}]\n${blockContent}`;
        
        chunks.push({
            text: smartChunk,
            subType: type // function, component, etc.
        });
    }

    // 3. Fallback: If no structured blocks found (e.g. small utility file), use raw content
    if (!foundBlocks) {
        chunks.push({
            text: `[전체 파일: ${fileName}]\n${content.substring(0, 4000)}`,
            subType: 'file'
        });
    }

    return chunks;
}

seed();
