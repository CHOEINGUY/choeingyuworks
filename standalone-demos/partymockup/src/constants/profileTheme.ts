export interface ProfileTheme {
    bg: string;
    sectionTitle: string;
    inputRing: string;
    activeBtn: string;
    inactiveBtn: string;
    radioBorder: string;
    radioDot: string;
    textAreaBg: string;
    textAreaBorder: string;
    iconColor: string;
    submitBtn: string;
    cameraBg: string;
    cameraIcon: string;
    tagBg: string;
    addBtn: string;
}

export const getProfileTheme = (gender: string): ProfileTheme => {
    const isMale = gender === 'M';

    return isMale ? {
        bg: 'bg-slate-50',
        sectionTitle: 'text-indigo-400',
        inputRing: 'focus:ring-indigo-200',
        activeBtn: 'bg-indigo-600 text-white shadow-md',
        inactiveBtn: 'bg-gray-100 text-gray-400 hover:bg-gray-200',
        radioBorder: 'border-indigo-500',
        radioDot: 'bg-indigo-500',
        textAreaBg: 'bg-indigo-50/50',
        textAreaBorder: 'border-indigo-100',
        iconColor: 'text-indigo-300',
        submitBtn: 'bg-slate-900 hover:bg-slate-800',
        cameraBg: 'bg-indigo-100',
        cameraIcon: 'text-indigo-300',
        tagBg: 'bg-indigo-100 text-indigo-700',
        addBtn: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
    } : {
        bg: 'bg-[#FDFBF7]',
        sectionTitle: 'text-stone-400',
        inputRing: 'focus:ring-orange-200',
        activeBtn: 'bg-stone-600 text-white shadow-md',
        inactiveBtn: 'bg-gray-100 text-gray-400 hover:bg-gray-200',
        radioBorder: 'border-orange-300',
        radioDot: 'bg-orange-400',
        textAreaBg: 'bg-orange-50/50',
        textAreaBorder: 'border-orange-100',
        iconColor: 'text-orange-300',
        submitBtn: 'bg-stone-800 hover:bg-stone-700',
        cameraBg: 'bg-orange-50',
        cameraIcon: 'text-orange-300',
        tagBg: 'bg-orange-100 text-orange-700',
        addBtn: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
    };
};
