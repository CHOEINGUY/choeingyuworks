import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn (className utility)', () => {
    it('merges multiple class names', () => {
        expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('handles conditional classes', () => {
        const isActive = true;
        const isDisabled = false;
        expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active');
    });

    it('resolves Tailwind conflicts (last wins)', () => {
        // When both p-2 and p-4 are present, p-4 should win
        expect(cn('p-2', 'p-4')).toBe('p-4');
    });

    it('resolves complex Tailwind conflicts', () => {
        // bg-red-500 should be overridden by bg-blue-500
        expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('handles array inputs', () => {
        expect(cn(['foo', 'bar'])).toBe('foo bar');
    });

    it('handles object inputs', () => {
        expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
    });

    it('handles empty inputs', () => {
        expect(cn()).toBe('');
        expect(cn('')).toBe('');
        expect(cn(null, undefined)).toBe('');
    });

    it('handles mixed inputs', () => {
        expect(cn('base', ['arr1', 'arr2'], { obj: true })).toBe('base arr1 arr2 obj');
    });

    it('trims and deduplicates whitespace', () => {
        expect(cn('  foo  ', 'bar')).toBe('foo bar');
    });
});
