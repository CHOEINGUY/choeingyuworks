import { Applicant } from '../types';

interface RawFirestoreDoc {
    id: string;
    data: () => Record<string, any>;
    exists?: () => boolean;
    [key: string]: any; // Allow direct property access for legacy objects
}

/**
 * Normalizes applicant data to ensure consistent structure for views,
 * regardless of whether the data uses the old (flat/redundant) or new (nested answers) schema.
 * 
 * @param {RawFirestoreDoc | Record<string, any>} doc - Firestore document data (or object with id)
 * @returns {Applicant} Normalized applicant object
 */
export const normalizeApplicant = (doc: RawFirestoreDoc | Record<string, any>): Applicant => {
    // Handle Firestore snapshot vs direct object
    const data = (doc.data && typeof doc.data === 'function') ? doc.data() : doc;
    const id = doc.id || data.id;

    const answers = data.answers || {};

    // 1. Core Identity (Single Source of Truth Logic)
    // Priority: Top-level > Answers > Default
    const name = data.name || answers.name || "Unknown";
    const phone = data.phone || data.phoneNumber || answers.phone || "";
    const gender = data.gender || answers.gender || "U";
    const birthDate = data.birthDate || answers.birth_date || answers.birthDate || "";

    // 2. Computed Fields (Age)
    let age = data.age;
    let birthYear = data.birthYear;

    if (!age && birthDate && typeof birthDate === 'string' && birthDate.length === 8) {
        const yearStr = birthDate.substring(0, 4);
        const by = parseInt(yearStr, 10);
        if (!isNaN(by)) {
            const currentYear = new Date().getFullYear();
            birthYear = by;
            age = currentYear - by + 1;
        }
    }

    // 3. Unified Detail Access
    // Priority: Top-level > Answers > Default
    const job = data.job || answers.job || "";
    const location = data.location || answers.location || "";
    const mbti = data.mbti || answers.mbti || "";
    const height = data.height || answers.height || "";
    const drinking = data.drinking || answers.drinking || "";
    const smoking = data.smoking || answers.smoking || "";
    const religion = data.religion || answers.religion || "";

    // Images (Consolidate profile image)
    // Top level avatar > answers[face_photo] > answers[profileImage] > fallback
    let avatar = data.avatar || data.profileImage;
    if (!avatar && answers.face_photo) avatar = answers.face_photo;
    if (!avatar && answers.profileImage) avatar = answers.profileImage;

    // 4. Ticket Info (Normalized)
    // Legacy: ticketLabel might be at top level
    // New: in ticket object
    const ticket = data.ticket || {};
    const ticketType = data.ticketType || ticket.id || answers.ticket_option || "";
    const ticketLabel = data.ticketLabel || ticket.label || "";
    const ticketPrice = data.ticketPrice ?? ticket.price ?? 0;

    // Status normalization
    const isDeposited = data.isDeposited ?? ticket.isDeposited ?? false;


    return {
        ...data, // Keep original fields for safety/reference
        id,

        // --- Normalized Core Fields ---
        name,
        phone,
        phoneNumber: phone, // Alias for compatibility
        gender,
        birthDate,
        age,
        birthYear,
        avatar,

        // --- Normalized Details ---
        job,
        location,
        mbti,
        height,
        drinking,
        smoking,
        religion,

        // --- Normalized Ticket ---
        ticketType,
        ticketLabel,
        ticketPrice,
        isDeposited,

        // --- Keep Answers for dynamic access ---
        answers
    } as Applicant;
};
