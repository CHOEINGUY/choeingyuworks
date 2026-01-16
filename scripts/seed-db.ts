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
    
    chunks.push(new Document({
      pageContent: `[이력서 프로필] 이름: ${SEED_DATA.ko.name}, 역할: ${SEED_DATA.ko.role}, 위치: ${SEED_DATA.ko.location}\n연락처: ${SEED_DATA.common.email}, ${SEED_DATA.common.phone}, ${SEED_DATA.common.github}\n자기소개: ${SEED_DATA.ko.about}`,
      metadata: { type: 'profile', lang: 'ko', source: 'resume' }
    }));

    // 2.1.5 Add Education (NEW)
    if (SEED_DATA.ko.education) {
        SEED_DATA.ko.education.forEach((edu) => {
            const content = `[학력] ${edu.school}\n전공: ${edu.major}\n기간: ${edu.period}`;
            chunks.push(new Document({
                pageContent: content,
                metadata: { type: 'education', school: edu.school, lang: 'ko', source: 'resume' }
            }));
        });
    }

    // 2.2 Add Projects Setup (Resume Summary)
    if (SEED_DATA.ko.projects) {
      SEED_DATA.ko.projects.forEach((qs) => {
          const content = `[이력서 프로젝트 요약] ${qs.name}\n기간: ${qs.period}\n설명: ${qs.description.join('\n')}`;
          chunks.push(new Document({
              pageContent: content,
              metadata: { type: 'project', title: qs.name, lang: 'ko', source: 'resume' }
          }));
      });
    }

    // 2.3 Add Experience
    if (SEED_DATA.ko.experience) {
      SEED_DATA.ko.experience.forEach((exp) => {
          const content = `[경력] ${exp.company} (${exp.position})\n설명: ${exp.description.join('\n')}`;
          chunks.push(new Document({
              pageContent: content,
              metadata: { type: 'experience', company: exp.company, lang: 'ko', source: 'resume' }
          }));
          if (exp.projects) {
              exp.projects.forEach(p => {
                  const pContent = `[경력 세부사항] ${exp.company} - ${p.title}\n내용: ${p.details.join('\n')}`;
                  chunks.push(new Document({
                      pageContent: pContent,
                      metadata: { type: 'experience-project', company: exp.company, lang: 'ko', source: 'resume' }
                  }));
              });
          }
      });
    }
  // 2.4 Add Skills
  if (SEED_DATA.ko.skills) {
      SEED_DATA.ko.skills.forEach(skill => {
          const content = `스택: ${skill.category}\n항목: ${skill.items.join(', ')}`;
          chunks.push(new Document({
              pageContent: content,
              metadata: { type: 'skill', category: skill.category, lang: 'ko', source: 'resume' }
          }));
      });
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
        const [fullMatch, _declPrefix, type, name] = match;
        
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
