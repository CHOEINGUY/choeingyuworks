import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, where, DocumentData } from 'firebase/firestore';
import { normalizeApplicant } from '../utils/applicantAdapter';
import { User, Applicant } from '../types';

export const useAdminData = (selectedSessionId: string | null, isAuthenticated: boolean) => {
    const [users, setUsers] = useState<Record<string, Applicant>>({});
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [selections, setSelections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    // 1. Fetch All Users & Derive Lists
    useEffect(() => {
        if (!isAuthenticated) return;

        setLoading(true);
        // FETCH ALL USERS (Single Source of Truth)
        const q = query(collection(db, 'users'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const allDocs: Applicant[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                // Normalize Data using Adapter
                const normalized = normalizeApplicant({ ...data, id: doc.id });
                allDocs.push(normalized);
            });

            // Derive Lists based on Status
            const activeUsersMap: Record<string, Applicant> = {};
            const allApplicants: Applicant[] = [];

            allDocs.forEach(user => {
                const status = user.status || 'approved'; // Defaulting to approved for existing data

                // 1. Participant Management needs Approved users only
                if (status === 'approved') {
                    activeUsersMap[user.id] = user;
                }

                // 2. Applicant Management needs EVERYONE (History)
                allApplicants.push(user);
            });

            // Sort Applicants (Oldest first)
            allApplicants.sort((a, b) => {
                // Use createdAt or appliedAt if available
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.appliedAt?.toDate ? a.appliedAt.toDate() : new Date(0));
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.appliedAt?.toDate ? b.appliedAt.toDate() : new Date(0));
                return dateA.getTime() - dateB.getTime();
            });

            setUsers(activeUsersMap);
            setApplicants(allApplicants);
            setLoading(false);
        }, (err) => {
            console.error("Users/Applicants fetch error:", err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isAuthenticated]);

    // 3. Fetch Feedbacks
    useEffect(() => {
        if (!isAuthenticated || !selectedSessionId) return;

        const q = query(
            collection(db, 'feedbacks'),
            where('sessionId', '==', selectedSessionId),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snap) => {
            setFeedbacks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }, (err) => console.error("Feedbacks fetch error:", err));

        return () => unsubscribe();
    }, [isAuthenticated, selectedSessionId]);

    // 4. Fetch Selections
    useEffect(() => {
        if (!isAuthenticated || !selectedSessionId) return;

        const q = query(
            collection(db, 'selections'),
            where('sessionId', '==', selectedSessionId),
            orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snap) => {
            setSelections(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }, (err) => console.error("Selections fetch error:", err));

        return () => unsubscribe();
    }, [isAuthenticated, selectedSessionId]);

    return { users, applicants, feedbacks, selections, loading, error };
};
