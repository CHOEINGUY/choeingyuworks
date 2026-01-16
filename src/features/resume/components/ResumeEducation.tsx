"use client";

import { useTranslations } from "next-intl";

interface ResumeEducationProps {
    education: {
        school: string;
        major: string;
        period: string;
    }[];
}

export const ResumeEducation = ({ education }: ResumeEducationProps) => {
    const t = useTranslations("Resume");

    return (
        <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">{t('education')}</h2>
            <div className="space-y-8">
                {education.map((edu, index) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 md:gap-0">
                        <div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900">{edu.school}</h3>
                            <p className="text-sm md:text-base text-gray-600 font-medium">{edu.major}</p>
                        </div>
                        <span className="text-xs md:text-sm text-gray-500 md:text-gray-400 font-mono">{edu.period}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};
