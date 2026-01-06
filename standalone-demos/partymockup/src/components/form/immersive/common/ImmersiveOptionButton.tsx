import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ImmersiveOptionButtonProps {
    label: string;
    value: string;
    index: number;
    isSelected: boolean;
    themeStyles: any;
    onClick: () => void;
    alphabet?: string;
    // Animation props
    animate?: any;
    transition?: any;
    // Style variations
    distance?: number; // For scroll wheel effect
    disabled?: boolean;
}

const ImmersiveOptionButton: React.FC<ImmersiveOptionButtonProps> = ({
    label,
    isSelected,
    themeStyles,
    onClick,
    alphabet,
    animate,
    transition,
    disabled = false,
}) => {
    // Base Classes based on selection

    // Base Classes based on selection and scroll distance
    const baseClasses = `
        w-full border-2 transition-all duration-200 flex items-center gap-4 group
        ${themeStyles.radius_option}
        ${themeStyles.text_align_option}
        ${themeStyles.text_size_option}
    `;

    // Dynamic classes based on state
    let stateClasses = '';

    if (disabled) {
        stateClasses = `bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60 grayscale`;
    } else if (isSelected) {
        stateClasses = `${themeStyles.border_checked} ${themeStyles.soft_text} shadow-md ring-1 ${themeStyles.ring_checked} ${themeStyles.soft_bg}`;
    } else {
        stateClasses = `${themeStyles.card_bg} ${themeStyles.border_base} ${themeStyles.text_secondary} shadow-sm hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md hover:bg-opacity-80`;
    }

    // Scroll Wheel Blur/Fade logic (if distance is provided > 0)
    // Note: If distance logic is complex, we might want to keep it in parent or pass full className.
    // However, keeping standard styles here is better for "Common Button" goal.
    // Let's assume standard "List" usage mostly, or simple scroll.

    // Badge Render Logic
    const showBadge = !themeStyles.text_align_option?.includes('text-center') && alphabet;

    return (
        <motion.button
            initial={!animate ? { opacity: 0, y: 10 } : undefined}
            animate={animate || { opacity: 1, y: 0 }}
            transition={transition}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`${baseClasses} ${stateClasses} py-3.5`}
        >
            {showBadge && (
                <span className={`
                    flex items-center justify-center w-8 h-8 rounded-lg text-base font-bold transition-colors flex-none
                    ${disabled ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : (isSelected ? `${themeStyles.soft_badge_bg} ${themeStyles.soft_badge_text}` : `${themeStyles.highlight_bg} ${themeStyles.text_accent}`)}
                `}>
                    {alphabet}
                </span>
            )}

            <span className={`font-medium flex-1 whitespace-pre-wrap break-keep min-w-0 leading-relaxed ${disabled ? 'text-gray-400 dark:text-gray-500' : (isSelected ? themeStyles.soft_text : themeStyles.text_primary)}`}>
                {label}
            </span>

            {isSelected && !disabled && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`${themeStyles.text_accent} dark:${themeStyles.text_accent} flex-none`}
                >
                    <Check size={20} strokeWidth={3} />
                </motion.div>
            )}
        </motion.button>
    );
};

export default ImmersiveOptionButton;
