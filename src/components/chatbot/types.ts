import type { LucideIcon } from 'lucide-react';

export type Persona = 'professional' | 'passionate' | 'friend';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type ChatSession = {
  id: string;
  persona: Persona;
  messages: Message[];
  firstQuestion: string;
  createdAt: string;
};

export type PersonaConfigEntry = {
  label: string;
  Icon: LucideIcon;
  desc: string;
  greeting: string;
  color: string;
  bubble: string;
  button: string;
  ring: string;
};

export type PersonaConfig = Record<Persona, PersonaConfigEntry>;

export const CHAT_HISTORY_KEY = 'choeingyu-chat-history';
export const MAX_HISTORY_COUNT = 10;
