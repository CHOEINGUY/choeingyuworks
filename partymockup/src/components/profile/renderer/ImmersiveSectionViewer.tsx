import React from 'react';
import { motion } from 'framer-motion';
import { getAge } from '../../../utils/ageUtils';
import ImageCarousel from './ImageCarousel';

const LEGACY_SCHEDULE_MAP: Record<string, string> = {
    'weekend_afternoon': '주말 오후 (12시-18시)',
    'weekend_evening': '주말 저녁 (18시 이후)',
    'weekday_evening': '평일 저녁 (19시 이후)',
    'flexible': '자유롭게 가능 (협의)'
};

// Helper to get display value (maps ID to Label if options exist)
// Extracted for performance and cleaner component body
const getDisplayValue = (field: any, val: any) => {
    if (!val) return '';

    // 1. Check Legacy Map for Schedule
    if ((field.id === 'schedule' || field.id === 'participation_schedule') && typeof val === 'string' && LEGACY_SCHEDULE_MAP[val]) {
        return LEGACY_SCHEDULE_MAP[val];
    }

    if (!field.options || field.options.length === 0) {
        return Array.isArray(val) ? val.join(', ') : val;
    }

    const resolve = (v: any) => {
        const opt = field.options.find((o: any) =>
            (typeof o === 'object' && (o.value === String(v) || o.label === String(v))) ||
            String(o) === String(v)
        );
        if (opt && typeof opt === 'object') return opt.label;
        return opt || v;
    };

    if (Array.isArray(val)) {
        return val.map(resolve).filter(Boolean).join(', ');
    }

    if (typeof val === 'string' && val.includes(',') && !field.options.find((o: any) => (o.value === val || o === val))) {
        return val.split(',').map(v => resolve(v.trim())).join(', ');
    }

    return resolve(val);
};

interface ImmersiveSectionViewerProps {
    section: any;
    themeStyles: any;
    formData: any;
}

const ImmersiveSectionViewer: React.FC<ImmersiveSectionViewerProps> = ({ section, themeStyles, formData }) => {
    // Determine the type of section to render distinct layouts
    const hasNicknameField = section.fields?.some((f: any) => f.id === 'nickname');
    const isNicknameCover = section.id === 'section_nickname' || hasNicknameField;
    const isBasicInfo = section.id === 'section_basic';

    // Helper to get field value safely
    const getValue = (fieldId: string) => {
        // 1. Search in current section fields (if injected)
        const field = section.fields?.find((f: any) => f.id === fieldId);
        if (field?.value) return field.value;

        // 2. Search in top-level formData
        if (formData[fieldId]) return formData[fieldId];

        // 3. Search in formData.answers
        if (formData.answers?.[fieldId]) return formData.answers[fieldId];

        // 4. Special cases for common field IDs
        if (fieldId === 'nickname') return formData.nickname || formData.answers?.nickname || formData.name;
        if (fieldId === 'job') return formData.job || formData.answers?.job;
        if (fieldId === 'location') return formData.location || formData.answers?.location;

        return '';
    };

    // --- LAYOUT 1: COVER PAGE (Nickname + Basic Info Summary) ---
    if (isNicknameCover) {
        const nickname = getValue('nickname');
        const job = getValue('job');
        const region = getValue('location');
        const age = getAge(formData);

        return (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8 max-w-xs mx-auto"
                >
                    <div>
                        <p className={`text-2xl font-medium leading-relaxed ${themeStyles.text_secondary}`}>
                            당신과 매칭된 상대는
                        </p>
                        <h2 className={`text-4xl font-bold mt-2 ${themeStyles.text_primary}`}>
                            {nickname || '알 수 없음'}님 입니다.
                        </h2>
                    </div>

                    <div className={`w-12 h-[1px] ${themeStyles.text_tertiary} bg-current opacity-30 mx-auto`} />

                    <p className={`text-xl leading-relaxed ${themeStyles.text_secondary}`}>
                        현재 <span className={`font-bold ${themeStyles.text_primary}`}>{age !== '??' ? `${age}세로,` : ''}</span><br />
                        <span className={`font-bold ${themeStyles.text_primary}`}>{region || '거주지 미입력'}</span>에 거주하며<br />
                        <span className={`font-bold ${themeStyles.text_primary}`}>{job || '직업 미입력'}</span>(으)로 일하고 계시네요.
                    </p>
                </motion.div>
            </div>
        );
    }

    // --- SKIP BASIC INFO (Redundant now) ---
    if (isBasicInfo) {
        return null;
    }

    // --- INTELLIGENT LAYOUT DETECTION ---
    const hasTags = section.fields?.some((f: any) => f.type === 'tags' || f.type === 'mbti_selector');
    const hasLongText = section.fields?.some((f: any) => f.type === 'textarea' || f.type === 'long_text');
    const hasChoices = section.fields?.some((f: any) => f.type === 'single_choice' || f.type === 'multiple_choice');

    // Logic: 
    // - Article: If there's at least one long text field.
    // - Tag Cloud: If there are tags or many short choices.
    // - Generic List: For everything else (basic info, etc.)
    const isArticleLayout = hasLongText;
    const isTagCloudLayout = !hasLongText && (hasTags || (hasChoices && section.fields.length > 1));

    // Helper to render value (handles images and arrays specially)
    const renderValue = (field: any, val: any) => {
        if (!val) return null;

        // 1. Image Uploads
        if (field.type === 'image_upload') {
            const images = Array.isArray(val) ? val : [val];
            return (
                <div className="mt-4 group">
                    <ImageCarousel images={images} aspectRatio="portrait" />
                </div>
            );
        }

        // 2. Multiple Choice / Tags / Single Choice (Render as Chips)
        if (['multiple_choice', 'single_choice', 'tags', 'mbti_selector'].includes(field.type) || (Array.isArray(val) && field.type !== 'file_upload')) {
            // Ensure val is array
            let items: any[] = [];
            if (Array.isArray(val)) {
                items = val;
            } else if (typeof val === 'string' && val.includes(',')) {
                items = val.split(',').map(s => s.trim());
            } else {
                items = [val];
            }

            return (
                <div className="flex flex-wrap gap-2 mt-1">
                    {items.map((item, i) => {
                        const label = getDisplayValue(field, item); // Resolve label for this item
                        if (!label) return null;
                        return (
                            <span
                                key={i}
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium leading-5 ${themeStyles.soft_bg || 'bg-slate-100'} ${themeStyles.text_primary} border border-transparent`}
                            >
                                {label}
                            </span>
                        );
                    })}
                </div>
            );
        }

        // 3. Fallback to string display
        return getDisplayValue(field, val);
    };

    // --- LAYOUT 2: TAG CLOUD (Dynamic) ---
    if (isTagCloudLayout) {
        return (
            <div className="flex flex-col h-full justify-center">
                <div className="mb-8">
                    <h3 className={`text-3xl font-bold ${themeStyles.text_primary}`}>{section.title}</h3>

                </div>
                <div className="flex flex-wrap gap-3 content-center font-pretendard">
                    {section.fields.map((field: any, idx: number) => {
                        if (field.showInPartnerView === false) return null;
                        let val = field.value || formData[field.id];
                        if (!val) return null;

                        // Hybrid Logic:
                        // 1. Multiple Choice: Consolidate (One Card with chips)
                        // 2. Others (Tags, etc.): Explode (Multiple rounded-full cards)
                        const isMultipleChoice = field.type === 'multiple_choice';

                        if (isMultipleChoice) {
                            // Consolidated View (One Card)
                            return (
                                <motion.div
                                    key={field.id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`px-5 py-3 rounded-2xl text-base font-medium border ${themeStyles.border_base || 'border-slate-200'} ${themeStyles.text_primary} ${themeStyles.card_bg} shadow-sm flex flex-col items-start gap-1`}
                                >
                                    <span className={`opacity-50 text-[10px] font-bold uppercase tracking-tight`}>
                                        {field.adminProps?.cardLabel || field.label}
                                    </span>
                                    <div className="-ml-1">
                                        {renderValue(field, val)}
                                    </div>
                                </motion.div>
                            );
                        } else {
                            // Exploded View (Multiple Cards)
                            // Normalize to array
                            let items: any[] = [];
                            if (Array.isArray(val)) {
                                items = val;
                            } else if (typeof val === 'string' && val.includes(',')) {
                                items = val.split(',').map(s => s.trim());
                            } else {
                                items = [val];
                            }

                            return items.map((item, itemIdx) => {
                                const displayLabel = getDisplayValue(field, item);
                                return (
                                    <motion.div
                                        key={`${field.id}-${itemIdx}`}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: (idx * 0.1) + (itemIdx * 0.05) }}
                                        className={`px-5 py-3 rounded-full text-base font-medium border ${themeStyles.border_base || 'border-slate-200'} ${themeStyles.text_primary} ${themeStyles.card_bg} shadow-sm flex items-center gap-2`}
                                    >
                                        <span className={`opacity-50 text-[10px] font-bold uppercase tracking-tight whitespace-nowrap`}>
                                            {field.adminProps?.cardLabel || field.label}
                                        </span>
                                        <span>
                                            {displayLabel}
                                        </span>
                                    </motion.div>
                                );
                            });
                        }
                    })}
                </div>
            </div>
        );
    }

    // --- LAYOUT 3: ARTICLE (Dynamic) ---
    if (isArticleLayout) {
        return (
            <div className="flex flex-col h-full justify-start pt-10">
                <div className="mb-10">
                    <h3 className={`text-3xl font-bold ${themeStyles.text_primary}`}>{section.title}</h3>

                </div>

                <div className="space-y-10">
                    {section.fields.map((field: any, idx: number) => {
                        if (field.showInPartnerView === false) return null;
                        const val = field.value || formData[field.id];
                        if (!val) return null;

                        if (field.type === 'tags') {
                            return (
                                <div key={field.id}>
                                    <p className={`text-xs opacity-50 mb-3 font-bold uppercase tracking-widest ${themeStyles.text_secondary}`}>
                                        {field.adminProps?.cardLabel || field.label}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(val) && val.map((tag: string, tIdx: number) => (
                                            <span key={tIdx} className={`px-4 py-2 rounded-full text-sm font-medium ${themeStyles.soft_bg || 'bg-slate-100'} ${themeStyles.soft_text || 'text-slate-600'}`}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <motion.div
                                key={field.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                                className="bg-transparent"
                            >
                                <p className={`text-xs opacity-50 mb-3 font-bold uppercase tracking-widest ${themeStyles.text_secondary}`}>
                                    {field.adminProps?.cardLabel || field.label}
                                </p>
                                <div className={`text-xl leading-relaxed font-bold whitespace-pre-wrap ${themeStyles.text_primary}`}>
                                    {renderValue(field, val)}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // --- FALLBACK: GENERIC LIST (Dynamic) ---
    return (
        <div className="flex flex-col h-full justify-center">
            <div className="mb-10">
                <h3 className={`text-3xl font-bold ${themeStyles.text_primary}`}>{section.title}</h3>

            </div>

            <div className="space-y-6">
                {section.fields.map((field: any, idx: number) => {
                    if (field.showInPartnerView === false) return null;
                    const val = field.value || formData[field.id];
                    if (!val) return null;

                    return (
                        <motion.div
                            key={field.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`flex flex-col pb-4 border-b ${themeStyles.border_base || 'border-slate-100'} last:border-0`}
                        >
                            <p className={`text-xs opacity-50 mb-1.5 font-bold uppercase tracking-widest ${themeStyles.text_secondary}`}>
                                {field.adminProps?.cardLabel || field.label}
                            </p>
                            <div className={`text-xl font-bold ${themeStyles.text_primary}`}>
                                {renderValue(field, val)}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default ImmersiveSectionViewer;
