"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSlide {
    id: string;
    title: string;
    description?: string | null;
    image: string;
    brandName?: string | null;
    exploreLink?: string | null;
    isActive: boolean;
    order: number;
}

const FALLBACK_SLIDES: HeroSlide[] = [
    {
        id: "fallback-1",
        title: "Superior Gold Artistry",
        description: "Discover the pinnacle of elegance with our handcrafted gold imitation sets, designed to illuminate your most precious moments.",
        image: "/hero-1.png",
        isActive: true,
        order: 0
    },
    {
        id: "fallback-2",
        title: "Timed Elegance Sets",
        description: "Exquisite diamond-cut collections for the modern woman who values the weight of tradition and the sparkle of luxury.",
        image: "/hero-2.png",
        isActive: true,
        order: 1
    }
];

export const HeroSlider = ({ initialData }: { initialData?: HeroSlide[] }) => {
    const router = useRouter();
    const [slides, setSlides] = useState<HeroSlide[]>(initialData && initialData.length > 0 ? initialData : FALLBACK_SLIDES);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Client-side refresh if initialData is empty
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
        setTimeout(() => setIsAnimating(false), 1200);
    }, [isAnimating, displaySlides]);

    const prevSlide = useCallback(() => {
        if (isAnimating || displaySlides.length <= 1) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
        setTimeout(() => setIsAnimating(false), 1200);
    }, [isAnimating, displaySlides]);

    useEffect(() => {
        if (displaySlides.length <= 1) return;
        const timer = setInterval(nextSlide, 10000);
        return () => clearInterval(timer);
    }, [nextSlide, displaySlides]);

    if (!displaySlides.length) {
        return (
            <div className="pt-24 pb-12 w-full h-[90vh] flex flex-col items-center justify-center bg-black text-center px-6">
                <div className="space-y-8 max-w-4xl animate-in fade-in zoom-in duration-1000">
                    <div className="space-y-2">
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-gold">
                            Giving You A New Style
                        </span>
                        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-serif italic text-white leading-none">
                            Imi <span className="text-gold">Jewel</span>
                        </h1>
                    </div>
                    <p className="text-zinc-500 text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto">
                        Discover our superior collection of gold and diamond imitation jewellery.
                        Crafted for the modern woman who values timeless elegance.
                    </p>
                    <button
                        onClick={() => router.push('/shop')}
                        className="px-12 py-5 border border-gold/30 hover:border-gold hover:bg-gold hover:text-black text-gold rounded-full font-bold transition-all transform hover:scale-105 active:scale-95"
                    >
                        Explore Gold Collection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black group/slider">
            {/* Background Slides with Ken Burns and Moody Overlays */}
            {displaySlides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={cn(
                        "absolute inset-0 transition-all duration-[2000ms] cubic-bezier(0.4, 0, 0.2, 1)",
                        index === currentSlide ? "opacity-100 z-10 visible" : "opacity-0 z-0 invisible"
                    )}
                >
                    <div className={cn(
                        "absolute inset-0 transition-transform duration-[12000ms] linear",
                        index === currentSlide ? "scale-110" : "scale-100"
                    )}>
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover object-center brightness-[0.6]"
                            priority={index === 0}
                        />
                    </div>
                    {/* Deep moody black gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
                </div>
            ))}

            {/* Centered Content Layer */}
            <div className="relative z-20 h-full flex items-center justify-center text-center px-6">
                {displaySlides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={cn(
                            "absolute max-w-5xl transition-all duration-1000",
                            index === currentSlide ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-10 invisible"
                        )}
                    >
                        <div className="space-y-6 md:space-y-10">
                            <div className="space-y-3 md:space-y-4">
                                <span className="block text-[10px] md:text-xs font-black tracking-[0.6em] text-gold uppercase animate-in slide-in-from-top duration-1000 delay-300">
                                    Giving You A New Style
                                </span>
                                <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-serif text-white tracking-tighter leading-[0.8] animate-in fade-in zoom-in duration-1000 delay-100">
                                    {slide.title.split(' ').map((word, i) => (
                                        <span key={i} className={cn("inline-block mr-[0.2em]", i % 2 !== 0 ? "text-gold italic" : "")}>
                                            {word}
                                        </span>
                                    ))}
                                </h1>
                            </div>

                            {slide.description && (
                                <p className="text-zinc-400 text-sm md:text-lg max-w-xl mx-auto font-medium leading-relaxed tracking-wide animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
                                    {slide.description}
                                </p>
                            )}

                            <div className="pt-4 flex flex-col md:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-700">
                                <button
                                    onClick={() => router.push('/shop')}
                                    className="group relative px-12 py-5 bg-gold text-black rounded-full text-xs font-black uppercase tracking-widest transition-all hover:scale-110 active:scale-95 shadow-[0_0_40px_rgba(212,175,55,0.3)]"
                                >
                                    <span>Shop the Gold</span>
                                </button>

                                <button
                                    onClick={() => router.push(slide.exploreLink || '/shop')}
                                    className="text-white/60 hover:text-gold text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3"
                                >
                                    <span>Discover Story</span>
                                    <div className="w-8 h-[1px] bg-white/20 group-hover:bg-gold transition-all" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Minimalist Slide Navigation */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-12">
                <button
                    onClick={prevSlide}
                    className="text-white/30 hover:text-gold transition-colors"
                >
                    <ChevronLeft className="w-8 h-8 stroke-[1]" />
                </button>

                <div className="flex gap-4">
                    {displaySlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (!isAnimating) {
                                    setIsAnimating(true);
                                    setCurrentSlide(index);
                                    setTimeout(() => setIsAnimating(false), 1200);
                                }
                            }}
                            className={cn(
                                "w-1 h-1 rounded-full transition-all duration-500",
                                index === currentSlide ? "bg-gold scale-[3] shadow-[0_0_10px_#D4AF37]" : "bg-white/20 hover:bg-white/50"
                            )}
                        />
                    ))}
                </div>

                <button
                    onClick={nextSlide}
                    className="text-white/30 hover:text-gold transition-colors"
                >
                    <ChevronRight className="w-8 h-8 stroke-[1]" />
                </button>
            </div>

            {/* Background Texture/Grain for extra premium feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
        </section>
    );
};
