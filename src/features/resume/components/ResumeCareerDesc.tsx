"use client";

interface CareerDescProject {
    title: string;
    period?: string;
    content: string;
}

interface ResumeCareerDescProps {
    projects: CareerDescProject[];
}

export const ResumeCareerDesc = ({ projects }: ResumeCareerDescProps) => {
    if (!projects || projects.length === 0) return null;

    return (
        <div className="space-y-10">
            {projects.map((project, index) => (
                <div key={index} className="space-y-2">
                    <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base">{project.title}</h3>
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
