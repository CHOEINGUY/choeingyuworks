"use client";

import React from 'react';
import { Infinity as InfinityIcon } from 'lucide-react';

export const LindyLogo = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-2 ${className}`}>
        <InfinityIcon className="w-8 h-8 text-[#333] stroke-[3px]" />
        <span className="font-bold text-2xl tracking-tighter text-[#333]">Lindy Works</span>
    </div>
);
