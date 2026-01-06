import React, { useEffect, useState, useRef } from 'react';
import { useInvitationLogic } from '../hooks/useInvitationLogic';
import PageTitle from '../components/common/PageTitle';

// Party Specific Components
import Navigation from '../components/invite/party/Navigation';
import Header from '../components/invite/party/Header';
import QRCodeSection from '../components/invite/party/QRCodeSection';
import GuideSection from '../components/invite/party/GuideSection';
import SplashScreen from '../components/invite/party/SplashScreen';
import ParallaxBackground from '../components/invite/party/ParallaxBackground';
import ApplicationLinkSection from '../components/invite/party/ApplicationLinkSection';

// Utils
import { formatEventDateTime, getScheduleData, Schedule } from '../utils/partySchedule';

const InvitationPartyPage: React.FC = () => {
    const {
        userInfo,
        sessionInfo,
        urlKey,
        isDataReady
    } = useInvitationLogic();

    const [formattedDatetime, setFormattedDatetime] = useState<string>('');
    const [scheduleData, setScheduleData] = useState<Schedule | null>(null);
    const qrSectionRef = useRef<HTMLDivElement>(null);

    const scrollToQr = () => {
        if (qrSectionRef.current) {
            qrSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        if (sessionInfo) {
            const datetime = sessionInfo.date || '';
            if (datetime) {
                setFormattedDatetime(formatEventDateTime(datetime));
            }

            // Derive start hour for schedule
            // format: "2024.01.24 (Sat) 19:00" or similar
            // Looking at useInvitationLogic, sessionInfo is the Firestore data.
            // Let's assume sessionInfo.date is what we use.
            const startHourMatch = datetime.match(/(\d{2}):\d{2}/);
            const derivedStartHour = startHourMatch ? startHourMatch[1] : '19';

            const schedule = getScheduleData(derivedStartHour, datetime);
            setScheduleData(schedule);
        }
    }, [sessionInfo]);

    if (!isDataReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-[100dvh] overflow-x-hidden transition-colors duration-300">
            <PageTitle title="초대장 | WAVY" />
            <SplashScreen />
            <Navigation />
            <ParallaxBackground />

            <main className="relative z-10 w-full max-w-[430px] mx-auto">
                <section className="min-h-[100dvh] flex flex-col items-center relative">
                    <Header
                        guestName={userInfo.name}
                        formattedDatetime={formattedDatetime || "매주 금 8PM, 토 7PM"}
                    />

                    <button
                        onClick={scrollToQr}
                        className="mt-auto mb-8 flex flex-col items-center gap-4 animate-bounce group cursor-pointer"
                        aria-label="스크롤하여 확인하기"
                    >
                        <span className="text-white text-sm font-light tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                            {urlKey ? "입장 QR코드 확인하기" : "웨이비 파티 신청하기"}
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white/80 group-hover:text-white transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </section>

                <section ref={qrSectionRef} className="flex flex-col items-center justify-center pt-0 pb-0 w-full gap-32">
                    {urlKey ? (
                        <QRCodeSection guestKey={urlKey} eventDatetime={sessionInfo.date} />
                    ) : (
                        <ApplicationLinkSection />
                    )}

                    <GuideSection scheduleData={scheduleData} />
                </section>
            </main>
        </div>
    );
};

export default InvitationPartyPage;
