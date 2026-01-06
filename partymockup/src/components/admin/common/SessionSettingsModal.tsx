import React, { useState, useEffect } from 'react';
import { X, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface SessionSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: any; // Using any for Session flexibility
    actions: {
        updateSession?: (id: string, data: any) => Promise<boolean>;
        deleteSession?: (id: string) => Promise<boolean>;
    };
}

const SessionSettingsModal: React.FC<SessionSettingsModalProps> = ({
    isOpen,
    onClose,
    session,
    actions
}) => {
    const [title, setTitle] = useState('');
    const [isApplicationClosed, setIsApplicationClosed] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // [NEW] Date/Time State
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        if (session) {
            setTitle(session.title || '');
            setIsApplicationClosed(session.isApplicationClosed || false);

            // Parse 'YYYY-MM-DD HH:mm'
            if (session.date) {
                const [d, t] = session.date.split(' ');
                setDate(d || ''); // YYYY-MM-DD
                setTime(t || '00:00'); // HH:mm
            } else {
                setDate('');
                setTime('00:00');
            }
        }
    }, [session]);

    if (!isOpen || !session) return null;

    const handleSave = async () => {
        if (!actions?.updateSession) return;

        // Combine Date + Time
        const fullDateString = `${date} ${time}`;

        const success = await actions.updateSession(session.id, {
            title,
            isApplicationClosed,
            date: fullDateString // [NEW] Update Date
        });

        if (success) {
            onClose();
        } else {
            toast.error('설정 저장에 실패했습니다.');
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true); // Show confirmation UI overlay
    };

    const confirmDelete = async () => {
        if (!actions?.deleteSession) return;

        const success = await actions.deleteSession(session.id);

        if (success) {
            onClose();
            // Optional: Actions after delete
        } else {
            setIsDeleting(false); // Reset on failure
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">세션 설정</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">
                            세션 제목
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                            placeholder="세션 제목을 입력하세요"
                        />
                    </div>

                    {/* Status Toggle */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">
                            신청 마감 상태
                        </label>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50">
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-900">신청 마감 (Closed)</span>
                                <span className="text-xs text-gray-500">활성화 시 신청 폼에서 이 세션이 숨겨집니다.</span>
                            </div>

                            <button
                                onClick={() => setIsApplicationClosed(!isApplicationClosed)}
                                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${isApplicationClosed ? 'bg-pink-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${isApplicationClosed ? 'translate-x-6' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* [NEW] Session Schedule Edit */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">
                            세션 일정
                        </label>
                        <div className="flex gap-2">
                            {/* Date Input */}
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 outline-none transition-all text-gray-900 bg-gray-50 appearance-none"
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            {/* Time Input (Split) */}
                            <select
                                value={(time || '00:00').split(':')[0]}
                                onChange={(e) => {
                                    const newHour = e.target.value;
                                    const currentMin = (time || '00:00').split(':')[1] || '00';
                                    setTime(`${newHour}:${currentMin}`);
                                }}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 outline-none transition-all text-center appearance-none bg-gray-50 text-gray-900"
                            >
                                {Array.from({ length: 24 }).map((_, i) => {
                                    const h = i.toString().padStart(2, '0');
                                    return <option key={h} value={h}>{h}시</option>;
                                })}
                            </select>
                            <select
                                value={(time || '00:00').split(':')[1]}
                                onChange={(e) => {
                                    const currentHour = (time || '00:00').split(':')[0] || '00';
                                    const newMin = e.target.value;
                                    setTime(`${currentHour}:${newMin}`);
                                }}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 outline-none transition-all text-center appearance-none bg-gray-50 text-gray-900"
                            >
                                {[0, 10, 20, 30, 40, 50].map(m => {
                                    const minStr = m.toString().padStart(2, '0');
                                    return <option key={minStr} value={minStr}>{minStr}분</option>;
                                })}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center gap-3">
                    {/* Left: Delete Button */}
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors text-sm font-medium"
                        title="세션 삭제"
                    >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">삭제</span>
                    </button>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-200 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 rounded-lg bg-pink-600 text-white font-bold hover:bg-pink-700 shadow-md transition-all flex items-center gap-2"
                        >
                            <Save size={18} />
                            저장하기
                        </button>
                    </div>
                </div>

                {/* Confirm Overlay */}
                {isDeleting && (
                    <div className="absolute inset-0 z-50 bg-white/95 flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">정말 삭제하시겠습니까?</h4>
                        <p className="text-gray-500 mb-8 max-w-[240px] break-keep leading-relaxed">
                            이 작업은 되돌릴 수 없으며, 세션의 모든 데이터가 영구적으로 삭제됩니다.
                        </p>
                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={confirmDelete}
                                className="w-full py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                네, 모두 삭제합니다
                            </button>
                            <button
                                onClick={() => setIsDeleting(false)}
                                className="w-full py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionSettingsModal;
