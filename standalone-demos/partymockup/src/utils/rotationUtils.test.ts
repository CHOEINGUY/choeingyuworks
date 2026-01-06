import { describe, it, expect } from 'vitest';
import { generateRotations } from './rotationUtils';
import { User } from '../types';

describe('rotationUtils', () => {
    const createUsers = (m: number, f: number): User[] => {
        const users: User[] = [];
        for (let i = 1; i <= m; i++) {
            users.push({ id: `m${i}`, gender: 'M', tableNumber: i, name: `Man ${i}` } as User);
        }
        for (let i = 1; i <= f; i++) {
            users.push({ id: `f${i}`, gender: 'F', tableNumber: i, name: `Woman ${i}` } as User);
        }
        return users;
    };

    it('should generate correct rotations for even participants (3M, 3F)', () => {
        const users = createUsers(3, 3);
        const rotations = generateRotations(users);

        expect(Object.keys(rotations).length).toBe(3);
        // Round 1
        expect(rotations[1]['m1']).toBe('f1');
        expect(rotations[1]['m2']).toBe('f2');
        expect(rotations[1]['m3']).toBe('f3');

        // Round 2 (Male 1 moves to next table?)
        // formula: originalMaleTable = (table - 1 - (round - 1) + count) % count + 1
        // T=1, R=2, N=3 -> (1-1-1+3)%3+1 = 2 % 3 + 1 = 3. 
        // So Table 1 gets Male who started at Table 3.
        expect(rotations[2]['m3']).toBe('f1');
        expect(rotations[2]['m1']).toBe('f2');
        expect(rotations[2]['m2']).toBe('f3');
    });

    it('should handle uneven participants (2M, 3F)', () => {
        const users = createUsers(2, 3);
        const rotations = generateRotations(users);

        expect(Object.keys(rotations).length).toBe(3);
        // Round 1: m1-f1, m2-f2, null-f3
        expect(rotations[1]['f1']).toBe('m1');
        expect(rotations[1]['f2']).toBe('m2');
        expect(rotations[1]['f3']).toBeNull();
    });

    it('should handle missing table numbers by auto-assigning', () => {
        const users: User[] = [
            { id: 'm1', gender: 'M', name: 'M1' } as User, // No table
            { id: 'm2', gender: 'M', name: 'M2' } as User, // No table
            { id: 'f1', gender: 'F', name: 'F1' } as User, // No table
            { id: 'f2', gender: 'F', name: 'F2' } as User, // No table
        ];

        const rotations = generateRotations(users);
        expect(Object.keys(rotations).length).toBe(2);
        expect(rotations[1]['m1']).not.toBeNull();
        expect(rotations[1]['m2']).not.toBeNull();
    });
});
