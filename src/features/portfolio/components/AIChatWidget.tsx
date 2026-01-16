'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Bot, Sparkles, ArrowUp, Briefcase, Zap, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Manual Message Type Definition
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState<'professional' | 'passionate' | 'friend'>('professional');
  const [hasSelectedPersona, setHasSelectedPersona] = useState(false);
  const [provider, setProvider] = useState<'openai' | 'gemini'>('gemini'); // Default to Gemini
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '안녕하세요. 최인규의 AI 어시스턴트입니다.\n이력서와 포트폴리오에 대해 무엇이든 물어보세요.',
    },
  ]);

  const personaConfig = {
    professional: {
        label: 'Professional',
        Icon: Briefcase,
        desc: '정중하고 명확하게',
        greeting: '안녕하세요. 최인규의 포트폴리오 AI 어시스턴트입니다.\n비즈니스 관점에서 정중하고 명확하게 답변해 드리겠습니다.',
        color: 'bg-black',
        bubble: 'bg-black text-white',
        button: 'bg-black hover:bg-gray-800',
        ring: 'focus-within:ring-black'
    },
    passionate: {
        label: 'Passionate',
        Icon: Zap,
        desc: '열정적이고 에너지 넘치게',
        greeting: '반갑습니다! 🔥\n문제 해결에 진심인 개발자 최인규의 열정을 담아 에너제틱하게 답변드릴게요!',
        color: 'text-orange-500',
        bubble: 'bg-orange-500 text-white',
        button: 'bg-orange-500 hover:bg-orange-600',
        ring: 'focus-within:ring-orange-500'
    },
    friend: {
        label: 'Coffee Chat',
        Icon: Coffee,
        desc: '편안한 동료 모드',
        greeting: '안녕? 반가워! ☕\n가벼운 커피챗 하듯이 편하게 물어봐줘. 친절하게 알려줄게!',
        color: 'text-emerald-500',
        bubble: 'bg-emerald-500 text-white',
        button: 'bg-emerald-500 hover:bg-emerald-600',
        ring: 'focus-within:ring-emerald-500'
    }
  };

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

  // Reset selection on close
  useEffect(() => {
    if (!isOpen) {
        setTimeout(() => setHasSelectedPersona(false), 300); // Reset after animation
    }
  }, [isOpen]);

  const handlePersonaSelect = (selectedPersona: 'professional' | 'passionate' | 'friend') => {
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
           persona: persona // Send selected persona
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      if (!response.body) return;

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
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end sm:bottom-10 sm:right-10 font-[family-name:var(--font-sans)]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="mb-6 flex h-[600px] max-h-[70vh] w-[calc(100vw-48px)] sm:w-[400px] flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="border-b border-gray-100 bg-white/80 p-4 backdrop-blur-md sticky top-0 z-10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                      <Bot size={16} strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 leading-tight">AI Assistant</h3>
                      <p className="text-[10px] font-medium text-gray-400 tracking-wide uppercase">Choeingyu Works</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Model Switcher - Always visible */}
                     <button 
                      onClick={() => setProvider(prev => prev === 'openai' ? 'gemini' : 'openai')}
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                        provider === 'openai' 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'bg-purple-50 text-purple-600'
                      }`}
                    >
                      {provider === 'openai' ? 'GPT-4o' : 'Gemini'}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                        <X size={18} />
                    </button>
                  </div>
              </div>
              
              {/* Reset to Persona Selection (Only visible in chat) */}
              {hasSelectedPersona && (
                 <button 
                    onClick={() => setHasSelectedPersona(false)}
                    className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-black transition-colors"
                 >
                    <span className="text-xs">←</span> 스타일 변경하기
                 </button>
              )}
            </div>

            {!hasSelectedPersona ? (
                // --- SCREEN 1: PERSONA SELECTION ---
                <div className="flex-1 p-5 flex flex-col justify-center bg-gray-50/50">
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">대화 스타일 선택</h2>
                        <p className="text-sm text-gray-500">어떤 스타일로 대화하시겠어요?</p>
                    </div>
                    
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
                <div className="flex-1 overflow-y-auto bg-[#fafafa] p-5 scrollbar-thin">
                <div className="space-y-6">
                    {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`flex items-start gap-3 ${
                        m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                    >
                        <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[10px] uppercase tracking-tighter ${
                            m.role === 'user'
                            ? `border-transparent ${personaConfig[persona].bubble}` // Dynamic Bubble Color
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                        >
                        {m.role === 'user' ? 'ME' : 'AI'}
                        </div>
                        <div
                        className={`max-w-[85%] rounded-2xl px-5 py-3 text-[14px] leading-relaxed shadow-sm ${
                            m.role === 'user'
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
                <div className="p-4 bg-white border-t border-gray-100">
                <form
                    onSubmit={handleSendMessage}
                    className={`relative flex items-center rounded-[24px] bg-gray-50 ring-1 ring-gray-200 focus-within:ring-2 focus-within:bg-white transition-all overflow-hidden ${personaConfig[persona].ring}`}
                >
                    <input
                    ref={inputRef}
                    className="flex-1 bg-transparent px-5 py-4 text-[14px] outline-none placeholder:text-gray-400 text-gray-900 font-medium"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="무엇이든 물어보세요..."
                    />
                    <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className={`mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:scale-100 ${personaConfig[persona].button}`}
                    >
                    <ArrowUp size={16} strokeWidth={3} />
                    </button>
                </form>
                
                  <div className="mt-3 text-center">
                    <p className="inline-flex items-center gap-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                      <Sparkles size={10} />
                      Powered by AI & RAG System
                    </p>
                  </div>
                </div>
                </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-2xl transition-all hover:bg-gray-900 ring-1 ring-white/20"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="close"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} fill="currentColor" className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Notification Badge */}

      </motion.button>
    </div>
  );
}
