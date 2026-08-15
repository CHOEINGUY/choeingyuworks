import { OpenAI } from 'openai';

// DeepSeek API는 OpenAI 호환 스펙이라 openai SDK를 baseURL만 바꿔서 그대로 사용
export const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com',
});

export const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';
