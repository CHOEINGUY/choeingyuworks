
import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export function AuthenticCurveContent() {
    // Replicating EpidemicCurve/index.vue Layout & Style
    // Background: bg-gradient-to-br from-slate-50 to-slate-100
    // Card: bg-white rounded-2xl shadow-premium border border-slate-100
    
    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 gap-6 overflow-y-auto custom-scrollbar">
            {/* Summary Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                     <div className="w-1.5 h-6 bg-slate-800 rounded-full" />
                     <h2 className="text-lg font-bold text-slate-800 tracking-tight">유행곡선 (Epidemic Curve)</h2>
                </div>
                <div className="text-xs text-slate-400 font-mono bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    Last updated: 2024.05.21
                </div>
            </div>

            {/* Row 1: Symptom Analysis */}
            <div className="flex gap-5 items-stretch min-h-[400px]">
                 {/* Left: Table Card */}
                 <div className="flex-1 min-w-[300px] bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col">
                     <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                         <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                             <span className="w-1.5 h-5 bg-blue-500 rounded-full"></span>
                             증상 발현 분석
                         </h3>
                     </div>
                     <div className="p-5 flex-1 flex flex-col">
                         {/* Food Selector Simulation */}
                         <div className="mb-4">
                             <div className="text-xs font-bold text-slate-500 mb-1.5 ml-1">원인 추정 식품</div>
                             <div className="w-full bg-white border border-slate-200 rounded-lg p-2.5 flex justify-between items-center shadow-sm text-sm text-slate-700">
                                 <span>돼지고기 수육</span>
                                 <span className="text-xs text-slate-400">▼</span>
                             </div>
                         </div>
                         
                         {/* Table Header */}
                         <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center text-sm text-[#333] font-medium">
                                <span className="inline-block w-1.5 h-1.5 bg-current mr-1.5 rounded-full"></span>
                                증상 발현 현황
                            </div>
                            <button className="text-xs text-slate-500 hover:text-blue-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">Copy</button>
                         </div>

                         {/* Symptom Table */}
                         <div className="border border-slate-200 rounded-lg overflow-hidden flex-1">
                             <table className="w-full text-xs border-collapse">
                                 <thead className="bg-slate-50 text-slate-700 font-semibold">
                                     <tr>
                                         <th className="p-2 border-r border-b border-slate-200 w-1/2">시간 (Interval)</th>
                                         <th className="p-2 border-b border-slate-200 w-1/2">환자 수</th>
                                     </tr>
                                 </thead>
                                 <tbody className="text-slate-600 text-center">
                                     {[
                                         ['5/1 09:00', 2], ['5/1 12:00', 5], ['5/1 15:00', 12], 
                                         ['5/1 18:00', 18], ['5/1 21:00', 24], ['5/2 00:00', 35],
                                         ['5/2 03:00', 28], ['5/2 06:00', 15]
                                     ].map(([time, count], i) => (
                                         <tr key={i} className="hover:bg-slate-50/50 border-b border-slate-100 last:border-0">
                                             <td className="p-2 border-r border-slate-100">{time}</td>
                                             <td className="p-2 font-mono">{count}</td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>

                         {/* Summary Box */}
                         <div className="mt-4 p-3 bg-[#f8f9fa] rounded-lg border border-slate-100 text-xs text-slate-600 flex flex-col gap-1.5">
                             <div className="flex justify-between">
                                 <span className="text-slate-400">최초 발현</span>
                                 <span className="font-bold text-slate-700">2024-05-01 09:00</span>
                             </div>
                             <div className="flex justify-between">
                                 <span className="text-slate-400">최종 발현</span>
                                 <span className="font-bold text-slate-700">2024-05-02 06:00</span>
                             </div>
                         </div>
                     </div>
                 </div>

                 {/* Right: Chart Card */}
                 <div className="flex-[2] min-w-[400px] bg-white rounded-2xl shadow-lg border border-slate-100 p-5 flex flex-col gap-5">
                      {/* Controls Bar */}
                      <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200 shadow-sm backdrop-blur-sm">
                          {/* Time Settings */}
                          <div className="flex items-center gap-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">간격</label>
                              <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm cursor-pointer hover:border-blue-300">
                                  3시간
                              </div>
                          </div>
                          <div className="w-px h-4 bg-slate-300 mx-1" />
                          
                          {/* Visual Settings */}
                          <div className="flex items-center gap-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">폰트</label>
                              <div className="w-8 h-6 bg-white border border-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-600">12</div>
                          </div>
                          <div className="border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-500 bg-white">
                              Width: 700px
                          </div>
                          <div className="w-px h-4 bg-slate-300 mx-1" />

                          {/* Color */}
                          <div className="w-5 h-5 rounded-full bg-[#5470c6] cursor-pointer ring-2 ring-white shadow-sm" />
                          <div className="ml-auto text-[10px] text-slate-400 cursor-pointer hover:text-slate-600">초기화</div>
                      </div>

                      {/* Chart Area */}
                      <div className="flex-1 bg-white border border-slate-100 rounded-xl relative flex items-end justify-between p-6 pb-8 gap-1">
                          {/* Grid Lines */}
                          <div className="absolute inset-0 flex flex-col justify-between p-6 pb-8 pointer-events-none opacity-30">
                              {[0, 1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-slate-200 dashed" />)}
                          </div>
                          
                          {/* Bars */}
                          {[2, 5, 12, 18, 24, 35, 42, 38, 28, 15, 8, 4, 2].map((h, i) => (
                              <motion.div 
                                 key={i}
                                 initial={{ height: 0 }}
                                 animate={{ height: `${(h/42)*100}%` }}
                                 transition={{ delay: i * 0.05, duration: 0.8 }}
                                 className="flex-1 bg-[#5470c6] rounded-t-sm opacity-90 hover:opacity-100 relative group"
                               >
                                   <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-500 hidden group-hover:block">{h}</div>
                               </motion.div>
                          ))}
                          
                          {/* Axis Labels */}
                          <div className="absolute bottom-2 left-6 right-6 flex justify-between text-[9px] text-slate-400 font-mono">
                              <span>09:00</span>
                              <span>21:00</span>
                              <span>09:00</span>
                          </div>
                      </div>
                 </div>
            </div>

            {/* Row 2: Incubation Analysis */}
            <div className="flex gap-5 items-stretch min-h-[400px]">
                 {/* Left: Table Card */}
                 <div className="flex-1 min-w-[300px] bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col">
                     <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                         <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                             <span className="w-1.5 h-5 bg-emerald-500 rounded-full"></span>
                             잠복기 분석
                         </h3>
                     </div>
                     <div className="p-5 flex-1 flex flex-col">
                         {/* Exposure Time Control */}
                         <div className="mb-4">
                             <div className="text-xs font-bold text-slate-500 mb-1.5 ml-1">공동 노출 일시</div>
                             <div className="w-full bg-white border border-slate-200 rounded-lg p-2.5 flex justify-between items-center shadow-sm text-sm text-slate-700 cursor-pointer hover:bg-slate-50">
                                 <span className="font-mono">2024-04-30 18:00</span>
                                 <Clock size={14} className="text-slate-400" />
                             </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-3 mt-2">
                             <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
                                 <div className="text-[10px] text-emerald-600 font-bold mb-1">평균 잠복기</div>
                                 <div className="text-xl font-black text-emerald-700">32.5<span className="text-xs font-medium ml-1">h</span></div>
                             </div>
                             <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
                                 <div className="text-[10px] text-emerald-600 font-bold mb-1">중앙값</div>
                                 <div className="text-xl font-black text-emerald-700">30.0<span className="text-xs font-medium ml-1">h</span></div>
                             </div>
                         </div>

                         <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden flex-1 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
                             잠복기 분포 상세 데이터
                         </div>
                     </div>
                 </div>

                 {/* Right: Chart Card */}
                 <div className="flex-[2] min-w-[400px] bg-white rounded-2xl shadow-lg border border-slate-100 p-5 flex flex-col gap-5">
                      {/* Controls Bar */}
                      <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200 shadow-sm backdrop-blur-sm">
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">Incubation Chart</span>
                          <div className="ml-auto w-5 h-5 rounded-full bg-[#10b981] cursor-pointer ring-2 ring-white shadow-sm" />
                      </div>

                      {/* Chart Area */}
                      <div className="flex-1 bg-white border border-slate-100 rounded-xl relative flex items-end justify-center p-6 pb-8 gap-2">
                           <div className="w-full h-full flex items-end justify-center gap-1">
                                {[4, 8, 15, 22, 18, 10, 5].map((h, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h * 3}%` }}
                                        transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                                        className="w-8 bg-[#10b981] rounded-t-sm opacity-90 hover:opacity-100"
                                    />
                                ))}
                           </div>
                           <div className="absolute bottom-3 text-[10px] text-slate-400 font-mono">Hours after exposure</div>
                      </div>
                 </div>
            </div>
        </div>
    )
}
