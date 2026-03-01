"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/stores/cart.store";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";

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
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith("/admin");

    if (isAdminPage) return null;

    const cartCount = useCartStore((state) => state.totalItems());

    const handleWhatsAppClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP || "";
        const message = "Hi there! I'm interested in exploring your jewelry collections.";
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500">
            <nav
                className={cn(
                    "flex items-center py-4 h-20 bg-black justify-between w-full px-6 md:px-12 transition-all duration-500",
                )}
            >
                {/* Logo - Left */}
                <Link href="/" className="flex flex-col -space-y-1 group">
                    <span className="text-2xl font-medium font-rethink text-gold tracking-wider transition-transform group-hover:scale-105">
                        IMIJEWEL
                    </span>
                    <span className="text-[8px] md:text-[10px] font-sans font-medium tracking-[0.2em] text-gold/80 uppercase">
                        Premium Collections
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
                    <Link href="/shop" className="hover:text-gold transition-colors">
                        <Search className="w-5 h-5 stroke-[1.5]" />
                    </Link>


                    <Link href="/cart" className="hover:text-gold transition-colors relative">
                        <ShoppingCart className="w-5 h-5 stroke-[1.5]" />
                        {mounted && cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gold text-black text-[8px] font-black rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <button onClick={handleWhatsAppClick} className="hover:text-gold transition-colors relative" title="Inquire on WhatsApp">
                        <WhatsAppIcon className="w-5 h-5 stroke-[1.5]" />
                    </button>

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
                    "fixed inset-0 bg-black/98 backdrop-blur-3xl z-[51] transition-all duration-700 md:hidden",
                    isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
                )}
            >
                {/* Mobile Menu Header - Aligned with main Nav */}
                <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
                    <Link href="/" className="flex flex-col -space-y-1" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="text-2xl font-medium font-rethink text-gold tracking-wider">
                            IMIJEWEL
                        </span>
                        <span className="text-[8px] font-sans font-medium tracking-[0.2em] text-gold/80 uppercase">
                            Premium Collections
                        </span>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/70 hover:text-gold transition-colors p-2 -mr-2">
                        <X className="w-6 h-6 stroke-[1.5]" />
                    </button>
                </div>

                <div className="flex flex-col h-[calc(100%-5rem)] justify-center p-8">
                    <div className="flex flex-col gap-10">
                        {navItems.map((item, i) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "text-xs font-bold uppercase tracking-[0.3em] transition-all duration-500",
                                        isActive ? "text-gold translate-x-2" : "text-white/60 hover:text-gold hover:translate-x-2"
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    style={{
                                        transitionDelay: `${i * 40}ms`,
                                        transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                                        opacity: isMobileMenuOpen ? 1 : 0
                                    }}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-20 pt-10 border-t border-white/5 flex flex-col gap-6">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Connect With Us</p>
                        <button
                            onClick={handleWhatsAppClick}
                            className="flex items-center gap-4 text-white/70 hover:text-gold transition-colors group"
                        >
                            <WhatsAppIcon className="w-5 h-5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest pt-0.5">WhatsApp Inquiry</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
