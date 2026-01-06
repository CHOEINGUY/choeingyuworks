import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useMessageSender } from './useMessageSender';
import { DEFAULT_TEMPLATES } from '../data/messageTemplates';
import { fillMessageTemplate } from '../utils/messageTemplateUtils';
import { User, MessageData, Session } from '../types';
import { toast } from 'sonner';

/**
 * Hook to centralize Admin Message Actions
 * (Invite, Deposit, Refund, Custom)
 */
export const useAdminMessageActions = () => {
    const { sendMessage, isSending } = useMessageSender();

    // 1. Get Template ID
    const getTemplateId = (action: string, serviceType: string = 'ROTATION') => {
        const svc = serviceType || 'ROTATION';
        let prefix = svc;
        if (svc === 'PREMIUM') prefix = 'PREMIUM';

        // Custom Mapping based on data/messageTemplates.jsx
        if (action === 'invite') {
            if (svc === 'PARTY') return 'PARTY_INVITE';
            if (svc === 'PREMIUM') return 'PREMIUM_MATCH_FOUND';
            return 'ROTATION_INVITE';
        }
        // [NEW] Premium Specific Actions
        if (action === 'request_profile') return 'PREMIUM_PROFILE_REQUEST';
        if (action === 'match_found') return 'PREMIUM_MATCH_FOUND';
        if (action === 'confirm_date') return 'PREMIUM_DATE_CONFIRM';
        if (action === 'after_care') return 'PREMIUM_AFTER_CARE';

        if (action === 'deposit') return 'PAYMENT_REMINDER';
        if (action === 'refund') return 'PAYMENT_REQ_ACCOUNT';
        if (action === 'refund_complete') return 'PAYMENT_REFUND_COMPLETE';

        return `${prefix}_INVITE`; // Default
    };

    // 2. Fetch & Process Message
    // Added 'session' support for dynamic data injection
    const getProcessedMessage = async (templateId: string, user: User, session?: Session) => {
        let content = "";
        try {
            // Priority: Firestore > Local Defaults
            const docRef = doc(db, 'message_templates', templateId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                content = docSnap.data().content;
            } else {
                const local = DEFAULT_TEMPLATES.find(t => t.id === templateId);
                if (local) content = local.content;
            }
        } catch (err) {
            console.error("Template Fetch Error:", err);
            const local = DEFAULT_TEMPLATES.find(t => t.id === templateId);
            if (local) content = local.content;
        }

        if (!content) return `(템플릿을 찾을 수 없습니다: ${templateId})`;

        // [FIX] Dynamic Base URL (Support for Custom Domains)
        const BASE_URL = window.location.origin;

        // [FIX] Determine Service Context for Links
        // Logic: 
        // 1. Premium -> /apply/match
        // 2. Party -> /apply/party
        // 3. Rotation (Default) -> /apply/rotation
        let applyPath = 'rotation';
        if (templateId.includes('PREMIUM') || user.serviceType === 'PREMIUM') {
            applyPath = 'match';
        } else if (templateId.includes('PARTY') || (user as any).applied_party) {
            applyPath = 'party';
        }

        const applyLink = `${BASE_URL}/apply/${applyPath}`;

        // Fill Variables
        // Safe casting/mapping to MessageData
        const msgData: MessageData = {
            name: user.name,
            // Mock Data or Session Data
            partyDate: session?.date || "이번 주 토요일 (예정)",
            location: session?.location || "강남 어딘가",
            // [FIX] Use Smart Apply Link for 'inviteLink'
            inviteLink: applyLink,
            roomNumber: "201호", // TODO: Add to Session model if needed
            branchName: "부산 광안점", // TODO: Add to Session model if needed
            partyLink: `${BASE_URL}/apply/party`, // Force Party Link
            resultLink: `${BASE_URL}/result/${user.id}`,
            // Helper keys for Korean template placeholders
            이름: user.name,
            파티날짜: session?.date || "이번 주 토요일 (예정)",
            장소: session?.location || "강남 어딘가",
            초대링크: applyLink,
            방번호: "201호",
            지점명: "부산 광안점",
            참여링크: `${BASE_URL}/apply/party`,
            결과링크: `${BASE_URL}/result/${user.id}`,

            // Premium specific
            // [NEW] Dynamic Profile Link based on service type or template
            프로필링크: (() => {
                const profilePath = templateId === 'PREMIUM_PROFILE_REQUEST' || user.serviceType === 'PREMIUM' ? '/profile/premium' : '/profile/rotation';
                return `${BASE_URL}${profilePath}?userId=${user.id}`;
            })(),
            // [FIX] Secure Partner Link (Self-lookup)
            partnerProfileLink: `${BASE_URL}/premium/partner?userId=${user.id}`,
            상대방프로필링크: `${BASE_URL}/premium/partner?userId=${user.id}`,

            managerPhone: "010-1234-5678",
            매니저연락처: "010-1234-5678",

            meetingTime: "이번 주 토요일 18:00",
            약속시간: "이번 주 토요일 18:00",

            meetingLocation: "강남역 11번 출구",
            약속장소: "강남역 11번 출구",

            partnerName: (session as any)?.partnerName || "상대방 이름",
            상대방이름: (session as any)?.partnerName || "상대방 이름",

            partnerJob: (session as any)?.partnerJob || "",
            상대방직업: (session as any)?.partnerJob || "",

            surveyLink: `${BASE_URL}/survey/${user.id}`,
            설문링크: `${BASE_URL}/survey/${user.id}`
        };

        return fillMessageTemplate(content, msgData);
    };

    // 3. Wrapper for Send
    const handleSendMessage = async (user: User, text: string, templateId: string, type: string, targetCollection: string = 'users') => {
        try {
            await sendMessage({
                to: user.phone || user.phoneNumber || '',
                name: user.name || '',
                text: text
            }, {
                userId: user.id,
                templateId: templateId || 'CUSTOM',
                type: type || 'custom',
                targetCollection
            });
            return true;
        } catch (error: any) {
            toast.error(`발송 실패: ${error.message}`);
            return false;
        }
    };

    // 4. Main Action Executor
    const executeMessageAction = async (action: string, user: User, options: any = {}) => {
        const { serviceType, session } = options; // Added 'session' to options destructuring
        const currentServiceType = serviceType || user.serviceType || ((user as any).applied_party ? 'PARTY' : 'ROTATION');

        const logTypeMap: Record<string, string> = {
            'invite': 'invite',
            'deposit': 'deposit',
            'refund': 'refund',
            'refund_complete': 'refund',
            'custom_message': 'custom',
            'request_profile': 'invite', // Treat as invite type for status sync
            'match_found': 'match',
            'confirm_date': 'match',
            'after_care': 'feedback'
        };
        const logType = logTypeMap[action] || 'custom';

        const templateId = getTemplateId(action, currentServiceType);
        const msgContent = await getProcessedMessage(templateId, user, session); // Pass session

        // [FIX] Determine Collection
        const targetCollection = (currentServiceType === 'PREMIUM') ? 'premium_pool' : 'users';

        const success = await handleSendMessage(user, msgContent, templateId, logType, targetCollection);

        if (success) {
            const successMsgMap: Record<string, string> = {
                'invite': `[${user.name}]님에게 초대장을 발송했습니다.`,
                'deposit': `[${user.name}]님에게 입금 요청을 발송했습니다.`,
                'refund': `[${user.name}]님에게 환불 계좌 요청을 발송했습니다.`,
                'refund_complete': `[${user.name}]님에게 환불 완료 안내를 발송했습니다.`,
                'request_profile': `[${user.name}]님에게 프로필 작성 요청을 보냈습니다.`,
                'match_found': `[${user.name}]님에게 매칭 소식을 전했습니다.`,
                'confirm_date': `[${user.name}]님에게 일정 확정 안내를 보냈습니다.`
            };
            toast.success(successMsgMap[action] || "메시지가 전송되었습니다.");
        }

        // [FIX] Sync Status to User Document for Table Visibility
        if (success) {
            try {
                let updates = {};
                // Determine updates based on action
                if (action === 'invite' || action === 'request_profile') {
                    updates = { inviteStatus: 'sent', isInviteSent: true, inviteSentDate: new Date() };
                } else if (action === 'deposit') {
                    updates = { depositRequestStatus: 'sent', isSmsSent: true, smsSentDate: new Date() };
                } else if (action === 'refund') {
                    updates = { refundStatus: 'sent', isRefundSent: true, refundSentDate: new Date() };
                } else if (action === 'refund_complete') {
                    updates = { refundStatus: 'completed' };
                }

                // If NOT custom message, update the user status
                if (Object.keys(updates).length > 0) {
                    const userRef = doc(db, targetCollection, user.id);
                    await updateDoc(userRef, {
                        ...updates,
                        updatedAt: new Date() // Use client date or serverTimestamp
                    });
                }
            } catch (err) {
                console.error("Failed to sync status to user doc:", err);
            }
        }

        return success;
    };

    return {
        executeMessageAction,
        handleSendMessage,
        getProcessedMessage, // Exported for external usage (e.g. Bulk Send)
        isSending
    };
};
