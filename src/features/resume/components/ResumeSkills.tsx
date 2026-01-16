"use client";

import { useTranslations } from "next-intl";
import { Skill } from "@/types";

interface ResumeSkillsProps {
    skills: Skill[];
}

export const ResumeSkills = ({ skills }: ResumeSkillsProps) => {
    const t = useTranslations("Resume");

    return (
        <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">{t('skills')}</h2>
            <div className="space-y-6">
                {skills.map((skill: Skill, index: number) => (
                    <div key={index} className="flex flex-col md:flex-row md:items-start gap-1 md:gap-4">
                        <div className="font-bold text-gray-900 text-sm md:text-base md:w-32 md:shrink-0 break-keep">{skill.category}</div>
                        <div className="text-sm md:text-base text-gray-600 leading-relaxed w-full">
                            <ul className="list-disc list-outside ml-4 space-y-1 marker:text-gray-400 break-keep">
                                {skill.items.map((item: string, i: number) => (
                                    <li key={i} className="pl-1">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
