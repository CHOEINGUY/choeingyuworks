import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { User } from '../types';
import DynamicProfileForm from '../components/profile/renderer/DynamicProfileForm';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import PageTitle from '../components/common/PageTitle';


const MOCK_PREMIUM_PARTNER: User = {
    id: 'mock_premium_1',
    name: '김지수',
    nickname: '지수',
    age: 28,
    gender: 'F',
    job: 'UX 디자이너',
    location: '서울시 강남구',
    mbti: 'ENFP',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    tags: ['전시회 관람', '필라테스', '맛집 탐방', '여행'],
    introduction: "안녕하세요! 새로운 사람들과 대화 나누는 것을 좋아하는 디자이너입니다. \n주말에는 예쁜 카페를 찾아다니거나 운동을 즐겨요. \n서로 긍정적인 에너지를 주고받을 수 있는 분을 만나고 싶습니다 :)",
    role: 'user',
    sessionId: 'mock_session_premium',
    status: 'approved',
    phoneNumber: '010-0000-0000',
    createdAt: new Date().toISOString()
};

const PremiumPartnerViewer = () => {
    const [partner, setPartner] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const fetchPartner = async () => {
            try {
                const searchParams = new URLSearchParams(window.location.search);
                const userId = searchParams.get('userId');

                if (userId) {
                    // 1. Find Match securely (Lookup maleId or femaleId)
                    const matchesRef = collection(db, 'premium_matches');
                    const qMale = query(matchesRef, where('maleId', '==', userId));
                    const qFemale = query(matchesRef, where('femaleId', '==', userId));

                    const [maleSnap, femaleSnap] = await Promise.all([getDocs(qMale), getDocs(qFemale)]);

                    let matchData = null;
                    let partnerId = null;

                    if (!maleSnap.empty) {
                        matchData = maleSnap.docs[0].data();
                        partnerId = matchData.femaleId;
                    } else if (!femaleSnap.empty) {
                        matchData = femaleSnap.docs[0].data();
                        partnerId = matchData.maleId;
                    }

                    if (partnerId) {
                        // 2. Fetch Partner Profile from premium_pool
                        const partnerRef = doc(db, 'premium_pool', partnerId);
                        const partnerSnap = await getDoc(partnerRef);

                        if (partnerSnap.exists()) {
                            setPartner({ ...partnerSnap.data(), id: partnerSnap.id } as User);
                        } else {
                            console.warn("Partner profile not found in premium_pool");
                            setPartner(MOCK_PREMIUM_PARTNER);
                        }
                    } else {
                        console.warn("No match found for this userId");
                        setPartner(MOCK_PREMIUM_PARTNER);
                    }
                } else {
                    // If no userId, showing mock for simulation
                    setPartner(MOCK_PREMIUM_PARTNER);
                }
            } catch (error) {
                console.error("Failed to fetch premium partner securely", error);
                setPartner(MOCK_PREMIUM_PARTNER);
            } finally {
                setLoading(false);
            }
        };

        fetchPartner();
    }, []);

    // If loading, show a nice loading screen
    if (loading) {
        return (
            <div className="fixed inset-0 w-full h-[100dvh] bg-black flex items-center justify-center" style={{ touchAction: 'none' }}>
                <div className={`w-full h-full max-w-[480px] bg-white relative overflow-hidden flex flex-col items-center justify-center`}>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <Heart className="w-16 h-16 text-rose-400 fill-rose-100" strokeWidth={1.5} />
                    </motion.div>
                    <p className="mt-4 text-gray-500 font-medium text-sm animate-pulse">매칭된 상대를 불러오고 있습니다...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 w-full h-[100dvh] bg-black flex items-center justify-center" style={{ touchAction: 'none' }}>
            <PageTitle title="파트너 찾기 | Dating App" />
            <div className={`w-full h-full max-w-[480px] bg-white relative overflow-hidden flex flex-col shadow-2xl`}>



                {/* 
                    Directly render DynamicProfileForm in readonly mode.
                    We treat this page AS the profile card.
                    No list view, just the single profile.
                */}
                <DynamicProfileForm
                    readonly={true}
                    targetUserId={partner?.id}
                    configId="premium" // [FIX] Force load Premium Profile Config (Design Settings)
                    // For the single view, 'onClose' might not be needed or could redirect home/back
                    onClose={() => window.history.back()}
                />

            </div>
        </div>
    );
};

export default PremiumPartnerViewer;
