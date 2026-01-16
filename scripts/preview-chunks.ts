import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import * as fs from 'fs';
import * as path from 'path';

import { RESUME_DATA_V2 } from '../src/features/resume/data/resumeData';

// Usage: npx tsx scripts/preview-chunks.ts

const SEED_DATA = RESUME_DATA_V2;

const PROJECT_DIRS = [
  'src/features/portfolio/projects/namwon-cohort',
  'src/features/portfolio/projects/easy-epidemiology',
  'src/features/portfolio/projects/party-event-saas'
];

async function preview() {
  try {
    console.log('🌱 Starting chunk preview generation...');
    
    // Data Check
    if (!RESUME_DATA_V2) throw new Error('Resume data not loaded');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chunks: any[] = [];

    // --- A. Resume Data ---
    console.log('📄 Processing Resume Data...');
    
    // 2.1 Add General Info
    chunks.push({
      pageContent: `[이력서 프로필] 이름: ${SEED_DATA.ko.name}, 역할: ${SEED_DATA.ko.role}, 위치: ${SEED_DATA.ko.location}\n연락처: ${SEED_DATA.common.email}, ${SEED_DATA.common.phone}, ${SEED_DATA.common.github}\n자기소개: ${SEED_DATA.ko.about}`,
      metadata: { type: 'profile', lang: 'ko', source: 'resume' }
    });

    // 2.1.5 Add Education (NEW)
    if (SEED_DATA.ko.education) {
        SEED_DATA.ko.education.forEach((edu) => {
            const content = `[학력] ${edu.school}\n전공: ${edu.major}\n기간: ${edu.period}`;
            chunks.push({
                pageContent: content,
                metadata: { type: 'education', school: edu.school, lang: 'ko', source: 'resume' }
            });
        });
    }

    // 2.2 Add Projects Setup
    if (SEED_DATA.ko.projects) {
      SEED_DATA.ko.projects.forEach((qs) => {
          const content = `[이력서 프로젝트 요약] ${qs.name}\n기간: ${qs.period}\n설명: ${qs.description.join('\n')}`;
          chunks.push({
              pageContent: content,
              metadata: { type: 'project', title: qs.name, lang: 'ko', source: 'resume' }
          });
      });
    }

    // 2.3 Add Experience
    if (SEED_DATA.ko.experience) {
      SEED_DATA.ko.experience.forEach((exp) => {
          const content = `[경력] ${exp.company} (${exp.position})\n설명: ${exp.description.join('\n')}`;
          chunks.push({
              pageContent: content,
              metadata: { type: 'experience', company: exp.company, lang: 'ko', source: 'resume' }
          });
          if (exp.projects) {
              exp.projects.forEach(p => {
                  const pContent = `[경력 세부사항] ${exp.company} - ${p.title}\n내용: ${p.details.join('\n')}`;
                  chunks.push({
                      pageContent: pContent,
                      metadata: { type: 'experience-project', company: exp.company, lang: 'ko', source: 'resume' }
                  });
              });
          }
      });
    }
  // 2.4 Add Skills
  if (SEED_DATA.ko.skills) {
      SEED_DATA.ko.skills.forEach(skill => {
          const content = `스택: ${skill.category}\n항목: ${skill.items.join(', ')}`;
          chunks.push({
              pageContent: content,
              metadata: { type: 'skill', category: skill.category, lang: 'ko', source: 'resume' }
          });
      });
  }

    // --- B. Codebase Indexing ---
    console.log('💻 Processing Project Codebase...');
    
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
            
            // --- SMART CHUNKING ---
            const smartChunks = splitCodeIntoChunks(content, fileName);
            
            smartChunks.forEach(chunk => {
                chunks.push({
                    pageContent: chunk.text,
                    metadata: { 
                        type: 'code', 
                        title: fileName, 
                        path: relativePath,
                        source: 'codebase',
                        subType: chunk.subType
                    }
                });
            });
        }
    }

    // --- Generate Report ---
    const reportPath = path.join(process.cwd(), 'knowledge-base-report.md');
    let report = `# 🧠 RAG Knowledge Base Report\n\n`;
    report += `**Total Chunks:** ${chunks.length}\n`;
    report += `**Generated:** ${new Date().toLocaleString()}\n\n`;

    report += `## 📄 Resume Data\n`;
    const resumeChunks = chunks.filter(c => c.metadata.source === 'resume');
    report += `- **Total Resume Chunks:** ${resumeChunks.length}\n`;
    const types = [...new Set(resumeChunks.map(c => c.metadata.type))];
    types.forEach(type => {
        const count = resumeChunks.filter(c => c.metadata.type === type).length;
        report += `  - ${type}: ${count}\n`;
    });

    report += `\n## 💻 Codebase Data\n`;
    const codeChunks = chunks.filter(c => c.metadata.source === 'codebase');
    report += `- **Total Code Chunks:** ${codeChunks.length}\n`;
    report += `- **Scanned Directories:**\n`;
    PROJECT_DIRS.forEach(d => report += `  - \`${d}\`\n`);

    report += `\n### 📂 Ingested Files List\n`;
    codeChunks.forEach(c => {
        report += `- \`${c.metadata.path}\` (${c.pageContent.length} chars)\n`;
    });

    // Detect missing/skipped?
    // We can't list all skipped files easily without scanning everything, but we can list what we HAVE.
    
    fs.writeFileSync(reportPath, report, 'utf-8');
    console.log(`✅ Report saved to: ${reportPath}`);

    // Save JSON as well
    const outputPath = path.join(process.cwd(), 'knowledge-base-preview.json');
    fs.writeFileSync(outputPath, JSON.stringify(chunks, null, 2), 'utf-8');
    
    console.log(`✅ Preview saved to: ${outputPath}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    process.exit(1);
  }
}

// Helper to get all files recursively
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles; // Safety check
  
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

// LEVEL 2: Smart Chunking Logic (Duplicated for Preview)
function splitCodeIntoChunks(content: string, fileName: string): { text: string; subType: string }[] {
    const chunks: { text: string; subType: string }[] = [];
    
    // 1. Extract Imports (Context)
    const imports = content.match(/import\s+.*?\n/g)?.join('') || '';

    // 2. Identify Blocks
    const blockRegex = /(export\s+(const|function|interface|class|type)\s+([a-zA-Z0-9_]+)[\s\S]*?(?=\nexport|$))/g;
    
    let match;
    let foundBlocks = false;

    while ((match = blockRegex.exec(content)) !== null) {
        foundBlocks = true;
        const [fullMatch, , type, name] = match;
        const blockContent = fullMatch.length > 3000 ? fullMatch.substring(0, 3000) + "\n...(truncated)" : fullMatch;
        
        const smartChunk = `[파일 Context]\n${fileName}\n\n[Imports]\n${imports}\n\n[Code Block: ${name}]\n${blockContent}`;
        chunks.push({
            text: smartChunk,
            subType: type
        });
    }

    if (!foundBlocks) {
        chunks.push({
            text: `[전체 파일: ${fileName}]\n${content.substring(0, 4000)}`,
            subType: 'file'
        });
    }

    return chunks;
}

preview();
