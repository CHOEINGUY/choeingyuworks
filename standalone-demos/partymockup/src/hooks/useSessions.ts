import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Session } from '../types';

export const useSessions = () => {
    const [sessions, setSessions] = useState<Record<string, Session>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        // Query sessions collection, ordering by date
        const q = query(
            collection(db, 'sessions'),
            orderBy('date', 'asc') // Show sessions in chronological order
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const sessionsMap: Record<string, Session> = {};
            snapshot.forEach((doc) => {
                const data = doc.data();
                sessionsMap[doc.id] = {
                    id: doc.id,
                    title: data.title || 'Untitled Session',
                    date: data.date || '',
                    type: data.type || 'ROTATION',
                    ...data
                } as Session;
            });

            setSessions(sessionsMap);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching sessions:", err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { sessions, loading, error };
};
