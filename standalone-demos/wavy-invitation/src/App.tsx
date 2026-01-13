import { useEffect, useState, useRef } from 'react';
import './index.css';
import Navigation from './components/Navigation';
import Header from './components/Header';
import QRCodeSection from './components/QRCodeSection';
import GuideSection from './components/GuideSection';

import SplashScreen from './components/SplashScreen';
import ParallaxBackground from './components/ParallaxBackground';
import { formatEventDateTime, getScheduleData, Schedule } from './utils/schedule';

import { supabase } from './lib/supabase';
import { useRegion } from './hooks/useRegion';
import { useRealtimeCheckin } from './hooks/useRealtimeCheckin';


import WelcomePage from './components/WelcomePage';
import ApplicationLinkSection from './components/ApplicationLinkSection';

function App() {
    const region = useRegion();
    const [guestName, setGuestName] = useState<string>('');
    const [guestKey, setGuestKey] = useState<string | null>(null);

    // View State
    const [view, setView] = useState<'invitation' | 'welcome'>('invitation');
    const [redirectUrl, setRedirectUrl] = useState<string>('');

    // Enable Realtime Check-in
    useRealtimeCheckin(guestKey || undefined, (url) => {
        setRedirectUrl(url);
        setView('welcome');
    });

    const [eventDatetime, setEventDatetime] = useState<string | null>(null);
    const [formattedDatetime, setFormattedDatetime] = useState<string>('');
    const [scheduleData, setScheduleData] = useState<Schedule | null>(null);

    const qrSectionRef = useRef<HTMLDivElement>(null);

    const scrollToQr = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        const fetchGuestInfo = async () => {
            const params = new URLSearchParams(window.location.search);
            const key = params.get('key');

            if (!key) {
                // Landing page: Provide default schedule for display
                const defaultSchedule = getScheduleData('19', null);
                setScheduleData(defaultSchedule);
                return;
            }
            setGuestKey(key);

            const tableName = region.dbTable;

            // Updated Fetch: Include checked_in and redirect_url
            const { data, error } = await supabase
                .from(tableName)
                .select('name, event_date, checked_in, redirect_url')
                .eq('id', key)
                .single();

            if (data && !error) {
                setGuestName(data.name || '');
                const datetime = data.event_date || '';
                setEventDatetime(datetime);
                if (datetime) {
                    setFormattedDatetime(formatEventDateTime(datetime));
                }

                // Initial Check: If already checked in, show Welcome Page directly
                if (data.checked_in && data.redirect_url) {
                    setRedirectUrl(data.redirect_url);
                    setView('welcome');
                }

                const startHourParam = params.get('start');
                const derivedStartHour = datetime ? datetime.split('_')[1]?.substring(0, 2) : startHourParam;

                const schedule = getScheduleData(derivedStartHour, datetime);
                setScheduleData(schedule);
            }
        };

        fetchGuestInfo();

        document.title = region.partyTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', region.metaDescription);
        } else {
            const tempMeta = document.createElement('meta');
            tempMeta.name = "description";
            tempMeta.content = region.metaDescription;
            document.head.appendChild(tempMeta);
        }
    }, [region]);

    if (view === 'welcome') {
        return <WelcomePage redirectUrl={redirectUrl} userId={guestKey} scheduleData={scheduleData} />;
    }

    return (
        <>
            <SplashScreen />
            <Navigation />
            <ParallaxBackground />

            <main className="relative z-10 w-full max-w-[430px] mx-auto">
                <section className="min-h-[100dvh] flex flex-col items-center relative">
                    <Header
                        guestName={guestName}
                        formattedDatetime={formattedDatetime || "매주 금 8PM, 토 7PM"}
                    />

                    <button
                        onClick={scrollToQr}
                        className="mt-auto mb-8 flex flex-col items-center gap-4 animate-bounce group cursor-pointer"
                        aria-label="스크롤하여 확인하기"
                    >
                        <span className="text-white text-sm font-light tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                            {guestKey ? "입장 QR코드 확인하기" : "웨이비 파티 신청하기"}
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
                    {guestKey ? (
                        <QRCodeSection guestKey={guestKey} eventDatetime={eventDatetime} />
                    ) : (
                        <ApplicationLinkSection />
                    )}

                    <GuideSection scheduleData={scheduleData} />
                </section>
            </main>
        </>
    );
}



export default App;
