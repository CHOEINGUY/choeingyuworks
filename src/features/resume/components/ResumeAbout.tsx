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
            <div className="text-gray-600 leading-relaxed text-sm md:text-base space-y-4">
                {about.split('\n\n').map((paragraph: string, index: number) => {
                    const cleanParagraph = paragraph.trim();
                    const isBullet = cleanParagraph.startsWith('•');
                    
                    if (isBullet) {
                        // Remove the dot and following space/nbsp
                        const textContent = cleanParagraph.replace(/^•\s*/, '');
                        return (
                            <ul key={index} className="list-disc list-outside ml-4 marker:text-gray-400">
                                <li className="pl-1">
                                    {textContent.split(/(\*\*.*?\*\*)/).map((part, i) => 
                                        part.startsWith('**') && part.endsWith('**') ? (
                                            <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>
                                        ) : (
                                            part
                                        )
                                    )}
                                </li>
                            </ul>
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
