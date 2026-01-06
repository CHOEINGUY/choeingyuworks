import React, { useState, KeyboardEvent } from 'react';
import { ThemeStyles } from '../../../../constants/formThemes';
import { X, Plus } from 'lucide-react';

interface ProfileTagsFieldProps {
    field: any;
    themeStyles: ThemeStyles;
}

const ProfileTagsField: React.FC<ProfileTagsFieldProps> = ({ field, themeStyles }) => {
    const [inputValue, setInputValue] = useState('');

    // Ensure value is an array
    const tags: string[] = Array.isArray(field.value) ? field.value : [];
    const isReadOnly = field.readOnly;

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (isReadOnly) return;
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    const addTag = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !tags.includes(trimmed)) {
            const newTags = [...tags, trimmed];
            field.onChange?.(newTags);
            setInputValue('');
        }
    };

    const removeTag = (index: number) => {
        const newTags = tags.filter((_, i) => i !== index);
        field.onChange?.(newTags);
    };

    const radiusClass = themeStyles.radius_input || "rounded-xl";
    const baseInputClass = `w-full ${themeStyles.input_bg} border ${themeStyles.border_base} ${radiusClass} transition-all font-medium text-[15px]`;
    const focusClass = `focus-within:${themeStyles.card_bg} focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-400`;

    return (
        <div className={`${baseInputClass} ${focusClass} px-3 py-2 flex flex-wrap gap-2 items-center min-h-[52px]`}>
            {tags.map((tag, index) => (
                <span
                    key={index}
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold ${field.badgeStyle === 'filled'
                        ? (themeStyles.highlight_bg + ' ' + themeStyles.text_accent)
                        : `${themeStyles.bar_bg} ${themeStyles.text_secondary}`
                        }`}
                >
                    #{tag}
                    {!isReadOnly && (
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-1.5 hover:text-red-500 focus:outline-none"
                        >
                            <X size={14} strokeWidth={3} />
                        </button>
                    )}
                </span>
            ))}

            {!isReadOnly && (
                <>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={addTag}
                        enterKeyHint="done"
                        placeholder={tags.length === 0 ? (field.placeholder || "태그 입력") : ""}
                        className={`flex-1 bg-transparent border-none outline-none min-w-[120px] ${themeStyles.text_primary} placeholder-gray-400`}
                        style={{ fontFamily: themeStyles.font_family }}
                    />
                    {/* Always Visible Add Button */}
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={addTag}
                        disabled={inputValue.trim().length === 0}
                        className={`ml-2 p-1.5 rounded-full transition-all ${inputValue.trim().length > 0
                            ? `${themeStyles.soft_bg} ${themeStyles.soft_text} hover:bg-opacity-80`
                            : `${themeStyles.bar_bg} ${themeStyles.text_tertiary}`
                            }`}
                    >
                        <Plus size={16} strokeWidth={3} />
                    </button>
                </>
            )}
        </div>
    );
};

export default ProfileTagsField;
