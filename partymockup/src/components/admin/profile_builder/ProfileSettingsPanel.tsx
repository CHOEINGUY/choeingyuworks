import React, { useState } from 'react';
import { Moon, Sun, Palette, Check, Type, Square, GripHorizontal } from 'lucide-react';
import { ProfileConfig, ProfileBuilderActions } from '../../../types/profileConfig';
import { PanelSection, SubLabel, StyleCard, ListOption, CompactToggle } from '../common/design/DesignComponents';



// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

interface ProfileSettingsPanelProps {
    config: ProfileConfig;
    actions: ProfileBuilderActions;
}

const ProfileSettingsPanel: React.FC<ProfileSettingsPanelProps> = ({ config, actions }) => {
    const [subTab, setSubTab] = useState<'style' | 'color'>('style');

    // Use config state for persistence
    const design = config.design || {};
    const themeMode = design.themeMode || 'light';
    const themeColor = design.themeColor || 'indigo';

    const updateDesign = (key: string, value: string) => {
        actions.updateConfig({
            design: {
                ...design,
                [key]: value
            }
        });
    };

    const COLORS = [
        { id: 'indigo', bg: 'bg-indigo-500', ring: 'ring-indigo-500', label: '인디고' },
        { id: 'rose', bg: 'bg-rose-500', ring: 'ring-rose-500', label: '로즈' },
        { id: 'blue', bg: 'bg-blue-500', ring: 'ring-blue-500', label: '블루' },
        { id: 'emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-500', label: '에메랄드' },
        { id: 'violet', bg: 'bg-violet-500', ring: 'ring-violet-500', label: '바이올렛' },
        { id: 'orange', bg: 'bg-orange-500', ring: 'ring-orange-500', label: '오렌지' },
        { id: 'sky', bg: 'bg-sky-500', ring: 'ring-sky-500', label: '스카이' },
        { id: 'slate', bg: 'bg-slate-500', ring: 'ring-slate-500', label: '슬레이트' },
        { id: 'white', bg: 'bg-white', ring: 'ring-slate-200', label: '화이트' },
        { id: 'black', bg: 'bg-slate-900', ring: 'ring-slate-900', label: '블랙' },
    ];

    return (
        <div className="h-full bg-white flex flex-col">
            {/* Header / Intro */}
            <div className="flex-none p-5 pb-0 bg-white z-10">
                <h3 className="text-sm font-bold text-slate-800 mb-1">디자인 설정</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    프로필 카드의 색상과 테마를<br />자유롭게 꾸며보세요.
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
                                    { id: 'PRETENDARD', label: '프리텐다드', sub: '깔끔하고 현대적인 고딕' },
                                    { id: 'NOTO_SERIF', label: '노토 세리프', sub: '신뢰감을 주는 명조' },
                                    { id: 'NANUM_SQUARE', label: '나눔스퀘어', sub: '친근하고 둥근 느낌' },
                                ].map((font) => (
                                    <ListOption
                                        key={font.id}
                                        active={(design.fontFamily || 'PRETENDARD') === font.id}
                                        onClick={() => updateDesign('fontFamily', font.id)}
                                        label={font.label}
                                        subLabel={font.sub}
                                    />
                                ))}
                            </div>
                        </PanelSection>

                        {/* 2. Button Style */}
                        <PanelSection title="버튼 스타일" icon={Square} className="mb-6">
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'rounded', label: '라운드', radius: 'rounded-xl' },
                                    { id: 'square', label: '스퀘어', radius: 'rounded-none' },
                                    { id: 'pill', label: '필(Pill)', radius: 'rounded-full' },
                                ].map((style) => (
                                    <StyleCard
                                        key={style.id}
                                        active={(design.buttonStyle || 'rounded') === style.id}
                                        onClick={() => updateDesign('buttonStyle', style.id)}
                                        className="p-4 gap-3"
                                    >
                                        <div className={`w-8 h-8 bg-current opacity-20 ${style.radius}`} />
                                        <span className="text-xs font-medium">{style.label}</span>
                                    </StyleCard>
                                ))}
                            </div>
                        </PanelSection>

                        {/* 3. Option Style */}
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
                                                active={(design.optionStyle || design.buttonStyle || 'rounded') === style.id}
                                                onClick={() => updateDesign('optionStyle', style.id)}
                                                className="py-3 px-2 gap-2"
                                            >
                                                <div className={`w-5 h-5 border-2 border-current opacity-40 ${style.radius}`} />
                                                <span className="text-[10px] font-medium">{style.label}</span>
                                            </StyleCard>
                                        ))}
                                    </div>
                                </div>

                                {/* Align (New) */}
                                <div>
                                    <SubLabel>텍스트 정렬</SubLabel>
                                    <div className="flex bg-slate-100 p-1 rounded-lg">
                                        {[{ id: 'left', label: '왼쪽' }, { id: 'center', label: '중앙' }].map(t => (
                                            <CompactToggle
                                                key={t.id}
                                                active={(design.optionAlign || 'left') === t.id}
                                                onClick={() => updateDesign('optionAlign', t.id)}
                                                label={t.label}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Size (New) */}
                                <div>
                                    <SubLabel>텍스트 크기</SubLabel>
                                    <div className="flex bg-slate-100 p-1 rounded-lg">
                                        {[{ id: 'sm', label: '작게' }, { id: 'md', label: '보통' }, { id: 'lg', label: '크게' }].map(s => (
                                            <CompactToggle
                                                key={s.id}
                                                active={(design.optionSize || 'md') === s.id}
                                                onClick={() => updateDesign('optionSize', s.id)}
                                                label={s.label}
                                            />
                                        ))}
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
                                    onClick={() => updateDesign('themeMode', 'light')}
                                    className={`flex items-center justify-center p-3 rounded-xl border transition-all gap-2
                                    ${themeMode === 'light'
                                            ? 'border-indigo-200 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    <Sun size={18} />
                                    <span className="text-sm font-medium">라이트</span>
                                </button>
                                <button
                                    onClick={() => updateDesign('themeMode', 'dark')}
                                    className={`flex items-center justify-center p-3 rounded-xl border transition-all gap-2
                                    ${themeMode === 'dark'
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
                                    {COLORS.map((color) => {
                                        const isSelected = (themeColor || 'indigo') === color.id;
                                        return (
                                            <button
                                                key={color.id}
                                                onClick={() => updateDesign('themeColor', color.id)}
                                                className={`relative group flex flex-col items-center gap-2 p-2 rounded-xl transition-all
                                             ${isSelected ? 'bg-slate-100 ring-1 ring-slate-200' : 'hover:bg-slate-50'}`}
                                                title={color.label}
                                            >
                                                <div className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center transition-transform ${color.bg} ${isSelected ? 'scale-110' : 'scale-100'}`}>
                                                    {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
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

export default ProfileSettingsPanel;
