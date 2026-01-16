import React from 'react';
import { FileText, CheckCircle2, AlertCircle, Download, FileBarChart } from 'lucide-react';
import { motion } from 'framer-motion';

export function AuthenticReportContent() {
    return (
        <div className="h-full flex bg-slate-100 overflow-hidden font-sans">
             {/* Left Panel: Editor/Checklist */}
             <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col z-10 shadow-sm">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <FileText size={16} className="text-blue-600" />
                        Report Builder
                    </h2>
                    <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">Completion</span>
                            <span className="font-bold text-blue-600">100%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-blue-600"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2">
                    <ul className="space-y-1">
                        {[
                            "Study Design Selection",
                            "Case Definition",
                            "Attack Rate Analysis",
                            "Epidemic Curve",
                            "Symptom Statistics",
                            "Cohort Analysis",
                            "Conclusion"
                        ].map((item, i) => (
                            <motion.li 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 + 0.5 }}
                                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100/50"
                            >
                                <span className="text-xs font-medium text-slate-600">{item}</span>
                                <CheckCircle2 size={14} className="text-emerald-500" />
                            </motion.li>
                        ))}
                    </ul>
                </div>
             </div>

             {/* Right Panel: Preview */}
             <div className="flex-1 bg-slate-100 p-6 overflow-y-auto flex justify-center items-start">
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-[600px] min-h-[800px] bg-white shadow-lg rounded-sm p-8 relative"
                 >
                     {/* Paper Header */}
                     <div className="border-b-2 border-slate-800 pb-4 mb-6">
                         <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Official Document</div>
                         <h1 className="text-xl font-bold text-slate-900">Epidemiological Investigation Report</h1>
                         <div className="flex justify-between mt-2 text-xs text-slate-500">
                             <span>Date: 2023-09-25</span>
                             <span>ID: EPI-2023-042</span>
                         </div>
                     </div>

                     {/* Content Mockup */}
                     <div className="space-y-6">
                         <div className="space-y-2">
                             <h3 className="text-sm font-bold text-slate-800 border-l-2 border-blue-500 pl-2">1. Overview</h3>
                             <p className="text-[11px] leading-relaxed text-slate-600 text-justify">
                                 On September 20, 2023, a cluster of gastrointestinal symptoms was reported in a local school. 
                                 Wait, this is generated text. The automated system has identified 42 cases out of 120 exposed individuals used for this analysis.
                             </p>
                         </div>

                         <div className="space-y-2">
                             <h3 className="text-sm font-bold text-slate-800 border-l-2 border-blue-500 pl-2">2. Epidemic Curve</h3>
                             <div className="w-full h-32 bg-slate-50 border border-slate-100 rounded flex items-end justify-center gap-1 p-2 pb-0">
                                 {[2,5,12,18,8,4,2].map((h, i) => (
                                     <motion.div 
                                        key={i} 
                                        className="w-6 bg-blue-500/80 rounded-t-sm"
                                        initial={{ height: 0 }}
                                        animate={{ height: h * 4 }}
                                        transition={{ delay: 0.8 + i * 0.1 }}
                                     />
                                 ))}
                             </div>
                             <p className="text-[10px] text-slate-400 text-center italic">Fig 1. Cases by Symptom Onset Date</p>
                         </div>

                         <div className="space-y-2">
                             <h3 className="text-sm font-bold text-slate-800 border-l-2 border-blue-500 pl-2">3. Risk Analysis</h3>
                             <div className="bg-white border border-slate-200 rounded text-[10px]">
                                 <div className="grid grid-cols-4 bg-slate-100 p-2 font-bold text-slate-700">
                                     <span>Risk Factor</span>
                                     <span className="text-center">RR</span>
                                     <span className="text-center">95% CI</span>
                                     <span className="text-center">P-value</span>
                                 </div>
                                 <div className="grid grid-cols-4 p-2 border-t border-slate-100 text-slate-600 bg-red-50/30">
                                     <span className="font-medium text-slate-800">Bean Sprout Soup</span>
                                     <span className="text-center font-bold text-red-600">8.50</span>
                                     <span className="text-center">4.2-17.2</span>
                                     <span className="text-center font-bold text-red-600">&lt;0.001</span>
                                 </div>
                                 <div className="grid grid-cols-4 p-2 border-t border-slate-100 text-slate-600">
                                     <span>Spicy Pork</span>
                                     <span className="text-center">1.45</span>
                                     <span className="text-center">0.9-2.3</span>
                                     <span className="text-center">0.124</span>
                                 </div>
                             </div>
                         </div>
                     </div>

                     {/* Floating Action Button */}
                     <div className="absolute top-8 right-8">
                         <motion.button 
                            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded shadow-lg text-xs font-medium hover:bg-blue-700"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 2 }}
                         >
                             <Download size={14} />
                             Download PDF
                         </motion.button>
                     </div>
                 </motion.div>
             </div>
        </div>
    )
}
