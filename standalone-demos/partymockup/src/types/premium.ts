import { Applicant } from './index';

export interface PremiumMember extends Applicant {
    answers?: Record<string, any>;
    // Add other premium-specific fields if any
}

export type MatchStatus = 'matched' | 'notified' | 'scheduling' | 'scheduled' | 'partner_rejected' | 'completed' | 'failed';

export interface PremiumMatch {
    id: string;
    maleId: string;
    femaleId: string;
    maleName: string;
    femaleName: string;
    status: MatchStatus;
    matchedAt: string; // ISO date string
    meetingDate?: string;
    meetingTime?: string;
    location?: string;
    note?: string;
    result?: string;
    // ... any other fields
}
