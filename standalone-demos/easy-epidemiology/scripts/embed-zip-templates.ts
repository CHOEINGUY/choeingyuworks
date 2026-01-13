import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules support for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ZIP 파일을 Base64로 변환하여 TS 파일로 생성
 */
export function embedZipTemplates(): void {
  console.log('🔧 ZIP 템플릿 파일을 Base64로 임베드 중 (TS 버전)...');
  
  const templates = [
    {
      name: 'report_template.zip',
      output: 'reportTemplateBase64.ts'
    },
    {
      name: 'report_template_caseControl.zip', 
      output: 'reportTemplateCaseControlBase64.ts'
    },
    {
      name: 'report_template_cohort.zip',
      output: 'reportTemplateCohortBase64.ts'
    }
  ];
  
  templates.forEach(template => {
    try {
      // ZIP 파일 읽기
      const zipPath = path.join(__dirname, '..', 'public', template.name);
      if (!fs.existsSync(zipPath)) {
        console.warn(`⚠️  ${template.name} 파일을 찾을 수 없습니다. 건너뜁니다.`);
        return;
      }
      
      const zipBuffer = fs.readFileSync(zipPath);
      
      // Base64로 변환
      const base64String = zipBuffer.toString('base64');
      
      // TS 파일 생성
      const tsContent = `// ${template.name}을 Base64로 임베드한 파일
// 자동 생성됨 - 수정하지 마세요

export function get${template.output.replace('.ts', '')}ArrayBuffer(): ArrayBuffer {
  const base64String = '${base64String}';
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes.buffer;
}

export function get${template.output.replace('.ts', '')}Base64(): string {
  return '${base64String}';
}
`;
      
      // 파일 저장
      const outputPath = path.join(__dirname, '..', 'src', 'utils', template.output);
      fs.writeFileSync(outputPath, tsContent);
      
      console.log(`✅ ${template.name} → ${template.output} 변환 완료`);
      console.log(`   크기: ${(zipBuffer.length / 1024).toFixed(2)} KB`);
      
    } catch (error: any) {
      console.error(`❌ ${template.name} 변환 실패:`, error.message);
    }
  });
  
  console.log('🎉 모든 ZIP 파일 임베드 완료!');
}

// 스크립트 실행
if (import.meta.url.startsWith('file:')) {
  const modulePath = fileURLToPath(import.meta.url);
  if (modulePath === process.argv[1]) {
    embedZipTemplates();
  }
}
