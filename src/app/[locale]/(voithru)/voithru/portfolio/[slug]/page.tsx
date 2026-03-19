"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import EasyEpidemiologyClient from "@/app/[locale]/(default)/portfolio/easy-epidemiology/EasyEpidemiologyClient";
import CohortDashboardClient from "@/app/[locale]/(default)/portfolio/cohort-dashboard/CohortDashboardClient";
import PartySaaSClient from "@/app/[locale]/(default)/portfolio/party-saas/PartySaaSClient";

// 이 컴포넌트는 Voithru 레이아웃 안에서 렌더링되므로, 헤더/푸터가 유지됩니다.
export default function VoithruPortfolioDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    const backLink = "/voithru/portfolio";

    // 슬러그에 따라 적절한 클라이언트 컴포넌트 렌더링
    // 주의: 내부의 뒤로가기 버튼 링크는 하드코딩 되어 있을 수 있음.
    // 완벽하게 하려면 Client 컴포넌트들에 backLink prop을 추가해야 하지만,
    // 일단 컨텍스트 유지가 우선이므로 컴포넌트 재사용.
    switch (slug) {
        case "easy-epidemiology":
            return <EasyEpidemiologyClient backLink={backLink} />;
        case "cohort-dashboard":
            return <CohortDashboardClient backLink={backLink} />;
        case "party-saas":
            return <PartySaaSClient backLink={backLink} />;
        default:
            notFound();
    }
}
