"use client";

import { Square, CheckSquare, CheckCircle2 } from 'lucide-react';
import type { MockGuest } from './types';

interface MockGuestTableProps {
    guests: MockGuest[];
    selectedIds: string[];
    onRowClick: (guest: MockGuest) => void;
    onCheckClick: (guest: MockGuest) => void;
}

export function MockGuestTable({ guests, selectedIds, onRowClick, onCheckClick }: MockGuestTableProps) {
    return (
        <div className="w-full overflow-x-auto scrollbar-thin pb-10">
            <table className="min-w-full divide-y divide-slate-100 table-fixed">
                <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                        <th className="w-8 py-2.5 text-center text-slate-400"><div className="flex items-center justify-center"><Square size={14} /></div></th>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase w-[90px]">이름 / 나이</th>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase w-[100px]">연락처</th>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase w-[50px]">초대장</th>
                        <th className="px-2 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase w-[50px]">입금</th>
                        <th className="px-2 py-2 text-right text-[10px] font-semibold text-slate-500 uppercase w-[60px]">승인</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {guests.map((guest) => {
                        const isSelected = selectedIds.includes(guest.id);
                        return (
                            <tr
                                key={guest.id}
                                onClick={() => onRowClick(guest)}
                                className={`transition-all group cursor-pointer ${guest.isNew ? 'bg-pink-50/80 animate-pulse' : isSelected ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}`}
                            >
                                <td className="py-1.5 text-center text-slate-300" onClick={(e) => { e.stopPropagation(); onCheckClick(guest); }}>
                                    <div className={`flex items-center justify-center ${isSelected ? 'text-indigo-600' : 'group-hover:text-slate-400'}`}>
                                        {isSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                                    </div>
                                </td>
                                <td className="px-2 py-1.5">
                                    <div className="flex flex-col">
                                        <span className={`text-[11px] font-medium truncate ${guest.isNew ? 'text-pink-700' : isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                                            {guest.name} {guest.isNew && <span className="text-[9px] text-pink-500 ml-1">NEW</span>}
                                        </span>
                                        <span className="text-[9px] text-slate-400">{guest.age}세</span>
                                    </div>
                                </td>
                                <td className="px-2 py-1.5"><span className="text-[10px] text-slate-400 font-mono tracking-tight">{guest.phone}</span></td>
                                <td className="px-2 py-1.5">
                                    <span className={`text-[9px] ${guest.inviteSent ? 'text-blue-600 font-medium' : 'text-slate-300'}`}>
                                        {guest.inviteSent ? '발송됨' : '-'}
                                    </span>
                                </td>
                                <td className="px-2 py-1.5">
                                    <span className={`text-[9px] font-medium ${guest.paymentStatus === 'confirmed' ? 'text-green-600' : guest.paymentStatus === 'pending' ? 'text-amber-600' : 'text-slate-300'}`}>
                                        {guest.paymentStatus === 'confirmed' ? '완료' : guest.paymentStatus === 'pending' ? '대기' : '-'}
                                    </span>
                                </td>
                                <td className="px-2 py-1.5 text-right">
                                    <div className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${guest.status === 'approved' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-yellow-50 border-yellow-100 text-yellow-600'}`}>
                                        {guest.status === 'approved' ? '승인' : '대기'}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
