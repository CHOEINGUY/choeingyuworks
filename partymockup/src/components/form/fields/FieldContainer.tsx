import React, { ReactNode } from 'react';
import { getHeadingClass } from './headingUtils';
import { FormField } from '../../../types/form';
import { ThemeStyles } from '../../../constants/formThemes';

interface FieldContainerProps {
    field: FormField;
    theme: ThemeStyles;
    error?: { message: string };
    children: ReactNode;
    description?: string | null;
    showNumber?: boolean;
    headerDelay?: string;
    bodyDelay?: string;
    bodyClassName?: string;
}

/**
 * 공통 필드 레이아웃
 * - 번호, 라벨, 설명, 에러 처리 공통화
 * - children 영역에 각 필드별 컨텐츠를 넣어 사용
 */
const FieldContainer: React.FC<FieldContainerProps> = ({
    field,
    theme,
    error,
    children,
    description,
    showNumber = true,
    headerDelay = '150ms',
    bodyDelay = '300ms',
    bodyClassName = ''
}) => {
    return (
        <div className={`w-full flex-1 flex flex-col min-h-0 ${bodyClassName.includes('flex') ? '' : 'space-y-8'} animate-in fade-in slide-in-from-bottom-4 duration-700`}>
            {/* Question Number */}
            {showNumber && (
                <div className="text-center text-sm font-semibold text-slate-500 shrink-0">
                    Q{field.order}
                </div>
            )}

            {/* Label & Description */}
            <div
                className={`space-y-4 text-center animate-in fade-in slide-in-from-bottom-2 duration-700 shrink-0`}
                style={{ animationDelay: headerDelay }}
            >
                <h2
                    className={`${getHeadingClass(field.label)} font-bold leading-tight tracking-tight`}
                    style={{
                        color: theme.colors.text,
                        textShadow: `0 2px 8px ${theme.colors.primary}10`
                    }}
                >
                    {field.label}
                    {field.required && (
                        <span
                            className="ml-2 text-red-400"
                            style={{ filter: 'drop-shadow(0 0 4px rgba(239,68,68,0.5))' }}
                        >
                            *
                        </span>
                    )}
                </h2>

                {(description || field.description) && (
                    <p
                        className="text-base opacity-70 leading-relaxed max-w-md mx-auto"
                        style={{ color: theme.colors.text }}
                    >
                        {description || field.description}
                    </p>
                )}
            </div>

            {/* Body - 스크롤 가능 영역 */}
            <div
                className={`flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-700 ${bodyClassName}`}
                style={{ animationDelay: bodyDelay }}
            >
                {children}
            </div>

            {/* Error */}
            {error && (
                <div
                    className="text-red-400 font-semibold text-base text-center animate-in zoom-in-95 fade-in duration-300 shrink-0"
                    style={{ textShadow: '0 0 8px rgba(239,68,68,0.3)' }}
                >
                    ⚠️ {error.message}
                </div>
            )}
        </div>
    );
};

export default FieldContainer;
