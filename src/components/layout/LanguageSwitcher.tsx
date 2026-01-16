"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { Globe, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES = [
    { code: "ko", label: "한국어", short: "KO" },
    { code: "en", label: "English", short: "EN" },
    { code: "ja", label: "日本語", short: "JP" },
] as const;

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const activeUniqueLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

    const onSelectChange = (nextLocale: string) => {
        router.replace(pathname, { locale: nextLocale });
        setIsOpen(false);
    };

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer",
                    "hover:bg-gray-100 text-gray-600 hover:text-black",
                    isOpen && "bg-gray-100 text-black"
                )}
            >
                <Globe className="w-4 h-4 hidden md:block" />
                <span className="text-sm font-medium">{activeUniqueLang.short}</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform duration-200 hidden md:block", isOpen && "rotate-180")} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => onSelectChange(lang.code)}
                            className={cn(
                                "flex items-center w-full px-4 py-2.5 text-sm transition-colors text-left cursor-pointer",
                                "hover:bg-gray-50",
                                locale === lang.code ? "text-black font-semibold bg-gray-50/50" : "text-gray-600"
                            )}
                        >
                            <span className="w-5 flex items-center justify-center mr-2">
                                {locale === lang.code && <Check className="w-4 h-4 text-black" />}
                            </span>
                            <span>{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
