import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import QRCodeGenerator from '../QRCodeGenerator';

interface InviteTicketProps {
    urlKey: string;
    qrSize: number;
    sessionInfo: any;
    hasProfile: boolean;
}

const InviteTicket: React.FC<InviteTicketProps> = ({ urlKey, qrSize, sessionInfo, hasProfile }) => {
    // Local override state for debugging "No Profile" blur
    // Initial state respects the actual "hasProfile", but user can toggle it by clicking.
    const [overrideShow, setOverrideShow] = useState(false);

    // Effectively, show overlay if NO profile AND valid override is false
    const showOverlay = !hasProfile && !overrideShow;

    const handleTicketClick = () => {
        // Toggle override on click (Debug Feature)
        if (!hasProfile) {
            setOverrideShow(prev => !prev);
            console.log("Debug: Toggled QR Visibility");
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative w-full max-w-[280px] aspect-[4/5]"
                onClick={handleTicketClick}
            >
                {/* Card Container */}
                <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center p-6 transition-colors duration-300 cursor-pointer">

                    {/* QR Canvas */}
                    <div className="bg-slate-50 dark:bg-white p-2.5 rounded-2xl mb-5 transition-colors duration-300">
                        <QRCodeGenerator
                            data={urlKey || 'unknown_user'}
                            width={qrSize * 0.85}
                            height={qrSize * 0.85}
                            dotsColor="#0f172a" // slate-900 (Keep dark even in dark mode for contrast on white paper feeling)
                            cornerColor="#0f172a"
                        />
                    </div>

                    {/* Ticket Info */}
                    <div className="text-center space-y-1">
                        <p className="text-slate-900 dark:text-white font-medium text-sm tracking-tight transition-colors duration-300">
                            입장 시, 호스트에게 QR코드를 보여주세요.
                        </p>
                    </div>

                    {/* Mask overlay for 'No Profile' */}
                    {showOverlay && (
                        <div className="absolute inset-0 z-20 bg-white/10 backdrop-blur-[4px] rounded-[24px] flex items-center justify-center">
                            <div className="bg-slate-900 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 transform hover:scale-105 transition-transform">
                                <Info size={14} className="text-white" />
                                <span className="text-xs font-bold">프로필 작성 후 활성화됩니다</span>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default InviteTicket;
