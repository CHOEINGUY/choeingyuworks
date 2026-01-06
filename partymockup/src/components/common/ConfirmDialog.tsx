import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "확인",
    cancelText = "취소",
    isDestructive = false
}) => {
    const [isLoading, setIsLoading] = React.useState(false);

    // Reset loading state if dialog closes or re-opens
    React.useEffect(() => {
        if (isOpen) setIsLoading(false);
    }, [isOpen]);

    const handleConfirm = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await onConfirm();
            // Optional: If onConfirm fails, we might want to keep dialog open or close it. 
            // Usually parent closes it, but if it's async, we wait.
        } catch (error) {
            console.error("Confirm Action Failed", error);
            setIsLoading(false); // Only reset if failed and dialog might stay open
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform scale-100 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {isDestructive && (
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                <AlertTriangle size={20} />
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 mb-8 whitespace-pre-wrap leading-relaxed">
                    {message}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`flex-1 py-3 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${isDestructive
                            ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
                            : 'bg-pink-500 hover:bg-pink-600 shadow-pink-200'
                            } disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100`}
                    >
                        {isLoading && (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {isLoading ? '처리 중...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
