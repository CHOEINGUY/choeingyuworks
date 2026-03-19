"use client";

import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/navigation";
import { Hero } from "@/features/hero/components/Hero";
import { PortfolioSection } from "@/features/portfolio/components/PortfolioSection";
import { AboutSection } from "@/features/hero/components/AboutSection";
import { AnimatePresence, motion } from "framer-motion";

export type TabType = "about" | "portfolio";

interface Props {
    targetCompany?: string;
}

export default function HomeClient({ targetCompany }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Derived state from URL
    const isPortfolio = searchParams.get('tab') === 'portfolio' || pathname.endsWith('/portfolio');
    const activeTab: TabType = isPortfolio ? 'portfolio' : 'about';

    const handleTabChange = (tab: TabType) => {
        // Use query params to avoid page re-mount (prevents Hero animation replay)
        if (targetCompany) {
            if (tab === 'portfolio') {
                router.replace(`/${targetCompany}?tab=portfolio`, { scroll: false });
            } else {
                router.replace(`/${targetCompany}`, { scroll: false });
            }
            return;
        }

        if (tab === 'portfolio') {
            router.replace('/?tab=portfolio', { scroll: false });
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
                            <PortfolioSection targetCompany={targetCompany} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
