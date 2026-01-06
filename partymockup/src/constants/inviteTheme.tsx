import React, { ReactNode } from 'react';
import { Sparkles, Heart } from 'lucide-react';

export interface InviteTheme {
    bg: string;
    highlight: string;
    icon: string;
    subText: string;
    btn: string;
    qrShadow: string;
    accentIcon: ReactNode;
}

export const INVITE_THEME: Record<string, InviteTheme> = {
    M: {
        // Male Theme (Navy/Cool)
        bg: 'bg-gradient-to-b from-slate-50 via-slate-100 to-white',
        highlight: 'text-indigo-600',
        icon: 'text-indigo-400',
        subText: 'text-slate-500',
        btn: 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200',
        qrShadow: 'shadow-xl shadow-indigo-600/25',
        accentIcon: <Sparkles className="w-12 h-12 text-indigo-300 mx-auto animate-pulse" />
    },
    F: {
        // Female Theme (Beige/Warm - Reduced Pink)
        bg: 'bg-[#FDFBF7]',
        highlight: 'text-stone-600',
        icon: 'text-stone-400',
        subText: 'text-stone-500',
        btn: 'bg-stone-800 hover:bg-stone-700 text-white shadow-stone-200',
        qrShadow: 'shadow-xl shadow-stone-600/25',
        accentIcon: <Heart className="w-12 h-12 text-stone-300 mx-auto animate-pulse" fill="#e7e5e4" />
    }
};
