import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface PremiumDropdownProps {
    label: string;
    value: string;
    options: Array<{ label: string; value: string }>;
    onSelect: (value: string) => void;
    disabled?: boolean;
    themeStyles: any;
}

const PremiumDropdown: React.FC<PremiumDropdownProps> = ({ label, value, options, onSelect, disabled = false, themeStyles }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find(o => o.value === value)?.label || label;

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
          w-full p-4 flex items-center justify-between rounded-xl border-2 transition-all duration-200
          ${isOpen ? `${themeStyles.border_checked} ring-4 ${themeStyles.ring_soft} ${themeStyles.card_bg} shadow-md` : `${themeStyles.border_base} ${themeStyles.hover_border_light} hover:shadow-md ${themeStyles.card_bg} shadow-sm`}
          ${disabled ? `opacity-50 cursor-not-allowed ${themeStyles.input_bg}` : 'cursor-pointer'}
        `}
                disabled={disabled}
            >
                <span className={`text-lg font-medium ${value ? themeStyles.text_primary : themeStyles.text_tertiary}`}>
                    {selectedLabel}
                </span>
                <ChevronDown
                    className={`${themeStyles.text_tertiary} transition-transform duration-300 ${isOpen ? `rotate-180 ${themeStyles.text_accent}` : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute top-[110%] left-0 w-full max-h-60 overflow-y-auto border rounded-xl shadow-xl z-50 p-2 space-y-1 ${themeStyles.card_bg} ${themeStyles.border_base}`}
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onSelect(option.value);
                                    setIsOpen(false);
                                }}
                                className={`
                  w-full p-3 flex items-center justify-between rounded-lg transition-colors text-left
                  ${value === option.value ? `${themeStyles.highlight_bg} ${themeStyles.text_accent}` : `hover:${themeStyles.bar_bg} ${themeStyles.text_primary}`}
                `}
                            >
                                <span className="font-medium">{option.label}</span>
                                {value === option.value && <Check size={18} className={themeStyles.text_accent} />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PremiumDropdown;
