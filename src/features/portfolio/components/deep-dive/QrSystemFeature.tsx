"use client";

import { motion } from "framer-motion";
import { QrSystemMockup } from "./QrSystemMockup";

export function QrSystemFeature() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

            {/* Text Section (Left, for alternating flow) */}
            <motion.div
                className="space-y-6 order-2 lg:order-1"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight break-keep">
                    입장부터 리다이렉션까지,<br />
                    QR 하나로 끝
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed break-keep">
                    현장에서 종이 명단을 찾지 마세요. <br className="hidden md:block" />
                    QR 스캔 1초면 출석 확인은 물론, <br className="hidden md:block" />
                    참가자 맞춤형 페이지로 즉시 연결됩니다.
                </p>
            </motion.div>

            {/* High-Fidelity QR Mockup Section (Right) */}
            <QrSystemMockup />
        </div>
    );
}
