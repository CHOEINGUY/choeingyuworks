
import { ResumeV2 } from "@/features/resume/components/ResumeV2";
import { Metadata, ResolvingMetadata } from "next";

import { getTranslations } from "next-intl/server";

export async function generateMetadata(
    { params }: { params: Promise<{ locale: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    const parentMetadata = await parent;
    const previousImages = parentMetadata.openGraph?.images || [];

    return {
        title: t('Metadata.resume'),
        description: "이력서와 포트폴리오를 확인하세요.",
        openGraph: {
            title: t('Metadata.resume'),
            description: "이력서와 포트폴리오를 확인하세요.",
            images: previousImages,
        },
    };
}

export default function ResumePageV2() {
    return <ResumeV2 />;
}
