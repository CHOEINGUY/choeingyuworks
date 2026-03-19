"use client";

interface ResumeHeaderProps {
    data: {
        name: string;
        role: string;
        birthYear?: string;
        birthDate?: string;
        veteranStatus?: string;
        disabilityStatus?: string;
        military?: {
            status: string;
            reason: string;
        };
        languages?: Array<{
            language: string;
            level: string;
            description: string;
        }>;
    };
    commonData: {
        email: string;
        phone?: string;
    };
}

export const ResumeHeader = ({ data, commonData }: ResumeHeaderProps) => {
    // Voithru 모드: birthDate가 있으면 상세 표시
    const displayBirth = data.birthDate || data.birthYear;
    const hasExtendedInfo = data.veteranStatus || data.military || data.languages;

    return (
        <header className="space-y-4">
            <div className="flex flex-row items-start gap-4 md:gap-8">
                <div className="flex-1 text-left flex flex-col justify-center space-y-0.5">
                    <h1 className="text-xl md:text-[2em] font-bold leading-tight md:leading-[1.25em] tracking-tight text-gray-900 mb-0.5">
                        {data.name}
                    </h1>
                    <p className="text-sm md:text-[1.25em] leading-snug md:leading-[1.5em] text-gray-600 font-medium">
                        {data.role}
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2 text-xs md:text-base text-gray-500 mt-1">
                        <a href={`mailto:${commonData.email}`} className="hover:text-black transition-colors">
                            {commonData.email}
                        </a>
                        {commonData.phone && (
                            <>
                                <span className="hidden md:inline text-gray-400">|</span>
                                <span>{commonData.phone}</span>
                            </>
                        )}
                        {displayBirth && (
                            <>
                                <span className="hidden md:inline text-gray-400">|</span>
                                <span>{displayBirth}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Voithru 필수 기재 사항 (상세) */}
            {hasExtendedInfo && (
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-2 print:bg-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                        {data.veteranStatus && (
                            <div className="flex gap-2">
                                <span className="text-gray-400 min-w-[80px]">보훈 여부</span>
                                <span className="text-gray-700">{data.veteranStatus}</span>
                            </div>
                        )}
                        {data.disabilityStatus && (
                            <div className="flex gap-2">
                                <span className="text-gray-400 min-w-[80px]">장애 여부</span>
                                <span className="text-gray-700">{data.disabilityStatus}</span>
                            </div>
                        )}
                        {data.military && (
                            <div className="flex gap-2">
                                <span className="text-gray-400 min-w-[80px]">병역 사항</span>
                                <span className="text-gray-700">{data.military.status} ({data.military.reason})</span>
                            </div>
                        )}
                        {data.languages && data.languages.length > 0 && (
                            <div className="flex gap-2">
                                <span className="text-gray-400 min-w-[80px]">외국어</span>
                                <span className="text-gray-700">
                                    {data.languages.map(lang => `${lang.language}: ${lang.level}`).join(', ')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};
