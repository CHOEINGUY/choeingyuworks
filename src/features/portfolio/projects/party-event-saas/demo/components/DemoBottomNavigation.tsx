import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, ArrowRight, Check } from 'lucide-react';

interface DemoBottomNavigationProps {
    currentStepIndex: number; // 0-based index for progress
    totalSteps: number;
    stepName: string; // kept for interface compatibility
    onNext: () => void;
    onPrev?: () => void;
    isNextDisabled?: boolean;
    isClicking?: boolean;
    mainButtonLabel?: string;
    showMainButton?: boolean;
}

export const DemoBottomNavigation: React.FC<DemoBottomNavigationProps> = ({
    currentStepIndex,
    totalSteps,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stepName,
    onNext,
    onPrev,
    isNextDisabled = false,
    isClicking = false,
    mainButtonLabel = "다음",
    showMainButton = true
}) => {
    // Progress percentage
    const progress = totalSteps > 0 ? ((currentStepIndex) / totalSteps) * 100 : 0;

    return (
        <div className="absolute bottom-0 left-0 right-0 z-50">
            {/* Floating Main Action Button Area */}
            <div className="relative h-0 flex justify-center w-full">
                <AnimatePresence>
                    {showMainButton && (
                        <motion.button
                            initial={{ y: 20, opacity: 0, scale: 0.9 }}
                            animate={{ y: -20, opacity: 1, scale: isClicking ? 0.95 : 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            onClick={onNext}
                            disabled={isNextDisabled}
                            className={`
                                absolute bottom-0 
                                flex items-center justify-center gap-2 
                                px-8 py-4 
                                rounded-full 
                                shadow-xl 
                                bg-blue-600 text-white 
                                font-bold text-lg 
                                transition-colors
                                ${isNextDisabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-blue-700'}
                            `}
                        >
                            <span className="whitespace-nowrap">{mainButtonLabel}</span>
                            {mainButtonLabel.includes("완료") ? <Check size={20} strokeWidth={3} /> : <ArrowRight size={20} strokeWidth={3} />}
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Navigation Bar */}
            <div className="bg-white/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)] rounded-b-[32px]">

                {/* Progress Bar inside Nav */}
                <div className="w-[60%] mx-auto mt-4 mb-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>

                <div className="flex items-center justify-between px-6 py-4">
                    {/* Prev Button */}
                    <button
                        onClick={onPrev}
                        disabled={!onPrev}
                        className={`p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 ${!onPrev ? 'opacity-30 cursor-default' : ''}`}
                    >
                        <ChevronUp size={24} />
                    </button>

                    {/* Step Indicator */}
                    <div className="text-xs font-medium text-gray-400">
                        {currentStepIndex} / {totalSteps}
                    </div>

                    {/* Next Button (Small) */}
                    <button
                        onClick={onNext}
                        disabled={isNextDisabled}
                        className={`
                            p-3 rounded-full 
                            bg-gray-100 text-gray-600
                            hover:bg-gray-200
                            transition-all active:scale-95
                            ${isNextDisabled ? 'opacity-50' : 'shadow-sm'}
                        `}
                    >
                        <ChevronDown size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};
