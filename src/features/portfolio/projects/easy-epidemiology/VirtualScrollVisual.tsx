"use client";

import { AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface Props {
    isActive?: boolean;
    scale?: number;
    isEmbedded?: boolean;
}

export function VirtualScrollVisual({ isActive = true, scale = 1 }: Props) {
    const [scrollPos, setScrollPos] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);
    
    // Simulate extensive list
    const totalItems = 1000;
    const itemHeight = 40;
    const containerHeight = 320;
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    
    // Virtual Scroll Logic Simulation
    const startIndex = Math.floor(scrollPos / itemHeight);
    const endIndex = Math.min(totalItems - 1, startIndex + visibleCount + 1);
    
    const visibleItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
        visibleItems.push({
            index: i,
            top: i * itemHeight,
            // Varying widths for "skeleton" effect
            width: 60 + (i % 5) * 10 
        });
    }

    // Auto-scroll effect for the card visual
    useEffect(() => {
        if (!isActive || !autoScroll) return;
        
        const interval = setInterval(() => {
            if (containerRef.current) {
                // Scroll down and loop back
                const newPos = (scrollPos + 2) % (totalItems * itemHeight - containerHeight);
                setScrollPos(newPos);
                containerRef.current.scrollTop = newPos;
            }
        }, 20);

        return () => clearInterval(interval);
    }, [isActive, autoScroll, scrollPos]);

    return (
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }} className="w-full h-full flex items-center justify-center">
             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative w-[320px] h-[400px] flex flex-col">
                {/* Header */}
                <div className="h-12 border-b border-gray-100 flex items-center px-4 gap-2 bg-gray-50/50">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="ml-auto text-xs text-gray-400 font-mono">VirtualGrid Engine</div>
                </div>

                {/* Grid Body with Scroll */}
                <div 
                    ref={containerRef}
                    className="flex-1 overflow-y-auto relative no-scrollbar"
                    // Disable manual scroll if auto-scroll is intended, or allow user to take over
                    onMouseEnter={() => setAutoScroll(false)}
                    onMouseLeave={() => setAutoScroll(true)}
                    onScroll={(e) => {
                         if (!autoScroll) {
                             setScrollPos((e.target as HTMLDivElement).scrollTop);
                         }
                    }}
                >
                    {/* Phantom Helper (Fake Height) */}
                    <div style={{ height: totalItems * itemHeight, position: 'relative' }}>
                        
                        {/* Rendered Items Only */}
                        <AnimatePresence>
                            {visibleItems.map((item) => (
                                <div
                                    key={item.index}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: itemHeight,
                                        transform: `translateY(${item.top}px)`
                                    }}
                                    className="border-b border-gray-50 flex items-center px-4 hover:bg-emerald-50/30 transition-colors"
                                >
                                    <div className="w-12 text-xs text-gray-400 font-mono font-medium">
                                        #{item.index + 1}
                                    </div>
                                    <div className="flex-1 flex gap-3">
                                        <div className="h-2 bg-gray-100 rounded-full w-full" style={{ width: `${item.width}%` }} />
                                    </div>
                                </div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
                
                {/* Overlay Stats */}
                <div className="absolute top-16 right-4 bg-white/90 backdrop-blur shadow-lg rounded-lg p-3 border border-gray-100 text-[10px] font-mono space-y-1 pointer-events-none">
                     <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Nodes</span>
                        <span className="font-bold text-emerald-600">{visibleItems.length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
