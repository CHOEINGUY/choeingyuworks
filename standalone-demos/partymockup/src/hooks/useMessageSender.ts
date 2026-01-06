import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

// TODO: 배포한 Cloudflare Worker URL을 여기에 입력하세요.
const WORKER_URL = "https://dating-message-worker.chldlsrb07.workers.dev";

export interface LogData {
    userId?: string;
    templateId?: string;
    type?: string;
    content?: string;
    adminId?: string;
    targetCollection?: string; // [NEW] Support for 'premium_pool' etc.
}

export interface SendMessageProps {
    to: string;
    name: string;
    text: string;
}

export const useMessageSender = () => {
    const [isSending, setIsSending] = useState(false);

    // Added optional 'logData' parameter for Firestore logging
    // logData: { userId, templateId, type, content, adminId (optional) }
    const sendMessage = async ({ to, name, text }: SendMessageProps, logData: LogData | null = null) => {
        if (!WORKER_URL) {
            throw new Error("Worker URL이 설정되지 않았습니다. 코드를 확인해주세요.");
        }

        setIsSending(true);
        try {
            const response = await fetch(`${WORKER_URL}/sms/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: to || "01000000000",
                    name: name,
                    text: text
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`서버 응답 오류: ${errorData}`);
            }

            const result = await response.json();
            console.log("Worker Response:", result);

            // Logging & Status Update Logic
            if (logData && logData.userId) {
                const collectionName = logData.targetCollection || 'users';
                const userRef = doc(db, collectionName, logData.userId);

                try {
                    await addDoc(collection(db, `${collectionName}/${logData.userId}/message_logs`), {
                        templateId: logData.templateId || 'CUSTOM',
                        type: logData.type || 'custom',
                        content: text,
                        status: 'success',
                        sentAt: Date.now(),
                        to: to,
                        metadata: result // Store worker response metadata
                    });
                    console.log("Message logged to Firestore");

                    // Update User Status Field
                    // Syncing both legacy 'isSmsSent' and new 'inviteStatus'
                    if (logData.type === 'invite') {
                        await updateDoc(userRef, {
                            isSmsSent: true, // Legacy support
                            inviteStatus: 'success',
                            lastInviteSentAt: Date.now()
                        });
                    } else if (logData.type === 'deposit') {
                        await updateDoc(userRef, {
                            isDeposited: false, // Just a request, not deposited yet
                            depositRequestStatus: 'success',
                            lastDepositRequestAt: Date.now()
                        });
                    }
                } catch (logErr) {
                    console.error("Failed to log/update message status:", logErr);
                }
            }

            return result;
        } catch (error: any) {
            console.error("Message Send Error:", error);
            // Optional: Log failure?
            if (logData && logData.userId) {
                const collectionName = logData.targetCollection || 'users';
                const userRef = doc(db, collectionName, logData.userId);
                try {
                    await addDoc(collection(db, `${collectionName}/${logData.userId}/message_logs`), {
                        templateId: logData.templateId || 'CUSTOM',
                        type: logData.type || 'custom',
                        content: text,
                        status: 'failed',
                        error: error.message,
                        sentAt: Date.now(),
                        to: to
                    });

                    // Update User Status to Failed
                    if (logData.type === 'invite') {
                        await updateDoc(userRef, {
                            inviteStatus: 'failed'
                        });
                    }
                } catch (e) { /* Ignore log error */ }
            }
            throw error;
        } finally {
            setIsSending(false);
        }
    };

    return { sendMessage, isSending };
};
