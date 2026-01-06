import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileSection from './ProfileSection';
import { DEFAULT_PROFILE_CONFIG } from '../../../data/defaultProfileConfig';
import { getThemeStyles } from '../../../constants/formThemes';
import { useProfileConfigs } from '../../../hooks/useProfileConfigs';
import { db } from '../../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import FullscreenLayout from '../../form/immersive/FullscreenLayout';
import FlowProgressBar from '../../form/immersive/FlowProgressBar';
import ProfileCover from './ProfileCover';
import ProfileCompletion from './ProfileCompletion';
import ImmersiveSectionViewer from './ImmersiveSectionViewer';

interface DynamicProfileFormProps {
    readonly?: boolean;
    targetUserId?: string;
    onClose?: () => void;
    configId?: string; // [NEW] Explicit config ID override
}

const DynamicProfileForm: React.FC<DynamicProfileFormProps> = ({ readonly = false, targetUserId, onClose, configId: propConfigId }) => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    // Priority: Prop > URL Param
    const userId = targetUserId || searchParams.get('userId');
    const isPreview = searchParams.get('preview') === 'true';

    // 1. Context Detection
    const isPremium = location.pathname.includes('/profile/premium') || propConfigId === 'premium';
    const configId = propConfigId || (isPremium ? 'premium' : 'rotation');
    const collectionName = isPremium ? 'premium_pool' : 'users';

    // 2. State
    const [config, setConfig] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(0); // For animation
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // [NEW] Flow Control State
    const [showCover, setShowCover] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);

    // Hooks
    const { getProfileConfig } = useProfileConfigs();

    // 3. Load Config & Data
    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            try {
                // A. Load Config
                // A. Load Config
                let loadedConfig = null;

                // [FIX] Priority: Preview (LocalStorage) > DB > Default
                if (isPreview) {
                    const savedConfig = localStorage.getItem('preview_profile_config');
                    if (savedConfig) {
                        try {
                            loadedConfig = JSON.parse(savedConfig);
                        } catch (e) {
                            console.error("Failed to parse preview config", e);
                        }
                    }
                }

                if (!loadedConfig) {
                    loadedConfig = await getProfileConfig(configId);
                }

                if (!loadedConfig) {
                    console.warn(`Config '${configId}' not found. Using default.`);
                    loadedConfig = DEFAULT_PROFILE_CONFIG;
                }
                setConfig(loadedConfig);

                // B. Load User Data
                if (userId && !isPreview) {
                    const userRef = doc(db, collectionName, userId);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const data = userSnap.data();
                        setFormData(data);

                        // [SNAPSHOT LOGIC] If ReadOnly (Viewer) AND Snapshot exists, use it!
                        if (readonly && data.profileSchemaSnapshot?.sections) {
                            console.log("📸 [Viewer] Using Saved Profile Snapshot");
                            setConfig((prev: any) => ({
                                ...prev, // Keep global settings (theme, etc)
                                sections: data.profileSchemaSnapshot.sections
                            }));
                        } else if (readonly) {
                            console.log("⚠️ [Viewer] No Snapshot found. Using Live Config (Backward Compatibility).");
                        }
                    } else {
                        // Smart lookup fallback (Premium)
                        if (isPremium) {
                            const basicUserRef = doc(db, 'users', userId);
                            const basicUserSnap = await getDoc(basicUserRef);
                            if (basicUserSnap.exists()) {
                                setFormData(basicUserSnap.data());
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to initialize form:", error);
                // Don't block UI on error, just log (or show toast)
            } finally {
                setIsLoading(false);
            }
        };

        if (isPreview) {
            // Priority to local storage logic if needed, but handled above
        }

        init();
    }, [configId, collectionName, userId, getProfileConfig, isPremium, isPreview, readonly]); // Added readonly dep

    // Animation Variants (Horizontal Slide)
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    // 4. Handlers
    const handleNext = async () => {
        if (showCover) {
            setDirection(1);
            setShowCover(false);
            return;
        }

        // Auto-save on each step (Partial Save) - User Data Only
        if (!readonly && userId && !isPreview) {
            const userRef = doc(db, collectionName, userId);
            await setDoc(userRef, {
                ...formData,
                updatedAt: new Date().toISOString()
            }, { merge: true });
        }

        if (currentStep < (config?.sections?.length || 0) - 1) {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
        } else {
            handleSave();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
        }
    };

    const updateField = (fieldId: string, value: any) => {
        setFormData((prev: any) => {
            const next = { ...prev };
            // 1. Top-level sync
            next[fieldId] = value;

            // 2. Answers nested sync (Legacy compatibility)
            if (!next.answers) next.answers = {};
            next.answers = { ...next.answers, [fieldId]: value };

            return next;
        });
    };

    const handleSave = async () => {
        if (!userId && !isPreview) {
            toast.error("유저 ID가 없습니다. 저장할 수 없습니다.");
            return;
        }

        if (isPreview) {
            toast.info("미리보기 모드입니다. 저장되지 않습니다.");
            return;
        }

        setIsSaving(true);
        try {
            const userRef = doc(db, collectionName, userId!);

            // [SNAPSHOT SAVE] Save the current schema structure!
            const snapshotData = {
                sections: config.sections.map((section: any) => ({
                    ...section,
                    // Ensure we capture everything, especially titles/descriptions
                    // We don't necessarily need to save 'fields' if we trust IDs,
                    // BUT for a true snapshot (immune to field deletion), saving fields is safer.
                    // The 'config' object already has the full tree.
                })),
                savedAt: new Date().toISOString(),
                configVersion: config.updatedAt || 'unknown'
            };

            const saveData = {
                ...formData,
                updatedAt: new Date().toISOString(),
                profileCompleted: true,
                profileSchemaSnapshot: snapshotData // 📸 HERE IS THE SNAPSHOT
            };

            await setDoc(userRef, saveData, { merge: true });

            setDirection(1);
            setIsCompleted(true);
        } catch (error) {
            console.error("Save failed:", error);
            toast.error("저장에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    // 5. Render
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    if (!config || !config.sections) return <div>설정을 불러올 수 없습니다.</div>;

    // Filter Sections (Skip section_basic in viewer mode since it's merged into cover)
    const effectiveSections = (config?.sections || []).filter((s: any) => {
        if (readonly && s.id === 'section_basic') return false;
        return true;
    });

    const activeSection = effectiveSections[currentStep];
    const totalSteps = effectiveSections.length;
    const isLastStep = currentStep === totalSteps - 1;

    // Determine Theme Styles
    const designConfig = config.design || {};
    const themeColor = designConfig.themeColor || config.theme?.color || (isPremium ? 'pink' : 'indigo');
    const themeMode = designConfig.themeMode || config.theme?.mode || 'light';

    const styles = getThemeStyles(themeColor, themeMode, designConfig);

    const themeStylesForBar = {
        bar_bg: themeMode === 'dark' ? 'bg-slate-800' : 'bg-slate-100',
        bar_fill: styles.solid_bg,
        text_accent: styles.text_accent,
        bg_app: styles.bg_app
    };

    const sectionWithData = {
        ...activeSection,
        // [NEW] Dual Title Logic
        title: (readonly && activeSection.viewerTitle) ? activeSection.viewerTitle : activeSection.title,
        description: (readonly && activeSection.viewerDescription) ? activeSection.viewerDescription : activeSection.description,
        fields: activeSection.fields.map((field: any) => ({
            ...field,
            value: formData[field.id] !== undefined ? formData[field.id] : (formData.answers?.[field.id]),
            readOnly: readonly || field.readOnly,
            onChange: (val: any) => updateField(field.id, val),
            onEnter: handleNext // [NEW] Allow fields to trigger next step
        }))
    };

    return (
        <FullscreenLayout bgColor={styles.bg_app} className={styles.font_family}>
            {/* 1. Main Unified Content Area */}
            <div className="flex-1 relative flex flex-col overflow-hidden">
                <AnimatePresence custom={direction} mode="popLayout">
                    {showCover ? (
                        <motion.div
                            key="cover"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                            className={`absolute inset-0 z-50 ${styles.bg_app}`}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(_, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x);
                                if (swipe < -swipeConfidenceThreshold) {
                                    handleNext();
                                }
                            }}
                        >
                            <ProfileCover
                                title={config.title || (isPremium ? "프리미엄 소개팅\n프로필 작성" : "로테이션 소개팅\n프로필 작성")}
                                subtitle={config.description || (isPremium
                                    ? "매력적인 프로필을 완성하고\n이상형을 만나보세요."
                                    : "즐거운 만남을 위해\n나만의 프로필을 꾸며보세요.")}
                                onStart={handleNext}
                                themeColor={themeColor}
                                themeMode={themeMode}
                                isViewer={readonly}
                                formData={formData}
                                themeStyles={styles}
                                logoImage={config.logoImage}
                                coverImage={config.coverImage}
                            />
                            {/* Swipe Hint Overlay for Cover */}
                            {readonly && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1, x: [0, -10, 0] }}
                                    transition={{ delay: 1, duration: 1.5, repeat: 2 }}
                                    className="absolute bottom-24 right-8 pointer-events-none text-gray-400 flex items-center gap-2"
                                >
                                    <span className="text-xs">밀어서 시작하기</span>
                                    <ChevronRight size={20} />
                                </motion.div>
                            )}
                        </motion.div>
                    ) : isCompleted ? (
                        <motion.div
                            key="completion"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                            className={`absolute inset-0 z-50 ${styles.bg_app}`}
                        >
                            <ProfileCompletion
                                themeColor={themeColor}
                                themeMode={themeMode}
                                isPremium={isPremium}
                                isViewer={readonly}
                                onClose={() => {
                                    window.location.reload();
                                }}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                            className="absolute inset-0 flex flex-col px-6 py-4 overflow-y-auto overflow-x-hidden scrollbar-hide"
                            drag={readonly ? "x" : false} // Only drag in readonly mode
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(_, { offset, velocity }) => {
                                if (!readonly) return;
                                const swipe = swipePower(offset.x, velocity.x);

                                if (swipe < -swipeConfidenceThreshold) {
                                    if (isLastStep) return; // Don't swipe next on last step? Or maybe close? Let's just stop.
                                    handleNext();
                                } else if (swipe > swipeConfidenceThreshold) {
                                    handlePrev();
                                }
                            }}
                        >
                            <div className="flex-1 flex flex-col justify-start pt-16 md:pt-24 min-h-0 pb-32 max-w-xl mx-auto w-full select-none">

                                {/* Swipe Hint for First Step in Readonly */}
                                {readonly && currentStep === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: [0, 1, 0], x: [20, -20, 20] }}
                                        transition={{ duration: 2, times: [0, 0.5, 1], repeat: 1, delay: 0.5 }}
                                        className="absolute bottom-32 left-0 right-0 flex justify-center pointer-events-none z-50"
                                    >
                                        <div className="bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2">
                                            <span className="text-sm font-medium">옆으로 밀어보세요</span>
                                            <ChevronRight size={16} />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Section Header (Edit Mode Only) */}
                                {!readonly && (
                                    <div className="mb-8 space-y-3">
                                        <h1 className={`text-3xl font-black leading-tight ${styles.text_primary}`}>
                                            {activeSection.title}
                                        </h1>
                                        {activeSection.description && (
                                            <p className={`text-lg leading-relaxed font-normal whitespace-pre-wrap ${styles.text_tertiary}`}>
                                                {activeSection.description}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Section Content */}
                                {readonly ? (
                                    <ImmersiveSectionViewer
                                        section={sectionWithData}
                                        themeStyles={styles}
                                        formData={formData}
                                    />
                                ) : (
                                    <ProfileSection section={sectionWithData} themeStyles={styles} />
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 2. Navigation Bar (ApplyForm Style) - Only show during Form phase */}
            {!showCover && !isCompleted && (
                <div
                    className={`flex-none px-6 pt-4 bg-gradient-to-t ${styles.nav_gradient} to-transparent z-10 relative`}
                    style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1.25rem)' }}
                >
                    {/* Progress Bar */}
                    <div className="flex justify-center mb-6">
                        <div className="w-[60%] mx-auto">
                            <FlowProgressBar
                                current={currentStep}
                                total={totalSteps}
                                themeStyles={themeStylesForBar}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between">
                        {/* Prev Button */}
                        <button
                            onClick={handlePrev}
                            className={`p-3 rounded-full hover:bg-slate-50 transition-colors text-slate-500 active:scale-95 ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <ChevronLeft size={28} strokeWidth={2.5} />
                        </button>

                        {/* Step Counter */}
                        <div className="text-xs font-bold text-slate-400 tracking-widest">
                            {currentStep + 1} / {totalSteps}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => {
                                if (readonly && isLastStep) {
                                    setDirection(1);
                                    setIsCompleted(true);
                                } else {
                                    handleNext();
                                }
                            }}
                            disabled={!readonly && isSaving}
                            className={`p-4 rounded-full shadow-xl transition-all active:scale-95 flex items-center justify-center
                            ${isLastStep || (readonly && isLastStep)
                                    ? 'bg-slate-900 text-white hover:bg-black'
                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                } ${!readonly && isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {(readonly && isLastStep) ? (
                                <Check size={24} strokeWidth={3} />
                            ) : (
                                isSaving ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    (isLastStep && !readonly) ? <Check size={24} strokeWidth={3} /> : <ChevronRight size={28} strokeWidth={3} />
                                )
                            )}
                        </button>
                    </div>
                </div>
            )}
        </FullscreenLayout>
    );
};

export default DynamicProfileForm;
