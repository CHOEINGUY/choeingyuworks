import React from 'react';

interface DemoProgressBarProps {
    current: number;
    total: number;
    className?: string;
}

export const DemoProgressBar: React.FC<DemoProgressBarProps> = ({ current, total, className = '' }) => {
    const percentage = total > 0 ? ((current) / total) * 100 : 0;

    return (
        <div className={`w-[60vw] max-w-[60%] mx-auto mb-6 ${className}`}>
            <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500 ease-out bg-blue-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
