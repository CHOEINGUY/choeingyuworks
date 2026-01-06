
"use client";

import { DeepDiveFeatures } from "./DeepDiveFeatures";
import { DetailedFeatures } from "./DetailedFeatures";
import { BenefitsBento } from "./BenefitsBento";
import { E2EFlowBento } from "./E2EFlowBento";
import { SystemArchitecture } from "./SystemArchitecture";
import { PremiumCTA } from "./PremiumCTA";

export function PortfolioSection() {
    return (
        <div className="flex flex-col gap-0 bg-white">
            {/* 1. Main End-to-End Flow or Hero of Portfolio */}
            <E2EFlowBento />

            {/* 2. Detailed Technical/Feature Deep Dives */}
            <DeepDiveFeatures />

            {/* 3. System Architecture & Tech Stack */}
            <SystemArchitecture />

            {/* 4. Detailed Feature List (Grid) */}
            <DetailedFeatures />

            {/* 5. Business Benefits Bento Grid */}
            <BenefitsBento />

            {/* 6. Call to Action */}
            <PremiumCTA />
        </div>
    );
}
