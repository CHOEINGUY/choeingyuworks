"use client";

import { CheckCircle2, UserPlus } from 'lucide-react';

export type ToastType = 'success' | 'new-applicant';

interface MockToastProps {
    message: string;
    visible: boolean;
    type?: ToastType;
}

export function MockToast({ message, visible, type = 'success' }: MockToastProps) {
    const isNewApplicant = type === 'new-applicant';

    return (
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <div className="bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isNewApplicant ? 'bg-pink-500 text-white' : 'bg-green-500 text-slate-900'}`}>
                    {isNewApplicant ? <UserPlus size={10} strokeWidth={3} /> : <CheckCircle2 size={10} strokeWidth={3} />}
                </div>
                {message}
            </div>
        </div>
    );
}
