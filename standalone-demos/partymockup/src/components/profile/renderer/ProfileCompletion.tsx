import React from 'react';
import { CheckCircle2, Home, X } from 'lucide-react';
import { getThemeStyles } from '../../../constants/formThemes';

interface ProfileCompletionProps {
    onClose?: () => void;
    themeColor?: 'pink' | 'indigo' | string;
    themeMode?: 'light' | 'dark';
    isPremium?: boolean;
    isViewer?: boolean; // [NEW] Context for View Mode
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({
    onClose,
    themeColor = 'indigo',
    themeMode = 'light',
    isPremium = false,
    isViewer = false
}) => {
    const styles = getThemeStyles(themeColor, themeMode);

    // Text Content based on context
    let title = "제출이 완료되었습니다!";
    let description = isPremium
        ? "매니저가 프로필을 확인 후\n곧 연락드릴 예정입니다.\n잠시만 기다려주세요."
        : "초대장이 확인되었습니다.\n즐거운 파티에서 뵙겠습니다!";

    // [NEW] Viewer Mode Text
    if (isViewer) {
        title = "확인 완료";
        description = "상대방의 프로필을 모두 확인했습니다.\n이제 창을 닫으셔도 좋습니다.";
    }

    const handleCloseWindow = () => {
        // Try standard close
        window.close();

        // Mobile browsers often block script-initiated closes.
        // Show a visual hint if it remains open (though difficult to detect reliably).
        // For now, this is the best effort.
        if (onClose) onClose();
    };

    return (
        <div className={`flex flex-col h-full ${styles.bg_app} relative overflow-hidden`}>
            {/* Background Decoration */}
            <div className={`absolute top-[-10%] right-[-10%] w-[60%] h-[40%] rounded-full opacity-10 blur-3xl ${styles.blob_secondary}`} />

            <div className="flex-1 flex flex-col justify-center items-center px-8 z-10 text-center">
                <div
                    className={`mb-8 p-6 rounded-full ${styles.soft_badge_bg} ${styles.soft_badge_text}`}
                >
                    <CheckCircle2 size={64} strokeWidth={2} />
                </div>

                <h1 className={`text-3xl font-black leading-tight mb-4 ${styles.text_primary}`}>
                    {title}
                </h1>

                <p className={`text-lg leading-relaxed whitespace-pre-wrap ${styles.text_secondary}`}>
                    {description}
                </p>
            </div>

            {/* Footer */}
            <div
                className="flex-none px-6 pt-4 pb-10 z-10"
                style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 2.5rem)' }}
            >
                {isViewer ? (
                    <button
                        onClick={handleCloseWindow}
                        className={`w-full py-4 rounded-xl bg-slate-100 text-slate-500 font-bold text-lg active:scale-95 transition-all flex items-center justify-center gap-2`}
                    >
                        <X size={20} />
                        <span>화면 닫기</span>
                    </button>
                ) : (
                    onClose && (
                        <button
                            onClick={onClose}
                            className={`w-full py-4 ${styles.radius_button} ${styles.input_bg} ${styles.text_secondary} font-bold text-lg active:scale-95 transition-all flex items-center justify-center gap-2`}
                        >
                            <Home size={20} />
                            <span>홈으로 돌아가기</span>
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default ProfileCompletion;
