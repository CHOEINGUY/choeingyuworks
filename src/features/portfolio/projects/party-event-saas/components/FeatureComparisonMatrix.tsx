"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMobile } from "@/hooks/useMobile";

export function FeatureComparisonMatrix() {
    const t = useTranslations("PartySaaS.Comparison");
    const isMobile = useMobile();

    const comparisonData = [
        {
            category: t('Categories.automation'),
            features: [
                { name: t('Features.form'), party: true, rotation: true, match: true },
                { name: t('Features.invite'), party: true, rotation: true, match: true },
                { name: t('Features.deposit'), party: true, rotation: true, match: true },
            ]
        },
        {
            category: t('Categories.onsite'),
            features: [
                { name: t('Features.qr'), party: true, rotation: true, match: false },
                { name: t('Features.profile'), party: false, rotation: true, match: true },
                { name: t('Features.preview'), party: false, rotation: true, match: true },
            ]
        },
        {
            category: t('Categories.logic'),
            features: [
                { name: t('Features.timer'), party: false, rotation: true, match: false },
                { name: t('Features.vote'), party: false, rotation: true, match: false },
                { name: t('Features.pool'), party: false, rotation: false, match: true },
                { name: t('Features.arrange'), party: false, rotation: false, match: true },
                { name: t('Features.filter'), party: false, rotation: false, match: true },
            ]
        }
    ];

    // 서비스별로 기능 목록 재구성
    const serviceCards = [
        {
            key: 'party',
            title: t('headers.party'),
            features: comparisonData.flatMap(cat => 
                cat.features.filter(f => f.party).map(f => f.name)
            )
        },
        {
            key: 'rotation',
            title: t('headers.rotation'),
            features: comparisonData.flatMap(cat => 
                cat.features.filter(f => f.rotation).map(f => f.name)
            )
        },
        {
            key: 'match',
            title: t('headers.match'),
            features: comparisonData.flatMap(cat => 
                cat.features.filter(f => f.match).map(f => f.name)
            )
        }
    ];

    return (
        <section className="py-24 px-4 md:px-6 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col mb-12 md:mb-16 items-center text-center max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-4 md:mb-6 tracking-tight break-keep">
                        {t('title')}
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg break-keep leading-relaxed font-medium">
                        {t('description')}
                    </p>
                </div>

                {/* Mobile: Card Layout */}
                {isMobile ? (
                    <div className="flex flex-col gap-4">
                        {serviceCards.map((service) => (
                            <div 
                                key={service.key}
                                className="bg-gray-50 rounded-2xl p-5 border border-gray-100"
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                                    {service.title}
                                </h3>
                                <ul className="space-y-2.5">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <Check className="w-4 h-4 text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                                            <span className="text-sm text-gray-700 font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Desktop: Table Layout */
                    <div className="overflow-x-auto pb-4">
                        <div className="min-w-[800px] border-t border-gray-200">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 border-b border-gray-200 bg-white">
                                <div className="col-span-4 p-6 text-sm font-semibold text-gray-500">
                                    {t('headers.category')}
                                </div>
                                <div className="col-span-2 p-6 text-center text-sm font-bold text-gray-900">
                                    {t('headers.party')}
                                </div>
                                <div className="col-span-3 p-6 text-center text-sm font-bold text-gray-900">
                                    {t('headers.rotation')}
                                </div>
                                <div className="col-span-3 p-6 text-center text-sm font-bold text-gray-900">
                                    {t('headers.match')}
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="flex flex-col">
                                {comparisonData.map((category, catIdx) => (
                                    <div key={catIdx} className="flex flex-col">
                                        {/* Category Divider */}
                                        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{category.category}</span>
                                        </div>
                                        
                                        {/* Feature Rows */}
                                        {category.features.map((feature, fIdx) => (
                                            <div 
                                                key={fIdx} 
                                                className="grid grid-cols-12 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors duration-150"
                                            >
                                                <div className="col-span-4 px-6 py-4">
                                                    <span className="text-[15px] font-medium text-gray-700">{feature.name}</span>
                                                </div>
                                                
                                                {/* Columns */}
                                                <div className="col-span-2 px-6 py-4 flex justify-center border-l border-gray-50 min-h-[60px] items-center">
                                                    {feature.party && (
                                                        <Check className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                                                    )}
                                                </div>
                                                <div className="col-span-3 px-6 py-4 flex justify-center border-l border-gray-50 min-h-[60px] items-center">
                                                    {feature.rotation && (
                                                        <Check className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                                                    )}
                                                </div>
                                                <div className="col-span-3 px-6 py-4 flex justify-center border-l border-gray-50 min-h-[60px] items-center">
                                                    {feature.match && (
                                                        <Check className="w-5 h-5" strokeWidth={2.5} />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
