"use client";

import { useRef, useState, useEffect } from "react";
import { useLocale } from "next-intl";

import { RESUME_DATA_V2 } from "../data/resumeData";
import { ResumeNavbar } from "./ResumeNavbar";
import { ResumeHeader } from "./ResumeHeader";
import { ResumeSectionBlock } from "./ResumeSectionBlock";
import { ResumeCoverLetter } from "./ResumeCoverLetter";
import { ResumeExperience } from "./ResumeExperience";
import { ResumeProjects } from "./ResumeProjects";
import { ResumeSkills } from "./ResumeSkills";
import { ResumeCareerDesc } from "./ResumeCareerDesc";
import { ResumeQuestions } from "./ResumeQuestions";
import { ResumeQRCode } from "./ResumeQRCode";
import { ResumeShareModal } from "./ResumeShareModal";

interface ResumeV2Props {
    data?: any;
    targetCompany?: string;
}

export function ResumeV2({ data, targetCompany }: ResumeV2Props) {
    const locale = useLocale();
    const sourceData = data || RESUME_DATA_V2;
    const currentData = (sourceData as any)[locale as 'ko' | 'en'] || sourceData.en || sourceData.ko;
    const commonData = sourceData.common;

    const resumeRef = useRef<HTMLDivElement>(null);
    const [today, setToday] = useState("");
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    useEffect(() => {
        const date = new Date();
        setToday(new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(date));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale]);

    const handlePrint = () => window.print();

    const handleShare = () => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const shareData = {
            title: `${currentData.name} - ${currentData.role}`,
            text: currentData.role,
            url: window.location.href
        };
        if (isMobile && navigator.share) {
            navigator.share(shareData).catch(console.error);
            return;
        }
        setIsShareModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-white print:bg-white font-sans text-gray-900 selection:bg-gray-100 relative">

            <ResumeNavbar
                onShareClick={handleShare}
                onPrintClick={handlePrint}
                targetCompany={targetCompany}
            />

            <div className="pt-10 pb-20 px-4 md:px-12 print:p-0 print:pt-4">
                <div ref={resumeRef} className="max-w-4xl mx-auto space-y-16 bg-white p-4 md:p-12 print:p-0 print:max-w-none print:space-y-12">

                    {/* 헤더 - 모든 섹션 공통 */}
                    <ResumeHeader data={currentData} commonData={commonData} />

                    {/* 1. 커버레터 */}
                    <ResumeSectionBlock number={1} title="커버레터" pageBreak={false}>
                        <ResumeCoverLetter content={currentData.coverLetter} />
                    </ResumeSectionBlock>

                    {/* 2. 이력서 */}
                    <ResumeSectionBlock number={2} title="이력서">
                        <div className="space-y-12">
                            <ResumeExperience experience={currentData.experience} />
                            <ResumeSkills skills={currentData.skills} />
                        </div>
                    </ResumeSectionBlock>

                    {/* 3. 경력기술서 */}
                    <ResumeSectionBlock number={3} title="경력기술서">
                        <ResumeCareerDesc projects={currentData.careerDesc || []} />
                    </ResumeSectionBlock>

                    {/* 4. 질문 */}
                    <ResumeSectionBlock number={4} title="질문">
                        <ResumeQuestions questions={currentData.questions || []} />
                    </ResumeSectionBlock>

                    {/* 5. 연락처 */}
                    <ResumeSectionBlock number={5} title="연락처">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm md:text-base text-gray-700">
                            {[
                                { label: "Email", href: `mailto:${commonData.email}`, text: commonData.email },
                                { label: "Phone", href: null, text: commonData.phone },
                                { label: "GitHub", href: commonData.github, text: commonData.github },
                                { label: "홈페이지", href: (commonData as any).homepage, text: (commonData as any).homepage },
                                { label: "크몽", href: (commonData as any).kmong, text: (commonData as any).kmong },
                            ].filter(item => item.text).map((item, i) => (
                                <div key={i} className="break-all">
                                    <p className="font-semibold text-gray-900 mb-0.5">{item.label}</p>
                                    {item.href ? (
                                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors inline-block">
                                            {item.text} <span className="text-[10px] ml-0.5">↗</span>
                                        </a>
                                    ) : (
                                        <p>{item.text}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ResumeSectionBlock>

                </div>

                {/* 인쇄 푸터 */}
                <div className="hidden print:flex w-full flex-col justify-center items-center mt-8 mb-8 text-sm text-black font-medium">
                    <span className="mb-6">{today}</span>
                    <ResumeQRCode />
                </div>
            </div>

            <ResumeShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                data={{ name: currentData.name, role: currentData.role }}
            />
        </div>
    );
}
