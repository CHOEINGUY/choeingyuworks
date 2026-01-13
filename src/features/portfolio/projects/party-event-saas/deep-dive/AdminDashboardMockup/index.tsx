"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from 'react';

import type { MockGuest } from './types';
import { MockToast, type ToastType } from './MockToast';
import { MockDetailModal } from './MockDetailModal';
import { MockMessageSelectModal } from './MockMessageSelectModal';
import { MockGuestTable } from './MockGuestTable';
import { MockSmartDock } from './MockSmartDock';

// Initial Guest Data (Male)
const createInitialGuests = (): MockGuest[] => {
    const maleNames = ['이서준', '박도현', '최시우', '정건우', '강지훈', '조현우', '윤우진', '장서원', '임도윤', '신예준'];
    // Realistic pattern: most confirmed, some pending, one none
    const paymentPatterns: Array<'confirmed' | 'pending' | 'none'> = [
        'confirmed', 'confirmed', 'pending', 'confirmed', 'confirmed', 
        'confirmed', 'pending', 'confirmed', 'confirmed', 'none'
    ];
    return maleNames.map((name, i) => ({
        id: `m-${i}`,
        name,
        age: 26 + i,
        phone: `010-1234-${1001 + i}`,
        gender: 'M' as const,
        status: 'approved' as const,
        inviteSent: i < 3,
        paymentStatus: paymentPatterns[i],
        isNew: false
    }));
};

// New Applicant Data
const newApplicant: MockGuest = {
    id: 'new-1',
    name: '김민준',
    age: 25,
    phone: '010-1234-1000',
    gender: 'M',
    status: 'pending',
    inviteSent: false,
    paymentStatus: 'none',
    isNew: true
};

// Static Female Guests Data
const femaleGuests: MockGuest[] = [
    '이지은', '박서윤', '최지유', '한수아', '김하은', '성민지', '이채원', '정다은', '강수빈', '조예린'
].map((name, i) => ({
    id: `f-${i}`,
    name,
    age: 24 + i,
    phone: `010-5678-${2000 + i}`,
    gender: 'F' as const,
    status: 'approved' as const,
    inviteSent: i < 4,
    paymentStatus: i < 6 ? 'confirmed' as const : 'pending' as const,
    isNew: false
}));

export function AdminDashboardMockup() {
    // State
    const [guests, setGuests] = useState<MockGuest[]>(createInitialGuests());
    const [selectedGuest, setSelectedGuest] = useState<MockGuest | null>(null);
    const [selectedCheckIds, setSelectedCheckIds] = useState<string[]>([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<ToastType>('success');
    const [loadingDockAction, setLoadingDockAction] = useState(false);
    const [msgSelectModalOpen, setMsgSelectModalOpen] = useState(false);

    // Handlers
    const handleApprove = useCallback(() => {
        if (!selectedGuest) return;
        setGuests(prev => prev.map(g =>
            g.id === selectedGuest.id ? { ...g, status: 'approved', isNew: false } : g
        ));
        setSelectedGuest(prev => prev ? { ...prev, status: 'approved', isNew: false } : null);
    }, [selectedGuest]);

    const handleSendInvites = useCallback((templateId: string) => {
        setMsgSelectModalOpen(false);
        setLoadingDockAction(true);

        setTimeout(() => {
            // Update guests to mark invites as sent
            setGuests(prev => prev.map(g =>
                selectedCheckIds.includes(g.id) ? { ...g, inviteSent: true } : g
            ));
            setLoadingDockAction(false);
            setToastMessage(`${selectedCheckIds.length}명에게 초대장이 발송되었습니다.`);
            setShowToast(true);
            setSelectedCheckIds([]);
        }, 1200);
    }, [selectedCheckIds]);

    const toggleCheck = useCallback((guest: MockGuest) => {
        setSelectedCheckIds(prev =>
            prev.includes(guest.id) ? prev.filter(id => id !== guest.id) : [...prev, guest.id]
        );
    }, []);

    // Automation Sequence
    useEffect(() => {
        const resetDemo = () => {
            setGuests(createInitialGuests());
            setSelectedGuest(null);
            setSelectedCheckIds([]);
            setShowToast(false);
            setMsgSelectModalOpen(false);
            setLoadingDockAction(false);
        };

        const runSequence = async () => {
            await new Promise(r => setTimeout(r, 1500));

            // Scene 1: New Applicant Appears with Toast
            setGuests(prev => [{ ...newApplicant }, ...prev]);
            setToastType('new-applicant');
            setToastMessage(`${newApplicant.name}님이 신청했습니다!`);
            setShowToast(true);
            await new Promise(r => setTimeout(r, 2200)); // Wait for toast to be visible
            setShowToast(false); // Close toast before next action
            await new Promise(r => setTimeout(r, 500));

            // Scene 2: Open Profile & Approve
            setSelectedGuest({ ...newApplicant });
            await new Promise(r => setTimeout(r, 2000));

            // Approve action
            setGuests(prev => prev.map(g =>
                g.id === newApplicant.id ? { ...g, status: 'approved', isNew: false } : g
            ));
            setSelectedGuest(prev => prev ? { ...prev, status: 'approved', isNew: false } : null);
            await new Promise(r => setTimeout(r, 1000));

            setSelectedGuest(null);
            await new Promise(r => setTimeout(r, 800));

            // Scene 3: Select uninvited guests & Send
            const uninvited = ['new-1', 'm-3', 'm-4']; // Select 3 uninvited
            setSelectedCheckIds([uninvited[0]]);
            await new Promise(r => setTimeout(r, 400));
            setSelectedCheckIds([uninvited[0], uninvited[1]]);
            await new Promise(r => setTimeout(r, 400));
            setSelectedCheckIds(uninvited);
            await new Promise(r => setTimeout(r, 800));

            // Open Message Modal
            setMsgSelectModalOpen(true);
            await new Promise(r => setTimeout(r, 1500));

            // Send Invites
            setMsgSelectModalOpen(false);
            setLoadingDockAction(true);
            await new Promise(r => setTimeout(r, 1200));

            setGuests(prev => prev.map(g =>
                uninvited.includes(g.id) ? { ...g, inviteSent: true } : g
            ));
            setLoadingDockAction(false);
            setToastType('success');
            setToastMessage("3명에게 초대장이 발송되었습니다.");
            setShowToast(true);
            setSelectedCheckIds([]);

            // Reset & Loop
            await new Promise(r => setTimeout(r, 4000));
            resetDemo();
            setTimeout(runSequence, 500);
        };

        const timer = setTimeout(runSequence, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            className="w-full relative p-2 md:p-3 rounded-[1.5rem] bg-[#F0F5FF] border border-white/50 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            {/* Browser Window */}
            <div className="w-full aspect-[16/10] bg-white rounded-xl shadow-xl border border-slate-200/50 flex flex-col overflow-hidden relative z-10 font-sans">
                {/* Browser Header (Thin Address Bar Style) */}
                <div className="h-10 bg-gray-50/50 border-b border-slate-100 flex items-center px-4 justify-center relative shrink-0 rounded-t-xl">
                    {/* Mock dots (very subtle) */}

                    {/* Address Bar */}
                    <div className="bg-white px-6 py-1 rounded-full border border-slate-100 text-[10px] text-slate-400 font-medium tracking-tight flex items-center gap-1.5 shadow-sm">
                        <span className="opacity-50 select-none">https://</span>
                        admin.partner.party
                    </div>
                </div>

                {/* Header Content */}
                <div className="h-14 px-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-20">
                    <div className="flex items-center gap-4">
                        <h1 className="text-sm font-bold text-slate-800">
                            12/24 솔로 크리스마스
                            <span className="ml-2 text-xs font-normal text-slate-400">2024.12.24</span>
                        </h1>
                        <div className="h-3 w-px bg-slate-200" />
                        <div className="flex gap-3 text-[11px]">
                            <span className="text-slate-500">전체 <strong className="text-slate-800">{guests.length}</strong></span>
                            <span className="text-slate-500">승인 <strong className="text-green-600">{guests.filter(g => g.status === 'approved').length}</strong></span>
                        </div>
                    </div>
                    <div className="w-32 h-7 bg-slate-50 rounded-md border border-slate-100" />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden bg-white">
                    <div className="flex-1 flex overflow-hidden relative pr-[50px]">
                        <div className="flex-1 flex min-h-0 divide-x divide-slate-100">
                            {/* Male Column */}
                            <div className="flex-1 flex flex-col bg-white">
                                <div className="px-4 py-2 border-b border-slate-50 bg-slate-50/30">
                                    <h3 className="font-bold text-slate-700 text-[11px]">
                                        남성 게스트 <span className="text-[10px] font-normal text-slate-400">({guests.length})</span>
                                    </h3>
                                </div>
                                <div className="flex-1 overflow-y-auto p-0 scrollbar-thin">
                                    <MockGuestTable
                                        guests={guests}
                                        selectedIds={selectedCheckIds}
                                        onRowClick={setSelectedGuest}
                                        onCheckClick={toggleCheck}
                                    />
                                </div>
                            </div>
                            {/* Female Column */}
                            <div className="flex-1 flex-col bg-white hidden lg:flex">
                                <div className="px-4 py-2 border-b border-slate-50 bg-slate-50/30">
                                    <h3 className="font-bold text-slate-700 text-[11px]">
                                        여성 게스트 <span className="text-[10px] font-normal text-slate-400">(21)</span>
                                    </h3>
                                </div>
                                <div className="flex-1 overflow-y-auto p-0 scrollbar-thin">
                                    <MockGuestTable
                                        guests={femaleGuests}
                                        selectedIds={[]}
                                        onRowClick={() => { }}
                                        onCheckClick={() => { }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Smart Dock */}
                        <MockSmartDock
                            selectedCount={selectedCheckIds.length}
                            loadingAction={loadingDockAction}
                            onMessageClick={() => setMsgSelectModalOpen(true)}
                        />
                    </div>
                </div>

                {/* Modals placed WITHIN the z-10 container */}
                {selectedGuest && (
                    <MockDetailModal
                        guest={selectedGuest}
                        onClose={() => setSelectedGuest(null)}
                        onApprove={handleApprove}
                    />
                )}
                <MockMessageSelectModal
                    visible={msgSelectModalOpen}
                    onClose={() => setMsgSelectModalOpen(false)}
                    onSelect={handleSendInvites}
                />
                <MockToast message={toastMessage} visible={showToast} type={toastType} />
            </div>

        </motion.div>
    );
}

export default AdminDashboardMockup;
