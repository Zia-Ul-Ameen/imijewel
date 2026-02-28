"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Heart, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "All Jewellery", href: "/shop" },
    { name: "Gold", href: "/shop/gold" },
    { name: "Diamonds", href: "/shop/diamonds" },
    { name: "Earrings", href: "/shop/earrings" },
    { name: "Rings", href: "/shop/rings" },
];

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    const cartCount = useCartStore((state) => state.totalItems());
    const wishlistCount = useWishlistStore((state) => state.wishlist.length);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500">
            <nav
                className={cn(
                    "flex items-center justify-between w-full px-6 md:px-12 h-24 transition-all duration-500",
                    isScrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-4 h-20" : "bg-transparent py-6"
                )}
            >
                {/* Logo - Left */}
                <Link
                    href="/"
                    className="flex flex-col -space-y-1 group"
                >
                    <span className="text-2xl font-rethink text-gold tracking-wider transition-transform group-hover:scale-105">
                        IMIJEWEL
                    </span>
                </Link>

                {/* Desktop Navigation - Center */}
                <div className="hidden lg:flex items-center gap-10">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:text-gold",
                                    isActive ? "text-gold" : "text-white/60"
                                )}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Icons - Right */}
                <div className="flex items-center gap-6 md:gap-8 text-white/70">
                    <Link href="/search" className="hover:text-gold transition-colors">
                        <Search className="w-5 h-5 stroke-[1.5]" />
                    </Link>

                    <Link href="/account" className="hidden sm:block hover:text-gold transition-colors">
                        <svg className="w-5 h-5 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </Link>

                    <Link href="/wishlist" className="hover:text-gold transition-colors relative">
                        <Heart className={cn("w-5 h-5 stroke-[1.5]", wishlistCount > 0 ? "fill-gold text-gold" : "")} />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full" />
                        )}
                    </Link>

                    <Link href="/cart" className="hover:text-gold transition-colors relative">
                        <ShoppingCart className="w-5 h-5 stroke-[1.5]" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gold text-black text-[8px] font-black rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden text-white hover:text-gold transition-transform active:scale-90"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu refined for Gold Superior */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/95 backdrop-blur-2xl z-[51] transition-all duration-700 md:hidden",
                    isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
                )}
            >
                <div className="flex flex-col h-full p-12">
                    <div className="flex justify-between items-center mb-16">
                        <Link href="/" className="flex flex-col -space-y-1" onClick={() => setIsMobileMenuOpen(false)}>
                            <span className="text-3xl font-serif italic text-gold">Imi</span>
                            <span className="text-xs font-bold uppercase tracking-[0.4em] text-white/50">Jewellery</span>
                        </Link>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                            <X className="w-8 h-8" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-8">
                        {navItems.map((item, i) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-3xl font-serif text-white hover:text-gold transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{ transitionDelay: `${i * 50}ms` }}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
};
