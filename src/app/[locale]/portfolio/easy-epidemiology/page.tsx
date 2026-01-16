import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import EasyEpidemiologyClient from "./EasyEpidemiologyClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    return {
        title: t('Portfolio.easy-epidemiology.tabTitle'),
    };
}

export default function EasyEpidemiologyPage() {
    return <EasyEpidemiologyClient />;
}
