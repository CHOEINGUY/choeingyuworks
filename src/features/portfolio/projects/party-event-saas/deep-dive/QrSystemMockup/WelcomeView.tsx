import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface WelcomeViewProps {
    guestName: string;
}

export function WelcomeView({ guestName }: WelcomeViewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const myConfetti = confetti.create(canvasRef.current, {
            resize: true,
            useWorker: true
        });

        const triggerConfetti = () => {
            const colors = ['#ff9a9e', '#a1c4fd', '#ffffff', '#f6d365'];
            const end = Date.now() + 1000;

            (function frame() {
                myConfetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.6 },
                    colors: colors
                });
                myConfetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.6 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        };

        triggerConfetti();
    }, []);

    return (
        <motion.div 
            className="w-full h-full flex flex-col items-center justify-center bg-black px-6 text-center overflow-hidden relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
        >
            <canvas 
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-50"
            />
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="space-y-3 mb-16"
            >
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-300 via-white to-purple-300 bg-clip-text text-transparent leading-relaxed break-keep">
                    {guestName}님,<br />
                    LINDY Party에<br />
                    오신 것을 환영합니다!
                </h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="w-full px-8"
            >
                <div 
                    className="w-full bg-white text-black py-2.5 rounded-full font-bold text-sm shadow-lg transition-transform active:scale-95"
                >
                    입장하기
                </div>
            </motion.div>
        </motion.div>
    );
}
