import React from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

interface DemoNavButtonsProps {
    onNext?: () => void;
    label?: string;
    isLastStep?: boolean;
    isClicking?: boolean;
}

export const DemoNavButtons: React.FC<DemoNavButtonsProps> = ({
    onNext,
    label = "다음",
    isLastStep = false,
    isClicking = false
}) => {
    return (
        <div className="flex justify-center mt-auto pb-6">
            <button
                // In demo, onClick might not be bound if it's auto-playing, but we keep the prop.
                onClick={onNext}
                className="group relative overflow-hidden h-[50px] w-[160px] font-bold text-base transition-all duration-200 rounded-2xl shadow-lg shadow-blue-500/30 text-white flex items-center justify-center gap-2"
                style={{
                    background: 'linear-gradient(135deg, #3B82F6, #2563EB)', // Blue gradient
                    transform: isClicking ? 'scale(0.95)' : 'scale(1)',
                }}
            >
                {/* Glow effects simulated with simple shadows for performance in demo */}

                {isLastStep && (
                    <Sparkles size={16} className="text-blue-100" />
                )}

                <span className="tracking-wide">{label}</span>

                {isLastStep ? (
                    <Check size={18} className="text-blue-100" />
                ) : (
                    <ArrowRight size={18} className="text-blue-100" />
                )}
            </button>
        </div>
    );
};
