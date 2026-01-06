import React from 'react';
import { Check } from 'lucide-react';

export const PanelSection = ({ title, icon: Icon, children, className = '' }: { title: string; icon?: any; children: React.ReactNode; className?: string }) => (
    <div className={`space-y-3 ${className}`}>
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            {Icon && <Icon size={14} />}
            {title}
        </label>
        {children}
    </div>
);

export const SubLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="block text-xs text-slate-400 font-medium mb-2">{children}</span>
);

export const StyleCard = ({
    active,
    onClick,
    children,
    className = ''
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    className?: string
}) => (
    <button
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center transition-all duration-200 border rounded-xl overflow-hidden
            ${active
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-600 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-500 hover:text-slate-700'
            } ${className}`}
    >
        {children}
        {active && (
            <div className="absolute top-2 right-2 text-indigo-600">
                <Check size={14} strokeWidth={3} />
            </div>
        )}
    </button>
);

export const ListOption = ({
    active,
    onClick,
    label,
    subLabel,
    icon: Icon
}: {
    active: boolean;
    onClick: () => void;
    label: string;
    subLabel?: string;
    icon?: any
}) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left group
            ${active
                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-600'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
            }`}
    >
        <div className="flex items-center gap-3">
            {Icon && <Icon size={18} className={active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />}
            <div>
                <span className={`block text-sm font-medium ${active ? 'text-indigo-900' : 'text-slate-700'}`}>{label}</span>
                {subLabel && <span className="text-xs text-slate-400 mt-0.5 block">{subLabel}</span>}
            </div>
        </div>
        {active && <Check size={16} className="text-indigo-600" />}
    </button>
);

export const CompactToggle = ({
    active,
    onClick,
    label,
    className = ''
}: {
    active: boolean;
    onClick: () => void;
    label: string;
    className?: string
}) => (
    <button
        onClick={onClick}
        className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-all
         ${active
                ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-black/5'
                : 'text-slate-500 hover:bg-black/5 hover:text-slate-700'
            } ${className}`}
    >
        {label}
    </button>
);
