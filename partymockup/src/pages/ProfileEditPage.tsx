import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'sonner';

import { getProfileTheme } from '../constants/profileTheme';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import { User } from '../types';
import PageTitle from '../components/common/PageTitle';


export interface FormData {
    nickname: string;
    age: string | number;
    gender: string;
    job: string;
    mbti: string;
    religion: string;
    smoking: string;
    drinking: string;
    pets: string;
    hobbies: string[];
    pros: string;
    introduction: string;
    idealTypePersonality: string;
    idealTypeAppearance: string;
    // [key: string]: any; // Removed loose typing
}

const ProfileEditPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // 1. Resolve Params with Fallbacks
    const userId = searchParams.get('userId') || searchParams.get('key');

    // UI States
    // If we have data from navigation state, we don't need to load
    const initialData = location.state?.userData;

    // [NEW] Get Context from Navigation OR URL Params
    const collectionParam = searchParams.get('collection');
    const isPremiumParam = searchParams.get('type') === 'premium';



    // Resolve Session & Gender (Priority: URL -> State -> DB Data -> Default)
    const sessionId = searchParams.get('session') || initialData?.sessionId || null;
    const paramGender = searchParams.get('gender') || initialData?.gender || 'M';

    const [isLoading, setIsLoading] = useState(!initialData);
    const [isSaving, setIsSaving] = useState(false);

    // State for reveal animation
    const [isRevealing, setIsRevealing] = useState(false);

    // Helper to parse hobbies
    const parseHobbies = (hobbiesData: string | string[]) => {
        let loadedHobbies = hobbiesData || [];
        if (typeof loadedHobbies === 'string') {
            loadedHobbies = loadedHobbies.split(',').map(s => s.trim()).filter(Boolean);
        }
        return loadedHobbies;
    };

    // State for form data
    const [formData, setFormData] = useState<FormData>({
        nickname: initialData?.name || initialData?.nickname || '',
        age: initialData?.age || '28',
        gender: initialData?.gender || paramGender,
        job: initialData?.job || '개발자 (예시)',
        mbti: initialData?.mbti || '',
        religion: initialData?.religion || '',
        smoking: initialData?.smoking || '',
        drinking: initialData?.drinking || '',
        pets: initialData?.pets || '',
        hobbies: initialData ? parseHobbies(initialData.hobbies) : [],
        pros: initialData?.pros || '',
        introduction: initialData?.introduction || '',
        idealTypePersonality: initialData?.idealTypePersonality || '',
        idealTypeAppearance: initialData?.idealTypeAppearance || ''
    });

    // [NEW] Smart Collection State
    const [activeCollection, setActiveCollection] = useState(collectionParam || location.state?.collectionName || 'users');
    const [isPremiumState, setIsPremiumState] = useState(isPremiumParam || location.state?.isPremium || false);

    useEffect(() => {
        // If we already have initialData, skip fetch unless userId changed (unlikely in this flow)
        if (initialData) return;

        const fetchUserData = async () => {
            if (!userId) {
                setIsLoading(false);
                return;
            }
            try {
                // 1. Try 'users' collection first (or specified collection)
                let targetCollection = activeCollection;
                let docRef = doc(db, targetCollection, userId);
                let docSnap = await getDoc(docRef);

                // 2. If not found and no specific collection was forced, try 'premium_pool'
                if (!docSnap.exists() && !collectionParam) {
                    const premiumRef = doc(db, 'premium_pool', userId);
                    const premiumSnap = await getDoc(premiumRef);
                    if (premiumSnap.exists()) {
                        docSnap = premiumSnap;
                        targetCollection = 'premium_pool';
                        setActiveCollection('premium_pool');
                        setIsPremiumState(true);
                    }
                }

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    // Simplify Hobbies Logic (DB might have string or array)
                    let loadedHobbies = data.hobbies || [];
                    if (typeof loadedHobbies === 'string') {
                        loadedHobbies = loadedHobbies.split(',').map(s => s.trim()).filter(Boolean);
                    }

                    setFormData(prev => ({
                        ...prev,
                        ...data,
                        nickname: data.name || data.nickname || '',
                        gender: data.gender || paramGender,
                        hobbies: loadedHobbies
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [userId, paramGender]); // Removed collectionName dependency to avoid loops

    const handleInputChange = (field: keyof FormData, value: string | number | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        // 1. Double Click Prevention
        if (isSaving || isRevealing) return;

        // 2. Validation
        if (!formData.nickname.trim()) {
            toast.error("닉네임을 입력해주세요.");
            return;
        }

        setIsSaving(true);

        try {
            // Smart Wait: Minimum 1.5s delay + Save Operation
            const minDelay = new Promise(resolve => setTimeout(resolve, 1500));

            // [FIX] Use Active Collection Name found during fetch
            if (userId) {
                // Prepare answers object for compatibility
                const answers: Record<string, any> = {};
                Object.entries(formData).forEach(([key, val]) => {
                    answers[key] = val;
                });

                const savePromise = setDoc(doc(db, activeCollection, userId), {
                    ...formData,
                    answers: answers, // Dynamic compatibility
                    ...(sessionId ? { sessionId } : {}), // Only save sessionId if exists
                    status: initialData?.status || 'pending',
                    updatedAt: new Date(),
                    ...(isPremiumState ? { type: 'premium' } : {})
                }, { merge: true });

                // 3. Pre-fetch Partners (Optimization) - ONLY FOR STANDARD USERS
                let fetchPartnersPromise = Promise.resolve([]);

                if (!isPremiumState) {
                    const myGender = formData.gender;
                    const oppositeGender = myGender === 'M' ? 'F' : 'M';

                    fetchPartnersPromise = (async () => {
                        const q = query(
                            collection(db, 'users'),
                            where('sessionId', '==', sessionId),
                            where('gender', '==', oppositeGender)
                        );
                        const snapshot = await getDocs(q);
                        return snapshot.docs.map(doc => {
                            const u = doc.data() as User;
                            const resolvedImage = u.avatar || u.image || '';
                            return {
                                ...u,
                                id: doc.id,
                                age: (() => {
                                    if (u.age) return (u.age || '20대').toString(); // 기존 age 필드 우선
                                    if (u.birthDate && u.birthDate.length === 8) {
                                        const year = parseInt(u.birthDate.substring(0, 4));
                                        return (new Date().getFullYear() - year + 1).toString();
                                    }
                                    return '20대';
                                })(),
                                avatar: resolvedImage,
                                image: resolvedImage,
                                hobbies: Array.isArray(u.hobbies) ? u.hobbies : (typeof u.hobbies === 'string' ? (u.hobbies as string).split(',').filter(Boolean) : [])
                            } as User;
                        }) as any;
                    })();
                }

                const [_, __, preloadedPartners] = await Promise.all([minDelay, savePromise, fetchPartnersPromise]);

                // ANCHOR: Trigger Glass Reveal Animation
                setIsSaving(false); // Stop saving spinner

                // [NEW] Premium Flow: Alert and Return
                if (isPremiumState) {
                    toast.success("프로필이 성공적으로 저장되었습니다.\n매니저가 매칭을 진행할 예정입니다.");
                    // Go back to Invite Page (or stay)
                    const queryString = `?key=${userId}`;
                    navigate(`/invite${queryString}`);
                    return;
                }

                // Standard Flow: Effect
                setIsRevealing(true); // Start Mist Effect

                setTimeout(() => {
                    const queryString = `?key=${userId}`;
                    // Pass preloaded data to next page
                    navigate(`/partners${queryString}`, {
                        state: {
                            preloadedPartners,
                            currentUser: { ...formData, name: formData.nickname, sessionId }
                        }
                    });
                }, 800); // Wait for transition
            }
        } catch (error: any) {
            console.error("Save failed:", error);
            toast.error("저장 실패: " + error.message);
            setIsSaving(false);
        }
    };

    // Theme Configuration
    const theme = getProfileTheme(formData.gender || 'M');

    // Flip Animation Logic
    // 1. Initialize synchronously to avoid flash (FOUC)
    const [flipStyle, setFlipStyle] = useState(() => {
        if (location.state?.isFlipTransition) {
            return {
                transform: 'rotateY(90deg)',
                transition: 'none'
            };
        }
        return {};
    });

    useEffect(() => {
        // 2. Animate to 0deg after mount
        if (location.state?.isFlipTransition) {
            // Double rAF ensures the browser paints the initial state (90deg)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setFlipStyle({
                        transform: 'rotateY(0deg)',
                        transition: 'transform 300ms ease-out'
                    });
                });
            });
        }
    }, [location.state?.isFlipTransition]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-pink-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">프로필 정보를 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 overflow-hidden" style={{ perspective: '1200px' }}>
            <PageTitle title="프로필 수정 | Dating App" />

            {/* Mist Overlay (Glass Reveal) */}

            <div
                className={`fixed inset - 0 z - 50 pointer - events - none transition - all duration - 1000 ease -in -out
                ${isRevealing ? 'backdrop-blur-[20px] bg-white/60 opacity-100' : 'backdrop-blur-none bg-transparent opacity-0'} `}
            />

            <div
                className={`min - h - screen ${theme.bg} pb - 20 transition - all duration - 1000 ease -in -out
                    ${isRevealing ? 'scale-95 blur-md' : ''} `}
                style={{
                    transformOrigin: 'center center',
                    backfaceVisibility: 'hidden',
                    ...flipStyle,
                    ...(isRevealing ? { transform: 'scale(0.95)' } : {})
                }}
            >
                {/* Header */}
                <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">프로필 작성</h1>
                    <div className="w-8"></div>
                </header>


                <ProfileEditForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    theme={theme}
                    handleSubmit={handleSubmit}
                    isSaving={isSaving}
                    isRevealing={isRevealing}
                />
            </div>
        </div>
    );
};

export default ProfileEditPage;
