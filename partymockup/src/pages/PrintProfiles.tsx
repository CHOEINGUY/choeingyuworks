import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Sparkles, MapPin } from 'lucide-react';
import { User } from '../types';

const PrintProfiles: React.FC = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!sessionId) return;
            try {
                const q = query(collection(db, 'users'), where('sessionId', '==', sessionId));
                const snap = await getDocs(q);
                const userList = snap.docs.map(d => ({ id: d.id, ...d.data() } as User));

                // Sort: Male first, then Female (or by Name?) -> Let's do by Name for now
                userList.sort((a, b) => {
                    if (a.gender !== b.gender) return a.gender === 'M' ? -1 : 1; // Men first
                    return a.name.localeCompare(b.name);
                });

                setUsers(userList);
            } catch (error) {
                console.error("Failed to fetch users for print:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [sessionId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="text-center p-10 font-bold text-xl">데이터 준비 중...</div>;

    if (users.length === 0) return <div className="text-center p-10 font-bold text-xl">출력할 참가자가 없습니다.</div>;

    return (
        <div className="bg-gray-100 min-h-screen p-8 print:p-0 print:bg-white">
            {/* Control Bar (Hidden in Print) */}
            <div className="max-w-screen-lg mx-auto mb-8 flex justify-between items-center print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">프로필 카드 인쇄 미리보기</h1>
                    <p className="text-gray-600">총 {users.length}명의 참가자 (B6 사이즈 최적화)</p>
                </div>
                <button
                    onClick={handlePrint}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    인쇄하기
                </button>
            </div>

            {/* Print Area */}
            <div className="max-w-[128mm] mx-auto print:max-w-none print:mx-0">
                {users.map((user, idx) => (
                    <PrintCard key={user.id} user={user} isLast={idx === users.length - 1} />
                ))}
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    @page {
                        size: B6 portrait;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        background: white;
                        -webkit-print-color-adjust: exact;
                    }
                    .print-break-after {
                        page-break-after: always;
                    }
                }
            `}</style>
        </div>
    );
};

const PrintCard = ({ user, isLast }: { user: User, isLast: boolean }) => {
    const isMale = user.gender === 'M';
    const themeColor = isMale ? '#3b82f6' : '#ec4899'; // Blue-500 : Pink-500
    const bgColor = isMale ? '#eff6ff' : '#fdf2f8'; // Blue-50 : Pink-50
    const borderColor = isMale ? '#dbeafe' : '#fce7f3'; // Blue-100 : Pink-100

    return (
        <div
            className={`w-[128mm] h-[182mm] bg-white relative overflow-hidden flex flex-col p-8 print:w-full print:h-[100vh] ${!isLast ? 'print-break-after' : ''} mb-8 print:mb-0 shadow-lg print:shadow-none mx-auto`}
            style={{ border: `4px solid ${borderColor}` }}
        >
            {/* Header Decoration */}
            <div
                className="absolute top-0 left-0 right-0 h-3"
                style={{ backgroundColor: themeColor }}
            />

            {/* Header: Name & Basic Info (No Image) */}
            <div className="mt-6 mb-6 text-center">
                <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight" style={{ fontFamily: 'Pretendard, sans-serif' }}>
                    {user.name}
                </h2>
                <div className="flex justify-center items-center gap-3 text-gray-600 font-medium">
                    <span className="text-xl">{user.age ? `${user.age}세` : '나이 비공개'}</span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                    <span className="text-xl">{user.job || '직업 비공개'}</span>
                </div>
            </div>

            {/* Grid Info Box (Compact) */}
            <div
                className="w-full rounded-2xl p-5 mb-5 grid grid-cols-2 gap-x-6 gap-y-3 border border-gray-100"
                style={{ backgroundColor: bgColor }}
            >
                {/* MBTI & Location */}
                <div className="flex items-center gap-3">
                    <Sparkles size={18} className="text-gray-400" />
                    <span className="font-bold text-gray-800 text-lg">{user.mbti || '-'}</span>
                </div>
                <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-gray-400" />
                    <span className="font-medium text-gray-800 text-lg">{user.location || user.residence || '-'}</span>
                </div>

                <div className="col-span-2 h-px bg-black/5 my-1"></div>

                {/* Details Grid */}
                <InfoRow label="종교" value={user.religion} />
                <InfoRow label="음주" value={user.drinking} />
                <InfoRow label="취미" value={Array.isArray(user.hobbies) ? user.hobbies.join(', ') : (user.hobbies as string) || ''} />
                <InfoRow label="흡연" value={user.smoking} />
            </div>

            {/* Scaleable Content Area */}
            <div className="w-full flex-1 flex flex-col gap-4 min-h-0">

                {/* Self Intro */}
                <div className="flex flex-col flex-1">
                    <h3 className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider pl-1">Self Introduction</h3>
                    <div className="text-gray-800 text-base leading-relaxed p-4 rounded-xl border border-gray-100 bg-gray-50 italic text-center flex-1 flex items-center justify-center font-serif relative overflow-hidden">
                        <span className="absolute top-2 left-2 text-4xl text-gray-200 font-serif">"</span>
                        {user.introduction || user.bio || '안녕하세요! 반가워요.'}
                        <span className="absolute bottom-2 right-2 text-4xl text-gray-200 font-serif">"</span>
                    </div>
                </div>

                {/* Charm & Ideal Type */}
                {(user.pros || user.idealTypePersonality || user.idealTypeAppearance) && (
                    <div className="flex flex-col shrink-0">
                        <h3 className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider pl-1">More About Me</h3>
                        <div className={`text-sm p-4 rounded-xl border ${isMale ? 'bg-blue-50 border-blue-100' : 'bg-pink-50 border-pink-100'} flex flex-col gap-2`}>
                            {user.pros && (
                                <div className="flex gap-2">
                                    <span className={`font-bold shrink-0 ${isMale ? 'text-blue-600' : 'text-pink-600'}`}>매력:</span>
                                    <span className="text-gray-700">{user.pros}</span>
                                </div>
                            )}
                            {(user.idealTypePersonality || user.idealTypeAppearance) && (
                                <div className="flex gap-2 border-t border-black/5 pt-2 mt-1">
                                    <span className={`font-bold shrink-0 ${isMale ? 'text-blue-600' : 'text-pink-600'}`}>이상형:</span>
                                    <span className="text-gray-700">
                                        {[user.idealTypePersonality, user.idealTypeAppearance].filter(Boolean).join(' / ')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="w-full mt-auto pt-6 border-t border-gray-100 flex justify-center items-end">
                <div className="flex items-center gap-2 text-gray-300">
                    {isMale ? <span className="text-xl">♂</span> : <span className="text-xl">♀</span>}
                    <span className="text-xs font-bold uppercase tracking-[0.3em]">Dating App Profile</span>
                </div>

            </div>
        </div>
    );
};

// Helper Component for Info Grid
const InfoRow = ({ label, value, className = "" }: { label: string, value: string | undefined, className?: string }) => (
    <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-xs text-gray-400 shrink-0 w-8">{label}</span>
        <span className="text-sm font-medium text-gray-800 truncate">{value || '-'}</span>
    </div>
);

export default PrintProfiles;
