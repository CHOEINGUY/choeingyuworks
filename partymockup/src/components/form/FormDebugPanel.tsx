import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Settings, ChevronLeft, ChevronRight, Eye, CheckCircle } from 'lucide-react';
import { FormResponse } from '../../types/form';

/**
 * 문항 이동 컨트롤 패널
 * 문항 목록과 진행 상황 표시
 */
const LIST_MODES = [
    { key: 'fade-scroll', label: 'Fade Scroll' },
    { key: 'snap', label: 'Snap' },
    { key: 'carousel', label: 'Carousel' }
];

interface FormDebugPanelProps {
    responses: FormResponse;
    currentStep: number;
    totalSteps: number;
    onStepChange: (step: number) => void;
    listStyleMode?: string;
    onListStyleModeChange?: (mode: string) => void;
}

const FormDebugPanel: React.FC<FormDebugPanelProps> = ({ responses, currentStep, totalSteps, onStepChange, listStyleMode = 'fade-scroll', onListStyleModeChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 z-[100] bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200"
                title="문항 이동 패널"
            >
                <Settings size={20} />
            </button>

            {/* Debug Panel */}
            {isOpen && (
                <div className="fixed bottom-0 left-0 right-0 z-[99] bg-gray-900 text-white shadow-2xl border-t border-gray-700 animate-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold">📝 문항 이동</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onStepChange(Math.max(0, currentStep - 1))}
                                    disabled={currentStep === 0}
                                    className="p-1 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="이전 문항"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded">
                                    {currentStep + 1} / {totalSteps}
                                </span>
                                <button
                                    onClick={() => onStepChange(Math.min(totalSteps - 1, currentStep + 1))}
                                    disabled={currentStep === totalSteps - 1}
                                    className="p-1 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="다음 문항"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                            <ChevronDown size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 max-h-60 overflow-y-auto">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                            {Array.from({ length: totalSteps }, (_, index) => {
                                const isCurrent = index === currentStep;
                                const isCompleted = responses && Object.keys(responses).length > 0 && index < currentStep;
                                const hasData = responses && responses[`field_${index + 1}`];

                                return (
                                    <button
                                        key={index}
                                        onClick={() => onStepChange(index)}
                                        className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 text-left ${isCurrent
                                                ? 'border-blue-500 bg-blue-600/20'
                                                : isCompleted
                                                    ? 'border-green-500 bg-green-600/20'
                                                    : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <div
                                                className={`w-3 h-3 rounded-full ${isCurrent
                                                        ? 'bg-blue-500'
                                                        : isCompleted
                                                            ? 'bg-green-500'
                                                            : 'bg-gray-600'
                                                    }`}
                                            />
                                            <span className="text-xs font-bold">Q{index + 1}</span>
                                        </div>
                                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                            {hasData ? (
                                                <>
                                                    <CheckCircle size={10} className="text-green-400" />
                                                    <span>입력됨</span>
                                                </>
                                            ) : isCurrent ? (
                                                <>
                                                    <Eye size={10} className="text-blue-400" />
                                                    <span>진행중</span>
                                                </>
                                            ) : (
                                                <span>대기중</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-gray-800 p-3 rounded-lg mb-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-400">전체 진행률</span>
                                <span className="text-xs font-mono">{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Current Field Info */}
                        <div className="bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-400 mb-2">현재 문항 정보</p>
                            <p className="text-sm font-mono text-blue-400">
                                Step {currentStep + 1} / {totalSteps}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                입력된 데이터: {Object.keys(responses || {}).length}개
                            </p>
                        </div>

                        {/* List Style Mode */}
                        <div className="bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-400 mb-2">리스트 모드</p>
                            <div className="flex flex-wrap gap-2">
                                {LIST_MODES.map((m) => (
                                    <button
                                        key={m.key}
                                        onClick={() => onListStyleModeChange && onListStyleModeChange(m.key)}
                                        className={`px-3 py-1 text-xs rounded border transition-colors ${listStyleMode === m.key
                                                ? 'border-blue-400 bg-blue-600/30 text-white'
                                                : 'border-gray-600 bg-gray-700 text-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FormDebugPanel;
