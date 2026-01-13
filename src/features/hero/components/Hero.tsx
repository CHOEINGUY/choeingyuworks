"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Mail, Check, Copy, ArrowUpRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { TabType } from "@/app/[locale]/page";
import { CURRENT_BRAND } from "@/config/brand";

interface HeroProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function Hero({ activeTab, onTabChange }: HeroProps) {
    const t = useTranslations("Hero");
    const locale = useLocale();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText("chldlsrb07@gmail.com");
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy email", err);
        }
    };

    return (
        <section className="relative w-full flex flex-col items-center justify-start bg-white px-6 md:px-4 pt-[140px] md:pt-[170px] pb-4 md:pb-6 overflow-hidden">

            {/* Background Decor (Subtle gradient) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">

                {/* Main Typography */}
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={`text-shimmer text-3xl md:text-5xl lg:text-5xl font-extrabold leading-tight md:leading-[1.1] text-balance text-center mb-4 md:mb-6 tracking-tight ${locale === 'ko' ? 'break-keep' : ''}`}
                    >
                        {t("title")}
                    </motion.h1>

                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <p className={`text-sm md:text-lg lg:text-xl font-normal leading-relaxed text-center text-gray-700 whitespace-normal md:whitespace-pre-line max-w-[90%] md:max-w-3xl mx-auto px-1 mt-3 md:mt-0 ${locale === 'ko' ? 'break-keep' : ''}`}>
                            {t.rich("subtitle", {
                                b: (chunks) => <strong>{chunks}</strong>,
                                strong: (chunks) => <strong>{chunks}</strong>
                            })}
                        </p>
                    </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-2 md:mt-0"
                >
                    {/* Light Gray Pill Button */}
                    {/* Light Gray Pill Button */}
                    {CURRENT_BRAND.hero.showRequestButton && (
                    <Link href="/request">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto min-w-[150px] rounded-full bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 px-8 h-12 text-base font-semibold shadow-sm hover:border-gray-300 transition-colors"
                        >
                            <Rocket className="w-4 h-4 mr-2" />
                            {t("buttons.requestService")}
                        </Button>
                    </Link>
                    )}

                    {/* Dynamic Bar Contact Button */}
                    <motion.div
                        layout
                        initial={false}
                        animate={{
                            width: isExpanded ? "auto" : "150px",
                            backgroundColor: "#000000"
                        }}
                        whileHover={{ backgroundColor: "#333333" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{ originX: 1 }}
                        className="w-full sm:w-auto h-12 rounded-full flex items-center justify-center overflow-hidden cursor-pointer relative shadow-lg hover:shadow-xl"
                    >
                        <AnimatePresence>
                            {!isExpanded ? (
                                <motion.button
                                    layout
                                    key="collapsed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                                    onClick={() => setIsExpanded(true)}
                                    className="flex items-center justify-center w-full h-full text-white font-bold px-6 whitespace-nowrap absolute inset-0 cursor-pointer"
                                >
                                    <Mail className="w-4 h-4 mr-2 shrink-0" />
                                    {t("buttons.contactMe")}
                                </motion.button>
                            ) : (
                                <motion.div
                                    layout
                                    key="expanded"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                                    className="flex items-center px-4 md:px-6 w-full h-full gap-3 text-white min-w-max"
                                >
                                    {/* Email Copy Section */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopyEmail();
                                        }}
                                        className="flex items-center gap-2 hover:text-gray-300 transition-colors"
                                    >
                                        {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        <span className="font-mono text-sm md:text-base">chldlsrb07@gmail.com</span>
                                    </button>

                                    {/* Divider */}
                                    <div className="w-[1px] h-4 bg-gray-600" />

                                    {/* Mailto Link Section */}
                                    <a
                                        href="mailto:chldlsrb07@gmail.com"
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-1 hover:text-gray-300 transition-colors"
                                        title="Open Mail App"
                                    >
                                        <ArrowUpRight className="w-5 h-5" />
                                    </a>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Toggle Control */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6 md:mt-8"
            >
                <div className="inline-flex p-1.5 bg-gray-100/80 backdrop-blur-md rounded-full border border-gray-200/50 shadow-sm">
                    <button
                        onClick={() => onTabChange("about")}
                        className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "about" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        {activeTab === "about" && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-white rounded-full shadow-md z-0"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            About
                        </span>
                    </button>
                    <button
                        onClick={() => onTabChange("portfolio")}
                        className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === "portfolio" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        {activeTab === "portfolio" && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-white rounded-full shadow-md z-0"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            Portfolio
                        </span>
                    </button>
                </div>
            </motion.div>
        </section>
    );
}
