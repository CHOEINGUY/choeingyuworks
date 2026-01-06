import { describe, it, expect } from 'vitest';
import { getAge } from './ageUtils';

describe('ageUtils', () => {
    const currentYear = new Date().getFullYear();

    it('null/undefined', () => {
        expect(getAge(null)).toBe('??');
        expect(getAge(undefined)).toBe('??');
    });

    it('User.age', () => {
        expect(getAge({ age: 25 } as any)).toBe(25);
    });

    it('YYYYMMDD string', () => {
        const res = getAge('19900101');
        if (res !== currentYear - 1990 + 1) console.error('YYYYMMDD failed', res);
        expect(res).toBe(currentYear - 1990 + 1);
    });

    it('YYYY string', () => {
        const res = getAge('1990');
        expect(res).toBe(currentYear - 1990 + 1);
    });

    it('User.birthDate YYYYMMDD', () => {
        expect(getAge({ birthDate: '20000101' } as any)).toBe(currentYear - 2000 + 1);
    });

    it('User.answers.birth_date', () => {
        expect(getAge({ answers: { birth_date: '19950505' } } as any)).toBe(currentYear - 1995 + 1);
    });

    it('Date object', () => {
        // Mock Date to ensure control? No, logic uses currentYear.
        const date = new Date(1990, 0, 1); // Month is 0-indexed
        // date.getFullYear() -> 1990.
        expect(getAge(date as any)).toBe(currentYear - 1990 + 1);
    });

    it('Firestore Timestamp', () => {
        const timestamp = {
            toDate: () => new Date(1990, 0, 1),
            seconds: 1234567890
        };
        const res = getAge(timestamp as any);
        if (res !== currentYear - 1990 + 1) console.error('Firestore failed', res);
        expect(res).toBe(currentYear - 1990 + 1);
    });

    it('Loose string 1990-01-01', () => {
        expect(getAge("1990-01-01")).toBe(currentYear - 1990 + 1);
    });

    it('Invalid format', () => {
        expect(getAge('invalid')).toBe('??');
        expect(getAge('12')).toBe('??');
    });
});

