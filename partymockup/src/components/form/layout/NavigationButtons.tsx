import React from 'react';
import { ArrowRight, Send, Sparkles } from 'lucide-react';

interface NavigationButtonsProps {
    onNext: () => void;
    isLastStep?: boolean;
    canProceed?: boolean;
    theme: {
        colors: {
            primary: string;
            secondary: string;
            button_text?: string;
        };
    };
}

/**
 * 스모어 스타일 네비게이션 버튼
 * 세련된 그라데이션과 글로우 효과
 */
const NavigationButtons: React.FC<NavigationButtonsProps> = ({
    onNext,
    isLastStep,
    canProceed = true,
    theme
}) => {
    return (
        <div className="flex justify-center">
            <button
                onClick={onNext}
                disabled={!canProceed}
                className="group relative overflow-hidden px-16 py-5 font-bold text-lg transition-all duration-500 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                    borderRadius: '24px',
                    color: theme.colors.button_text || '#FFFFFF',
                    minWidth: '220px',
                    boxShadow: `
            0 20px 60px ${theme.colors.primary}40,
            0 8px 24px ${theme.colors.primary}30,
            inset 0 1px 0 rgba(255,255,255,0.2)
          `
                }}
            >
                {/* Animated gradient overlay */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                        background: `linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.primary})`,
                        backgroundSize: '200% 200%',
                        animation: 'gradientShift 3s ease infinite'
                    }}
                />

                {/* Shimmer effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`,
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s infinite'
                    }}
                />

                {/* Glow effect */}
                <div
                    className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl"
                    style={{
                        background: `radial-gradient(circle, ${theme.colors.primary} 0%, transparent 70%)`
                    }}
                />

                {/* Content */}
                <div className="relative flex items-center justify-center gap-3">
                    {isLastStep && (
                        <Sparkles
                            size={20}
                            className="transition-all duration-300 group-hover:rotate-180 group-hover:scale-110"
                            style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}
                        />
                    )}
                    <span className="tracking-wider font-semibold">
                        {isLastStep ? '제출하기' : '다음'}
                    </span>
                    {isLastStep ? (
                        <Send
                            size={20}
                            className="transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                            style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}
                        />
                    ) : (
                        <ArrowRight
                            size={20}
                            className="transition-all duration-300 group-hover:translate-x-2"
                            style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}
                        />
                    )}
                </div>

                {/* Ripple effect on click */}
                <div className="absolute inset-0 rounded-[24px] overflow-hidden">
                    <div className="absolute inset-0 scale-0 group-active:scale-100 opacity-0 group-active:opacity-20 transition-all duration-500 rounded-full bg-white" />
                </div>
            </button>

            <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
        </div>
    );
};

export default NavigationButtons;
