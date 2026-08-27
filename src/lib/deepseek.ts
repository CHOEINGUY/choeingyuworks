import { OpenAI } from 'openai';

export const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';

let deepseekClient: OpenAI | null = null;

// DeepSeek API는 OpenAI 호환 스펙이라 openai SDK를 baseURL만 바꿔서 사용한다.
// 클라이언트를 lazy-init해서 빌드 시점에 키가 없어도 실패하지 않고,
// 실제 요청 시점에 설정 누락을 명확한 에러로 잡는다.
export function getDeepSeekClient(): OpenAI {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY is not configured');
  }

  if (!deepseekClient) {
    deepseekClient = new OpenAI({
      apiKey,
      baseURL: 'https://api.deepseek.com',
    });
  }

  return deepseekClient;
}
