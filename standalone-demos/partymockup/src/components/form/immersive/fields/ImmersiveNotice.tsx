import React from 'react';
import { Info } from 'lucide-react';
// import { motion } from 'framer-motion';

interface ImmersiveNoticeProps {
    field: {
        title?: string;
        description?: string;
    };
    onNext?: () => void;
    themeStyles: any;
}

const ImmersiveNotice: React.FC<ImmersiveNoticeProps> = ({ field, themeStyles }) => {
    return (
        <div className="w-full flex flex-col items-center">
            {/* Icon Decoration */}
            {/* Icon Decoration */}
            <div
                className={`w-20 h-20 ${themeStyles.highlight_bg} rounded-full flex items-center justify-center ${themeStyles.text_accent} mb-8`}
            >
                <Info size={40} />
            </div>

            {/* Content: Title & Description */}
            <div className="text-center space-y-4 mb-10">
                <h2 className={`text-3xl md:text-4xl font-black leading-tight break-keep break-words ${themeStyles.text_primary}`}>
                    {field.title || '안내사항'}
                </h2>
                {field.description && (
                    <p className={`text-lg font-medium leading-relaxed whitespace-pre-wrap break-keep break-words max-w-2xl mx-auto ${themeStyles.text_secondary}`}>
                        {field.description}
                    </p>
                )}
            </div>

            {/* Action Button Removed - Moved to ApplyFormEngine for fixed positioning */}
        </div>
    );
};

export default ImmersiveNotice;
