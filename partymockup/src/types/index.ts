export interface FirestoreTimestamp {
    seconds: number;
    nanoseconds: number;
    toDate: () => Date;
}

export interface User {
    id: string;
    name?: string;
    gender?: 'M' | 'F' | 'U' | string;
    birthDate?: string;
    birthYear?: number;
    age?: number | string;
    tableNumber?: number;
    ticketCount?: number; // [NEW] For 1:1 Premium ticket tracking
    // Common fields promoted from Applicant for easier usage
    avatar?: string;
    image?: string;
    hobbies?: string | string[]; // Can be comma separated string or array
    phone?: string;
    phoneNumber?: string;
    ticketType?: string;
    ticketLabel?: string;
    ticketStatus?: string;
    paymentStatus?: string;
    isDeposited?: boolean;
    job?: string;
    mbti?: string;
    height?: string | number;
    drinking?: string;
    smoking?: string;
    religion?: string;
    location?: string;
    introduction?: string;
    pros?: string;
    idealTypePersonality?: string;
    idealTypeAppearance?: string;
    answers?: Record<string, unknown>;
    sessionId?: string;
    appliedSessionId?: string;
    isEntered?: boolean;
    enteredAt?: string | null;
    checkInAt?: any; // Timestamp or string
    isCheckedIn?: boolean;
    status?: 'pending' | 'approved' | 'rejected' | string;
    adminNote?: string;
    memo?: string;
    refundAccount?: string;
    idealType?: string;
    hobby?: string;
    fieldLogs?: Record<string, string>;
    [key: string]: any;
}

export interface Applicant extends User {
    phone?: string;
    phoneNumber?: string;
    ticketType?: string;
    ticketLabel?: string;
    ticketPrice?: number;
    isDeposited?: boolean;
    ticketStatus?: string;
    paymentStatus?: string;
}

export interface RotationMap {
    [round: number]: {
        [maleId: string]: string | null; // femaleId or null
    };
}

export interface MessageData {
    name?: string;
    partyDate?: string;
    location?: string;
    inviteLink?: string;
    roomNumber?: string;
    branchName?: string;
    partyLink?: string;
    resultLink?: string;
    partnerName?: string;
    partnerJob?: string;
    meetingTime?: string;
    meetingLocation?: string;
    managerPhone?: string;
    partnerProfileLink?: string;
    surveyLink?: string;
    [key: string]: string | undefined; // MessageData acts like a dictionary often, but let's restrict values to string | undefined
}

export interface Session {
    id: string;
    title: string;
    date: string;
    type: 'PARTY' | 'ROTATION' | 'MATCH' | string;
    location?: string;
    formSettings?: {
        fields: any[];
    };
    // [key: string]: any; // Removed loose typing
    isApplicationClosed?: boolean;
    config?: {
        themeMode?: 'day' | 'night' | string;
        themeStyle?: 'standard' | 'glass' | string;
        [key: string]: any;
    };
}
export type FieldType = string;

export interface Feedback {
    rating: number;
    note?: string;
}
