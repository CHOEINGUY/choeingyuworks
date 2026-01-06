import React from 'react';
import { motion } from 'framer-motion';

const ApplicationLinkSection: React.FC = () => {
    return (
        <section className="flex flex-col items-center w-full z-10 pb-16">
            <div className="flex flex-col items-center">
                <div className="flex flex-col w-full items-center gap-5">
                    {/* Busan Button */}
                    <a
                        href="https://litt.ly/wavy_busan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            group
                            relative
                            bg-white/10
                            backdrop-blur-md
                            p-1
                            rounded-full
                            shadow-[0_0_50px_rgba(255,255,255,0.2)]
                            border border-white/30
                            flex items-center justify-center
                            transition-transform duration-300
                            hover:scale-105 active:scale-95
                            cursor-pointer
                            w-full max-w-[280px]
                        "
                    >
                        <div className="
                            bg-white
                            text-black
                            w-full
                            py-4
                            px-8
                            rounded-full
                            flex flex-col items-center justify-center
                            text-center
                            group-hover:bg-white/90
                            transition-colors
                        ">
                            <span className="text-lg font-bold">부산 파티 신청하기</span>
                            <span className="text-xs text-zinc-500 mt-1 font-light">매주 새로운 만남이 기다립니다</span>
                        </div>
                        {/* Button Glow Effect */}
                        <div className="absolute inset-0 rounded-full bg-white/20 blur-xl -z-10 group-hover:bg-white/30 transition-all"></div>
                    </a>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-8 flex items-center gap-2"
                >
                    <span className="text-white/60 text-xs font-light tracking-widest uppercase">
                        지금 바로 신청해보세요
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white/60 animate-bounce-horizontal"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </motion.div>
            </div>
        </section>
    );
};

export default ApplicationLinkSection;
