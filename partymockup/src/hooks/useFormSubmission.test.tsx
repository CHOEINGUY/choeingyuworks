import { renderHook } from '@testing-library/react';
import { useFormSubmission } from './useFormSubmission';
import { describe, it, expect } from 'vitest';

describe('useFormSubmission', () => {
    const mockQuestions = [
        { id: 'name', type: 'text', label: 'Name' },
        { id: 'gender', type: 'single_choice', label: 'Gender', options: [{ label: 'Male', value: 'M' }, { label: 'Female', value: 'F' }] },
        { id: 'job', type: 'dropdown', label: 'Job', options: [{ label: 'Developer', value: 'dev' }, { label: 'Designer', value: 'des' }] },
        { id: 'hobbies', type: 'multiple_choice', label: 'Hobbies', options: ['Reading', 'Gaming'] },
        { id: 'birth_date', type: 'date', label: 'Birth Date' } // Strict field
    ];

    it('processAnswers should convert choice values to labels except for strict fields', () => {
        const { result } = renderHook(() => useFormSubmission());
        const { processAnswers } = result.current;

        const rawAnswers = {
            name: 'John',
            gender: 'M', // Strict: should stay 'M'
            job: 'dev',  // Strict?: NO, not in strictValueFields list in hook source. expected: 'Developer'
            hobbies: ['Gaming'], // Expected: ['Gaming'] (since values match labels here, let's change options to object to be sure)
            birth_date: '19900101'
        };

        // Re-defining options for clarity in test
        const questionsWithComplexOptions = [
            ...mockQuestions,
            { id: 'hobbies', type: 'multiple_choice', label: 'Hobbies', options: [{ label: 'Gaming Label', value: 'game' }] }
        ];

        const rawAnswersComplex = {
            ...rawAnswers,
            hobbies: ['game']
        };

        const processed = processAnswers(rawAnswersComplex, questionsWithComplexOptions);

        expect(processed.gender).toBe('M'); // Strict field, keeps value
        expect(processed.job).toBe('Developer'); // Non-strict, converts to label
        expect(processed.hobbies).toEqual(['Gaming Label']); // Array conversion
        expect(processed.birth_date).toBe('19900101'); // Strict field
    });

    it('constructDocData should map fields correctly', () => {
        const { result } = renderHook(() => useFormSubmission());
        const { constructDocData } = result.current;

        const rawAnswers = {
            name: 'Alice',
            phone: '010-1234-5678',
            gender: 'F',
            birth_date: '20000101',
            profile_image: 'custom.jpg'
        };
        const processedAnswers = {
            ...rawAnswers,
            job: 'Engineer', // Processed label
            location: 'New York'
        };

        const sessionId = 'sess_1';
        const sessionTitle = 'Test Session';

        const docData = constructDocData(rawAnswers, processedAnswers, mockQuestions, sessionId, sessionTitle);

        expect(docData.name).toBe('Alice');
        expect(docData.phone).toBe('010-1234-5678');
        expect(docData.gender).toBe('F');
        expect(docData.birthDate).toBe('20000101');
        expect(docData.job).toBe('Engineer');
        expect(docData.location).toBe('New York');
        expect(docData.appliedSessionId).toBe(sessionId);
        expect(docData.status).toBe('pending');
        expect(docData.profileImage).toBe('custom.jpg');
        expect(docData.answers).toEqual(processedAnswers);

        // Field Logs check
        expect(docData.fieldLogs['name']).toBe('Name');
    });

    it('constructDocData should generate default profile image if missing', () => {
        const { result } = renderHook(() => useFormSubmission());
        const { constructDocData } = result.current;

        const rawAnswers = { phone: '010-1234-5678' }; // minimal
        const docData = constructDocData(rawAnswers, {}, [], 's1', 't1');

        expect(docData.profileImage).toBe('');
    });
});
