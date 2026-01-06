import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

import { BusinessError, isBusinessError } from '../../utils/errors';
import ErrorDisplay from './ErrorDisplay';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | BusinessError | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Global Error Caught:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError && this.state.error) {
            const error = this.state.error;

            if (isBusinessError(error)) {
                return (
                    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                        <ErrorDisplay
                            title={error.title || "문제가 발생했습니다"}
                            message={error.message}
                            type={error.severity}
                            onRetry={error.retryAction || this.handleReload}
                            className="max-w-md w-full shadow-xl bg-white"
                        />
                    </div>
                );
            }

            const isNetworkError =
                error.message?.toLowerCase().includes('network') ||
                error.message?.toLowerCase().includes('fetch') ||
                error.message?.toLowerCase().includes('offline') ||
                !navigator.onLine;

            const errorTitle = isNetworkError ? "네트워크 연결 확인" : "잠시 문제가 발생했습니다";
            const errorMessage = isNetworkError
                ? "인터넷 연결 상태가 불안정합니다.\n와이파이 또는 데이터를 확인해주세요."
                : "일시적인 오류입니다.\n화면을 새로고침 해주세요.";

            return (
                <div className="min-h-screen flex items-center justify-center bg-white p-6">
                    <div className="max-w-sm w-full text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="text-gray-400 w-8 h-8" />
                        </div>

                        <h1 className="text-xl font-bold text-gray-900 mb-2 whitespace-pre-wrap">
                            {errorTitle}
                        </h1>

                        <p className="text-sm text-gray-500 mb-8 leading-relaxed whitespace-pre-wrap">
                            {errorMessage}
                        </p>

                        <button
                            onClick={this.handleReload}
                            className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-black transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} />
                            새로고침
                        </button>

                        <p className="text-[10px] text-gray-300 mt-6">
                            {isNetworkError ? "Network Error" : `Error: ${error.message}`}
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
