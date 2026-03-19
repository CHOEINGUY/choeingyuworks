"use client";

interface ResumeCoverLetterProps {
    content: string;
}

export const ResumeCoverLetter = ({ content }: ResumeCoverLetterProps) => {
    if (!content) return null;

    const renderLine = (line: string, idx: number) => {
        const boldMatch = line.match(/^\*\*(.+)\*\*$/);
        if (boldMatch) {
            return <p key={idx} className="font-semibold text-gray-900 mt-6 first:mt-0">{boldMatch[1]}</p>;
        }
        if (line === "") return <div key={idx} className="h-2" />;
        return <p key={idx}>{line}</p>;
    };

    const renderContent = (text: string) => {
        const parts = text.split(/\n---\n/);
        return (
            <div className="space-y-6">
                {parts.map((part, i) => (
                    <div key={i}>
                        {i > 0 && <hr className="border-gray-200 mb-6" />}
                        <div className="space-y-2 leading-relaxed">
                            {part.split("\n").map((line, idx) => renderLine(line, idx))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="text-gray-700 leading-relaxed text-sm md:text-base break-keep">
            {renderContent(content)}
        </div>
    );
};
