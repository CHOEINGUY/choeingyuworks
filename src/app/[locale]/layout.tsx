import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
// CURRENT_BRAND unused
import { AIChatWidget } from "@/features/portfolio/components/AIChatWidget";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const titlePrefix = locale === 'ko' ? '최인규의' : 'Choeingyu';
    const defaultTitle = locale === 'ko' ? `${titlePrefix} 포트폴리오 & 솔루션 엔지니어` : `${titlePrefix} Portfolio & Solution Engineer`;
    
    return {
        metadataBase: new URL("https://choeingyu.works"),
        title: {
            template: `${titlePrefix} %s`,
            default: defaultTitle,
        },
        description: "비즈니스 흐름을 읽고, 기술로 실질적인 답을 찾는 솔루션 빌더 최인규입니다. 3개월 걸리던 업무를 1개월로 단축한 경험처럼, 현장의 병목을 해결하고 운영 효율을 극대화합니다.",
        openGraph: {
            title: "최인규 (Choeingyu) - Business Solution Engineer",
            description: "비즈니스 흐름을 읽고 실질적인 답을 찾는 솔루션 빌더. 복잡한 업무 프로세스를 자동화하고 운영 비용을 절감합니다.",
            url: "https://choeingyu.works",
            siteName: "Choeingyu Works",
            locale: "ko_KR",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "최인규 (Choeingyu) - Business Solution Engineer",
            description: "비즈니스 흐름을 읽고 실질적인 답을 찾는 솔루션 빌더",
        },
    };
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    interactiveWidget: "resizes-content",
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <link
                    rel="stylesheet"
                    as="style"
                    crossOrigin="anonymous"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
                />
            </head>
            <body className="antialiased" suppressHydrationWarning>
                <NextIntlClientProvider messages={messages}>
                    <Navbar />
                    {children}
                    <Footer />
                    <AIChatWidget />
                    <Analytics />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
