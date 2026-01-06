"use client";

import { motion } from "framer-motion";
import { FormBuilderMockup } from "./FormBuilderMockup";

export function FormBuilderFeature() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Ultra-High-Fidelity Mockup Section (Left) */}
            <div className="lg:col-span-9 w-full order-2 lg:order-1">
                <FormBuilderMockup />
            </div>

            {/* Text Section (Right) */}
            <motion.div
                className="lg:col-span-3 text-left space-y-5 order-1 lg:order-2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight break-keep">
                    스모어, 구글폼... <br />아직도 따로 쓰시나요?
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed break-keep">
                    신청서가 곧바로 관리자 페이지와 연동됩니다. <br className="hidden md:block" />
                    엑셀로 옮길 필요 없이, 신청과 동시에 실시간 데이터로 쌓이는 경험을 해보세요.
                </p>
            </motion.div>
        </div>
    );
}
