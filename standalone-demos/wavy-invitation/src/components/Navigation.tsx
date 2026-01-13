import React from 'react';
import { useRegion } from '../hooks/useRegion';

const Navigation: React.FC = () => {
    const region = useRegion();

    return (
        <nav className="absolute top-0 w-full flex justify-between px-6 pt-[calc(1.25rem+env(safe-area-inset-top))] z-50 max-w-[430px] left-1/2 -translate-x-1/2">
            <a href={region.mapUrl} target="_blank" rel="noopener noreferrer" aria-label="네이버지도 길찾기 열기"
                className="w-10 h-10 bg-black/50 backdrop-blur-md border border-white/20 rounded-full flex justify-center items-center shadow-lg hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className="fill-white w-5 h-5">
                    <path fill="currentColor"
                        d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                </svg>
            </a>
            <a href={region.littlyUrl} target="_blank" rel="noopener noreferrer" aria-label="WAVY 링크 바로가기"
                className="w-10 h-10 bg-black/50 backdrop-blur-md border border-white/20 rounded-full flex justify-center items-center shadow-lg hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px" className="fill-white w-5 h-5">
                    <path
                        d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2z" />
                </svg>
            </a>
        </nav>
    );
};

export default Navigation;
