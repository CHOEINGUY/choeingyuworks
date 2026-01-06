"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Target } from "lucide-react";
import { useTranslations } from "next-intl";

export function AboutSection() {
    const t = useTranslations("Hero");

    const features = [
        {
            icon: <Target className="w-5 h-5 text-blue-500" />,
            title: "Empathy-to-Code",
            description: "기획자의 고민에서 시작해 코드로 끝맺는 문제 해결형 개발을 지향합니다."
        },
        {
            icon: <Zap className="w-5 h-5 text-amber-500" />,
            title: "Lindy Logic",
            description: "유행을 타지 않고 시간이 흐를수록 가치가 증명되는 본질적인 시스템을 구축합니다."
        },
        {
            icon: <Shield className="w-5 h-5 text-emerald-500" />,
            title: "Uncompromising Quality",
            description: "한 번의 클릭이 수백 명의 경험으로 이어지기에, 사소한 예외 상황도 타협하지 않습니다."
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
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 break-keep">
                        "반복이 아닌 본질에 집중할 수 있도록,<br className="hidden md:block" /> 개발자의 고집으로 빚어낸 도구입니다."
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto break-keep">
                        파편화된 도구들 사이에서 소모되는 기획자의 시간을 보고만 있을 수 없었습니다.
                        엑셀과 구글폼이 채워주지 못하는 빈틈을 메우기 위해, 현장의 문제를 코드로 직접 해결하며 이 솔루션을 시작했습니다.
                        화려한 기능보다 현장에서 정말로 '살아남는' 로직을 만듭니다.
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
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed break-keep">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
