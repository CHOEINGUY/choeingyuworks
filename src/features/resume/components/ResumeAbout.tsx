"use client";

import { useTranslations } from "next-intl";

interface ResumeAboutProps {
    about: string;
}

export const ResumeAbout = ({ about }: ResumeAboutProps) => {
    const t = useTranslations("Resume");

    return (
        <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">{t('about')}</h2>
            <div className="text-gray-700 leading-relaxed text-sm md:text-base space-y-4">
                {about.split('\n\n').map((paragraph: string, index: number) => {
                    const cleanParagraph = paragraph.trim();
                    const isBullet = cleanParagraph.startsWith('•');
                    
                    if (isBullet) {
                        // Remove the dot and following space/nbsp
                        const textContent = cleanParagraph.replace(/^•\s*/, '');
                        return (
                            <div key={index} className="flex items-start gap-2">
                                <span className="shrink-0 font-bold text-gray-900 mt-[0.1em]">•</span>
                                <p className="whitespace-pre-line flex-1">
                                    {textContent.split(/(\*\*.*?\*\*)/).map((part, i) => 
                                        part.startsWith('**') && part.endsWith('**') ? (
                                            <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>
                                        ) : (
                                            part
                                        )
                                    )}
                                </p>
                            </div>
                        );
                    }

                    return (
                        <p key={index} className="whitespace-pre-line">
                            {paragraph.split(/(\*\*.*?\*\*)/).map((part, i) => 
                                part.startsWith('**') && part.endsWith('**') ? (
                                    <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>
                                ) : (
                                    part
                                )
                            )}
                        </p>
                    );
                })}
            </div>
        </section>
    );
};
