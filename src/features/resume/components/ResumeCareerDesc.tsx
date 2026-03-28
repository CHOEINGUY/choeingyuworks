"use client";

import { useLocale } from "next-intl";

interface CareerDescProject {
    title: string;
    period?: string;
    content: string;
    link?: string;
    githubLink?: string;
    blogLink?: string;
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
                        <div className="flex items-center gap-2">
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
                            {project.githubLink && (
                                <a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="GitHub"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 translate-y-0.5">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                </a>
                            )}
                            {project.blogLink && (
                                <a
                                    href={project.blogLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="블로그"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                                        <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                    </svg>
                                </a>
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
