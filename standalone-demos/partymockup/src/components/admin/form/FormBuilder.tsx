import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';
import QuestionItem from './QuestionItem';
import ConfirmDialog from '../../common/ConfirmDialog';
import TemplateToolbar from './TemplateToolbar';

import DesignPanel from './DesignPanel';
import PricePanel from './PricePanel';
import FormCoverEditor from './FormCoverEditor';
import FormCompletionEditor from './FormCompletionEditor';
import MobilePreviewFrame from '../common/MobilePreviewFrame'; // Assumes .tsx or .jsx can be resolved, ideally convert this too

import { Question, FormSettings, PresetItem } from '../../../types/formConfig';

interface FormBuilderProps {
    questions: Question[];
    setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
    activeQuestionId: string | null;
    setActiveQuestionId: (id: string | null) => void;
    formSettings: FormSettings;
    setFormSettings: (settings: FormSettings) => void;
    viewMode?: 'editor' | 'preview';
    formId?: string;
}

/**
 * 폼 빌더 메인 컴포넌트
 * 문항 관리 및 드래그 앤 드롭 정렬 기능 제공
 */
const FormBuilder: React.FC<FormBuilderProps> = ({
    questions,
    setQuestions,
    activeQuestionId,
    setActiveQuestionId,
    formSettings,
    setFormSettings,
    viewMode = 'editor',
    formId = 'default'
}) => {

    // Sensors for Drag & Drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [isCompletionOpen, setIsCompletionOpen] = useState(false); // 완료 페이지 편집기 열림 상태
    const [isHeaderOpen, setIsHeaderOpen] = useState(false);
    const [rightPanelTab, setRightPanelTab] = useState<'tools' | 'design' | 'price'>('tools');
    const [previewKey, setPreviewKey] = useState(0);

    // --- Handlers ---

    // 문항 추가
    const handleAddQuestion = (templateOrArray: PresetItem | PresetItem[]) => {
        const templates = Array.isArray(templateOrArray) ? templateOrArray : [templateOrArray];

        let newQuestionsToAdd: Question[] = [];
        let lastAddedId: string | null = null;

        // Track IDs to prevent duplicates within the batch and against existing
        const currentIds = new Set(questions.map(q => q.id));

        for (const template of templates) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { icon, label, ...questionData } = template; // 아이콘(React Element) 및 UI 라벨 제외

            // System Field Validation: Prevent duplicates
            if (questionData.id && currentIds.has(questionData.id)) {
                if (templates.length === 1) toast.error("이미 존재하는 필수 문항입니다.");
                continue;
            }

            const newId = questionData.id || `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            const newQuestion: Question = {
                ...questionData, // 템플릿 속성 (type, title, etc)
                id: newId,
                title: questionData.title || '', // Ensure title
                type: questionData.type || 'short_text', // Ensure type
                order: questions.length + newQuestionsToAdd.length + 1
            };

            newQuestionsToAdd.push(newQuestion);
            currentIds.add(newId);
            lastAddedId = newId;
        }

        if (newQuestionsToAdd.length > 0) {
            setQuestions(prev => [...prev, ...newQuestionsToAdd]);
            if (lastAddedId) setActiveQuestionId(lastAddedId); // 추가된 마지막 문항으로 포커스 이동
        } else if (templates.length > 1) {
            // Group add failed entirely (all duplicates)
            toast.warning("이미 모든 항목이 추가되어 있습니다.");
        }
    };

    // 문항 삭제
    // 문항 삭제 요청
    const handleDeleteQuestion = (id: string) => {
        setDeleteTargetId(id);
        setIsConfirmOpen(true);
    };

    // 문항 삭제 실행 (ConfirmDialog 콜백)
    const confirmDelete = () => {
        if (deleteTargetId) {
            setQuestions(questions.filter(q => q.id !== deleteTargetId));
            if (activeQuestionId === deleteTargetId) setActiveQuestionId(null);
        }
        setIsConfirmOpen(false);
        setDeleteTargetId(null);
    };

    // 문항 복제
    const handleDuplicateQuestion = (id: string) => {
        const target = questions.find(q => q.id === id);
        if (!target) return;

        // ID 중복 방지를 위해 난수 접미사 추가
        const newId = `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const duplicated: Question = {
            ...target,
            id: newId,
            title: `${target.title} (복사본)`,
        };

        // 현재 선택된 바로 아래에 추가
        const index = questions.findIndex(q => q.id === id);
        const newQuestions = [...questions];
        newQuestions.splice(index + 1, 0, duplicated);

        // 순서(order) 재정렬
        const reorderedQuestions = newQuestions.map((q, idx) => ({
            ...q,
            order: idx + 1
        }));

        setQuestions(reorderedQuestions);
        setActiveQuestionId(newId);
    };

    // 문항 수정
    const handleUpdateQuestion = (id: string, updates: Partial<Question>) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
    };

    // 드래그 시작
    const handleDragStart = (event: DragStartEvent) => {
        setActiveDragId(event.active.id as string);
        setActiveQuestionId(null); // 드래그 시작 시 펼쳐진 문항 닫기
    };

    // 드래그 종료 (순서 변경)
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setQuestions((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // 순서(order) 재할당
                return newItems.map((item, index) => ({
                    ...item,
                    order: index + 1
                }));
            });
        }
        setActiveDragId(null);
    };

    // Preview Data Sync & Tab Control
    useEffect(() => {
        if (viewMode === 'preview') {
            const previewData = {
                formConfig: {
                    ...formSettings,
                    fields: questions
                }
            };
            localStorage.setItem('preview_form_data', JSON.stringify(previewData));
            setPreviewKey(prev => prev + 1); // Refresh iframe

            // Auto-switch to Design tab
            setRightPanelTab('design');
        } else {
            // Optional: switch back to tools when entering editor? 
            // setRightPanelTab('tools');
        }
    }, [viewMode, formSettings, questions]);

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
            {/* Header Removed - Controlled by Parent */}

            <div className="flex-1 flex min-h-0">
                {/* 좌측: 문항 리스트 OR Preview */}
                <div className="flex-1 w-full min-w-0 bg-slate-50 overflow-y-auto scrollbar-thin relative">
                    {viewMode === 'editor' ? (
                        <div className="p-8 max-w-3xl mx-auto pb-32">
                            {/* 폼 헤더 카드 (제목, 설명 - 표지 페이지 설정) */}
                            {formSettings && (
                                <FormCoverEditor
                                    formSettings={formSettings}
                                    setFormSettings={setFormSettings}
                                    isOpen={isHeaderOpen}
                                    onOpen={() => setIsHeaderOpen(true)}
                                    onClose={() => setIsHeaderOpen(false)}
                                    onActivate={() => {
                                        setActiveQuestionId(null);
                                        setIsCompletionOpen(false);
                                    }}
                                />
                            )}

                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={questions.map(q => q.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-4">
                                        {questions.map((question, index) => (
                                            <QuestionItem
                                                key={question.id}
                                                index={index}
                                                question={question}
                                                isActive={activeQuestionId === question.id}
                                                onActivate={() => {
                                                    setActiveQuestionId(question.id);
                                                    setIsCompletionOpen(false);
                                                }}
                                                onClose={() => setActiveQuestionId(null)}
                                                onUpdate={handleUpdateQuestion}
                                                onDelete={handleDeleteQuestion}
                                                onDuplicate={handleDuplicateQuestion}
                                                formId={formId}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>

                                {/* 드래그 중인 아이템의 모양 (Overlay) */}
                                <DragOverlay>
                                    {activeDragId ? (
                                        <div className="opacity-80 scale-105 origin-left">
                                            <QuestionItem
                                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                                question={questions.find(q => q.id === activeDragId)!}
                                                index={questions.findIndex(q => q.id === activeDragId)}
                                                isActive={false} // 드래그 중에는 닫힌 상태로 표시
                                                isOverlay={true}
                                                onActivate={() => { }}
                                                onClose={() => { }}
                                                onUpdate={() => { }}
                                                onDelete={() => { }}
                                                onDuplicate={() => { }}
                                            />
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>

                            {/* 빈 상태 안내 */}
                            {questions.length === 0 && (
                                <div className="text-center py-24 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-100/50">
                                    <p className="text-slate-500 font-medium text-lg">
                                        아직 등록된 문항이 없습니다.
                                    </p>
                                    <p className="text-slate-400 text-sm mt-2">
                                        오른쪽 도구 상자에서 문항을 추가해보세요.
                                    </p>
                                </div>
                            )}

                            {/* --- Footer Area: Review & Completion --- */}
                            <div className="mt-12 space-y-4">
                                {/* 1. 작성 내역 확인 (Review Step) */}
                                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 hover:border-indigo-300 transition-colors group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                        <ClipboardCheck size={20} strokeWidth={3} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3 className="text-base font-bold text-slate-700 group-hover:text-indigo-900 transition-colors">
                                                작성 내역 확인
                                            </h3>
                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-400 border border-slate-200">
                                                FIXED
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 truncate">
                                            제출 전 사용자가 입력한 내용을 확인하는 단계입니다
                                        </p>
                                    </div>
                                </div>

                                {/* 2. 작성 완료 페이지 (Completion Page) */}
                                <FormCompletionEditor
                                    formSettings={formSettings}
                                    setFormSettings={setFormSettings}
                                    isOpen={isCompletionOpen}
                                    onOpen={() => setIsCompletionOpen(true)}
                                    onClose={() => setIsCompletionOpen(false)}
                                    onActivate={() => setActiveQuestionId(null)}
                                />
                            </div>

                            {/* 모바일용 하단 추가 버튼 (데스크탑에선 숨김) */}
                            <button
                                onClick={() => handleAddQuestion({
                                    type: 'short_text',
                                    title: '새로운 문항',
                                    description: '',
                                    required: false
                                })}
                                className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition-all z-50"
                            >
                                <Plus size={28} />
                            </button>
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 p-4">
                            {/* NOTE: Using legacy MobilePreviewFrame in common if not converted yet, otherwise update import. 
                                Assuming MobilePreviewFrame is a wrapper. 
                             */}
                            <MobilePreviewFrame>
                                <iframe
                                    src={`/apply/${formId}?preview=true`}
                                    className="w-full h-full border-none"
                                    title="Form Preview"
                                    key={previewKey}
                                />
                            </MobilePreviewFrame>
                        </div>
                    )}
                </div>

                {/* 우측: 툴바 & 디자인 패널 (Tabs) */}
                <div className={`hidden lg:flex w-80 shrink-0 border-l border-slate-200 bg-white flex-col shadow-xl z-10 h-full`}>
                    {/* Right Panel Tabs */}
                    <div className="flex border-b border-slate-200">
                        <button
                            onClick={() => setRightPanelTab('tools')}
                            disabled={viewMode === 'preview'}
                            className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 flex items-center justify-center gap-2 ${rightPanelTab === 'tools'
                                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10'
                                : viewMode === 'preview'
                                    ? 'border-transparent text-slate-300 cursor-not-allowed'
                                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {/* Assuming icons are not imported yet, I'll stick to text-only if icons missing, 
                            but ProfileBuilder has <Grid> etc. FormBuilder has fewer. 
                            The user said "background color or spacing". 
                            I'll copy the Button Styles too from ProfileBuilder.jsx lines 156-175.
                        */}
                            도구 상자
                        </button>
                        <button
                            onClick={() => setRightPanelTab('design')}
                            className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 flex items-center justify-center gap-2 ${rightPanelTab === 'design'
                                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10'
                                : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            디자인
                        </button>
                        <button
                            onClick={() => setRightPanelTab('price')}
                            disabled={viewMode === 'preview'}
                            className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 flex items-center justify-center gap-2 ${rightPanelTab === 'price'
                                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10'
                                : viewMode === 'preview'
                                    ? 'border-transparent text-slate-300 cursor-not-allowed'
                                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            가격 설정
                        </button>
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-y-auto bg-white scrollbar-thin">
                        {rightPanelTab === 'tools' && (
                            <TemplateToolbar
                                onAdd={handleAddQuestion}
                                currentQuestions={questions}
                                pricingMode={formSettings?.pricingMode}
                                formId={formId} // [NEW] Pass formId
                            />
                        )}
                        {rightPanelTab === 'design' && (
                            <DesignPanel formSettings={formSettings} setFormSettings={setFormSettings} />
                        )}
                        {rightPanelTab === 'price' && (
                            <PricePanel formSettings={formSettings} setFormSettings={setFormSettings} />
                        )}
                    </div>
                </div>

                {/* Confirmation Dialog */}
                <ConfirmDialog
                    isOpen={isConfirmOpen}
                    title="문항 삭제"
                    message="정말 이 문항을 삭제하시겠습니까? 삭제된 문항은 복구할 수 없습니다."
                    confirmText="삭제하기"
                    cancelText="취소"
                    isDestructive={true}
                    onConfirm={confirmDelete}
                    onCancel={() => setIsConfirmOpen(false)}
                />
            </div>
        </div>
    );

};

export default FormBuilder;
