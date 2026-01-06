import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { FormOption } from '../../../types/formConfig';

interface SortableOptionItemProps {
    option: FormOption | string;
    idx: number;
    onUpdate: (index: number, updates: Partial<FormOption>) => void;
    onDelete: (index: number) => void;
}

// Individual Sortable Option Item
const SortableOptionItem: React.FC<SortableOptionItemProps> = ({ option, idx, onUpdate, onDelete }) => {
    // Determine unique ID for option
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
        zIndex: isDragging ? 20 : 1,
    };

    const label = typeof option === 'object' ? option.label : option;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 group bg-white relative mb-2"
        >
            <div
                {...attributes}
                {...listeners}
                className="text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing p-1 -ml-1"
            >
                <GripVertical size={16} />
            </div>

            <input
                type="text"
                value={label || ''}
                onChange={(e) => onUpdate(idx, { label: e.target.value })}
                className="flex-1 border-b border-slate-200 px-2 py-1.5 text-sm outline-none bg-transparent hover:border-indigo-300 focus:border-indigo-500 focus:bg-slate-50 transition-colors"
                placeholder={`옵션 ${idx + 1}`}
            />

            <button
                onClick={() => onDelete(idx)}
                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            >
                <X size={16} />
            </button>
        </div>
    );
};

interface ProfileOptionListProps {
    options?: (FormOption | string)[];
    onUpdateOptions: (options: (FormOption | string)[]) => void;
    allowOther?: boolean;
    onToggleAllowOther?: () => void;
}

const ProfileOptionList: React.FC<ProfileOptionListProps> = ({ options = [], onUpdateOptions, allowOther, onToggleAllowOther }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = options.findIndex(opt => (typeof opt === 'object' ? opt.value : opt) === active.id);
        const newIndex = options.findIndex(opt => (typeof opt === 'object' ? opt.value : opt) === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            onUpdateOptions(arrayMove(options, oldIndex, newIndex));
        }
    };

    const handleUpdate = (idx: number, updates: Partial<FormOption>) => {
        const newOptions = [...options];
        const current = newOptions[idx];

        if (typeof current === 'object') {
            newOptions[idx] = { ...current, ...updates };
        } else {
            // Convert string to object
            const label = updates.label !== undefined ? updates.label : current;
            newOptions[idx] = { label, value: label, ...updates } as FormOption;
        }
        onUpdateOptions(newOptions);
    };

    const handleDelete = (idx: number) => {
        if (options.length <= 1) {
            toast.warning('최소 1개의 옵션은 유지해야 합니다.');
            return;
        }
        onUpdateOptions(options.filter((_, i) => i !== idx));
    };

    const handleAdd = () => {
        const newOption: FormOption = {
            label: `옵션 ${options.length + 1}`,
            value: `opt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
        };
        onUpdateOptions([...options, newOption]);
    };

    // Extract IDs for SortableContext
    const items = options.map((opt, idx) => (typeof opt === 'object' ? opt.value : opt) || `opt_${idx}`);

    return (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mt-2">
            <div className="text-xs font-bold text-slate-500 uppercase mb-3 ml-1">
                옵션 목록
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <div className="space-y-1">
                        {options.map((option, idx) => (
                            <SortableOptionItem
                                key={items[idx]}
                                option={option}
                                idx={idx}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <div className="mt-3 flex items-center justify-between">
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded transition-colors"
                >
                    <Plus size={14} />
                    <span>옵션 추가하기</span>
                </button>

                {onToggleAllowOther && (
                    <label className={`flex items-center gap-2 select-none cursor-pointer group`}>
                        <div className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                            기타(직접 입력) 허용
                        </div>
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleAllowOther();
                            }}
                            className={`relative w-8 h-4 rounded-full transition-colors duration-200 ${allowOther ? 'bg-indigo-500' : 'bg-slate-200'}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-200 ${allowOther ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                    </label>
                )}
            </div>
        </div>
    );
};

export default ProfileOptionList;
