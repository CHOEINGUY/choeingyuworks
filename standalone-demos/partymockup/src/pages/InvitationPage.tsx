import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useInvitationLogic } from '../hooks/useInvitationLogic';
import BottomSheet from '../components/common/BottomSheet';
import PageTitle from '../components/common/PageTitle';


// Sub-components
import InviteHeader from '../components/invite/rotation/InviteHeader';
import InviteTicket from '../components/invite/rotation/InviteTicket';
import InviteAction from '../components/invite/rotation/InviteAction';
import InviteDetails from '../components/invite/rotation/InviteDetails';

const InvitationPage: React.FC = () => {
    const {
        userInfo,
        sessionInfo,
        urlKey,
        qrSize,
        hasProfile,
        handleStart // [NEW] Use the smart handler from hook
    } = useInvitationLogic();

    const { name } = userInfo;

    // Condition to show profile creation button
    const showCreateButton = !hasProfile;

    const handleCreateProfile = () => {
        // [FIX] Use handleStart to ensure state (collectionName) is passed
        handleStart();
    };

    return (
        // Add dark:bg-slate-900 for full page dark mode
        <div className="h-[100dvh] bg-white dark:bg-black overflow-hidden relative font-sans text-slate-900 dark:text-white transition-colors duration-300">
            <PageTitle title="초대장 | Dating App" />
            {/* Main Layout */}


            <div className="relative h-full flex flex-col pt-12 pb-36 px-6 gap-6">

                {/* 1. Header */}
                <InviteHeader
                    name={name}
                    sessionInfo={sessionInfo}
                />

                {/* 2. Ticket (includes Debug Toggle) */}
                <InviteTicket
                    urlKey={urlKey || ''}
                    qrSize={qrSize}
                    sessionInfo={sessionInfo}
                    hasProfile={hasProfile}
                />

                {/* 3. Bottom Action */}
                <InviteAction
                    show={showCreateButton}
                    onClick={handleCreateProfile}
                />
            </div>

            {/* Bottom Sheet */}
            <BottomSheet
                title="행사 가이드 & 꿀팁"
                triggerText="파티 가이드 & 꿀팁 확인하기"
            >
                <InviteDetails />
            </BottomSheet>
        </div>
    );
};

export default InvitationPage;
