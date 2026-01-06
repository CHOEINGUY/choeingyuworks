import React, { useState, ReactNode } from "react";
// @ts-ignore
import SwipeableBottomSheet from "react-swipeable-bottom-sheet";
import { ChevronUp } from "lucide-react";

interface BottomSheetProps {
    children: ReactNode;
    title?: string;
    triggerText?: string;
}

/**
 * BottomSheet Component
 * Uses react-swipeable-bottom-sheet for natural gesture interaction.
 */
const BottomSheet: React.FC<BottomSheetProps> = ({ children, title = "행사 안내", triggerText = "상세 정보 보기" }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Backdrop for darker background when open */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 pointer-events-none z-40 ${open ? "opacity-50" : "opacity-0"
                    }`}
            />

            <SwipeableBottomSheet
                open={open}
                onChange={setOpen}
                overflowHeight={90} // Height of the visible "peek" area (handle)
                shadowTip={false} // Disable default shadow tip to use custom styling
                fullScreen={false} // Allow it to not take full height if content is small
                overlay={false} // We manage backdrop manually or disabled it for the peek area interaction
                style={{ zIndex: 50 }}
                bodyStyle={{
                    borderTopLeftRadius: "30px",
                    borderTopRightRadius: "30px",
                    boxShadow: "0 -5px 20px rgba(0,0,0,0.1)",
                    backgroundColor: "transparent", // Let inner div handle background for dark mode support
                }}
            >
                {/* 
                  Inner Container for content & styling 
                  We need this wrapper because bodyStyle in the library might struggle with className dark mode modifiers 
                  or we want to ensure the background color reacts to dark mode correctly.
                */}
                <div className="bg-white dark:bg-neutral-900 h-full rounded-t-[30px] transition-colors duration-300 flex flex-col pt-1 pb-safe-bottom">
                    {/* Handle / Header Area */}
                    <div
                        className="flex-none h-[90px] flex items-center justify-center cursor-pointer relative"
                        onClick={() => setOpen(!open)}
                    >
                        {/* Drag Handle Indicator */}
                        <div className="absolute top-3 w-12 h-1.5 bg-gray-300 dark:bg-neutral-600 rounded-full transition-colors duration-300" />

                        {/* Content changes based on open state */}
                        {!open && (
                            <div className="flex flex-col items-center mt-5 text-indigo-600 dark:text-white transition-colors duration-300 animate-bounce-slow">
                                <ChevronUp size={24} strokeWidth={2.5} />
                                <span className="text-sm font-bold mt-1">{triggerText}</span>
                            </div>
                        )}

                        {open && (
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white mt-4 transition-colors duration-300">
                                {title}
                            </h3>
                        )}
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 pt-2 pb-10 text-slate-900 dark:text-gray-100 bg-white dark:bg-neutral-900"
                        style={{ maxHeight: '80vh' }}>
                        {/* Explicit max-height might be needed if the sheet expands infinitely, but the library usually handles viewport height */}
                        {children}
                    </div>
                </div>
            </SwipeableBottomSheet>
        </>
    );
};

export default BottomSheet;
