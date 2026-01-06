import React from 'react';

interface GenderRatioBarProps {
    maleCount?: number;
    femaleCount?: number;
    isDark?: boolean;
}

const GenderRatioBar: React.FC<GenderRatioBarProps> = ({ maleCount = 0, femaleCount = 0, isDark }) => {
    const total = maleCount + femaleCount;
    const malePercent = total > 0 ? (maleCount / total) * 100 : 50;
    const femalePercent = total > 0 ? (femaleCount / total) * 100 : 50;

    return (
        <div className={`w-full px-4 py-3 border-b ${isDark ? 'border-gray-700 bg-slate-900' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center justify-between mb-2 text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2 text-blue-500">
                    <span>Male</span>
                    <span className={`px-2 py-0.5 rounded-full ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'} text-blue-600`}>
                        {maleCount}명 ({Math.round(malePercent)}%)
                    </span>
                </div>
                <div className="flex items-center gap-2 text-pink-500">
                    <span className={`px-2 py-0.5 rounded-full ${isDark ? 'bg-pink-900/30' : 'bg-pink-100'} text-pink-600`}>
                        {femaleCount}명 ({Math.round(femalePercent)}%)
                    </span>
                    <span>Female</span>
                </div>
            </div>

            {/* The Bar */}
            <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-200">
                <div
                    className="h-full bg-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${total === 0 ? 50 : malePercent}%` }}
                />
                <div
                    className="h-full bg-pink-500 transition-all duration-500 ease-out"
                    style={{ width: `${total === 0 ? 50 : femalePercent}%` }}
                />
            </div>
        </div>
    );
};

export default GenderRatioBar;
