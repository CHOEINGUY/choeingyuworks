'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { MessageCircle, X, Bot, Sparkles, ArrowUp, Briefcase, Zap, Coffee, History, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

// Manual Message Type Definition
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

// Chat Session Type for History
type ChatSession = {
  id: string;
  persona: 'professional' | 'passionate' | 'friend';
  messages: Message[];
  firstQuestion: string;
  createdAt: string; // ISO string
};

const CHAT_HISTORY_KEY = 'choeingyu-chat-history';
const MAX_HISTORY_COUNT = 10;

export function AIChatWidget() {
  const t = useTranslations('chatbot');

  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(isOpen);

  // Track isOpen in ref for async access
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState<'professional' | 'passionate' | 'friend'>('professional');
  const [hasSelectedPersona, setHasSelectedPersona] = useState(false);
  const [sessionId, setSessionId] = useState(() => Date.now().toString());
  const [provider, setProvider] = useState<'openai' | 'claude'>('openai');
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);

  // Initialize messages with translated welcome message
  const getInitialMessages = useCallback((): Message[] => [{
    id: 'welcome',
    role: 'assistant',
    content: t('chat.welcome'),
  }], [t]);

  const [messages, setMessages] = useState<Message[]>(getInitialMessages);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_HISTORY_KEY);
      if (saved) {
        setChatHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
  }, []);

  // Save current session to history when closing chat (if has meaningful conversation)
  const saveCurrentSession = useCallback(() => {
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) return; // No user messages, don't save

    const firstQuestion = userMessages[0]?.content || '';
    const newSession: ChatSession = {
      id: sessionId,
      persona,
      messages,
      firstQuestion,
      createdAt: new Date().toISOString(),
    };

    setChatHistory(prev => {
      // Check if session already exists (update) or new
      const existingIndex = prev.findIndex(s => s.id === sessionId);
      let updated;
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = newSession;
      } else {
        updated = [newSession, ...prev].slice(0, MAX_HISTORY_COUNT);
      }
      // Save to localStorage
      try {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save chat history:', e);
      }
      return updated;
    });
  }, [messages, sessionId, persona]);

  // Load a previous session
  const loadSession = (session: ChatSession) => {
    setSessionId(session.id);
    setPersona(session.persona);
    setMessages(session.messages);
    setHasSelectedPersona(true);
  };

  // Delete a session from history
  const deleteSession = (sessionIdToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatHistory(prev => {
      const updated = prev.filter(s => s.id !== sessionIdToDelete);
      try {
        localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to update chat history:', err);
      }
      return updated;
    });
  };

  // Persona config with i18n
  const personaConfig = useMemo(() => ({
    professional: {
      label: t('personas.professional.label'),
      Icon: Briefcase,
      desc: t('personas.professional.desc'),
      greeting: t('personas.professional.greeting'),
      color: 'bg-black',
      bubble: 'bg-black text-white',
      button: 'bg-black hover:bg-gray-800',
      ring: 'focus-within:ring-black'
    },
    passionate: {
      label: t('personas.passionate.label'),
      Icon: Zap,
      desc: t('personas.passionate.desc'),
      greeting: t('personas.passionate.greeting'),
      color: 'text-orange-500',
      bubble: 'bg-orange-500 text-white',
      button: 'bg-orange-500 hover:bg-orange-600',
      ring: 'focus-within:ring-orange-500'
    },
    friend: {
      label: t('personas.friend.label'),
      Icon: Coffee,
      desc: t('personas.friend.desc'),
      greeting: t('personas.friend.greeting'),
      color: 'text-emerald-500',
      bubble: 'bg-emerald-500 text-white',
      button: 'bg-emerald-500 hover:bg-emerald-600',
      ring: 'focus-within:ring-emerald-500'
    }
  }), [t]);

  // Reset unread count when opening
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, hasSelectedPersona]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && hasSelectedPersona) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, hasSelectedPersona]);

  // Save session and reset on close
  // Save session on close (Minimize behavior)
  useEffect(() => {
    if (!isOpen) {
      saveCurrentSession();
      // Removed: setHasSelectedPersona(false); -> Keeps session active in background
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handlePersonaSelect = (selectedPersona: 'professional' | 'passionate' | 'friend') => {
    // Start a NEW session
    setSessionId(Date.now().toString());
    setPersona(selectedPersona);
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: personaConfig[selectedPersona].greeting
    }]);
    setHasSelectedPersona(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    // 1. Add User Message
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Fetch API with Provider
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          provider: provider, // Send selected provider
          persona: persona, // Send selected persona
          sessionId: sessionId // Send session ID
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server Error: ${response.status}`);
      }
      if (!response.body) {
        setIsLoading(false);
        return;
      }

      // 3. Prepare Assistant Message Placeholder
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: 'assistant', content: '' },
      ]);

      // 4. Read Stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedContent = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        accumulatedContent += chunkValue;

        // Update the last message (assistant) with accumulated content
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedContent }
              : msg
          )
        );

        // Increment unread count if chat is closed and we are receiving data
        if (!isOpenRef.current) {
          setUnreadCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: t('chat.error') },
      ]);
    } finally {
      setIsLoading(false);
    }
  };



  // Handle new conversation
  const handleNewConversation = () => {
    setMessages(getInitialMessages());
    setHasSelectedPersona(false);
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
            // Responsive Styling: Fixed Fullscreen on Mobile vs Floating Card on Desktop
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
                <div className="flex items-center gap-2">
                  {/* Model Switcher */}
                  <div className="flex bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                    <button
                      onClick={() => setProvider('openai')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${provider === 'openai'
                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                      GPT-4o
                    </button>
                    <button
                      onClick={() => setProvider('claude')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${provider === 'claude'
                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                      Claude
                    </button>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 bg-gray-50 sm:bg-transparent"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Reset to Persona Selection (Only visible in chat) */}
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
              // --- SCREEN 1: PERSONA SELECTION ---
              <div className="flex-1 p-5 flex flex-col justify-center bg-gray-50/50 overflow-y-auto overscroll-y-contain">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{t('personaSelection.title')}</h2>
                  <p className="text-sm text-gray-500">{t('personaSelection.description')}</p>
                </div>

                {/* Chat History List */}
                {chatHistory.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <History size={14} className="text-gray-400" />
                      <span className="text-xs font-medium text-gray-500">이전 대화</span>
                    </div>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto">
                      {chatHistory.map((session) => {
                        const date = new Date(session.createdAt);
                        const dateStr = `${date.getMonth() + 1}.${date.getDate()}`;
                        const personaLabel = personaConfig[session.persona]?.label || session.persona;
                        const preview = session.firstQuestion.length > 20
                          ? session.firstQuestion.substring(0, 20) + '...'
                          : session.firstQuestion;

                        return (
                          <div
                            key={session.id}
                            onClick={() => loadSession(session)}
                            className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-left group cursor-pointer"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-0.5">
                                <span>{dateStr}</span>
                                <span>·</span>
                                <span>{personaLabel}</span>
                              </div>
                              <p className="text-sm text-gray-700 truncate">{preview}</p>
                            </div>
                            <button
                              onClick={(e) => deleteSession(session.id, e)}
                              className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {chatHistory.length > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400">새로 시작</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                )}

                <div className="space-y-3">
                  {(Object.keys(personaConfig) as Array<keyof typeof personaConfig>).map((mode) => {
                    const P = personaConfig[mode];
                    const Icon = P.Icon;
                    return (
                      <motion.button
                        key={mode}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePersonaSelect(mode)}
                        className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-black/5 transition-all text-left group"
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${mode === 'professional' ? 'bg-gray-100 text-gray-900' : mode === 'passionate' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          <Icon size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm mb-0.5">{P.label}</h3>
                          <p className="text-xs text-gray-500">{P.desc}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ) : (
              // --- SCREEN 2: CHAT INTERFACE ---
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto overscroll-y-contain bg-[#fafafa] p-5 scrollbar-thin pb-20 sm:pb-5">
                  <div className="space-y-6">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                          }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[10px] uppercase tracking-tighter ${m.role === 'user'
                            ? `border-transparent ${personaConfig[persona].bubble}` // Dynamic Bubble Color
                            : 'bg-white border-gray-200 text-gray-900'
                            }`}
                        >
                          {m.role === 'user' ? 'ME' : 'AI'}
                        </div>
                        <div
                          className={`max-w-[85%] rounded-2xl px-5 py-3 text-[14px] leading-relaxed shadow-sm ${m.role === 'user'
                            ? `${personaConfig[persona].bubble} rounded-tr-sm` // Dynamic Bubble Color
                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                            }`}
                        >
                          <div className="whitespace-pre-wrap font-medium">
                            {m.content.split(/(\*\*.*?\*\*)/g).map((part, i) =>
                              part.startsWith('**') && part.endsWith('**') ? (
                                <strong key={i} className="font-bold">
                                  {part.slice(2, -2)}
                                </strong>
                              ) : (
                                <span key={i}>{part}</span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role === 'user' && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-[10px] text-gray-900">
                          AI
                        </div>
                        <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-5 py-4 shadow-sm">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></span>
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></span>
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"></span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 pb-4 sm:pb-4 bg-white border-t border-gray-100 shrink-0 safe-area-bottom" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
                  <form
                    onSubmit={handleSendMessage}
                    className={`relative flex items-center rounded-[24px] bg-gray-50 ring-1 ring-gray-200 focus-within:ring-2 focus-within:bg-white transition-all overflow-hidden ${personaConfig[persona].ring}`}
                  >
                    <input
                      ref={inputRef}
                      className="flex-1 bg-transparent pl-5 pr-12 py-4 text-[14px] outline-none placeholder:text-gray-400 text-gray-900 font-medium"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={t('chat.placeholder')}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className={`absolute right-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 ${personaConfig[persona].button}`}
                    >
                      <ArrowUp size={16} strokeWidth={3} />
                    </button>
                  </form>

                  <div className="mt-3 text-center sm:block hidden">
                    <p className="inline-flex items-center gap-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                      <Sparkles size={10} />
                      {t('chat.poweredBy')}
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button - Hidden when open, scale from origin animation */}
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
            {/* Thinking / Loading Indicator */}
            {isLoading && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500"></span>
              </span>
            )}

            {/* Unread Badge (Only if not loading) */}
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
