
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface DataControlToolbarProps {
    filterStatus: string;
    onFilterChange: (status: string) => void;
    filterOptions: { id: string; label: string }[];
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    placeholder?: string;
    isDark?: boolean;
    endContent?: React.ReactNode;
    collapseBreakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'always';
}

const DataControlToolbar: React.FC<DataControlToolbarProps> = ({
    filterStatus,
    onFilterChange,
    filterOptions,
    searchTerm,
    onSearchChange,
    placeholder = "검색",
    isDark,
    endContent,
    collapseBreakpoint = 'md'
}) => {
    const structuralBorder = isDark ? 'border-slate-600' : 'border-gray-300';
    const inputBg = isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-gray-50 border-gray-200';
    const inputText = isDark ? 'text-white placeholder-slate-500' : 'text-gray-900 placeholder-gray-400';

    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    // Dynamic classes based on breakpoint
    const getBreakpointClasses = () => {
        if (collapseBreakpoint === 'always') {
            return {
                button: '',
                input: ''
            };
        }

        const maps: Record<string, { button: string; input: string }> = {
            sm: { button: 'sm:hidden', input: 'sm:w-64 sm:opacity-100' },
            md: { button: 'md:hidden', input: 'md:w-64 md:opacity-100' },
            lg: { button: 'lg:hidden', input: 'lg:w-64 lg:opacity-100' },
            xl: { button: 'xl:hidden', input: 'xl:w-64 xl:opacity-100' },
            '2xl': { button: '2xl:hidden', input: '2xl:w-64 2xl:opacity-100' },
        };

        return maps[collapseBreakpoint] || maps['md'];
    };

    const bpClasses = getBreakpointClasses();

    return (
        <div className="flex items-center gap-3">
            {endContent}

            {/* Filter Tabs */}
            <div className={`flex p-1 rounded-lg border ${structuralBorder} ${isDark ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
                {filterOptions.map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => onFilterChange(opt.id)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === opt.id
                            ? (isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm border border-gray-200')
                            : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-900')
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Search Input */}
            {onSearchChange && (
                <>
                    {/* Mobile/Collapsed Search Trigger */}
                    {!isSearchExpanded && (
                        <button
                            onClick={() => setIsSearchExpanded(true)}
                            className={`${bpClasses.button} p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                        >
                            <Search size={20} />
                        </button>
                    )}

                    {/* Search Field */}
                    <div className={`relative transition-all duration-300 ease-in-out overflow-hidden ${isSearchExpanded
                        ? 'w-48 opacity-100' // Expanded state overrides everything
                        : `w-0 opacity-0 ${bpClasses.input}`
                        }`}>
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onBlur={() => {
                                // Close on blur (delayed slightly if needed, but direct is fine for now)
                                setIsSearchExpanded(false);
                            }}
                            autoFocus={isSearchExpanded}
                            className={`w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none transition-all ${inputBg} ${inputText} focus:border-pink-500`}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default DataControlToolbar;
