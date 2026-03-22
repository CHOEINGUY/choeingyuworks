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

    return (
        <div className="text-gray-700 leading-relaxed text-sm md:text-base space-y-2">
            {content.split("\n").map((line, idx) => renderLine(line, idx))}
        </div>
    );
};
