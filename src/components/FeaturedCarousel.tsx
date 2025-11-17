"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Mockup {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string;
  categories?: string[];
  isEditable: boolean;
  downloadUrl?: string;
}

interface FeaturedCarouselProps {
  mockups: Mockup[];
}

export default function FeaturedCarousel({ mockups }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const x = useMotionValue(0);

  // Set up container width and handle resizing
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate item width (show 3.5 items to reveal partial next item)
  const itemsToShow = 3.5;
  const gap = 16; // 1rem gap
  const itemWidth = (containerWidth - (itemsToShow - 1) * gap) / itemsToShow;
  const totalWidth = mockups.length * (itemWidth + gap) - gap;

  // Calculate max index to ensure last item is fully visible
  const maxIndex = Math.max(0, mockups.length - itemsToShow);

  // Handle drag end to snap to nearest item
  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const sensitivity = containerWidth / 4;

    if (velocity > 500 || offset > sensitivity) {
      prevItem();
    } else if (velocity < -500 || offset < -sensitivity) {
      nextItem();
    } else {
      // Snap back to current item
      x.set(-currentIndex * (itemWidth + gap));
    }
  };

  const nextItem = () => {
    if (currentIndex >= maxIndex) {
      // If we're at or beyond max index, circle back to start
      setCurrentIndex(0);
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    }
  };

  const prevItem = () => {
    if (currentIndex <= 0) {
      // If we're at start, circle back to max index
      setCurrentIndex(maxIndex);
    } else {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  // Calculate drag constraints
  const dragConstraints = {
    left: -totalWidth + containerWidth,
    right: 0,
  };

  // Only show carousel if we have mockups
  if (mockups.length === 0) return null;

  return (
    <div ref={containerRef} className="relative overflow-hidden px-4">
      {/* Navigation buttons */}
      {mockups.length > itemsToShow && (
        <>
          <button
            onClick={prevItem}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
            aria-label="Previous mockup"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextItem}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-colors"
            aria-label="Next mockup"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Carousel track */}
      <motion.div
        drag="x"
        dragControls={dragControls}
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: -currentIndex * (itemWidth + gap) }}
        transition={{ type: "spring", damping: 25, stiffness: 150 }}
        className="flex cursor-grab active:cursor-grabbing"
        style={{ width: `${totalWidth}px` }}
      >
        {mockups.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex-shrink-0 group rounded-xl overflow-hidden bg-neutral-100/70 backdrop-blur-sm border border-neutral-200 relative"
            style={{
              width: `${itemWidth}px`,
              marginRight: index === mockups.length - 1 ? 0 : `${gap}px`,
            }}
          >
            <Link
              href={`${item.isEditable ? "/editor/" : "/mockups/"}${item.slug}`}
            >
              <div className="relative w-full aspect-[4/3.5] md:aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 scale-110 group-hover:scale-125"
                  quality={80}
                  priority={index === 0}
                  unoptimized
                />
              </div>
              <div className="px-3 py-5">
                <h3
                  className="truncate text-sm text-black uppercase mb-0 font-medium"
                  title={item.title}
                >
                  {item.title?.split(" ").slice(0, 6).join(" ")}
                  {item.title?.split(" ").length > 6 && " ..."}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Page indicators */}
      {mockups.length > 1 && (
        <div className="flex justify-center items-center space-x-3 mt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <button
              key={`indicator-${index}`}
              onClick={() => setCurrentIndex(index)}
              className="flex flex-col items-center space-y-2 group"
            >
              <div
                className={`relative transition-all duration-500 ${
                  currentIndex === index
                    ? "w-8 h-2 bg-primary rounded-full"
                    : "w-2 h-2 bg-gray-300 rounded-full group-hover:bg-gray-400"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
