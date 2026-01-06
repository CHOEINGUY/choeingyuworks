import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import WavyLogo from "../../../../assets/Wavy_logo.png";

interface ImmersiveCoverProps {
    title: string;
    description: string;
    coverImage: string;
    logoImage?: string; // [NEW]
    onStart: () => void;
    themeStyles: any;
    theme: string;
}

const ImmersiveCover: React.FC<ImmersiveCoverProps> = ({ title, description, coverImage, logoImage, onStart, themeStyles, theme }) => {
    const fadeInUp = {
        initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
        animate: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 1.2, ease: [0.19, 1.0, 0.22, 1.0] as any } // Slow enter
        },
        exit: {
            opacity: 0,
            y: -10,
            filter: 'blur(5px)'
        }
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            className={`flex flex-col items-center min-h-full text-center ${coverImage ? 'justify-start pt-10 pb-10 gap-10' : 'justify-center p-8 gap-12'}`}
        >
            {/* Top Section: Logo + Title + Description */}
            <div className="flex flex-col items-center w-full">
                {/* Logo */}
                <motion.div
                    variants={fadeInUp}
                    transition={{ delay: 0.1 }}
                    className="mb-4 md:mb-6"
                >
                    <img src={logoImage || WavyLogo} alt="Logo" className="w-20 md:w-24 h-auto object-contain" />
                </motion.div>

                <motion.h1
                    variants={fadeInUp}
                    transition={{ delay: 0.2 }}
                    className={`text-3xl font-bold mb-3 whitespace-pre-wrap break-keep break-words leading-relaxed ${themeStyles?.text_primary || 'text-slate-800'}`}
                >
                    {title || "새로운 만남을 시작해보세요"}
                </motion.h1>

                <motion.p
                    variants={fadeInUp}
                    transition={{ delay: 0.3 }}
                    className={`text-lg whitespace-pre-line leading-relaxed break-keep break-words ${themeStyles?.text_secondary || 'text-slate-500'}`}
                >
                    {description || "참여자에게 보여줄 환영인사나 설명을 입력해주세요."}
                </motion.p>
            </div>

            {/* Middle: Cover Image */}
            {coverImage && (
                <motion.div
                    initial={{ scale: 1.05, opacity: 0, filter: 'blur(10px)' }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        filter: 'blur(0px)',
                        transition: { duration: 1.5, ease: [0.19, 1.0, 0.22, 1.0], delay: 0.4 }
                    }}
                    exit={{
                        opacity: 0,
                        filter: 'blur(5px)',
                        transition: { duration: 0.2 }
                    }}
                    className="w-[85%] max-w-[340px] rounded-[32px] overflow-hidden shadow-2xl border border-white/10"
                >
                    <img
                        src={coverImage}
                        alt="Event Cover"
                        className="w-full object-cover max-h-[75vh]"
                    />
                </motion.div>
            )}

            {/* Bottom: CTA Button */}
            <div className="w-full flex justify-center pb-4">
                <motion.button
                    variants={fadeInUp}
                    transition={{ delay: coverImage ? 0.6 : 0.4 }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onStart}
                    className={`
                        w-full max-w-xs font-bold py-4 flex items-center justify-center gap-2 group transition-all shadow-lg
                        ${themeStyles?.radius_button || 'rounded-xl'}
                        ${theme === 'dark'
                            ? 'bg-white text-slate-900 hover:bg-slate-100 hover:shadow-white/20'
                            : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-900/20'}
                    `}
                >
                    <span>시작하기</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ImmersiveCover;
