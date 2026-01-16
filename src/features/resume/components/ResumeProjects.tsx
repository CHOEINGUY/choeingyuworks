"use client";

import { useTranslations, useLocale } from "next-intl";
import { Project } from "@/types";

interface ResumeProjectsProps {
    projects: Project[];
}

export const ResumeProjects = ({ projects }: ResumeProjectsProps) => {
    const t = useTranslations("Resume");
    const locale = useLocale();

    return (
        <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">
                <a href="https://choeingyu.works/ko?tab=portfolio" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                    {t('projects')}
                    <span className="text-xs relative -top-[2px] opacity-70 whitespace-nowrap">{"\u00A0"}↗</span>
                </a>
            </h2>
            <div className="space-y-8">
                {projects?.map((project: Project, index: number) => (
                    <div key={index} className="group">
                        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2 gap-1 md:gap-0">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                {project.name.split(/(\[.+?\]\(\/portfolio\/.+?\))/).map((part: string, i: number) => {
                                    const match = part.match(/\[(.+?)\]\((.+?)\)/);
                                    if (match) {
                                        const isInternal = match[2].startsWith('/');
                                        if (isInternal) {
                                            // 새 창에서 열면서 현재 언어 유지
                                            const localizedUrl = `/${locale}${match[2]}`;
                                            return (
                                                    <a key={i} href={localizedUrl} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-blue-600 transition-colors inline">
                                                        {match[1].split(/(\(.+?\))/).map((subPart, j) => 
                                                            subPart.startsWith('(') && subPart.endsWith(')') ? (
                                                                <span key={j} className="relative -top-[0.5px]">{subPart}</span>
                                                            ) : subPart
                                                        )}
                                                        <span className="text-xs relative -top-[2px] opacity-70 whitespace-nowrap">{"\u00A0"}↗</span>
                                                    </a>
                                            );
                                        }
                                        return (
                                            <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-blue-600 transition-colors inline">
                                                {match[1].split(/(\(.+?\))/).map((subPart, j) => 
                                                    subPart.startsWith('(') && subPart.endsWith(')') ? (
                                                        <span key={j} className="relative -top-[0.5px]">{subPart}</span>
                                                    ) : subPart
                                                )}
                                                <span className="text-xs relative -top-[2px] opacity-70 whitespace-nowrap">{"\u00A0"}↗</span>
                                            </a>
                                        );
                                    }
                                    return part;
                                })}
                            </h3>
                            <span className="text-xs md:text-sm text-gray-500 md:text-gray-400 font-mono whitespace-nowrap">{project.period}</span>
                        </div>
                        <ul className="space-y-2 list-disc list-outside ml-4 text-sm md:text-base text-gray-600 leading-relaxed marker:text-gray-400 mt-2 break-keep">
                            {project.description.map((item: string, i: number) => {
                                const parts = item.split(" : ");
                                const title = parts[0];
                                const content = parts.slice(1).join(" : ");
                                
                                return (
                                    <li key={i} className="pl-1">
                                        {content ? (
                                            <>
                                                <span className="text-gray-900">{title} :</span> {content}
                                            </>
                                        ) : (
                                            item
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
};
