"use client";

import { useLocale } from "next-intl";

interface CareerDescProject {
    title: string;
    period?: string;
    content: string;
    link?: string;
}

interface ResumeCareerDescProps {
    projects: CareerDescProject[];
}

export const ResumeCareerDesc = ({ projects }: ResumeCareerDescProps) => {
    const locale = useLocale();
    if (!projects || projects.length === 0) return null;

    return (
        <div className="space-y-10">
            {projects.map((project, index) => (
                <div key={index} className="space-y-2">
                    <div className="flex items-baseline justify-between gap-4">
                        <div className="flex items-baseline gap-2">
                            {project.link ? (
                                <a
                                    href={project.link!.startsWith("http") ? project.link! : `/${locale}${project.link}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-gray-900 text-sm md:text-base hover:text-blue-600 transition-colors"
                                >
                                    {project.title} <span className="text-xs text-gray-400">↗</span>
                                </a>
                            ) : (
                                <h3 className="font-semibold text-gray-900 text-sm md:text-base">{project.title}</h3>
                            )}
                        </div>
                        {project.period && (
                            <span className="text-xs text-gray-400 whitespace-nowrap">{project.period}</span>
                        )}
                    </div>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line break-keep">
                        {project.content}
                    </p>
                </div>
            ))}
        </div>
    );
};
