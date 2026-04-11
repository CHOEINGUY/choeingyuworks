"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface TTSAnnouncementProps {
    ttsText: string;
}

export function TTSAnnouncement({ ttsText }: TTSAnnouncementProps) {
    const t = useTranslations("CohortDashboard.ExamFlow.TTS");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-8 left-8 z-50 pointer-events-none"
        >
            <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center gap-4 border-2 border-blue-500 max-w-sm">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                </div>
                <div>
                    <div className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">{t('label')}</div>
                    <div className="text-gray-800 text-lg font-bold leading-tight" dangerouslySetInnerHTML={{ __html: ttsText }} />
                </div>
            </div>
        </motion.div>
    );
}
