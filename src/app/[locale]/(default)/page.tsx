import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HomeClient from "./HomeClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata" });
    const titlePrefix = locale === 'ko' ? '최인규의' : 'Choeingyu';
    
    return {
        title: `${titlePrefix} ${t('home')}`,
    };
}

export default function Home() {
    return <HomeClient />;
}
