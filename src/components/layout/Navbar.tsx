"use client";

import { Infinity as InfinityIcon, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/navigation"; // Use localized Link
import { useScroll } from "@/hooks/useScroll";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
    const isScrolled = useScroll(50);
    const t = useTranslations("Navbar");
    const pathname = usePathname();

    if (pathname.includes("/resume")) {
        return null;
    }

    return (
        <header
            className={cn(
                "fixed z-50 transition-all duration-500 ease-in-out flex items-center justify-between px-6 backdrop-blur-md left-1/2 -translate-x-1/2",
                isScrolled
                    ? "top-0 w-full max-w-[100vw] min-h-[56px] py-3 bg-white border-b border-gray-200 rounded-none shadow-sm"
                    : "top-5 w-[95%] max-w-7xl min-h-[56px] py-3 bg-white border border-gray-200/50 shadow-md rounded-2xl"
            )}
        >
            <Link href="/" className="flex items-center gap-2 group">
                <div className="flex items-center gap-2 md:gap-4">
                    <InfinityIcon className="w-6 h-6 md:w-8 md:h-8 text-[#333] stroke-[3px]" />
                    <div className="flex items-center">
                        <span className="font-bold text-xl md:text-2xl tracking-tighter text-[#333]">Lindy</span>
                        <span className="w-0 opacity-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-xl md:text-2xl tracking-tighter text-[#333]">
                            &nbsp;Works
                        </span>
                    </div>
                </div>
            </Link>

            <div className="flex items-center gap-0 md:gap-4">
                <LanguageSwitcher />
                <Link href="/resume">
                    <Button variant="ghost" size="icon" className="md:hidden rounded-full w-9 h-9">
                        <User className="w-5 h-5 text-gray-900" />
                    </Button>
                    <Button className="rounded-full bg-black text-white px-6 hidden md:inline-flex hover:bg-[#333333] h-9 text-sm">
                        {t("viewResume")}
                    </Button>
                </Link>
            </div>
        </header>
    );
}
