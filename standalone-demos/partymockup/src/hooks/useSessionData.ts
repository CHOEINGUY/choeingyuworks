import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { generateRotations } from '../utils/rotationUtils';
import { User } from '../types';

export const useSessionData = (mySessionId: string | null, userId: string | null, currentRound: number) => {
    const [usersData, setUsersData] = useState<Record<string, User> | null>(null);
    const [rotationsData, setRotationsData] = useState<any>(null);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (!mySessionId) {
            setUsersData(null);
            setRotationsData(null);
            setDataLoading(false);
            return;
        }

        const q = query(
            collection(db, 'users'),
            where('sessionId', '==', mySessionId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersMap: Record<string, User> = {};
            const userList: User[] = [];

            snapshot.forEach((doc) => {
                const data = doc.data() as Omit<User, 'id'>;
                const user = { ...data, id: doc.id };
                usersMap[doc.id] = user;
                userList.push(user);
            });

            setUsersData(usersMap);

            // Always calculate dynamic rotations
            const dynamicRotations = generateRotations(userList);
            setRotationsData(dynamicRotations);
            setDataLoading(false);
        });

        return () => unsubscribe();
    }, [mySessionId]);

    const getPartner = (round: number, myId: string | null) => {
        if (!rotationsData || !usersData || !myId) return null;

        const roundData = rotationsData[round];
        if (!roundData) return null;

        let partnerId = null;
        if (roundData[myId]) {
            partnerId = roundData[myId];
        } else {
            const entry = Object.entries(roundData).find(([_, v]) => v === myId);
            if (entry) partnerId = entry[0];
        }

        if (partnerId && usersData[partnerId]) {
            return { ...usersData[partnerId], id: partnerId };
        }
        return null;
    };

    const partner = getPartner(currentRound, userId);
    const nextPartner = getPartner(currentRound + 1, userId);
    const totalRounds = rotationsData ? Object.keys(rotationsData).length : 5;

    return {
        usersData,
        rotationsData,
        dataLoading,
        partner,
        nextPartner,
        totalRounds
    };
};
