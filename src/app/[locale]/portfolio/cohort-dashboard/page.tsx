import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CohortDashboardClient from "./CohortDashboardClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    return {
        title: t('Portfolio.field.tabTitle'),
    };
}

export default function CohortDashboardPage() {
    return <CohortDashboardClient />;
}
