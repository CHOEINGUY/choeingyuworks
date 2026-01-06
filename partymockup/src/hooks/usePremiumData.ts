import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { normalizeApplicant } from '../utils/applicantAdapter';
import { Applicant } from '../types';

export const usePremiumData = (isAuthenticated: boolean) => {
    const [premiumUsers, setPremiumUsers] = useState<Record<string, Applicant>>({});
    const [premiumApplicants, setPremiumApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        setLoading(true);
        // FETCH ALL PREMIUM MEMBERS (Pool)
        const q = query(collection(db, 'premium_pool'));

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
                const status = user.status || 'pending';

                // 1. Members (Approved)
                if (status === 'approved') {
                    activeUsersMap[user.id] = user;
                }

                // 2. All History (for Inbox/Management)
                allApplicants.push(user);
            });

            // Sort Applicants (Oldest first)
            allApplicants.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.appliedAt?.toDate ? a.appliedAt.toDate() : new Date(0));
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.appliedAt?.toDate ? b.appliedAt.toDate() : new Date(0));
                return dateA.getTime() - dateB.getTime();
            });

            setPremiumUsers(activeUsersMap);
            setPremiumApplicants(allApplicants);
            setLoading(false);
        }, (err) => {
            console.error("Premium Pool fetch error:", err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isAuthenticated]);

    return { premiumUsers, premiumApplicants, loading, error };
};
