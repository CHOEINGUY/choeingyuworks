import React from 'react';
import { GripVertical, Copy, Trash2, CheckSquare, MessageSquare, Phone, Calendar, Hash, MapPin, Image as ImageIcon, FileText, Paperclip } from 'lucide-react';
import { FIELD_TYPES, FIELD_TYPE_LABELS } from '../../../constants/fieldTypes';
import { Question } from '../../../types/formConfig';
import { DraggableSyntheticListeners } from '@dnd-kit/core';

interface QuestionHeaderProps {
    question: Question;
    index: number;
    isActive: boolean;
    onActivate: () => void;
    onDuplicate: (id: string) => void;
    onDelete: (id: string) => void;
    attributes?: any;
    listeners?: DraggableSyntheticListeners;
}

/**
 * Question Header Component
 * Displays the collapsed summary view of a question, including drag handle and actions.
 */
const QuestionHeader: React.FC<QuestionHeaderProps> = ({
    question,
    index,
    isActive,
    onActivate,
    onDuplicate,
    onDelete,
    attributes,
    listeners
}) => {

    // Helper to get icon based on type
    const getTypeIcon = (type: string) => {
        switch (type) {
            case FIELD_TYPES.SHORT_TEXT: return <FileText size={16} />;
            case FIELD_TYPES.LONG_TEXT: return <MessageSquare size={16} />;
            case FIELD_TYPES.SINGLE_CHOICE: return <CheckSquare size={16} />;
            case FIELD_TYPES.MULTIPLE_CHOICE: return <CheckSquare size={16} className="bg-slate-100 p-0.5 rounded" />;
            case FIELD_TYPES.PHONE: return <Phone size={16} />;
            case FIELD_TYPES.BIRTH_DATE: return <Calendar size={16} />;
            case FIELD_TYPES.NUMBER: return <Hash size={16} />;
            case FIELD_TYPES.REGION: return <MapPin size={16} />;
            case FIELD_TYPES.IMAGE_UPLOAD: return <ImageIcon size={16} />;
            case FIELD_TYPES.FILE_UPLOAD: return <Paperclip size={16} />;
            default: return <FileText size={16} />;
        }
    };

    return (
        <div
            className="flex items-center gap-3 p-4 cursor-pointer"
            onClick={onActivate}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="p-1 text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing"
            >
                <GripVertical size={20} />
            </div>

            {/* Content Summary */}
            <div className="flex-1 min-w-0 pr-2">
                <div className="text-slate-800 leading-snug">
                    <span className="text-sm font-black text-indigo-900 mr-1.5 select-none inline-block">Q{index + 1}.</span>
                    <span className={`font-semibold break-words ${!question.title ? 'text-slate-400 italic' : ''}`}>
                        {question.title || '질문을 입력해주세요'}
                    </span>
                    {question.required && (
                        <span className="text-red-500 font-bold ml-0.5 select-none">*</span>
                    )}
                    <span className={`inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide align-middle select-none transform -translate-y-0.5 ${isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                        {question.isSessionSelector ? <Calendar size={16} /> : getTypeIcon(question.type)}
                        <span>{question.isSessionSelector ? '참가일정' : (FIELD_TYPE_LABELS[question.type as keyof typeof FIELD_TYPE_LABELS] || question.type)}</span>
                    </span>
                    {question.description && (
                        <p className="text-xs text-slate-500 mt-1 ml-0.5 font-normal truncate">
                            {question.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Quick Actions (only visible on hover or active) */}
            <div className={`flex items-center gap-1 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                <button
                    onClick={(e) => { e.stopPropagation(); onDuplicate(question.id); }}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="복제"
                >
                    <Copy size={18} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(question.id); }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="삭제"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default QuestionHeader;
