import { LayoutDashboard, Users, ChevronLeft, ChevronRight, LogOut, UserPlus, FileText, Settings, UserCog, Crown, Mail, Receipt } from 'lucide-react';

interface AdminSidebarProps {
    isCollapsed: boolean;
    toggleCollapse: () => void;
    currentView: string;
    onViewChange: (view: string) => void;
    onLogout: () => void;
    onManageAdmins: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, toggleCollapse, currentView, onViewChange, onLogout, onManageAdmins }) => {
    // Check for pending applicants
    const hasPending = false; // TODO: Connect to real data if needed

    const menuItems = [
        { type: 'header', label: '파티 (Party)' },
        { id: 'party_dashboard', label: '파티 대시보드', icon: <LayoutDashboard size={20} /> },
        { id: 'party_users', label: '파티 참가자', icon: <Users size={20} /> },
        {
            id: 'party_applicants',
            label: '파티 신청자',
            icon: (
                <div className="relative">
                    <UserPlus size={20} />
                    {hasPending && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
                        </span>
                    )}
                </div>
            )
        },
        { type: 'header', label: '로테이션 (Rotation)' },
        { id: 'rotation_dashboard', label: '로테이션 대시보드', icon: <LayoutDashboard size={20} /> },
        { id: 'rotation_users', label: '로테이션 참가자', icon: <Users size={20} /> },
        {
            id: 'rotation_applicants',
            label: '로테이션 신청자',
            icon: (
                <div className="relative">
                    <UserPlus size={20} />
                    {hasPending && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
                        </span>
                    )}
                </div>
            )
        },
        { type: 'header', label: '1:1 프리미엄 소개팅' },
        { id: 'premium', label: '프리미엄 소개팅', icon: <Crown size={20} /> },
        { type: 'header', label: '설정' },
        { id: 'forms', label: '폼 관리', icon: <FileText size={20} /> },
        { id: 'profile_builder', label: '프로필 관리', icon: <UserCog size={20} /> },
        { id: 'messages', label: '메세지 관리', icon: <Mail size={20} /> },
        { id: 'transactions', label: '입금 확인 (Manual)', icon: <Receipt size={20} /> }
    ];

    return (
        <div
            className={`
                flex flex-col h-screen bg-gray-900 text-white transition-all duration-300 border-r border-gray-800 z-50
                ${isCollapsed ? 'w-16' : 'w-64'}
            `}
        >
            {/* Header / Toggle */}
            <div className={`shrink-0 h-[72px] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-4'} border-b border-gray-800`}>
                {!isCollapsed && <span className="font-bold text-xl text-white tracking-wider whitespace-nowrap overflow-hidden">관리 메뉴</span>}
                <button
                    onClick={toggleCollapse}
                    className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 py-2 flex flex-col gap-1 p-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item: any, idx) => {
                    // Determine color theme based on section
                    const isParty = item.id?.startsWith('party_') || item.label?.includes('Party');
                    const isPremium = item.id === 'premium' || item.label?.includes('프리미엄');

                    let activeClass = 'bg-pink-600 text-white shadow-lg shadow-pink-900/50'; // Default Rotation
                    if (isParty) activeClass = 'bg-violet-600 text-white shadow-lg shadow-violet-900/50';
                    if (isPremium) activeClass = 'bg-amber-500 text-white shadow-lg shadow-amber-900/50';

                    if (item.type === 'header') {
                        if (isCollapsed) {
                            // Collapsed Header: Minimal Text
                            const initial = item.label.includes('Party') ? 'P' :
                                item.label.includes('Rotation') ? 'R' :
                                    item.label.includes('프리미엄') ? '1:1' :
                                        item.label.includes('설정') ? 'Set' : '-';

                            // Minimal text coloring
                            let textColor = 'text-gray-600';
                            if (initial === 'P') textColor = 'text-violet-500';
                            if (initial === 'R') textColor = 'text-pink-500';
                            if (initial === '1:1') textColor = 'text-amber-500';

                            return (
                                <div key={idx} className="flex justify-center mt-3 mb-1">
                                    <span className={`text-[10px] font-bold ${textColor}`}>
                                        {initial}
                                    </span>
                                </div>
                            );
                        }
                        return (
                            <div key={idx} className={`px-4 mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap overflow-hidden ${idx === 0 ? 'mt-1' : 'mt-4'}`}>
                                {item.label}
                            </div>
                        );
                    }
                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={`
                                flex items-center ${isCollapsed ? 'gap-0' : 'gap-3'} px-3 py-2 rounded-xl transition-all overflow-hidden
                                ${currentView === item.id
                                    ? activeClass
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                                ${isCollapsed ? 'justify-center' : ''}
                            `}
                            title={isCollapsed ? item.label : ''}
                        >
                            <div className="shrink-0">{item.icon}</div>
                            <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                                <span className="font-medium whitespace-nowrap min-w-[120px] block text-left">
                                    {item.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={onManageAdmins}
                    className={`flex items-center w-full p-3 rounded-lg mb-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-all group overflow-hidden ${isCollapsed ? 'justify-center gap-0' : 'space-x-3'}`}
                    title="관리자 설정"
                >
                    <Settings className="w-5 h-5 min-w-[20px] shrink-0" />
                    <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        <span className="font-medium truncate min-w-[100px] block text-left">관리자 설정</span>
                    </div>
                </button>

                <button
                    onClick={onLogout}
                    className={`
                        w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all overflow-hidden
                        ${isCollapsed ? 'justify-center gap-0' : 'gap-3'}
                    `}
                    title={isCollapsed ? "로그아웃" : ""}
                >
                    <LogOut size={20} className="shrink-0" />
                    <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        <span className="font-medium min-w-[100px] block text-left">로그아웃</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
