import { useCallback } from 'react';
import { SYSTEM_FIELDS } from '../constants/systemFields';
import { MANDATORY_PRESETS, CORE_PRESETS } from '../data/formPresets';

// [NEW] Dynamically derive strict fields from the Single Source of Truth (Presets)
// This ensures that if we update the preset to be strict, the logic automatically follows.
const STRICT_SYSTEM_FIELDS = [
    ...MANDATORY_PRESETS,
    ...CORE_PRESETS
].filter(p => p.storeRawValue).map(p => p.id);

export const useFormSubmission = () => {

    // [Refactor] No longer hardcoded. We use STRICT_SYSTEM_FIELDS derived from presets + q.storeRawValue
    // const strictValueFields = ['gender', 'ticket_option', 'schedule', 'birth_date', 'birthYear'];

    const processAnswers = useCallback((rawAnswers: Record<string, any>, questions: any[]) => {
        const processed = { ...rawAnswers };

        questions.forEach(q => {
            // Only process if it's a choice field and NOT a strict value field
            // Strict check: Either explicitly marked in config (q.storeRawValue) OR defined as strict in System Presets
            const isStrict = q.storeRawValue || (q.id && STRICT_SYSTEM_FIELDS.includes(q.id));

            if (['single_choice', 'multiple_choice', 'dropdown'].includes(q.type) && !isStrict) {
                const rawValue = rawAnswers[q.id];
                if (!rawValue) return;

                if (Array.isArray(rawValue)) {
                    // Multiple Choice
                    const labels = rawValue.map(val => {
                        const opt = q.options?.find((o: any) => (typeof o === 'object' ? o.value : o) === val);
                        return opt ? (typeof opt === 'object' ? opt.label : opt) : val;
                    });
                    processed[q.id] = labels; // Save Array of Labels
                } else {
                    // Single Choice / Dropdown
                    const opt = q.options?.find((o: any) => (typeof o === 'object' ? o.value : o) === rawValue);
                    if (opt) {
                        processed[q.id] = typeof opt === 'object' ? opt.label : opt;
                    }
                }
            }
        });

        return processed;
    }, []);

    const constructDocData = useCallback((rawAnswers: Record<string, any>, processedAnswers: Record<string, any>, questions: any[], sessionId: string, sessionTitle: string) => {
        return {
            // Metadata
            createdAt: new Date().toISOString(),
            appliedSessionId: sessionId,
            sessionTitle: sessionTitle,
            status: 'pending', // Default status for applicants

            // System Fields (Top-level for Indexing/UI)
            // Note: We use rawAnswers for gender/phone/birth to ensure logic works, 
            // but explicit rendered fields (like job, location, drinking) should use processedAnswers if they were choices.
            name: rawAnswers['name'] || '',
            nickname: rawAnswers['nickname'] || '',
            phone: rawAnswers['phone'] || '',
            gender: rawAnswers['gender'] || '', // Keep Value (M/F)
            birthDate: rawAnswers['birth_date'] || '', // YYYYMMDD string

            // Fields that might be choice-based (e.g. Location could be region selector which returns text, but if it was dropdown...)
            job: processedAnswers['job'] || '',
            location: processedAnswers['location'] || '',

            // New System Fields (Top-level) - Mapped to Labels
            height: processedAnswers['height'] || '',
            drinking: processedAnswers['drinking'] || '',
            smoking: processedAnswers['smoking'] || '',
            mbti: processedAnswers['mbti'] || '',

            instagram: rawAnswers[SYSTEM_FIELDS.INSTAGRAM] || '',

            // Default Profile Image (if not provided)
            profileImage: rawAnswers['profile_image'] || '',

            // Full Answers Map (Preserve all form data including custom fields)
            answers: processedAnswers,

            // Field Logs (Snapshot of Field Labels for Versioning)
            fieldLogs: questions.reduce((acc, q) => {
                // Priority: 1. Card Label (Admin Props) -> 2. Title -> 3. Label
                acc[q.id] = q.adminProps?.cardLabel || q.title || q.label || '';
                return acc;
            }, {} as Record<string, string>)
        };
    }, []);

    return {
        processAnswers,
        constructDocData
    };
};
