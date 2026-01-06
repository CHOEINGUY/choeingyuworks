import React from 'react';
import FeedbackForm from '../FeedbackForm';
import ProfileCard from '../ProfileCard';
import { CheckCircle } from 'lucide-react';
import { User } from '../../types';

interface SessionBreakViewProps {
    partner: User | null;
    isWaitingForNextRound: boolean;
    isFeedbackExiting: boolean;
    onSubmitFeedback: (data: any) => Promise<void>;
    themeMode: 'day' | 'night';
    themeStyle: 'standard' | 'glass';
    currentRound: number;
    totalRounds: number;
    nextPartner: User | null;
}

const SessionBreakView: React.FC<SessionBreakViewProps> = ({
    partner,
    isWaitingForNextRound,
    isFeedbackExiting,
    onSubmitFeedback,
    themeMode,
    themeStyle,
    currentRound,
    totalRounds,
    nextPartner
}) => {
    if (!partner) return null;

    if (isWaitingForNextRound) {
        return (
            <div key="waiting-next" className="flex flex-col justify-center h-full animate-in slide-in-from-bottom-48 fade-in duration-1000 text-center text-white relative mt-4">
                {currentRound >= totalRounds ? (
                    <div className="py-8">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                            <CheckCircle size={40} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">모든 라운드 종료!</h2>
                        <p className="text-white/80 leading-relaxed">
                            모든 로테이션 대화가 종료되었습니다.<br />
                            잠시 후 최종 선택이 시작됩니다.
                        </p>
                    </div>
                ) : (
                    <>
                        {nextPartner ? (
                            <div className="transition-all duration-700 transform">
                                <p className="text-xl font-bold text-white mb-2 animate-pulse">곧 다음 라운드가 시작됩니다</p>
                                <p className="text-sm text-white/60 mb-12 font-medium tracking-widest uppercase">Next Partner</p>
                                <div className="transform scale-100 transition-transform duration-500 shadow-2xl">
                                    <ProfileCard user={nextPartner} themeMode={themeMode} themeStyle={themeStyle} />
                                </div>
                            </div>
                        ) : (
                            <div className="text-center opacity-70">
                                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                                <p>다음 파트너 매칭 중...</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }

    return (
        <div key="feedback" className={`animate-in fade-in slide-in-from-bottom-4 transition-all duration-1000 ${isFeedbackExiting ? 'opacity-0 blur-sm scale-95' : 'opacity-100'}`}>
            <FeedbackForm
                partnerName={partner.name || ''}
                onSubmit={onSubmitFeedback}
                themeMode={themeMode}
                themeStyle={themeStyle}
            />
        </div>
    );
};

export default SessionBreakView;
