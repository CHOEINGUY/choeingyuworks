"use client";

import { Link } from "@/navigation";
import { Infinity as InfinityIcon, Share2, Printer } from "lucide-react";

interface ResumeNavbarProps {
    onShareClick: () => void;
    onPrintClick: () => void;
    targetCompany?: string;
}

export const ResumeNavbar = ({ onShareClick, onPrintClick, targetCompany }: ResumeNavbarProps) => {
    const homeLink = targetCompany ? `/${targetCompany}` : "/";

    const LogoContent = (
        <div className="flex items-center gap-2 group cursor-pointer">
            <div className="flex items-center gap-2">
                <InfinityIcon className="w-8 h-8 text-[#333] stroke-[3px]" />
                <div className="flex items-center">
                    <span className="font-bold text-2xl tracking-tighter text-[#333]">Choeingyu</span>
                    <span className="w-0 opacity-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-2xl tracking-tighter text-[#333]">
                        &nbsp;Works
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 print:hidden">
            <div className="w-full px-6 h-16 flex items-center justify-between">
                <Link href={homeLink} className="flex items-center gap-2 group">
                    {LogoContent}
                </Link>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onShareClick}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
                        title="Share"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onPrintClick}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
                        title="Print / Save PDF"
                    >
                        <Printer className="w-5 h-5" />
                    </button>

                </div>
            </div>
        </div>
    );
};
