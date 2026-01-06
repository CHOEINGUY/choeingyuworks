import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import GuideSection from './GuideSection';
import { Schedule } from '../../../utils/partySchedule';

interface WelcomePageProps {
    redirectUrl: string;
    userId: string | null;
    scheduleData: Schedule | null;
}

export default function WelcomePage({ redirectUrl, userId, scheduleData }: WelcomePageProps) {

    useEffect(() => {
        if (userId) {
            const seenKey = `wavy_welcome_seen_${userId}`;
            const hasSeen = localStorage.getItem(seenKey);

            if (!hasSeen) {
                triggerConfetti();
                localStorage.setItem(seenKey, 'true');
            }
        } else {
            // Fallback if no userId (shouldn't happen often in this flow), just fire once per session? 
            // Or just fire. Let's fire safely.
            triggerConfetti();
        }
    }, [userId]);

    const handleEnter = () => {
        window.location.href = redirectUrl;
    };

    return (
        <main className="relative z-10 w-full max-w-[430px] mx-auto min-h-[100dvh] flex flex-col items-center justify-center bg-black text-white px-6 py-12">

            {/* Title Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center space-y-4 mb-24"
            >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text text-transparent leading-relaxed">
                    Wavy Party에<br />오신 것을 환영합니다!
                </h1>
            </motion.div>

            {/* Enter Button */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                onClick={handleEnter}
                className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors active:scale-95 transform"
            >
                입장하기
            </motion.button>

            {/* Bottom Sheet Guide */}
            <div className="absolute bottom-0 left-0 w-full z-50">
                <GuideSection scheduleData={scheduleData} />
            </div>

        </main>
    );
}

function triggerConfetti() {
    // Christmas/Winter Pastel Palette
    const colors = [
        '#ff9a9e', // Pastel Red (Soft Rose)
        '#a1c4fd', // Pastel Blue (Icy Winter)
        '#ffffff', // Snow White
        '#f6d365'  // Soft Gold (Warmth)
    ];
    const totalParticles = 300;
    const commonOpts = {
        colors: colors,
        disableForReducedMotion: true,
        drift: 0,
        ticks: 300, // Last longer
        gravity: 1.1, // Float down much slower (Snow effect)
        scalar: 1.0, // Adjusted to 1.0
        shapes: ['circle', 'square'] as any
    };

    // "화면 좌우 상단 모서리로 해서 x 자 방향으로 팡" (Crossfire X-shape)

    // 1. Top Left -> Bottom Right (South-East)
    confetti({
        ...commonOpts,
        particleCount: totalParticles / 2,
        angle: 315, // Down-Right
        spread: 55,
        startVelocity: 45,
        origin: { x: 0, y: 0 }
    });

    // 2. Top Right -> Bottom Left (South-West)
    confetti({
        ...commonOpts,
        particleCount: totalParticles / 2,
        angle: 225, // Down-Left
        spread: 55,
        startVelocity: 35,
        origin: { x: 1, y: 0 }
    });
}
