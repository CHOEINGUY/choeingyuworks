import React, { useState } from 'react';
import { MoreVertical, Save, Edit2, UserX, Trash2, X, ArrowRightCircle } from 'lucide-react';

interface MobileHeaderMenuProps {
    isEditing: boolean;
    onEdit: () => void;
    onDelete?: () => void;
    onCancel?: () => void;
    onMove?: () => void;
    onClose: () => void;
    isDark?: boolean;
}

const MobileHeaderMenu: React.FC<MobileHeaderMenuProps> = ({ isEditing, onEdit, onDelete, onCancel, onMove, onClose, isDark }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex items-center md:hidden gap-1">
            {/* More Menu Trigger */}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-slate-700' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                    <MoreVertical size={20} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <div className={`absolute right-0 mt-1 w-48 rounded-xl shadow-xl border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        onEdit();
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 active:bg-opacity-80 ${isDark ? 'text-gray-200 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {isEditing ? <Save size={16} className="text-blue-500" /> : <Edit2 size={16} />}
                                    {isEditing ? '저장하기' : '정보 수정'}
                                </button>

                                {onCancel && (
                                    <button
                                        onClick={() => {
                                            onCancel();
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 active:bg-opacity-80 ${isDark ? 'text-red-400 hover:bg-slate-700' : 'text-red-500 hover:bg-red-50'
                                            }`}
                                    >
                                        <UserX size={16} />
                                        참가 취소
                                    </button>
                                )}

                                {onMove && (
                                    <button
                                        onClick={() => {
                                            onMove();
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 active:bg-opacity-80 ${isDark ? 'text-purple-400 hover:bg-slate-700' : 'text-purple-600 hover:bg-purple-50'
                                            }`}
                                    >
                                        <ArrowRightCircle size={16} />
                                        세션 이동
                                    </button>
                                )}

                                {onDelete && (
                                    <button
                                        onClick={() => {
                                            onDelete();
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 border-t active:bg-opacity-80 ${isDark ? 'text-red-400 border-slate-700 hover:bg-slate-700' : 'text-red-500 border-gray-100 hover:bg-red-50'
                                            }`}
                                    >
                                        <Trash2 size={16} />
                                        {isEditing ? '신청자 삭제' : '삭제'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Close Button */}
            <button
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-slate-700' : 'text-gray-400 hover:bg-gray-100'}`}
            >
                <X size={24} strokeWidth={1.5} />
            </button>
        </div>
    );
};

export default MobileHeaderMenu;
