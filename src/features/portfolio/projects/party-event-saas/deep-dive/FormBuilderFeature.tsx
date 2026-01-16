"use client";

import { motion } from "framer-motion";
import { FormBuilderMockup } from "./FormBuilderMockup";
import { useTranslations } from "next-intl";

export function FormBuilderFeature() {
    const t = useTranslations("PartySaaS.DeepDive.FormBuilder");

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
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight break-keep"
                    dangerouslySetInnerHTML={{ __html: t.raw('title') }}
                />
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed break-keep"
                       dangerouslySetInnerHTML={{ __html: t.raw('description') }}
                    />
                </div>
            </motion.div>
        </div>
    );
}
