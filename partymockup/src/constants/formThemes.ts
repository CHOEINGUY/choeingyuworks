export interface ThemeColor {
    id: string;
    label: string;
    hex: string;
    ring: string;
    bg: string;
    text_accent: string;
    text_highlight: string;
    border_chk: string;
    border_light: string;
    ring_light: string;
    ring_soft: string;
    shadow_checked: string;
    hover_border_light: string;
    button_bg: string;
    button_hover: string;
    button_text: string;
    check_color: string;
    input_focus_border: string;
    ring_focus: string;
    bg_checked: string;
    border_checked: string;
    border_focus: string;
    border_focus_dark: string;
    ring_checked: string;
    text_accent_dark: string;
    highlight_bg_dark: string;
    highlight_bg: string;
    check_badge_bg?: string;
    check_badge_text?: string;
}

export const FORM_THEME_COLORS: ThemeColor[] = [
    {
        id: 'indigo', label: 'Indigo', hex: '#4f46e5',
        ring: 'ring-indigo-500', bg: 'bg-indigo-600', text_accent: 'text-indigo-600', text_highlight: 'text-indigo-900', border_chk: 'border-indigo-600',
        border_light: 'border-indigo-200', ring_light: 'ring-indigo-50', ring_soft: 'ring-indigo-500/10',
        shadow_checked: 'shadow-indigo-500/20', hover_border_light: 'hover:border-indigo-300',
        button_bg: 'bg-indigo-600', button_hover: 'hover:bg-indigo-700',
        button_text: 'text-white', check_color: 'text-white',
        input_focus_border: 'focus:border-indigo-600', ring_focus: 'focus:ring-indigo-500',
        bg_checked: 'bg-indigo-600', border_checked: 'border-indigo-600',
        border_focus: 'border-indigo-300',
        border_focus_dark: 'border-indigo-700', // Dark mode specific
        ring_checked: 'ring-indigo-600',
        // Dark Mode Variants
        text_accent_dark: 'text-indigo-400', highlight_bg_dark: 'bg-indigo-500/20',
        highlight_bg: 'bg-indigo-50'
    },
    {
        id: 'rose', label: 'Rose', hex: '#e11d48',
        ring: 'ring-rose-500', bg: 'bg-rose-600', text_accent: 'text-rose-600', text_highlight: 'text-rose-900', border_chk: 'border-rose-600',
        border_light: 'border-rose-200', ring_light: 'ring-rose-50', ring_soft: 'ring-rose-500/10',
        shadow_checked: 'shadow-rose-500/20', hover_border_light: 'hover:border-rose-300',
        button_bg: 'bg-rose-600', button_hover: 'hover:bg-rose-700',
        button_text: 'text-white', check_color: 'text-white',
        input_focus_border: 'focus:border-rose-600', ring_focus: 'focus:ring-rose-500',
        bg_checked: 'bg-rose-600', border_checked: 'border-rose-600',
        border_focus: 'border-rose-300',
        border_focus_dark: 'border-rose-700',
        ring_checked: 'ring-rose-600',
        text_accent_dark: 'text-rose-400', highlight_bg_dark: 'bg-rose-500/20',
        highlight_bg: 'bg-rose-50'
    },
    {
        id: 'blue', label: 'Blue', hex: '#2563eb',
        ring: 'ring-blue-500', bg: 'bg-blue-600', text_accent: 'text-blue-600', text_highlight: 'text-blue-900', border_chk: 'border-blue-600',
        border_light: 'border-blue-200', ring_light: 'ring-blue-50', ring_soft: 'ring-blue-500/10',
        shadow_checked: 'shadow-blue-500/20', hover_border_light: 'hover:border-blue-300',
        button_bg: 'bg-blue-600', button_hover: 'hover:bg-blue-700',
        button_text: 'text-white', check_color: 'text-white',
        input_focus_border: 'focus:border-blue-600', ring_focus: 'focus:ring-blue-500',
        bg_checked: 'bg-blue-600', border_checked: 'border-blue-600',
        border_focus: 'border-blue-300',
        border_focus_dark: 'border-blue-700',
        ring_checked: 'ring-blue-600',
        text_accent_dark: 'text-blue-400', highlight_bg_dark: 'bg-blue-500/20',
        highlight_bg: 'bg-blue-50'
    },
    {
        id: 'emerald', label: 'Emerald', hex: '#059669',
        ring: 'ring-emerald-500', bg: 'bg-emerald-600', text_accent: 'text-emerald-600', text_highlight: 'text-emerald-900', border_chk: 'border-emerald-600',
        border_light: 'border-emerald-200', ring_light: 'ring-emerald-50', ring_soft: 'ring-emerald-500/10',
        shadow_checked: 'shadow-emerald-500/20', hover_border_light: 'hover:border-emerald-300',
        button_bg: 'bg-emerald-600', button_hover: 'hover:bg-emerald-700',
        button_text: 'text-white', check_color: 'text-white',
        input_focus_border: 'focus:border-emerald-600', ring_focus: 'focus:ring-emerald-500',
        bg_checked: 'bg-emerald-600', border_checked: 'border-emerald-600',
        border_focus: 'border-emerald-300',
        border_focus_dark: 'border-emerald-700',
        ring_checked: 'ring-emerald-600',
        text_accent_dark: 'text-emerald-400', highlight_bg_dark: 'bg-emerald-500/20',
        highlight_bg: 'bg-emerald-50'
    },
    {
        id: 'violet', label: 'Violet', hex: '#7c3aed',
        ring: 'ring-violet-500', bg: 'bg-violet-600', text_accent: 'text-violet-600', text_highlight: 'text-violet-900', border_chk: 'border-violet-600',
        border_light: 'border-violet-200', ring_light: 'ring-violet-50', ring_soft: 'ring-violet-500/10',
        shadow_checked: 'shadow-violet-500/20', hover_border_light: 'hover:border-violet-300',
        button_bg: 'bg-violet-600', button_hover: 'hover:bg-violet-700',
        button_text: 'text-white', check_color: 'text-white',
        input_focus_border: 'focus:border-violet-600', ring_focus: 'focus:ring-violet-500',
        bg_checked: 'bg-violet-600', border_checked: 'border-violet-600',
        border_focus: 'border-violet-300',
        border_focus_dark: 'border-violet-700',
        ring_checked: 'ring-violet-600',
        text_accent_dark: 'text-violet-400', highlight_bg_dark: 'bg-violet-500/20',
        highlight_bg: 'bg-violet-50'
    },
    {
        id: 'orange', label: 'Orange', hex: '#ea580c',
        ring: 'ring-orange-500', bg: 'bg-orange-600', text_accent: 'text-orange-600', text_highlight: 'text-orange-900', border_chk: 'border-orange-600',
        border_light: 'border-orange-200', ring_light: 'ring-orange-50', ring_soft: 'ring-orange-500/10',
        shadow_checked: 'shadow-orange-500/20', hover_border_light: 'hover:border-orange-300',
        button_bg: 'bg-orange-600', button_hover: 'hover:bg-orange-700',
        button_text: 'text-white', check_color: 'text-white',
        input_focus_border: 'focus:border-orange-600', ring_focus: 'focus:ring-orange-500',
        bg_checked: 'bg-orange-600', border_checked: 'border-orange-600',
        border_focus: 'border-orange-300',
        border_focus_dark: 'border-orange-700',
        ring_checked: 'ring-orange-600',
        text_accent_dark: 'text-orange-400', highlight_bg_dark: 'bg-orange-500/20',
        highlight_bg: 'bg-orange-50'
    },
    {
        id: 'slate', label: 'Slate', hex: '#475569',
        ring: 'ring-slate-500', bg: 'bg-slate-600', text_accent: 'text-slate-600', text_highlight: 'text-slate-900', border_chk: 'border-slate-600',
        border_light: 'border-slate-200', ring_light: 'ring-slate-50', ring_soft: 'ring-slate-500/10',
        shadow_checked: 'shadow-slate-500/20', hover_border_light: 'hover:border-slate-300',
        button_bg: 'bg-slate-600', button_hover: 'hover:bg-slate-700',
        button_text: 'text-white', check_color: 'text-white',
        input_focus_border: 'focus:border-slate-600', ring_focus: 'focus:ring-slate-500',
        bg_checked: 'bg-slate-600', border_checked: 'border-slate-600',
        border_focus: 'border-slate-300',
        border_focus_dark: 'border-slate-700',
        ring_checked: 'ring-slate-600',
        text_accent_dark: 'text-slate-400', highlight_bg_dark: 'bg-slate-500/20',
        highlight_bg: 'bg-slate-50'
    },
    {
        id: 'sky', label: 'Sky', hex: '#0284c7',
        ring: 'ring-sky-500', bg: 'bg-sky-600', text_accent: 'text-sky-600', text_highlight: 'text-sky-900', border_chk: 'border-sky-600',
        border_light: 'border-sky-200', ring_light: 'ring-sky-50', ring_soft: 'ring-sky-500/10',
        shadow_checked: 'shadow-sky-500/20', hover_border_light: 'hover:border-sky-300',
        button_bg: 'bg-sky-600', button_hover: 'hover:bg-sky-700',
        button_text: 'text-white', check_color: 'text-white',
        input_focus_border: 'focus:border-sky-600', ring_focus: 'focus:ring-sky-500',
        bg_checked: 'bg-sky-600', border_checked: 'border-sky-600',
        border_focus: 'border-sky-300',
        border_focus_dark: 'border-sky-700',
        ring_checked: 'ring-sky-600',
        text_accent_dark: 'text-sky-400', highlight_bg_dark: 'bg-sky-500/20',
        highlight_bg: 'bg-sky-50'
    },
    {
        id: 'white', label: 'White', hex: '#ffffff',
        ring: 'ring-slate-200', bg: 'bg-white', text_accent: 'text-slate-900', text_highlight: 'text-white', border_chk: 'border-white',
        border_light: 'border-slate-200', ring_light: 'ring-slate-200', ring_soft: 'ring-white/10',
        shadow_checked: 'shadow-white/20', hover_border_light: 'hover:border-slate-300',
        button_bg: 'bg-white', button_hover: 'hover:bg-slate-100',
        button_text: 'text-slate-900', check_color: 'text-slate-900',
        input_focus_border: 'focus:border-white', ring_focus: 'focus:ring-white',
        bg_checked: 'bg-white', border_checked: 'border-white',
        border_focus: 'border-slate-300',
        border_focus_dark: 'border-slate-500',
        ring_checked: 'ring-white',
        text_accent_dark: 'text-white', highlight_bg_dark: 'bg-white/20',
        check_badge_bg: 'bg-slate-900', check_badge_text: 'text-white',
        highlight_bg: 'bg-slate-100'
    },
    {
        id: 'black', label: 'Black', hex: '#000000',
        ring: 'ring-slate-900', bg: 'bg-slate-900', text_accent: 'text-slate-900', text_highlight: 'text-slate-900', border_chk: 'border-slate-900',
        border_light: 'border-slate-200', ring_light: 'ring-slate-900', ring_soft: 'ring-slate-900/10',
        shadow_checked: 'shadow-slate-900/20', hover_border_light: 'hover:border-slate-400',
        button_bg: 'bg-slate-900', button_hover: 'hover:bg-slate-800',
        button_text: 'text-white', check_color: 'text-white',
        input_focus_border: 'focus:border-slate-900', ring_focus: 'focus:ring-slate-900',
        bg_checked: 'bg-slate-900', border_checked: 'border-slate-900',
        border_focus: 'border-slate-400',
        border_focus_dark: 'border-slate-600',
        ring_checked: 'ring-slate-900',
        text_accent_dark: 'text-white', highlight_bg_dark: 'bg-slate-900/20',
        highlight_bg: 'bg-slate-100'
    },
];

export interface ThemeStyles {
    bg_app: string;
    text_primary: string;
    text_secondary: string;
    text_tertiary: string;
    border_base: string;
    input_bg: string;
    card_bg: string;
    nav_gradient: string;
    bar_bg: string;
    bar_fill: string;
    solid_bg: string;
    solid_text: string;
    solid_badge_bg: string;
    solid_badge_text: string;
    soft_bg: string;
    soft_text: string;
    soft_badge_bg: string;
    soft_badge_text: string;
    ring_focus: string;
    border_checked: string;
    bg_checked: string;
    check_color: string;
    border_light: string;
    border_focus: string;
    shadow_checked: string;
    ring_light: string;
    ring_checked: string;
    ring_soft: string;
    input_focus_border: string;
    hover_border_light: string;
    // Legacy props
    text_highlight?: string;
    text_accent?: string;
    highlight_bg?: string;
    button_bg?: string;
    button_hover?: string;
    button_text?: string;

    // Design Props
    font_family: string;
    radius_button: string;
    radius_input: string;
    radius_card: string;
    radius_option: string; // [NEW] Option specific radius
    radius_check_btn: string; // [NEW] Check button radius (follows buttonStyle)

    // Option Specifics
    text_align_option: string; // [NEW]
    text_size_option: string;  // [NEW]

    // Decorations
    blob: string; // [NEW]
    blob_secondary: string; // [NEW]
}

const BUTTON_STYLES: Record<string, string> = {
    'rounded': 'rounded-xl',
    'square': 'rounded-none',
    'pill': 'rounded-full',
};

const OPTION_STYLES: Record<string, string> = {
    'rounded': 'rounded-xl',
    'square': 'rounded-none',
    'pill': 'rounded-full',
};

const OPTION_ALIGNS: Record<string, string> = {
    'left': 'text-left justify-start',
    'center': 'text-center justify-center',
};

const OPTION_SIZES: Record<string, string> = {
    'sm': 'py-2 px-3 text-sm min-h-[48px]', // Compact
    'md': 'py-3 px-4 text-base min-h-[56px]', // Standard
    'lg': 'p-5 text-lg min-h-[64px]', // Large
};

const FONT_FAMILIES: Record<string, string> = {
    PRETENDARD: 'font-sans', // Assuming Inter/Pretendard is default sans
    NOTO_SERIF: 'font-serif',
    NANUM_SQUARE: 'font-mono' // Fallback for demo, real implementation needs font import
};

/**
 * Generates the specific tailwind class object for the chosen theme color
 * This replaces the hardcoded THEME_STYLES in ApplyFormEngine
 */
export const getThemeStyles = (
    colorId: string = 'indigo',
    mode: string = 'light',
    design?: {
        fontFamily?: 'PRETENDARD' | 'NOTO_SERIF' | 'NANUM_SQUARE';
        buttonStyle?: 'rounded' | 'square' | 'pill';
        optionStyle?: 'rounded' | 'square' | 'pill'; // [NEW]
        optionAlign?: 'left' | 'center'; // [NEW]
        optionSize?: 'sm' | 'md' | 'lg'; // [NEW]
    }
): ThemeStyles => {
    // Fallback if invalid colorId is provided
    const theme = FORM_THEME_COLORS.find(c => c.id === colorId) || FORM_THEME_COLORS[0];
    const isDark = mode === 'dark';

    const baseStyles = {
        bg_app: isDark ? 'bg-slate-950' : 'bg-white',
        text_primary: isDark ? 'text-white' : 'text-slate-900',
        text_secondary: isDark ? 'text-slate-400' : 'text-slate-500',
        text_tertiary: isDark ? 'text-slate-600' : 'text-slate-400',
        border_base: isDark ? 'border-slate-800' : 'border-slate-200',
        input_bg: isDark ? 'bg-slate-900' : 'bg-slate-50',
        card_bg: isDark ? 'bg-slate-900' : 'bg-white',
        nav_gradient: isDark ? 'from-slate-950 via-slate-950' : 'from-white via-white',
        bar_bg: isDark ? 'bg-slate-800' : 'bg-slate-100',
        bar_fill: isDark ? 'bg-white' : 'bg-slate-900', // Default progress bar fill (black/white)
    };

    // Defaults (Standard Colored Themes)
    let solid_bg = theme.bg_checked; // e.g., bg-indigo-600
    let solid_text = 'text-white';
    let solid_badge_bg = 'bg-white';
    let solid_badge_text = theme.text_accent; // e.g., text-indigo-600

    // Soft Mode (Inverse Rule: Dark Badge on Light Card)
    let soft_bg = theme.highlight_bg; // e.g., bg-indigo-50
    let soft_text = theme.text_accent; // e.g., text-indigo-600
    let soft_badge_bg = theme.bg_checked; // e.g., bg-indigo-600 (Fixed: Was text class)
    let soft_badge_text = 'text-white';

    // Overrides for White Theme (To fix visibility)
    if (colorId === 'white') {
        // Solid Mode -> Black BG / White Text
        solid_bg = 'bg-slate-900';
        solid_text = 'text-white';
        solid_badge_bg = 'bg-white'; // White Badge on Black BG
        solid_badge_text = 'text-slate-900';

        // Soft Mode -> Grey BG / Black Text
        soft_bg = 'bg-slate-100';
        soft_text = 'text-slate-900';
        // Inverse Rule: Black Badge on Light Gray Card
        soft_badge_bg = 'bg-slate-900';
        soft_badge_text = 'text-white';
    }

    // Overrides for Dark Mode (If needed)
    if (isDark) {
        if (colorId === 'white') {
            // White Theme in Dark Mode
            solid_bg = 'bg-slate-100'; // White Card
            solid_text = 'text-slate-900';
            solid_badge_bg = 'bg-slate-900';
            solid_badge_text = 'text-white';

            soft_bg = 'bg-slate-800';
            soft_text = 'text-white';
            soft_badge_bg = 'bg-white';
            soft_badge_text = 'text-slate-900';
        } else {
            // Standard Themes in Dark Mode
            soft_bg = theme.highlight_bg_dark; // Transparent/Dark tint
            soft_text = theme.text_accent_dark;
        }
    }

    const colorStyles = {
        // Legacy mapping (to keep other parts working if needed)
        text_highlight: isDark ? 'text-white' : theme.text_highlight,
        text_accent: isDark ? theme.text_accent_dark : theme.text_accent,
        highlight_bg: isDark ? theme.highlight_bg_dark : theme.highlight_bg,
        button_bg: theme.button_bg,
        button_hover: theme.button_hover,
        button_text: theme.button_text || 'text-white',
        // ... other legacy props if needed ...

        // --- NEW SYSTEM PROPERTIES ---
        solid_bg,
        solid_text,
        solid_badge_bg,
        solid_badge_text,

        soft_bg,
        soft_text,
        soft_badge_bg,
        soft_badge_text,

        // Detailed UI States (preserved)
        ring_focus: theme.ring_focus,
        border_checked: theme.border_checked,
        bg_checked: theme.bg_checked,
        check_color: theme.check_color,
        border_light: theme.border_light,
        border_focus: isDark ? theme.border_focus_dark : theme.border_focus,
        shadow_checked: theme.shadow_checked,
        ring_light: isDark ? 'ring-transparent' : theme.ring_light,
        ring_checked: theme.ring_checked,
        ring_soft: theme.ring_soft,
        input_focus_border: theme.input_focus_border,
        hover_border_light: theme.hover_border_light,
    };

    // 4. Resolve Dynamic Styles
    const fontClass = FONT_FAMILIES[design?.fontFamily || 'PRETENDARD'] || 'font-sans';
    const radiusBtnClass = BUTTON_STYLES[design?.buttonStyle || 'rounded'] || 'rounded-xl';

    // [NEW] Option Specifics
    const radiusOptionClass = OPTION_STYLES[design?.optionStyle || design?.buttonStyle || 'rounded'] || 'rounded-xl';
    const alignOptionClass = OPTION_ALIGNS[design?.optionAlign || 'left'] || 'text-left justify-start';
    const sizeOptionClass = OPTION_SIZES[design?.optionSize || 'md'] || 'p-4 text-base';

    // [NEW] Blobs
    let blob = `bg-${theme.id}-300`;
    let blob_secondary = `bg-${theme.id}-400`;

    if (colorId === 'white') {
        blob = 'bg-slate-200';
        blob_secondary = 'bg-slate-300';
    } else if (colorId === 'black') {
        blob = 'bg-slate-800';
        blob_secondary = 'bg-slate-700';
    } else if (colorId === 'slate') {
        blob = 'bg-slate-300';
        blob_secondary = 'bg-slate-400';
    }

    return {
        ...baseStyles,
        ...colorStyles,
        font_family: fontClass,
        radius_button: radiusBtnClass,
        radius_input: radiusBtnClass === 'rounded-full' ? 'rounded-2xl' : radiusBtnClass, // Inputs rarely full pill
        radius_card: radiusBtnClass === 'rounded-none' ? 'rounded-none' : 'rounded-3xl',

        // [NEW]
        radius_option: radiusOptionClass,
        radius_check_btn: radiusBtnClass, // Follows button style exactly as requested
        text_align_option: alignOptionClass,
        text_size_option: sizeOptionClass,

        // [NEW] Decorations
        blob,
        blob_secondary
    };
};
