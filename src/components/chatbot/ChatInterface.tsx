'use client';

import { ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Message, Persona, PersonaConfig } from './types';

interface Props {
  messages: Message[];
  isLoading: boolean;
  input: string;
  persona: Persona;
  personaConfig: PersonaConfig;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

export function ChatInterface({
  messages, isLoading, input, persona, personaConfig,
  messagesEndRef, inputRef, onInputChange, onSendMessage,
}: Props) {
  const t = useTranslations('chatbot');

  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto overscroll-y-contain bg-[#fafafa] p-5 scrollbar-thin pb-20 sm:pb-5">
        <div className="space-y-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[10px] uppercase tracking-tighter ${
                  m.role === 'user'
                    ? `border-transparent ${personaConfig[persona].bubble}`
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                {m.role === 'user' ? 'ME' : 'AI'}
              </div>
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 text-[14px] leading-relaxed shadow-sm ${
                  m.role === 'user'
                    ? `${personaConfig[persona].bubble} rounded-tr-sm`
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                }`}
              >
                <div className="whitespace-pre-wrap font-medium">
                  {m.content.split(/(\*\*.*?\*\*)/g).map((part, i) =>
                    part.startsWith('**') && part.endsWith('**') ? (
                      <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>
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
      <div className="p-4 bg-white border-t border-gray-100 shrink-0" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <form
          onSubmit={onSendMessage}
          className={`relative flex items-center rounded-[24px] bg-gray-50 ring-1 ring-gray-200 focus-within:ring-2 focus-within:bg-white transition-all overflow-hidden ${personaConfig[persona].ring}`}
        >
          <input
            ref={inputRef}
            className="flex-1 bg-transparent pl-5 pr-12 py-4 text-[14px] outline-none placeholder:text-gray-400 text-gray-900 font-medium"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
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
      </div>
    </>
  );
}
