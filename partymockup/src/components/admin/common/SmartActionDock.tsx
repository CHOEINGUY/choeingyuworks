import React from 'react';
import {
    MessageCircle,
    CheckCircle2,
    XCircle,
    ArrowRightLeft,
    Send,
    Settings,
    UserPlus,
    Trash2,
    Search
} from 'lucide-react';

import ColumnSelector from './ColumnSelector';

interface ActionButtonProps {
    icon: React.ElementType;
    label: string;
    colorClass: string;
    onClick: () => void;
    disabled?: boolean;
    isHorizontal?: boolean;
    hideLabel?: boolean;
}

interface SmartActionDockProps {
    selectedCount: number;
    approvedCount?: number;
    onAction: (actionType: string) => void;
    type?: 'guest' | 'applicant';
    isDark?: boolean;
    columnSettings?: any;
    hiddenActions?: string[];
    isVisible?: boolean;
    layout?: 'sidebar' | 'bottom';
    activeActions?: string[]; // [NEW]
}

const SmartActionDock: React.FC<SmartActionDockProps> = ({
    selectedCount,
    onAction,
    type = 'guest',
    isDark,
    columnSettings,
    hiddenActions = [],
    isVisible = true,
    layout = 'sidebar',
    activeActions = [] // [NEW]
}) => {
    const isSidebar = layout === 'sidebar';
    const subTextColor = isDark ? 'text-gray-500' : 'text-gray-400';
    const textColor = isDark ? 'text-gray-200' : 'text-gray-700';

    // Container Styles
    const baseDockClass = `flex z-30 transition-all duration-300 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'}`;
    const layoutClass = isSidebar
        ? `w-[70px] flex-col py-6 h-full border-l absolute right-0 top-0 bottom-0 items-center ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`
        : `w-full flex-row px-4 py-3 border-t fixed bottom-0 left-0 right-0 justify-between items-center shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`;

    // Divider
    const dividerClass = isSidebar
        ? `w-10 h-px my-2 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`
        : `w-px h-8 mx-3 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`;

    // Action Grid
    const actionGridClass = isSidebar
        ? "flex-1 flex flex-col w-full gap-2 px-1 items-center overflow-y-auto no-scrollbar"
        : "flex-1 flex flex-row gap-3 items-center justify-end overflow-x-auto no-scrollbar px-2";

    return (
        <div className={`${baseDockClass} ${layoutClass}`}>

            {/* Group 1: Add & Status */}
            <div className={`flex ${isSidebar ? 'flex-col gap-6 items-center' : 'flex-row items-center gap-3 shrink-0'}`}>
                {/* Search Toggle (Mobile Only) */}
                {!isSidebar && (
                    <ActionButton
                        icon={Search}
                        label="검색"
                        colorClass={activeActions.includes('search_toggle') ? 'bg-blue-500 text-white' : 'text-blue-500'}
                        onClick={() => onAction('search_toggle')}
                        isHorizontal={true}
                        hideLabel={true}
                    />
                )}

                {/* Add Person */}
                <ActionButton
                    icon={UserPlus}
                    label="추가"
                    colorClass="text-pink-500"
                    onClick={() => onAction('create_manual')}
                    isHorizontal={!isSidebar}
                    hideLabel={!isSidebar}
                />

                {/* Selection Status */}
                {selectedCount > 0 && (
                    <div className={`flex items-center gap-1 animate-in zoom-in duration-300 ${isSidebar ? 'flex-col' : 'flex-row'}`}>
                        <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-pink-500/30">
                            {selectedCount}
                        </div>
                        {isSidebar && (
                            <span className="text-[10px] font-bold text-pink-500">
                                선택됨
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className={dividerClass} />

            {/* Action Grid */}
            <div className={actionGridClass}>
                {/* --- CONTEXT ACTIONS --- */}
                {selectedCount > 0 && (
                    <>
                        <div className={`flex ${isSidebar ? 'flex-col w-full gap-2' : 'flex-row gap-3'} animate-in slide-in-from-right-4 fade-in duration-300`}>
                            <ActionButton
                                icon={MessageCircle}
                                label="메시지"
                                colorClass="text-indigo-500"
                                onClick={() => onAction('message')}
                                isHorizontal={!isSidebar}
                                hideLabel={!isSidebar}
                            />

                            {type === 'guest' && (
                                <>
                                    {!hiddenActions.includes('check_in') && (
                                        <ActionButton
                                            icon={CheckCircle2}
                                            label="입장"
                                            colorClass="text-purple-500"
                                            onClick={() => onAction('check_in')}
                                            isHorizontal={!isSidebar}
                                            hideLabel={!isSidebar}
                                        />
                                    )}
                                    {!hiddenActions.includes('move') && (
                                        <ActionButton
                                            icon={ArrowRightLeft}
                                            label="이동"
                                            colorClass="text-blue-500"
                                            onClick={() => onAction('move')}
                                            isHorizontal={!isSidebar}
                                            hideLabel={!isSidebar}
                                        />
                                    )}
                                </>
                            )}

                            {type === 'applicant' && (
                                <>
                                    <ActionButton
                                        icon={CheckCircle2}
                                        label="승인"
                                        colorClass="text-green-500"
                                        onClick={() => onAction('approve')}
                                        isHorizontal={!isSidebar}
                                        hideLabel={!isSidebar}
                                    />
                                    <ActionButton
                                        icon={XCircle}
                                        label="거절"
                                        colorClass="text-red-500"
                                        onClick={() => onAction('reject')}
                                        isHorizontal={!isSidebar}
                                        hideLabel={!isSidebar}
                                    />
                                    <ActionButton
                                        icon={Trash2}
                                        label="삭제"
                                        colorClass="text-gray-400"
                                        onClick={() => onAction('delete')}
                                        isHorizontal={!isSidebar}
                                        hideLabel={!isSidebar}
                                    />
                                </>
                            )}
                            {type === 'guest' && (
                                <ActionButton
                                    icon={Trash2}
                                    label="삭제"
                                    colorClass="text-gray-400"
                                    onClick={() => onAction('delete')}
                                    isHorizontal={!isSidebar}
                                    hideLabel={!isSidebar}
                                />
                            )}
                        </div>
                        <div className={dividerClass} />
                    </>
                )}

                {/* --- GLOBAL ACTIONS --- */}
                <div className={`flex ${isSidebar ? 'flex-col gap-2 w-full' : 'flex-row gap-3'} transition-all duration-300 ${selectedCount > 0 ? 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}>
                    <ActionButton
                        icon={Send}
                        label="전체발송"
                        colorClass={textColor}
                        onClick={() => onAction('send_invites')}
                        isHorizontal={!isSidebar}
                        hideLabel={!isSidebar}
                    />
                </div>
            </div>

            {/* Bottom/End Actions (Settings) */}
            <div className={`flex ${isSidebar ? 'mt-auto flex-col gap-2' : 'shrink-0 ml-2'}`}>
                {columnSettings && (
                    <ColumnSelector
                        {...columnSettings}
                        isDark={isDark}
                        placement={isSidebar ? "left-bottom" : "top-right"}
                        trigger={
                            <button className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 ${subTextColor}`}>
                                <Settings size={18} />
                            </button>
                        }
                    />
                )}
            </div>
        </div >
    );
};

// Helper: Determine hover text color
const getHoverColor = (baseColorClass: string) => {
    if (!baseColorClass) return '';
    if (baseColorClass.includes('indigo')) return 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400';
    if (baseColorClass.includes('blue')) return 'group-hover:text-blue-600 dark:group-hover:text-blue-400';
    if (baseColorClass.includes('green')) return 'group-hover:text-green-600 dark:group-hover:text-green-400';
    if (baseColorClass.includes('red')) return 'group-hover:text-red-600 dark:group-hover:text-red-400';
    // Default Neutral
    return 'group-hover:text-gray-900 dark:group-hover:text-white';
};

// Component: Action Button
const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, colorClass, onClick, disabled, isHorizontal, hideLabel }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`group flex items-center justify-center gap-1.5 transition-all relative
            ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer'}
            ${colorClass} ${!disabled && getHoverColor(colorClass)}
            ${isHorizontal
                ? (hideLabel ? 'w-10 h-10 rounded-xl' : 'w-auto px-3 py-2 rounded-xl flex-row')
                : 'w-full aspect-square rounded-xl flex-col'}
        `}
        title={label}
    >
        <Icon size={!isHorizontal ? 20 : (hideLabel ? 22 : 18)} strokeWidth={2} className="shrink-0" />
        {!hideLabel && (
            <span className="text-[10px] font-medium whitespace-nowrap">
                {label}
            </span>
        )}
    </button>
);

export default SmartActionDock;
