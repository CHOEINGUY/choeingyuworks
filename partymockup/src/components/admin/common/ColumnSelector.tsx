import React, { useState, useRef, useEffect } from 'react';
import { Settings, Check, X, GripVertical } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
const SortableItem = ({ id, label, isSelected, isRequired, onToggle, isDark }: any) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        position: 'relative' as 'relative',
    };

    return (
        <div ref={setNodeRef} style={style} className={`flex items-center gap-2 mb-1 ${isDragging ? 'opacity-50' : ''}`}>
            {/* Checkbox (Fixed) */}
            <button
                onClick={() => !isRequired && onToggle(id)}
                disabled={isRequired}
                className={`flex-shrink-0 flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors flex-1 text-left min-w-0 ${isRequired
                    ? 'opacity-70 cursor-not-allowed'
                    : 'cursor-pointer'
                    } ${isDark
                        ? 'hover:bg-slate-700 text-gray-300'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
            >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected
                    ? (isDark ? 'bg-pink-600 border-pink-600 text-white' : 'bg-pink-500 border-pink-500 text-white')
                    : (isDark ? 'border-gray-600' : 'border-gray-300')
                    }`}>
                    {isSelected && <Check size={12} strokeWidth={3} />}
                </div>
                <span className="flex-1 truncate select-none">{label}</span>
                {isRequired && <span className="text-[10px] opacity-50 border px-1 rounded">필수</span>}
            </button>

            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className={`p-2 cursor-grab active:cursor-grabbing rounded hover:bg-black/5 ${isDark ? 'text-gray-600 hover:bg-white/10' : 'text-gray-400'}`}
            >
                <GripVertical size={16} />
            </div>
        </div>
    );
};

interface ColumnSelectorProps {
    allColumns?: { id: string; label: string; required?: boolean }[];
    selectedColumnIds?: Set<string>;
    onOrderChange: (newOrderedColumns: any[]) => void;
    onSelectionChange: (newSelectedIds: Set<string>) => void;
    isDark?: boolean;
    trigger?: React.ReactNode;
    placement?: 'bottom-right' | 'left-bottom';
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
    allColumns = [],
    selectedColumnIds = new Set(),
    onOrderChange,
    onSelectionChange,
    isDark,
    trigger,
    placement = 'bottom-right'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sensors for Dnd
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = (id: string) => {
        const newSelected = new Set(selectedColumnIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        onSelectionChange(newSelected);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = allColumns.findIndex((col) => col.id === active.id);
            const newIndex = allColumns.findIndex((col) => col.id === over.id);

            const newOrder = arrayMove(allColumns, oldIndex, newIndex);
            onOrderChange(newOrder);
        }
    };

    // Calculate position classes based on placement
    const getPopupPosition = () => {
        if (placement === 'left-bottom') {
            return `right-full bottom-0 mr-2 origin-bottom-right`;
        }
        return `right-0 top-full mt-2 origin-top-right`;
    };

    return (
        <div className="relative" ref={containerRef}>
            {/* Trigger */}
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger ? (
                    trigger
                ) : (
                    <button
                        className={`p-2 rounded-lg transition-colors border shadow-sm flex items-center gap-2 ${isDark
                            ? 'bg-slate-900/50 border-slate-700 text-gray-400 hover:text-white hover:bg-slate-800'
                            : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        title="열 설정"
                    >
                        <Settings size={20} />
                        <span className="text-sm font-medium hidden sm:inline">열 설정</span>
                    </button>
                )}
            </div>

            {isOpen && (
                <div className={`absolute w-72 rounded-xl shadow-xl border z-50 overflow-hidden ${getPopupPosition()} ${isDark ? 'bg-slate-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className={`px-4 py-3 border-b flex items-center justify-between ${isDark ? 'border-gray-700 bg-slate-900/50' : 'border-gray-100 bg-gray-50'}`}>
                        <h4 className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>열 순서 및 표시 설정</h4>
                        <button onClick={() => setIsOpen(false)} className={`${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                            <X size={16} />
                        </button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto overflow-x-hidden p-2 scrollbar-thin">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={allColumns.map(c => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-1">
                                    {allColumns.map((col) => (
                                        <SortableItem
                                            key={col.id}
                                            id={col.id}
                                            label={col.label}
                                            isSelected={selectedColumnIds.has(col.id)}
                                            isRequired={col.required}
                                            onToggle={handleToggle}
                                            isDark={isDark}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColumnSelector;
