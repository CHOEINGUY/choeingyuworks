"use client";

import { motion } from "framer-motion";

import { useTranslations } from "next-intl";

export function AboutSection() {
    const t = useTranslations("Hero");

    const features = [
        {
            title: t("aboutSection.features.business.title"),
            description: t("aboutSection.features.business.description")
        },
        {
            title: t("aboutSection.features.asset.title"),
            description: t("aboutSection.features.asset.description")
        },
        {
            title: t("aboutSection.features.stability.title"),
            description: t("aboutSection.features.stability.description")
        }
    ];

    return (
        <section className="w-full bg-white pt-20 md:pt-32 pb-16 md:pb-24">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 break-words">
                        {t.rich("aboutSection.headline", {
                            line: () => <br className="hidden md:block" />
                        })}
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto break-words">
                        {t.rich("aboutSection.description", {
                            line: () => <br className="hidden md:block" />,
                            b: (chunks) => <strong className="font-bold text-gray-900">{chunks}</strong>
                        })}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group"
                        >
                            <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed break-words">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
