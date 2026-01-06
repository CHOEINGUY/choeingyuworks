import { useState, useEffect } from 'react';

// Default initial state for simulator
const INITIAL_SESSION_STATE = {
    status: "LIVE",
    currentRound: 1,
    roundDuration: 15,
    breakDuration: 15,
};

export const useSessionSimulator = () => {
    const [status, setStatus] = useState<string>(INITIAL_SESSION_STATE.status);
    const [currentRound, setCurrentRound] = useState<number>(INITIAL_SESSION_STATE.currentRound);
    const [timeLeft, setTimeLeft] = useState<number>(INITIAL_SESSION_STATE.roundDuration);
    const [isPaused, setIsPaused] = useState<boolean>(false);

    useEffect(() => {
        if (status === 'ENDED' || status === 'SELECTION') return;

        const timer = setInterval(() => {
            if (!isPaused) {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        return 0;
                    }
                    return prev - 1;
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [status, isPaused]);

    useEffect(() => {
        if (status === 'ENDED' || status === 'SELECTION') return;

        if (timeLeft === 0) {
            if (status === 'LIVE') {
                setStatus('BREAK');
                setTimeLeft(INITIAL_SESSION_STATE.breakDuration);
            } else if (status === 'BREAK') {
                const nextRound = currentRound + 1;
                // Fallback to 5 if not provided (Simulator Logic)
                if (nextRound > 5) {
                    setStatus('SELECTION');
                } else {
                    setStatus('LIVE');
                    setCurrentRound(nextRound);
                    setTimeLeft(INITIAL_SESSION_STATE.roundDuration);
                }
            }
        }
    }, [timeLeft, status, currentRound]);

    return { status, currentRound, timeLeft, setStatus, setCurrentRound, setTimeLeft, isPaused, setIsPaused };
};
