"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSlide {
    id: string;
    title: string;
    description?: string | null;
    image: string;
    isActive: boolean;
}

export const HeroSlider = ({ initialData }: { initialData?: HeroSlide[] }) => {
    const [slides, setSlides] = useState<HeroSlide[]>(initialData || []);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (!initialData || initialData.length === 0) {
            fetch('/api/hero-content')
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setSlides(data.filter(s => s.isActive));
                })
                .catch(console.error);
        }
    }, [initialData]);

    const displaySlides = slides.filter(s => s.isActive);

    const nextSlide = useCallback(() => {
        if (isAnimating || displaySlides.length <= 1) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating, displaySlides]);

    const prevSlide = useCallback(() => {
        if (isAnimating || displaySlides.length <= 1) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating, displaySlides]);

    useEffect(() => {
        if (displaySlides.length <= 1) return;
        const timer = setInterval(nextSlide, 8000);
        return () => clearInterval(timer);
    }, [nextSlide, displaySlides]);

    if (!displaySlides.length) return null;

    return (
        <section className="w-full bg-black pt-28 md:pt-32">
            {/* Top Content: Centered Title and Description */}
            <div className="max-w-7xl mx-auto px-6 text-center pb-12">
                <div className="relative flex items-center justify-center">
                    {displaySlides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={cn(
                                "flex flex-col items-center uppercase justify-center transition-all duration-700 ease-in-out",
                                index === currentSlide ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none absolute inset-0"
                            )}
                        >
                            <h1 className="text-xs sm:text-sm md:text-lg font-rethink text-white tracking-widest leading-none">
                                {slide.title}
                            </h1>
                            {slide.description && (
                                <p className="text-zinc-400 text-[26px] md:text-5xl text-gold font-sans max-w-2xl mx-auto font-normal leading-relaxed tracking-wide">
                                    {slide.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Image: Whole width with specific aspect ratios */}
            <div className="relative w-full overflow-hidden group">
                <div className="relative aspect-[7/3] md:aspect-[7/2] w-full">
                    {displaySlides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={cn(
                                " transition-opacity duration-1000 ease-in-out",
                                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                            )}
                        >
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover object-center"
                                priority={index === 0}
                            />
                        </div>
                    ))}

                    {/* Navigation Buttons on Top of Image */}
                    {displaySlides.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-4 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-4 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};
