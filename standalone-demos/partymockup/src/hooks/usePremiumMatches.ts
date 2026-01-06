import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, orderBy } from 'firebase/firestore';
import { PremiumMatch, MatchStatus } from '../types/premium';
import { toast } from 'sonner';

export const usePremiumMatches = () => {
    const [matches, setMatches] = useState<PremiumMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        setLoading(true);
        const q = query(
            collection(db, 'premium_matches'),
            orderBy('matchedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedMatches: PremiumMatch[] = [];
            snapshot.forEach(doc => {
                loadedMatches.push({
                    id: doc.id,
                    ...doc.data()
                } as PremiumMatch);
            });
            setMatches(loadedMatches);
            setLoading(false);
        }, (err) => {
            console.error("Failed to fetch matches:", err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Create Match
    const createMatch = async (maleId: string, femaleId: string, maleName: string, femaleName: string) => {
        try {
            // Deduct Tickets (Client-side logic for now)
            const maleRef = doc(db, 'users', maleId);
            const femaleRef = doc(db, 'users', femaleId);

            // Note: In production, use a Transaction or Cloud Function to prevent race conditions
            // Here, we just blindly decrement if we assume they have tickets
            // You might want to getDocs first to check if ticketCount > 0, but for 'Admin' force match, we might allow negative or just decrement.
            // Let's implement a safe decrement attempt:
            // const maleSnap = await getDoc(maleRef);
            // ... logic ...
            // For MVP speed/prototype:
            // We'll read them first.
            /* 
            const mSnap = await getDoc(maleRef);
            if(mSnap.exists() && (mSnap.data().ticketCount || 0) > 0) ... 
            */

            // 1. Create Match Record
            const newMatch: Omit<PremiumMatch, 'id'> = {
                status: 'matched',
                maleId,
                maleName,
                femaleId,
                femaleName,
                matchedAt: new Date().toISOString(),
                note: ''
            };
            await addDoc(collection(db, 'premium_matches'), newMatch);

            // 2. Decrement Tickets (Fire & Forget style for admin prototype)
            // Using updateDoc with increment(-1) is atomic
            const { increment } = await import('firebase/firestore');
            await updateDoc(maleRef, { ticketCount: increment(-1) }).catch(e => console.warn("Failed to decrement male ticket", e));
            await updateDoc(femaleRef, { ticketCount: increment(-1) }).catch(e => console.warn("Failed to decrement female ticket", e));

            toast.success("매칭이 생성되었습니다.");
        } catch (err) {
            console.error("Error creating match:", err);
            toast.error("매칭 생성 실패");
            throw err;
        }
    };

    // Update Status
    const updateMatchStatus = async (matchId: string, status: MatchStatus, extraData: Partial<PremiumMatch> = {}) => {
        try {
            const ref = doc(db, 'premium_matches', matchId);
            await updateDoc(ref, {
                status,
                ...extraData,
                updatedAt: new Date().toISOString()
            });
            // Toast handled by UI usually, but we can do it here too if we want consistancy
        } catch (err) {
            console.error("Error updating match:", err);
            toast.error("상태 업데이트 실패");
            throw err;
        }
    };

    // Break Match (Fail)
    const breakMatch = async (matchId: string, reason: string, refundTicket: boolean, matchData?: PremiumMatch) => {
        try {
            const ref = doc(db, 'premium_matches', matchId);
            await updateDoc(ref, {
                status: 'failed',
                breakReason: reason,
                refundTicket,
                brokenAt: new Date().toISOString()
            });

            if (refundTicket && matchData) {
                const { increment } = await import('firebase/firestore');
                // Refund Tickets
                if (matchData.maleId) {
                    await updateDoc(doc(db, 'users', matchData.maleId), { ticketCount: increment(1) })
                        .catch(e => console.warn("Refund failed for male", e));
                }
                if (matchData.femaleId) {
                    await updateDoc(doc(db, 'users', matchData.femaleId), { ticketCount: increment(1) })
                        .catch(e => console.warn("Refund failed for female", e));
                }
                toast.info("반려 취소 및 이용권이 반환되었습니다.");
            }
        } catch (err) {
            console.error("Error breaking match:", err);
            throw err;
        }
    };

    // Delete Match (Hard Delete)
    const deleteMatch = async (matchId: string) => {
        try {
            const { deleteDoc } = await import('firebase/firestore');
            await deleteDoc(doc(db, 'premium_matches', matchId));
            toast.success("매칭 기록이 삭제되었습니다.");
        } catch (err) {
            console.error("Error deleting match:", err);
            toast.error("매칭 삭제 실패");
            throw err;
        }
    };

    return {
        matches,
        loading,
        error,
        createMatch,
        updateMatchStatus,
        breakMatch,
        deleteMatch
    };
};
