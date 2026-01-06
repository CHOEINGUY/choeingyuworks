import React from 'react';

interface FullscreenLayoutProps {
    children: React.ReactNode;
    className?: string;
    bgColor?: string;
}

/**
 * 모바일 풀스크린 레이아웃
 * - 브라우저 상단/하단 바에 가려지지 않도록 dvh 사용
 * - 스크롤 방지 및 중앙 정렬
 */
const FullscreenLayout: React.FC<FullscreenLayoutProps> = ({ children, className = '', bgColor = 'bg-white' }) => {
    return (
        <div
            className={`fixed inset-0 w-full h-[100dvh] bg-black flex items-center justify-center ${className}`}
            style={{ touchAction: 'none' }}
        >
            <div className={`w-full h-full max-w-[480px] ${bgColor} relative overflow-hidden flex flex-col shadow-2xl transition-colors duration-500`}>
                {children}
            </div>
        </div>
    );
};

export default FullscreenLayout;
