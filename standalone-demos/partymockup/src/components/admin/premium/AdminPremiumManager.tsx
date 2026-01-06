import React, { useState } from 'react';
import { Mail, Users, HeartHandshake } from 'lucide-react';
import PremiumInbox from './PremiumInbox';
import PremiumMemberPool from './PremiumMemberPool';
import PremiumMatchingStatus from './PremiumMatchingStatus';
import { Applicant } from '../../../types';
import { usePremiumMatches } from '../../../hooks/usePremiumMatches';

interface AdminPremiumManagerProps {
    isDark?: boolean;
    applicants: Applicant[];
    actions?: any;
}

const AdminPremiumManager: React.FC<AdminPremiumManagerProps> = ({ isDark, applicants = [], actions }) => {
    const [activeTab, setActiveTab] = useState('inbox'); // 'inbox', 'pool', 'matching'
    const { createMatch, matches } = usePremiumMatches();
    // Filter Logic for 1:1 Premium Applicants
    // const PREMIUM_SESSION_ID = 'premium_1on1';

    // Calculate Active Match IDs (Exclude 'failed' matches)
    // Users in 'matched', 'notified', 'scheduling', 'scheduled', 'completed' should be hidden from pool
    const activeMatchUserIds = React.useMemo(() => {
        const ids = new Set<string>();
        matches.forEach(m => {
            if (m.status !== 'failed') {
                ids.add(m.maleId);
                ids.add(m.femaleId);
            }
        });
        return Array.from(ids);
    }, [matches]);

    const mergedApplicants = applicants;

    const smartActions = {
        ...actions,
        approveApplicant: async (id: string) => {
            if (actions?.approvePremiumApplicant) await actions.approvePremiumApplicant(id);
        },
        rejectApplicant: async (id: string) => {
            if (actions?.rejectPremiumApplicant) await actions.rejectPremiumApplicant(id);
        },
        updateApplicant: async (id: string, data: any) => {
            if (actions?.updatePremiumApplicant) await actions.updatePremiumApplicant(id, data);
        },
        deleteApplicant: async (id: string) => {
            if (actions?.deletePremiumApplicant) await actions.deletePremiumApplicant(id);
        },
        // Pass through verify logic if needed
        createMatch: async (maleId: string, femaleId: string) => {
            // Find Names
            const male = mergedApplicants.find(a => a.id === maleId);
            const female = mergedApplicants.find(a => a.id === femaleId);
            if (male && female) {
                await createMatch(maleId, femaleId, male.name || 'Unknown', female.name || 'Unknown');
            }
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'inbox':
                return (
                    <PremiumInbox
                        isDark={isDark}
                        applicants={mergedApplicants}
                        actions={smartActions}
                    />
                );
            case 'pool':
                return (
                    <PremiumMemberPool
                        isDark={isDark}
                        applicants={mergedApplicants}
                        actions={smartActions}
                        excludingIds={activeMatchUserIds}
                    />
                );
            case 'matching':
                return <PremiumMatchingStatus isDark={isDark} applicants={mergedApplicants} />;
            default:
                return (
                    <PremiumInbox
                        isDark={isDark}
                        applicants={mergedApplicants}
                        actions={smartActions}
                    />
                );
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
            {/* Header + Nav Consolidated */}
            <div className={`shrink-0 h-[72px] flex items-center justify-between px-6 border-b z-20 sticky top-0 ${isDark ? 'bg-slate-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                {/* Title */}
                <div className="flex items-center gap-3">
                    <h1 className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                        1:1 프리미엄
                    </h1>
                </div>

                {/* Navigation (Form Builder Style Toggle) */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    <TabButton
                        id="inbox"
                        label="신청 접수"
                        icon={<Mail size={16} />}
                        active={activeTab === 'inbox'}
                        onClick={() => setActiveTab('inbox')}
                        isDark={isDark}
                    />
                    <TabButton
                        id="pool"
                        label="회원 풀"
                        icon={<Users size={16} />}
                        active={activeTab === 'pool'}
                        onClick={() => setActiveTab('pool')}
                        isDark={isDark}
                    />
                    <TabButton
                        id="matching"
                        label="매칭 현황"
                        icon={<HeartHandshake size={16} />}
                        active={activeTab === 'matching'}
                        onClick={() => setActiveTab('matching')}
                        isDark={isDark}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className={`flex-1 overflow-hidden relative ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                {renderContent()}
            </div>
        </div>
    );
};

// Helper Component for Tabs (Form Builder Style)
interface TabButtonProps {
    id: string;
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
    isDark?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, active, onClick }) => {
    // Active: White Card, Purple Text
    const activeStyle = 'bg-white text-purple-600 shadow-sm';

    // Inactive: Slate Text
    const inactiveStyle = 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50';

    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                ${active ? activeStyle : inactiveStyle}
            `}
        >
            {icon}
            {label}
        </button>
    );
};

export default AdminPremiumManager;
