import { User, FirestoreTimestamp } from '../types';

export const getAge = (input: User | string | number | null | undefined | FirestoreTimestamp): string | number => {
    if (!input) return '??';

    let value: any = input;

    // 1. If input is a User Object, extract the best available value
    if (typeof input === 'object' && !('seconds' in input)) {
        const user = input as User;
        // If pre-calculated age exists, return it (unless it's invalid)
        if (user.age && typeof user.age === 'number') return user.age;

        // Hunt for birth date info
        value = user.birthDate ||
            user.birthYear ||
            user.answers?.birth_date ||
            user.answers?.birthDate ||
            (user as any).birth_date; // flattened case
    }

    if (!value) return '??';

    // 2. Process Value
    try {
        const currentYear = new Date().getFullYear();

        // Case A: 8-digit String "19900101"
        if (typeof value === 'string' && value.length === 8) {
            const year = parseInt(value.substring(0, 4), 10);
            if (!isNaN(year)) return currentYear - year + 1;
        }

        // Case B: 4-digit Year (Number or String)
        const strVal = String(value).trim();
        if (strVal.length === 4) {
            const year = parseInt(strVal, 10);
            if (!isNaN(year)) return currentYear - year + 1;
        }

        // Case C: Date Object or Firestore Timestamp
        if (typeof value === 'object' && 'toDate' in value && typeof (value as FirestoreTimestamp).toDate === 'function') {
            return currentYear - (value as FirestoreTimestamp).toDate().getFullYear() + 1;
        }
        if (Object.prototype.toString.call(value) === '[object Date]') {
            return currentYear - (value as Date).getFullYear() + 1;
        }

        // Case D: Loose parsing (start of string) for things like "1990-01-01"
        // This catches "1990-01-01", "1990.01.01"
        if (strVal.length >= 4) {
            const year = parseInt(strVal.substring(0, 4), 10);
            if (!isNaN(year) && year > 1900 && year < currentYear) {
                return currentYear - year + 1;
            }
        }
    } catch (e) {
        console.error("Age calculation error", e);
    }

    return '??';
};
