import React, { useMemo } from 'react';
import { Type, AlignLeft, CheckSquare, List, Calendar, Smartphone, Hash, CreditCard, Image, AlertCircle, User, Plus, Check, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { PROFILE_CORE_PRESETS, PROFILE_ADDON_PRESETS } from '../../../data/profileBuilderPresets';
import { ProfileConfig, ProfileBuilderActions } from '../../../types/profileConfig';

interface TemplateToolboxProps {
    actions: ProfileBuilderActions;
    selectedItem: { type: 'section' | 'field'; id: string; sectionId?: string } | null;
    config: ProfileConfig;
}

const TemplateToolbox: React.FC<TemplateToolboxProps> = ({ actions, selectedItem, config }) => {
    // Helper to check if a specific field ID exists throughout the entire config
    const isFieldAdded = (fieldId: string) => {
        if (!config || !config.sections) return false;
        return config.sections.some(section =>
            section.fields.some(field => field.id === fieldId)
        );
    };

    const TOOL_CATEGORIES = useMemo(() => [
        {
            title: '기본 정보 (시스템)',
            description: '자동으로 기본 정보 섹션에 추가됩니다.',
            items: [
                { id: 'name', targetSectionId: 'section_basic', type: 'short_text', label: '이름 (본명)', icon: <User size={18} />, isSystem: true, readOnly: true, isLabelLocked: true, adminProps: { cardLabel: '이름', showInCard: true } },
                { id: 'nickname', targetSectionId: 'section_nickname', type: 'short_text', label: '닉네임', icon: <User size={18} />, isSystem: true, isLabelLocked: true, adminProps: { cardLabel: '닉네임', showInCard: true } },
                { id: 'gender', targetSectionId: 'section_basic', type: 'radio', label: '성별', icon: <CheckSquare size={18} />, isSystem: true, readOnly: true, isLabelLocked: true, adminProps: { cardLabel: '성별', showInCard: true } },
                { id: 'birthDate', targetSectionId: 'section_basic', type: 'birth_date', label: '생년월일', icon: <Calendar size={18} />, isSystem: true, readOnly: true, isLabelLocked: true, adminProps: { cardLabel: '생년월일', showInCard: true } },
                { id: 'age', targetSectionId: 'section_basic', type: 'short_text', label: '나이', icon: <Calendar size={18} />, isSystem: true, readOnly: true, isLabelLocked: true, adminProps: { cardLabel: '나이', showInCard: true } },
                { id: 'phone', targetSectionId: 'section_basic', type: 'phone', label: '전화번호', icon: <Smartphone size={18} />, isSystem: true, readOnly: true, isLabelLocked: true, adminProps: { cardLabel: '연락처', showInCard: true } },
            ]
        },
        {
            title: '필수 추천 (Core)',
            description: '매칭에 중요한 핵심 정보입니다.',
            items: PROFILE_CORE_PRESETS.map(p => ({ ...p, targetSectionId: 'section_basic' }))
        },
        {
            title: '상세 옵션 (Add-on)',
            description: '라이프스타일 및 소개 정보입니다.',
            items: PROFILE_ADDON_PRESETS.map(p => ({ ...p, targetSectionId: 'section_lifestyle' }))
        },
        {
            title: '커스텀 도구',
            description: '현재 선택된 섹션에 자유롭게 추가합니다.',
            items: [
                { id: 'new', type: 'short_text', label: '단답형 텍스트', icon: <Type size={18} />, placeholder: '질문을 입력하세요' },
                { id: 'new', type: 'long_text', label: '장문형 텍스트', icon: <AlignLeft size={18} />, placeholder: '내용을 입력해주세요' },
                { id: 'new', type: 'single_choice', label: '단일 선택', icon: <CheckSquare size={18} />, options: [{ label: '옵션1', value: '1' }, { label: '옵션2', value: '2' }] },
                { id: 'new', type: 'multiple_choice', label: '다중 선택', icon: <List size={18} />, options: [{ label: '옵션1', value: '1' }, { label: '옵션2', value: '2' }] },
                { id: 'new', type: 'tags', label: '태그 입력', icon: <Hash size={18} /> },
                { id: 'new', type: 'image_upload', label: '이미지 업로드', icon: <Image size={18} /> },
                { id: 'new', type: 'file_upload', label: '파일 첨부', icon: <Paperclip size={18} /> },
                { id: 'new', type: 'notice', label: '안내 문구', icon: <AlertCircle size={18} />, description: '단순 텍스트 설명입니다.' },
                { id: 'new', type: 'payment_info', label: '입금 안내', icon: <CreditCard size={18} /> },
            ]
        }
    ], []);

    const handleAdd = (tool: any) => {
        let targetSectionId: string | null = null;

        // 1. Check Smart Target
        if (tool.targetSectionId) {
            // Verify if target section actually exists
            const targetSection = config.sections.find(s => s.id.includes(tool.targetSectionId));

            if (targetSection) {
                targetSectionId = targetSection.id;
            } else if (tool.targetSectionId === 'section_nickname') {
                // SPECIAL LOGIC: Auto-create section_nickname if missing
                const newSectionId = 'section_nickname';

                actions.addSection({
                    id: newSectionId,
                    title: '닉네임 설정',
                    description: '프로필 카드에 표시될 닉네임을 입력해주세요.',
                    isSystem: true,
                    atIndex: 0 // Insert at top
                });

                targetSectionId = newSectionId;
            }
        }

        // 2. Fallback to Selected Item
        if (!targetSectionId) {
            if (selectedItem?.type === 'section') {
                targetSectionId = selectedItem.id;
            } else if (selectedItem?.sectionId) {
                // If a field is selected, add to its parent section
                targetSectionId = selectedItem.sectionId;
            }
        }

        // 3. Validation
        if (!targetSectionId) {
            toast.warning('필드를 추가할 섹션을 선택해주세요.\n(기본 정보나 추천 항목은 자동으로 섹션을 찾을 수 있습니다)');
            return;
        }

        // Sanitize tool data (remove icon and UI helpers) before adding to state
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { icon, targetSectionId: _, ...fieldData } = tool;

        // Prevent duplicate addition
        const alreadyExists = config.sections.find(s => s.id === targetSectionId)?.fields.some(f => f.id === fieldData.id);
        if (!alreadyExists) {
            actions.addField(targetSectionId, fieldData);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    목록에서 항목을 클릭하면<br />
                    적절한 섹션에 자동으로 추가됩니다.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="p-4 space-y-6">
                    {TOOL_CATEGORIES.map((category, catIdx) => (
                        <div key={catIdx}>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className={`text-xs font-bold uppercase tracking-wider ${category.title.includes('(Core)') ? 'text-indigo-600' : 'text-slate-500'}`}>
                                    {category.title}
                                </h4>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {category.items.map((tool, idx) => {
                                    const isAdded = (tool.id || '') !== 'new' && isFieldAdded(tool.id || '');
                                    const isCustom = category.title.includes('커스텀');

                                    if (isCustom) {
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleAdd(tool)}
                                                className="col-span-2 w-full flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all text-left group"
                                            >
                                                <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">
                                                    {tool.icon}
                                                </div>
                                                <span className="text-sm font-medium">{tool.label}</span>
                                                <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-indigo-500 transition-opacity" />
                                            </button>
                                        );
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => !isAdded && handleAdd(tool)}
                                            disabled={isAdded}
                                            className={`relative flex items-center gap-2 p-2.5 rounded-lg border transition-all text-left group
                                                ${isAdded
                                                    ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                                                    : 'bg-white border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md text-slate-600'
                                                }
                                            `}
                                        >
                                            <div className={`shrink-0 transition-colors ${isAdded ? 'text-slate-400' : 'text-slate-400 group-hover:text-indigo-600'}`}>
                                                {tool.icon}
                                            </div>
                                            <span className="text-xs font-medium truncate">{tool.label}</span>

                                            {isAdded && (
                                                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400">
                                                    <Check size={14} strokeWidth={3} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10px] text-center text-slate-400">
                Tip: 커스텀 도구는 선택된 섹션에 추가됩니다.
            </div>
        </div>
    );
};

export default TemplateToolbox;
