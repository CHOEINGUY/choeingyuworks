import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import QuestionHeader from './QuestionHeader';
import QuestionEditor from './QuestionEditor';
import { Question } from '../../../types/formConfig';

interface QuestionItemProps {
    question: Question;
    index: number;
    isActive: boolean;
    onActivate: () => void;
    onClose: () => void;
    onUpdate: (id: string, updates: Partial<Question>) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    isOverlay?: boolean;
    formId?: string;
}

/**
 * 개별 문항 컴포넌트 (View / Edit 모드)
 * 리팩토링: Header와 Editor를 분리하고 Sortable logic만 유지함.
 */
const QuestionItem: React.FC<QuestionItemProps> = ({
    question,
    index,
    isActive,
    onActivate,
    onClose,
    onUpdate,
    onDelete,
    onDuplicate,
    isOverlay = false,
    formId
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: question.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 999 : 'auto',
        opacity: isDragging ? 0.3 : 1
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                bg-white rounded-xl border transition-all duration-200 group
                ${isActive || isOverlay
                    ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-lg scale-[1.005]'
                    : 'border-slate-300 hover:border-slate-400 hover:shadow-sm'}
            `}
        >
            {/* Header (Collapsed View + Drag Handle) */}
            <QuestionHeader
                question={question}
                index={index}
                isActive={isActive}
                onActivate={onActivate}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
                attributes={attributes}
                listeners={listeners}
            />

            {/* Editor Area (Expanded View) */}
            {isActive && !isOverlay && (
                <QuestionEditor
                    question={question}
                    onUpdate={onUpdate}
                    onClose={onClose}
                    formId={formId}
                />
            )}
        </div>
    );
};

export default QuestionItem;
