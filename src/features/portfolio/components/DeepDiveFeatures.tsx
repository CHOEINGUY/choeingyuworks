"use client";

import { DashboardFeature } from "./deep-dive/DashboardFeature";
import { FormBuilderFeature } from "./deep-dive/FormBuilderFeature";
import { QrSystemFeature } from "./deep-dive/QrSystemFeature";

export function DeepDiveFeatures() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 flex flex-col gap-32">

                {/* Feature 1: Real-time Admin Dashboard (Promoted to Top) */}
                <DashboardFeature />

                {/* Feature 2: Custom Form & Logic Builder */}
                <FormBuilderFeature />

                {/* Feature 3: One-Pass QR System */}
                <QrSystemFeature />

            </div>
        </section>
    );
}
