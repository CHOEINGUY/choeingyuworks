'use client';

import { motion } from 'framer-motion';
import { History, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ChatSession, PersonaConfig, Persona } from './types';

interface Props {
  chatHistory: ChatSession[];
  personaConfig: PersonaConfig;
  onSelectPersona: (persona: Persona) => void;
  onLoadSession: (session: ChatSession) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

export function PersonaSelector({ chatHistory, personaConfig, onSelectPersona, onLoadSession, onDeleteSession }: Props) {
  const t = useTranslations('chatbot');

  return (
    <div className="flex-1 p-5 flex flex-col justify-center bg-gray-50/50 overflow-y-auto overscroll-y-contain">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t('personaSelection.title')}</h2>
        <p className="text-sm text-gray-500">{t('personaSelection.description')}</p>
      </div>

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
                  onClick={() => onLoadSession(session)}
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
                    onClick={(e) => onDeleteSession(session.id, e)}
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
        {(Object.keys(personaConfig) as Persona[]).map((mode) => {
          const P = personaConfig[mode];
          const Icon = P.Icon;
          return (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPersona(mode)}
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
  );
}
