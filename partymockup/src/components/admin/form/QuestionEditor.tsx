import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { ChevronDown, CheckSquare, Plus, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { FIELD_TYPES, FIELD_TYPE_LABELS } from '../../../constants/fieldTypes';
import { SYSTEM_FIELDS } from '../../../data/formSchema';
import SortableOptionItem from './SortableOptionItem';
import { Question, FormOption } from '../../../types/formConfig';

interface QuestionEditorProps {
    question: Question;
    onUpdate: (id: string, updates: Partial<Question>) => void;
    onClose: () => void;
    formId?: string;
}

/**
 * Question Editor Component
 * Handles the expanded editing view for a question.
 * Manages different layouts (Notice, Standard, Payment) and Option Reordering.
 */
const QuestionEditor: React.FC<QuestionEditorProps> = ({
    question,
    onUpdate,
    onClose,
    formId
}) => {

    // Sensors for Option Dragging
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // --- Option Handlers ---

    const handleAddOption = () => {
        const currentOptions = question.options || [];
        onUpdate(question.id, {
            options: [...currentOptions, { label: `옵션 ${currentOptions.length + 1}`, value: `opt_${Date.now()}` }]
        });
    };

    const handleUpdateOption = (index: number, updates: Partial<FormOption>) => {
        const newOptions = [...(question.options || [])];
        const currentOption = newOptions[index];

        if (typeof currentOption === 'object') {
            newOptions[index] = { ...currentOption, ...updates };
        } else {
            // Convert string option to object if needed, or maintain consistency
            // If updates has label, use it. If it has only price, we need to convert string option to object first.
            const label = updates.label !== undefined ? updates.label : currentOption;
            newOptions[index] = { label, value: label, ...updates } as FormOption;
        }
        onUpdate(question.id, { options: newOptions });
    };

    const handleDeleteOption = (index: number) => {
        const currentOptions = question.options || [];
        if (currentOptions.length <= 1) {
            toast.error('최소 1개의 옵션은 유지해야 합니다.');
            return;
        }
        const newOptions = currentOptions.filter((_, i) => i !== index);
        onUpdate(question.id, { options: newOptions });
    };

    const handleOptionDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const currentOptions = question.options || [];
        const oldIndex = currentOptions.findIndex(opt =>
            (typeof opt === 'object' ? opt.value : opt) === active.id
        );
        const newIndex = currentOptions.findIndex(opt =>
            (typeof opt === 'object' ? opt.value : opt) === over.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
            const newOptions = arrayMove(currentOptions, oldIndex, newIndex);
            onUpdate(question.id, { options: newOptions });
        }
    };

    // --- Renderers ---

    const renderNoticeLayout = () => (
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">질문 제목</label>
                    <input
                        type="text"
                        value={question.title}
                        onChange={(e) => onUpdate(question.id, { title: e.target.value })}
                        className="w-full p-3 text-lg font-normal bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-slate-300 h-[50px]"
                        placeholder="공지 제목"
                    />
                </div>
                <div className="w-40 shrink-0">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">답변 유형</label>
                    <div className="relative">
                        <select
                            value={question.type}
                            onChange={(e) => onUpdate(question.id, { type: e.target.value })}
                            className="w-full p-3 border border-slate-200 rounded-xl appearance-none font-normal text-base bg-white hover:border-indigo-300 focus:border-indigo-500 outline-none h-[50px]"
                        >
                            {Object.entries(FIELD_TYPE_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ChevronDown size={16} /></div>
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">설명 / 안내 문구</label>
                <textarea
                    value={question.description || ''}
                    onChange={(e) => onUpdate(question.id, { description: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm text-slate-600 resize-none h-24 leading-relaxed"
                    placeholder="긴 안내 문구를 입력하세요"
                />
            </div>
        </div>
    );

    const renderStandardLayout = () => (
        <div className="space-y-3">
            {/* Row 1: Title & Label */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">질문 제목</label>
                    <input
                        type="text"
                        value={question.title}
                        onChange={(e) => onUpdate(question.id, { title: e.target.value })}
                        className="w-full p-2.5 text-lg font-normal bg-white border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none"
                        placeholder="질문을 입력해주세요"
                        autoFocus
                    />
                </div>
                {question.type !== FIELD_TYPES.PAYMENT_INFO && (
                    <div className="w-28 shrink-0">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1 flex items-center gap-1">
                            카드 표기명
                            <span className="text-red-500">*</span>
                            {question.isLocked && null}
                        </label>
                        <input
                            type="text"
                            value={question.adminProps?.cardLabel || ''}
                            onChange={(e) => onUpdate(question.id, { adminProps: { ...question.adminProps, cardLabel: e.target.value } })}
                            disabled={question.isLocked || question.isSystem || question.isSessionSelector || question.id === SYSTEM_FIELDS.SCHEDULE || question.id === SYSTEM_FIELDS.TICKET_OPTION || question.id === SYSTEM_FIELDS.INSTAGRAM || question.id === SYSTEM_FIELDS.REFUND_ACCOUNT || question.type === FIELD_TYPES.MBTI}
                            className={`w-full p-2.5 text-sm border rounded-lg text-center outline-none ${(question.isLocked || question.isSystem || question.isSessionSelector || question.id === SYSTEM_FIELDS.SCHEDULE || question.id === SYSTEM_FIELDS.TICKET_OPTION || question.id === SYSTEM_FIELDS.INSTAGRAM || question.id === SYSTEM_FIELDS.REFUND_ACCOUNT || question.type === FIELD_TYPES.MBTI) ? 'bg-slate-100 text-slate-400' : 'bg-white focus:border-indigo-500'}`}
                            placeholder={question.isLocked ? "-" : "별칭"}
                        />
                    </div>
                )}
            </div>

            {/* Row 2: Description & Type */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">질문 설명</label>
                    <input
                        type="text"
                        value={question.description || ''}
                        onChange={(e) => onUpdate(question.id, { description: e.target.value })}
                        className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:border-indigo-500 outline-none"
                        placeholder="질문 설명 (선택)"
                    />
                </div>
                <div className="w-40 shrink-0">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">답변 유형</label>
                    <div className="relative">
                        <select
                            value={question.type}
                            onChange={(e) => onUpdate(question.id, { type: e.target.value })}
                            disabled={question.isLocked || question.isSystem || question.isTypeLocked || question.id === SYSTEM_FIELDS.TICKET_OPTION || question.id === SYSTEM_FIELDS.INSTAGRAM || question.id === SYSTEM_FIELDS.REFUND_ACCOUNT || question.type === FIELD_TYPES.MBTI}
                            className={`w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg appearance-none text-sm font-medium outline-none
                                ${(question.isLocked || question.isSystem || question.isTypeLocked || question.id === SYSTEM_FIELDS.TICKET_OPTION || question.id === SYSTEM_FIELDS.INSTAGRAM || question.id === SYSTEM_FIELDS.REFUND_ACCOUNT || question.type === FIELD_TYPES.MBTI) ? 'bg-slate-100 text-slate-400' : 'bg-white focus:border-indigo-500 text-slate-700'}`}
                        >
                            {Object.entries(FIELD_TYPE_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                        {!question.isLocked && !question.isTypeLocked && question.id !== SYSTEM_FIELDS.TICKET_OPTION && question.id !== SYSTEM_FIELDS.INSTAGRAM && question.id !== SYSTEM_FIELDS.REFUND_ACCOUNT && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ChevronDown size={14} /></div>
                        )}
                    </div>
                </div>
            </div>

            {/* Row 3: Placeholder (Conditional) */}
            {(question.type === FIELD_TYPES.SHORT_TEXT || question.type === FIELD_TYPES.LONG_TEXT || question.type === FIELD_TYPES.PHONE || question.type === FIELD_TYPES.NUMBER) && (
                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">플레이스홀더</label>
                        <input
                            type="text"
                            value={question.placeholder || ''}
                            onChange={(e) => onUpdate(question.id, { placeholder: e.target.value })}
                            className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:border-indigo-500 outline-none"
                            placeholder="답변 입력 시 보여질 흐릿한 힌트 문구를 입력하세요"
                        />
                    </div>
                </div>
            )}
        </div>
    );

    const renderPaymentLayout = () => (
        <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 space-y-4 mt-2">
            <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
                <Hash size={12} />
                입금 정보 설정
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-indigo-600 mb-1">입금 상세 정보</label>
                    <textarea
                        value={question.paymentDetails || ''}
                        onChange={(e) => onUpdate(question.id, { paymentDetails: e.target.value })}
                        className="w-full p-2 bg-white border border-indigo-200 rounded focus:border-indigo-500 outline-none text-sm resize-none leading-relaxed"
                        placeholder={`예:\n남성: 50,000원\n여성: 30,000원`}
                        rows={3}
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-xs font-semibold text-indigo-600 mb-1">은행명</label>
                    <input
                        type="text"
                        value={question.bankName || '국민은행'}
                        onChange={(e) => onUpdate(question.id, { bankName: e.target.value })}
                        className="w-full p-2 bg-white border border-indigo-200 rounded focus:border-indigo-500 outline-none text-sm"
                        placeholder="예: 국민은행"
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-xs font-semibold text-indigo-600 mb-1">예금주</label>
                    <input
                        type="text"
                        value={question.accountHolder || ''}
                        onChange={(e) => onUpdate(question.id, { accountHolder: e.target.value })}
                        className="w-full p-2 bg-white border border-indigo-200 rounded focus:border-indigo-500 outline-none text-sm"
                        placeholder="예금주"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-indigo-600 mb-1">계좌번호</label>
                    <input
                        type="text"
                        value={question.accountNumber || ''}
                        onChange={(e) => onUpdate(question.id, { accountNumber: e.target.value })}
                        className="w-full p-2 bg-white border border-indigo-200 rounded focus:border-indigo-500 outline-none text-sm font-mono"
                        placeholder="계좌번호를 입력해주세요"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-indigo-600 mb-1">추가 안내 (선택)</label>
                    <textarea
                        value={question.otherInfo || ''}
                        onChange={(e) => onUpdate(question.id, { otherInfo: e.target.value })}
                        className="w-full p-2 bg-white border border-indigo-200 rounded focus:border-indigo-500 outline-none text-sm resize-none leading-relaxed"
                        placeholder="예: 입금자명을 꼭 확인해주세요"
                        rows={2}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="px-6 pb-6 pt-5 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-4">

                {/* 1. Main Layout */}
                {question.type === FIELD_TYPES.NOTICE ? renderNoticeLayout() : renderStandardLayout()}

                {/* 1.5 Special Validation for Birth Date (Age Limit) */}
                {question.type === FIELD_TYPES.BIRTH_DATE && (
                    <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 flex items-center gap-4 mt-2">
                        <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider shrink-0">
                            나이 제한 설정
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <input
                                    type="number"
                                    value={question.validation?.minAge || 20}
                                    onChange={(e) => onUpdate(question.id, { validation: { ...question.validation, minAge: parseInt(e.target.value) } })}
                                    className="w-16 p-1.5 text-center text-sm font-bold bg-white border border-indigo-200 rounded-lg focus:border-indigo-500 outline-none"
                                />
                                <span className="absolute -top-2 left-1.5 text-[10px] text-indigo-400 bg-white px-0.5">최소</span>
                            </div>
                            <span className="text-slate-400">~</span>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={question.validation?.maxAge || 45}
                                    onChange={(e) => onUpdate(question.id, { validation: { ...question.validation, maxAge: parseInt(e.target.value) } })}
                                    className="w-16 p-1.5 text-center text-sm font-bold bg-white border border-indigo-200 rounded-lg focus:border-indigo-500 outline-none"
                                />
                                <span className="absolute -top-2 left-1.5 text-[10px] text-indigo-400 bg-white px-0.5">최대</span>
                            </div>
                            <span className="text-xs text-indigo-600 ml-1">세 (만 나이 기준)</span>
                        </div>
                    </div>
                )}

                {/* 2. Special Layouts (Payment) */}
                {question.type === FIELD_TYPES.PAYMENT_INFO && renderPaymentLayout()}

                {/* 3. Option Management */}
                {question.isSessionSelector && formId !== 'match' ? (
                    // Default Mode (Rotation/Party) Notice
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-center mt-2 flex flex-col items-center justify-center gap-1">
                        <span className="text-xs font-bold text-slate-500">
                            세션 목록 자동 연동
                        </span>
                        <span className="text-[11px] text-slate-400">
                            어드민 페이지의 '세션 목록'과 자동으로 동기화됩니다.
                        </span>
                    </div>
                ) : (
                    !question.isLocked && (question.type === FIELD_TYPES.SINGLE_CHOICE || question.type === FIELD_TYPES.MULTIPLE_CHOICE || question.type === FIELD_TYPES.DROPDOWN || question.type === FIELD_TYPES.REGION) && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mt-2">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-slate-500 uppercase ml-1">옵션 목록</span>
                            </div>

                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleOptionDragEnd}
                                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                            >
                                <SortableContext
                                    items={(question.options || []).map((option, idx) => typeof option === 'object' ? (option.value || `opt_${idx}`) : option)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-2">
                                        {(question.options || []).map((option, idx) => (
                                            <SortableOptionItem
                                                key={(typeof option === 'object' ? option.value : option) || idx}
                                                option={option}
                                                idx={idx}
                                                handleUpdateOption={handleUpdateOption}
                                                handleDeleteOption={handleDeleteOption}
                                                questionType={question.type}
                                                showPrice={Boolean(question.isTicket || question.id === SYSTEM_FIELDS.TICKET_OPTION)}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>

                            <button
                                onClick={handleAddOption}
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 py-2 px-1 flex items-center gap-1.5 mt-2 transition-colors"
                            >
                                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <Plus size={12} />
                                </div>
                                옵션 추가하기
                            </button>
                        </div>
                    )
                )}

                {/* 4. Bottom Toolbar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm active:scale-95 shadow-indigo-200"
                    >
                        <CheckSquare size={16} />
                        <span>완료</span>
                    </button>

                    <div className="flex items-center gap-4">
                        {/* Allow Other Toggle (Single/Multiple Choice only) */}
                        {(question.type === FIELD_TYPES.SINGLE_CHOICE || question.type === FIELD_TYPES.MULTIPLE_CHOICE) && (
                            <label className={`flex items-center gap-2 select-none cursor-pointer group`}>
                                <div className="text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
                                    기타(직접 입력) 허용
                                </div>
                                <button
                                    onClick={() => onUpdate(question.id, { allowOther: !question.allowOther })}
                                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${question.allowOther ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${question.allowOther ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </label>
                        )}

                        {/* Show In Review Toggle */}
                        {question.type !== FIELD_TYPES.NOTICE && question.type !== FIELD_TYPES.PAYMENT_INFO && question.type !== FIELD_TYPES.IMAGE_UPLOAD && question.type !== FIELD_TYPES.FILE_UPLOAD && (
                            <label className={`flex items-center gap-2 select-none cursor-pointer group`}>
                                <div className="text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
                                    리뷰 페이지 노출
                                </div>
                                <button
                                    onClick={() => onUpdate(question.id, { showInReview: !(question.showInReview ?? question.required) })}
                                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${(question.showInReview ?? question.required) ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${(question.showInReview ?? question.required) ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </label>
                        )}

                        {/* Required Toggle */}
                        {question.type !== FIELD_TYPES.NOTICE && question.type !== FIELD_TYPES.PAYMENT_INFO && (
                            <label className={`flex items-center gap-2 select-none ${question.isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer group'}`}>
                                <div className="text-sm font-bold text-slate-600 group-hover:text-slate-900">
                                    필수 응답
                                </div>
                                <button
                                    onClick={() => !question.isLocked && onUpdate(question.id, { required: !question.required })}
                                    disabled={question.isLocked}
                                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${question.required ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${question.required ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionEditor;
