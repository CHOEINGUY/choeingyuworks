import React from 'react';
import { LayoutDashboard, Users, UserPlus, Crown, LogOut, X } from 'lucide-react';

interface MobileAdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activePage: string;
    onMenuClick: (pageId: string) => void;
    onLogout: () => void;
    isDark?: boolean;
}

const MobileAdminSidebar: React.FC<MobileAdminSidebarProps> = ({ isOpen, onClose, activePage, onMenuClick, onLogout, isDark }) => {

    const menuItems = [
        { type: 'header', label: '파티 (Party)' },
        { id: 'party_dashboard', label: '파티 대시보드', icon: LayoutDashboard },
        { id: 'party_participants', label: '파티 참가자', icon: Users },
        { id: 'party_applicants', label: '파티 신청자', icon: UserPlus },

        { type: 'header', label: '로테이션 (Rotation)' },
        { id: 'rotation_dashboard', label: '로테이션 대시보드', icon: LayoutDashboard },
        { id: 'rotation_participants', label: '로테이션 참가자', icon: Users },
        { id: 'rotation_applicants', label: '로테이션 신청자', icon: UserPlus },

        { type: 'header', label: '1:1 프리미엄' },
        { id: 'premium_manager', label: '프리미엄 소개팅', icon: Crown },
    ];

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Drawer */}
            <div className={`
                fixed top-0 left-0 h-full w-[280px] z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                bg-gray-900 text-white flex flex-col
            `}>
                {/* Header */}
                <div className="shrink-0 h-[72px] flex items-center justify-between px-4 border-b border-gray-800">
                    <span className="font-bold text-xl text-white tracking-wider">
                        관리 메뉴
                    </span>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Menu List */}
                <nav className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {menuItems.map((item, idx) => {
                        // Determine color theme based on section
                        const isParty = item.id?.startsWith('party_') || item.label?.includes('Party');
                        const isRotation = item.id?.startsWith('rotation_') || item.label?.includes('Rotation');
                        const isPremium = item.id === 'premium_manager' || item.label?.includes('프리미엄');

                        let activeClass = 'bg-pink-600 text-white shadow-lg shadow-pink-900/50'; // Default Rotation
                        if (isParty) activeClass = 'bg-violet-600 text-white shadow-lg shadow-violet-900/50';
                        if (isPremium) activeClass = 'bg-amber-500 text-white shadow-lg shadow-amber-900/50';

                        if (item.type === 'header') {
                            return (
                                <div key={idx} className={`px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap overflow-hidden ${idx === 0 ? 'mt-2' : 'mt-8 border-t border-gray-800 pt-4'}`}>
                                    {item.label}
                                </div>
                            );
                        }

                        const Icon = item.icon as React.ElementType;
                        const isActive = activePage === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onMenuClick(item.id!);
                                    onClose();
                                }}
                                className={`
                                    w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all overflow-hidden
                                    ${isActive
                                        ? activeClass
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                                `}
                            >
                                <Icon size={20} className="shrink-0" />
                                <span className="font-medium whitespace-nowrap block text-left">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-800 shrink-0">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all"
                    >
                        <LogOut size={20} className="shrink-0" />
                        <span className="font-medium">로그아웃</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default MobileAdminSidebar;
