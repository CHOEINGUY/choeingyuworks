"use client";

interface ResumeQuestionsProps {
    questions: string[];
}

export const ResumeQuestions = ({ questions }: ResumeQuestionsProps) => {
    if (!questions || questions.length === 0) return null;

    return (
        <ol className="space-y-7 list-decimal list-outside ml-4">
            {questions.map((question, index) => {
                const [title, ...rest] = question.split('\n');
                const description = rest.join('\n');
                return (
                    <li key={index} className="text-sm md:text-base text-gray-700 leading-relaxed pl-1">
                        <span className="font-semibold text-gray-900">{title}</span>
                        {description && <><br /><span>{description}</span></>}
                    </li>
                );
            })}
        </ol>
    );
};
