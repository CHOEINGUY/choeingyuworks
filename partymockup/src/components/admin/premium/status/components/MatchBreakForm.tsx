import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface MatchBreakFormProps {
    isBreaking: boolean;
    breakReason: string;
    refundTicket: boolean;
    isDark?: boolean;
    setBreakReason: (val: string) => void;
    setRefundTicket: (val: boolean) => void;
    onConfirmBreak: () => void;
    onCancel: () => void;
    maleName?: string;
    femaleName?: string;
}

const MatchBreakForm: React.FC<MatchBreakFormProps> = ({
    isBreaking, breakReason, refundTicket, isDark, setBreakReason, setRefundTicket, onConfirmBreak, onCancel, maleName, femaleName
}) => {
    if (!isBreaking) return null;

    return (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl animate-in fade-in slide-in-from-bottom-2">
            <h4 className="text-red-600 font-bold mb-3 flex items-center gap-2">
                <AlertTriangle size={18} /> 매칭 파기 및 환불 처리
            </h4>

            <div className="space-y-3">
                <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1">파기 사유</label>
                    <select
                        value={breakReason}
                        onChange={(e) => setBreakReason(e.target.value)}
                        className={`w-full p-2 rounded border text-sm ${isDark ? 'bg-slate-800 border-gray-700' : 'bg-white border-gray-300'}`}
                    >
                        <option value="profile_rejected">프로필 거절 (사진/조건)</option>
                        <option value="ghosting">상대방 연락 두절 (잠수)</option>
                        <option value="admin_error">관리자 실수/오류</option>
                        <option value="simple_change">단순 변심</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="refundTicket"
                            checked={refundTicket}
                            onChange={(e) => setRefundTicket(e.target.checked)}
                            className="rounded text-red-500 focus:ring-red-500"
                        />
                        <label htmlFor="refundTicket" className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            보유 이용권 자동 반환 (Rollback)
                        </label>
                    </div>
                    {refundTicket && (
                        <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded text-xs font-bold text-red-700 dark:text-red-400 ml-6">
                            ⚠️ {maleName || '남성'}님과 {femaleName || '여성'}님에게 이용권 1매가 각각 즉시 반환됩니다.
                        </div>
                    )}
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={onConfirmBreak}
                        className="flex-1 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 text-sm"
                    >
                        매칭 파기 확정
                    </button>
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 bg-gray-200 text-gray-700 font-bold rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 text-sm"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchBreakForm;
