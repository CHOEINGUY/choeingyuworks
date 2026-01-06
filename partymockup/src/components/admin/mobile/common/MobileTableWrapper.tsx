import React from 'react';

interface MobileTableWrapperProps {
    title: string;
    stats?: { label: string; value: string | number; color?: string }[];
    children: React.ReactNode;
    isDark?: boolean;
    tabs?: string[];
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

const MobileTableWrapper: React.FC<MobileTableWrapperProps> = ({
    title,
    stats,
    children,
    isDark,
    tabs,
    activeTab,
    onTabChange
}) => {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header Area */}
            <div className={`shrink-0 px-4 py-3 flex flex-col gap-3 border-b ${isDark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                {/* Title & Stats */}
                <div className="flex items-center justify-between">
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                    </h2>

                    {/* Stats Badges */}
                    {stats && (
                        <div className="flex items-center gap-2">
                            {stats.map((stat, idx) => (
                                <div key={idx} className={`flex flex-col items-end`}>
                                    <span className={`text-[10px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {stat.label}
                                    </span>
                                    <span className={`text-sm font-bold ${stat.color || (isDark ? 'text-white' : 'text-gray-900')}`}>
                                        {stat.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Optional Tabs */}
                {tabs && onTabChange && (
                    <div className={`p-1 rounded-lg flex ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => onTabChange(tab)}
                                    className={`
                                        flex-1 py-1.5 text-xs font-bold rounded-md transition-all
                                        ${isActive
                                            ? (isDark ? 'bg-slate-700 text-white shadow' : 'bg-white text-gray-900 shadow')
                                            : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700')
                                        }
                                    `}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>



            {/* Scrollable Table Container */}
            <div className="flex-1 overflow-auto relative pb-24">
                {/* 
                   Force min-width to ensure table renders appropriately widely.
                   The inner table component usually has 'min-w-full' but we frame it here.
                */}
                <div className="min-w-[600px] h-full">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MobileTableWrapper;
