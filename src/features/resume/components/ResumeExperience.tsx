"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

interface ResumeExperienceProps {
    experience: any[]; // Using any[] for flexibility with varying data structures, refined type recommended later
}

export const ResumeExperience = ({ experience }: ResumeExperienceProps) => {
    const t = useTranslations("Resume");

    const renderRichText = (text: string) => {
        return text.split(/(\[[^\]]+\]\([^)]+\))/).map((part, i) => {
            const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (linkMatch) {
                const isInternal = linkMatch[2].startsWith('/');
                if (isInternal) {
                    return (
                        <Link key={i} href={linkMatch[2] as any} className="text-gray-700 hover:text-blue-600 transition-colors font-medium inline">
                            {linkMatch[1]}
                            <span className="text-[10px] relative -top-[1.5px] opacity-70 whitespace-nowrap">{"\u00A0"}↗</span>
                        </Link>
                    );
                }
                return (
                    <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors font-medium inline">
                        {linkMatch[1]}
                        <span className="text-[10px] relative -top-[1.5px] opacity-70 whitespace-nowrap">{"\u00A0"}↗</span>
                    </a>
                );
            }
            
            // Handle bold text parsing for non-link parts
            return part.split(/(\*\*.*?\*\*)/).map((subPart, j) => {
                if (subPart.startsWith('**') && subPart.endsWith('**')) {
                    return <strong key={`${i}-${j}`} className="font-bold text-gray-900">{subPart.slice(2, -2)}</strong>;
                }
                return subPart;
            });
        });
    };

    return (
        <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 border-b border-gray-300 pb-2">{t('experience')}</h2>

            <div className="space-y-12">
                {experience.map((exp: any, index: number) => (
                    <div key={index} className="group">
                        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2 gap-1 md:gap-0">
                            <div className="flex flex-col md:flex-row md:items-baseline gap-0 md:gap-2 flex-wrap">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900">{exp.company}</h3>
                                <span className="hidden md:inline text-gray-400">|</span>
                                <span className="text-sm md:text-base font-medium text-gray-500">{exp.position}</span>
                            </div>
                            <span className="text-xs md:text-sm text-gray-500 md:text-gray-400 font-mono whitespace-nowrap">{exp.period}</span>
                        </div>

                        {/* Main Description */}
                        {exp.description && exp.description.length > 0 && (
                            <ul className="space-y-2 list-disc list-outside ml-4 text-sm md:text-base text-gray-600 leading-relaxed marker:text-gray-400 mt-4 mb-6 break-keep">
                                {exp.description.map((item: string, i: number) => {
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
                        )}

                        {/* Sub Projects (Job Areas) */}
                        {exp.projects && (
                            <div className="space-y-6 mt-4 pl-1 md:pl-4 border-l-2 border-gray-100">
                                {exp.projects.map((project: any, pIndex: number) => (
                                        <div key={pIndex}>
                                        <div className="flex items-baseline justify-between gap-2 mb-2">
                                            <h4 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
                                                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                                {project.title}
                                            </h4>
                                            {project.period && (
                                                <span className="text-xs md:text-sm text-gray-400 font-mono whitespace-nowrap">{project.period}</span>
                                            )}
                                        </div>
                                        <ul className="space-y-1.5 list-none ml-2 text-sm md:text-base text-gray-600 leading-relaxed break-keep">
                                            {project.details.map((detail: string, dIndex: number) => {
                                                const isSubItem = detail.startsWith("  ");
                                                const cleanDetail = detail.trim();
                                                const parts = cleanDetail.split(" : ");
                                                const title = parts[0];
                                                const content = parts.slice(1).join(" : ");

                                                return (
                                                    <li 
                                                        key={dIndex} 
                                                        className={`relative pl-4 before:absolute before:left-0 before:text-gray-400 ${
                                                            isSubItem 
                                                                ? "ml-4 before:content-['◦'] before:font-bold" // Indented sub-item with hollow bullet
                                                                : "before:content-['-']" // Standard item
                                                        }`}
                                                    >
                                                        {content ? (
                                                            <>
                                                                <span className="text-gray-900">{title} :</span> {renderRichText(content)}
                                                            </>
                                                        ) : (
                                                            renderRichText(cleanDetail)
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};
