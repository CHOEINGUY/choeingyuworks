import { motion } from "framer-motion";
import {
    QrCode,
    CheckCircle2
} from "lucide-react";

export function QrSystemMockup() {
    return (
        <motion.div
            className="w-full aspect-square relative order-1 lg:order-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            {/* Container Box */}
            <div className="w-full h-full bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center relative select-none ring-1 ring-white/10 group">

                {/* Background Atmosphere */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-black opacity-90" />
                    {/* Moving Gradients */}
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute top-[-20%] right-[-20%] w-[400px] h-[400px] bg-indigo-500/30 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                        className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[80px]"
                    />
                </div>

                {/* Mobile Phone Frame */}
                <div className="relative z-10 w-[280px] h-[560px] bg-black rounded-[3rem] border-[6px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10 group-hover:scale-[1.02] transition-transform duration-500">
                    {/* Dynamic Island */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-xl z-20" />

                    {/* Screen Content (Based on QRCodeSection.tsx) */}
                    <div className="w-full h-full relative flex flex-col items-center justify-center bg-black/50 text-white">
                        {/* Background Image (Abstract) */}
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-black/90 z-0" />

                        {/* Content Container */}
                        <div className="relative z-10 flex flex-col items-center w-full px-6 gap-8">

                            {/* Ticket Header */}
                            <div className="text-center space-y-1">
                                <div className="text-xs text-indigo-300 font-bold tracking-widest uppercase mb-2">My Ticket</div>
                                <h3 className="text-xl font-bold">12/24 크리스마스 파티</h3>
                                <p className="text-[10px] text-slate-400">2024.12.24 (Sat) 19:00</p>
                            </div>

                            {/* The QR Card (Replicating exact CSS classes) */}
                            <div className="bg-white p-4 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.4)] border-2 border-white/30 w-56 h-56 flex items-center justify-center relative over group/qr">

                                {/* Simulated QR Code (SVG Pattern) */}
                                <div className="w-full h-full bg-white relative">
                                    {/* Squares (Corner Markers) */}
                                    <div className="absolute top-0 left-0 w-12 h-12 border-[4px] border-slate-900 rounded-lg"><div className="absolute inset-3 bg-slate-900 rounded-sm" /></div>
                                    <div className="absolute top-0 right-0 w-12 h-12 border-[4px] border-slate-900 rounded-lg"><div className="absolute inset-3 bg-slate-900 rounded-sm" /></div>
                                    <div className="absolute bottom-0 left-0 w-12 h-12 border-[4px] border-slate-900 rounded-lg"><div className="absolute inset-3 bg-slate-900 rounded-sm" /></div>

                                    {/* Random Dots (Pattern) */}
                                    <div className="absolute top-14 left-14 right-0 bottom-0 grid grid-cols-4 gap-1 opacity-80">
                                        {[...Array(12)].map((_, i) => (
                                            <div key={i} className={`bg-slate-900 rounded-full ${i % 3 === 0 ? 'w-2 h-2' : 'w-1.5 h-1.5'}`} style={{ opacity: (i * 7) % 10 > 3 ? 1 : 0 }} />
                                        ))}
                                    </div>

                                    {/* Center Logo Overlay */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-lg p-1 shadow-sm z-20 flex items-center justify-center">
                                        <div className="w-full h-full bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xs">W</div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Guide Text */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="flex items-center gap-2"
                            >
                                <QrCode size={14} className="text-white/60" />
                                <span className="text-white/80 text-[10px] font-light tracking-widest uppercase">
                                    입장 시 호스트에게 보여주세요
                                </span>
                            </motion.div>
                        </div>

                    </div>
                </div>

                {/* Success Toast Interaction */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md text-slate-900 px-4 py-3 rounded-full shadow-2xl border border-white/50 flex items-center gap-3 z-20 w-auto whitespace-nowrap"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
                >
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm">
                        <CheckCircle2 size={14} className="stroke-[3px]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold leading-none">Check-in Verified</span>
                        <span className="text-xs text-slate-500 leading-none mt-0.5">redirecting...</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
