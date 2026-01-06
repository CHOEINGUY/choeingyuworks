import React, { useState, useEffect } from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { PremiumMatch, MatchStatus } from '../../../../../types/premium';
import { Applicant } from '../../../../../types';
import { toast } from 'sonner';

interface MatchSmartStepperProps {
    match: PremiumMatch;
    maleUser?: Applicant;
    femaleUser?: Applicant;
    isDark?: boolean;
    onUpdateStatus: (id: string, status: MatchStatus, data?: any) => void;
    onExecuteAction: (action: string, user: Applicant, options?: any) => Promise<void>;
    setIsBreaking: (val: boolean) => void;
}

const MatchSmartStepper: React.FC<MatchSmartStepperProps> = ({
    match, maleUser, femaleUser, isDark, onUpdateStatus, onExecuteAction, setIsBreaking
}) => {
    // Local state for schedule input
    const [scheduleDate, setScheduleDate] = useState(match.meetingDate ? match.meetingDate.split('T')[0] : '');
    const [scheduleTime, setScheduleTime] = useState(match.meetingTime || '');
    const [location, setLocation] = useState(match.location || '');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        // Simple dirty check
        const origDate = match.meetingDate ? match.meetingDate.split('T')[0] : '';
        const origTime = match.meetingTime || '';
        const origLoc = match.location || '';
        if (scheduleDate !== origDate || scheduleTime !== origTime || location !== origLoc) {
            setHasUnsavedChanges(true);
        } else {
            setHasUnsavedChanges(false);
        }
    }, [scheduleDate, scheduleTime, location, match]);

    const handleSaveSchedule = () => {
        // [New] Date Validation
        if (!scheduleDate) {
            toast.error("만남 날짜를 입력해주세요.");
            return;
        }
        const selected = new Date(scheduleDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) {
            toast.error("과거 날짜로 일정을 잡을 수 없습니다.");
            return;
        }

        const isRescheduling = match.status === 'scheduled';

        onUpdateStatus(match.id, 'scheduled', {
            meetingDate: scheduleDate,
            meetingTime: scheduleTime,
            location: location
        });
        toast.success(isRescheduling ? "일정이 수정되었습니다. 확정 알림을 다시 보내주세요." : "일정이 저장되었습니다.");
        setHasUnsavedChanges(false);
    };

    const handleSendConfirm = async (target: 'M' | 'F') => {
        const user = target === 'M' ? maleUser : femaleUser;
        const partner = target === 'M' ? femaleUser : maleUser;
        if (!user || !partner) return;

        if (!confirm(`${user.name}님에게 일정 확정 알림을 보내시겠습니까?`)) return;

        await onExecuteAction('confirm_date', user, {
            serviceType: 'PREMIUM',
            session: { date: `${scheduleDate} ${scheduleTime}`, location },
            partnerName: partner.name || '상대',
            partnerJob: partner.job || ''
        });
        toast.success(`${user.name}님에게 발송 완료`);
    };

    const handleSendAllConfirm = async () => {
        if (!maleUser || !femaleUser) return;
        if (!confirm(`남성(${maleUser.name}), 여성(${femaleUser.name}) 모두에게 일정 확정 알림을 보내시겠습니까?`)) return;

        try {
            await Promise.all([
                onExecuteAction('confirm_date', maleUser, {
                    serviceType: 'PREMIUM',
                    session: { date: `${scheduleDate} ${scheduleTime}`, location },
                    partnerName: femaleUser.name || '상대',
                    partnerJob: femaleUser.job || ''
                }),
                onExecuteAction('confirm_date', femaleUser, {
                    serviceType: 'PREMIUM',
                    session: { date: `${scheduleDate} ${scheduleTime}`, location },
                    partnerName: maleUser.name || '상대',
                    partnerJob: maleUser.job || ''
                })
            ]);
            toast.success("양쪽 모두에게 발송 완료했습니다.");
        } catch (error) {
            console.error(error);
            toast.error("일부 발송에 실패했습니다.");
        }
    };

    // Step 2 & 3 Combined Logic for conciseness
    const renderScheduleStep = () => (
        <div className={`transition-all duration-300 rounded-2xl border overflow-hidden ${['notified', 'scheduling', 'scheduled'].includes(match.status)
            ? (isDark ? 'bg-slate-800 border-blue-500 ring-1 ring-blue-500/50' : 'bg-white border-blue-500 ring-4 ring-blue-50')
            : (isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-gray-200')
            }`}>

            {/* [NEW] Partner Rejected Alert */}
            {match.status === 'partner_rejected' && (
                <div className="bg-red-50 border-b border-red-100 p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <MessageCircle size={20} className="text-red-500" />
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-red-700">상대방이 거절했습니다</div>
                        <div className="text-xs text-red-600 mt-0.5">
                            매칭이 중단되었습니다. [종료 (실패/환불)] 버튼을 눌러 이용권을 환불하거나 매칭을 종료하세요.
                        </div>
                    </div>
                    <button
                        onClick={() => setIsBreaking(true)}
                        className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-red-700 transition-colors"
                    >
                        종료/환불 처리
                    </button>
                </div>
            )}

            <div className={`flex items-center justify-between p-4 pb-2 ${match.status === 'partner_rejected' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${match.status === 'matched'
                        ? (isDark ? 'bg-slate-700 text-slate-500' : 'bg-gray-200 text-gray-500')
                        : (['scheduled', 'completed'].includes(match.status) ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600')
                        }`}>
                        {['scheduled', 'completed'].includes(match.status) ? <CheckCircle2 size={16} /> : '2'}
                    </div>
                    <div>
                        <div className="font-bold text-base">일정 조율</div>
                        {hasUnsavedChanges && <span className="text-xs text-orange-500 font-bold ml-2">• 변경사항 있음 (저장 필요)</span>}
                    </div>
                </div>
            </div>

            <div className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                        <label className="text-xs font-bold text-gray-500 mb-1 block">날짜</label>
                        <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`} />
                    </div>
                    <div className="col-span-1">
                        <label className="text-xs font-bold text-gray-500 mb-1 block">시간</label>
                        <div className="flex gap-2">
                            <select
                                value={(scheduleTime || '00:00').split(':')[0]}
                                onChange={(e) => {
                                    const newHour = e.target.value;
                                    const currentMin = (scheduleTime || '00:00').split(':')[1] || '00';
                                    setScheduleTime(`${newHour}:${currentMin}`);
                                }}
                                className={`flex-1 p-2.5 rounded-xl border text-sm appearance-none text-center ${isDark ? 'bg-slate-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                            >
                                {Array.from({ length: 24 }).map((_, i) => {
                                    const h = i.toString().padStart(2, '0');
                                    return <option key={h} value={h}>{h}시</option>;
                                })}
                            </select>
                            <select
                                value={(scheduleTime || '00:00').split(':')[1]}
                                onChange={(e) => {
                                    const currentHour = (scheduleTime || '00:00').split(':')[0] || '00';
                                    const newMin = e.target.value;
                                    setScheduleTime(`${currentHour}:${newMin}`);
                                }}
                                className={`flex-1 p-2.5 rounded-xl border text-sm appearance-none text-center ${isDark ? 'bg-slate-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                            >
                                {!scheduleTime && <option value="">분</option>}
                                {[0, 10, 20, 30, 40, 50].map(m => {
                                    const minStr = m.toString().padStart(2, '0');
                                    return <option key={minStr} value={minStr}>{minStr}분</option>;
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label className="text-xs font-bold text-gray-500 mb-1 block">장소</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="예: 강남역 11번출구" className={`w-full p-2.5 rounded-xl border text-sm ${isDark ? 'bg-slate-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`} />
                    </div>

                    <div className="col-span-2 pt-2">
                        <button onClick={handleSaveSchedule} className={`w-full py-3 text-white font-bold rounded-xl transition-colors shadow-sm dark:shadow-none ${hasUnsavedChanges ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            {match.status === 'scheduled' ? (hasUnsavedChanges ? '변경사항 저장하기' : '일정 정보 수정하기') : '일정 확정 및 저장'}
                        </button>
                    </div>

                    {match.status === 'scheduled' && (
                        <div className="col-span-2 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                            <label className="text-xs font-bold text-gray-400 block mb-2">
                                확정 알림 발송 {hasUnsavedChanges && <span className="text-red-500">(일정 변경 후 다시 보내세요)</span>}
                            </label>
                            <div className="flex gap-2">
                                <button onClick={() => handleSendConfirm('M')} className="flex-1 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 text-xs flex items-center justify-center gap-1">
                                    <MessageCircle size={14} /> 남성에게
                                </button>
                                <button onClick={() => handleSendConfirm('F')} className="flex-1 py-2.5 bg-pink-50 text-pink-600 font-bold rounded-xl hover:bg-pink-100 text-xs flex items-center justify-center gap-1">
                                    <MessageCircle size={14} /> 여성에게
                                </button>
                                <button onClick={handleSendAllConfirm} className="flex-1 py-2.5 bg-purple-50 text-purple-600 font-bold rounded-xl hover:bg-purple-100 text-xs flex items-center justify-center gap-1">
                                    <MessageCircle size={14} /> 모두에게
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderResultStep = () => (
        <div className={`transition-all duration-300 rounded-2xl border overflow-hidden ${match.status === 'completed'
            ? (isDark ? 'bg-slate-800 border-green-500 ring-1 ring-green-500/50' : 'bg-white border-green-500 ring-4 ring-green-50')
            : (isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-gray-200')
            }`}>
            <div className="flex items-center justify-between p-4 pb-2">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${match.status === 'completed'
                        ? 'bg-green-100 text-green-600'
                        : (['matched', 'notified', 'scheduling'].includes(match.status) ? (isDark ? 'bg-slate-700 text-slate-500' : 'bg-gray-200 text-gray-500') : 'bg-green-50 text-green-500')
                        }`}>
                        {match.status === 'completed' ? <CheckCircle2 size={16} /> : '3'}
                    </div>
                    <div>
                        <div className="font-bold text-base">결과 입력 및 케어</div>
                    </div>
                </div>
            </div>

            <div className="p-4 pt-0">
                <div className="grid grid-cols-3 gap-3">
                    <button onClick={() => onUpdateStatus(match.id, 'completed', { result: 'success' })} className="py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-bold shadow-sm shadow-green-200 dark:shadow-none">
                        교제 성공
                    </button>
                    <button onClick={() => onUpdateStatus(match.id, 'completed', { result: 'keep_dating' })} className="py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 text-sm font-bold shadow-sm shadow-blue-200 dark:shadow-none">
                        만남 지속
                    </button>
                    <button onClick={() => setIsBreaking(true)} className="py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 text-sm font-bold shadow-sm dark:shadow-none">
                        종료 (실패)
                    </button>
                    {/* [New] Partner Reject Button */}
                    {match.status !== 'completed' && match.status !== 'failed' && (
                        <button onClick={() => onUpdateStatus(match.id, 'partner_rejected')} className="col-span-3 py-2 bg-red-100 text-red-600 border border-red-200 rounded-xl hover:bg-red-200 text-sm font-bold mt-2">
                            상대방 거절 (Partner Rejected)
                        </button>
                    )}
                    <p className="col-span-3 text-xs text-center text-gray-400 mt-2">
                        최종 결과를 입력하면 매칭이 종료 상태로 변경됩니다.
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            {renderScheduleStep()}
            {renderResultStep()}
        </div>
    );
};

export default MatchSmartStepper;
