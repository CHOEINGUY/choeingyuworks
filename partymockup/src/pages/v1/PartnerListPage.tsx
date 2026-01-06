import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

import ProfileCard from '../../components/ProfileCard';
import PartnerListItem from '../../components/partner/v1/PartnerListItem';
import { User } from '../../types';

// Helper to determine opposite gender
const getOppositeGender = (gender: string) => (gender === 'M' ? 'F' : 'M');

const PartnerListPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Secure: Get key (userId) from URL, then fetch their session/gender from DB
    const urlKey = searchParams.get('key') || searchParams.get('userId');

    // State for Current User Context
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [partners, setPartners] = useState<User[]>([]);
    const [sessionData, setSessionData] = useState<any>(null); // Real Session Data

    // UI States
    const [selectedPartner, setSelectedPartner] = useState<User | null>(null);

    const location = useLocation();

    useEffect(() => {
        const fetchContextAndPartners = async () => {
            // 0. Optimization: Use Preloaded Data
            if (location.state?.preloadedPartners && location.state?.currentUser) {
                setPartners(location.state.preloadedPartners);
                setCurrentUser(location.state.currentUser);

                // Still need session info for Title if not passed (Future optim: pass session too)
                if (location.state.currentUser.sessionId) {
                    try {
                        const sSnap = await getDoc(doc(db, 'sessions', location.state.currentUser.sessionId));
                        if (sSnap.exists()) setSessionData(sSnap.data());
                    } catch (e) { console.error(e); }
                }

                setLoading(false);
                return;
            }

            if (!urlKey) {
                setLoading(false);
                return;
            }

            try {
                // 1. Fetch Current User Data first (Security Check)
                const userRef = doc(db, 'users', urlKey);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    console.error("User not found");
                    setLoading(false);
                    return;
                }

                const userData = userSnap.data() as User;
                setCurrentUser(userData);

                const mySessionId = userData.sessionId;
                const myGender = userData.gender;

                if (!mySessionId || !myGender) {
                    setLoading(false);
                    return;
                }

                // 1.5 Fetch Session Info
                try {
                    const sessionSnap = await getDoc(doc(db, 'sessions', mySessionId));
                    if (sessionSnap.exists()) {
                        setSessionData(sessionSnap.data());
                    }
                } catch (e) {
                    console.error("Session fetch error", e);
                }

                // 2. Fetch Partners based on SECURE data
                const q = query(
                    collection(db, 'users'),
                    where('sessionId', '==', mySessionId),
                    where('gender', '==', getOppositeGender(myGender))
                );

                const snapshot = await getDocs(q);
                const displayData = snapshot.docs.map(doc => {
                    const u = doc.data() as User;
                    const resolvedImage = u.avatar || u.image || '';

                    return {
                        ...u,
                        id: doc.id,
                        // Normalize potential differences
                        age: u.birthYear ? (new Date().getFullYear() - u.birthYear + 1).toString() : (u.age || '20대'),
                        avatar: resolvedImage, // Ensure ProfileCard sees the correct image
                        image: resolvedImage,  // Ensure List Item sees the correct image
                        hobbies: Array.isArray(u.hobbies) ? u.hobbies : (typeof u.hobbies === 'string' ? (u.hobbies as string).split(',').filter(Boolean) : [])
                    };
                });

                setPartners(displayData);

            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContextAndPartners();
    }, [urlKey, location.state]);

    const handleCardClick = (partner: User) => {
        setSelectedPartner(partner);
    };

    const closeTargetModal = () => {
        setSelectedPartner(null);
    };

    if (!urlKey && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-center">
                <div>
                    <p className="text-gray-500 mb-4">잘못된 접근입니다.</p>
                    <button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">홈으로 돌아가기</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative animate-fade-in">
            <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex items-center justify-center">
                <div className="text-center w-full">
                    <h1 className="text-lg font-bold text-gray-800">
                        {sessionData ? sessionData.title : "참가자 리스트"}
                    </h1>
                    <p className="text-sm text-rose-400 font-medium">인연을 미리 확인하세요</p>
                </div>
            </header>

            <main className="p-4 pb-24">
                {loading ? (
                    // Skeleton Loading State
                    <div className="grid grid-cols-1 gap-4 animate-pulse">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center">
                                <div className="w-16 h-16 rounded-full bg-gray-200" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                                    <div className="h-4 bg-gray-200 rounded w-1/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {partners.map((partner) => (
                            <PartnerListItem
                                key={partner.id}
                                user={partner}
                                onClick={handleCardClick}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Bottom Floating Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-10">
                <button
                    onClick={() => navigate(`/invite?key=${urlKey}`)}
                    className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform"
                >
                    초대장으로 돌아가기
                </button>
            </div>

            {/* Detail Modal */}
            {selectedPartner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={closeTargetModal}
                    ></div>
                    {/* Modal Content Container */}
                    <div className="relative w-full max-w-sm max-h-[85vh] flex flex-col animate-slide-in-up">
                        {/* 
                            Floating Close Button - Moved OUTSIDE the card content to prevent overlap
                            Positioned slightly above-right of the card component
                        */}
                        <button
                            onClick={closeTargetModal}
                            className="absolute -top-12 right-0 z-30 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-colors border border-white/30"
                        >
                            <X size={24} />
                        </button>

                        <div className="overflow-y-auto rounded-3xl scrollbar-hide shadow-2xl">
                            <ProfileCard user={selectedPartner} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartnerListPage;
