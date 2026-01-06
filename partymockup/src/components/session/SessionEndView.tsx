import React from 'react';
import WaitingScreen from '../WaitingScreen';
import EndScreen from '../EndScreen';
import { User } from '../../types';

interface SessionEndViewProps {
    status: string;
    isSelectionDone: boolean;
    myGender?: 'M' | 'F' | string;
    usersData: Record<string, User> | null;
    userId: string;
    mySessionId: string;
}

const SessionEndView: React.FC<SessionEndViewProps> = ({
    status,
    isSelectionDone,
    myGender,
    usersData,
    userId,
    mySessionId
}) => {
    // Both SELECTION (done) and ENDED states use this container for the smooth transition
    if (status !== 'ENDED' && !(status === 'SELECTION' && isSelectionDone)) {
        return null;
    }

    return (
        <div className="relative h-[70vh] w-full mt-4">
            {/* Waiting Screen: Fades out when ENDED */}
            <div
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${status === 'ENDED' ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
            >
                <WaitingScreen gender={myGender || ''} />
            </div>

            {/* End Screen: Fades in when ENDED */}
            <div
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${status === 'ENDED' ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            >
                {status === 'ENDED' && (
                    <EndScreen
                        gender={myGender || ''}
                        usersData={usersData || {}}
                        currentUserId={userId}
                        sessionId={mySessionId}
                    />
                )}
            </div>
        </div>
    );
};

export default SessionEndView;
