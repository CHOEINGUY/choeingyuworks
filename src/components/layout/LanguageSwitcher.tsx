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
    return null;
}
