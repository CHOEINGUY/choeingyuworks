import TimelyGPTClient from '@timely/gpt-sdk';

// Timely GPT SDK Client
export const timelyGPT = new TimelyGPTClient({
  apiKey: process.env.TIMELY_API_KEY || '',
  baseURL: process.env.TIMELY_BASE_URL || 'https://hello.timelygpt.co.kr/api/v2/chat',
});

// Default model
export const TIMELY_MODEL = (process.env.TIMELY_MODEL || 'gpt-5.1') as 'gpt-5.1';
