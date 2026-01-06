import React, { useState } from 'react';
import { DndContext, closestCorners, DragEndEvent, DragStartEvent, useSensor, useSensors, PointerSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import SectionList, { FieldItem, SectionItem } from './SectionList';
import TemplateToolbox from './TemplateToolbox';

import ConfirmDialog from '../../common/ConfirmDialog';
import ProfileSettingsPanel from './ProfileSettingsPanel';
import { Save, List, Palette, Eye, Grid, RotateCcw, Loader2, ChevronDown, Check } from 'lucide-react';
import { useProfileBuilderState } from '../../../hooks/useProfileBuilderState';
import { useProfileConfigs } from '../../../hooks/useProfileConfigs';
import { toast } from 'sonner';

import { DEFAULT_PROFILE_CONFIG } from '../../../data/defaultProfileConfig';
import MobilePreviewFrame from '../common/MobilePreviewFrame';
import FormCoverEditor from '../form/FormCoverEditor'; // [NEW]

const ProfileBuilder: React.FC = () => {
    const { config, selectedItem, setSelectedItem, actions } = useProfileBuilderState();
    const { saveProfileConfig, getProfileConfig, loading: saving } = useProfileConfigs();
    // const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null);
    const [isDeleteSectionConfirmOpen, setIsDeleteSectionConfirmOpen] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null); // [NEW] For DragOverlay

    // [NEW] Config Selector State
    const [activeConfigId, setActiveConfigId] = useState<'rotation' | 'premium'>('rotation');
    const [isConfigDropdownOpen, setIsConfigDropdownOpen] = useState(false);
    const [isCoverEditorOpen, setIsCoverEditorOpen] = useState(false); // [NEW] Cover Editor State

    const handleReset = () => {
        setIsResetConfirmOpen(true);
    };

    const confirmReset = () => {
        const resetConfig = {
            ...DEFAULT_PROFILE_CONFIG,
            title: activeConfigId === 'premium' ? '프리미엄 프로필' : '로테이션 프로필',
            updatedAt: new Date().toISOString()
        };
        actions.updateConfig(resetConfig);
        toast.success('설정이 초기 상태로 복구되었습니다.');
        setIsResetConfirmOpen(false);
    };

    // Load initial config (Re-runs when activeConfigId changes)
    React.useEffect(() => {
        const loadConfig = async () => {
            setIsLoading(true);
            try {
                const savedConfig = await getProfileConfig(activeConfigId);

                if (savedConfig) {
                    const configToLoad = { ...savedConfig };
                    delete configToLoad.updatedAt;
                    actions.updateConfig(configToLoad);
                } else {
                    const newConfig = {
                        ...DEFAULT_PROFILE_CONFIG,
                        title: activeConfigId === 'premium' ? '프리미엄 프로필' : '로테이션 프로필',
                        updatedAt: new Date().toISOString()
                    };
                    actions.updateConfig(newConfig);
                }
            } catch (error) {
                console.error("Failed to load profile config:", error);
                toast.error('설정을 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };
        loadConfig();
    }, [actions.updateConfig, getProfileConfig, activeConfigId]);

    const handleSave = async () => {
        const success = await saveProfileConfig(activeConfigId, config);
        if (success) {
            toast.success('프로필 설정이 저장되었습니다.');
        } else {
            toast.error('저장에 실패했습니다.');
        }
    };

    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
    const [activeRightPanelTab, setActiveRightPanelTab] = useState<'tools' | 'design'>('tools');
    const [previewKey, setPreviewKey] = useState(0);

    // Live Preview Sync
    React.useEffect(() => {
        if (activeTab === 'preview') {
            localStorage.setItem('preview_profile_config', JSON.stringify(config));
            setPreviewKey(prev => prev + 1);
            setActiveRightPanelTab('design');
        }
    }, [activeTab, config]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) return;

        // Check if we are dragging a section
        const activeInstruction = config.sections.find((s: any) => s.id === active.id);
        if (activeInstruction) {
            actions.reorderSections(active.id as string, over.id as string);
            return;
        }

        // Check if we are dragging a field
        const sourceSection = config.sections.find((s: any) => s.fields.some((f: any) => f.id === active.id));

        // Find target section
        let targetSection = config.sections.find((s: any) => s.fields.some((f: any) => f.id === over.id));

        // If 'over' is a section ID (dropping into empty section or on header)
        if (!targetSection) {
            targetSection = config.sections.find((s: any) => s.id === over.id);
        }

        if (sourceSection && targetSection) {
            if (sourceSection.id === targetSection.id) {
                // Reordering within the same section
                const isOverField = sourceSection.fields.some((f: any) => f.id === over.id);
                if (isOverField) {
                    actions.reorderFields(sourceSection.id, active.id as string, over.id as string);
                }
            } else {
                // Moving to different section
                const overFieldId = targetSection.fields.some((f: any) => f.id === over.id) ? over.id : undefined;
                actions.moveFieldToSection(sourceSection.id, targetSection.id, active.id as string, overFieldId as string);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    <span className="text-slate-500 font-medium">설정을 불러오는 중입니다...</span>
                </div>
            </div>
        );
    }

    const handleDeleteSection = (sectionId: string) => {
        setDeletingSectionId(sectionId);
        setIsDeleteSectionConfirmOpen(true);
    };

    const confirmDeleteSection = () => {
        if (deletingSectionId) {
            actions.deleteSection(deletingSectionId);
            toast.info('섹션이 삭제되었습니다.');
        }
        setIsDeleteSectionConfirmOpen(false);
        setDeletingSectionId(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
                {/* Header (Full Width) */}
                <div className="h-14 px-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-lg">프로필 빌더</span>
                            <div className="h-4 w-px bg-slate-300 mx-2"></div>
                        </div>

                        {/* Config Selector Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsConfigDropdownOpen(!isConfigDropdownOpen)}
                                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-800 font-bold text-lg group"
                            >
                                <span>{activeConfigId === 'rotation' ? '로테이션 프로필' : '프리미엄 프로필'}</span>
                                <ChevronDown size={18} className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isConfigDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isConfigDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsConfigDropdownOpen(false)} />
                                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                        <button
                                            onClick={() => { setActiveConfigId('rotation'); setIsConfigDropdownOpen(false); }}
                                            className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors ${activeConfigId === 'rotation' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'}`}
                                        >
                                            <div className="flex flex-col">
                                                <span>로테이션 프로필</span>
                                                <span className="text-xs text-slate-400 font-normal">로테이션 매칭용 (users)</span>
                                            </div>
                                            {activeConfigId === 'rotation' && <Check size={16} />}
                                        </button>
                                        <div className="h-px bg-slate-100 mx-2" />
                                        <button
                                            onClick={() => { setActiveConfigId('premium'); setIsConfigDropdownOpen(false); }}
                                            className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors ${activeConfigId === 'premium' ? 'text-pink-600 font-bold bg-pink-50/50' : 'text-slate-700'}`}
                                        >
                                            <div className="flex flex-col">
                                                <span>프리미엄 프로필</span>
                                                <span className="text-xs text-slate-400 font-normal">1:1 매칭용 (premium_pool)</span>
                                            </div>
                                            {activeConfigId === 'premium' && <Check size={16} />}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Integrated Tabs */}
                        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg mr-2">
                            <button
                                onClick={() => setActiveTab('editor')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'editor'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                    }`}
                            >
                                <List size={14} />
                                에디터
                            </button>
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1.5 ${activeTab === 'preview'
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                    }`}
                            >
                                <Eye size={14} />
                                미리보기
                            </button>
                        </nav>

                        <div className="h-6 w-px bg-slate-200 mx-1"></div>

                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors font-bold text-sm"
                            title="초기화 (필수 항목만 남기기)"
                        >
                            <RotateCcw size={18} />
                            <span>초기화</span>
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-bold shadow-sm active:scale-95 text-sm disabled:opacity-50"
                        >
                            <Save size={18} />
                            <span>{saving ? '저장 중...' : '저장'}</span>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex min-h-0">
                    {/* Left Panel: Canvas / Structure OR Preview */}
                    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                        {activeTab === 'editor' ? (
                            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 scrollbar-thin">
                                <div className="mx-auto max-w-3xl transition-all duration-300">
                                    {/* Cover Editor Block */}
                                    <FormCoverEditor
                                        formSettings={config as any} // Cast because ProfileConfig has extra fields but shares overlaps
                                        setFormSettings={(settings) => actions.updateConfig(settings)}
                                        isOpen={isCoverEditorOpen}
                                        onOpen={() => setIsCoverEditorOpen(true)}
                                        onClose={() => setIsCoverEditorOpen(false)}
                                        onActivate={() => {
                                            setSelectedItem(null); // Deselect items when cover is active
                                        }}
                                    />

                                    <SectionList
                                        sections={config.sections}
                                        actions={{
                                            ...actions,
                                            deleteSection: handleDeleteSection
                                        }}
                                        selectedItem={selectedItem}
                                        onSelect={setSelectedItem}
                                    />

                                    <button
                                        onClick={() => actions.addSection()}
                                        className="w-full py-4 mt-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-bold hover:border-indigo-400 hover:text-indigo-500 hover:bg-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <span>+ 새로운 섹션 추가</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Preview Mode */
                            <MobilePreviewFrame>
                                <iframe
                                    src={`/profile/${activeConfigId}?preview=true`}
                                    className="w-full h-full border-none"
                                    title="Profile Preview"
                                    key={previewKey}
                                />
                            </MobilePreviewFrame>
                        )}
                    </div>

                    {/* Right Panel: Tabs & Content (Always Visible) */}
                    <div className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-xl z-10">
                        {/* Right Panel Tabs */}
                        <div className="flex border-b border-slate-200">
                            <button
                                onClick={() => setActiveRightPanelTab('tools')}
                                disabled={activeTab === 'preview'}
                                className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 flex items-center justify-center gap-2 ${activeRightPanelTab === 'tools'
                                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10'
                                    : activeTab === 'preview'
                                        ? 'border-transparent text-slate-300 cursor-not-allowed'
                                        : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <Grid size={16} />
                                도구 상자
                            </button>
                            <button
                                onClick={() => setActiveRightPanelTab('design')}
                                className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 flex items-center justify-center gap-2 ${activeRightPanelTab === 'design'
                                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10'
                                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <Palette size={16} />
                                디자인
                            </button>
                        </div>

                        {/* Right Panel Content */}
                        <div className="flex-1 overflow-hidden relative scrollbar-thin">
                            {activeRightPanelTab === 'tools' ? (
                                <TemplateToolbox
                                    actions={actions}
                                    selectedItem={selectedItem}
                                    config={config}
                                />
                            ) : (
                                <ProfileSettingsPanel
                                    config={config}
                                    actions={actions}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* [NEW] Drag Overlay for Smooth Visuals */}
            <DragOverlay
                dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: '0.4',
                            },
                        },
                    }),
                }}
            >
                {activeId ? (
                    (() => {
                        // 1. Try finding as section
                        const section = config.sections.find((s: any) => s.id === activeId);
                        if (section) {
                            return (
                                <SectionItem
                                    section={section}
                                    selectedItem={null}
                                    onClick={() => { }}
                                    onDelete={() => { }}
                                    actions={actions}
                                    style={{ cursor: 'grabbing', opacity: 0.9, transform: 'scale(1.02)' }}
                                />
                            );
                        }

                        // 2. Try finding as field
                        const fieldSection = config.sections.find((s: any) => s.fields.some((f: any) => f.id === activeId));
                        const field = fieldSection?.fields.find((f: any) => f.id === activeId);

                        if (field) {
                            return (
                                <div className="p-4 bg-transparent">
                                    <FieldItem
                                        field={field}
                                        isSelected={false} // Minimized view
                                        onClick={() => { }}
                                        onClose={() => { }}
                                        onDelete={() => { }}
                                        onUpdate={() => { }}
                                        style={{ cursor: 'grabbing', opacity: 0.9, transform: 'scale(1.02)' }}
                                    />
                                </div>
                            );
                        }

                        return null;
                    })()
                ) : null}
            </DragOverlay>

            <ConfirmDialog
                isOpen={isResetConfirmOpen}
                title="설정 초기화"
                message={`모든 커스텀 항목이 삭제되고 필수 정보(시스템)만 남습니다.\n정말 초기화하시겠습니까?`}
                confirmText="초기화"
                isDestructive={true}
                onConfirm={confirmReset}
                onCancel={() => setIsResetConfirmOpen(false)}
            />
            <ConfirmDialog
                isOpen={isDeleteSectionConfirmOpen}
                title="섹션 삭제"
                message={`섹션을 삭제하시겠습니까?\n포함된 모든 필드가 영구적으로 삭제됩니다.`}
                confirmText="삭제"
                isDestructive={true}
                onConfirm={confirmDeleteSection}
                onCancel={() => setIsDeleteSectionConfirmOpen(false)}
            />
        </DndContext>
    );
};

export default ProfileBuilder;
