import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AIChatWidget } from "@/features/portfolio/components/AIChatWidget";

export const metadata: Metadata = {
    title: {
        template: "최인규 %s | Voithru",
        default: "최인규 포트폴리오 | Voithru",
    },
    description: "비즈니스 흐름을 읽고, 기술로 실질적인 답을 찾는 솔루션 빌더 최인규입니다.",
    openGraph: {
        title: "최인규 (Choeingyu) - Voithru 지원",
        description: "비즈니스 흐름을 읽고 실질적인 답을 찾는 솔루션 빌더",
        url: "https://choeingyu.works/voithru",
        siteName: "Choeingyu Works",
        type: "website",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    interactiveWidget: "resizes-content",
};

export default function VoithruLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar targetCompany="voithru" />
            {children}
            <Footer />
            <AIChatWidget />
        </>
    );
}
