
import { ResumeV2 } from "@/features/resume/components/ResumeV2";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
    { params: _params }: { params: Promise<{ locale: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const parentMetadata = await parent;
    const previousImages = parentMetadata.openGraph?.images || [];

    return {
        title: "최인규님의 웹 이력서",
        description: "이력서와 포트폴리오를 확인하세요.",
        openGraph: {
            title: "최인규님의 웹 이력서",
            description: "이력서와 포트폴리오를 확인하세요.",
            images: previousImages,
        },
    };
}

export default function ResumePageV2() {
    return <ResumeV2 />;
}
