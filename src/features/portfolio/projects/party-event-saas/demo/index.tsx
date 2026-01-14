import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/useMobile';
import { BrowserFrame } from '@/features/portfolio/components/BrowserFrame';

import { UI_CONSTANTS, SCENES } from './config';
import { DemoSceneWrapper } from './components/DemoSceneWrapper';
import type { PartySolutionDemoProps } from './types';

export function PartySolutionDemo({
    isEmbedded = false,
    scale,
    className,
    isActive = true,
}: PartySolutionDemoProps) {
    const [sceneIndex, setSceneIndex] = useState(0);
    const isMobile = useMobile();

    // No auto-reset. Just pause.
    
    const nextScene = () => setSceneIndex(prev => (prev + 1) % SCENES.length);
    
    // Use current sceneIndex regardless of active state (Pause behavior)
    const currentScene = SCENES[sceneIndex];

    // Scale Logic
    const isAdminScene = sceneIndex === 1; // Admin is always index 1 in current config
    const adminScaleMultiplier = (isMobile && isAdminScene) ? UI_CONSTANTS.SCALE.ADMIN_MOBILE_MULTIPLIER : 1;
    const baseScale = scale ?? (isEmbedded ? UI_CONSTANTS.SCALE.EMBEDDED_DEFAULT : 1);
    const currentScale = baseScale * adminScaleMultiplier;

    // Dimensions Logic
    const frameWidth = (isMobile && currentScene.mobileWidth) 
        ? currentScene.mobileWidth 
        : (currentScene.width || UI_CONSTANTS.DIMENSIONS.MOBILE_WIDTH);

    return (
        <div className={cn(
            "relative w-full flex overflow-hidden",
            isEmbedded ? "h-full" : "max-w-[1200px] h-[800px] min-h-screen bg-[#e5e5e5] p-8 font-sans",
            // The parent wrapper alignment matters less now as children are absolute positioned or controlled,
            // but keeping it centered is safe.
            "items-center justify-center",
            className
        )}>
            {/* Main Content Area - Static Centered Container */}
            <div 
                className={cn(
                    "relative w-full h-full flex items-center justify-center transition-all duration-500"
                )}
                style={{ transformOrigin: 'center' }}
            >
                <AnimatePresence mode="wait">
                    <DemoSceneWrapper
                        key={currentScene.id}
                        paramKey={currentScene.id}
                        isMobile={isMobile}
                        isAdminScene={isAdminScene}
                    >
                        <BrowserFrame
                            width={frameWidth}
                            height={UI_CONSTANTS.DIMENSIONS.HEIGHT}
                            url={currentScene.url}
                            isMobile={currentScene.isMobileFrame}
                            hideAddressBar={currentScene.hideAddressBar}
                            uiScale={currentScale}
                        >
                            <currentScene.component 
                                onComplete={nextScene} 
                                isActive={isActive}
                            />
                        </BrowserFrame>
                    </DemoSceneWrapper>
                </AnimatePresence>
            </div>

            {/* Steps Indicator (Embedded or Full Page) */}
            {isEmbedded ? (
                <div className="absolute top-4 left-4 z-50 pointer-events-none">
                    <h3 className="inline-block font-bold text-gray-500/80 text-[10px] uppercase tracking-wider backdrop-blur-md bg-white/40 px-3 py-1 rounded-full border border-white/20 shadow-sm whitespace-nowrap pointer-events-auto">
                        Step {sceneIndex + 1}: {currentScene.title}
                    </h3>
                </div>
            ) : (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-center space-y-3 z-50">
                    <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider backdrop-blur-md bg-white/50 px-6 py-2 rounded-full border border-white/20 shadow-sm">
                        Step {sceneIndex + 1}: {currentScene.enTitle}
                    </h3>
                </div>
            )}
        </div>
    );
}
