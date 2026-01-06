import React from 'react';
import ProfileBuilder from '../components/admin/profile_builder/ProfileBuilder';

const AdminProfileBuilderPage: React.FC = () => {
    return (
        <div className="h-screen flex flex-col pt-16"> {/* Assuming Header height is 64px (pt-16) generally or managed by Layout */}
            {/* 
                NOTE: The main App layout usually handles the sidebar and header. 
                If this page needs to fill the content area, h-full is enough.
                We use h-[calc(100vh-64px)] if header is fixed.
             */}
            <div className="flex-1 min-h-0">
                <ProfileBuilder />
            </div>
        </div>
    );
};

export default AdminProfileBuilderPage;
