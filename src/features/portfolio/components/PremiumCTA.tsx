"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function PremiumCTA() {
    return (
        <section className="py-24 md:py-32 px-6 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto text-center">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111827] mb-8 tracking-tight break-keep leading-[1.15]">
                        비즈니스의 시스템화,<br />
                        지금 시작하세요.
                    </h2>

                    <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed break-keep">
                        수백 명 규모의 이벤트도 1인 운영이 가능해집니다.<br className="hidden md:block" />
                        불필요한 운영 시간은 줄이고, 더 중요한 기획과 전략에 집중하세요.
                    </p>

                    <div className="flex justify-center">
                        <Link href="/request">
                            <Button size="lg" className="h-16 px-12 rounded-full bg-[#111827] hover:bg-[#1E293B] text-white text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-200">
                                솔루션 도입 문의하기
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
