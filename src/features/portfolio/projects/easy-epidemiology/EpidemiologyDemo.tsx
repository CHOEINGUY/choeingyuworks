import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Table, 
    BarChart3, 
    Activity, 
    Users, 
    GitBranch,
    ClipboardList,
    FileEdit,
    Info,
    Database,
    Globe,
    LogOut,
    Lock,
    ArrowRight,
} from 'lucide-react';
import { BrowserFrame } from '@/features/portfolio/components/BrowserFrame';
import { AuthenticGridContent } from './components/AuthenticGridContent';
import { AuthenticCurveContent } from './components/AuthenticCurveContent';
import { AuthenticSymptomsContent } from './components/AuthenticSymptomsContent';
import { AuthenticReportContent } from './components/AuthenticReportContent';
import { AuthenticCohortContent } from './components/AuthenticCohortContent';

interface Props {
    scale?: number;
    isLandingPage?: boolean;
    isActive?: boolean;
    isEmbedded?: boolean;
}

export function EpidemiologyDemo({ scale = 1, isLandingPage = false, isEmbedded = false, isActive = true }: Props) {
    // const [scale, setScale] = useState(1); // Removed: Use prop directly
    const [activeTab, setActiveTab] = useState('DataInputVirtual');
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    
    // Auto-Play Sequence
    useEffect(() => {
        if (isActive) {
            setIsAutoPlay(true);
        } else {
            setIsAutoPlay(false);
        }
    }, [isActive]);

    useEffect(() => {
        if (!isAutoPlay) return;

        let timeout: NodeJS.Timeout;

        // Sequence: DataInput -> Curve -> Symptoms -> Cohort -> Report -> Loop
        const timings: Record<string, number> = {
            DataInputVirtual: 5000, // Wait for scroll animation
            EpidemicCurve: 3000,
            ClinicalSymptoms: 3000,
            CohortStudy: 3000,
            ReportWriter: 5000
        };

        const nextTabs: Record<string, string> = {
            DataInputVirtual: 'EpidemicCurve',
            EpidemicCurve: 'ClinicalSymptoms',
            ClinicalSymptoms: 'CohortStudy',
            CohortStudy: 'ReportWriter',
            ReportWriter: 'DataInputVirtual'
        };

        const currentTab = activeTab;

        if (timings[currentTab]) {
            timeout = setTimeout(() => {
                const nextTab = nextTabs[currentTab];
                if (nextTab) setActiveTab(nextTab);
            }, timings[currentTab]);
        }

        return () => clearTimeout(timeout);
    }, [isAutoPlay, activeTab]);

    const handleTabClick = (tabId: string) => {
        setIsAutoPlay(false);
        setActiveTab(tabId);
    };

    // Scale Logic


    const tabs = [
        { id: 'DataInputVirtual', label: '데이터 입력', icon: Table },
        { id: 'PatientCharacteristics', label: '환자특성', icon: Users, disabled: true },
        { id: 'EpidemicCurve', label: '유행곡선', icon: Activity },
        { id: 'ClinicalSymptoms', label: '임상증상', icon: BarChart3 },
        { id: 'CaseControl', label: '환자대조군(OR)', icon: GitBranch, disabled: true },
        { id: 'CohortStudy', label: '코호트(RR)', icon: Users },
        { id: 'CaseSeries', label: '사례군조사', icon: ClipboardList, disabled: true },
        { id: 'ReportWriter', label: '보고서 작성', icon: FileEdit },
        { id: 'HomePage', label: '웹페이지 정보', icon: Info, disabled: true },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'DataInputVirtual':
                return <AuthenticGridContent isActive={isActive} />;
            case 'EpidemicCurve':
                return <AuthenticCurveContent />;
            case 'ClinicalSymptoms':
                return <AuthenticSymptomsContent />;
            case 'CohortStudy':
                return <AuthenticCohortContent />;
            case 'ReportWriter':
                return <AuthenticReportContent />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 bg-slate-50">
                        <Database size={48} opacity={0.2} />
                        <span className="text-sm font-medium">데모 화면 준비 중입니다</span>
                    </div>
                );
        }
    };

    return (
        <div style={{ transformOrigin: 'center center' }} className="w-full h-full flex items-center justify-center font-sans select-none">
             {/* Main Container */}
             {/* Main Container */}
             <div style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }}>
                <BrowserFrame url="easy-epi.io" className="w-full h-full" hideAddressBar={false} uiScale={scale}>
                    <div className="flex flex-col h-full bg-slate-50">
                        {/* 1. App Header */}
                        <div className="min-h-[30px] bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20 sticky top-0">
                             <h1 className="m-0 text-xs font-light text-slate-700 tracking-tight" style={{ fontFamily: '"Noto Sans KR", sans-serif' }}>
                                 Easy Epidemiology <span>v2.0</span>
                             </h1>
                        </div>

                        {/* 2. Main Content Area */}
                        <div className="flex-1 relative overflow-hidden bg-slate-50">
                            <div className="w-full h-full" style={{ width: '166.67%', height: '166.67%', transform: 'scale(0.6)', transformOrigin: 'top left' }}>
                                {renderContent()}
                            </div>
                        </div>

                        {/* 3. Bottom Tab Bar */}
                        <div className="h-[32px] bg-white/90 backdrop-blur-md rounded-b-[12px] border-t border-slate-200/80 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.03)] px-2 flex items-center justify-between z-20 shrink-0">
                            <style>{`
                                .no-scrollbar::-webkit-scrollbar { display: none; }
                            `}</style>
                            <div className="flex gap-1 overflow-x-auto no-scrollbar w-full h-full items-center">
                                {/* Sample Tabs */}
                                {tabs.map((tab) => {
                                    const isActive = activeTab === tab.id;
                                    const isDisabled = tab.disabled;
                                    const Icon = tab.icon;
                                    return (
                                        <motion.button
                                            key={tab.id}
                                            onClick={() => !isDisabled && handleTabClick(tab.id)}
                                            layoutId={isActive ? "active-tab" : undefined}
                                            disabled={isDisabled}
                                            className={`
                                                flex items-center justify-center gap-1.5 px-2.5 h-[24px] rounded-md text-[10px] font-medium transition-all duration-200 select-none whitespace-nowrap outline-none
                                                ${isActive 
                                                    ? 'bg-blue-50/80 text-blue-600 shadow-sm ring-1 ring-blue-100 cursor-default' 
                                                    : isDisabled
                                                        ? 'text-gray-300 cursor-not-allowed opacity-50'
                                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 cursor-pointer'
                                                }
                                            `}
                                        >
                                            <Icon size={12} className={isActive ? "text-blue-600" : (isDisabled ? "text-gray-300" : "opacity-70")} />
                                            <span className="tracking-tight">{tab.label}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </BrowserFrame>
             </div>

        </div>
    );
}
