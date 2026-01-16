"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Circle } from "lucide-react";

export function FeatureTimeline() {
    const t = useTranslations("EasyEpidemiology.Timeline");

    const steps = [
        { id: "step1", status: "completed" },
        { id: "step2", status: "completed" },
        { id: "step3", status: "completed" },
        { id: "step4", status: "completed" },
        { id: "step5", status: "current" }
    ];

    return (
        <section className="py-20 bg-gray-50">
           <div className="max-w-3xl mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                    {t('title')}
                </h2>

                <div className="relative border-l-2 border-gray-200 ml-3 md:ml-6 space-y-12 pb-4">
                    {steps.map((step, idx) => (
                        <div key={idx} className="relative pl-8 md:pl-12">
                             <div className={`absolute -left-[9px] top-1 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center
                                ${step.status === 'completed' ? 'border-emerald-500 text-emerald-500' : 
                                  step.status === 'current' ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-300'}`}
                             >
                                 {step.status === 'completed' ? <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" /> :
                                  step.status === 'current' ? <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" /> :
                                  <div className="w-2.5 h-2.5 bg-gray-200 rounded-full" />}
                             </div>

                             <div>
                                 <span className={`text-xs font-bold uppercase tracking-wider mb-1 block
                                     ${step.status === 'completed' ? 'text-emerald-600' : 
                                       step.status === 'current' ? 'text-blue-600' : 'text-gray-400'}`}
                                 >
                                     {t(`${step.id}.phase`)}
                                 </span>
                                 <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                                     {t(`${step.id}.title`)}
                                 </h3>
                                 <p className="text-gray-600 leading-relaxed text-sm md:text-base break-keep">
                                     {t(`${step.id}.desc`)}
                                 </p>
                             </div>
                        </div>
                    ))}
                </div>
           </div>
        </section>
    );
}
