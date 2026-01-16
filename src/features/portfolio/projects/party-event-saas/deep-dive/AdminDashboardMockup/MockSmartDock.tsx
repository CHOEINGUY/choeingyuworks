"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { UserPlus, MessageCircle, Settings } from 'lucide-react';

interface MockSmartDockProps {
    selectedCount: number;
    loadingAction: boolean;
    onMessageClick: () => void;
}

export function MockSmartDock({ selectedCount, loadingAction, onMessageClick }: MockSmartDockProps) {
    return (
        <div className="absolute right-0 top-0 bottom-0 w-[50px] border-l border-slate-100 bg-white flex flex-col items-center py-3 gap-3 z-30">
            <div className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-50 flex items-center justify-center"><UserPlus size={16} /></div>
            <div className="w-6 h-px bg-slate-100" />
            <AnimatePresence>
                {selectedCount > 0 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={onMessageClick}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm cursor-pointer relative transition-colors ${loadingAction ? 'bg-indigo-100 text-indigo-400' : 'bg-indigo-600 text-white shadow-indigo-200'}`}
                    >
                        {loadingAction ? (
                            <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <MessageCircle size={16} />
                        )}
                        {!loadingAction && (
                            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white">
                                {selectedCount}
                            </span>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="mt-auto w-8 h-8 rounded-lg text-slate-300 flex items-center justify-center"><Settings size={16} /></div>
        </div>
    );
}
