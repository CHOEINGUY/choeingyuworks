"use client";

interface ResumeSectionBlockProps {
    number: number;
    title: string;
    children: React.ReactNode;
    pageBreak?: boolean;
}

export const ResumeSectionBlock = ({ number, title, children, pageBreak = true }: ResumeSectionBlockProps) => {
    return (
        <section className={pageBreak ? "print:break-before-page" : ""}>
            <div className="flex items-center gap-3 mb-8">
                <span className="text-xs font-mono text-gray-400">{String(number).padStart(2, '0')}</span>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h2>
                <div className="flex-1 h-px bg-gray-200" />
            </div>
            {children}
        </section>
    );
};
