import React from 'react';
import { Check } from 'lucide-react';

interface InputSubmitButtonProps {
    visible: boolean;
    onClick: (e?: React.MouseEvent) => void;
    themeStyles: any;
}

const InputSubmitButton: React.FC<InputSubmitButtonProps> = ({ visible, onClick, themeStyles }) => {
    if (!visible) return null;

    return (
        <button
            onClick={onClick}
            className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 ${themeStyles.button_bg} ${themeStyles.radius_check_btn} ${themeStyles.button_text || 'text-white'} animate-in fade-in zoom-in duration-200`}
        >
            <Check size={24} />
        </button>
    );
};

export default InputSubmitButton;
