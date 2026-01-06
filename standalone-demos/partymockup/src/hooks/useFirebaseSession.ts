import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';


interface SessionConfig {
    roundDuration: number;
    breakDuration: number;
    themeMode?: 'day' | 'night';
    themeStyle?: 'standard' | 'glass';
    [key: string]: unknown;
}

// Default initial state for new sessions
const INITIAL_SESSION_STATE = {
    status: "WAITING", // Default to WAITING for safety
    currentRound: 1,
    roundDuration: 600, // 10 minutes default
    breakDuration: 300, // 5 minutes default
};

export const useFirebaseSession = (sessionId: string | null) => {
    const [status, setStatus] = useState(INITIAL_SESSION_STATE.status);
    const [currentRound, setCurrentRound] = useState(INITIAL_SESSION_STATE.currentRound);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [loading, setLoading] = useState(true);


    const [config, setConfig] = useState<SessionConfig>({
        roundDuration: INITIAL_SESSION_STATE.roundDuration,
        breakDuration: INITIAL_SESSION_STATE.breakDuration
    });

    // State for local calculation
    // startTime can be Firestore Timestamp or null
    const [startTime, setStartTime] = useState<Timestamp | { seconds: number, changeRequest?: string } | null>(null);
    const [pausedTimeLeft, setPausedTimeLeft] = useState(0);

    // Helper to update session in DB
    const updateSession = async (data: Record<string, unknown>) => {
        if (!sessionId) return;
        const sessionRef = doc(db, 'sessions', sessionId);
        await updateDoc(sessionRef, data);
    };

    const initializeSession = async () => {
        if (!sessionId) return;
        const sessionRef = doc(db, 'sessions', sessionId);
        await setDoc(sessionRef, {
            status: 'WAITING',
            currentRound: 1,
            isPaused: false,
            startTime: serverTimestamp(),
            config: {
                roundDuration: INITIAL_SESSION_STATE.roundDuration,
                breakDuration: INITIAL_SESSION_STATE.breakDuration
            }
        });
    };

    const handleAutoSwitch = () => {
        // Only LIVE -> BREAK is automatic (Timer based)
        // BREAK -> LIVE/SELECTION is Manual (Admin controlled)
        if (status === 'LIVE') {
            updateSession({
                status: 'BREAK',
                startTime: serverTimestamp()
            });
        }
    };

    // Main Sync Effect
    useEffect(() => {
        if (!sessionId) {
            setLoading(false);
            return;
        }

        let isMounted = true;

        // 1. Reset State immediately on ID change to prevent stale data
        setLoading(true);
        setStatus('WAITING'); // Force waiting state to prevent UI flicker
        setConfig({
            roundDuration: INITIAL_SESSION_STATE.roundDuration,
            breakDuration: INITIAL_SESSION_STATE.breakDuration,
            themeMode: 'day',
            themeStyle: 'standard'
        });

        const sessionRef = doc(db, 'sessions', sessionId);

        const unsubscribe = onSnapshot(sessionRef, (docSnap) => {
            if (!isMounted) return;

            if (docSnap.exists()) {
                const data = docSnap.data();
                setStatus(data.status || 'WAITING');
                setCurrentRound(data.currentRound || 1);
                setIsPaused(data.isPaused || false);
                setStartTime(data.startTime);
                setPausedTimeLeft(data.pausedTimeLeft || 0);


                // Update Config (Merge with defaults to prevent missing keys)
                const savedConfig = data.config || {};
                const newConfig = {
                    ...savedConfig,
                    roundDuration: savedConfig.roundDuration || INITIAL_SESSION_STATE.roundDuration,
                    breakDuration: savedConfig.breakDuration || INITIAL_SESSION_STATE.breakDuration
                };
                setConfig(newConfig);

                setLoading(false);
            } else {
                initializeSession();
            }
        }, (error) => {
            console.error("Firebase Sync Error:", error);
            if (isMounted) setLoading(false);
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, [sessionId]);

    // Local Timer & Auto-Switch Effect
    useEffect(() => {
        if (loading) return;

        const tick = () => {
            if (!isPaused && status !== 'ENDED' && status !== 'SELECTION' && startTime) {
                const now = Date.now();
                // Check if startTime is a Firestore Timestamp (has toMillis) or Seconds object
                const start = (startTime as any).toMillis ? (startTime as any).toMillis() : ((startTime as any).seconds ? (startTime as any).seconds * 1000 : null);

                // Double check if start is valid
                if (!start) return;

                const duration = status === 'BREAK' ? config.breakDuration : config.roundDuration;
                const elapsed = (now - start) / 1000;
                // Clamp remaining time to max duration to prevent 10:01 glitch
                const remaining = Math.min(duration, Math.max(0, Math.ceil(duration - elapsed)));

                setTimeLeft(remaining);

                if (remaining <= 0) {
                    handleAutoSwitch();
                }
            } else if (isPaused) {
                setTimeLeft(pausedTimeLeft);
            }
        };

        // Run immediately
        tick();

        const timer = setInterval(tick, 1000);

        return () => clearInterval(timer);
    }, [isPaused, status, startTime, config, loading, pausedTimeLeft, sessionId]);


    // Action Handlers
    const setStatusDB = (newStatus: string) => {
        updateSession({
            status: newStatus,
            startTime: serverTimestamp()
        });
    };

    const setCurrentRoundDB = (newRound: number) => {
        updateSession({ currentRound: newRound });
    };

    const updateConfig = (newConfig: Partial<SessionConfig>) => {
        updateSession({ config: { ...config, ...newConfig } });
    };

    // Atomic Status Change Helpers
    const startRound = (round: number) => {
        updateSession({
            status: 'LIVE',
            currentRound: round,
            isPaused: false,
            startTime: serverTimestamp()
        });
    };

    const startSelection = () => {
        updateSession({
            status: 'SELECTION',
            isPaused: false,
            // startTime not critical here but good for safety
            startTime: serverTimestamp()
        });
    };

    const endSession = () => {
        updateSession({
            status: 'ENDED',
            isPaused: true
        });
    };

    // Adjust the timer by shifting the startTime
    const adjustTime = async (seconds: number) => {
        const duration = status === 'BREAK' ? config.breakDuration : config.roundDuration;
        const targetRemaining = timeLeft + seconds;
        // elapsed = duration - targetRemaining
        const newElapsed = duration - targetRemaining;
        const newStart = new Date(Date.now() - newElapsed * 1000);

        updateSession({ startTime: newStart });
    };

    const setIsPausedDB = (paused: boolean) => {
        if (paused) {
            updateSession({
                isPaused: true,
                pausedTimeLeft: timeLeft
            });
        } else {
            // Fix Resume Logic (Since we are rewriting the hook anyway)
            const duration = status === 'BREAK' ? config.breakDuration : config.roundDuration;
            const elapsed = duration - timeLeft;
            const newStart = new Date(Date.now() - elapsed * 1000);
            updateSession({
                isPaused: false,
                startTime: newStart
            });
        }
    };

    const resetSession = () => {
        updateSession({
            status: 'WAITING',
            currentRound: 1,
            isPaused: true,
            pausedTimeLeft: config.roundDuration // Reset to full duration
        });
    };

    return {
        status,
        currentRound,
        timeLeft,
        isPaused,
        loading,
        config,

        setStatus: setStatusDB,
        setCurrentRound: setCurrentRoundDB,
        setIsPaused: setIsPausedDB,
        updateConfig,
        adjustTime,
        resetSession,
        startRound,
        startSelection,
        endSession
    };
};

