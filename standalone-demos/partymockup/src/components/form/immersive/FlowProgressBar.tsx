import React from 'react';
import { motion } from 'framer-motion';

interface FlowProgressBarProps {
    current: number;
    total: number;
    themeStyles: {
        bar_bg: string;
        bar_fill: string;
    };
}

const FlowProgressBar: React.FC<FlowProgressBarProps> = ({ current, total, themeStyles }) => {
    const percentage = total > 0 ? ((current + 1) / total) * 100 : 0;

    return (
        <div className={`w-full h-1 ${themeStyles.bar_bg}`}>
            <motion.div
                className={`h-full ${themeStyles.bar_fill}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />
        </div>
    );
};

export default FlowProgressBar;
