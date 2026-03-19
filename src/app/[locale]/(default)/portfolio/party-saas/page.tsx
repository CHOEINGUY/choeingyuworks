import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PartySaaSClient from "./PartySaaSClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    return {
        title: t('Portfolio.solution.tabTitle'),
    };
}


export default function PartySaaSPage() {
    return <PartySaaSClient />;
}
