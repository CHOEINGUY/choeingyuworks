"use client";

import { useState } from "react";
import { Hero } from "@/features/hero/components/Hero";
import { PortfolioSection } from "@/features/portfolio/components/PortfolioSection";
import { AboutSection } from "@/features/hero/components/AboutSection";
import { AnimatePresence, motion } from "framer-motion";

export type TabType = "about" | "portfolio";

export default function Home() {
    const [activeTab, setActiveTab] = useState<TabType>("about");

    return (
        <main className="min-h-screen bg-white">
            <Hero activeTab={activeTab} onTabChange={setActiveTab} />

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
