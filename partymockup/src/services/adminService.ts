
import { doc, updateDoc, deleteDoc, getDoc, serverTimestamp, setDoc, collection, query, where, getDocs, deleteField } from 'firebase/firestore';
import { db } from '../firebase';
import { User, Session } from '../types';

// --- Applicant Actions ---

export const approveApplicant = async (id: string) => {
    try {
        const userRef = doc(db, 'users', id);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return false;

        const userData = userSnap.data();
        const targetSessionId = userData.appliedSessionId;

        await updateDoc(userRef, {
            status: 'approved',
            sessionId: targetSessionId,
            approvedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return true;
    } catch (error) {
        console.error("Approve Failed:", error);
        throw error;
    }
};

export const rejectApplicant = async (id: string) => {
    try {
        const userRef = doc(db, 'users', id);
        await updateDoc(userRef, {
            status: 'rejected',
            rejectedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Reject Failed:", error);
        throw error;
    }
};

export const deleteApplicant = async (id: string) => {
    try {
        const userRef = doc(db, 'users', id);
        await deleteDoc(userRef);
        return true;
    } catch (error) {
        console.error("Delete Failed:", error);
        throw error;
    }
};

export const moveApplicantSession = async (applicantId: string, targetSessionId: string) => {
    try {
        const userRef = doc(db, 'users', applicantId);
        await updateDoc(userRef, {
            appliedSessionId: targetSessionId,
            sessionId: targetSessionId,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Move Applicant Failed:", error);
        throw error;
    }
};

// --- User Actions ---

export const moveUserSession = async (userId: string, targetSessionId: string) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { sessionId: targetSessionId });
        return true;
    } catch (error) {
        console.error("Session Move Failed:", error);
        throw error;
    }
};

export const cancelUserParticipation = async (userId: string) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            status: 'rejected',
            rejectedAt: serverTimestamp(),
            adminNote: '참가 취소됨'
        });
        return true;
    } catch (error) {
        console.error("Cancel Participation Failed:", error);
        throw error;
    }
};

// --- Feedback Actions ---

export const deleteFeedback = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'feedbacks', id));
        return true;
    } catch (error) {
        console.error("Delete Feedback Failed:", error);
        throw error;
    }
};

// --- Check-In Actions ---

export const getCheckInUser = async (userId: string) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() } as User;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Fetch Check-in User Failed:", error);
        throw error;
    }
};

export const confirmCheckIn = async (userId: string, userSessionId?: string, userGender?: string) => {
    try {
        const userRef = doc(db, 'users', userId);

        let sessionId = userSessionId;
        let gender = userGender;

        if (!sessionId || !gender) {
            const snap = await getDoc(userRef);
            if (!snap.exists()) {
                console.error("User not found for check-in:", userId);
                return false;
            }
            const data = snap.data();
            sessionId = data?.sessionId;
            gender = data?.gender;

            if (!sessionId || !gender) {
                console.error("Missing sessionId or gender for user:", userId, data);
                throw new Error("사용자 데이터 오류: 세션 또는 성별 정보가 없습니다.");
            }
        }

        const q = query(
            collection(db, 'users'),
            where('sessionId', '==', sessionId)
        );

        const querySnapshot = await getDocs(q);
        const allSessionUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));

        const occupiedTableNumbers = allSessionUsers
            .filter(u => u.gender === gender && u.isCheckedIn && typeof u.tableNumber === 'number' && u.tableNumber > 0)
            .map(u => u.tableNumber!)
            .sort((a, b) => a - b);

        let newTableNumber = 1;
        for (let i = 0; i < occupiedTableNumbers.length + 1; i++) {
            if (occupiedTableNumbers[i] === newTableNumber) {
                newTableNumber++;
            } else {
                break;
            }
        }

        const ghostUser = allSessionUsers.find(u =>
            u.gender === gender &&
            !u.isCheckedIn &&
            u.tableNumber === newTableNumber
        );

        if (ghostUser) {
            console.log(`[CheckIn] Found ghost ${ghostUser.name} at Table ${newTableNumber}. Clearing...`);
            const ghostRef = doc(db, 'users', ghostUser.id);
            await updateDoc(ghostRef, { tableNumber: null });
        }

        await updateDoc(userRef, {
            isCheckedIn: true,
            checkInAt: serverTimestamp(),
            tableNumber: newTableNumber
        });

        return true;
    } catch (error) {
        console.error("Check-in Failed:", error);
        throw error;
    }
};

export const cancelCheckIn = async (userId: string) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            isCheckedIn: false,
            checkInAt: null,
            tableNumber: deleteField()
        });
        return true;
    } catch (error) {
        console.error("Check-in Cancel Failed:", error);
        throw error;
    }
};

export const swapUserTableNumbers = async (user1Id: string, user2Id: string, table1: number, table2: number) => {
    try {
        const u1Ref = doc(db, 'users', user1Id);

        if (!user2Id) {
            await updateDoc(u1Ref, { tableNumber: table1 });
            return true;
        }

        const u2Ref = doc(db, 'users', user2Id);
        let t1 = table1;
        let t2 = table2;

        if (!t1 || !t2) {
            const u1Snap = await getDoc(u1Ref);
            const u2Snap = await getDoc(u2Ref);
            if (!u1Snap.exists() || !u2Snap.exists()) return false;
            t1 = u1Snap.data()?.tableNumber;
            t2 = u2Snap.data()?.tableNumber;
        }

        await updateDoc(u1Ref, { tableNumber: table1 });
        await updateDoc(u2Ref, { tableNumber: table2 });

        return true;
    } catch (error) {
        console.error("Swap/Move Failed:", error);
        throw error;
    }
};

// --- Session Actions ---

export const addSession = async (initialData: Partial<Session> & { time?: string } = {}) => {
    try {
        const newSessionRef = doc(collection(db, "sessions"));
        const newSessionData = {
            id: newSessionRef.id,
            date: initialData.date ? (initialData.date + (initialData.time ? " " + initialData.time : "")) : (new Date().toISOString().slice(0, 10) + " 19:00"),
            title: initialData.title || "새로운 세션",
            type: initialData.type || 'ROTATION',
            location: "강남구",
            status: "setup",
            themeMode: "day",
            themeStyle: "standard",
            createdAt: serverTimestamp()
        };

        await setDoc(newSessionRef, newSessionData);
        return newSessionRef.id;
    } catch (error) {
        console.error("Add Session Failed:", error);
        throw error;
    }
};

export const updateSession = async (sessionId: string, updates: Partial<Session>) => {
    try {
        const sessionRef = doc(db, 'sessions', sessionId);
        await updateDoc(sessionRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Update Session Failed:", error);
        return false;
    }
};

export const deleteSession = async (sessionId: string) => {
    try {
        const sessionRef = doc(db, 'sessions', sessionId);
        await deleteDoc(sessionRef);
        return true;
    } catch (error) {
        console.error("Delete Session Failed:", error);
        throw error;
    }
};





// --- Profile Actions ---

// --- Profile Actions ---

export const updateProfile = async (collectionName: string, id: string, updates: Partial<User> & Record<string, unknown>) => {
    try {
        const docRef = doc(db, collectionName, id);

        // Fail-safe: Clean undefined values which Firestore rejects
        // Using strict typing for the accumulator
        const cleanUpdates = Object.entries(updates).reduce((acc: Record<string, any>, [key, value]) => {
            if (value !== undefined) {
                acc[key] = value;
            }
            return acc;
        }, {});

        if (Object.keys(cleanUpdates).length === 0) return true; // Nothing to update

        await updateDoc(docRef, {
            ...cleanUpdates,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Update Profile Failed:", error);
        return false;
    }
};

// --- Premium Pool Actions ---

export const approvePremiumApplicant = async (id: string) => {
    try {
        const ref = doc(db, 'premium_pool', id);
        await updateDoc(ref, {
            status: 'approved',
            approvedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Premium Approve Failed:", error);
        return false;
    }
};

export const rejectPremiumApplicant = async (id: string) => {
    try {
        const ref = doc(db, 'premium_pool', id);
        await updateDoc(ref, {
            status: 'rejected',
            rejectedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Premium Reject Failed:", error);
        return false;
    }
};

export const deletePremiumApplicant = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'premium_pool', id));
        return true;
    } catch (error) {
        console.error("Premium Delete Failed:", error);
        return false;
    }
};
