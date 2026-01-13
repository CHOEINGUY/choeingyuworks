"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

export function FeatureComparisonMatrix() {
    const t = useTranslations("PartySaaS.Comparison");

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

    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col mb-16 items-center text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight break-keep">
                        {t('title')}
                    </h2>
                    <p className="text-gray-600 text-lg break-keep leading-relaxed font-medium">
                        {t('description')}
                    </p>
                </div>

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
                                                    <Check className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
