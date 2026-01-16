"use client";

import { motion } from "framer-motion";
import { AdminDashboardMockup } from "./AdminDashboardMockup";
import { useTranslations } from "next-intl";

export function DashboardFeature() {
    const t = useTranslations("PartySaaS.DeepDive.Dashboard");

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div
                className="lg:col-span-3 text-left space-y-5"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight break-keep"
                    dangerouslySetInnerHTML={{ __html: t.raw('title') }}
                />
                <p className="text-sm text-gray-600 leading-relaxed break-keep"
                   dangerouslySetInnerHTML={{ __html: t.raw('description') }}
                />
            </motion.div>

            <div className="lg:col-span-9 w-full">
                <AdminDashboardMockup />
            </div>
        </div>
    );
}
