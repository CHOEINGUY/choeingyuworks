
import React from 'react';
import { motion } from 'framer-motion';
import { Copy, BarChart3, Download, RefreshCcw } from 'lucide-react';

export function AuthenticSymptomsContent() {
    // Replica of src/components/ClinicalSymptoms/index.vue
    // Layout: Frequency Table (Left) + Chart Controls & Chart (Right)
    
    // Mock Data based on FrequencyTable.vue structure
    const symptoms = [
        { name: '설사 (Diarrhea)', count: 161, percent: '92.5%' },
        { name: '복통 (Abdominal Pain)', count: 148, percent: '85.1%' },
        { name: '발열 (Fever)', count: 112, percent: '64.4%' },
        { name: '오한 (Chills)', count: 78, percent: '44.8%' },
        { name: '구토 (Vomiting)', count: 49, percent: '28.2%' },
        { name: '두통 (Headache)', count: 35, percent: '20.1%' },
        { name: '구역 (Nausea)', count: 28, percent: '16.1%' },
    ];
    
    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 gap-6 overflow-y-auto custom-scrollbar">
            {/* Summary Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                     <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                     <h2 className="text-lg font-bold text-slate-800 tracking-tight">임상증상 통계 (Financial Symptoms)</h2>
                </div>
                <div className="text-xs text-slate-400 font-mono bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    N=174
                </div>
            </div>

            <div className="flex gap-6 items-stretch min-h-[500px]">
                 {/* Left: Frequency Table Card */}
                 <div className="flex-1 min-w-[400px] bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col">
                     {/* Header */}
                     <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 bg-slate-50/30">
                         <span className="flex items-center text-slate-800 font-semibold text-base">
                             <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                             증상별 빈도표
                         </span>
                         <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm">
                             <Copy size={16} />
                             <span className="font-medium text-xs">표 복사</span>
                         </button>
                     </div>
                     
                     {/* Table Content */}
                     <div className="overflow-auto flex-1 p-0">
                          <table className="w-full text-sm text-center border-collapse">
                              <thead className="bg-slate-50 sticky top-0 z-10 text-slate-600 font-semibold">
                                  <tr>
                                      <th className="py-3 px-4 text-left border-b border-slate-200 w-[40%]">증상명 (Symptom)</th>
                                      <th className="py-3 px-4 border-b border-slate-200 w-[30%]">빈도 (Count)</th>
                                      <th className="py-3 px-4 border-b border-slate-200 w-[30%]">비율 (%)</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {symptoms.map((item, idx) => (
                                      <tr key={idx} className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors last:border-0">
                                          <td className="py-3 px-4 text-slate-700 text-left truncate font-medium">{item.name}</td>
                                          <td className="py-3 px-4 text-slate-600 font-mono">{item.count}</td>
                                          <td className="py-3 px-4 text-slate-800 font-bold font-mono">{item.percent}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                     </div>
                 </div>

                 {/* Right: Chart Control & Chart Area */}
                 <div className="flex-[1.5] min-w-[500px] bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex flex-col gap-6">
                      {/* Chart Control Panel (Replica of ChartControlPanel.vue) */}
                      <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200 shadow-sm backdrop-blur-sm w-full">
                          {/* Direction */}
                          <div className="flex items-center gap-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">방향</label>
                              <div className="flex bg-white rounded-lg border border-slate-200 p-0.5">
                                  <div className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-bold shadow-sm">수직</div>
                                  <div className="px-2 py-0.5 rounded-md text-slate-400 text-[10px] hover:text-slate-600 cursor-pointer">수평</div>
                              </div>
                          </div>
                          
                          <div className="w-px h-4 bg-slate-300 mx-1" />
                          
                          {/* Font Size */}
                          <div className="flex items-center gap-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">크기</label>
                               <div className="w-12 h-6 bg-white border border-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-600">14</div>
                          </div>
                          
                          {/* Width */}
                          <div className="flex items-center gap-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">너비</label>
                               <div className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-600">700px</div>
                          </div>
                          
                          <div className="w-px h-4 bg-slate-300 mx-1" />

                          {/* Color */}
                          <div className="w-5 h-5 rounded-full bg-orange-500 cursor-pointer ring-2 ring-white shadow-sm hover:scale-110 transition-transform" />
                      </div>

                      {/* Chart Area (SymptomBarChart.vue Replica) */}
                      <div className="flex-1 bg-white border border-slate-100 rounded-xl relative flex items-end justify-between p-6 pb-10 gap-2 overflow-hidden">
                           {/* BG Grid */}
                           <div className="absolute inset-0 flex flex-col justify-between p-6 pb-10 pointer-events-none opacity-50 z-0">
                               {[100, 75, 50, 25, 0].map(p => (
                                   <div key={p} className="w-full h-px bg-slate-100 border-t border-dashed border-slate-200 relative">
                                       <span className="absolute -left-6 -top-1.5 text-[9px] text-slate-300 w-4 text-right">{p}%</span>
                                   </div>
                               ))}
                           </div>

                           {/* Bars */}
                           {symptoms.map((s, i) => (
                               <div key={i} className="flex-1 h-full flex flex-col justify-end gap-1 relative z-10 group">
                                   <motion.div 
                                      initial={{ height: 0 }}
                                      animate={{ height: s.percent }}
                                      transition={{ delay: i * 0.1, duration: 0.8, type: "spring" }}
                                      className="w-full bg-orange-500 rounded-t-sm opacity-90 group-hover:opacity-100 group-hover:bg-orange-600 transition-colors shadow-sm relative"
                                   >
                                       {/* Label on hover */}
                                       <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                           {s.count}명 ({s.percent})
                                       </div>
                                   </motion.div>
                                   <div className="h-6 flex items-start justify-center pt-2">
                                       <span className="text-[10px] text-slate-500 font-medium truncate w-full text-center px-1" title={s.name.split(' ')[0]}>
                                           {s.name.split(' ')[0]}
                                       </span>
                                   </div>
                               </div>
                           ))}
                      </div>
                 </div>
            </div>
        </div>
    )
}
