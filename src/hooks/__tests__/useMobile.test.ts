import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMobile } from '../useMobile';

describe('useMobile hook', () => {
    const originalInnerWidth = window.innerWidth;

    beforeEach(() => {
        // Reset to desktop width before each test
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });
    });

    afterEach(() => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalInnerWidth,
        });
    });

    it('returns false for desktop width (>= 768)', () => {
        Object.defineProperty(window, 'innerWidth', { value: 1024 });
        const { result } = renderHook(() => useMobile());
        expect(result.current).toBe(false);
    });

    it('returns true for mobile width (< 768)', () => {
        Object.defineProperty(window, 'innerWidth', { value: 375 });
        const { result } = renderHook(() => useMobile());
        expect(result.current).toBe(true);
    });

    it('respects custom breakpoint', () => {
        Object.defineProperty(window, 'innerWidth', { value: 900 });
        
        // Default breakpoint (768) - should be desktop
        const { result: defaultResult } = renderHook(() => useMobile());
        expect(defaultResult.current).toBe(false);

        // Custom breakpoint (1024) - should be mobile
        const { result: customResult } = renderHook(() => useMobile(1024));
        expect(customResult.current).toBe(true);
    });

    it('updates on resize event', () => {
        Object.defineProperty(window, 'innerWidth', { value: 1024 });
        const { result } = renderHook(() => useMobile());
        
        expect(result.current).toBe(false);

        // Simulate resize to mobile
        act(() => {
            Object.defineProperty(window, 'innerWidth', { value: 375 });
            window.dispatchEvent(new Event('resize'));
        });

        expect(result.current).toBe(true);
    });

    it('handles boundary case (exactly at breakpoint)', () => {
        Object.defineProperty(window, 'innerWidth', { value: 768 });
        const { result } = renderHook(() => useMobile());
        // 768 is NOT less than 768, so it should be desktop
        expect(result.current).toBe(false);
    });

    it('handles boundary case (one below breakpoint)', () => {
        Object.defineProperty(window, 'innerWidth', { value: 767 });
        const { result } = renderHook(() => useMobile());
        expect(result.current).toBe(true);
    });
});
