import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageViewerProps {
    isOpen: boolean;
    onClose: (e?: React.MouseEvent) => void;
    images: string[];
    initialIndex?: number;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ isOpen, onClose, images, initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
        }
    }, [isOpen, initialIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!isOpen) return null;

    const showNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const showPrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
            >
                <X size={24} />
            </button>

            {/* Image Container */}
            <div className="relative max-w-full max-h-[90vh] flex items-center justify-center group" onClick={(e) => e.stopPropagation()}>
                <img
                    src={images[currentIndex]}
                    alt={`View ${currentIndex + 1}`}
                    className="max-w-full max-h-[90vh] object-contain shadow-2xl animate-in zoom-in-95 duration-300 select-none"
                />

                {/* Navigation Buttons (Overlay on Image) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={showPrev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 text-white/70 hover:bg-black/40 hover:text-white backdrop-blur-sm transition-all active:scale-95 opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button
                            onClick={showNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 text-white/70 hover:bg-black/40 hover:text-white backdrop-blur-sm transition-all active:scale-95 opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight size={32} />
                        </button>

                        {/* Counter (Overlay on Image Bottom) */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/40 text-white/90 text-xs font-medium backdrop-blur-sm border border-white/10">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageViewer;
