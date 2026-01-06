import React, { useEffect, useState } from 'react';
import { usePartyRegion } from '../../../hooks/usePartyRegion';

const SplashScreen: React.FC = () => {
    const region = usePartyRegion();
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [style, setStyle] = useState<React.CSSProperties>({ opacity: 1 });

    useEffect(() => {
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion) {
            setIsVisible(false);
            return;
        }

        const timer1 = setTimeout(() => {
            setStyle({ opacity: 0 });
            const timer2 = setTimeout(() => {
                setIsVisible(false);
            }, 500);
            return () => clearTimeout(timer2);
        }, 1000);

        return () => clearTimeout(timer1);
    }, []);

    if (!isVisible) return null;

    return (
        <div id="splash-screen" className="fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-1000 ease-in-out" style={style} aria-hidden="true">
            <span className="text-white font-semibold text-2xl">{region.splashText}</span>
        </div>
    );
};

export default SplashScreen;
