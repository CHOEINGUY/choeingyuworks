import OpenAI from "openai";

// Timely GPT Bridge Client (OpenAI Compatible)
export const timelyAI = new OpenAI({
  apiKey: process.env.TIMELY_API_KEY,
  baseURL: process.env.TIMELY_BASE_URL,
});

// Default model from env or fallback
export const TIMELY_MODEL = process.env.TIMELY_MODEL || "openai/gpt-4o";
