import React from 'react';
import { CheckCircle, X, Smartphone, CalendarDays } from 'lucide-react';
import { getAge } from '../../../utils/ageUtils';
import { User } from '../../../types';

interface AdminCheckInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (userId: string, isCheckingIn: boolean) => void;
    user: User | null;
    isCheckingIn: boolean;
}

const AdminCheckInModal: React.FC<AdminCheckInModalProps> = ({ isOpen, onClose, onConfirm, user, isCheckingIn }) => {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <CheckCircle size={20} />
                        참석 확인
                    </h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="text-center">

                        <h2 className="text-2xl font-bold text-gray-900">{user.name} 님</h2>
                        <p className="text-gray-500 text-sm mt-1">입장을 처리하시겠습니까?</p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
                        <div className="flex items-center gap-3">
                            <CalendarDays size={18} className="text-gray-400 shrink-0" />
                            <div className="flex-1">
                                <span className="text-xs text-gray-400 font-medium block">나이/생년월일</span>
                                <span className="text-gray-800 font-semibold">
                                    {user.birthDate || user.birth_date || user.birthYear ? (
                                        <>
                                            {// @ts-ignore
                                            }
                                            {user.birthDate || user.birth_date || user.birthYear} ({getAge(user)}세)
                                        </>
                                    ) : '정보 없음'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Smartphone size={18} className="text-gray-400 shrink-0" />
                            <div className="flex-1">
                                <span className="text-xs text-gray-400 font-medium block">연락처</span>
                                <span className="text-gray-800 font-semibold tracking-wide">
                                    {user.phone || '정보 없음'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {user.isCheckedIn && (
                        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 border border-green-100">
                            <span>✅ 현재 체크인 완료 상태입니다.</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={() => {
                            // If currently checked in, we are cancelling (so pass false).
                            // If not checked in, we are checking in (so pass true).
                            onConfirm(user.id, !user.isCheckedIn);
                        }}
                        disabled={isCheckingIn}
                        className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${user.isCheckedIn
                            ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                            } `}
                    >
                        {isCheckingIn ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                처리 중...
                            </>
                        ) : (user.isCheckedIn ? '체크인 취소' : '체크인 확인')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminCheckInModal;
