export interface BankTransaction {
    compositeKey: string; // Unique ID (BankAccountNum + TransRefKey)
    bankAccountNum: string;
    transRefKey: string;
    transDateTime: string; // ISO String (Date)
    transDirection: '입금' | '출금';
    deposit: number;
    withdraw: number;
    balance: number;
    remark: string; // TransRemark1 (Sender Name)
}

export interface VerificationResult {
    transaction: BankTransaction;
    status: 'MATCHED' | 'AMBIGUOUS' | 'NO_MATCH' | 'ALREADY_PROCESSED';
    matchedUsers: any[]; // will replace 'any' with actual User type once confirmed
    message?: string;
}
