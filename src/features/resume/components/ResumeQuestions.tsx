"use client";

interface ResumeQuestionsProps {
    questions: string[];
}

export const ResumeQuestions = ({ questions }: ResumeQuestionsProps) => {
    if (!questions || questions.length === 0) return null;

    return (
        <ol className="space-y-4 list-decimal list-outside ml-4">
            {questions.map((question, index) => (
                <li key={index} className="text-sm md:text-base text-gray-700 leading-relaxed pl-1">
                    {question}
                </li>
            ))}
        </ol>
    );
};
