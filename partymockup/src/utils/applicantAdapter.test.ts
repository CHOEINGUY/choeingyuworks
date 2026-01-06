import { describe, it, expect } from 'vitest';
import { normalizeApplicant } from './applicantAdapter';

describe('applicantAdapter', () => {
    it('normalizes flat data structure', () => {
        const input = {
            id: '123',
            name: 'John Doe',
            phoneNumber: '010-1234-5678',
            gender: 'M',
            birthDate: '19900101',
            job: 'Developer',
            location: 'Seoul'
        };
        const result = normalizeApplicant(input);
        expect(result.id).toBe('123');
        expect(result.name).toBe('John Doe');
        expect(result.phone).toBe('010-1234-5678');
        expect(result.job).toBe('Developer');
        expect(result.age).toBeDefined(); // Should calculate age
    });

    it('prioritizes top-level data over answers', () => {
        const input = {
            name: 'Top Level Name',
            answers: {
                name: 'Answer Name'
            }
        };
        const result = normalizeApplicant(input);
        expect(result.name).toBe('Top Level Name');
    });

    it('falls back to answers if top-level is missing', () => {
        const input = {
            answers: {
                name: 'Answer Name',
                job: 'Answer Job'
            }
        };
        const result = normalizeApplicant(input);
        expect(result.name).toBe('Answer Name');
        expect(result.job).toBe('Answer Job');
    });

    it('consolidates image fields', () => {
        // Case 1: avatar present
        expect(normalizeApplicant({ avatar: 'avatar.jpg' }).avatar).toBe('avatar.jpg');

        // Case 2: profileImage present
        expect(normalizeApplicant({ profileImage: 'profile.jpg' }).avatar).toBe('profile.jpg');

        // Case 3: answers.face_photo
        expect(normalizeApplicant({ answers: { face_photo: 'face.jpg' } }).avatar).toBe('face.jpg');
    });

    it('calculates age correctly during normalization', () => {
        const currentYear = new Date().getFullYear();
        const input = {
            birthDate: '20000101'
        };
        const result = normalizeApplicant(input);
        expect(result.age).toBe(currentYear - 2000 + 1);
        expect(result.birthYear).toBe(2000);
    });

    it('normalizes ticket info', () => {
        const input = {
            ticket: {
                id: 'ticket-1',
                label: 'Gold Ticket',
                price: 10000,
                isDeposited: true
            }
        };
        const result = normalizeApplicant(input);
        expect(result.ticketType).toBe('ticket-1');
        expect(result.ticketLabel).toBe('Gold Ticket');
        expect(result.ticketPrice).toBe(10000);
        expect(result.isDeposited).toBe(true);
    });
});
