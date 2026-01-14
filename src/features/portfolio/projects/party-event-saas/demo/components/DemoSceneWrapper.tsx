import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface DemoSceneWrapperProps {
    children: ReactNode;
    isMobile: boolean;
    isAdminScene: boolean;
    paramKey: string; // Renamed from key to avoid prop conflict, use for motion key
}

export function DemoSceneWrapper({ 
    children, 
    isMobile, 
    isAdminScene,
    paramKey
}: DemoSceneWrapperProps) {
    return (
        <motion.div
            key={paramKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "absolute inset-0 w-full h-full flex",
                isMobile && isAdminScene 
                    ? "items-start justify-center pt-[15%] px-[3%] pb-[3%]" // Admin: Below Label
                    : isMobile 
                        ? "items-start justify-end pt-[6%] pr-[6%]" // Phone: Top-Right
                        : "items-center justify-center" // Desktop: Center
            )}
        >
            {children}
        </motion.div>
    );
}
