import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { User } from '../types';
import { getThemeStyles } from '../constants/formThemes';
import DynamicProfileForm from '../components/profile/renderer/DynamicProfileForm';
import { AnimatePresence, motion } from 'framer-motion';

import { User as UserIcon } from 'lucide-react';
import PageTitle from '../components/common/PageTitle';


const MOCK_PARTNERS: User[] = [
    {
        id: 'mock_1',
        name: '김서연',
        age: 28,
        gender: 'F',
        job: 'UX 디자이너',
        mbti: 'ENFP',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        tags: ['여행', '맛집탐방', '사진'],
        role: 'user',
        sessionId: 'mock_session',
        status: 'approved',
        phoneNumber: '010-0000-0000',
        createdAt: new Date().toISOString()
    },
    {
        id: 'mock_2',
        name: '이준호',
        age: 31,
        gender: 'M',
        job: '개발자',
        mbti: 'INTJ',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        tags: ['코딩', '독서', '게임'],
        role: 'user',
        sessionId: 'mock_session',
        status: 'approved',
        phoneNumber: '010-0000-0000',
        createdAt: new Date().toISOString()
    },
    {
        id: 'mock_3',
        name: '박지민',
        age: 26,
        gender: 'F',
        job: '마케터',
        mbti: 'ESFJ',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        tags: ['운동', '카페', '강아지'],
        role: 'user',
        sessionId: 'mock_session',
        status: 'approved',
        phoneNumber: '010-0000-0000',
        createdAt: new Date().toISOString()
    },
    {
        id: 'mock_4',
        name: '최현수',
        age: 33,
        gender: 'M',
        job: '변호사',
        mbti: 'ENTJ',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        tags: ['와인', '골프', '드라이브'],
        role: 'user',
        sessionId: 'mock_session',
        status: 'approved',
        phoneNumber: '010-0000-0000',
        createdAt: new Date().toISOString()
    }
];

const PartnerMultiViewer = () => {
    const [partners, setPartners] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    // Theme for the viewer list - use a default or customizable
    const themeStyles = getThemeStyles('indigo', 'light');

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                // Check if we should force mock data (e.g. for testing)
                const searchParams = new URLSearchParams(window.location.search);
                const mockMode = searchParams.get('mock') === 'true';

                if (mockMode || partners.length === 0) { // Fallback to mock if desired or empty initially
                    // For now, let's try real fetch first.
                }

                const urlKey = searchParams.get('key') || searchParams.get('userId');

                // If no key is provided, show mock data for demo purposes
                if (!urlKey) {
                    console.log("No user key found, loading mock data.");
                    setPartners(MOCK_PARTNERS);
                    setLoading(false);
                    return;
                }

                // Fetch current user to get their session
                const userRef = doc(db, 'users', urlKey);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    console.log("User not found, loading mock data.");
                    setPartners(MOCK_PARTNERS); // Fallback to mock
                    setLoading(false);
                    return;
                }

                const userData = userSnap.data() as User;
                const mySessionId = userData.sessionId;
                const myGender = userData.gender;
                const targetGender = myGender === 'M' ? 'F' : 'M';

                // Fetch Partners
                const q = query(
                    collection(db, 'users'),
                    where('sessionId', '==', mySessionId),
                    where('gender', '==', targetGender)
                );

                const snapshot = await getDocs(q);

                if (snapshot.empty) {
                    console.log("No partners found, loading mock data.");
                    setPartners(MOCK_PARTNERS);
                } else {
                    const data = snapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id
                    })) as User[];
                    setPartners(data);
                }

            } catch (error) {
                console.error("Failed to fetch partners", error);
                // Fallback to mock on error
                setPartners(MOCK_PARTNERS);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

    const handleCardClick = (userId: string) => {
        setSelectedUserId(userId);
    };

    const closeViewer = () => {
        setSelectedUserId(null);
    };

    return (
        <div className="fixed inset-0 w-full h-[100dvh] bg-black flex items-center justify-center" style={{ touchAction: 'none' }}>
            <PageTitle title="파트너 찾기 | Dating App" />
            <div className={`w-full h-full max-w-[480px] ${themeStyles.bg_app} relative overflow-hidden flex flex-col shadow-2xl`}>


                {/* Header */}
                <header className="sticky top-0 z-10 px-6 py-5 bg-white/80 backdrop-blur-md border-b border-gray-100/50 flex-none">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className={`text-xl font-black ${themeStyles.text_primary}`}>오늘의 파트너</h1>
                            <p className={`text-xs font-medium ${themeStyles.text_tertiary} mt-0.5`}>마음에 드는 분을 확인해보세요</p>
                        </div>
                    </div>
                </header>

                {/* List - Scrollable Area */}
                <main className="flex-1 overflow-y-auto p-4 pb-20 scrollbar-hide">
                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 bg-gray-200 rounded-2xl w-full" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {partners.map(user => (
                                <motion.div
                                    key={user.id}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleCardClick(user.id)}
                                    className={`bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow`}
                                >
                                    <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center">
                                        {(user.image || user.avatar) ? (
                                            <img
                                                src={user.image || user.avatar}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <UserIcon className="text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`text-lg font-bold ${themeStyles.text_primary} truncate`}>{user.name}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium`}>
                                                {user.age ? `${user.age}세` : '나이 비공개'}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {user.mbti && (
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${themeStyles.soft_bg} ${themeStyles.soft_text}`}>
                                                    {user.mbti}
                                                </span>
                                            )}
                                            {user.job && (
                                                <span className="text-[10px] font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-600">
                                                    {user.job}
                                                </span>
                                            )}
                                            {(!user.mbti && !user.job) && (
                                                <span className="text-xs text-gray-400">프로필 정보 없음</span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </main>

                {/* Viewer Modal - Rendered nicely inside the mobile frame */}
                <AnimatePresence>
                    {selectedUserId && (
                        <motion.div
                            initial={{ opacity: 0, y: '100%' }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute inset-0 z-50 bg-white"
                        >
                            <DynamicProfileForm
                                readonly={true}
                                targetUserId={selectedUserId}
                                onClose={closeViewer}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PartnerMultiViewer;
