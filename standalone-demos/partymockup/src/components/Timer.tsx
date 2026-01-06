import React from 'react';

interface TimerProps {
    timeLeft: number;
    maxTime?: number;
    darkMode?: boolean;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, maxTime = 10, darkMode = false }) => {
    const percentage = Math.min((timeLeft / maxTime) * 100, 100);
    const isUrgent = timeLeft < (maxTime * 0.2);
    const strokeColor = isUrgent ? 'text-red-500' : 'text-pink-500';
    const trackColor = darkMode ? 'text-white/10' : 'text-gray-200';
    const textColor = darkMode ? 'text-white' : 'text-gray-800';

    return (
        <div className="relative flex items-center justify-center w-32 h-32 mx-auto my-2">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className={trackColor}
                />
                <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={2 * Math.PI * 56 * ((100 - percentage) / 100)}
                    className={`${strokeColor} transition-all duration-1000 ease-linear`}
                    strokeLinecap="round"
                />
            </svg>
            <div className={`absolute text-3xl font-bold font-mono ${textColor}`}>
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
        </div>
    );
};
export default Timer;
