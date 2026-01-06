import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
    images: string[];
    aspectRatio?: 'square' | 'video' | 'portrait';
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, aspectRatio = 'portrait' }) => {
    const [page, setPage] = useState(0);

    // If no images, return null
    if (!images || images.length === 0) return null;

    // If only one image, simply show it (but maintain the premium style)
    if (images.length === 1) {
        return (
            <div className={`relative w-full overflow-hidden rounded-2xl bg-gray-100 ${aspectRatio === 'square' ? 'aspect-square' : aspectRatio === 'video' ? 'aspect-video' : 'aspect-[3/4]'}`}>
                {/* Blurred Background for Fill */}
                <div
                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110"
                    style={{ backgroundImage: `url(${images[0]})` }}
                />
                <img
                    src={images[0]}
                    alt="Profile"
                    className="relative w-full h-full object-contain z-10"
                />
            </div>
        );
    }

    const paginate = (newDirection: number) => {
        let newPage = page + newDirection;
        if (newPage < 0) newPage = images.length - 1;
        if (newPage >= images.length) newPage = 0;
        setPage(newPage);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    return (
        <div className={`relative w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm border border-black/5 ${aspectRatio === 'square' ? 'aspect-square' : aspectRatio === 'video' ? 'aspect-video' : 'aspect-[3/4]'}`}>
            <AnimatePresence initial={false} custom={1}>
                <motion.div
                    key={page}
                    custom={1}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(_, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                >
                    {/* Blurred Background for Fill */}
                    <div
                        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-125"
                        style={{ backgroundImage: `url(${images[page]})` }}
                    />
                    {/* Main Image */}
                    <img
                        src={images[page]}
                        alt={`Profile ${page + 1}`}
                        className="relative w-full h-full object-contain z-10 select-none pointer-events-none"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows (Desktop hover friendly) */}
            <button
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg backdrop-blur-sm text-gray-800 transition-all opacity-0 hover:opacity-100 group-hover:opacity-100 focus:opacity-100 active:scale-95"
                onClick={(e) => { e.stopPropagation(); paginate(-1); }}
            >
                <ChevronLeft size={20} />
            </button>
            <button
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg backdrop-blur-sm text-gray-800 transition-all opacity-0 hover:opacity-100 group-hover:opacity-100 focus:opacity-100 active:scale-95"
                onClick={(e) => { e.stopPropagation(); paginate(1); }}
            >
                <ChevronRight size={20} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-1.5">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setPage(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === page
                            ? 'bg-white w-4'
                            : 'bg-white/50 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>

            {/* Page Count Overlay (Optional, useful for many images) */}
            <div className="absolute top-3 right-3 z-20 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-medium tracking-wide">
                {page + 1} / {images.length}
            </div>
        </div>
    );
};

export default ImageCarousel;
