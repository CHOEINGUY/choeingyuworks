import React, { useState } from 'react';
import { HelpCircle, ArrowUpDown, Copy, Check } from 'lucide-react';

export function AuthenticCohortContent() {
    const [useYates, setUseYates] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    // Corrected Mock Data: Exposed vs Unexposed structure
    const data = [
        { 
            food: 'Rice (쌀밥)', 
            expTotal: 95, expCases: 15, expAR: '15.8', 
            unexpTotal: 25, unexpCases: 3, unexpAR: '12.0',
            p: '0.452', rr: '1.32', ciLower: '0.8', ciUpper: '2.1', sig: false 
        },
        { 
            food: 'Bean Sprout Soup (콩나물국)', 
            expTotal: 92, expCases: 42, expAR: '45.7', 
            unexpTotal: 28, unexpCases: 2, unexpAR: '7.1',
            p: '<0.001', rr: '6.40', ciLower: '3.2', ciUpper: '12.8', sig: true 
        },
        { 
            food: 'Spicy Pork (제육볶음)', 
            expTotal: 94, expCases: 18, expAR: '19.1', 
            unexpTotal: 26, unexpCases: 4, unexpAR: '15.4',
            p: '0.124', rr: '1.24', ciLower: '0.9', ciUpper: '1.8', sig: false 
        },
        { 
            food: 'Kimchi (김치)', 
            expTotal: 96, expCases: 16, expAR: '16.7', 
            unexpTotal: 24, unexpCases: 4, unexpAR: '16.7',
            p: '0.998', rr: '1.00', ciLower: '0.7', ciUpper: '1.5', sig: false 
        },
        { 
            food: 'Radish Salad (무생채)', 
            expTotal: 90, expCases: 38, expAR: '42.2', 
            unexpTotal: 30, unexpCases: 3, unexpAR: '10.0',
            p: '<0.001', rr: '4.22', ciLower: '2.8', ciUpper: '6.4', sig: true 
        },
        { 
            food: 'Yogurt (요거트)', 
            expTotal: 95, expCases: 14, expAR: '14.7', 
            unexpTotal: 25, unexpCases: 4, unexpAR: '16.0',
            p: '0.892', rr: '0.92', ciLower: '0.6', ciUpper: '1.4', sig: false 
        },
    ];

    return (
        <div className="h-full flex flex-col bg-slate-50 relative overflow-hidden font-sans">
             {/* Header */}
             <div className="shrink-0 h-[48px] bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <span className="text-sm font-bold text-slate-700">Cohort Analysis Results</span>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                    <HelpCircle size={14} className="text-slate-400" />
                    <span>Guide</span>
                </button>
             </div>

             {/* Table Container */}
             <div className="flex-1 overflow-auto p-4">
                 <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                    {/* Toolbar */}
                    <div className="h-[50px] border-b border-slate-100 flex items-center justify-between px-4 bg-white shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600 mr-1" />
                            <span className="text-sm font-semibold text-slate-800">Statistical Analysis Table</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <button 
                                onClick={() => setUseYates(!useYates)}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded text-xs font-medium transition-colors ${
                                    useYates 
                                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                             >
                                <ArrowUpDown size={14} />
                                <span>Yates Correction</span>
                             </button>
                             <div className="relative">
                                <button 
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                                >
                                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                                    <span>Copy Table</span>
                                </button>
                                {isCopied && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-8 h-8 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center z-50 animate-in fade-in zoom-in duration-200">
                                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                            <Check size={12} className="text-white" />
                                        </div>
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>

                    {/* Table Wrapper for Scroller */}
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-xs border-collapse">
                             <thead className="sticky top-0 z-20 shadow-sm">
                                 {/* First Header Row */}
                                 <tr>
                                     <th rowSpan={2} className="bg-slate-100 border border-slate-200 text-slate-600 font-semibold w-[150px] p-2">Risk Factor</th>
                                     
                                     {/* Exposed Group Header */}
                                     <th colSpan={3} className="bg-blue-50 border border-blue-100 text-blue-700 font-semibold p-2">
                                         Exposed Group
                                     </th>
                                     
                                     {/* Unexposed Group Header */}
                                     <th colSpan={3} className="bg-red-50 border border-red-100 text-red-700 font-semibold p-2">
                                         Unexposed Group
                                     </th>

                                     {/* Stats Headers */}
                                     <th rowSpan={2} className="bg-green-50 border border-green-100 text-green-700 font-semibold w-[80px] p-2 whitespace-pre-line">
                                         P-value
                                     </th>
                                     <th rowSpan={2} className="bg-green-50 border border-green-100 text-green-700 font-semibold w-[80px] p-2 whitespace-pre-line">
                                         Relative Risk
                                     </th>
                                     <th colSpan={2} className="bg-green-50 border border-green-100 text-green-700 font-semibold p-2">
                                         95% CI
                                     </th>
                                 </tr>
                                 
                                 {/* Second Header Row */}
                                 <tr>
                                     {/* Exposed Subheaders */}
                                     <th className="bg-slate-50 border border-slate-200 text-slate-500 font-medium p-2 w-[60px]">Subjects</th>
                                     <th className="bg-slate-50 border border-slate-200 text-slate-500 font-medium p-2 w-[50px]">Cases</th>
                                     <th className="bg-slate-50 border border-slate-200 text-slate-500 font-medium p-2 w-[60px]">Incidence(%)</th>

                                     {/* Unexposed Subheaders */}
                                     <th className="bg-slate-50 border border-slate-200 text-slate-500 font-medium p-2 w-[60px]">Subjects</th>
                                     <th className="bg-slate-50 border border-slate-200 text-slate-500 font-medium p-2 w-[50px]">Cases</th>
                                     <th className="bg-slate-50 border border-slate-200 text-slate-500 font-medium p-2 w-[60px]">Incidence(%)</th>

                                     {/* CI Subheaders */}
                                     <th className="bg-slate-50 border border-slate-200 text-slate-500 font-medium p-2 w-[60px]">Lower</th>
                                     <th className="bg-slate-50 border border-slate-200 text-slate-500 font-medium p-2 w-[60px]">Upper</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100 bg-white">
                                 {data.map((row, idx) => (
                                     <tr key={idx} className={`hover:bg-slate-50 transition-colors ${row.sig ? 'bg-yellow-50/50' : ''}`}>
                                         {/* Factor Name */}
                                         <td className="p-2 border border-slate-100 font-medium text-slate-700 text-left">
                                             {row.sig && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-2 -ml-1 align-middle" />}
                                             {row.food}
                                         </td>

                                         {/* Exposed Data */}
                                         <td className="p-2 border border-slate-100 text-center text-slate-600 bg-slate-50/30">{row.expTotal}</td>
                                         <td className="p-2 border border-slate-100 text-center text-slate-900 font-medium">{row.expCases}</td>
                                         <td className="p-2 border border-slate-100 text-center text-slate-600 tabular-nums">{row.expAR}</td>

                                         {/* Unexposed Data */}
                                         <td className="p-2 border border-slate-100 text-center text-slate-600 bg-slate-50/30">{row.unexpTotal}</td>
                                         <td className="p-2 border border-slate-100 text-center text-slate-900 font-medium">{row.unexpCases}</td>
                                         <td className="p-2 border border-slate-100 text-center text-slate-600 tabular-nums">{row.unexpAR}</td>

                                         {/* Stats */}
                                         <td className={`p-2 border border-slate-100 text-center font-mono font-medium ${row.sig ? 'text-red-600' : 'text-slate-500'}`}>
                                             {row.p}
                                         </td>
                                         <td className="p-2 border border-slate-100 text-center font-bold text-slate-700 tabular-nums">
                                             {row.rr}
                                         </td>
                                         <td className="p-2 border border-slate-100 text-center text-slate-500 tabular-nums text-[11px]">{row.ciLower}</td>
                                         <td className="p-2 border border-slate-100 text-center text-slate-500 tabular-nums text-[11px]">{row.ciUpper}</td>
                                     </tr>
                                 ))}
                             </tbody>
                        </table>
                    </div>
                 </div>
             </div>
        </div>
    );
}

// styles variable removed as unused
