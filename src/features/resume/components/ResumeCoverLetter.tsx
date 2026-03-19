"use client";

import { useEffect, useRef, useState } from "react";

interface ResumeCoverLetterProps {
    content: string;
    storageKey?: string;
}

export const ResumeCoverLetter = ({ content, storageKey = "cover-letter-draft" }: ResumeCoverLetterProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [savedText, setSavedText] = useState<string | null>(null);
    const [charCount, setCharCount] = useState(0);
    const [currentLine, setCurrentLine] = useState(1);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) setSavedText(stored);
    }, [storageKey]);

    const displayText = savedText ?? content;

    useEffect(() => {
        setCharCount(displayText.length);
    }, [displayText]);

    const handleSave = async () => {
        const val = textareaRef.current?.value ?? "";
        localStorage.setItem(storageKey, val);
        setSavedText(val);
        setIsEditing(false);

        try {
            await fetch("/api/save-draft", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: val }),
            });
        } catch (e) {
            console.error("파일 저장 실패:", e);
        }
    };

    const handleReset = () => {
        if (!confirm("저장된 내용을 지우고 원본으로 되돌릴까요?")) return;
        localStorage.removeItem(storageKey);
        setSavedText(null);
        setIsEditing(false);
    };

    if (!displayText && !isEditing) return null;

    const renderContent = (text: string) => {
        const parts = text.split(/\n---\n/);
        return (
            <div className="space-y-6">
                {parts.map((part, i) => (
                    <div key={i}>
                        {i > 0 && <hr className="border-gray-200 mb-6" />}
                        <div className="whitespace-pre-line">{part}</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-3">
            {/* 툴바 — 인쇄 시 숨김 */}
            <div className="flex gap-2 print:hidden">
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        편집
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleSave}
                            className="text-xs px-3 py-1 rounded border border-black bg-black text-white hover:bg-gray-800 transition-colors"
                        >
                            저장
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            취소
                        </button>
                    </>
                )}
                {savedText && (
                    <button
                        onClick={handleReset}
                        className="text-xs px-3 py-1 rounded border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors print:hidden"
                    >
                        초기화
                    </button>
                )}
                {savedText && (
                    <span className="text-xs text-gray-400 self-center">● 로컬 저장됨</span>
                )}
            </div>

            {/* 본문 */}
            {isEditing ? (
                <textarea
                    ref={textareaRef}
                    defaultValue={displayText}
                    onChange={(e) => setCharCount(e.target.value.length)}
                    className="w-full min-h-[600px] text-sm text-gray-700 leading-relaxed border border-gray-200 rounded p-4 focus:outline-none focus:border-gray-400 resize-y font-sans"
                    placeholder="커버레터를 작성하세요..."
                />
            ) : (
                <div className="text-gray-700 leading-relaxed text-sm md:text-base break-keep">
                    {renderContent(displayText)}
                </div>
            )}

            {/* 하단 툴바 */}
            <div className="flex gap-2 items-center print:hidden pt-1">
                <span className="text-xs text-gray-400">{charCount.toLocaleString()}자</span>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        편집
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleSave}
                            className="text-xs px-3 py-1 rounded border border-black bg-black text-white hover:bg-gray-800 transition-colors"
                        >
                            저장
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            취소
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
