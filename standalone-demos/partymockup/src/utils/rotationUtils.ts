import { User, RotationMap } from '../types';

/**
 * Generates rotation pairs for a N:N session.
 * Algorithm: Simple Shift (Round Robin)
 * 
 * @param {Array} users List of user objects (must include 'id' and 'gender')
 * @returns {Object} Rotation Map: { 1: { m1: f1, m2: f2 }, 2: { m1: f2, m2: f3 }, ... }
 */
// Fixed Table Rotation Logic
// 1. Determine N = max(males, females)
// 2. Tables are 1..N
// 3. Female at Table K stays at Table K
// 4. Male at Table K (Round 1) Moves to Table K+1 (Round 2) -> Modulo Arithmetic
export const generateRotations = (users: User[]): RotationMap => {
    // 1. Pre-process: Only include users who have checked in or have a pre-assigned table
    // This ensures that "ghost" participants don't take up rotation slots.
    const malesWithTable = users.filter(u => u.gender === 'M' && (u.isCheckedIn || u.tableNumber))
        .sort((a, b) => (a.tableNumber || 999) - (b.tableNumber || 999) || a.id.localeCompare(b.id));
    const femalesWithTable = users.filter(u => u.gender === 'F' && (u.isCheckedIn || u.tableNumber))
        .sort((a, b) => (a.tableNumber || 999) - (b.tableNumber || 999) || a.id.localeCompare(b.id));

    // Fallback table assignment is REMOVED.
    // Table numbers must be assigned via the check-in service or manually.

    const count = Math.max(malesWithTable.length, femalesWithTable.length); // N Tables
    const rotations: RotationMap = {};
    if (count === 0) return {};

    // Helper: Find user at specific table for specific gender
    const findAtTable = (list: User[], tableNum: number) => list.find(u => u.tableNumber === tableNum);

    // Generate N Rounds
    for (let round = 1; round <= count; round++) {
        const roundPairs: Record<string, string | null> = {};

        // For each Table k (1..count)
        for (let table = 1; table <= count; table++) {
            const female = findAtTable(femalesWithTable, table);

            // Male rotates. Table T at Round R gets Male who started at table X.
            // formula: (table - 1 - (round - 1) + count) % count + 1
            const originalMaleTable = (table - 1 - (round - 1) + (count * 10)) % count + 1;
            const male = findAtTable(malesWithTable, originalMaleTable);

            if (male) {
                roundPairs[male.id] = female ? female.id : null;
            }
            if (female) {
                roundPairs[female.id] = male ? male.id : null;
            }
        }
        rotations[round] = roundPairs;
    }

    return rotations;
};
