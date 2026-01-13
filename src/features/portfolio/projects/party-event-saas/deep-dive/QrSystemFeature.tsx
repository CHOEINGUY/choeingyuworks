"use client";

import { motion } from "framer-motion";
import { QrSystemMockup } from "./QrSystemMockup/index";
import { useTranslations } from "next-intl";

export function QrSystemFeature() {
    const t = useTranslations("PartySaaS.DeepDive.QrSystem");

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Text Section (Left, matching Dashboard layout) */}
            <motion.div
                className="lg:col-span-3 space-y-5 order-2 lg:order-1"
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

            {/* High-Fidelity QR Mockup Section (Right, col-span-9 for standard height) */}
            <div className="lg:col-span-9 w-full order-1 lg:order-2">
                <QrSystemMockup />
            </div>
        </div>
    );
}
