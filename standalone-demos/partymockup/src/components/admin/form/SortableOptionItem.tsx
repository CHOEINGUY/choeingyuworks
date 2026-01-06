import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import { FIELD_TYPES } from '../../../constants/fieldTypes';
import { FormOption } from '../../../types/formConfig';

interface SortableOptionItemProps {
    option: FormOption | string;
    idx: number;
    handleUpdateOption: (index: number, updates: Partial<FormOption>) => void;
    handleDeleteOption: (index: number) => void;
    questionType: string;
    showPrice?: boolean;
}

/**
 * Sortable Option Item Component
 * Handles the display and interaction for a single option within a question editor.
 * Support Drag & Drop via dnd-kit.
 */
const SortableOptionItem: React.FC<SortableOptionItemProps> = ({
    option,
    idx,
    handleUpdateOption,
    handleDeleteOption,
    questionType,
    showPrice
}) => {
    // Generate a unique ID for the sortable item. 
    const id = typeof option === 'object' ? (option.value || `opt_${idx}`) : option;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 group bg-white relative"
        >
            {/* Option Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing p-1 -ml-1"
            >
                <GripVertical size={16} />
            </div>

            <textarea
                ref={(el) => {
                    if (el) {
                        el.style.height = 'auto';
                        el.style.height = el.scrollHeight + 'px';
                    }
                }}
                rows={1}
                value={typeof option === 'object' ? option.label : option}
                onChange={(e) => {
                    handleUpdateOption(idx, { label: e.target.value });
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                }}
                disabled={questionType === FIELD_TYPES.REGION}
                className={`flex-1 border border-slate-200 px-3 py-2 rounded-lg text-sm outline-none transition-all resize-none overflow-hidden leading-snug ${questionType === FIELD_TYPES.REGION ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
                placeholder={`옵션 ${idx + 1}`}
            />

            {showPrice && (
                <div className="relative w-32 shrink-0">
                    <input
                        type="number"
                        value={typeof option === 'object' ? (option.price || '') : ''}
                        onChange={(e) => handleUpdateOption(idx, { price: parseInt(e.target.value) || 0 })}
                        className="w-full border border-slate-200 pl-3 pr-8 py-2 rounded-lg text-sm outline-none bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-right font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold flex items-center">
                        원<span className="text-red-500 ml-0.5">*</span>
                    </span>
                </div>
            )}

            <button
                onClick={() => handleDeleteOption(idx)}
                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                tabIndex={-1}
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default SortableOptionItem;
