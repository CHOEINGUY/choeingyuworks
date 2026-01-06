import React, { useState } from 'react';
import { Mail, Users, HeartHandshake } from 'lucide-react';
import MobilePremiumInbox from './MobilePremiumInbox';
import MobilePremiumPool from './MobilePremiumPool';
import { Applicant } from '../../../../types';

interface MobilePremiumManagerProps {
    isDark: boolean;
    applicants: Applicant[];
    actions: any;
}

const MobilePremiumManager: React.FC<MobilePremiumManagerProps> = ({ isDark, applicants = [], actions }) => {
    const [activeTab, setActiveTab] = useState('inbox');

    const renderContent = () => {
        switch (activeTab) {
            case 'inbox':
                return <MobilePremiumInbox isDark={isDark} applicants={applicants} actions={actions} />;
            case 'pool':
                return <MobilePremiumPool isDark={isDark} applicants={applicants} actions={actions} />;
            case 'matching':
                return (
                    <div className="p-10 flex flex-col items-center justify-center h-64 text-gray-400 gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <HeartHandshake size={32} className="opacity-50" />
                        </div>
                        <span>매칭 기능 준비중입니다</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`flex flex-col h-full ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
            {/* Top Navigation - Segmented Control Style */}
            <div className={`shrink-0 px-4 py-3 ${isDark ? 'bg-slate-900 border-gray-800' : 'bg-white border-gray-100'} border-b shadow-sm z-10`}>
                <div className={`flex p-1 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                    <TabButton
                        id="inbox" label="신청 접수" icon={<Mail size={16} />}
                        active={activeTab === 'inbox'} onClick={() => setActiveTab('inbox')} isDark={isDark}
                    />
                    <TabButton
                        id="pool" label="회원 풀" icon={<Users size={16} />}
                        active={activeTab === 'pool'} onClick={() => setActiveTab('pool')} isDark={isDark}
                    />
                    <TabButton
                        id="matching" label="매칭 현황" icon={<HeartHandshake size={16} />}
                        active={activeTab === 'matching'} onClick={() => setActiveTab('matching')} isDark={isDark}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {renderContent()}
            </div>
        </div>
    );
};

// Simplified Tab Button
interface TabButtonProps {
    id: string;
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
    isDark?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, active, onClick, isDark }) => {
    return (
        <button
            onClick={onClick}
            className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                ${active
                    ? (isDark
                        ? 'bg-slate-700 text-white shadow-md'
                        : 'bg-white text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)]')
                    : (isDark
                        ? 'text-gray-500 hover:text-gray-300'
                        : 'text-gray-500 hover:text-gray-700')
                }
            `}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
};

export default MobilePremiumManager;
