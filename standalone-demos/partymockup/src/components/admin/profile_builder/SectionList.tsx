import React from 'react';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, ChevronDown } from 'lucide-react';
import ProfileOptionList from './ProfileOptionList';
import { FIELD_TYPE_LABELS } from '../../../constants/fieldTypes';
import { ProfileSection, ProfileField, ProfileBuilderActions } from '../../../types/profileConfig';
import { FormOption } from '../../../types/formConfig';

// Draggable Field Component Props
interface SortableFieldProps {
    field: ProfileField;
    isSelected: boolean;
    onClick: () => void;
    onClose: () => void;
    onDelete: () => void;
    onUpdate: (fieldId: string, updates: Partial<ProfileField>) => void;
}

// [NEW] Presentational Field Component
export const FieldItem: React.FC<SortableFieldProps & { style?: React.CSSProperties, attributes?: any, listeners?: any, dragHandleProps?: any }> = ({
    field, isSelected, onClick, onClose, onDelete, onUpdate, style, attributes, listeners
}) => {
    // Handler for updating field properties
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        const newValue = type === 'checkbox' ? checked : value;
        onUpdate(field.id, { [name]: newValue });
    };

    if (isSelected) {
        return (
            <div
                style={style}
                className="bg-white border border-indigo-500 ring-1 ring-indigo-500 rounded-xl shadow-lg mb-3 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Drag Handle Top - Apply listeners here */}
                <div
                    {...attributes}
                    {...listeners}
                    className="h-6 bg-indigo-50 flex items-center justify-center cursor-move hover:bg-indigo-100 transition-colors touch-none"
                >
                    <div className="w-10 h-1 rounded-full bg-indigo-200"></div>
                </div>

                <div className="p-5 space-y-4">
                    {/* Header: Actions (Collapse & Delete) */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider">문항 수정</div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={onDelete}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                title="삭제"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Label & Card Alias Input */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">질문 제목</label>
                            <input
                                type="text"
                                name="label" // Field.label (different from Question.title, mapped carefully)
                                value={field.label || field.title || ''}
                                onChange={handleChange}
                                className="w-full p-2.5 text-lg font-bold bg-white border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all placeholder-slate-300"
                                placeholder="질문 제목을 입력하세요"
                                autoFocus
                            />
                        </div>
                        {/* Card Label (Alias) */}
                        <div className="w-32 shrink-0">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1 text-center">카드 표기명</label>
                            <input
                                type="text"
                                value={field.adminProps?.cardLabel || field.label || field.title || ''}
                                onChange={(e) => onUpdate(field.id, {
                                    adminProps: {
                                        ...field.adminProps,
                                        cardLabel: e.target.value
                                    }
                                })}
                                disabled={field.isSystem || field.isLabelLocked}
                                className={`w-full p-2.5 border rounded-lg text-sm text-center font-medium outline-none transition-all ${(field.isSystem || field.isLabelLocked)
                                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                    : 'bg-white border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 hover:border-indigo-300'
                                    }`}
                                placeholder="별칭 입력"
                                title="프로필 카드에 표시될 짧은 이름입니다 (예: 닉네임, 지역)"
                            />
                        </div>
                    </div>

                    {/* Additional Options */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-[1fr_200px] gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">설명 / 가이드</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={field.description || ''}
                                    onChange={handleChange}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none transition-all focus:ring-2 focus:ring-indigo-500/10 placeholder-slate-300"
                                    placeholder="사용자에게 보여질 설명"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">답변 유형</label>
                                <div className="relative">
                                    <select
                                        name="type"
                                        value={field.type}
                                        onChange={handleChange}
                                        disabled={field.isSystem || field.readOnly}
                                        className={`w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none appearance-none ${(field.isSystem || field.readOnly)
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-white hover:border-indigo-300 focus:border-indigo-500 text-slate-700'
                                            }`}
                                    >
                                        {Object.entries(FIELD_TYPE_LABELS).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {['short_text', 'long_text'].includes(field.type) && (!field.isSystem || field.id === 'nickname') && !field.isLocked && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">플레이스홀더</label>
                            <input
                                type="text"
                                name="placeholder"
                                value={field.placeholder || ''}
                                onChange={handleChange}
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none transition-all focus:ring-2 focus:ring-indigo-500/10 placeholder-slate-300"
                                placeholder="답변 입력 시 보여질 흐릿한 힌트 문구를 입력하세요"
                            />
                        </div>
                    )}


                    {/* Option List (Choice Fields) */}
                    {(['single_choice', 'multiple_choice', 'dropdown'].includes(field.type)) && (
                        <div className="mt-4">
                            <ProfileOptionList
                                options={field.options as (FormOption | string)[] || []}
                                onUpdateOptions={(newOptions) => onUpdate(field.id, { options: newOptions })}
                                allowOther={field.allowOther}
                                onToggleAllowOther={(field.type === 'single_choice' || field.type === 'multiple_choice')
                                    ? () => onUpdate(field.id, { allowOther: !field.allowOther })
                                    : undefined
                                }
                            />
                        </div>
                    )}

                    {/* Footer: Required Toggle */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div
                            className={`flex items-center gap-2 select-none ${(field.isLocked || field.readOnly) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (field.isLocked || field.readOnly) return;
                                onUpdate(field.id, { required: !field.required });
                            }}
                        >
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${field.required ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${field.required ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                            <span className="text-sm font-medium text-slate-600">필수 응답</span>
                        </div>

                        {/* [NEW] Show in Partner View Toggle */}
                        <div
                            className={`flex items-center gap-2 select-none cursor-pointer group ml-6`} // Added ml-6 for spacing
                            onClick={(e) => {
                                e.stopPropagation();
                                const current = field.showInPartnerView !== false; // Default true
                                onUpdate(field.id, { showInPartnerView: !current });
                            }}
                        >
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${field.showInPartnerView !== false ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${field.showInPartnerView !== false ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                            <span className="text-sm font-medium text-slate-600">상대방에게 공개</span>
                        </div>

                        <div className="flex-1" /> {/* Spacer to push Close button to right */}

                        <button
                            onClick={(e) => { e.stopPropagation(); onClose && onClose(); }} // Close properly
                            className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Minimized View (ReadOnly Summary)
    return (
        <div
            style={style}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className={`
                flex items-center gap-3 p-3 bg-white border rounded-xl text-sm transition-all mb-2 cursor-pointer group hover:border-slate-400 hover:shadow-sm
                ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md' : 'border-slate-300'}
            `}
        >
            <button
                {...attributes}
                {...listeners}
                className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing p-1 -ml-1 touch-none"
                onClick={(e) => e.stopPropagation()}
            >
                <GripVertical size={16} />
            </button>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    {/* Assuming label is used in ProfileBuilder, falling back to title if missing */}
                    <span className="font-semibold text-slate-800 truncate">{field.label || field.title}</span>
                    {field.required && <span className="text-[10px] text-red-500 font-bold">*</span>}
                </div>
                {field.description && <p className="text-xs text-slate-400 truncate">{field.description}</p>}
            </div>
        </div>
    );
};

const SortableField: React.FC<SortableFieldProps> = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: props.field.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 20 : 1,
        opacity: isDragging ? 0.4 : 1, // Dim original item
    };

    return (
        <div ref={setNodeRef} style={style}>
            <FieldItem {...props} attributes={attributes} listeners={listeners} />
        </div>
    );
};

// Draggable Section Component Props
interface SortableSectionProps {
    section: ProfileSection;
    selectedItem: { type: 'section' | 'field'; id: string; sectionId?: string } | null;
    onClick: () => void;
    onDelete: () => void;
    actions: ProfileBuilderActions;
}

// [NEW] Presentational Section Component
export const SectionItem: React.FC<SortableSectionProps & { style?: React.CSSProperties, attributes?: any, listeners?: any }> = ({
    section, selectedItem, onClick, onDelete, actions, style, attributes, listeners
}) => {
    const isSectionEditing = selectedItem?.type === 'section' && selectedItem?.id === section.id;
    const selectedFieldId = selectedItem?.type === 'field' ? selectedItem.id : null;
    const isFieldInThisSectionSelected = selectedItem?.type === 'field' && section.fields.some(f => f.id === selectedItem.id);

    // [REMOVED] Special handling for Nickname Section (Normalizing behavior)
    // const isNicknameSection = section.id === 'section_nickname';
    // const nicknameField = isNicknameSection ? section.fields.find(f => f.id === 'nickname') : null;

    const handleSectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        actions.updateSection(section.id, { [name]: value });
    };

    return (
        <div
            style={style}
            className={`
                group relative bg-white rounded-xl border transition-all duration-200 mb-6
                ${isSectionEditing || isFieldInThisSectionSelected
                    ? 'border-indigo-500 shadow-lg ring-1 ring-indigo-500'
                    : 'border-slate-300 hover:border-slate-400 shadow-sm'
                }
            `}
        >
            {/* Header / Editor */}
            <div
                className="p-4 border-b border-slate-100 cursor-pointer"
                onClick={() => {
                    if (!isSectionEditing) onClick();
                }}
            >
                {isSectionEditing ? (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">세션 설정</span>
                            <div className="flex gap-2">
                                <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="섹션 삭제">
                                    <Trash2 size={16} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); actions.selectItem && actions.selectItem(null); }} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded font-bold text-xs transition-colors">
                                    접기
                                </button>
                            </div>
                        </div>

                        {/* [MODIFIED] 2-Column Grid Layout for Clean UI */}
                        <div className="grid grid-cols-[1fr_1px_1fr] gap-6 items-start">
                            {/* Left: Writer Config */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 uppercase mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                    작성자(나)
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={section.title}
                                    onChange={handleSectionChange}
                                    className="w-full text-lg font-bold border-b border-slate-300 focus:border-indigo-500 outline-none transition-colors bg-transparent placeholder-slate-300 py-1"
                                    placeholder="작성자용 제목"
                                    autoFocus
                                />
                                <input
                                    type="text"
                                    name="description"
                                    value={section.description || ''}
                                    onChange={handleSectionChange}
                                    className="w-full text-sm text-slate-500 border-b border-slate-200 focus:border-indigo-500 outline-none transition-colors bg-transparent placeholder-slate-300 py-1"
                                    placeholder="작성자용 설명 (선택사항)"
                                />
                            </div>

                            {/* Divider */}
                            <div className="h-full bg-slate-100 w-px"></div>

                            {/* Right: Viewer Config */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                    상대방(뷰어)
                                </label>
                                <input
                                    type="text"
                                    name="viewerTitle"
                                    value={section.viewerTitle || ''}
                                    onChange={handleSectionChange}
                                    className="w-full text-lg font-bold border-b border-slate-300 focus:border-indigo-500 outline-none transition-colors bg-transparent placeholder-slate-300 py-1"
                                    placeholder={section.title} // Placeholder follows writer title
                                />
                                <input
                                    type="text"
                                    name="viewerDescription"
                                    value={section.viewerDescription || ''}
                                    onChange={handleSectionChange}
                                    className="w-full text-sm text-slate-500 border-b border-slate-200 focus:border-indigo-500 outline-none transition-colors bg-transparent placeholder-slate-300 py-1"
                                    placeholder="뷰어용 설명 (선택사항)"
                                />
                            </div>
                        </div>

                        {/* NICKNAME SPECIAL EDITOR REMOVED - Managed via FieldItem now */}
                    </div>
                ) : (
                    <div className="flex items-start gap-3">
                        <button
                            {...attributes}
                            {...listeners}
                            className="mt-1 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing p-1 -ml-1 touch-none"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <GripVertical size={20} />
                        </button>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-slate-800">{section.title}</h3>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">{section.description}</p>
                        </div>
                        {/* Status Indicator */}
                        <div className={`w-2 h-2 rounded-full mt-2.5 transition-colors ${isFieldInThisSectionSelected ? 'bg-indigo-300' : 'bg-slate-200'}`} />
                    </div>
                )}
            </div>

            {/* Content Preview (Fields) */}
            <div className="p-4 bg-slate-50/50 rounded-b-xl min-h-[80px]" onClick={() => !selectedItem && onClick()}>
                <SortableContext
                    items={section.fields.map(f => f.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {section.fields?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 bg-white/50">
                            <span className="text-sm font-medium">문항이 없습니다</span>
                            <span className="text-xs mt-1">우측 도구 상자에서 문항을 추가하세요</span>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {section.fields?.map(field => (
                                <SortableField
                                    key={field.id}
                                    field={field}
                                    isSelected={selectedFieldId === field.id}
                                    onClick={() => actions.selectItem && actions.selectItem({ type: 'field', id: field.id, sectionId: section.id })}
                                    onClose={() => actions.selectItem && actions.selectItem(null)} // Deselect
                                    onUpdate={(fieldId, updates) => actions.updateField(section.id, fieldId, updates)}
                                    onDelete={() => actions.deleteField(section.id, field.id)}
                                />
                            ))}
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
};

const SortableSection: React.FC<SortableSectionProps> = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: props.section.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <SectionItem {...props} attributes={attributes} listeners={listeners} />
        </div>
    );
};

interface SectionListProps {
    sections: ProfileSection[];
    actions: ProfileBuilderActions;
    selectedItem: { type: 'section' | 'field'; id: string; sectionId?: string } | null;
    onSelect: (item: { type: 'section' | 'field'; id: string; sectionId?: string } | null) => void;
}

const SectionList: React.FC<SectionListProps> = ({ sections, actions, selectedItem, onSelect }) => {
    // Inject selectItem helper into actions if not present, or use onSelect wrapper
    const extendedActions: ProfileBuilderActions = {
        ...actions,
        selectItem: onSelect
    };

    return (
        <SortableContext
            items={sections.map(s => s.id)}
            strategy={verticalListSortingStrategy}
        >
            <div className="space-y-4 pb-32">
                {sections.map((section) => (
                    <SortableSection
                        key={section.id}
                        section={section}
                        selectedItem={selectedItem}
                        onClick={() => {
                            // If clicking the section while it's already selected (editing), deselect logic could go here
                            // But for now, just select it
                            if (selectedItem?.id !== section.id) {
                                onSelect({ type: 'section', id: section.id });
                            }
                        }}
                        onDelete={() => actions.deleteSection(section.id)}
                        actions={extendedActions}
                    />
                ))}
            </div>
        </SortableContext>
    );
};

export default SectionList;
