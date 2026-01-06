import React from 'react';
import ProfileCard from '../ProfileCard';
import TopicRecommender from '../TopicRecommender';
import { User } from '../../types';

interface SessionLiveViewProps {
    partner: User | null;
    themeMode: 'day' | 'night';
    themeStyle: 'standard' | 'glass';
    myGender?: 'M' | 'F' | string;
    dataLoading: boolean;
    rotationsData: any;
}

const SessionLiveView: React.FC<SessionLiveViewProps> = ({
    partner,
    themeMode,
    themeStyle,
    myGender,
    dataLoading,
    rotationsData
}) => {
    return (
        <>
            {partner ? (
                <div key="profile" className="animate-in fade-in slide-in-from-bottom-24 duration-1000 ease-out">
                    <ProfileCard user={partner} themeMode={themeMode} themeStyle={themeStyle} />
                </div>
            ) : (
                !dataLoading && rotationsData && (
                    <div className="text-center p-8 opacity-50 bg-white/50 rounded-xl">
                        <p>현재 라운드의 파트너를 찾을 수 없습니다.</p>
                        <p className="text-xs mt-2">잠시만 기다려주세요...</p>
                    </div>
                )
            )}
            <TopicRecommender gender={myGender} themeMode={themeMode} />
        </>
    );
};

export default SessionLiveView;
