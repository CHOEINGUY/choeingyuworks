"use client";

import { useEffect, useRef, useState } from "react";

interface ResumeCoverLetterProps {
    content: string;
}

export const ResumeCoverLetter = ({ content }: ResumeCoverLetterProps) => {
    if (!content) return null;

    const [displayContent, setDisplayContent] = useState(content);
    const [editValue, setEditValue] = useState(content);
    const [isEditing, setIsEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [btnLeft, setBtnLeft] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("/api/save-draft")
            .then((r) => r.json())
            .then((data) => {
                if (data.content) {
                    setDisplayContent(data.content);
                    setEditValue(data.content);
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        const update = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setBtnLeft(rect.left - 68);
            }
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    useEffect(() => {
        const before = () => { if (btnRef.current) btnRef.current.style.display = "none"; };
        const after = () => { if (btnRef.current) btnRef.current.style.removeProperty("display"); };
        window.addEventListener("beforeprint", before);
        window.addEventListener("afterprint", after);
        return () => {
            window.removeEventListener("beforeprint", before);
            window.removeEventListener("afterprint", after);
        };
    }, []);

    const handleEdit = () => {
        setEditValue(displayContent);
        setIsEditing(true);
    };

    const handleSave = async () => {
        await fetch("/api/save-draft", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: editValue }),
        });
        setDisplayContent(editValue);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleClose = () => {
        setIsEditing(false);
    };

    const renderLine = (line: string, idx: number) => {
        const boldMatch = line.match(/^\*\*(.+)\*\*$/);
        if (boldMatch) {
            return <p key={idx} className="font-semibold text-gray-900 mt-6 first:mt-0">{boldMatch[1]}</p>;
        }
        if (line === "") return <div key={idx} className="h-2" />;
        return <p key={idx}>{line}</p>;
    };

    const renderContent = (text: string) => {
        const parts = text.split(/\n---\n/);
        return (
            <div className="space-y-6">
                {parts.map((part, i) => (
                    <div key={i}>
                        {i > 0 && <hr className="border-gray-200 mb-6" />}
                        <div className="space-y-2 leading-relaxed">
                            {part.split("\n").map((line, idx) => renderLine(line, idx))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div ref={containerRef} className="relative text-gray-700 leading-relaxed text-sm md:text-base">
            {btnLeft !== null && (
                <div ref={btnRef} className="fixed bottom-6 flex flex-col items-center gap-2 z-50" style={{ left: btnLeft }}>
                    <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full shadow-md">{editValue.length}자</span>
                    {!isEditing ? (
                        <button
                            onClick={handleEdit}
                            className="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50"
                        >
                            편집
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="text-xs px-3 py-1.5 bg-white border border-blue-400 text-blue-600 rounded-full shadow-md hover:bg-blue-50"
                            >
                                저장
                            </button>
                            <button
                                onClick={handleClose}
                                className="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50"
                            >
                                닫기
                            </button>
                        </>
                    )}
                    {saved && <span className="text-xs text-green-600 bg-white px-2 py-1 rounded-full shadow-md">저장됨</span>}
                </div>
            )}

            {isEditing ? (
                <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full border border-blue-200 rounded p-3 text-sm font-mono leading-relaxed outline-none resize-none"
                    style={{ minHeight: "80vh" }}
                />
            ) : (
                renderContent(displayContent)
            )}
        </div>
    );
};
