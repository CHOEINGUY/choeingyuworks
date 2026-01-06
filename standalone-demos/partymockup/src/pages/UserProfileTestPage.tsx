import React from 'react';
import DynamicProfileForm from '../components/profile/renderer/DynamicProfileForm';
import PageTitle from '../components/common/PageTitle';


const UserProfileTestPage: React.FC = () => {
    return (
        <>
            <PageTitle title="프로필 | Dating App" />
            <DynamicProfileForm />
        </>
    );

};

export default UserProfileTestPage;
