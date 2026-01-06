import React, { ReactNode } from 'react';

interface MobilePreviewFrameProps {
    children: ReactNode;
    className?: string;
}

/**
 * Mobile Device Mockup Frame
 * Shared component for Form Builder & Profile Builder previews
 */
const MobilePreviewFrame: React.FC<MobilePreviewFrameProps> = ({ children, className = '' }) => {
    return (
        <div className={`flex items-center justify-center p-4 bg-slate-100 h-full ${className}`}>
            <div className="h-[85vh] w-auto aspect-[9/18] max-w-full bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border-[8px] border-slate-300 relative">
                <div className="w-full h-full bg-white relative rounded-[1.5rem] overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MobilePreviewFrame;
