"use client";

import { useRef, useState, useEffect } from "react";
import { useLocale } from "next-intl";

import { RESUME_DATA } from "../data/resumeData";
import { ResumeNavbar } from "./ResumeNavbar";
import { ResumeHeader } from "./ResumeHeader";
import { ResumeAbout } from "./ResumeAbout";
import { ResumeEducation } from "./ResumeEducation";
import { ResumeExperience } from "./ResumeExperience";
import { ResumeProjects } from "./ResumeProjects";
import { ResumeSkills } from "./ResumeSkills";
import { ResumeContact } from "./ResumeContact";
import { ResumeClosing } from "./ResumeClosing";
import { ResumeQRCode } from "./ResumeQRCode";
import { ResumeShareModal } from "./ResumeShareModal";

export function Resume() {
    const locale = useLocale();
    const currentData = RESUME_DATA[locale as 'ko' | 'en'] || RESUME_DATA.en || RESUME_DATA.ko;
    const commonData = RESUME_DATA.common;
    
    const resumeRef = useRef<HTMLDivElement>(null);
    const [today, setToday] = useState("");
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const date = new Date();
        setToday(`${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        // Check if mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        const shareData = {
            title: `${currentData.name} - ${currentData.role}`,
            text: currentData.about.split('\n')[0], // First line of about
            url: window.location.href
        };

        // Try native share ONLY on mobile
        if (isMobile && navigator.share) {
            navigator.share(shareData).catch(console.error);
            return;
        }
        
        // Desktop: Show custom modal
        setIsShareModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-white print:bg-white font-sans text-gray-900 selection:bg-gray-100 relative">
            
            <ResumeNavbar 
                onShareClick={handleShare} 
                onPrintClick={handlePrint} 
            />

            <div className="pt-10 pb-20 px-8 md:px-12 print:p-0 print:pt-4">
                <div ref={resumeRef} className="max-w-4xl mx-auto space-y-12 bg-white p-4 md:p-12 print:p-0 print:max-w-none print:space-y-8">

                    <ResumeHeader data={currentData} commonData={commonData} />
                    
                    <ResumeAbout about={currentData.about} />
                    
                    <ResumeEducation education={currentData.education} />
                    
                    <ResumeExperience experience={currentData.experience} />
                    
                    <ResumeProjects projects={currentData.projects || []} />
                    
                    <ResumeSkills skills={currentData.skills} />
                    
                    {currentData.closing && <ResumeClosing closing={currentData.closing} />}
                    
                    <ResumeContact commonData={commonData} />

                </div>
                
                {/* Print Footer */}
                <div className="hidden print:flex w-full flex-col justify-center items-center mt-8 mb-8 text-sm text-black font-medium">
                    {/* Date - Centered */}
                    <span className="mb-6">{today}</span>

                    {/* QR Code */}
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
