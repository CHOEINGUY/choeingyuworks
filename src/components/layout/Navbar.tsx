"use client";

import { Infinity as InfinityIcon, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/navigation"; // Use localized Link
import { useScroll } from "@/hooks/useScroll";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CURRENT_BRAND } from "@/config/brand";

interface NavbarProps {
    targetCompany?: string;
}

export function Navbar({ targetCompany }: NavbarProps) {
    const isScrolled = useScroll(50);
    const t = useTranslations("Navbar");
    const pathname = usePathname();

    if (pathname.includes("/resume")) {
        return null;
    }

    const logoLink = targetCompany ? `/${targetCompany}` : "/";

    // Voithru 모드일 때 resume/portfolio 링크 처리
    // 기본 모드: /resume, /?tab=portfolio
    // Voithru 모드: /voithru/resume, /voithru/portfolio
    const resumeLink = targetCompany ? `/${targetCompany}/resume` : "/resume";
    const portfolioLink = targetCompany ? `/${targetCompany}/portfolio` : "/?tab=portfolio";

    // 현재 페이지가 포트폴리오 상세인지 확인 (간단한 체크)
    const isPortfolioDetail = pathname.includes("/portfolio/");

    // 로고 컨텐츠
    const LogoContent = (
        <div className="flex items-center gap-2 md:gap-4 cursor-pointer">
            <InfinityIcon className="w-6 h-6 md:w-8 md:h-8 text-[#333] stroke-[3px]" />
            <div className="flex items-center">
                <span className="font-bold text-xl md:text-2xl tracking-tighter text-[#333]">{CURRENT_BRAND.mainText}</span>
                <span className="w-0 opacity-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-xl md:text-2xl tracking-tighter text-[#333]">
                    &nbsp;{CURRENT_BRAND.subText}
                </span>
            </div>
        </div>
    );

    return (
        <header
            className={cn(
                "fixed z-50 transition-all duration-500 ease-in-out flex items-center justify-between px-6 backdrop-blur-md left-1/2 -translate-x-1/2",
                isScrolled
                    ? "top-0 w-full max-w-[100vw] min-h-[56px] py-3 bg-white border-b border-gray-200 rounded-none shadow-sm"
                    : "top-5 w-[95%] max-w-7xl min-h-[56px] py-3 bg-white border border-gray-200/50 shadow-md rounded-2xl"
            )}
        >
            <Link href={logoLink} className="flex items-center gap-2 group">
                {LogoContent}
            </Link>

            <div className="flex items-center gap-0 md:gap-4">
                <LanguageSwitcher />
                <Link href={isPortfolioDetail ? portfolioLink : resumeLink}>
                    <Button variant="ghost" size="icon" className="md:hidden rounded-full w-9 h-9">
                        <User className="w-5 h-5 text-gray-900" />
                    </Button>
                    <Button className="rounded-full bg-black text-white px-6 hidden md:inline-flex hover:bg-[#333333] h-9 text-sm">
                        {isPortfolioDetail ? t("backToPortfolio") : t("viewResume")}
                    </Button>
                </Link>
            </div>
        </header>
    );
}
