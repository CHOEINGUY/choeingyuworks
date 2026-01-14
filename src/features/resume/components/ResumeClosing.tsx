"use client";

interface ResumeClosingProps {
    closing?: string;
}

export const ResumeClosing = ({ closing }: ResumeClosingProps) => {
    if (!closing) return null;
    
    return (
        <section className="mt-12 mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-center text-gray-700 font-medium text-lg md:text-xl break-keep leading-relaxed whitespace-pre-line">
                "{closing}"
            </p>
        </section>
    );
};
