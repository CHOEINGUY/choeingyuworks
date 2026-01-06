import React from 'react';
import { MessageTemplate } from '../../../data/messageTemplates';
import { MessageSquare } from 'lucide-react';

interface MessageEditorCanvasProps {
    template: MessageTemplate | null;
    onChange: (updates: Partial<MessageTemplate>) => void;
    readOnly?: boolean;
}

const MessageEditorCanvas: React.FC<MessageEditorCanvasProps> = ({
    template,
    onChange,
    readOnly = false
}) => {
    if (!template) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 text-slate-400">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                    <MessageSquare size={32} className="text-slate-300" />
                </div>
                <p className="font-medium text-sm">편집할 템플릿을 선택하거나 새로 만드세요.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden">
            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
                <div className="max-w-3xl mx-auto space-y-6">

                    {/* Title Input */}
                    <div className="bg-transparent">
                        <input
                            type="text"
                            value={template.title}
                            onChange={(e) => onChange({ title: e.target.value })}
                            placeholder="템플릿 제목을 입력하세요"
                            className="w-full text-3xl font-bold bg-transparent text-slate-800 placeholder-slate-300 focus:outline-none"
                            disabled={readOnly}
                        />
                    </div>

                    {/* Paper Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col relative overflow-hidden transition-all hover:shadow-md">
                        {/* Header Decoration */}
                        <div className="h-1 bg-indigo-500 w-full absolute top-0 left-0" />

                        <div className="p-8 flex-1 flex flex-col">
                            {/* Content Editor */}
                            {/* We use a textarea for now, but style it to look cleaner */}
                            <textarea
                                value={template.content}
                                onChange={(e) => onChange({ content: e.target.value })}
                                placeholder="메세지 내용을 작성하세요...&#13;&#10;변수를 사용하려면 우측 패널에서 클릭하세요."
                                className="w-full flex-1 resize-none text-base leading-relaxed text-slate-700 placeholder-slate-300 focus:outline-none scrollbar-thin font-mono"
                                spellCheck="false"
                                disabled={readOnly}
                            />
                        </div>

                        {/* Footer Info */}
                        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                            <span>{template.content.length} 자</span>
                            <span>미리보기는 아직 지원되지 않습니다.</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-slate-400">
                            * 메세지 내용은 발송 시 실제 데이터로 치환되어 전송됩니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageEditorCanvas;
