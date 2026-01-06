import { BankTransaction, VerificationResult } from '../types/transaction';
import { Applicant } from '../types';

/**
 * Normalizes a string by removing spaces and non-alphanumeric characters (optional).
 * For names, simply removing spaces is usually enough.
 */
function normalizeName(name: string): string {
    return name.replace(/\s+/g, '').trim();
}

/**
 * Verifies payments by matching bank transactions against a list of applicants.
 * 
 * @param transactions List of bank transactions (usually just the new/unprocessed ones)
 * @param applicants List of ALL applicants (or at least those pending payment)
 * @param sessionDate Optional date of the party/session to serve as an upper bound for time matching
 * @returns List of results for each transaction
 */
export function verifyPayments(
    transactions: BankTransaction[],
    applicants: Applicant[],
    sessionDate?: Date
): VerificationResult[] {

    const results: VerificationResult[] = [];

    for (const tx of transactions) {
        // 0. Basic Filter: Must be a deposit ('입금')
        if (tx.transDirection !== '입금') {
            continue; // Skip withdrawals
        }

        const txAmount = tx.deposit;
        const txNameRaw = tx.remark || '';
        const txNameNorm = normalizeName(txNameRaw);
        const txTime = new Date(tx.transDateTime);

        if (!txNameNorm) {
            // If no sender name, we can't match? Or maybe we match by exact amount unique?
            // For now, skip if no name.
            results.push({
                transaction: tx,
                status: 'NO_MATCH',
                matchedUsers: [],
                message: '송금자명 없음'
            });
            continue;
        }

        // Candidate Search
        const candidates = applicants.filter(app => {
            // 1. Status Check: Only check users who haven't paid or need confirmation
            // (You might want to check 'already paid' users too, to detect double payment, 
            // but for V1 let's stick to unpaid)
            const isPaid = app.paymentStatus === 'paid' || app.paymentStatus === '입금완료';
            if (isPaid) return false;

            // 1b. Skip rejected/archived users
            if (app.status === 'rejected' || app.status === 'archived') return false;

            // 2. Amount Check
            // Some flexibility? No, exact match is safer for now.
            if (app.ticketPrice !== txAmount) return false;

            // 3. Name Check
            const appNameRaw = app.name || '';
            const appNameNorm = normalizeName(appNameRaw);

            // Require at least 2 characters to prevent false matches with single-char names
            if (appNameNorm.length < 2) return false;

            // Check if one contains the other
            if (!txNameNorm.includes(appNameNorm) && !appNameNorm.includes(txNameNorm)) {
                return false;
            }

            // 4. Time Check
            const submittedAtRaw = app.createdAt || app.enteredAt; // Firestore timestamp object OR string OR Date
            if (!submittedAtRaw) return false; // Can't verify time

            let submittedAt: Date;
            if (typeof submittedAtRaw === 'object' && 'toDate' in submittedAtRaw) {
                // Handle Firestore Timestamp
                submittedAt = (submittedAtRaw as any).toDate();
            } else {
                // Handle ISO string or Date object
                submittedAt = new Date(submittedAtRaw);
            }

            if (isNaN(submittedAt.getTime())) return false; // Invalid Date check
            // Valid window: SubmittedAt - 30mins <= TxTime <= SessionDate (or SubmittedAt + 7 days?)
            // GAS Logic: SearchStart = Submitted - 30min, End = PartyTime

            const searchStart = new Date(submittedAt.getTime() - 30 * 60 * 1000); // -30 mins

            // If sessionDate is provided, use it as max. Otherwise, maybe +2 weeks from submission?
            const searchEnd = sessionDate
                ? sessionDate
                : new Date(submittedAt.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 weeks default

            if (txTime < searchStart || txTime > searchEnd) {
                return false;
            }

            return true;
        });

        // Determine Status based on candidates found
        if (candidates.length === 1) {
            results.push({
                transaction: tx,
                status: 'MATCHED',
                matchedUsers: candidates,
                message: `매칭 성공: ${candidates[0].name}`
            });
        } else if (candidates.length > 1) {
            results.push({
                transaction: tx,
                status: 'AMBIGUOUS',
                matchedUsers: candidates,
                message: `중복 매칭: ${candidates.length}명 후보`
            });
        } else {
            results.push({
                transaction: tx,
                status: 'NO_MATCH',
                matchedUsers: [],
                message: '일치하는 사용자 없음'
            });
        }
    }

    return results;
}
