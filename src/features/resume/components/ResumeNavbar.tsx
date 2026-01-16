"use client";

import { Link, useRouter, usePathname } from "@/navigation";
import { useLocale } from "next-intl";
import { Infinity as InfinityIcon, Share2, Printer, Globe } from "lucide-react";

interface ResumeNavbarProps {
    onShareClick: () => void;
    onPrintClick: () => void;
}

export const ResumeNavbar = ({ onShareClick, onPrintClick }: ResumeNavbarProps) => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLanguage = () => {
        const nextLocale = locale === 'ko' ? 'en' : 'ko';
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 print:hidden">
            <div className="w-full px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex items-center gap-2">
                        <InfinityIcon className="w-8 h-8 text-[#333] stroke-[3px]" />
                        <div className="flex items-center">
                            <span className="font-bold text-2xl tracking-tighter text-[#333]">Choeingyu</span>
                            <span className="w-0 opacity-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-2xl tracking-tighter text-[#333]">
                                &nbsp;Works
                            </span>
                        </div>
                    </div>
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
                    <button
                        onClick={toggleLanguage}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors group relative"
                        title={locale === 'ko' ? "Switch to English" : "한국어로 전환"}
                    >
                        <Globe className="w-5 h-5" />
                        <span className="absolute top-full right-0 mt-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {locale === 'ko' ? "English" : "한국어"}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
