import React from 'react';

/**
 * 스모어 스타일 진행률 바
 * 로고 아래에 위치, 점 없이 가로바만
 */
const DEFAULT_WIDTH_CLASS = 'mx-auto w-[60vw] max-w-3xl';

interface ProgressBarProps {
    current: number;
    total: number;
    theme?: {
        colors?: {
            inputBorder?: string;
            primary?: string;
        }
    };
    className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, theme, className = '' }) => {
    const percentage = total > 0 ? ((current + 1) / total) * 100 : 0;

    return (
        <div className={`${DEFAULT_WIDTH_CLASS} ${className}`}>
            <div
                className="h-3 w-full rounded-full bg-slate-200 overflow-hidden"
                style={{
                    background: theme?.colors?.inputBorder
                        ? `${theme.colors.inputBorder}40`
                        : undefined
                }}
            >
                <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                        width: `${percentage}%`,
                        background: theme?.colors?.primary || '#2563EB'
                    }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
