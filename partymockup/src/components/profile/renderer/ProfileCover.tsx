import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { getThemeStyles, ThemeStyles } from '../../../constants/formThemes';
import WavyLogo from '../../../assets/Wavy_logo.png';

interface ProfileCoverProps {
    title: string;
    subtitle: string;
    buttonText?: string;
    onStart: () => void;
    themeColor?: 'pink' | 'indigo' | string;
    themeMode?: 'light' | 'dark';
    isViewer?: boolean;
    formData?: any;
    themeStyles?: ThemeStyles;
    logoImage?: string;
    coverImage?: string;
}

const ProfileCover: React.FC<ProfileCoverProps> = ({
    title,
    subtitle,
    buttonText = "시작하기",
    onStart,
    themeColor = 'indigo',
    themeMode = 'light',
    isViewer = false,
    formData = {},
    themeStyles,
    logoImage,
    coverImage
}) => {
    // 1. Get Theme Styles
    const styles = themeStyles || getThemeStyles(themeColor, themeMode);

    // Animation Variant
    const fadeInUp = {
        initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
        animate: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 1.2, ease: [0.19, 1.0, 0.22, 1.0] as any }
        }
    };

    // --- VIEW MODE (Unboxing Concept) ---
    if (isViewer) {
        const bgImage = formData?.image || formData?.avatar;
        // Construct Teaser: "[Region]에 사는 [Job]"
        // Fallback to "매력적인 파트너" if info missing
        const region = formData?.region || formData?.residence || formData?.answers?.region || formData?.answers?.residence || '';
        const job = formData?.job || formData?.answers?.job || '';
        const nickname = formData?.nickname || formData?.answers?.nickname || '';

        let teaserText = "";

        // Prioritize Nickname for the main title
        if (nickname) {
            teaserText = nickname;
        } else if (region && job) {
            teaserText = `${region}에 사는\n${job}`;
        } else if (job) {
            teaserText = `${job}`;
        } else if (region) {
            teaserText = `${region}에 거주`;
        } else {
            teaserText = "새로운 매칭";
        }

        // Subtitle logic (if nickname is main, show job/region as sub, or generic)
        const subTeaser = (nickname && (job || region)) ? `${region ? region + ' ' : ''}${job}` : "";

        const isDark = themeMode === 'dark';

        return (
            <div className={`flex flex-col h-full relative overflow-hidden ${styles.bg_app}`}>
                {/* 1. Blurry Background Image */}
                {bgImage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.6, scale: 1 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0 z-0"
                    >
                        <img
                            src={bgImage}
                            alt="Background"
                            className="w-full h-full object-cover blur-2xl opacity-80"
                        />
                        <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-white/60'}`} /> {/* Adaptive Overlay */}
                    </motion.div>
                )}

                {/* 2. Content */}
                <div className="flex-1 flex flex-col justify-center items-center px-8 z-10 text-center relative">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.2 }}
                    >
                        <p className={`font-bold tracking-widest text-sm mb-4 uppercase drop-shadow-sm ${styles.text_accent}`}>
                            PREMIUM MATCH
                        </p>
                        <h1 className={`text-4xl font-black leading-tight mb-2 drop-shadow-md whitespace-pre-wrap ${styles.text_primary}`}>
                            {teaserText || "매력적인\n파트너"}
                        </h1>
                        <p className={`text-lg font-medium drop-shadow-sm opacity-90 ${styles.text_secondary} mb-4`}>
                            님과 매칭되었습니다
                        </p>
                        {subTeaser && (
                            <p className={`text-base font-normal opacity-80 ${styles.text_tertiary}`}>
                                {subTeaser}
                            </p>
                        )}
                    </motion.div>
                </div>

                {/* 3. Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex-none px-6 pt-4 pb-12 z-10 w-full"
                    style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 6rem)' }}
                >
                    <button
                        onClick={onStart}
                        className={`w-full py-5 ${styles.radius_button} font-bold text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group ${styles.button_bg} ${styles.button_text}`}
                    >
                        <span>프로필 확인하기</span>
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        );
    }

    // --- CREATOR MODE (Original) ---
    return (
        <div className={`flex flex-col h-full ${styles.bg_app} relative overflow-hidden`}>
            {/* Background Decoration */}
            <div className={`absolute top-[-20%] right-[-20%] w-[80%] h-[50%] rounded-full opacity-20 blur-3xl ${styles.blob}`} />
            <div className={`absolute bottom-[-10%] left-[-10%] w-[60%] h-[40%] rounded-full opacity-10 blur-3xl ${styles.blob_secondary}`} />

            {/* Main Content */}
            <motion.div
                initial="initial"
                animate="animate"
                className="flex-1 flex flex-col justify-center items-center px-8 z-10 text-center w-full"
            >
                <motion.div
                    variants={fadeInUp}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <img
                        src={logoImage || WavyLogo}
                        alt="Logo"
                        className={`max-w-[150px] max-h-24 w-auto h-auto object-contain transition-all mb-4 ${!logoImage && themeMode === 'dark' ? 'brightness-0 invert opacity-90' : ''}`}
                    />
                    {coverImage && (
                        <div className="w-full max-w-xs aspect-video rounded-2xl overflow-hidden shadow-lg mb-6 mx-auto">
                            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                        </div>
                    )}
                </motion.div>

                <motion.h1
                    variants={fadeInUp}
                    transition={{ delay: 0.2 }}
                    className={`text-3xl font-black leading-tight mb-4 whitespace-pre-wrap ${styles.text_primary}`}
                >
                    {title}
                </motion.h1>

                <motion.p
                    variants={fadeInUp}
                    transition={{ delay: 0.3 }}
                    className={`text-lg leading-relaxed whitespace-pre-wrap mb-8 ${styles.text_secondary}`}
                >
                    {subtitle}
                </motion.p>

                {/* Button moved here to match ImmersiveCover position (centered flow) */}
                <motion.button
                    variants={fadeInUp}
                    transition={{ delay: 0.4 }}
                    onClick={onStart}
                    className={`w-full max-w-xs py-4 ${styles.radius_button} ${styles.button_bg} ${styles.button_text} font-bold text-lg shadow-xl ${themeMode === 'light' ? 'shadow-slate-200' : 'shadow-none'} active:scale-95 transition-all flex items-center justify-center gap-2`}
                >
                    <span>{buttonText}</span>
                    <ChevronRight size={20} />
                </motion.button>
            </motion.div>
        </div>
    );
};

export default ProfileCover;
