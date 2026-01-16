import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { BrowserFrame } from '@/features/portfolio/components/BrowserFrame';
import { AuthenticGridContent } from './components/AuthenticGridContent';
import { AuthenticCurveContent } from './components/AuthenticCurveContent';
import { AuthenticSymptomsContent } from './components/AuthenticSymptomsContent';
import { AuthenticReportContent } from './components/AuthenticReportContent';
import { AuthenticCohortContent } from './components/AuthenticCohortContent';
import { useMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';

// --- Constants & Configuration ---

const CONSTANTS = {
    TIMINGS: {
        DataInputVirtual: 5000,
        EpidemicCurve: 3000,
        ClinicalSymptoms: 3000,
        CohortStudy: 3000,
        ReportWriter: 5000,
    },
    SCALE: {
        MOBILE_UI: 0.6,
        DESKTOP_UI: 0.7,
        MOBILE_CONTAINER: 0.6,
        DESKTOP_CONTAINER: 0.9,
    },
    DIMENSIONS: {
        MOBILE_WIDTH: '166.67%',
        MOBILE_HEIGHT: '166.67%',
        DESKTOP_WIDTH: '111.11%',
        DESKTOP_HEIGHT: '111.11%',
    }
} as const;

interface TabConfig {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    component?: React.ComponentType<{ isActive?: boolean }>; // Some components take props
    disabled?: boolean;
}

const TABS: TabConfig[] = [
    { id: 'DataInputVirtual', label: '데이터 입력', icon: Table, component: AuthenticGridContent },
    { id: 'PatientCharacteristics', label: '환자특성', icon: Users, disabled: true },
    { id: 'EpidemicCurve', label: '유행곡선', icon: Activity, component: AuthenticCurveContent },
    { id: 'ClinicalSymptoms', label: '임상증상', icon: BarChart3, component: AuthenticSymptomsContent },
    { id: 'CaseControl', label: '환자대조군(OR)', icon: GitBranch, disabled: true },
    { id: 'CohortStudy', label: '코호트(RR)', icon: Users, component: AuthenticCohortContent },
    { id: 'CaseSeries', label: '사례군조사', icon: ClipboardList, disabled: true },
    { id: 'ReportWriter', label: '보고서 작성', icon: FileEdit, component: AuthenticReportContent },
    { id: 'HomePage', label: '웹페이지 정보', icon: Info, disabled: true },
];

// TAB_IDS removed as unused
// TAB_IDS removed as unused

// Manual override for specific flow if needed, or use the auto-generated map above.
// The original code had a specific sequence:
const SEQUENCED_FLOW: Record<string, string> = {
    DataInputVirtual: 'EpidemicCurve',
    EpidemicCurve: 'ClinicalSymptoms',
    ClinicalSymptoms: 'CohortStudy',
    CohortStudy: 'ReportWriter',
    ReportWriter: 'DataInputVirtual'
};

interface Props {
    scale?: number;
    isLandingPage?: boolean;
    isActive?: boolean;
    isEmbedded?: boolean;
    // isMobile prop deprecated in favor of internal hook
    // keeping it optional/unused to match strict typing if passed from parent
    isMobile?: boolean; 
}

export function EpidemiologyDemo({ 
    scale = 1, 
    // isLandingPage = false, // Unused in original render logic? Keeping it if needed for future
    isActive = true, 
    // isEmbedded = false, // Unused in logic but kept for interface 
}: Props) {
    const isMobile = useMobile();
    const [activeTab, setActiveTab] = useState('DataInputVirtual');
    const [isAutoPlay, setIsAutoPlay] = useState(false);
    
    // Auto-Play Sequence
    useEffect(() => {
        setIsAutoPlay(isActive);
    }, [isActive]);

    useEffect(() => {
        if (!isAutoPlay) return;

        const currentDuration = CONSTANTS.TIMINGS[activeTab as keyof typeof CONSTANTS.TIMINGS];
        if (!currentDuration) return;

        const timeout = setTimeout(() => {
            const nextTab = SEQUENCED_FLOW[activeTab];
            if (nextTab) setActiveTab(nextTab);
        }, currentDuration);

        return () => clearTimeout(timeout);
    }, [isAutoPlay, activeTab]);

    const handleTabClick = (tabId: string) => {
        setIsAutoPlay(false);
        setActiveTab(tabId);
    };

    const activeTabConfig = TABS.find(t => t.id === activeTab);
    const ActiveComponent = activeTabConfig?.component;

    return (
        <div 
            style={{ transformOrigin: 'center center' }} 
            className="w-full h-full flex items-center justify-center font-sans select-none"
        >
             {/* Main Container */}
             <div style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }}>
                <BrowserFrame 
                    url="https://easy-epi.xyz/" 
                    className="w-full h-full" 
                    hideAddressBar={false} 
                    uiScale={isMobile ? scale * CONSTANTS.SCALE.MOBILE_UI : scale * CONSTANTS.SCALE.DESKTOP_UI}
                >
                    <div className="flex flex-col h-full bg-slate-50">
                        {/* 1. App Header */}
                        <div className="min-h-[30px] bg-white/95 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20 sticky top-0">
                             <h1 className="m-0 text-xs font-light text-slate-700 tracking-tight" style={{ fontFamily: '"Noto Sans KR", sans-serif' }}>
                                 Easy Epidemiology <span>v2.0</span>
                             </h1>
                        </div>

                        {/* 2. Main Content Area */}
                        <div className="flex-1 relative overflow-hidden bg-slate-50">
                            <div className="w-full h-full" style={{ 
                                width: isMobile ? CONSTANTS.DIMENSIONS.MOBILE_WIDTH : CONSTANTS.DIMENSIONS.DESKTOP_WIDTH, 
                                height: isMobile ? CONSTANTS.DIMENSIONS.MOBILE_HEIGHT : CONSTANTS.DIMENSIONS.DESKTOP_HEIGHT, 
                                transform: `scale(${isMobile ? CONSTANTS.SCALE.MOBILE_CONTAINER : CONSTANTS.SCALE.DESKTOP_CONTAINER})`, 
                                transformOrigin: 'top left' 
                            }}>
                                {ActiveComponent ? (
                                    <ActiveComponent isActive={isActive} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 bg-slate-50">
                                        <Database size={48} opacity={0.2} />
                                        <span className="text-sm font-medium">데모 화면 준비 중입니다</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Bottom Tab Bar */}
                        <div className="h-[32px] bg-white/90 backdrop-blur-md rounded-b-[12px] border-t border-slate-200/80 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.03)] px-2 flex items-center justify-between z-20 shrink-0">
                            <style>{`
                                .no-scrollbar::-webkit-scrollbar { display: none; }
                            `}</style>
                            <div className="flex gap-1 overflow-x-auto no-scrollbar w-full h-full items-center">
                                {TABS.map((tab) => {
                                    const isTabActive = activeTab === tab.id;
                                    const Icon = tab.icon;
                                    return (
                                        <motion.button
                                            key={tab.id}
                                            onClick={() => !tab.disabled && handleTabClick(tab.id)}
                                            layoutId={isTabActive ? "active-tab" : undefined}
                                            disabled={tab.disabled}
                                            className={cn(
                                                "flex items-center justify-center gap-1.5 px-2.5 h-[24px] rounded-md text-[10px] font-medium transition-all duration-200 select-none whitespace-nowrap outline-none",
                                                isTabActive 
                                                    ? "bg-blue-50/80 text-blue-600 shadow-sm ring-1 ring-blue-100 cursor-default" 
                                                    : tab.disabled
                                                        ? "text-gray-300 cursor-not-allowed opacity-50"
                                                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 cursor-pointer"
                                            )}
                                        >
                                            <Icon size={12} className={cn(isTabActive ? "text-blue-600" : (tab.disabled ? "text-gray-300" : "opacity-70"))} />
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
