export const getHeadingClass = (label: string = ''): string => {
    const len = label.length || 0;

    if (len > 28) return 'text-xl md:text-2xl';
    if (len > 20) return 'text-[22px] md:text-[26px]';
    return 'text-2xl md:text-3xl';
};
