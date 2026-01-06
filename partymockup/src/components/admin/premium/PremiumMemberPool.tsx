import React, { useState, useMemo } from 'react';
import { User, Filter, Search, ChevronDown, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    useDroppable,
    DragEndEvent,
    DragStartEvent
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { getAge } from '../../../utils/ageUtils'; // [NEW]
import { usePremiumMemberFilter } from '../../../hooks/usePremiumMemberFilter'; // [NEW]
import ApplicantProfileDetail from '../common/ApplicantProfileDetail';
import MemberListItem from './pool/MemberListItem';
import DetailedWorkbenchCard from './pool/DetailedWorkbenchCard';
import { Applicant } from '../../../types';
import { PremiumMember } from '../../../types/premium';

// --- Droppable Column ---
interface DroppableColumnProps {
    items: PremiumMember[];
    title: string;
    count: number;
    isDark?: boolean;
    children: React.ReactNode;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ items, title, count, isDark, children }) => {
    return (
        <div className="flex-1 flex flex-col min-w-0 h-full">
            {/* Header */}
            <div className={`px-4 py-3 border-b flex justify-between items-center ${isDark ? 'border-gray-800 bg-slate-800/50' : 'border-gray-300 bg-gray-100'}`}>
                <h3 className={`font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {title}
                </h3>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                </span>
            </div>

            {/* List Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col pb-10">
                        {children}
                        {items.length === 0 && (
                            <div className="py-20 text-center opacity-40 text-xs">
                                회원이 없습니다
                            </div>
                        )}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
};

// --- Droppable Slot ---
interface DroppableSlotProps {
    id: string;
    isOver: boolean;
    children?: React.ReactNode;
    title: string;
    icon: React.ReactNode;
    isDark?: boolean;
    borderColor: 'blue' | 'pink';
}

const DroppableSlot: React.FC<DroppableSlotProps> = ({ id, isOver, children, title, icon, isDark, borderColor }) => {
    const { setNodeRef } = useDroppable({ id });
    const activeClass = isOver
        ? (borderColor === 'blue' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-pink-500 bg-pink-50 dark:bg-pink-900/20')
        : (isDark ? 'border-gray-700 bg-slate-800' : 'border-gray-300 bg-white');

    // If children exist, we don't show the dashed border box, we just show the content (the detailed card)
    if (children) return <div ref={setNodeRef} className="w-full">{children}</div>;

    return (
        <div
            ref={setNodeRef}
            className={`w-full rounded-xl border-2 border-dashed transition-all relative overflow-hidden flex flex-col items-center justify-center p-2 min-h-[160px] ${activeClass}`}
        >
            <div className={`text-center transition-opacity ${isOver ? 'opacity-50' : 'opacity-30'}`}>
                <div className="mb-2 flex justify-center">{icon}</div>
                <span className="text-xs font-semibold">{title}</span>
            </div>
        </div>
    );
};

interface PremiumMemberPoolProps {
    isDark?: boolean;
    applicants?: Applicant[];
    actions?: any;
    excludingIds?: string[]; // [NEW] IDs to hide from pool (e.g. active matches)
}

const PremiumMemberPool: React.FC<PremiumMemberPoolProps> = ({ isDark, applicants = [], actions, excludingIds = [] }) => {
    // 1. Filter Approved Members & Exclude Active Matches
    const initialApproved = useMemo(() => {
        return applicants
            .filter(app => (app as any).status === 'approved')
            .filter(app => !excludingIds.includes(app.id)) as PremiumMember[];
    }, [applicants, excludingIds]);

    // 2. Enhanced State - Workbench Items
    // Workbench state remains local as it's UI state for the drag-drop area
    const [wbItems, setWbItems] = useState<PremiumMember[]>([]);

    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedMember, setSelectedMember] = useState<PremiumMember | null>(null);

    // 3. Use Custom Hook for Logic
    const {
        filteredMembers,
        searchTerm, setSearchTerm,
        isSmartMatch, setIsSmartMatch,
        isFilterOpen, setIsFilterOpen,
        filters, setFilters,
        sortBy, setSortBy
    } = usePremiumMemberFilter(initialApproved, wbItems);

    // Helper: Check if profile is ready (Has intro or extended info)
    const checkProfileReady = (member: PremiumMember) => {
        // If 'introduction' exists and is not empty, assume profile filled.
        const intro = (member as any).introduction;

        // For strictness, let's look for 'introduction' which is a profile-only field usually.
        return !!intro;
    };



    // Filter Logic splitting available vs exhausted
    const maleMembers = filteredMembers.filter(m => m.gender === 'M' && !wbItems.find(w => w.id === m.id) && (m.ticketCount === undefined || m.ticketCount > 0));
    const maleExhausted = filteredMembers.filter(m => m.gender === 'M' && !wbItems.find(w => w.id === m.id) && (m.ticketCount !== undefined && m.ticketCount <= 0));

    const femaleMembers = filteredMembers.filter(m => m.gender === 'F' && !wbItems.find(w => w.id === m.id) && (m.ticketCount === undefined || m.ticketCount > 0));
    const femaleExhausted = filteredMembers.filter(m => m.gender === 'F' && !wbItems.find(w => w.id === m.id) && (m.ticketCount !== undefined && m.ticketCount <= 0));

    // Match Action Controls
    const addToWorkbench = (member: PremiumMember) => {
        setWbItems(prev => {
            // Remove existing member of same gender
            const others = prev.filter(p => p.gender !== member.gender);
            return [...others, member];
        });
    };

    const removeFromWorkbench = (id: string) => setWbItems(prev => prev.filter(item => item.id !== id));

    const handleConfirmMatch = async () => {
        const male = wbItems.find(i => i.gender === 'M');
        const female = wbItems.find(i => i.gender === 'F');

        if (!male || !female) {
            toast.error("남녀 회원을 모두 선택해주세요.");
            return;
        }

        console.log("Creating Match:", male.id, female.id);
        if (actions?.createMatch) {
            await actions.createMatch(male.id, female.id);
        } else {
            toast.success("매칭이 확정되었습니다", {
                description: `${male.name}님과 ${female.name}님의 매칭이 생성되었습니다.`
            });
        }
        // Clear workbench after match
        setWbItems([]);
    };

    // DnD Logic
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;
        const item = initialApproved.find(i => i.id === active.id);
        if (!item) return;

        const maleSlot = over.id === 'slot-male';
        const femaleSlot = over.id === 'slot-female';

        if (maleSlot && item.gender === 'M') addToWorkbench(item);
        else if (femaleSlot && item.gender === 'F') addToWorkbench(item);
        else if (over.id === 'male-pool' || over.id === 'female-pool') removeFromWorkbench(item.id);
    };

    const activeItem = initialApproved.find(i => i.id === activeId);
    const maleSlotItem = wbItems.find(i => i.gender === 'M');
    const femaleSlotItem = wbItems.find(i => i.gender === 'F');

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className={`h-full flex flex-col ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                {/* 1. Top Bar: Toolbar */}
                <div className={`shrink-0 px-6 py-4 flex items-center justify-between border-b ${isDark ? 'border-gray-800 bg-slate-800/50' : 'border-gray-300 bg-gray-100'}`}>
                    <div className="flex items-center gap-6">
                        <h2 className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>회원 풀</h2>
                        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
                        <div className="relative group">
                            <Search className={`absolute left-0 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} size={16} />
                            <input
                                type="text"
                                placeholder="회원 검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`pl-7 py-2 w-64 bg-transparent border-b outline-none text-sm transition-all focus:w-80 ${isDark ? 'border-gray-700 text-gray-200 placeholder-gray-600 focus:border-gray-500' : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-400'
                                    }`}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className={`appearance-none pl-3 pr-8 py-1.5 rounded-md text-sm font-medium outline-none cursor-pointer ${isDark
                                    ? 'bg-slate-800 text-gray-200 border border-gray-700 hover:border-gray-600'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <option value="newest">최신순</option>
                                <option value="oldest">오래된순</option>
                                <option value="ageAsc">나이 적은순</option>
                                <option value="ageDesc">나이 많은순</option>
                            </select>
                            <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={14} />
                        </div>
                        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isFilterOpen
                                ? (isDark ? 'text-gray-100 bg-gray-800' : 'text-gray-900 bg-gray-200')
                                : (isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100')
                                }`}
                        >
                            <Filter size={14} />
                            <span>필터</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                {isFilterOpen && (
                    <div className={`px-6 py-4 border-b grid grid-cols-3 gap-8 animate-in slide-in-from-top-2 duration-200 ${isDark ? 'border-gray-800 bg-slate-900' : 'border-gray-400 bg-white'}`}>
                        {/* 1. Basic Demographics */}
                        <div className="flex flex-col gap-4">
                            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>기본 정보</h4>
                            <div className="space-y-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>지역</label>
                                    <input type="text" className={`w-full bg-transparent border-b py-1 text-sm outline-none transition-colors ${isDark ? 'border-gray-700 text-gray-200 focus:border-blue-500' : 'border-gray-200 text-gray-900 focus:border-blue-500'}`} placeholder="지역 검색 (예: 강남)" value={filters.location} onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>직업</label>
                                    <input type="text" className={`w-full bg-transparent border-b py-1 text-sm outline-none transition-colors ${isDark ? 'border-gray-700 text-gray-200 focus:border-blue-500' : 'border-gray-200 text-gray-900 focus:border-blue-500'}`} placeholder="직업 검색" value={filters.job} onChange={(e) => setFilters(prev => ({ ...prev, job: e.target.value }))} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>나이 범위</label>
                                    <div className="flex items-center gap-2">
                                        <input type="number" placeholder="최소" className={`w-full bg-transparent border-b py-1 text-sm outline-none text-center transition-colors ${isDark ? 'border-gray-700 text-gray-200 focus:border-blue-500' : 'border-gray-200 text-gray-900 focus:border-blue-500'}`} value={filters.minAge} onChange={(e) => setFilters(prev => ({ ...prev, minAge: e.target.value }))} />
                                        <span className="text-gray-400">-</span>
                                        <input type="number" placeholder="최대" className={`w-full bg-transparent border-b py-1 text-sm outline-none text-center transition-colors ${isDark ? 'border-gray-700 text-gray-200 focus:border-blue-500' : 'border-gray-200 text-gray-900 focus:border-blue-500'}`} value={filters.maxAge} onChange={(e) => setFilters(prev => ({ ...prev, maxAge: e.target.value }))} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Lifestyle Filters */}
                        <div className="flex flex-col gap-4">
                            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>성향 / 스타일</h4>
                            <div className="space-y-3">
                                {/* Drinking */}
                                <div className="flex flex-col gap-1.5">
                                    <label className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>음주 스타일</label>
                                    <div className="flex gap-2">
                                        {[
                                            { label: '전체', value: '' },
                                            { label: '비음주', value: 'none' },
                                            { label: '음주', value: 'drinker' }
                                        ].map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setFilters(prev => ({ ...prev, drinking: opt.value }))}
                                                className={`flex-1 py-1.5 text-xs rounded border transition-colors ${filters.drinking === opt.value
                                                    ? (isDark ? 'bg-blue-900/30 border-blue-500 text-blue-400' : 'bg-blue-50 border-blue-500 text-blue-600 font-bold')
                                                    : (isDark ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50')
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Smoking */}
                                <div className="flex flex-col gap-1.5">
                                    <label className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>흡연 여부</label>
                                    <div className="flex gap-2">
                                        {[
                                            { label: '전체', value: '' },
                                            { label: '비흡연', value: 'no' },
                                            { label: '흡연', value: 'yes' }
                                        ].map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setFilters(prev => ({ ...prev, smoking: opt.value }))}
                                                className={`flex-1 py-1.5 text-xs rounded border transition-colors ${filters.smoking === opt.value
                                                    ? (isDark ? 'bg-blue-900/30 border-blue-500 text-blue-400' : 'bg-blue-50 border-blue-500 text-blue-600 font-bold')
                                                    : (isDark ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50')
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Relationship Goal (Mock Data / Keyword Search?) - For now simple select if field exists, else placeholder */}
                                <div className="flex flex-col gap-1.5">
                                    <label className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>연애 스타일 (준비중)</label>
                                    <select disabled className={`w-full bg-transparent border-b py-1 text-sm outline-none opacity-50 cursor-not-allowed ${isDark ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                                        <option>데이터 연동 필요</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 3. Matching Tools */}
                        <div className="flex flex-col gap-4">
                            <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>매칭 도구</h4>
                            <div className={`p-4 rounded-xl border flex flex-col gap-3 ${isDark ? 'bg-slate-800/50 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={16} className="text-purple-500" />
                                        <span className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>스마트 매칭</span>
                                    </div>
                                    <button
                                        onClick={() => setIsSmartMatch(!isSmartMatch)}
                                        className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${isSmartMatch ? 'bg-purple-500' : (isDark ? 'bg-gray-700' : 'bg-gray-300')}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${isSmartMatch ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    워크벤치에 선택된 회원을 기준으로 <br />
                                    <span className="font-bold">이상형, 흡연, 음주 성향</span>이<br />
                                    잘 맞는 상대를 <strong>자동 필터링</strong>합니다.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Main Content */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Left: Male Pool */}
                    <div className={`flex-1 flex flex-col min-w-0 border-r ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
                        <DroppableColumn items={maleMembers} title="남성 회원" count={maleMembers.length} isDark={isDark}>
                            {maleMembers.map(m => (
                                <MemberListItem
                                    key={m.id}
                                    member={m}
                                    isDark={isDark}
                                    onClick={setSelectedMember}
                                    onAddToWorkbench={addToWorkbench}
                                    isProfileReady={checkProfileReady(m)}
                                />
                            ))}
                            {maleExhausted.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700 px-2">
                                    <div className="text-xs font-bold text-gray-400 mb-2 flex justify-between">
                                        <span>이용권 소진 ({maleExhausted.length})</span>
                                    </div>
                                    <div className="opacity-50 grayscale pointer-events-none select-none">
                                        {maleExhausted.map(m => (
                                            <MemberListItem
                                                key={m.id}
                                                member={m}
                                                isDark={isDark}
                                                onClick={() => { }} // Disabled
                                                onAddToWorkbench={() => { }} // Disabled
                                                isProfileReady={false} // Force inactive look
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </DroppableColumn>
                    </div>

                    {/* Middle: Workbench */}
                    <div className={`w-[400px] shrink-0 flex flex-col z-10 ${isDark ? 'bg-slate-900 border-x border-gray-800' : 'bg-white border-x border-gray-300'}`}>
                        <div className="h-full flex flex-col p-6 overflow-y-auto scrollbar-thin">
                            <div className="flex items-center gap-2 mb-6 justify-center">
                                <Sparkles size={16} className="text-purple-500" />
                                <span className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>매칭 워크벤치</span>
                            </div>

                            <div className="flex-1 flex flex-col gap-6">
                                <DroppableSlot id="slot-male" isOver={activeItem?.gender === 'M'} title="남성 회원" icon={<User size={20} />} isDark={isDark} borderColor="blue">
                                    {maleSlotItem && (
                                        <DetailedWorkbenchCard
                                            member={maleSlotItem}
                                            isDark={isDark}
                                            onRemove={removeFromWorkbench}
                                            onClick={setSelectedMember}
                                        />
                                    )}
                                </DroppableSlot>

                                {/* Connector */}
                                <div className="flex items-center justify-center gap-2">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />
                                </div>

                                <DroppableSlot id="slot-female" isOver={activeItem?.gender === 'F'} title="여성 회원" icon={<User size={20} />} isDark={isDark} borderColor="pink">
                                    {femaleSlotItem && (
                                        <DetailedWorkbenchCard
                                            member={femaleSlotItem}
                                            isDark={isDark}
                                            onRemove={removeFromWorkbench}
                                            onClick={setSelectedMember}
                                        />
                                    )}
                                </DroppableSlot>
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={handleConfirmMatch}
                                    disabled={wbItems.length < 2}
                                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-200 border ${wbItems.length >= 2
                                        ? (isDark ? 'bg-white text-black border-white hover:bg-gray-100' : 'bg-black text-white border-black hover:bg-gray-800')
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-transparent cursor-not-allowed'
                                        }`}
                                >
                                    매칭 확정
                                </button>
                                {wbItems.length < 2 && (
                                    <p className="text-[10px] text-center mt-3 text-gray-400">
                                        매칭할 남/녀 회원을 워크벤치에 추가해주세요
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Female Pool */}
                    <div className={`flex-1 flex flex-col min-w-0 border-l ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
                        <DroppableColumn items={femaleMembers} title="여성 회원" count={femaleMembers.length} isDark={isDark}>
                            {femaleMembers.map(m => (
                                <MemberListItem
                                    key={m.id}
                                    member={m}
                                    isDark={isDark}
                                    onClick={setSelectedMember}
                                    onAddToWorkbench={addToWorkbench}
                                    isProfileReady={checkProfileReady(m)}
                                />
                            ))}
                            {femaleExhausted.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700 px-2">
                                    <div className="text-xs font-bold text-gray-400 mb-2 flex justify-between">
                                        <span>이용권 소진 ({femaleExhausted.length})</span>
                                    </div>
                                    <div className="opacity-50 grayscale pointer-events-none select-none">
                                        {femaleExhausted.map(m => (
                                            <MemberListItem
                                                key={m.id}
                                                member={m}
                                                isDark={isDark}
                                                onClick={() => { }} // Disabled
                                                onAddToWorkbench={() => { }} // Disabled
                                                isProfileReady={false} // Force inactive look
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </DroppableColumn>
                    </div>
                </div>

                <DragOverlay dropAnimation={null}>
                    {activeItem ? (
                        <div className={`px-3 py-3 rounded border shadow-xl w-[280px] flex items-center gap-3 ${isDark ? 'bg-slate-800 border-gray-700' : 'bg-white border-gray-300'}`}>

                            <div className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{activeItem.name}</div>
                        </div>
                    ) : null}
                </DragOverlay>

                {/* Detail Modal */}
                {selectedMember && (
                    <ApplicantProfileDetail
                        user={selectedMember}
                        isDark={isDark}
                        isPremiumContext={true}
                        onClose={() => setSelectedMember(null)}
                        onSave={async (data: any) => {
                            if (selectedMember && actions.updateApplicant) {
                                await actions.updateApplicant(selectedMember.id, data);
                                return true;
                            }
                            return false;
                        }}
                    />
                )}
            </div>
        </DndContext>
    );
};

export default PremiumMemberPool;
