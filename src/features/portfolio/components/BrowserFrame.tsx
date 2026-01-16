"use client";

import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';

interface BrowserFrameProps {
    children: React.ReactNode;
    width?: number;
    height?: number;
    url?: string;
    isMobile?: boolean; // Kept for interface compatibility, but styling is unified
    hideAddressBar?: boolean;
    className?: string;
    uiScale?: number;
}

export function BrowserFrame({ 
    children, 
    width, 
    height, 
    url = "lindy.party", 
    isMobile = false,
    hideAddressBar = false,
    className = "",
    uiScale = 1
}: BrowserFrameProps) {
    
    // Explicit sizing if provided
    // If width/height are provided, they represent the LOGICAL size (e.g. 1000px).
    // But since we are doing internal scaling, the container itself needs to be scaled down if we want it to occupy less space?
    // User Requirement: "Scale is unified (1.0), but design looks same".
    // This means if I ask for 1000px logical frame with 0.5 scale, the RENDERED div should be 500px wide.
    const scaledWidth = width ? width * uiScale : undefined;
    const scaledHeight = height ? height * uiScale : undefined;

    const style: React.CSSProperties = {
        width: scaledWidth ? `${scaledWidth}px` : '100%',
        height: scaledHeight ? `${scaledHeight}px` : '100%',
        borderRadius: isMobile ? `${32 * uiScale}px` : `${12 * uiScale}px`,
    };

    const addressBarHeight = 40 * uiScale;
    const inputHeight = 28 * uiScale; // h-7 is 28px
    const iconSize = 10 * uiScale;
    const arrowSize = 10 * uiScale;
    const fontSize = Math.max(10 * uiScale, 8); // Prevent too small text
    const paddingX = 16 * uiScale; // px-4
    const inputPaddingX = 12 * uiScale; // px-3

    return (
        <div 
            className={`bg-white shadow-2xl border border-gray-300 overflow-hidden flex flex-col relative ring-1 ring-slate-900/5 ${className}`}
            style={style}
        >
            {/* Browser Address Bar - Scaled */}
            {!hideAddressBar && (
                <div 
                    className="bg-[#f9f9fb] flex items-center border-b border-gray-200 shrink-0 relative z-30"
                    style={{ height: addressBarHeight, paddingLeft: paddingX, paddingRight: paddingX, gap: 8 * uiScale }}
                >
                    <div 
                        className="flex-1 bg-white border border-gray-200 rounded-full flex items-center text-gray-600 shadow-sm relative"
                        style={{ height: inputHeight, paddingLeft: inputPaddingX, paddingRight: inputPaddingX, gap: 8 * uiScale }}
                    >
                        <Lock size={iconSize} className="text-green-500 shrink-0" />
                        <span 
                            className="flex-1 truncate text-center font-sans text-gray-400"
                            style={{ fontSize: fontSize }}
                        >
                            {url}
                        </span>
                        <ArrowRight size={arrowSize} className="text-gray-300 shrink-0" />
                    </div>
                </div>
            )}

            {/* Content Area - Scaled Internal */}
            <div className={`flex-1 relative overflow-hidden ${isMobile ? 'bg-white' : 'bg-slate-50'}`}>
                <div 
                    style={{
                        width: `${100 / uiScale}%`,
                        height: `${100 / uiScale}%`,
                        transform: `scale(${uiScale})`,
                        transformOrigin: 'top left',
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
