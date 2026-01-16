"use client";

interface ResumeHeaderProps {
    data: {
        name: string;
        role: string;
        location: string;
        birthYear?: string;
    };
    commonData: {
        email: string;
    };
}

export const ResumeHeader = ({ data, commonData }: ResumeHeaderProps) => {
    return (
        <header className="flex flex-row items-start gap-4 md:gap-8">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                <img 
                    src="/profile.jpg" 
                    alt={data.name} 
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-1 text-left flex flex-col justify-center space-y-0.5">
                <h1 className="text-xl md:text-[2em] font-bold leading-tight md:leading-[1.25em] tracking-tight text-gray-900 mb-0.5">
                    {data.name}
                </h1>
                <p className="text-sm md:text-[1.25em] leading-snug md:leading-[1.5em] text-gray-600 font-medium">
                    {data.role}
                </p>
                <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2 text-xs md:text-base text-gray-500 mt-1">
                    <span>{data.location}</span>
                    <span className="hidden md:inline text-gray-400">|</span>
                    <a href={`mailto:${commonData.email}`} className="hover:text-black transition-colors">
                        {commonData.email}
                    </a>
                    {data.birthYear && (
                        <>
                            <span className="hidden md:inline text-gray-400">|</span>
                            <span>{data.birthYear}</span>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};
