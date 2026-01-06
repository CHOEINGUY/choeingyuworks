import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3 } from 'lucide-react';

interface InviteActionProps {
    show: boolean;
    onClick: () => void;
}

const InviteAction: React.FC<InviteActionProps> = ({ show, onClick }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    className="fixed bottom-12 left-0 right-0 px-6 z-40"
                >
                    <button
                        onClick={onClick}
                        className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Edit3 className="w-5 h-5" />
                        프로필 작성하기
                    </button>
                    <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4 font-medium">
                        * 입장 1시간 전까지 프로필을 반드시 완료해주세요.
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InviteAction;
