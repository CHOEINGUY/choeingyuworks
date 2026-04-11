'use client';

import { useState, useEffect } from 'react';
import type { ChatSession } from './types';
import { CHAT_HISTORY_KEY, MAX_HISTORY_COUNT } from './types';

export function useChatHistory() {
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_HISTORY_KEY);
      if (saved) setChatHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const saveSession = (session: ChatSession) => {
    setChatHistory(prev => {
      const existingIndex = prev.findIndex(s => s.id === session.id);
      const updated = existingIndex >= 0
        ? prev.map((s, i) => i === existingIndex ? session : s)
        : [session, ...prev].slice(0, MAX_HISTORY_COUNT);
      try {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatHistory(prev => {
      const updated = prev.filter(s => s.id !== id);
      try {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return { chatHistory, saveSession, deleteSession };
}
