import React from 'react';
import { Phone, Edit2, Save, Trash2, X, UserX, ArrowRightCircle, Link2 } from 'lucide-react';
import MobileHeaderMenu from './MobileHeaderMenu';

interface AdminDetailHeaderProps {
    formData: any;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onDelete?: () => void;
    onCancelParticipation?: () => void;
    onSessionMove?: () => void;
    onClose: () => void;
    isDark?: boolean;
    isApplicant?: boolean;
    handleAnswerChange: (key: string, value: string) => void;
    onCopyProfileLink?: () => void; // [NEW] Handler for copying profile link
}

const AdminDetailHeader: React.FC<AdminDetailHeaderProps> = ({
    formData,
    isEditing,
    onEdit,
    onSave,
    onDelete,
    onCancelParticipation,
    onSessionMove,
    onClose,
    isDark,
    isApplicant,
    handleAnswerChange,
    onCopyProfileLink // [NEW] Destructure new prop
}) => {
    return (
        <div className={`shrink-0 px-6 h-[72px] border-b flex flex-col md:flex-row md:items-center justify-center md:justify-between gap-4 ${isDark ? 'border-slate-600 bg-slate-800/50' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center gap-4 w-full md:w-auto relative">


                {/* Mobile Name & Actions */}
                <div className="flex-1 min-w-0 md:hidden mr-2 flex flex-col justify-center h-full">
                    <div className="flex flex-col items-start gap-1">
                        {isEditing ? (
                            <div className="flex items-center gap-2 w-full">
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => handleAnswerChange('name', e.target.value)}
                                    className={`text-xl font-bold bg-transparent border-b border-pink-300 outline-none w-24 shrink-0 ${isDark ? 'text-white' : 'text-gray-900'}`}
                                    placeholder="이름"
                                    onClick={(e) => e.stopPropagation()}
                                />
                                {/* Gender Toggle for Mobile Edit Mode - Segment Control Style */}
                                <div className={`flex items-center p-1 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                                    <button
                                        onClick={() => handleAnswerChange('gender', 'M')}
                                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${formData.gender === 'M'
                                            ? 'bg-blue-500 text-white shadow-md'
                                            : (isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-gray-500 hover:text-gray-900')
                                            }`}
                                    >
                                        남
                                    </button>
                                    <button
                                        onClick={() => handleAnswerChange('gender', 'F')}
                                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${formData.gender === 'F'
                                            ? 'bg-pink-500 text-white shadow-md'
                                            : (isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-gray-500 hover:text-gray-900')
                                            }`}
                                    >
                                        여
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <h2 className="text-xl font-bold leading-tight break-keep">{formData.name || '이름 없음'}</h2>
                        )}
                        {!isEditing && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-600">{formData.age}세</span>
                        )}
                    </div>
                </div>

                {/* Mobile Actions (Edit/Delete/Cancel ... and Session Move!) */}
                {/* Mobile Actions (Edit/Delete/Cancel ... and Session Move!) */}
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onEdit} // Toggles edit mode off
                            className={`px-3 py-1.5 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                            취소
                        </button>
                        <button
                            onClick={onSave}
                            className="px-3 py-1.5 text-sm font-bold bg-indigo-600 text-white rounded-lg shadow-sm active:scale-95 transition-transform"
                        >
                            저장
                        </button>
                    </div>
                ) : (
                    <MobileHeaderMenu
                        isEditing={isEditing}
                        onEdit={onEdit}
                        onDelete={isApplicant && onDelete ? onDelete : undefined}
                        onCancel={!isApplicant && onCancelParticipation ? onCancelParticipation : undefined}
                        onMove={onSessionMove ? onSessionMove : undefined}
                        onClose={onClose}
                        isDark={isDark}
                    />
                )}
            </div>

            {/* Desktop Name Only */}
            <div className="hidden md:flex flex-col flex-1 min-w-0 justify-center">
                <div className="flex items-center gap-2 mb-1">
                    {isEditing ? (
                        <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => handleAnswerChange('name', e.target.value)}
                            className={`text-xl font-bold bg-transparent border-b border-pink-300 outline-none w-32 ${isDark ? 'text-white' : 'text-gray-900'}`}
                            placeholder="이름 입력"
                        />
                    ) : (
                        <h2 className="text-xl font-bold">{formData.name || '이름 없음'}</h2>
                    )}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${formData.gender === 'M' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>{formData.age}세</span>
                </div>
                {/* Desktop Phone Display in Header */}
                {isEditing ? (
                    <input
                        type="text"
                        value={formData.phone || formData.answers?.phone || ''}
                        onChange={(e) => handleAnswerChange('phone', e.target.value)}
                        className={`w-full max-w-[150px] p-1 text-sm border rounded outline-none ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-blue-300'}`}
                        placeholder="010-0000-0000"
                    />
                ) : (
                    <div className="flex items-center gap-1.5 text-sm font-medium opacity-80">
                        <Phone size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{formData.phone || formData.answers?.phone || '-'}</span>
                    </div>
                )}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3 md:ml-4 shrink-0">
                {/* Gender Toggle for Desktop Edit Mode (Premium Styled) */}
                {isEditing && (
                    <div className={`flex items-center gap-1 p-1 rounded-2xl border transition-all duration-300 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-gray-100 border-gray-200'}`}>
                        <button
                            onClick={() => handleAnswerChange('gender', 'M')}
                            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-2 ${formData.gender === 'M'
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                                : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600')
                                }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${formData.gender === 'M' ? 'bg-white' : 'bg-blue-500/40'}`}></span>
                            남성
                        </button>
                        <button
                            onClick={() => handleAnswerChange('gender', 'F')}
                            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-2 ${formData.gender === 'F'
                                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                                : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600')
                                }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${formData.gender === 'F' ? 'bg-white' : 'bg-pink-500/40'}`}></span>
                            여성
                        </button>
                    </div>
                )}


                {/* [NEW] Profile Link Button (Visible when Approved) */}
                {!isEditing && formData.status === 'approved' && onCopyProfileLink && (
                    <button
                        onClick={onCopyProfileLink}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${isDark ? 'bg-slate-700 text-indigo-300 hover:bg-slate-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                            }`}
                    >
                        <Link2 size={14} />
                        프로필 링크
                    </button>
                )}

                <div className={`w-px h-8 mx-1 ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />

                <button
                    onClick={isEditing ? onSave : onEdit}
                    className={`transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 border ${isEditing
                        ? 'px-5 py-2.5 rounded-xl border-indigo-600 bg-indigo-600 text-white shadow-md hover:bg-indigo-700 font-bold'
                        : `p-2 rounded-full ${isDark ? 'border-slate-600 bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`
                        }`}
                >
                    {isEditing ? (
                        <>
                            <Save size={20} />
                            <span>저장</span>
                        </>
                    ) : (
                        <Edit2 size={20} />
                    )}
                </button>

                {!isEditing && (
                    <>
                        {isApplicant && onDelete && (
                            <button onClick={onDelete} className={`p-2 rounded-full border transition-colors ${isDark ? 'border-slate-600 bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}><Trash2 size={20} /></button>
                        )}
                        {!isApplicant && onCancelParticipation && (
                            <button onClick={onCancelParticipation} className={`p-2 rounded-full border transition-colors ${isDark ? 'border-slate-600 bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}><UserX size={20} /></button>
                        )}
                        {onSessionMove && (
                            <button onClick={onSessionMove} className={`p-2 rounded-full border transition-colors ${isDark ? 'border-slate-600 bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}><ArrowRightCircle size={20} /></button>
                        )}
                    </>
                )}
                <button onClick={onClose} className={`p-2 rounded-full border ${isDark ? 'border-slate-600 bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}><X size={20} /></button>
            </div>
        </div>
    );
};

export default AdminDetailHeader;
