"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/navigation";
import { useLocale } from "next-intl";
import { Hero } from "@/features/hero/components/Hero";
import { PortfolioSection } from "@/features/portfolio/components/PortfolioSection";
import { AboutSection } from "@/features/hero/components/AboutSection";
import { AnimatePresence, motion } from "framer-motion";

export type TabType = "about" | "portfolio";

export default function Home() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const locale = useLocale();
    
    // Initialize tab based on URL param or pathname
    const [activeTab, setActiveTab] = useState<TabType>(() => {
        const isPortfolio = searchParams.get('tab') === 'portfolio' || pathname.endsWith('/portfolio');
        return isPortfolio ? 'portfolio' : 'about';
    });

    // Sync tab with URL changes
    useEffect(() => {
        const isPortfolio = searchParams.get('tab') === 'portfolio' || pathname.endsWith('/portfolio');
        setActiveTab(isPortfolio ? 'portfolio' : 'about');
    }, [searchParams, pathname]);

    const handleTabChange = (tab: TabType) => {
        // Optimistic update
        setActiveTab(tab);
        
        // Use router for navigation
        if (tab === 'portfolio') {
            router.replace('/portfolio', { scroll: false });
        } else {
            router.replace('/', { scroll: false });
        }
    };

    return (
        <main className="min-h-screen bg-white">
            <Hero activeTab={activeTab} onTabChange={handleTabChange} />

            <div className="relative">
                <AnimatePresence mode="wait">
                    {activeTab === "about" && (
                        <motion.div
                            key="about"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <AboutSection />
                        </motion.div>
                    )}
                    {activeTab === "portfolio" && (
                        <motion.div
                            key="portfolio"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <PortfolioSection />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
