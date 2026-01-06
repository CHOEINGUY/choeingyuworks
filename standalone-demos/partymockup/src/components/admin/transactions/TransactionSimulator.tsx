import { useState } from 'react';
import { verifyPayments } from '../../../utils/paymentMatching';
import { BankTransaction, VerificationResult } from '../../../types/transaction';
import { Applicant } from '../../../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

interface TransactionManagerProps {
    applicants: Applicant[];
}

export default function TransactionManager({ applicants }: TransactionManagerProps) {
    const [activeTab, setActiveTab] = useState<'json' | 'text'>('text');
    const [inputVal, setInputVal] = useState('');

    const [logs, setLogs] = useState<BankTransaction[]>([]);
    const [results, setResults] = useState<VerificationResult[]>([]);

    // For selecting a specific user when AMBIGUOUS or re-assigning
    const [selectedMatches, setSelectedMatches] = useState<Record<number, string>>({}); // validIdx -> userId

    // --- Parsing Logic ---
    const parseJson = () => {
        try {
            const parsed = JSON.parse(inputVal);
            if (Array.isArray(parsed)) {
                setLogs(parsed);
                alert(`JSON 파싱 성공: ${parsed.length}건`);
            } else {
                alert("JSON은 배열이어야 합니다.");
            }
        } catch (e) {
            alert("JSON 파싱 오류: " + e);
        }
    };

    const parseText = () => {
        // Basic Tab-Separated Values parser (Excel copy-paste)
        // Assumes columns: Date, Name, DepositAmount ... order might vary, so let's try a heuristic or strict format
        // Expected Format Example (Barobill Lite or standard bank excel):
        // [Date] [Time] [In/Out] [Amount] [Sender] ...
        // Let's assume user pastes columns: "Time", "Sender", "Deposit", "Withdraw", "Balance"
        // Or just simple: Date, Name, Amount.
        // Let's Ask user to paste specific columns or try to detect.

        // HEURISTIC: Tab separated. 
        // If row has date-like, number, and string.

        const lines = inputVal.split('\n').filter(l => l.trim().length > 0);
        const parsed: BankTransaction[] = [];

        lines.forEach((line, idx) => {
            const cols = line.split('\t');
            if (cols.length < 3) return; // Skip too short lines

            // Try to find Amount (number) and Date
            // This is tricky without strict column mapping. 
            // Let's enforce a simple instruction: "복사할 때 [거래일시, 기재내용, 입금액] 순서로 복사해주세요"
            // Col 0: Date
            // Col 1: Remark
            // Col 2: Amount

            const dateStr = cols[0];
            const remark = cols[1];
            const amountStr = cols[2].replace(/,/g, ''); // remove commas

            const amount = parseFloat(amountStr);
            if (isNaN(amount)) return; // Header or invalid row

            // Basic valid row
            parsed.push({
                compositeKey: `MANUAL_${Date.now()}_${idx}`, // fake key
                bankAccountNum: 'MANUAL',
                transRefKey: `ROW_${idx}`,
                transDateTime: dateStr, // Keep string or try new Date(dateStr)
                transDirection: '입금',
                deposit: amount,
                withdraw: 0,
                balance: 0,
                remark: remark
            });
        });

        setLogs(parsed);
        alert(`텍스트 파싱 성공: ${parsed.length}건 (실패 ${lines.length - parsed.length}건)`);
    };

    // --- Simulation ---
    const runSimulation = () => {
        const result = verifyPayments(logs, applicants);
        setResults(result);
        // Auto-select single matches? No, let user confirm.
    };

    // --- Actions ---
    const handleSelectUser = (resultIdx: number, userId: string) => {
        setSelectedMatches(prev => ({ ...prev, [resultIdx]: userId }));
    };

    const commitToFirebase = async (res: VerificationResult, resultIdx: number) => {
        // Determine which user is target
        let targetUser: Applicant | undefined;

        if (res.status === 'MATCHED' && res.matchedUsers.length === 1) {
            targetUser = res.matchedUsers[0];
        } else {
            // Find selected
            const selectedId = selectedMatches[resultIdx];
            if (!selectedId) {
                alert("매칭할 유저를 선택해주세요.");
                return;
            }
            targetUser = res.matchedUsers.find(u => u.id === selectedId);
        }

        if (!targetUser) return;

        if (!confirm(`${targetUser.name}님에게 입금(${res.transaction.deposit}원) 확인 처리를 하시겠습니까?`)) return;

        try {
            const userRef = doc(db, 'users', targetUser.id);

            const payload: any = {
                paymentStatus: 'paid', // Or '입금완료' based on your logic
                isDeposited: true,
                linkedTransaction: {
                    txId: res.transaction.compositeKey,
                    amount: res.transaction.deposit,
                    date: res.transaction.transDateTime,
                    sender: res.transaction.remark
                }
            };

            // If confirmed, maybe set status?
            if (!targetUser.ticketStatus || targetUser.ticketStatus === 'pending') {
                payload.ticketStatus = 'confirmed';
            }

            await updateDoc(userRef, payload);

            alert("업데이트 완료!");

            // Update local UI
            res.status = 'ALREADY_PROCESSED';
            setResults([...results]);

        } catch (e) {
            console.error(e);
            alert("업데이트 실패: " + e);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">입금 확인 매니저 (Manual)</h2>
                <div className="text-sm text-gray-500">
                    대상 신청자: {applicants.length}명
                </div>
            </div>

            {/* Input Section */}
            <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                <div className="flex gap-4 border-b pb-2">
                    <button
                        className={`pb-1 px-2 font-medium ${activeTab === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('text')}
                    >
                        엑셀 붙여넣기
                    </button>
                    <button
                        className={`pb-1 px-2 font-medium ${activeTab === 'json' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('json')}
                    >
                        JSON 입력
                    </button>
                </div>

                <div>
                    <textarea
                        className="w-full h-32 p-3 border rounded text-xs font-mono"
                        placeholder={activeTab === 'text'
                            ? "엑셀에서 [거래일시] [기재내용(입금자명)] [입금액] 3개 열을 드래그해서 복사 후 여기에 붙여넣으세요."
                            : '[{"deposit":30000, "remark":"홍길동", ...}]'}
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setInputVal('')}
                        className="px-3 py-1.5 text-gray-500 hover:bg-gray-200 rounded text-sm"
                    >
                        초기화
                    </button>
                    <button
                        onClick={activeTab === 'text' ? parseText : parseJson}
                        className="px-4 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-800 text-sm font-bold"
                    >
                        {activeTab === 'text' ? '텍스트 파싱' : 'JSON 파싱'}
                    </button>
                </div>
            </div>

            {logs.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">거래 내역: {logs.length}건</span>
                        <button
                            onClick={runSimulation}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-bold"
                        >
                            매칭 분석 시작
                        </button>
                    </div>
                </div>
            )}

            {/* Results Table */}
            {results.length > 0 && (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full text-sm text-left divide-y divide-gray-200">
                        <thead className="bg-gray-100 text-gray-600 font-semibold">
                            <tr>
                                <th className="p-3">거래 정보</th>
                                <th className="p-3">금액</th>
                                <th className="p-3">분석 결과</th>
                                <th className="p-3">매칭 후보 / 선택</th>
                                <th className="p-3">처리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {results.map((res, idx) => (
                                <tr key={idx} className={`hover:bg-gray-50 ${res.status === 'MATCHED' ? 'bg-green-50/50' : ''}`}>
                                    {/* Info */}
                                    <td className="p-3 align-top">
                                        <div className="font-medium text-gray-900">{res.transaction.remark}</div>
                                        <div className="text-xs text-gray-500">{res.transaction.transDateTime.toString().substring(0, 16)}</div>
                                    </td>
                                    <td className="p-3 align-top font-mono">
                                        {res.transaction.deposit.toLocaleString()}
                                    </td>
                                    {/* Status Badge */}
                                    <td className="p-3 align-top">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${res.status === 'MATCHED' ? 'bg-green-100 text-green-700' :
                                            res.status === 'AMBIGUOUS' ? 'bg-orange-100 text-orange-700' :
                                                res.status === 'ALREADY_PROCESSED' ? 'bg-gray-100 text-gray-500 line-through' :
                                                    'bg-red-50 text-red-500'
                                            }`}>
                                            {res.status === 'NO_MATCH' ? '매칭 실패' :
                                                res.status === 'AMBIGUOUS' ? '중복 주의' : res.status}
                                        </span>
                                    </td>

                                    {/* Candidates */}
                                    <td className="p-3 align-top">
                                        {res.matchedUsers.length === 0 ? (
                                            <span className="text-gray-400 text-xs">-</span>
                                        ) : (
                                            <div className="space-y-1">
                                                {res.matchedUsers.map(u => (
                                                    <label key={u.id} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
                                                        <input
                                                            type="radio"
                                                            name={`match_${idx}`}
                                                            value={u.id}
                                                            checked={
                                                                // Auto-check if only 1
                                                                res.matchedUsers.length === 1 ? true : selectedMatches[idx] === u.id
                                                            }
                                                            disabled={res.matchedUsers.length === 1 || res.status === 'ALREADY_PROCESSED'}
                                                            onChange={() => handleSelectUser(idx, u.id)}
                                                            className="text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <div className="text-xs">
                                                            <span className="font-bold">{u.name}</span>
                                                            <span className="text-gray-500 mx-1">
                                                                {u.phone?.slice(-4) || 'no-phone'}
                                                            </span>
                                                            <span className="text-gray-400">
                                                                ({u.ticketPrice?.toLocaleString()}원)
                                                            </span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </td>

                                    {/* Action Button */}
                                    <td className="p-3 align-top">
                                        {res.status !== 'ALREADY_PROCESSED' && res.matchedUsers.length > 0 && (
                                            <button
                                                onClick={() => commitToFirebase(res, idx)}
                                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded shadow-sm disabled:opacity-50"
                                                disabled={res.matchedUsers.length > 1 && !selectedMatches[idx]}
                                            >
                                                승인
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
