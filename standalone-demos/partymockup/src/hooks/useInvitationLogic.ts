import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const useInvitationLogic = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Support both 'key' and 'userId' for backward compatibility
    const urlKey = searchParams.get('key') || searchParams.get('userId');
    const [sessionId, setSessionId] = useState<string | null>(searchParams.get('session'));

    // State for user info
    const [userInfo, setUserInfo] = useState({
        name: searchParams.get('name') || '특별한 손님',
        gender: searchParams.get('gender') || 'F'
    });
    const [fullUserData, setFullUserData] = useState<any>(null);
    const [sessionInfo, setSessionInfo] = useState<any>(null);

    // [NEW] Track which collection the user belongs to
    const [collectionName, setCollectionName] = useState('users'); // Default to users, but will auto-detect
    const [isPremium, setIsPremium] = useState(false);

    // Real-time user data listener with Auto-Detection
    useEffect(() => {
        if (!urlKey) return;

        let unsubscribe = () => { };

        const detectAndSubscribe = async () => {
            try {
                // 1. Try 'users' (Standard Rotation/Party)
                const userRef = doc(db, 'users', urlKey);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setCollectionName('users');
                    setIsPremium(false);
                    // Subscribe
                    unsubscribe = onSnapshot(userRef, (docSnap) => handleUserUpdate(docSnap, 'users'));
                    return;
                }

                // 2. Try 'premium_pool' (1:1 Match)
                const premiumRef = doc(db, 'premium_pool', urlKey);
                const premiumSnap = await getDoc(premiumRef);

                if (premiumSnap.exists()) {
                    setCollectionName('premium_pool');
                    setIsPremium(true);
                    // Subscribe
                    unsubscribe = onSnapshot(premiumRef, (docSnap) => handleUserUpdate(docSnap, 'premium_pool'));
                    return;
                }

                console.warn("User not found in any collection:", urlKey);
            } catch (err) {
                console.error("Auto-detection failed:", err);
            }
        };

        const handleUserUpdate = (docSnap: any, sourceCollection: string) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setFullUserData({ ...data, id: docSnap.id }); // Ensure ID is included
                setUserInfo({
                    name: data.name || data.nickname || '특별한 손님',
                    gender: data.gender || 'F'
                });
                // If user has a session assignment, update state
                if (data.sessionId) {
                    setSessionId(data.sessionId);
                }

                // Check-in Logic (Only for Standard mostly, but kept for compatibility)
                if (data.isCheckedIn) {
                    navigate(`/session?key=${urlKey}`);
                }
            }
        };

        detectAndSubscribe();

        return () => unsubscribe();
    }, [urlKey, navigate]);

    // Fetch Real Session Data
    useEffect(() => {
        const fetchSession = async () => {
            if (!sessionId) return;

            try {
                const sessionRef = doc(db, 'sessions', sessionId);
                const sessionSnap = await getDoc(sessionRef);

                if (sessionSnap.exists()) {
                    setSessionInfo({
                        ...sessionSnap.data(),
                        id: sessionSnap.id
                    });
                } else {
                    // Fallback for invalid session ID
                    setSessionInfo({
                        title: "초대장",
                        date: "일정 확인 중...",
                        location: "장소 안내 예정"
                    });
                }
            } catch (err) {
                console.error("Failed to fetch session:", err);
            }
        };

        fetchSession();
    }, [sessionId]);

    // Dynamic QR Code Size Logic
    const [qrSize, setQrSize] = useState(160);

    useEffect(() => {
        const handleResize = () => {
            const vh = window.innerHeight;
            const isSmallScreen = vh < 740; // Breakpoint for SE-like screens
            const ratio = isSmallScreen ? 0.22 : 0.28;

            // Reduced min size to 120 for smaller screens
            const targetSize = Math.min(320, Math.max(120, vh * ratio));
            setQrSize(targetSize);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Animation states
    const [isFlipping, setIsFlipping] = useState(false);

    const handleStart = async () => {
        // Immediate flip start
        setIsFlipping(true);

        // Wait for half-flip (matches CSS duration)
        setTimeout(() => {
            navigate(`/edit?key=${urlKey || ''}`, {
                state: {
                    userData: fullUserData, // Use current state directly
                    isFlipTransition: true,
                    // [NEW] Pass Detected Collection Info
                    collectionName: collectionName,
                    isPremium: isPremium
                }
            });
        }, 300); // 300ms for first half of flip
    };

    return {
        userInfo,
        sessionInfo,
        urlKey,
        qrSize,
        isFlipping,
        handleStart,
        fullUserData,
        hasProfile: !!(fullUserData && fullUserData.introduction),
        shouldShowQr: !!(fullUserData && fullUserData.introduction),
        // Ready when both user sync is attempted (fullUserData might be null if new, but that's ok)
        // AND session info is loaded.
        isDataReady: !!sessionInfo
    };
};
