import React from 'react';
import { Check } from 'lucide-react';
import { FormSettings } from '../../../types/formConfig';

interface FormCompletionEditorProps {
    formSettings: FormSettings;
    setFormSettings: (settings: FormSettings) => void;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onActivate: () => void;
}

const FormCompletionEditor: React.FC<FormCompletionEditorProps> = ({ formSettings, setFormSettings, isOpen, onOpen, onClose, onActivate }) => {
    return (
        <div
            onClick={() => {
                onOpen();
                onActivate();
            }}
            className={`group relative bg-white border rounded-2xl transition-all cursor-pointer overflow-hidden
                ${isOpen
                    ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg scale-[1.01]'
                    : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'}`}
        >
            {/* Header / Summary View */}
            <div className="px-6 py-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                    ${isOpen ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                    <Check size={20} strokeWidth={3} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h3 className={`text-base font-bold transition-colors ${isOpen ? 'text-indigo-900' : 'text-slate-700'}`}>
                            작성 완료 페이지
                        </h3>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-400 border border-slate-200">
                            FIXED
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">
                        {formSettings.completionPage?.title || "신청이 완료되었습니다"}
                    </p>
                </div>
            </div>

            {/* Editor View (Expanded) */}
            {isOpen && (
                <div className="px-6 pb-6 pt-5 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200 cursor-default" onClick={e => e.stopPropagation()}>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">완료 메시지 제목</label>
                            <input
                                type="text"
                                value={formSettings.completionPage?.title || "신청이 완료되었습니다"}
                                onChange={(e) => setFormSettings({
                                    ...formSettings,
                                    completionPage: { ...formSettings.completionPage, title: e.target.value }
                                })}
                                className="w-full p-3 text-lg font-bold bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder-slate-300 text-slate-800"
                                placeholder="신청이 완료되었습니다"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">상세 안내 문구</label>
                            <textarea
                                value={formSettings.completionPage?.description || ""}
                                onChange={(e) => setFormSettings({
                                    ...formSettings,
                                    completionPage: { ...formSettings.completionPage, description: e.target.value }
                                })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm text-slate-600 resize-none leading-relaxed"
                                rows={3}
                                placeholder="예: 검토 후 카카오톡으로 개별 안내드리겠습니다."
                            />
                        </div>

                        {/* Bottom Action */}
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm active:scale-95 shadow-indigo-200"
                            >
                                <Check size={16} strokeWidth={3} />
                                <span>완료</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormCompletionEditor;
