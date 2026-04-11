'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { MessageCircle, X, Bot, Briefcase, Zap, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Message, Persona, PersonaConfig, ChatSession } from './chatbot/types';
import { useChatHistory } from './chatbot/useChatHistory';
import { PersonaSelector } from './chatbot/PersonaSelector';
import { ChatInterface } from './chatbot/ChatInterface';

export function AIChatWidget() {
  const t = useTranslations('chatbot');

  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(isOpen);
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState<Persona>('professional');
  const [hasSelectedPersona, setHasSelectedPersona] = useState(false);
  const [sessionId, setSessionId] = useState(() => Date.now().toString());
  const [unreadCount, setUnreadCount] = useState(0);

  const { chatHistory, saveSession, deleteSession } = useChatHistory();

  const getInitialMessages = useCallback((): Message[] => [{
    id: 'welcome',
    role: 'assistant',
    content: t('chat.welcome'),
  }], [t]);

  const [messages, setMessages] = useState<Message[]>(getInitialMessages);

  const personaConfig = useMemo((): PersonaConfig => ({
    professional: {
      label: t('personas.professional.label'),
      Icon: Briefcase,
      desc: t('personas.professional.desc'),
      greeting: t('personas.professional.greeting'),
      color: 'bg-black',
      bubble: 'bg-black text-white',
      button: 'bg-black hover:bg-gray-800',
      ring: 'focus-within:ring-black',
    },
    passionate: {
      label: t('personas.passionate.label'),
      Icon: Zap,
      desc: t('personas.passionate.desc'),
      greeting: t('personas.passionate.greeting'),
      color: 'text-orange-500',
      bubble: 'bg-orange-500 text-white',
      button: 'bg-orange-500 hover:bg-orange-600',
      ring: 'focus-within:ring-orange-500',
    },
    friend: {
      label: t('personas.friend.label'),
      Icon: Coffee,
      desc: t('personas.friend.desc'),
      greeting: t('personas.friend.greeting'),
      color: 'text-emerald-500',
      bubble: 'bg-emerald-500 text-white',
      button: 'bg-emerald-500 hover:bg-emerald-600',
      ring: 'focus-within:ring-emerald-500',
    },
  }), [t]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (isOpen) setUnreadCount(0); }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, hasSelectedPersona]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'user') {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && hasSelectedPersona) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, hasSelectedPersona]);

  useEffect(() => {
    if (!isOpen) {
      const userMessages = messages.filter(m => m.role === 'user');
      if (userMessages.length === 0) return;
      const session: ChatSession = {
        id: sessionId,
        persona,
        messages,
        firstQuestion: userMessages[0]?.content || '',
        createdAt: new Date().toISOString(),
      };
      saveSession(session);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handlePersonaSelect = (selectedPersona: Persona) => {
    setSessionId(Date.now().toString());
    setPersona(selectedPersona);
    setMessages([{ id: 'welcome', role: 'assistant', content: personaConfig[selectedPersona].greeting }]);
    setHasSelectedPersona(true);
  };

  const handleLoadSession = (session: ChatSession) => {
    setSessionId(session.id);
    setPersona(session.persona);
    setMessages(session.messages);
    setHasSelectedPersona(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          persona,
          sessionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server Error: ${response.status}`);
      }
      if (!response.body) { setIsLoading(false); return; }

      const assistantMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '' }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedContent = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        accumulatedContent += decoder.decode(value, { stream: true });
        setMessages(prev =>
          prev.map(msg => msg.id === assistantMessageId ? { ...msg, content: accumulatedContent } : msg)
        );
        if (!isOpenRef.current) setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: t('chat.error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end sm:bottom-10 sm:right-10 font-[family-name:var(--font-sans)] pointer-events-none">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 h-[100dvh] z-[60] flex flex-col overflow-hidden overscroll-y-none bg-white shadow-2xl sm:absolute sm:inset-auto sm:bottom-0 sm:right-0 sm:mb-0 sm:h-[700px] sm:max-h-[75vh] sm:w-[400px] sm:rounded-[20px] sm:ring-1 sm:ring-black/5 pointer-events-auto"
          >
            {/* Header */}
            <div className="border-b border-gray-100 bg-white/80 p-4 backdrop-blur-md sticky top-0 z-10 flex flex-col gap-3 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                    <Bot size={16} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">{t('header.title')}</h3>
                    <p className="text-[10px] font-medium text-gray-400 tracking-wide">{t('header.subtitle')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 bg-gray-50 sm:bg-transparent"
                >
                  <X size={20} />
                </button>
              </div>

              {hasSelectedPersona && (
                <button
                  onClick={() => setHasSelectedPersona(false)}
                  className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-black transition-colors"
                >
                  <span className="text-xs">←</span> {t('chat.changeStyle')}
                </button>
              )}
            </div>

            {!hasSelectedPersona ? (
              <PersonaSelector
                chatHistory={chatHistory}
                personaConfig={personaConfig}
                onSelectPersona={handlePersonaSelect}
                onLoadSession={handleLoadSession}
                onDeleteSession={deleteSession}
              />
            ) : (
              <ChatInterface
                messages={messages}
                isLoading={isLoading}
                input={input}
                persona={persona}
                personaConfig={personaConfig}
                messagesEndRef={messagesEndRef}
                inputRef={inputRef}
                onInputChange={setInput}
                onSendMessage={handleSendMessage}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-2xl transition-all hover:bg-gray-900 ring-1 ring-white/20 pointer-events-auto"
          >
            {isLoading && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500"></span>
              </span>
            )}
            {!isLoading && unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
            <MessageCircle size={24} fill="currentColor" className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
