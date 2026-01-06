import { MapPin, Link as LinkIcon } from 'lucide-react';
import { usePartyRegion } from '../../../hooks/usePartyRegion';

const Navigation: React.FC = () => {
    const region = usePartyRegion();

    return (
        <nav className="absolute top-0 w-full flex justify-between px-6 pt-[calc(1.25rem+env(safe-area-inset-top))] z-50 max-w-[430px] left-1/2 -translate-x-1/2">
            <a href={region.mapUrl} target="_blank" rel="noopener noreferrer" aria-label="네이버지도 길찾기 열기"
                className="w-10 h-10 bg-black/50 backdrop-blur-md border border-white/20 rounded-full flex justify-center items-center shadow-lg hover:scale-105 transition-transform">
                <MapPin className="text-white w-5 h-5" />
            </a>
            <a href={region.littlyUrl} target="_blank" rel="noopener noreferrer" aria-label="WAVY 링크 바로가기"
                className="w-10 h-10 bg-black/50 backdrop-blur-md border border-white/20 rounded-full flex justify-center items-center shadow-lg hover:scale-105 transition-transform">
                <LinkIcon className="text-white w-5 h-5" />
            </a>
        </nav>
    );
};

export default Navigation;
