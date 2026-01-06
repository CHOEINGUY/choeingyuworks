"use client";

import { motion } from "framer-motion";
import { AdminDashboardMockup } from "./AdminDashboardMockup";

export function DashboardFeature() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div
                className="lg:col-span-3 text-left space-y-5"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight break-keep">
                    입금 확인부터 문자 발송까지,<br />
                    100% 자동화
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed break-keep">
                    통장 내역을 일일이 대조하고 문자를 보내던 반복 업무는 이제 그만.<br className="hidden md:block" />
                    시스템이 입금을 감지하고 티켓 발송까지 알아서 처리합니다.
                </p>
            </motion.div>

            <div className="lg:col-span-9 w-full">
                <AdminDashboardMockup />
            </div>
        </div>
    );
}
