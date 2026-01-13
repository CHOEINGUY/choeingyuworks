/**
 * hwpxProcessor.ts
 * HWPX 파일 생성 및 처리를 위한 유틸리티
 */

import JSZip from 'jszip';
import { createComponentLogger } from './logger';
import { getreportTemplateBase64ArrayBuffer } from './reportTemplateBase64';
import { getreportTemplateCaseControlBase64ArrayBuffer } from './reportTemplateCaseControlBase64';
import { getreportTemplateCohortBase64ArrayBuffer } from './reportTemplateCohortBase64';

// Logger 초기화
const logger = createComponentLogger('HwpxProcessor');

interface ChartImageDef {
  width?: number;
  dataUrl?: string;
  [key: string]: any;
}

export interface ChartImages {
  epidemicChart?: ChartImageDef;
  incubationChart?: ChartImageDef;
  [key: string]: ChartImageDef | undefined;
}

export type StudyDesign = 'case-control' | 'cohort' | string;

/**
 * XML 특수문자 이스케이프 함수
 * @param {string} text - 이스케이프할 텍스트
 * @returns {string} 이스케이프된 텍스트
 */
function escapeXml(text: string): string {
  if (typeof text !== 'string') return text;
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * XML 텍스트에서 플레이스홀더를 교체 (수동 방식과 동일)
 * @param {string} xmlText - XML 텍스트
 * @param {Object} replacements - 교체할 텍스트 객체
 * @returns {string} 교체된 XML 텍스트
 */
export function replacePlaceholders(xmlText: string, replacements: Record<string, string>): string {
  let modifiedText = xmlText;
  logger.debug('원본 XML 길이:', xmlText.length);

  // 긴 키부터 먼저 치환 (부분 치환 문제 방지)
  Object.entries(replacements)
    .sort(([a], [b]) => b.length - a.length) // 긴 키부터
    .forEach(([placeholder, value]) => {
      const searchText = placeholder; // % 없이 key 그대로 검색
      if (modifiedText.includes(searchText)) {
        logger.debug(`플레이스홀더 발견: ${searchText}`);
        logger.debug(`교체할 값: ${value}`);
        const escapedValue = escapeXml(value);
        logger.debug(`이스케이프된 값: ${escapedValue}`);
        modifiedText = modifiedText.split(searchText).join(escapedValue);
        logger.debug(`교체 완료: ${searchText} → ${escapedValue}`);
      } else {
        logger.debug(`플레이스홀더 없음: ${searchText}`);
      }
    });

  logger.debug('수정된 XML 길이:', modifiedText.length);
  return modifiedText;
}

/**
 * HWPX XML에서 차트 이미지 크기를 사용자 설정에 맞게 조정 (1100, 700 크기 지원)
 * @param {string} xmlText - XML 텍스트
 * @param {Object} chartImages - 차트 이미지 정보
 * @returns {string} 크기가 조정된 XML 텍스트
 */
function adjustChartImageSizes(xmlText: string, chartImages: ChartImages): string {
  let modifiedText = xmlText;
  
  // 유행곡선 차트 크기 조정
  if (chartImages.epidemicChart && chartImages.epidemicChart.width) {
    const userWidth = chartImages.epidemicChart.width;
    
    // 3배 픽셀로 생성된 이미지에 대한 정확한 매핑
    let orgSzWidth, curSzHeight, szHeight;
    
    if (userWidth === 3300) {  // 1100 * 3
      orgSzWidth = 247500;
      curSzHeight = 26285;
      szHeight = 26285;
    } else if (userWidth === 2100) {  // 700 * 3
      orgSzWidth = 157500;
      curSzHeight = 41310;
      szHeight = 41310;
    } else if (userWidth === 2700) {  // 900 * 3
      orgSzWidth = 202500;
      curSzHeight = 32128;
      szHeight = 32128;
    } else {
      // 기본값 (1100 기준)
      orgSzWidth = 247500;
      curSzHeight = 26285;
      szHeight = 26285;
    }
    
    logger.debug(`유행곡선 차트 크기 조정: ${userWidth}px → orgSzWidth=${orgSzWidth}, curSzHeight=${curSzHeight}`);
    
    // orgSz 태그 수정 (원본 크기)
    const orgSzPattern = /<hp:orgSz width="(\d+)" height="(\d+)"/g;
    modifiedText = modifiedText.replace(orgSzPattern, (match: string) => {
      // 첫 번째 이미지(유행곡선)만 수정
      if (match.includes('width="247500"') && match.includes('height="135000"')) {
        return `<hp:orgSz width="${orgSzWidth}" height="135000"`;
      }
      return match;
    });
    
    // curSz 태그 수정 (현재 크기)
    const curSzPattern = /<hp:curSz width="(\d+)" height="(\d+)"/g;
    modifiedText = modifiedText.replace(curSzPattern, (match: string) => {
      // 첫 번째 이미지(유행곡선)만 수정
      if (match.includes('width="48190"') && match.includes('height="26285"')) {
        return `<hp:curSz width="48190" height="${curSzHeight}"`;
      }
      return match;
    });
    
    // sz 태그 수정 (표시 크기)
    const szPattern = /<hp:sz width="(\d+)" widthRelTo="ABSOLUTE" height="(\d+)" heightRelTo="ABSOLUTE"/g;
    modifiedText = modifiedText.replace(szPattern, (match: string) => {
      // 첫 번째 이미지(유행곡선)만 수정
      if (match.includes('width="48190"') && match.includes('height="26285"')) {
        return `<hp:sz width="48190" widthRelTo="ABSOLUTE" height="${szHeight}" heightRelTo="ABSOLUTE"`;
      }
      return match;
    });
    
    // imgRect 태그 수정 (이미지 영역)
    const imgRectPattern = /<hc:pt1 x="(\d+)" y="(\d+)"/g;
    modifiedText = modifiedText.replace(imgRectPattern, (match: string) => {
      // 첫 번째 이미지(유행곡선)만 수정
      if (match.includes('x="247500"') && match.includes('y="0"')) {
        return `<hc:pt1 x="${orgSzWidth}" y="0"`;
      }
      return match;
    });
    
    const imgRectPattern2 = /<hc:pt2 x="(\d+)" y="(\d+)"/g;
    modifiedText = modifiedText.replace(imgRectPattern2, (match: string) => {
      // 첫 번째 이미지(유행곡선)만 수정
      if (match.includes('x="247500"') && match.includes('y="135000"')) {
        return `<hc:pt2 x="${orgSzWidth}" y="135000"`;
      }
      return match;
    });
    
    // imgClip 태그 수정 (이미지 클리핑)
    const imgClipPattern = /<hp:imgClip left="0" right="(\d+)" top="0" bottom="(\d+)"/g;
    modifiedText = modifiedText.replace(imgClipPattern, (match: string) => {
      // 첫 번째 이미지(유행곡선)만 수정
      if (match.includes('right="247500"') && match.includes('bottom="135000"')) {
        return `<hp:imgClip left="0" right="${orgSzWidth}" top="0" bottom="135000"`;
      }
      return match;
    });
    
    // imgDim 태그 수정 (이미지 차원)
    const imgDimPattern = /<hp:imgDim dimwidth="(\d+)" dimheight="(\d+)"/g;
    modifiedText = modifiedText.replace(imgDimPattern, (match: string) => {
      // 첫 번째 이미지(유행곡선)만 수정
      if (match.includes('dimwidth="247500"') && match.includes('dimheight="135000"')) {
        return `<hp:imgDim dimwidth="${orgSzWidth}" dimheight="135000"`;
      }
      return match;
    });
  }
  
  // 잠복기 차트 크기 조정
  if (chartImages.incubationChart && chartImages.incubationChart.width) {
    const userWidth = chartImages.incubationChart.width;
    
    // 3배 픽셀로 생성된 이미지에 대한 정확한 매핑
    let orgSzWidth, curSzHeight, szHeight;
    
    if (userWidth === 3300) {  // 1100 * 3
      orgSzWidth = 247500;
      curSzHeight = 26285;
      szHeight = 26285;
    } else if (userWidth === 2100) {  // 700 * 3
      orgSzWidth = 157500;
      curSzHeight = 41310;
      szHeight = 41310;
    } else if (userWidth === 2700) {  // 900 * 3
      orgSzWidth = 202500;
      curSzHeight = 32128;
      szHeight = 32128;
    } else {
      // 기본값 (1100 기준)
      orgSzWidth = 247500;
      curSzHeight = 26285;
      szHeight = 26285;
    }
    
    logger.debug(`잠복기 차트 크기 조정: ${userWidth}px → orgSzWidth=${orgSzWidth}, curSzHeight=${curSzHeight}`);
    
    // 두 번째 이미지(잠복기)에 대한 수정
    // orgSz 태그 수정 (원본 크기)
    const orgSzPattern = /<hp:orgSz width="(\d+)" height="(\d+)"/g;
    let count = 0;
    modifiedText = modifiedText.replace(orgSzPattern, (match: string) => {
      count++;
      // 두 번째 이미지(잠복기)만 수정
      if (count === 2) {
        return `<hp:orgSz width="${orgSzWidth}" height="135000"`;
      }
      return match;
    });
    
    // curSz 태그 수정 (현재 크기)
    const curSzPattern = /<hp:curSz width="(\d+)" height="(\d+)"/g;
    count = 0;
    modifiedText = modifiedText.replace(curSzPattern, (match: string) => {
      count++;
      // 두 번째 이미지(잠복기)만 수정
      if (count === 2) {
        return `<hp:curSz width="48190" height="${curSzHeight}"`;
      }
      return match;
    });
    
    // sz 태그 수정 (표시 크기)
    const szPattern = /<hp:sz width="(\d+)" widthRelTo="ABSOLUTE" height="(\d+)" heightRelTo="ABSOLUTE"/g;
    count = 0;
    modifiedText = modifiedText.replace(szPattern, (match: string) => {
      count++;
      // 두 번째 이미지(잠복기)만 수정
      if (count === 2) {
        return `<hp:sz width="48190" widthRelTo="ABSOLUTE" height="${szHeight}" heightRelTo="ABSOLUTE"`;
      }
      return match;
    });
    
    // imgRect 태그 수정 (이미지 영역) - 두 번째 이미지
    const imgRectPattern = /<hc:pt1 x="(\d+)" y="(\d+)"/g;
    count = 0;
    modifiedText = modifiedText.replace(imgRectPattern, (match: string) => {
      count++;
      // 두 번째 이미지(잠복기)만 수정
      if (count === 2) {
        return `<hc:pt1 x="${orgSzWidth}" y="0"`;
      }
      return match;
    });
    
    const imgRectPattern2 = /<hc:pt2 x="(\d+)" y="(\d+)"/g;
    count = 0;
    modifiedText = modifiedText.replace(imgRectPattern2, (match: string) => {
      count++;
      // 두 번째 이미지(잠복기)만 수정
      if (count === 2) {
        return `<hc:pt2 x="${orgSzWidth}" y="135000"`;
      }
      return match;
    });
    
    // imgClip 태그 수정 (이미지 클리핑) - 두 번째 이미지
    const imgClipPattern = /<hp:imgClip left="0" right="(\d+)" top="0" bottom="(\d+)"/g;
    count = 0;
    modifiedText = modifiedText.replace(imgClipPattern, (match: string) => {
      count++;
      // 두 번째 이미지(잠복기)만 수정
      if (count === 2) {
        return `<hp:imgClip left="0" right="${orgSzWidth}" top="0" bottom="135000"`;
      }
      return match;
    });
    
    // imgDim 태그 수정 (이미지 차원) - 두 번째 이미지
    const imgDimPattern = /<hp:imgDim dimwidth="(\d+)" dimheight="(\d+)"/g;
    count = 0;
    modifiedText = modifiedText.replace(imgDimPattern, (match: string) => {
      count++;
      // 두 번째 이미지(잠복기)만 수정
      if (count === 2) {
        return `<hp:imgDim dimwidth="${orgSzWidth}" dimheight="135000"`;
      }
      return match;
    });
  }
  
  return modifiedText;
}

/**
 * Data URL을 Blob으로 변환하는 함수
 * @param {string} dataUrl - Data URL
 * @returns {Promise<Blob>} 변환된 Blob
 */
async function convertDataUrlToBlob(dataUrl: string): Promise<Blob | null> {
  if (!dataUrl) return null;
  
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) {
      throw new Error(`이미지 로드 실패: ${response.statusText}`);
    }
    return await response.blob();
  } catch (error) {
    logger.error('Data URL을 Blob으로 변환 실패:', error);
    return null;
  }
}

/**
 * 원본 ZIP 파일에서 section0.xml만 교체하여 새로운 HWPX 파일 생성
 * @param {string} modifiedXmlText - 수정된 XML 텍스트
 * @param {Object} chartImages - 차트 이미지 정보 (선택사항)
 * @param {string} studyDesign - 조사 디자인 ('case-control' 또는 'cohort')
 * @returns {Promise<Blob>} 생성된 HWPX 파일의 Blob
 */
export async function createHwpxFromTemplate(
  modifiedXmlText: string, 
  chartImages: ChartImages = {}, 
  studyDesign: StudyDesign = 'case-control'
): Promise<Blob> {
  try {
    logger.info('원본 HWPX 파일 로드 시작 (Base64 임베드)...');
    
    // 조사 디자인에 따라 Base64 함수 선택
    let hwpxArrayBuffer: ArrayBuffer;
    if (studyDesign === 'case-control') {
      hwpxArrayBuffer = getreportTemplateCaseControlBase64ArrayBuffer();
      logger.debug('사용할 템플릿: case-control (Base64)');
    } else if (studyDesign === 'cohort') {
      hwpxArrayBuffer = getreportTemplateCohortBase64ArrayBuffer();
      logger.debug('사용할 템플릿: cohort (Base64)');
    } else {
      hwpxArrayBuffer = getreportTemplateBase64ArrayBuffer();
      logger.debug('사용할 템플릿: default (Base64)');
    }
    
    logger.info('원본 HWPX 파일 로드 완료 (Base64):', hwpxArrayBuffer.byteLength, 'bytes');
    
    // 2. HWPX 파일을 ZIP으로 파싱
    const zip = new JSZip();
    try {
      await zip.loadAsync(hwpxArrayBuffer);
    } catch (error) {
      logger.warn('일반 ZIP 파싱 실패, HWPX 형식으로 재시도...');
      await zip.loadAsync(hwpxArrayBuffer, {
        checkCRC32: false,
        optimizedBinaryString: false
      } as JSZip.JSZipLoadOptions);
    }
    logger.info('HWPX 파일 파싱 완료');
    
    // 3. 차트 이미지 크기 조정 (사용자 설정에 맞게)
    const adjustedXmlText = adjustChartImageSizes(modifiedXmlText, chartImages);
    logger.info('차트 이미지 크기 조정 완료');
    
    // 4. Contents/section0.xml 파일 교체
    zip.file('Contents/section0.xml', adjustedXmlText);
    logger.info('Contents/section0.xml 교체 완료');
    
    // 5. 차트 이미지 파일 교체 (있는 경우)
    if (chartImages.incubationChart?.dataUrl) {
      const incubationBlob = await convertDataUrlToBlob(chartImages.incubationChart.dataUrl);
      if (incubationBlob) {
        zip.file('BinData/image2.BMP', incubationBlob);
        console.log('✅ 잠복기 차트 이미지 교체 완료 (image2.BMP)');
      }
    }
    
    if (chartImages.epidemicChart?.dataUrl) {
      const epidemicBlob = await convertDataUrlToBlob(chartImages.epidemicChart.dataUrl);
      if (epidemicBlob) {
        zip.file('BinData/image1.BMP', epidemicBlob);
        console.log('✅ 유행곡선 차트 이미지 교체 완료 (image1.BMP)');
      }
    }
    
    // 6. 새로운 HWPX 파일 생성 (원본과 동일한 압축 방식)
    const hwpxBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6  // 적당한 압축 레벨
      }
    });
    
    logger.info('새로운 HWPX 파일 생성 완료:', hwpxBlob.size, 'bytes');
    return hwpxBlob;
    
  } catch (error) {
    logger.error('HWPX 파일 생성 오류:', error);
    throw error;
  }
}

/**
 * 원본 ZIP 파일에서 section0.xml만 교체하여 폴더 형태로 생성 (개발/테스트용)
 * @param {string} modifiedXmlText - 수정된 XML 텍스트
 * @param {Object} chartImages - 차트 이미지 정보 (선택사항)
 * @param {string} studyDesign - 조사 디자인 ('case-control' 또는 'cohort')
 * @returns {Promise<Blob>} 생성된 ZIP 파일의 Blob (압축 없음)
 */
export async function createHwpxFolderFromTemplate(
  modifiedXmlText: string, 
  chartImages: ChartImages = {}, 
  studyDesign: StudyDesign = 'case-control'
): Promise<Blob> {
  try {
    console.log('🔄 원본 HWPX 파일 로드 시작 (폴더 생성용, Base64)...');
    
    // 조사 디자인에 따라 Base64 함수 선택
    let hwpxArrayBuffer: ArrayBuffer;
    if (studyDesign === 'case-control') {
      hwpxArrayBuffer = getreportTemplateCaseControlBase64ArrayBuffer();
      console.log('📄 사용할 템플릿 (폴더용): case-control (Base64)');
    } else if (studyDesign === 'cohort') {
      hwpxArrayBuffer = getreportTemplateCohortBase64ArrayBuffer();
      console.log('📄 사용할 템플릿 (폴더용): cohort (Base64)');
    } else {
      hwpxArrayBuffer = getreportTemplateBase64ArrayBuffer();
      console.log('📄 사용할 템플릿 (폴더용): default (Base64)');
    }
    
    console.log('✅ 원본 HWPX 파일 로드 완료 (Base64):', hwpxArrayBuffer.byteLength, 'bytes');
    
    // 2. HWPX 파일을 ZIP으로 파싱
    const zip = new JSZip();
    try {
      await zip.loadAsync(hwpxArrayBuffer);
    } catch (error) {
      console.log('⚠️ 일반 ZIP 파싱 실패, HWPX 형식으로 재시도...');
      await zip.loadAsync(hwpxArrayBuffer, {
        checkCRC32: false,
        optimizedBinaryString: false
      } as JSZip.JSZipLoadOptions);
    }
    console.log('✅ HWPX 파일 파싱 완료');
    
    // 3. Contents/section0.xml 파일 교체
    zip.file('Contents/section0.xml', modifiedXmlText);
    console.log('✅ Contents/section0.xml 교체 완료');
    
    // 4. 차트 이미지 파일 교체 (있는 경우)
    if (chartImages.incubationChart?.dataUrl) {
      const incubationBlob = await convertDataUrlToBlob(chartImages.incubationChart.dataUrl);
      if (incubationBlob) {
        zip.file('BinData/image2.BMP', incubationBlob);
        console.log('✅ 잠복기 차트 이미지 교체 완료 (폴더용, image2.BMP)');
      }
    }
    
    if (chartImages.epidemicChart?.dataUrl) {
      const epidemicBlob = await convertDataUrlToBlob(chartImages.epidemicChart.dataUrl);
      if (epidemicBlob) {
        zip.file('BinData/image1.BMP', epidemicBlob);
        console.log('✅ 유행곡선 차트 이미지 교체 완료 (폴더용, image1.BMP)');
      }
    }
    
    // 5. 압축 없이 폴더 형태로 생성
    const folderBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'STORE'  // 압축 없음
    });
    
    console.log('✅ 폴더 형태 ZIP 파일 생성 완료:', folderBlob.size, 'bytes');
    console.log('📁 이 ZIP 파일을 압축해제하면 완전한 HWPX 파일 구조가 나옵니다');
    return folderBlob;
    
  } catch (error) {
    console.error('❌ HWPX 폴더 생성 오류:', error);
    throw error;
  }
}

/**
 * 원본 ZIP 파일에서 section0.xml 내용을 텍스트로 로드
 * @param {string} studyDesign - 조사 디자인 ('case-control' 또는 'cohort')
 * @returns {Promise<string>} Section0 파일의 텍스트 내용
 */
export async function loadTemplateSection0(studyDesign: StudyDesign = 'case-control'): Promise<string> {
  try {
    console.log('🔍 원본 HWPX에서 section0.xml 로드 시작 (Base64)...');
    
    // 조사 디자인에 따라 Base64 함수 선택
    let hwpxArrayBuffer: ArrayBuffer;
    if (studyDesign === 'case-control') {
      hwpxArrayBuffer = getreportTemplateCaseControlBase64ArrayBuffer();
      console.log('📄 사용할 템플릿 (로드용): case-control (Base64)');
    } else if (studyDesign === 'cohort') {
      hwpxArrayBuffer = getreportTemplateCohortBase64ArrayBuffer();
      console.log('📄 사용할 템플릿 (로드용): cohort (Base64)');
    } else {
      hwpxArrayBuffer = getreportTemplateBase64ArrayBuffer();
      console.log('📄 사용할 템플릿 (로드용): default (Base64)');
    }
    
    console.log('✅ 원본 HWPX 파일 로드 완료 (Base64):', hwpxArrayBuffer.byteLength, 'bytes');
    
    // HWPX 파일 헤더 확인
    const uint8Array = new Uint8Array(hwpxArrayBuffer);
    console.log('📄 HWPX 파일 시작 바이트:', Array.from(uint8Array.slice(0, 10)).map(b => b.toString(16).padStart(2, '0')).join(' '));
    
    // 2. HWPX 파일을 ZIP으로 파싱 (강제로 ZIP으로 처리)
    const zip = new JSZip();
    try {
      await zip.loadAsync(hwpxArrayBuffer);
    } catch (error) {
      console.log('⚠️ 일반 ZIP 파싱 실패, HWPX 형식으로 재시도...');
      // HWPX 파일을 강제로 ZIP으로 처리
      await zip.loadAsync(hwpxArrayBuffer, {
        checkCRC32: false,
        optimizedBinaryString: false
      } as JSZip.JSZipLoadOptions);
    }
    
    // HWPX 파일 내용 확인
    console.log('📁 HWPX 파일 내용:');
    zip.forEach((relativePath: string, file: any) => {
      console.log(`  - ${relativePath} (${file.dir ? 'DIR' : 'FILE'})`);
    });
    
    // 3. Contents/section0.xml 파일 추출
    const section0File = zip.file('Contents/section0.xml');
    if (!section0File) {
      throw new Error('Contents/section0.xml 파일을 찾을 수 없습니다.');
    }
    
    // 4. 텍스트로 읽기
    const text = await section0File.async('text');
    console.log('✅ section0.xml 로드 완료, 길이:', text.length);
    console.log('📄 파일 시작 부분:', text.substring(0, 200));
    return text;
    
  } catch (error) {
    console.error('❌ section0.xml 로드 오류:', error);
    throw error;
  }
}

/**
 * HWPX 파일을 다운로드
 * @param {Blob} hwpxBlob - HWPX 파일의 Blob
 * @param {string} filename - 파일명
 */
export function downloadHwpxFile(hwpxBlob: Blob, filename: string = '역학조사보고서.hwpx'): void {
  const url = URL.createObjectURL(hwpxBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 폴더를 ZIP으로 다운로드
 * @param {Blob} folderBlob - 폴더 ZIP 파일의 Blob
 * @param {string} filename - 파일명
 */
export function downloadFolderZip(folderBlob: Blob, filename: string = '역학조사보고서_폴더.zip'): void {
  const url = URL.createObjectURL(folderBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 이전 함수들과의 호환성을 위한 별칭
export const createHwpxFile = createHwpxFromTemplate;
export const createHwpxFolder = createHwpxFolderFromTemplate;
