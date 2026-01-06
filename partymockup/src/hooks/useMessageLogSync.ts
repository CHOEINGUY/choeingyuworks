
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from '../types';

/**
 * Custom hook to sync user state with Firestore message logs.
 * Listens to `users/{userId}/message_logs` and updates the local user form state
 * if the logs indicate a status change (e.g. invite sent, deposit request sent).
 */
export const useMessageLogSync = (
    userId: string | undefined,
    setFormData: React.Dispatch<React.SetStateAction<User>>,
    collectionName: string = 'users' // [NEW] Support for 'premium_pool'
) => {
    const [messageLogs, setMessageLogs] = useState<any[]>([]);

    // 1. Subscribe to Message Logs
    useEffect(() => {
        if (!userId) return;

        const q = query(collection(db, `${collectionName}/${userId}/message_logs`), orderBy('sentAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessageLogs(logs);
        });

        return () => unsubscribe();
    }, [userId, collectionName]);

    // 2. Sync Local State with Logs
    useEffect(() => {
        if (!messageLogs || messageLogs.length === 0) return;

        setFormData(prev => {
            const updates: Partial<User> = {};
            let hasChanges = false;

            // Helper to sync if log is 'success'/'sent'
            const syncStatus = (logType: string) => {
                // Find latest log of this type (logs are desc)
                const log = messageLogs.find(l => l.type === logType);

                if (log && (log.status === 'success' || log.status === 'sent')) {
                    // Check Invite
                    if (logType === 'invite') {
                        if (!prev.isInviteSent || prev.inviteStatus !== 'sent' || !prev.inviteSentDate) {
                            updates.isInviteSent = true;
                            updates.inviteStatus = 'sent';
                            updates.inviteSentDate = log.sentAt;
                            hasChanges = true;
                        }
                    }
                    // Check Deposit
                    if (logType === 'deposit') {
                        if (!prev.isSmsSent || prev.depositRequestStatus !== 'sent' || !prev.smsSentDate) {
                            updates.isSmsSent = true;
                            updates.depositRequestStatus = 'sent';
                            updates.smsSentDate = log.sentAt;
                            hasChanges = true;
                        }
                    }
                    // Check Refund
                    if (logType === 'refund' || logType === 'refund_complete') {
                        const targetStatus = logType === 'refund_complete' ? 'completed' : 'sent';
                        // @ts-ignore - access loose props
                        if (!prev.isRefundSent || prev.refundStatus !== targetStatus || !prev.refundSentDate) {
                            updates.isRefundSent = true;
                            // @ts-ignore
                            updates.refundStatus = targetStatus;
                            // @ts-ignore
                            updates.refundSentDate = log.sentAt;
                            hasChanges = true;
                        }
                    }
                }
            };

            syncStatus('invite');
            syncStatus('deposit');
            syncStatus('refund');
            syncStatus('refund_complete');

            return hasChanges ? { ...prev, ...updates } : prev;
        });
    }, [messageLogs, setFormData]);

    return { messageLogs };
};
