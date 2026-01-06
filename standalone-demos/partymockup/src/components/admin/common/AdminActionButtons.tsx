import React from 'react';
import { Send, CreditCard, RefreshCcw, ArrowRightCircle } from 'lucide-react';

interface ActionBtnProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    color: string;
    isDark?: boolean;
}

const ActionBtn: React.FC<ActionBtnProps> = ({ icon, label, onClick, color, isDark }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl transition-all active:scale-95 ${color} ${isDark ? 'border border-transparent hover:border-slate-500 hover:bg-opacity-30' : 'hover:brightness-95 shadow-sm'}`}
    >
        {/* Removed inner circle for cleaner look & better visibility */}
        <div className="bg-transparent">
            {icon}
        </div>
        <span className="text-xs font-extrabold tracking-tight">{label}</span>
    </button>
);

interface AdminActionButtonsProps {
    onAction: (action: string) => void;
    isDark?: boolean;
    isApplicant?: boolean;
}

const AdminActionButtons: React.FC<AdminActionButtonsProps> = ({ onAction, isDark, isApplicant }) => {
    return (
        <div className="grid grid-cols-4 gap-2">
            <ActionBtn
                icon={<Send size={22} strokeWidth={2} />}
                label="초대장"
                onClick={() => onAction('invite')}
                color={isDark ? "text-blue-300 bg-blue-900/30" : "text-blue-600 bg-blue-100"}
                isDark={isDark}
            />
            <ActionBtn
                icon={<CreditCard size={22} strokeWidth={2} />}
                label="입금"
                onClick={() => onAction('deposit')}
                color={isDark ? "text-green-300 bg-green-900/30" : "text-green-600 bg-green-100"}
                isDark={isDark}
            />
            <ActionBtn
                icon={<RefreshCcw size={22} strokeWidth={2} />}
                label="환불"
                onClick={() => onAction('refund')}
                color={isDark ? "text-red-300 bg-red-900/30" : "text-red-600 bg-red-100"}
                isDark={isDark}
            />
            <ActionBtn
                icon={<ArrowRightCircle size={22} strokeWidth={2} />}
                label="이동"
                onClick={() => onAction('move')}
                color={isDark ? "text-purple-300 bg-purple-900/30" : "text-purple-600 bg-purple-100"}
                isDark={isDark}
            />
        </div>
    );
};

export default AdminActionButtons;
