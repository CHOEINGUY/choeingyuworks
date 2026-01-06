import React from 'react';
import { Moon, Sun, Check, Type, Square, Palette, GripHorizontal } from 'lucide-react';
import { FORM_THEME_COLORS } from '../../../constants/formThemes';
import { FormSettings } from '../../../types/formConfig';
import { PanelSection, SubLabel, StyleCard, ListOption, CompactToggle } from '../common/design/DesignComponents';

interface DesignPanelProps {
    formSettings: FormSettings;
    setFormSettings: (settings: FormSettings) => void;
}

// ----------------------------------------------------------------------
// Reusable Sub-components
// ----------------------------------------------------------------------




// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

const DesignPanel: React.FC<DesignPanelProps> = ({ formSettings, setFormSettings }) => {
    const [subTab, setSubTab] = React.useState<'style' | 'color'>('style');

    return (
        <div className="h-full bg-white flex flex-col">
            {/* Header / Intro */}
            <div className="flex-none p-5 pb-0 bg-white z-10">
                <h3 className="text-sm font-bold text-slate-800 mb-1">디자인 설정</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    폼의 디자인과 색상을 설정합니다.
                </p>

                {/* Sub Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
                    <button
                        onClick={() => setSubTab('style')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${subTab === 'style'
                            ? 'bg-white text-slate-800 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        스타일
                    </button>
                    <button
                        onClick={() => setSubTab('color')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${subTab === 'color'
                            ? 'bg-white text-slate-800 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        색상
                    </button>
                </div>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pb-20">

                {subTab === 'style' && (
                    <>
                        {/* 1. Font Family */}
                        <PanelSection title="폰트 스타일" icon={Type} className="pb-6 border-b border-slate-100 mb-6">
                            <div className="space-y-2">
                                {[
                                    { id: 'PRETENDARD', label: '프리텐다드', sub: '깔끔하고 현대적인 고딕', class: 'font-sans' },
                                    { id: 'NOTO_SERIF', label: '노토 세리프', sub: '신뢰감을 주는 명조', class: 'font-serif' },
                                    { id: 'NANUM_SQUARE', label: '나눔스퀘어', sub: '친근하고 둥근 느낌', class: 'font-mono' },
                                ].map((font) => (
                                    <ListOption
                                        key={font.id}
                                        active={(formSettings.fontFamily || 'PRETENDARD') === font.id}
                                        onClick={() => setFormSettings({ ...formSettings, fontFamily: font.id as any })}
                                        label={font.label}
                                        subLabel={font.sub}
                                    />
                                ))}
                            </div>
                        </PanelSection>

                        {/* 2. Global Button Style */}
                        <PanelSection title="버튼 스타일" icon={Square} className="mb-6">
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'rounded', label: '라운드', radius: 'rounded-xl' },
                                    { id: 'square', label: '스퀘어', radius: 'rounded-none' },
                                    { id: 'pill', label: '필(Pill)', radius: 'rounded-full' },
                                ].map((style) => (
                                    <StyleCard
                                        key={style.id}
                                        active={(formSettings.buttonStyle || 'rounded') === style.id}
                                        onClick={() => setFormSettings({ ...formSettings, buttonStyle: style.id as any })}
                                        className="p-4 gap-3"
                                    >
                                        <div className={`w-8 h-8 bg-current opacity-20 ${style.radius}`} />
                                        <span className="text-xs font-medium">{style.label}</span>
                                    </StyleCard>
                                ))}
                            </div>
                        </PanelSection>

                        {/* 3. Layout Density - REMOVED per user request (not suitable for immersive form) */}



                        {/* 4. Choice Options Detail Styling */}
                        <PanelSection title="객관식 선택지 스타일" icon={GripHorizontal}>
                            <div className="space-y-5">
                                {/* Shape */}
                                <div>
                                    <SubLabel>버튼 모양</SubLabel>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'rounded', label: '라운드', radius: 'rounded-md' },
                                            { id: 'square', label: '스퀘어', radius: 'rounded-none' },
                                            { id: 'pill', label: '필', radius: 'rounded-full' },
                                        ].map((style) => (
                                            <StyleCard
                                                key={style.id}
                                                active={(formSettings.optionStyle || formSettings.buttonStyle || 'rounded') === style.id}
                                                onClick={() => setFormSettings({ ...formSettings, optionStyle: style.id as any })}
                                                className="py-3 px-2 gap-2"
                                            >
                                                <div className={`w-5 h-5 border-2 border-current opacity-40 ${style.radius}`} />
                                                <span className="text-[10px] font-medium">{style.label}</span>
                                            </StyleCard>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Align */}
                                    <div>
                                        <SubLabel>텍스트 정렬</SubLabel>
                                        <div className="flex bg-slate-100 p-1 rounded-lg">
                                            <CompactToggle
                                                active={(formSettings.optionAlign || 'left') === 'left'}
                                                onClick={() => setFormSettings({ ...formSettings, optionAlign: 'left' })}
                                                label="왼쪽"
                                            />
                                            <CompactToggle
                                                active={formSettings.optionAlign === 'center'}
                                                onClick={() => setFormSettings({ ...formSettings, optionAlign: 'center' })}
                                                label="중앙"
                                            />
                                        </div>
                                    </div>

                                    {/* Size */}
                                    <div>
                                        <SubLabel>텍스트 크기</SubLabel>
                                        <div className="flex bg-slate-100 p-1 rounded-lg">
                                            {[{ id: 'sm', label: '작게' }, { id: 'md', label: '보통' }, { id: 'lg', label: '크게' }].map(s => (
                                                <CompactToggle
                                                    key={s.id}
                                                    active={(formSettings.optionSize || 'md') === s.id}
                                                    onClick={() => setFormSettings({ ...formSettings, optionSize: s.id as any })}
                                                    label={s.label}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </PanelSection>
                    </>
                )}

                {subTab === 'color' && (
                    <PanelSection title="테마 및 컬러" icon={Palette}>
                        <div className="space-y-4">
                            {/* Mode */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setFormSettings({ ...formSettings, theme: 'light' })}
                                    className={`flex items-center justify-center p-3 rounded-xl border transition-all gap-2
                                    ${(!formSettings.theme || formSettings.theme === 'light')
                                            ? 'border-indigo-200 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    <Sun size={18} />
                                    <span className="text-sm font-medium">라이트</span>
                                </button>
                                <button
                                    onClick={() => setFormSettings({ ...formSettings, theme: 'dark' })}
                                    className={`flex items-center justify-center p-3 rounded-xl border transition-all gap-2
                                    ${formSettings.theme === 'dark'
                                            ? 'border-slate-700 bg-slate-800 text-white ring-1 ring-slate-700'
                                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    <Moon size={18} />
                                    <span className="text-sm font-medium">다크</span>
                                </button>
                            </div>

                            {/* Colors */}
                            <div>
                                <SubLabel>포인트 컬러</SubLabel>
                                <div className="grid grid-cols-4 gap-2">
                                    {FORM_THEME_COLORS.map((color) => {
                                        const isSelected = (formSettings.themeColor || 'indigo') === color.id;
                                        return (
                                            <button
                                                key={color.id}
                                                onClick={() => setFormSettings({ ...formSettings, themeColor: color.id })}
                                                className={`relative group flex flex-col items-center gap-2 p-2 rounded-xl transition-all
                                             ${isSelected ? 'bg-slate-100 ring-1 ring-slate-200' : 'hover:bg-slate-50'}`}
                                                title={color.label}
                                            >
                                                <div className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center transition-transform ${color.bg} ${isSelected ? 'scale-110' : 'scale-100'}`}>
                                                    {isSelected && <Check size={14} className={color.check_color || 'text-white'} strokeWidth={3} />}
                                                </div>
                                                <span className={`text-[10px] font-medium leading-none ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                                                    {color.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </PanelSection>
                )}

            </div>
        </div>
    );
};

export default DesignPanel;
