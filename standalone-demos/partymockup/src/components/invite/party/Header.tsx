import { usePartyRegion } from '../../../hooks/usePartyRegion';
import { useIOS } from '../../../hooks/useIOS';

interface HeaderProps {
    guestName: string;
    formattedDatetime: string;
}

const Header: React.FC<HeaderProps> = ({ guestName, formattedDatetime }) => {
    const region = usePartyRegion();
    const isIOS = useIOS();
    const title = guestName ? `🌊WAVY로 ${guestName}님을 초대합니다` : "WAVY VIP INVITATION";

    return (
        <header
            className="text-center flex flex-col items-center animate-fade-in-down"
            style={{
                // 다시 34vh로 통일
                marginTop: '34vh'
            }}
        >
            <span className="text-[#999] text-xs font-light tracking-[0.3em] uppercase mb-6">WAVY Party Invitation</span>

            <h1 id="partyTitle" className={`text-4xl font-bold text-white leading-tight tracking-tight ${isIOS ? 'mb-3' : 'mb-6'}`}>
                이상형을 만나는<br />
                특별한 파티
            </h1>

            {/* Removed standalone address div from here */}

            {/* iOS일 때 간격을 좁힘 (mb-8 -> mb-4) */}
            <div className={`w-10 h-[1px] bg-white/20 ${isIOS ? 'mb-4' : 'mb-8'}`}></div>

            <h2 id="guestName" className="text-xl font-medium text-white mb-4">{title}</h2>

            <div className="flex flex-col items-center gap-1.5 text-sm text-white/90 font-normal">

                <p>장소 : {guestName ? region.locationAddress : "부산, 대구"}</p>
                <p>일시 : {formattedDatetime}</p>
                <p className="mt-4 font-normal text-white/90">입장 전 필독 안내가 아래에 있습니다</p>
            </div>
        </header>
    );
};

export default Header;
