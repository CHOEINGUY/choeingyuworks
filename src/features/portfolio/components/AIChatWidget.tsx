'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Bot, Sparkles, ArrowUp } from 'lucide-react';
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
  const [provider, setProvider] = useState<'openai' | 'gemini'>('gemini'); // Default to Gemini
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '안녕하세요. 최인규의 AI 어시스턴트입니다.\n이력서와 포트폴리오에 대해 무엇이든 물어보세요.',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

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
           provider: provider // Send selected provider
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
            className="mb-6 flex h-[600px] w-full max-w-[400px] flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl ring-1 ring-black/5 sm:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-white/80 p-5 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                  <Bot size={20} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">AI Assistant</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-medium text-gray-400 tracking-wide uppercase">Choeingyu Works</p>
                    <span className="text-[10px] text-gray-300">|</span>
                    {/* Model Selector */}
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
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

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
                          ? 'bg-black border-black text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    >
                      {m.role === 'user' ? 'ME' : 'AI'}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-3 text-[14px] leading-relaxed shadow-sm ${
                        m.role === 'user'
                          ? 'bg-black text-white rounded-tr-sm'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-medium">
                        {m.content}
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
                className="relative flex items-center rounded-[24px] bg-gray-50 ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-black focus-within:bg-white transition-all overflow-hidden"
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
                  className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white transition-all hover:bg-gray-800 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:scale-100"
                >
                  <ArrowUp size={16} strokeWidth={3} />
                </button>
              </form>
              <div className="mt-3 text-center">
                <p className="inline-flex items-center gap-1.5 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                  <Sparkles size={10} />
                  Powered by GPT-4o & RAG
                </p>
              </div>
            </div>
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
        {!isOpen && (
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gray-400 opacity-75"></span>
            <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 border-2 border-white"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
