import React from 'react';
import { SYSTEM_FIELDS } from '../../../constants/systemFields';
import { MANDATORY_PRESETS, CORE_PRESETS, ADDON_PRESETS, BASIC_TOOLS } from '../../../data/formPresets';
import { Plus, Check } from 'lucide-react';
import { Question, PresetItem } from '../../../types/formConfig';

interface TemplateToolbarProps {
    onAdd: (templateOrArray: PresetItem | PresetItem[]) => void;
    currentQuestions: Question[];
    pricingMode?: 'fixed' | 'option';
    formId?: string;
}

const TemplateToolbar: React.FC<TemplateToolbarProps> = ({ onAdd, currentQuestions = [], pricingMode, formId }) => {
    // Helper to check if a system field is already in the form
    const isFieldUsed = (id: string) => currentQuestions.some(q => q.id === id);

    const renderPresetButtons = (presets: PresetItem[]) => (
        <div className="grid grid-cols-2 gap-2">
            {presets.map((preset, idx) => {
                // Check usage
                const used = preset.type === 'group' && preset.fields
                    ? preset.fields.every(f => isFieldUsed(f.id))
                    : (preset.id ? isFieldUsed(preset.id) : false);

                // 티켓 문항인 경우 예외 처리: 가격 설정이 'fixed'이면 사용 불가
                const isTicketDisabled = preset.id === SYSTEM_FIELDS.TICKET_OPTION && pricingMode === 'fixed';
                const isDisabled = used || isTicketDisabled;

                return (
                    <button
                        key={idx}
                        onClick={() => {
                            if (isDisabled) return;
                            let questionToAdd: any; // Using any to handle simple vs group adding seamlessly

                            if (preset.type === 'group' && preset.fields) {
                                // Group logic... (usually not used for Schedule)
                                onAdd(preset.fields.map(field => ({
                                    ...field,
                                    isLocked: field.isLocked ?? true,
                                    // Ensure required properties for Question
                                    title: field.title || '',
                                    type: field.type || 'short_text',
                                })));
                                return;
                            } else {
                                questionToAdd = { ...preset, isLocked: preset.isLocked };
                            }

                            // [NEW] Inject Default Options for Match Mode Schedule
                            if (questionToAdd.id === SYSTEM_FIELDS.SCHEDULE && formId === 'match') {
                                questionToAdd = {
                                    ...questionToAdd,
                                    title: "선호하는 미팅 일정을 알려주세요",
                                    description: "매니저가 해당 시간대를 우선적으로 조율해드립니다.",
                                    options: [
                                        { label: "자유롭게 가능 (협의)", value: "anytime" },
                                        { label: "평일 저녁", value: "weekday_evening" },
                                        { label: "주말 오후 (12시 ~ 6시)", value: "weekend_afternoon" },
                                        { label: "주말 저녁 (6시 이후)", value: "weekend_evening" }
                                    ]
                                };
                            }

                            onAdd(questionToAdd);
                        }}
                        disabled={isDisabled}
                        className={`relative flex items-center gap-2 p-2.5 rounded-lg border transition-all text-left group
                            ${isDisabled
                                ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                                : 'bg-white border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md text-slate-600'}`}
                    >
                        <div className={`shrink-0 transition-colors ${isDisabled ? 'text-slate-400' : 'text-slate-400 group-hover:text-indigo-600'}`}>
                            {preset.icon}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-medium truncate">{preset.label}</span>
                            {isTicketDisabled && (
                                <span className="text-[10px] text-red-500 font-bold leading-none mt-0.5">고정 가격 사용 중</span>
                            )}
                        </div>
                        {used && (
                            <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                <Check size={18} className="text-slate-400" />
                            </div>
                        )}
                        {/* 티켓이 고정 가격 때문에 비활성화된 경우 자물쇠 아이콘 등 표시? (Optional, Text label seems enough) */}
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className="h-full">
            <div className="p-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    아래 목록에서 원하는 항목을 클릭하면<br />
                    왼쪽 화면에 바로 추가됩니다.
                </p>
            </div>

            <div className="p-4 space-y-6">

                {/* 1. 필수 정보 (Mandatory) */}
                <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        기본 정보 (시스템)
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {MANDATORY_PRESETS.map((preset, idx) => {
                            const used = preset.id ? isFieldUsed(preset.id) : false;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => !used && onAdd({ ...preset, isLocked: preset.isLocked })}
                                    disabled={used}
                                    className={`relative flex items-center gap-2 p-2.5 rounded-lg border transition-all text-left group
                                        ${used
                                            ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                                            : 'bg-white border-red-100 hover:border-red-300 hover:bg-red-50/30 hover:shadow-sm text-slate-700'}`}
                                >
                                    <div className={`shrink-0 transition-colors ${used ? 'text-slate-400' : 'text-red-400 group-hover:text-red-500'}`}>
                                        {preset.icon}
                                    </div>
                                    <span className="text-xs font-bold">{preset.label}</span>

                                    {/* Status Badge */}
                                    {used ? (
                                        <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                            <Check size={18} className="text-slate-400" />
                                        </div>
                                    ) : (
                                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse shadow-red-200"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 2. 필수 추천 (Core) */}
                <div>
                    <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                        필수 추천 (Core)
                    </div>
                    {renderPresetButtons(CORE_PRESETS)}
                </div>

                {/* 3. 상세 옵션 (Add-on) */}
                <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        상세 옵션 (Add-on)
                    </div>
                    {renderPresetButtons(ADDON_PRESETS)}
                </div>

                {/* 4. 기본 도구 섹션 */}
                <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">기본 도구 (커스텀)</div>
                    <div className="grid grid-cols-2 gap-2">
                        {BASIC_TOOLS.map((tool, idx) => (
                            <button
                                key={idx}
                                onClick={() => onAdd(tool as any)}
                                className="col-span-2 w-full flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-all text-left group"
                            >
                                <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">{tool.icon}</div>
                                <span className="text-sm font-medium">{tool.label}</span>
                                <Plus size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-indigo-500 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateToolbar;
