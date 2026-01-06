import { useEffect, useRef } from 'react';

// Custom Hook to intercept Back Button
const useBackHandler = (isOpen: boolean, onClose: () => void) => {
    const isHandlingRef = useRef(false);
    const onCloseRef = useRef(onClose);

    // Update ref whenever handler changes
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            // Push a dummy state to history
            window.history.pushState({ modalOpen: true }, '', window.location.href);
            isHandlingRef.current = true;

            const handlePopState = (event: PopStateEvent) => {
                // Prevent default back navigation if we are handling it
                if (isHandlingRef.current) {
                    onCloseRef.current(); // Call the latest handler
                    isHandlingRef.current = false;
                }
            };

            window.addEventListener('popstate', handlePopState);

            return () => {
                window.removeEventListener('popstate', handlePopState);
                if (isHandlingRef.current) {
                    window.history.back();
                    isHandlingRef.current = false;
                }
            };
        }
    }, [isOpen]); // Only re-run if isOpen changes
};

export default useBackHandler;
