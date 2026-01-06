import React from 'react';
import { AlertCircle, RefreshCw, XCircle, Info } from 'lucide-react';

interface ErrorDisplayProps {
    title?: string;
    message: string;
    type?: 'error' | 'warning' | 'info';
    onRetry?: () => void;
    onClose?: () => void;
    className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    title,
    message,
    type = 'error',
    onRetry,
    onClose,
    className = ''
}) => {
    const styles = {
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: <XCircle className="text-red-500" size={20} />,
            button: 'bg-red-100 text-red-800 hover:bg-red-200'
        },
        warning: {
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-800',
            icon: <AlertCircle className="text-amber-500" size={20} />,
            button: 'bg-amber-100 text-amber-800 hover:bg-amber-200'
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: <Info className="text-blue-500" size={20} />,
            button: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        }
    };

    const currentStyle = styles[type];

    return (
        <div className={`p-4 rounded-xl border ${currentStyle.bg} ${currentStyle.border} ${className} animate-in fade-in slide-in-from-top-2 duration-300`}>
            <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    {currentStyle.icon}
                </div>
                <div className="flex-1">
                    {title && <h3 className={`text-sm font-bold ${currentStyle.text} mb-1`}>{title}</h3>}
                    <p className={`text-sm ${currentStyle.text} opacity-90 leading-relaxed`}>{message}</p>

                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className={`mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${currentStyle.button}`}
                        >
                            <RefreshCw size={14} />
                            다시 시도
                        </button>
                    )}
                </div>
                {onClose && (
                    <button onClick={onClose} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
                        <Info size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorDisplay;
