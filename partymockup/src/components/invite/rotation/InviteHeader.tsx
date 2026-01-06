import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

interface InviteHeaderProps {
    name: string;
    sessionInfo: any; // Ideally this should be a stronger type like SessionConfig
}

const InviteHeader: React.FC<InviteHeaderProps> = ({ name, sessionInfo }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-6 z-10"
        >
            {/* Title & Greeting */}
            <div className="space-y-3 pt-6">
                <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-white break-keep transition-colors duration-300">
                    {sessionInfo?.title || "Wavy 프라이빗 파티"}
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">
                    <span className="text-slate-900 dark:text-white font-bold transition-colors duration-300">{name}</span>님을 초대합니다.
                </p>
            </div>

            {/* Date/Location Row */}
            <div className="flex flex-col gap-2 pt-2 border-l-2 border-slate-900 dark:border-white pl-4 ml-1 transition-colors duration-300">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm font-bold transition-colors duration-300">
                    <Calendar size={16} />
                    <span>{sessionInfo?.date || "2024.01.24 (Sat) 19:00"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors duration-300">
                    <MapPin size={16} />
                    <span>{sessionInfo?.location || "서울 강남구 압구정로"}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default InviteHeader;
