import React, { useState, useEffect } from 'react';
import { X, Calendar, Type, Users, RefreshCcw, CheckCircle2 } from 'lucide-react';

interface AddSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (session: { title: string; date: string; type: string }) => void;
    isDark?: boolean;
    defaultType?: 'ROTATION' | 'PARTY';
    lockType?: boolean;
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({ isOpen, onClose, onSave, isDark, defaultType, lockType }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('14:00');
    const [sessionType, setSessionType] = useState<'ROTATION' | 'PARTY'>('ROTATION'); // 'ROTATION' | 'PARTY'

    // Reset when opened
    useEffect(() => {
        if (isOpen) {
            setTitle('');
            // Set default date to next Saturday
            const today = new Date();
            const nextSat = new Date(today.setDate(today.getDate() + (6 - today.getDay() + 7) % 7));
            setDate(nextSat.toISOString().split('T')[0]);
            setTime('14:00');
            setSessionType(defaultType || 'ROTATION');
        }
    }, [isOpen, defaultType]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !date || !time) return;

        // Format date string to match app convention: "YYYY-MM-DD HH:mm"
        const formattedDate = `${date} ${time}`;
        onSave({
            title,
            date: formattedDate,
            type: sessionType
        });
    };



    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className={`w-full max-w-lg p-6 rounded-3xl shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200 ${isDark ? 'bg-slate-900 text-white border border-slate-700' : 'bg-white text-gray-900'}`} onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">새 세션 추가</h3>
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-slate-800 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Session Type Selector */}
                    <div className="space-y-2">
                        <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>콘텐츠 타입</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => !lockType && setSessionType('ROTATION')}
                                disabled={lockType && sessionType !== 'ROTATION'}
                                className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${sessionType === 'ROTATION'
                                    ? (isDark ? 'border-pink-500 bg-pink-500/10' : 'border-pink-500 bg-pink-50')
                                    : (isDark ? 'border-slate-700 hover:border-slate-600 bg-slate-800' : 'border-gray-200 hover:border-gray-300 bg-gray-50')
                                    } ${lockType && sessionType !== 'ROTATION' ? 'opacity-30 cursor-not-allowed' : ''}`}
                            >
                                <div className={`p-3 rounded-full ${sessionType === 'ROTATION' ? 'bg-pink-500 text-white' : (isDark ? 'bg-slate-700 text-gray-400' : 'bg-white text-gray-400')}`}>
                                    <RefreshCcw size={20} />
                                </div>
                                <div className="text-center">
                                    <div className={`text-sm font-bold ${sessionType === 'ROTATION' ? (isDark ? 'text-pink-400' : 'text-pink-600') : ''}`}>로테이션 소개팅</div>
                                    <div className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>타이머 / 매칭 / 자리이동</div>
                                </div>
                                {sessionType === 'ROTATION' && <div className="absolute top-2 right-2 text-pink-500"><CheckCircle2 size={16} fill="currentColor" className="text-white" /></div>}
                            </button>

                            <button
                                type="button"
                                onClick={() => !lockType && setSessionType('PARTY')}
                                disabled={lockType && sessionType !== 'PARTY'}
                                className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${sessionType === 'PARTY'
                                    ? (isDark ? 'border-purple-500 bg-purple-500/10' : 'border-purple-500 bg-purple-50')
                                    : (isDark ? 'border-slate-700 hover:border-slate-600 bg-slate-800' : 'border-gray-200 hover:border-gray-300 bg-gray-50')
                                    } ${lockType && sessionType !== 'PARTY' ? 'opacity-30 cursor-not-allowed' : ''}`}
                            >
                                <div className={`p-3 rounded-full ${sessionType === 'PARTY' ? 'bg-purple-500 text-white' : (isDark ? 'bg-slate-700 text-gray-400' : 'bg-white text-gray-400')}`}>
                                    <Users size={20} />
                                </div>
                                <div className="text-center">
                                    <div className={`text-sm font-bold ${sessionType === 'PARTY' ? (isDark ? 'text-purple-400' : 'text-purple-600') : ''}`}>프라이빗 파티</div>
                                    <div className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>게스트리스트 / 입퇴장 관리</div>
                                </div>
                                {sessionType === 'PARTY' && <div className="absolute top-2 right-2 text-purple-500"><CheckCircle2 size={16} fill="currentColor" className="text-white" /></div>}
                            </button>
                        </div>
                    </div>

                    {/* Title Input */}
                    <div className="space-y-1.5">
                        <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>세션 이름</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="예: 1월 3주차"
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${isDark
                                    ? 'bg-slate-900/50 border-slate-600 focus:border-pink-500 text-white placeholder-gray-600'
                                    : 'bg-gray-50 border-gray-200 focus:border-pink-500 text-gray-900 placeholder-gray-400'
                                    }`}
                                autoFocus
                            />
                            <Type size={18} className={`absolute left-3 top-3.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        </div>
                    </div>

                    {/* Date & Time Input */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>날짜</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${isDark
                                        ? 'bg-slate-900/50 border-slate-600 focus:border-pink-500 text-white [color-scheme:dark]'
                                        : 'bg-gray-50 border-gray-200 focus:border-pink-500 text-gray-900'
                                        }`}
                                />
                                <Calendar size={18} className={`absolute left-3 top-3.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>시간</label>
                            <div className="flex gap-2">
                                <select
                                    value={time.split(':')[0]}
                                    onChange={(e) => {
                                        const newHour = e.target.value;
                                        const currentMin = time.split(':')[1] || '00';
                                        setTime(`${newHour}:${currentMin}`);
                                    }}
                                    className={`flex-1 px-4 py-3 rounded-xl border outline-none transition-all text-center appearance-none ${isDark
                                        ? 'bg-slate-900/50 border-slate-600 focus:border-pink-500 text-white'
                                        : 'bg-gray-50 border-gray-200 focus:border-pink-500 text-gray-900'
                                        }`}
                                >
                                    {Array.from({ length: 24 }).map((_, i) => {
                                        const h = i.toString().padStart(2, '0');
                                        return <option key={h} value={h}>{h}시</option>;
                                    })}
                                </select>
                                <select
                                    value={time.split(':')[1]}
                                    onChange={(e) => {
                                        const currentHour = time.split(':')[0] || '00';
                                        const newMin = e.target.value;
                                        setTime(`${currentHour}:${newMin}`);
                                    }}
                                    className={`flex-1 px-4 py-3 rounded-xl border outline-none transition-all text-center appearance-none ${isDark
                                        ? 'bg-slate-900/50 border-slate-600 focus:border-pink-500 text-white'
                                        : 'bg-gray-50 border-gray-200 focus:border-pink-500 text-gray-900'
                                        }`}
                                >
                                    {[0, 10, 20, 30, 40, 50].map(m => {
                                        const minStr = m.toString().padStart(2, '0');
                                        return <option key={minStr} value={minStr}>{minStr}분</option>;
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 py-3 rounded-xl font-bold transition-colors ${isDark
                                ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim() || !date || !time}
                            className="flex-1 py-3 rounded-xl font-bold text-white bg-pink-600 hover:bg-pink-700 transition-all shadow-lg shadow-pink-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            세션 생성
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSessionModal;
