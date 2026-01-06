import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';

interface BottomSheetProps {
    children: React.ReactNode;
    /** Content to be transparently shown when 'peeking' (the handle area) */
    handleContent?: React.ReactNode;
    /** Height of the peek area in pixels */
    peekHeight?: number;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
    children,
    handleContent,
    peekHeight = 85
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const controls = useAnimation();

    // Check window height
    const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);

    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Lock body scroll when open
    // Lock body scroll when open
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (isOpen) {
            // Save current scroll position
            const scrollY = window.scrollY;

            // Robust iOS Scroll Lock
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflowY = 'hidden';

            // Also lock html for good measure
            document.documentElement.style.overflow = 'hidden';
            document.documentElement.style.overscrollBehavior = 'none';

        } else {
            // Restore scroll position with delay to absorb momentum
            timer = setTimeout(() => {
                const scrollY = document.body.style.top;

                // Cleanup styles
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflowY = '';

                document.documentElement.style.overflow = '';
                document.documentElement.style.overscrollBehavior = '';

                // Scroll back to where we were
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }, 300);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isOpen]);

    // Dimensions

    // Dimensions
    const minHeight = peekHeight;
    const maxHeight = windowHeight * 0.96; // 96vh

    // We control HEIGHT now, not Y position
    const height = useMotionValue(minHeight);

    // Refs for drag logic
    const contentRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const isTouchingHandle = useRef(false);
    const startY = useRef(0);
    const startHeight = useRef(minHeight);
    const currentHeight = useRef(minHeight);

    useEffect(() => {
        const unsub = height.on("change", (latest) => {
            currentHeight.current = latest;
        });
        return unsub;
    }, [height]);

    // Initial State
    useEffect(() => {
        height.set(minHeight);
        controls.start({ height: minHeight });
    }, [minHeight, controls, height]);


    // --- Touch Handlers ---

    const handleTouchStart = (e: React.TouchEvent) => {
        controls.stop();
        startY.current = e.touches[0].clientY;
        startHeight.current = currentHeight.current;
        isDragging.current = false;

        if (handleRef.current && e.target && handleRef.current.contains(e.target as Node)) {
            isTouchingHandle.current = true;
        } else {
            isTouchingHandle.current = false;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const touchY = e.touches[0].clientY;
        const deltaY = touchY - startY.current; // + checked down, - checked up

        // Logic: Dragging UP (-) means INCREASING height
        const newHeight = startHeight.current - deltaY;

        // Condition A: Always drag if in dragging mode
        if (isDragging.current) {
            e.preventDefault();
            // Constraint: Don't exceed maxHeight too much
            if (newHeight > maxHeight + 50) return;
            // Don't shrink below minHeight too much
            if (newHeight < minHeight - 20) return;

            height.set(newHeight);
            return;
        }

        // Condition B: Determine Drag Intent
        const contentScrollTop = contentRef.current?.scrollTop || 0;
        const atTop = contentScrollTop <= 0;

        const isClosed = Math.abs(currentHeight.current - minHeight) < 10;
        const isPullingDown = deltaY > 0; // Shrinking
        const isPullingUp = deltaY < 0;   // Growing

        // - Closed and pulling UP -> Grow
        // - Open (at top) and pulling DOWN -> Shrink

        if (isTouchingHandle.current) {
            isDragging.current = true;
        } else if (isClosed && isPullingUp) {
            isDragging.current = true;
        } else if (atTop && isPullingDown) {
            // Only start shrinking if we are expanded beyond min
            if (currentHeight.current > minHeight + 10) {
                isDragging.current = true;
            }
        }

        if (isDragging.current) {
            height.set(newHeight);
        }
    };

    const handleTouchEnd = () => {
        const endH = currentHeight.current;
        const range = maxHeight - minHeight;
        const progress = (endH - minHeight) / range; // 0 = closed, 1 = open

        let shouldOpen = false;

        if (isOpen) {
            // If already open, keep open unless dragged down slightly (below 80%)
            // This makes it easier to close (only need to drag down 20% of range)
            shouldOpen = progress > 0.8;
        } else {
            // If closed, open if dragged up slightly (above 20%)
            shouldOpen = progress > 0.2;
        }

        if (shouldOpen) {
            setIsOpen(true);
            controls.start({ height: maxHeight, transition: { type: "spring", damping: 30, stiffness: 300 } });
        } else {
            setIsOpen(false);
            controls.start({ height: minHeight, transition: { type: "spring", damping: 30, stiffness: 300 } });
        }
        isDragging.current = false;
    };

    // --- Interaction ---
    const handleTap = () => {
        if (isOpen) {
            setIsOpen(false);
            controls.start({ height: minHeight });
        } else {
            setIsOpen(true);
            controls.start({ height: maxHeight });
        }
    };

    // --- Event Listeners via Ref ---
    const sheetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = sheetRef.current;
        if (!element) return;

        const onTouchStart = (e: TouchEvent) => handleTouchStart(e as unknown as React.TouchEvent);
        const onTouchMove = (e: TouchEvent) => handleTouchMove(e as unknown as React.TouchEvent);
        const onTouchEnd = () => handleTouchEnd();

        element.addEventListener('touchstart', onTouchStart, { passive: false });
        element.addEventListener('touchmove', onTouchMove, { passive: false });
        element.addEventListener('touchend', onTouchEnd);

        return () => {
            element.removeEventListener('touchstart', onTouchStart);
            element.removeEventListener('touchmove', onTouchMove);
            element.removeEventListener('touchend', onTouchEnd);
        };
    }, [windowHeight, minHeight, maxHeight, isOpen]); // Added isOpen dependency

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                        setIsOpen(false);
                        controls.start({ height: minHeight });
                    }}
                    className="fixed inset-0 bg-black/40 z-[999] touch-none"
                    style={{ pointerEvents: 'auto' }}
                />
            )}

            <motion.div
                animate={controls}
                style={{ height, touchAction: 'pan-y' }}
                className="absolute left-0 right-0 bottom-0 z-[1000] bg-[#111] rounded-t-[24px] shadow-[0_-2px_10px_rgba(0,0,0,0.3)] flex flex-col pointer-events-auto overflow-hidden"
                ref={sheetRef}
            >
                {/* Handle Area */}
                <div
                    ref={handleRef}
                    onClick={handleTap}
                    className="shrink-0 cursor-pointer"
                >
                    {handleContent}
                </div>

                {/* Content Area */}
                <div
                    ref={contentRef}
                    className="flex-1 overflow-y-auto"
                >
                    {children}
                </div>
            </motion.div>
        </>
    );
};

export default BottomSheet;
